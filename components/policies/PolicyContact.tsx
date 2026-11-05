import { Building2, Clock, FileBadge, Mail, MapPin, Phone } from "lucide-react";
import { company } from "@/lib/policies";
import { fullAddress, site } from "@/lib/site";
import RichText from "@/components/policies/RichText";

export default function PolicyContact({ note }: { note: string }) {
  const link = "underline-offset-4 transition hover:text-gold hover:underline";

  const rows = [
    { icon: Building2, label: "Registered business name", value: <>{company.name}</> },
    { icon: FileBadge, label: "CAC registration number", value: <RichText text={company.cac} /> },
    {
      icon: Phone,
      label: "Telephone / WhatsApp",
      value: (
        <a href={`tel:${site.phone.tel}`} className={link}>
          {site.phone.display}
        </a>
      ),
    },
    {
      icon: Mail,
      label: "Email",
      value: (
        <a href={`mailto:${site.email}`} className={link}>
          {site.email}
        </a>
      ),
    },
    { icon: MapPin, label: "Address", value: <>{fullAddress}, Nigeria</> },
    { icon: Clock, label: "Business hours", value: <RichText text={company.hours} /> },
  ];

  return (
    <section id="contact" className="scroll-mt-32">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink-soft to-brand-deep p-6 text-white sm:p-8">
        <h2 className="font-display text-xl font-semibold">Contact us</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">{note}</p>

        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-gold">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <dt className="text-xs uppercase tracking-wider text-white/50">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold leading-relaxed">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}