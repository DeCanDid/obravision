"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Laptop } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-white">
        <Laptop size={72} className="absolute inset-0 m-auto text-line" />
        {current && (
          <Image
            key={current}
            src={current}
            alt={`${name} – image ${active + 1}`}
            fill
            quality={90}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="animate-fade-in object-cover"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={clsx(
                "relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-paper transition",
                i === active ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}