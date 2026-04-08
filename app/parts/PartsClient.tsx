"use client";

import { useState, useMemo, useCallback } from "react";
import type { Part } from "./page";
import {
  Search,
  ExternalLink,
  Heart,
  SlidersHorizontal,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type SortKey = "name" | "price";
type SortDir = "asc" | "desc";

type PartsClientProps = {
  parts: Part[];
  vendorMap: Record<string, string>;
  categories: string[];
  makes: string[];
  models: string[];
  userId: string | null;
  initialWishlist: string[];
};

export default function PartsClient({
  parts,
  vendorMap,
  categories,
  makes,
  models,
  userId,
  initialWishlist,
}: PartsClientProps) {
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(
    new Set(initialWishlist),
  );
  const supabase = useMemo(() => createClient(), []);

  const toggleWishlist = useCallback(
    async (partId: string) => {
      if (!userId) return;

      const isWishlisted = wishlist.has(partId);

      // Optimistic update
      setWishlist((prev) => {
        const next = new Set(prev);
        isWishlisted ? next.delete(partId) : next.add(partId);
        return next;
      });

      if (isWishlisted) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", userId)
          .eq("part_id", partId);
        if (error) {
          // Revert on failure
          setWishlist((prev) => new Set(prev).add(partId));
          console.error("Failed to remove from wishlist:", error.message);
        }
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({ user_id: userId, part_id: partId });
        if (error) {
          // Revert on failure
          setWishlist((prev) => {
            const next = new Set(prev);
            next.delete(partId);
            return next;
          });
          console.error("Failed to add to wishlist:", error.message);
        }
      }
    },
    [userId, wishlist, supabase],
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedMakes, setSelectedMakes] = useState<Set<string>>(new Set());
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 25;

  const toggleFilter = (
    set: Set<string>,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string,
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
    setPage(1);
  };

  const clearAll = () => {
    setSearch("");
    setSelectedCategories(new Set());
    setSelectedMakes(new Set());
    setSelectedModels(new Set());
    setPage(1);
  };

  const hasFilters =
    search.length > 0 ||
    selectedCategories.size > 0 ||
    selectedMakes.size > 0 ||
    selectedModels.size > 0;

  const filteredParts = useMemo(() => {
    let result = parts;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (selectedCategories.size > 0) {
      result = result.filter(
        (p) => p.category && selectedCategories.has(p.category),
      );
    }
    if (selectedMakes.size > 0) {
      result = result.filter((p) => p.make && selectedMakes.has(p.make));
    }
    if (selectedModels.size > 0) {
      result = result.filter((p) => p.model && selectedModels.has(p.model));
    }

    result = [...result].sort((a, b) => {
      if (sortKey === "name") {
        return sortDir === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      const ap = a.price ?? 0;
      const bp = b.price ?? 0;
      return sortDir === "asc" ? ap - bp : bp - ap;
    });

    return result;
  }, [
    parts,
    search,
    selectedCategories,
    selectedMakes,
    selectedModels,
    sortKey,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredParts.length / perPage));
  const paginatedParts = filteredParts.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortDir === "asc" ? (
      <ChevronUp size={12} strokeWidth={3} />
    ) : (
      <ChevronDown size={12} strokeWidth={3} />
    );
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="te-border-thick border-t-0 border-l-0 border-r-0 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-pixel text-lg uppercase tracking-tight">Parts</h1>
          <span className="te-border font-pixel text-[10px] px-2 py-1 bg-te-cyan text-te-dark">
            {filteredParts.length}
          </span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden te-border p-2 hover:bg-te-yellow transition-colors"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      <div className="flex">
        {/* ---- Sidebar ---- */}
        <aside
          className={`
            w-64 shrink-0 te-border border-t-0 border-l-0 border-b-0
            bg-[var(--background)] min-h-[calc(100vh-130px)]
            te-scrollbar overflow-y-auto
            ${sidebarOpen ? "fixed inset-0 z-50 w-full lg:static lg:w-64" : "hidden lg:block"}
          `}
        >
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 te-border p-1 hover:bg-te-red hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}

          <div className="p-4 flex flex-col gap-5">
            {/* Search */}
            <div className="te-border flex items-center gap-2 px-2 py-1.5">
              <Search size={14} className="shrink-0" />
              <input
                type="text"
                placeholder="Search parts..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-xs w-full outline-none font-bold uppercase placeholder:font-normal placeholder:normal-case"
              />
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-pixel text-[10px] uppercase tracking-wider">
                Filters
              </h2>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="font-pixel text-[8px] uppercase text-te-red hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category filter */}
            <FilterGroup
              label="Category"
              options={categories}
              selected={selectedCategories}
              onToggle={(v) =>
                toggleFilter(selectedCategories, setSelectedCategories, v)
              }
              parts={parts}
              filterKey="category"
            />

            {/* Make filter */}
            <FilterGroup
              label="Make"
              options={makes}
              selected={selectedMakes}
              onToggle={(v) => toggleFilter(selectedMakes, setSelectedMakes, v)}
              parts={parts}
              filterKey="make"
            />

            {/* Model filter */}
            <FilterGroup
              label="Model"
              options={models}
              selected={selectedModels}
              onToggle={(v) =>
                toggleFilter(selectedModels, setSelectedModels, v)
              }
              parts={parts}
              filterKey="model"
            />
          </div>
        </aside>

        {/* ---- Parts table ---- */}
        <section className="flex-1 overflow-x-auto">
          {filteredParts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="font-pixel text-[10px] uppercase text-gray-400">
                No parts found
              </p>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="te-border font-pixel text-[9px] uppercase px-4 py-2 hover:bg-te-yellow transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-te-border">
                    <th className="text-left p-3 w-12"></th>
                    <th
                      className="text-left p-3 font-pixel text-[9px] uppercase cursor-pointer select-none hover:text-te-orange transition-colors"
                      onClick={() => toggleSort("name")}
                    >
                      <span className="flex items-center gap-1">
                        Name <SortIcon column="name" />
                      </span>
                    </th>
                    <th className="text-left p-3 font-pixel text-[9px] uppercase hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left p-3 font-pixel text-[9px] uppercase hidden lg:table-cell">
                      Vendor
                    </th>
                    <th
                      className="text-left p-3 font-pixel text-[9px] uppercase cursor-pointer select-none hover:text-te-orange transition-colors w-28"
                      onClick={() => toggleSort("price")}
                    >
                      <span className="flex items-center gap-1">
                        Price <SortIcon column="price" />
                      </span>
                    </th>
                    <th className="text-center p-3 font-pixel text-[9px] uppercase w-14">
                      Save
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedParts.map((part) => (
                    <tr
                      key={part.id}
                      className="border-b border-te-grey hover:bg-te-grey/30 transition-colors"
                    >
                      {/* Thumbnail */}
                      <td className="p-2">
                        <div className="te-border w-10 h-10 bg-te-grey overflow-hidden flex items-center justify-center">
                          {part.image_url ? (
                            <Image
                              src={part.image_url}
                              alt={part.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-[8px] text-gray-400">
                              N/A
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Name (links to external product page) */}
                      <td className="p-3">
                        {part.product_url ? (
                          <a
                            href={part.product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-xs uppercase leading-snug hover:text-te-orange transition-colors inline-flex items-center gap-1.5"
                          >
                            {part.name}
                          </a>
                        ) : (
                          <span className="font-bold text-xs uppercase leading-snug">
                            {part.name}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="p-3 hidden md:table-cell">
                        {part.category && (
                          <span className="te-border text-[10px] font-bold uppercase px-2 py-0.5 bg-te-yellow text-te-dark">
                            {part.category}
                          </span>
                        )}
                      </td>

                      {/* Vendor */}
                      <td className="p-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-600">
                          {part.vendor_id
                            ? vendorMap[part.vendor_id] || "—"
                            : "—"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-3">
                        {part.price !== null ? (
                          <span className="font-pixel text-[10px]">
                            $
                            {part.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>

                      {/* Wishlist heart */}
                      <td className="p-3 text-center">
                        {userId ? (
                          <button
                            onClick={() => toggleWishlist(part.id)}
                            className={`inline-flex te-border p-1.5 transition-colors cursor-pointer ${
                              wishlist.has(part.id)
                                ? "bg-te-orange text-te-dark"
                                : "hover:bg-te-grey"
                            }`}
                          >
                            <Heart
                              size={14}
                              strokeWidth={2.5}
                              fill={
                                wishlist.has(part.id) ? "currentColor" : "none"
                              }
                            />
                          </button>
                        ) : (
                          <span className="inline-flex te-border p-1.5 opacity-30 cursor-not-allowed">
                            <Heart size={14} strokeWidth={2.5} />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-10 px-4 py-4 border-t-2 border-te-border">
                  <span className="font-pixel text-[8px] uppercase text-gray-500">
                    {(page - 1) * perPage + 1}–
                    {Math.min(page * perPage, filteredParts.length)} of{" "}
                    {filteredParts.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="te-border p-1.5 hover:bg-te-yellow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} strokeWidth={3} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - page) <= 1,
                      )
                      .reduce<(number | "...")[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1] as number) > 1)
                          acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "..." ? (
                          <span
                            key={`dot-${i}`}
                            className="font-pixel text-[8px] px-1"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p as number)}
                            className={`te-border font-pixel text-[9px] w-8 h-8 flex items-center justify-center transition-colors ${
                              page === p
                                ? "bg-te-orange text-te-dark"
                                : "hover:bg-te-yellow"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="te-border p-1.5 hover:bg-te-yellow transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

/* ---- Sidebar filter group ---- */
function FilterGroup({
  label,
  options,
  selected,
  onToggle,
  parts,
  filterKey,
}: {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
  parts: Part[];
  filterKey: keyof Part;
}) {
  // Count parts per option
  const counts: Record<string, number> = {};
  for (const p of parts) {
    const val = p[filterKey];
    if (typeof val === "string") {
      counts[val] = (counts[val] || 0) + 1;
    }
  }

  return (
    <div>
      <h3 className="font-pixel text-[9px] uppercase tracking-wider mb-3 pb-2 border-b-2 border-te-border">
        {label}
      </h3>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer group py-0.5"
          >
            <input
              type="checkbox"
              className="te-checkbox"
              checked={selected.has(opt)}
              onChange={() => onToggle(opt)}
            />
            <span className="text-xs font-bold uppercase tracking-wide">
              {/* <span className="text-xs font-bold uppercase tracking-wide group-hover:text-te-orange transition-colors"></span> */}
              {opt}
            </span>
            <span className="ml-auto text-[10px] text-gray-500 font-mono">
              {counts[opt] || 0}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
