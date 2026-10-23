import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFoundContent from "@/components/errors/NotFoundContent";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="min-h-[60vh]">
          <NotFoundContent />
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}