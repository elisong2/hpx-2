"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  imageUrls: string[];
};

export default function BuildImageCarousel({ imageUrls }: Props) {
  const [index, setIndex] = useState(0);

  if (imageUrls.length === 0) {
    return (
      <div className="te-border-thick bg-te-grey aspect-[16/9] w-full flex items-center justify-center">
        <span className="font-pixel text-[10px] text-gray-400 uppercase">
          No image
        </span>
      </div>
    );
  }

  const prev = () =>
    setIndex((i) => (i === 0 ? imageUrls.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i === imageUrls.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-3">
      {/* Main image frame */}
      <div className="relative te-border-thick bg-te-grey aspect-[16/9] w-full overflow-hidden">
        <Image
          src={imageUrls[index]}
          alt={`Build image ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />

        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 te-border-thick bg-[var(--background)] w-10 h-10 flex items-center justify-center hover:bg-te-yellow transition-colors"
            >
              <ChevronLeft size={18} strokeWidth={3} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 te-border-thick bg-[var(--background)] w-10 h-10 flex items-center justify-center hover:bg-te-yellow transition-colors"
            >
              <ChevronRight size={18} strokeWidth={3} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 te-border bg-[var(--background)] px-2 py-1 font-pixel text-[9px] uppercase">
              {index + 1} / {imageUrls.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imageUrls.map((url, i) => (
            <button
              key={url}
              onClick={() => setIndex(i)}
              className={`relative shrink-0 w-20 h-20 te-border overflow-hidden transition-all ${
                i === index
                  ? "te-border-thick border-te-orange"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
