import type { Metadata } from "next";
import ResetPasswordView from "@/components/account/ResetPasswordView";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-md px-4 py-14 sm:py-20">
        <ResetPasswordView expired={error === "expired"} />
      </div>
    </section>
  );
}