"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, MailWarning } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import StateCard from "@/components/ui/StateCard";

const input =
  "h-12 w-full rounded-xl border border-line bg-white pl-11 pr-12 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function ResetPasswordView({ expired }: { expired: boolean }) {
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) return setError("Your password must be at least 8 characters long.");
    if (password !== confirm) return setError("The two passwords do not match.");

    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);

    if (error) {
      setError(
        error.message.toLowerCase().includes("different")
          ? "Your new password must be different from your old one."
          : "We could not update your password. Please request a new reset link and try again."
      );
      return;
    }
    setDone(true);
  }

  if (loading) return <div className="h-80 animate-pulse rounded-3xl bg-white" />;

  if (done) {
    return (
      <StateCard
        icon={<CheckCircle2 size={30} />}
        title="Password updated"
        text="Your password has been changed and you are signed in. You can now continue shopping."
      >
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/laptops" className="rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-deep">
            Browse laptops
          </Link>
          <Link href="/cart" className="rounded-full border border-ink px-7 py-3.5 text-sm font-bold transition hover:bg-ink hover:text-white">
            View my cart
          </Link>
        </div>
      </StateCard>
    );
  }

  if (!user || expired) {
    return (
      <StateCard
        icon={<MailWarning size={30} />}
        title="This reset link has expired"
        text="Reset links work once, and only in the browser where you asked for them. Please request a new link and open it on the same device."
      >
        <Link
          href="/account?forgot=1"
          className="inline-flex rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand-deep"
        >
          Request a new link
        </Link>
      </StateCard>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-8">
      <h1 className="font-display text-2xl font-semibold">Set a new password</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
        Choose a new password for <span className="font-semibold text-ink">{user.email}</span>.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">New password</span>
          <span className="relative block">
            <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type={show ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={input}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 transition hover:text-ink"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Confirm new password</span>
          <span className="relative block">
            <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type={show ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type it again"
              className={input}
            />
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {busy && <Loader2 size={18} className="animate-spin" />}
        Update password
      </button>
    </form>
  );
}