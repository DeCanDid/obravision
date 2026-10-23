"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

const subjects = ["General enquiry", "Wholesale or bulk quote", "Help with an order", "Other"];

const field =
  "w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
    website: "", // hidden trap field for bots
  });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "We could not send your message. Please try again.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not send your message. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="animate-fade-in rounded-3xl border border-line bg-white p-8 text-center sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold">Message sent</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/65">
          Thank you for contacting us. We will reply to {form.email} as soon as we can. For a faster response, message us on WhatsApp.
        </p>
        <a
          href={whatsappLink(`Hello Obravision, I just sent a message on your website about: ${form.subject}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1faa59] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#178a47]"
        >
          <WhatsAppIcon size={18} /> Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative rounded-3xl border border-line bg-white p-6 shadow-xl shadow-ink/5 sm:p-8">
      <h2 className="font-display text-2xl font-semibold">Send us a message</h2>
      <p className="mt-1.5 text-sm text-ink/60">Ask about a laptop, request a bulk quote or get help with an order.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Your name</span>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" className={`${field} h-12`} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Email address</span>
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" className={`${field} h-12`} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">
            Phone / WhatsApp <span className="font-normal text-ink/50">(optional)</span>
          </span>
          <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" className={`${field} h-12`} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Subject</span>
          <select value={form.subject} onChange={(e) => update("subject", e.target.value)} className={`${field} h-12`}>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-semibold">Your message</span>
          <textarea
            required
            rows={5}
            maxLength={2000}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Tell us which laptop you need, the quantity, and any questions you have."
            className={`${field} py-3`}
          />
        </label>

        {/* Bot trap: hidden from real visitors */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} />
          </label>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}