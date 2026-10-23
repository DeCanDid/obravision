export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="h-10 w-72 animate-pulse rounded-lg bg-paper" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="aspect-[4/3] animate-pulse bg-paper" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-16 animate-pulse rounded bg-paper" />
              <div className="h-4 w-full animate-pulse rounded bg-paper" />
              <div className="h-6 w-28 animate-pulse rounded bg-paper" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}