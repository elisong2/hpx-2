"use client";

import Image from "next/image";
import Link from "next/link";
import type { BuildWithImages } from "./page";
import { User, Calendar } from "lucide-react";

type Props = {
  build: BuildWithImages;
};

export default function GalleryBuildCard({ build }: Props) {
  const date = new Date(build.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="te-border-thick te-shadow te-card-hover bg-[var(--background)] flex flex-col">
      {/* Cover image */}
      <div className="relative w-full aspect-[16/10] bg-te-grey overflow-hidden border-b-[3px] border-te-border">
        {build.coverImage ? (
          <Image
            src={build.coverImage}
            alt={build.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-pixel text-[10px] text-gray-400 uppercase">
              No image
            </span>
          </div>
        )}

        {/* Make badge overlay */}
        {/* <div className="absolute top-2 left-2 bg-te-orange te-border font-pixel text-[8px] px-2 py-1 uppercase text-te-dark">
          {build.make}
        </div> */}
      </div>

      {/* Info section */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title */}
        <h3 className="font-pixel text-[11px] leading-relaxed uppercase tracking-wide line-clamp-2">
          {build.title}
        </h3>

        {/* Make / Model */}
        <div className="flex gap-2 flex-wrap">
          <span className="te-border text-xs font-bold uppercase px-2 py-0.5 bg-te-yellow text-te-dark">
            {build.make}
          </span>
          <span className="te-border text-xs font-bold uppercase px-2 py-0.5">
            {build.model}
          </span>
        </div>

        {/* Description preview */}
        {build.description && (
          <p className="text-xs leading-relaxed text-gray-600 line-clamp-2">
            {build.description}
          </p>
        )}

        {/* Footer: user + date */}
        <div className="mt-auto pt-3 border-t-2 border-te-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={12} strokeWidth={3} />
            <span className="text-xs font-bold uppercase">
              {build.username}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar size={11} />
            <span className="text-[10px] font-mono">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
