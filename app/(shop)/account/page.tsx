import type { Metadata } from "next";
import { safeNext } from "@/lib/safe-next";
import AccountView from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "My Account – Sign In or Create an Account",
  description: "Sign in or create a free Obravision account to save your cart and order laptops online.",
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ next?: string; reason?: string; error?: string; forgot?: string }> };

export default async function AccountPage({ searchParams }: Props) {
  const { next, reason, error, forgot } = await searchParams;
  return <AccountView next={safeNext(next)} reason={reason} authError={error === "auth"} startForgot={forgot === "1"} />;
}