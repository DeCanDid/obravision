import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findVariant, isWholesaleQty, unitPrice, variantLabel, type Product } from "@/lib/product-utils";
import { generateOrderNumber } from "@/lib/order-number";
import { isValidPhone } from "@/lib/phone";
import { sendOrderEmail } from "@/lib/mailgun";

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  // 1. Who is ordering?
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return fail("Please sign in to place an order.", 401);

  // 2. Validate the form
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.");
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const deliveryMethod = body.deliveryMethod === "delivery" ? "delivery" : "pickup";
  const address = String(body.address ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  if (name.length < 2 || name.length > 80) return fail("Please enter your full name.");
  if (!isValidPhone(phone)) return fail("Please enter a valid phone or WhatsApp number.");
  if (deliveryMethod === "delivery" && address.length < 8) return fail("Please enter your full delivery address.");
  if (notes.length > 500) return fail("Your note is too long. Please keep it under 500 characters.");

    // 3. Rebuild the order from the saved cart, so prices cannot be tampered with
  const { data: rows, error: cartError } = await supabase
    .from("cart_items")
    .select("quantity, variant_id, product:products(*)")
    .eq("user_id", user.id);

  if (cartError) return fail("We could not read your cart. Please try again.", 500);

  const lines = ((rows ?? []) as unknown as { quantity: number; variant_id: string; product: Product | null }[])
    .filter((r) => r.product)
    .map((r) => ({
      product: r.product as Product,
      quantity: r.quantity,
      variantId: r.variant_id,
      variant: findVariant(r.product as Product, r.variant_id),
    }));

  if (lines.length === 0) return fail("Your cart is empty.");

  const missing = lines.find((l) => l.variantId && !l.variant);
  if (missing) {
    return fail(
      `A configuration of "${missing.product.name}" is no longer available. Please remove it from your cart and try again.`,
      409
    );
  }

  const soldOut = lines.find((l) => (l.variant ? l.variant.stock : l.product.stock) <= 0);
  if (soldOut) {
    return fail(`"${soldOut.product.name}" is now out of stock. Please remove it from your cart and try again.`, 409);
  }

  const items = lines.map(({ product, quantity, variant }) => {
    const unit = unitPrice(product, quantity, variant);
    return {
      product_id: product.id,
      product_name: product.name,
      variant_id: variant?.id ?? null,
      variant_label: variant ? variantLabel(variant) : null,
      brand: product.brand,
      image: product.images[0] ?? null,
      unit_price: unit,
      quantity,
      line_total: unit * quantity,
      is_wholesale: isWholesaleQty(product, quantity, variant),
    };
  });
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  const totalUnits = items.reduce((s, i) => s + i.quantity, 0);

  // 4. Save the order (service role key bypasses row-level security)
  const admin = createAdminClient();
  const orderRow = {
    user_id: user.id,
    customer_name: name,
    customer_email: user.email,
    customer_phone: phone,
    delivery_method: deliveryMethod,
    delivery_address: deliveryMethod === "delivery" ? address : null,
    notes: notes || null,
    total_units: totalUnits,
    subtotal,
  };

  let order: { id: string; order_number: string } | null = null;
  for (let attempt = 0; attempt < 4 && !order; attempt++) {
    const { data, error } = await admin
      .from("orders")
      .insert({ ...orderRow, order_number: generateOrderNumber() })
      .select("id, order_number")
      .single();

    if (!error) order = data;
    else if (error.code !== "23505") {
      console.error("create order:", error.message);
      return fail("We could not place your order. Please try again.", 500);
    }
  }
  if (!order) return fail("We could not place your order. Please try again.", 500);

  const { error: itemsError } = await admin
    .from("order_items")
    .insert(items.map((i) => ({ ...i, order_id: order!.id })));

  if (itemsError) {
    console.error("create order items:", itemsError.message);
    await admin.from("orders").delete().eq("id", order.id);
    return fail("We could not place your order. Please try again.", 500);
  }

  // 5. Empty the cart
  await supabase.from("cart_items").delete().eq("user_id", user.id);

  // 6. Email the shop owner (a failed email never loses the order)
  let notified = false;
  try {
    await sendOrderEmail({
      orderNumber: order.order_number,
      customerName: name,
      customerEmail: user.email,
      customerPhone: phone,
      deliveryMethod,
      deliveryAddress: deliveryMethod === "delivery" ? address : null,
      notes: notes || null,
      items,
      subtotal,
      totalUnits,
    });
    notified = true;
    await admin.from("orders").update({ owner_notified: true }).eq("id", order.id);
  } catch (err) {
    console.error("Mailgun:", err);
  }

  return NextResponse.json({ orderNumber: order.order_number, notified });
}