"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "forgot";

function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Incorrect email or password. Please try again.";
  if (m.includes("not confirmed")) return "Please confirm your email first. Check your inbox for the confirmation link.";
  if (m.includes("already registered")) return "An account with this email already exists. Please sign in instead.";
  if (m.includes("security purposes")) return "Please wait a minute before requesting another email.";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many attempts. Please wait a few minutes and try again.";
  if (m.includes("password")) return "Your password must be at least 8 characters long.";
  return "Something went wrong. Please try again.";
}

const input =
  "h-12 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function AuthForm({
  next,
  reason,
  initialMode = "signin",
}: {
  next: string;
  reason?: string;
  initialMode?: Mode;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
    setNotice(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const supabase = createClient();

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        router.push(next);
        router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) throw error;

        if (data.user && data.user.identities?.length === 0) {
          setError("An account with this email already exists. Please sign in instead.");
        } else if (data.session) {
          router.push(next);
          router.refresh();
        } else {
          setNotice("Account created. Check your email inbox and click the confirmation link to activate your account.");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth/recovery`,
        });
        if (error) throw error;
        setNotice(
          "If an account exists for that email, we have sent a password reset link. Please check your inbox (and spam folder) and open the link on this same device."
        );
      }
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : ""));
    } finally {
      setBusy(false);
    }
  }

  const title =
    mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your free account" : "Reset your password";

  const subtitle =
    mode === "signin"
      ? reason === "cart"
        ? "Sign in or create a free account to add laptops to your cart."
        : "Sign in to see your cart and place orders."
      : mode === "signup"
      ? "It only takes a minute. Use your email and a password."
      : "Enter the email you signed up with and we will send you a link to choose a new password.";

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-8">
      {mode === "forgot" ? (
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 transition hover:text-brand"
        >
          <ArrowLeft size={16} /> Back to sign in
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-paper p-1">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              aria-pressed={mode === m}
              className={clsx(
                "rounded-lg py-2.5 text-sm font-semibold transition-all duration-300",
                mode === m ? "bg-white text-brand shadow" : "text-ink/60 hover:text-ink"
              )}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
      )}

      <h2 className="mt-6 font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{subtitle}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Full name</span>
            <span className="relative block">
              <User size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={input}
              />
            </span>
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Email address</span>
          <span className="relative block">
            <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={input}
            />
          </span>
        </label>

        {mode !== "forgot" && (
          <div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Password</span>
              <span className="relative block">
                <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type={show ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                  className={`${input} pr-12`}
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
            {mode === "signin" && (
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="mt-2 block ml-auto text-sm font-semibold text-brand transition hover:text-brand-deep"
              >
                Forgot password?
              </button>
            )}
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-700">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {busy && <Loader2 size={18} className="animate-spin" />}
          {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
      </form>
    </div>
  );
}