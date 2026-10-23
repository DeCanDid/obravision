"use client";

import { useActionState } from "react";
import { Laptop, Loader2, Lock, User } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { site } from "@/lib/site";

const input =
  "h-12 w-full rounded-xl border border-line bg-white pl-11 pr-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 flex items-center justify-center gap-2.5">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-gold">
          <Laptop size={22} />
        </span>
        <span className="font-display text-2xl font-semibold">{site.name}</span>
      </div>

      <form action={action} className="rounded-3xl border border-line bg-white p-8 shadow-xl shadow-ink/5">
        <h1 className="font-display text-2xl font-semibold">Admin login</h1>
        <p className="mt-1.5 text-sm text-ink/60">Sign in to add new laptops to the store.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Username</span>
            <span className="relative block">
              <User size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input name="username" required autoComplete="username" className={input} />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Password</span>
            <span className="relative block">
              <Lock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input name="password" type="password" required autoComplete="current-password" className={input} />
            </span>
          </label>
        </div>

        {state?.error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-deep disabled:opacity-60"
        >
          {pending && <Loader2 size={18} className="animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  );
}