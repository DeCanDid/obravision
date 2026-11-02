import { site, whatsappLink } from "@/lib/site";
import { formatNaira } from "@/lib/product-utils";
import { toWhatsAppNumber } from "@/lib/phone";

export type OrderEmailInput = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress: string | null;
  notes: string | null;
  items: { product_name: string; variant_label?: string | null; quantity: number; unit_price: number; line_total: number; is_wholesale: boolean }[];
  subtotal: number;
  totalUnits: number;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const itemName = (i: { product_name: string; variant_label?: string | null }) =>
  i.variant_label ? `${i.product_name} (${i.variant_label})` : i.product_name;

export async function sendOrderEmail(o: OrderEmailInput) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const to = process.env.OWNER_EMAIL;
  if (!apiKey || !domain || !to) throw new Error("Mailgun environment variables are missing");

  const base = process.env.MAILGUN_API_URL ?? "https://api.mailgun.net";
  const from = process.env.MAILGUN_FROM || `${site.name} Orders <postmaster@${domain}>`;

  const delivery =
    o.deliveryMethod === "pickup" ? "Pick up in store" : `Delivery: ${o.deliveryAddress ?? ""}`;
  const chatLink = `https://wa.me/${toWhatsAppNumber(o.customerPhone)}?text=${encodeURIComponent(
    `Hello ${o.customerName}, this is ${site.name}. We received your order ${o.orderNumber}.`
  )}`;

  const text = [
    `New order ${o.orderNumber}`,
    "",
    `Customer: ${o.customerName}`,
    `Phone / WhatsApp: ${o.customerPhone}`,
    `Email: ${o.customerEmail}`,
    delivery,
    o.notes ? `Notes: ${o.notes}` : "",
    "",
    "Items:",
    ...o.items.map(
      (i) =>
        `- ${itemName(i)} x ${i.quantity} @ ${formatNaira(i.unit_price)} = ${formatNaira(i.line_total)}${
          i.is_wholesale ? " (wholesale)" : ""
        }`
    ),
    "",
    `Total units: ${o.totalUnits}`,
    `Subtotal: ${formatNaira(o.subtotal)}`,
    "",
    `Chat with the customer on WhatsApp: ${chatLink}`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  const cell = "padding:10px 8px;border-bottom:1px solid #e5e9f2;";
  const rows = o.items
    .map(
      (i) => `<tr>
        <td style="${cell}">${esc(itemName(i))}${
          i.is_wholesale ? ' <span style="color:#e89a0c;font-weight:600">(wholesale)</span>' : ""
        }</td>
        <td style="${cell}text-align:center">${i.quantity}</td>
        <td style="${cell}text-align:right">${formatNaira(i.unit_price)}</td>
        <td style="${cell}text-align:right;font-weight:600">${formatNaira(i.line_total)}</td>
      </tr>`
    )
    .join("");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;background:#f3f7ff;padding:24px">
    <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #dfe6f5">
      <div style="background:#0a1633;color:#fff;padding:24px">
        <p style="margin:0;font-size:12px;letter-spacing:2px;color:#ffb627;text-transform:uppercase">New order received</p>
        <h1 style="margin:8px 0 0;font-size:22px">${esc(o.orderNumber)}</h1>
      </div>
      <div style="padding:24px;color:#0a1633;font-size:14px;line-height:1.6">
        <p style="margin:0 0 4px"><strong>${esc(o.customerName)}</strong> has placed an order on your website.</p>
        <p style="margin:0">Phone / WhatsApp: <strong>${esc(o.customerPhone)}</strong><br>
        Email: ${esc(o.customerEmail)}<br>
        ${esc(delivery)}</p>
        ${o.notes ? `<p style="margin:12px 0 0;padding:12px;background:#f3f7ff;border-radius:8px"><strong>Notes:</strong> ${esc(o.notes)}</p>` : ""}
        <table style="width:100%;border-collapse:collapse;margin-top:20px;font-size:14px">
          <thead><tr style="text-align:left;color:#5b6784;font-size:12px">
            <th style="padding:8px 8px 8px 0">Laptop</th><th style="text-align:center">Qty</th>
            <th style="text-align:right">Unit price</th><th style="text-align:right;padding-right:0">Total</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="text-align:right;margin:16px 0 0;font-size:16px">${o.totalUnits} units &middot; Subtotal <strong>${formatNaira(o.subtotal)}</strong></p>
        <p style="margin:24px 0 0"><a href="${chatLink}" style="display:inline-block;background:#1faa59;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px">Chat with the customer on WhatsApp</a></p>
        <p style="margin:20px 0 0;font-size:12px;color:#5b6784">The customer will pay and send a receipt to ${esc(site.phone.display)} on WhatsApp.</p>
      </div>
    </div>
  </div>`;

  const form = new URLSearchParams();
  form.set("from", from);
  form.set("to", to);
  form.set("subject", `New order ${o.orderNumber} - ${formatNaira(o.subtotal)} (${o.totalUnits} units)`);
  form.set("text", text);
  form.set("html", html);
  form.set("h:Reply-To", o.customerEmail);
  form.set("o:tracking", "no");

  const res = await fetch(`${base}/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

  if (!res.ok) throw new Error(`Mailgun ${res.status}: ${await res.text()}`);
}

export async function sendContactEmail(m: {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const to = process.env.OWNER_EMAIL;
  if (!apiKey || !domain || !to) throw new Error("Mailgun environment variables are missing");

  const base = process.env.MAILGUN_API_URL ?? "https://api.mailgun.net";
  const from = process.env.MAILGUN_FROM || `${site.name} Website <postmaster@${domain}>`;

  const text = [
    `New website enquiry: ${m.subject}`,
    "",
    `Name: ${m.name}`,
    `Email: ${m.email}`,
    m.phone ? `Phone / WhatsApp: ${m.phone}` : "",
    "",
    "Message:",
    m.message,
  ]
    .filter((l, i) => l !== "" || i === 1 || i === 5)
    .join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;background:#f3f7ff;padding:24px">
    <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #dfe6f5">
      <div style="background:#0a1633;color:#fff;padding:24px">
        <p style="margin:0;font-size:12px;letter-spacing:2px;color:#ffb627;text-transform:uppercase">Website enquiry</p>
        <h1 style="margin:8px 0 0;font-size:20px">${esc(m.subject)}</h1>
      </div>
      <div style="padding:24px;color:#0a1633;font-size:14px;line-height:1.6">
        <p style="margin:0"><strong>${esc(m.name)}</strong><br>
        Email: ${esc(m.email)}${m.phone ? `<br>Phone / WhatsApp: ${esc(m.phone)}` : ""}</p>
        <p style="margin:16px 0 0;padding:16px;background:#f3f7ff;border-radius:8px;white-space:pre-wrap">${esc(m.message)}</p>
        <p style="margin:20px 0 0;font-size:12px;color:#5b6784">Press Reply to answer ${esc(m.name)} directly.</p>
      </div>
    </div>
  </div>`;

  const form = new URLSearchParams();
  form.set("from", from);
  form.set("to", to);
  form.set("subject", `Website enquiry: ${m.subject} (${m.name})`);
  form.set("text", text);
  form.set("html", html);
  form.set("h:Reply-To", m.email);
  form.set("o:tracking", "no");

  const res = await fetch(`${base}/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

  if (!res.ok) throw new Error(`Mailgun ${res.status}: ${await res.text()}`);
}

export async function sendCustomerOrderEmail(o: OrderEmailInput) {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) throw new Error("Mailgun environment variables are missing");

  const base = process.env.MAILGUN_API_URL ?? "https://api.mailgun.net";
  const from = process.env.MAILGUN_FROM || `${site.name} <postmaster@${domain}>`;
  const chatLink = whatsappLink(`Hello ${site.name}, I have placed order ${o.orderNumber}.`);
  const firstName = o.customerName.split(" ")[0];
  const hasBank = Boolean(site.payment.accountNumber);

  const bankText = hasBank
    ? [
        "",
        "Payment details:",
        `Bank: ${site.payment.bankName}`,
        `Account name: ${site.payment.accountName}`,
        `Account number: ${site.payment.accountNumber}`,
        `Amount: ${formatNaira(o.subtotal)}`,
      ]
    : [];

  const text = [
    `Hello ${firstName},`,
    "",
    `Thank you for your order with ${site.name}. We have received it and will contact you shortly to confirm availability.`,
    "",
    `Order number: ${o.orderNumber}`,
    "",
    "Your items:",
    ...o.items.map(
      (i) => `- ${itemName(i)} x ${i.quantity} = ${formatNaira(i.line_total)}${i.is_wholesale ? " (wholesale)" : ""}`
    ),
    "",
    `Total: ${formatNaira(o.subtotal)}`,
    o.deliveryMethod === "pickup" ? "Pick-up: in store" : `Delivery to: ${o.deliveryAddress ?? ""}`,
    ...bankText,
    "",
    "Next steps:",
    "1. We will confirm your order and share payment details on WhatsApp.",
    "2. Make your payment.",
    "3. Send your payment receipt to us on WhatsApp.",
    "",
    `WhatsApp: ${site.phone.display} (${chatLink})`,
    `Phone: ${site.phone.display}`,
    `Email: ${site.email}`,
  ].join("\n");

  const cell = "padding:10px 8px;border-bottom:1px solid #e5e9f2;";
  const rows = o.items
    .map(
      (i) => `<tr>
        <td style="${cell}">${esc(itemName(i))}${
          i.is_wholesale ? ' <span style="color:#e89a0c;font-weight:600">(wholesale)</span>' : ""
        }</td>
        <td style="${cell}text-align:center">${i.quantity}</td>
        <td style="${cell}text-align:right;font-weight:600">${formatNaira(i.line_total)}</td>
      </tr>`
    )
    .join("");

  const bankHtml = hasBank
    ? `<div style="margin-top:20px;padding:16px;background:#f3f7ff;border-radius:12px">
        <p style="margin:0 0 6px;font-weight:bold">Payment details</p>
        <p style="margin:0">Bank: ${esc(site.payment.bankName)}<br>
        Account name: ${esc(site.payment.accountName)}<br>
        Account number: <strong>${esc(site.payment.accountNumber)}</strong><br>
        Amount: <strong>${formatNaira(o.subtotal)}</strong></p>
      </div>`
    : "";

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;background:#f3f7ff;padding:24px">
    <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #dfe6f5">
      <div style="background:#0a1633;color:#fff;padding:24px">
        <p style="margin:0;font-size:12px;letter-spacing:2px;color:#ffb627;text-transform:uppercase">${esc(site.name)}</p>
        <h1 style="margin:8px 0 0;font-size:22px">We received your order</h1>
      </div>
      <div style="padding:24px;color:#0a1633;font-size:14px;line-height:1.6">
        <p style="margin:0">Hello ${esc(firstName)},</p>
        <p style="margin:8px 0 0">Thank you for your order. We will contact you shortly to confirm availability.</p>
        <p style="margin:16px 0 0;padding:12px 16px;background:#f3f7ff;border-radius:10px">Order number: <strong>${esc(o.orderNumber)}</strong></p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px">
          <thead><tr style="text-align:left;color:#5b6784;font-size:12px">
            <th style="padding:8px 8px 8px 0">Laptop</th><th style="text-align:center">Qty</th><th style="text-align:right">Total</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="text-align:right;margin:14px 0 0;font-size:16px">Total <strong>${formatNaira(o.subtotal)}</strong></p>
        <p style="margin:6px 0 0;color:#5b6784">${
          o.deliveryMethod === "pickup" ? "Pick-up in store" : `Delivery to: ${esc(o.deliveryAddress ?? "")}`
        }</p>
        ${bankHtml}
        <p style="margin:24px 0 6px;font-weight:bold">What happens next</p>
        <ol style="margin:0;padding-left:20px">
          <li>We confirm your order and share payment details on WhatsApp.</li>
          <li>You make your payment.</li>
          <li>You send your payment receipt to us on WhatsApp.</li>
        </ol>
        <p style="margin:24px 0 0"><a href="${chatLink}" style="display:inline-block;background:#1faa59;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px">Message us on WhatsApp</a></p>
        <p style="margin:20px 0 0;font-size:12px;color:#5b6784">${esc(site.name)} &middot; ${esc(site.phone.display)} &middot; ${esc(site.email)}</p>
      </div>
    </div>
  </div>`;

  const form = new URLSearchParams();
  form.set("from", from);
  form.set("to", o.customerEmail);
  form.set("subject", `We received your order ${o.orderNumber}`);
  form.set("text", text);
  form.set("html", html);
  form.set("h:Reply-To", site.email);
  form.set("o:tracking", "no");

  const res = await fetch(`${base}/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

  if (!res.ok) throw new Error(`Mailgun ${res.status}: ${await res.text()}`);
}