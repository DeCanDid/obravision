"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { type Product, unitPrice } from "@/lib/product-utils";

export type CartItem = { id: string; quantity: number; product: Product };
type Result = { ok: true } | { ok: false; error: string };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  addItem: (product: Product, qty: number) => Promise<Result>;
  setQuantity: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data, error } = await createClient()
      .from("cart_items")
      .select("id, quantity, product:products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("cart load:", error.message);
      setLoading(false);
      return;
    }
    setItems(
      (data ?? [])
        .filter((row) => row.product)
        .map((row) => ({ id: row.id, quantity: row.quantity, product: row.product as unknown as Product }))
    );
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    setLoading(Boolean(userId));
    load();
  }, [userId, load]);

  const addItem = useCallback(
    async (product: Product, qty: number): Promise<Result> => {
      if (!userId) return { ok: false, error: "Please sign in first." };
      const existing = items.find((i) => i.product.id === product.id);
      const quantity = Math.min(999, (existing?.quantity ?? 0) + qty);

      const { error } = await createClient()
        .from("cart_items")
        .upsert(
          { user_id: userId, product_id: product.id, quantity, updated_at: new Date().toISOString() },
          { onConflict: "user_id,product_id" }
        );

      if (error) return { ok: false, error: "We could not add this laptop to your cart. Please try again." };
      await load();
      return { ok: true };
    },
    [userId, items, load]
  );

  const setQuantity = useCallback(
    async (productId: string, qty: number) => {
      if (!userId) return;
      setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i)));
      const { error } = await createClient()
        .from("cart_items")
        .update({ quantity: qty, updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("product_id", productId);
      if (error) await load();
    },
    [userId, load]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!userId) return;
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      const { error } = await createClient()
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);
      if (error) await load();
    },
    [userId, load]
  );

  const clear = useCallback(async () => {
    if (!userId) return;
    setItems([]);
    await createClient().from("cart_items").delete().eq("user_id", userId);
  }, [userId]);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      subtotal: items.reduce((sum, i) => sum + unitPrice(i.product, i.quantity) * i.quantity, 0),
      loading,
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, loading, addItem, setQuantity, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}