export default function StateCard({
  icon,
  title,
  text,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">{icon}</div>
      <h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/65">{text}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}