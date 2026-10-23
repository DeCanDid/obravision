import type { User } from "@supabase/supabase-js";

export function displayName(user: User) {
  const meta = user.user_metadata ?? {};
  return (meta.full_name || meta.name || user.email?.split("@")[0] || "Customer") as string;
}

export default function UserAvatar({ user, size = 40 }: { user: User; size?: number }) {
  const meta = user.user_metadata ?? {};
  const url = (meta.avatar_url || meta.picture || null) as string | null;
  const letter = (user.email ?? displayName(user)).charAt(0).toUpperCase();

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-full bg-gold font-bold text-ink"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {letter}
    </span>
  );
}