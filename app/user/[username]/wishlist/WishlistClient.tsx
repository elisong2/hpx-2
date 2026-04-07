"use client";

import { useState, useMemo } from "react";
import type { WishlistPart } from "./page";
import { ExternalLink, Heart, Search } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type WishlistClientProps = {
  parts: WishlistPart[];
  userId: string;
};

export default function WishlistClient({ parts: initialParts, userId }: WishlistClientProps) {
  const [parts, setParts] = useState<WishlistPart[]>(initialParts);
  const [search, setSearch] = useState("");
  const supabase = useMemo(() => createClient(), []);

  const filteredParts = useMemo(() => {
    if (!search) return parts;
    const q = search.toLowerCase();
    return parts.filter((p) => p.name.toLowerCase().includes(q));
  }, [parts, search]);

  const removeFromWishlist = async (partId: string) => {
    // Optimistic removal
    setParts((prev) => prev.filter((p) => p.id !== partId));

    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", userId)
      .eq("part_id", partId);

    if (error) {
      // Revert on failure
      setParts(initialParts);
      console.error("Failed to remove from wishlist:", error.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-pixel text-sm uppercase tracking-tight">
            Wishlist
          </h2>
          <span className="te-border font-pixel text-[10px] px-2 py-1 bg-te-orange">
            {filteredParts.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="te-border flex items-center gap-2 px-3 py-2 mb-6 max-w-sm">
        <Search size={14} className="shrink-0" />
        <input
          type="text"
          placeholder="Search wishlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs w-full outline-none font-bold uppercase placeholder:font-normal placeholder:normal-case"
        />
      </div>

      {filteredParts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Heart size={32} strokeWidth={1.5} className="text-gray-300" />
          <p className="font-pixel text-[10px] uppercase text-gray-400">
            {parts.length === 0 ? "No saved parts yet" : "No matches found"}
          </p>
          {parts.length === 0 && (
            <a
              href="/parts"
              className="te-border font-pixel text-[9px] uppercase px-4 py-2 hover:bg-te-orange transition-colors"
            >
              Browse parts
            </a>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredParts.map((part) => (
            <div
              key={part.id}
              className="te-border te-shadow-sm bg-[var(--background)] p-4 flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="te-border w-14 h-14 bg-te-grey overflow-hidden flex items-center justify-center shrink-0">
                {part.image_url ? (
                  <Image
                    src={part.image_url}
                    alt={part.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-[8px] text-gray-400">N/A</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {part.product_url ? (
                  <a
                    href={part.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-xs uppercase leading-snug hover:text-te-orange transition-colors inline-flex items-center gap-1.5"
                  >
                    {part.name}
                    <ExternalLink size={11} strokeWidth={2.5} className="shrink-0 opacity-40" />
                  </a>
                ) : (
                  <span className="font-bold text-xs uppercase leading-snug">
                    {part.name}
                  </span>
                )}

                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {part.category && (
                    <span className="te-border text-[9px] font-bold uppercase px-1.5 py-0.5 bg-te-yellow">
                      {part.category}
                    </span>
                  )}
                  {part.make && (
                    <span className="text-[10px] text-gray-500 uppercase">
                      {part.make} {part.model}
                    </span>
                  )}
                  {part.vendor_name && (
                    <span className="text-[10px] text-gray-500">
                      · {part.vendor_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="shrink-0 text-right mr-2">
                {part.price !== null ? (
                  <span className="font-pixel text-[11px]">
                    ${part.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">N/A</span>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(part.id)}
                className="te-border p-2 bg-te-orange transition-colors cursor-pointer hover:opacity-80 shrink-0"
                title="Remove from wishlist"
              >
                <Heart size={14} strokeWidth={2.5} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
