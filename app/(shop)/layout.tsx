import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}