"use client";

import { useState, useMemo } from "react";
import type { BuildWithImages } from "./page";
import GalleryBuildCard from "./GalleryBuildCard";
import { SlidersHorizontal, X, ArrowRight } from "lucide-react";
import Link from "next/link";

type GalleryClientProps = {
  builds: BuildWithImages[];
  makes: string[];
};

export default function GalleryClient({ builds, makes }: GalleryClientProps) {
  const [selectedMakes, setSelectedMakes] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleMake = (make: string) => {
    setSelectedMakes((prev) => {
      const next = new Set(prev);
      if (next.has(make)) {
        next.delete(make);
      } else {
        next.add(make);
      }
      return next;
    });
  };

  const clearFilters = () => setSelectedMakes(new Set());

  const filteredBuilds = useMemo(() => {
    if (selectedMakes.size === 0) return builds;
    return builds.filter((b) => selectedMakes.has(b.make));
  }, [builds, selectedMakes]);

  // Count builds per make
  const makeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of builds) {
      counts[b.make] = (counts[b.make] || 0) + 1;
    }
    return counts;
  }, [builds]);

  return (
    <main className="min-h-screen">
      {/* Page header */}
      <div className="te-border-thick border-t-0 border-l-0 border-r-0 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-pixel text-lg tracking-tight uppercase">
            Completed Builds
          </h1>
          <span className="te-border font-pixel text-[10px] px-2 py-1 bg-te-orange text-te-dark">
            {filteredBuilds.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/newBuild"
            className="te-border-thick te-shadow-sm te-card-hover bg-te-yellow text-te-dark font-pixel text-[9px] uppercase px-4 py-1 flex items-center gap-2"
          >
            New Build
            <ArrowRight size={14} strokeWidth={3} />
          </Link>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden te-border p-2 hover:bg-te-yellow transition-colors"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
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
          {/* Mobile close */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 te-border p-1 hover:bg-te-red hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-[10px] uppercase tracking-wider">
                Filters
              </h2>
              {selectedMakes.size > 0 && (
                <button
                  onClick={clearFilters}
                  className="font-pixel text-[8px] uppercase text-te-red hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Make filter */}
            <div>
              <h3 className="font-pixel text-[9px] uppercase tracking-wider mb-3 pb-2 border-b-2 border-te-border">
                Make
              </h3>
              <div className="space-y-2">
                {makes.map((make) => (
                  <label
                    key={make}
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <input
                      type="checkbox"
                      className="te-checkbox"
                      checked={selectedMakes.has(make)}
                      onChange={() => toggleMake(make)}
                    />
                    <span className="text-sm font-bold uppercase tracking-wide">
                      {/* <span className="text-sm font-bold uppercase tracking-wide group-hover:text-te-orange transition-colors"></span> */}
                      {make}
                    </span>
                    <span className="ml-auto text-xs text-gray-500 font-mono">
                      {makeCounts[make] || 0}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ---- Card grid ---- */}
        <section className="flex-1 p-6">
          {filteredBuilds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="font-pixel text-[10px] uppercase text-gray-400">
                No builds found
              </p>
              {selectedMakes.size > 0 && (
                <button
                  onClick={clearFilters}
                  className="te-border font-pixel text-[9px] uppercase px-4 py-2 hover:bg-te-yellow transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBuilds.map((build) => (
                <GalleryBuildCard key={build.id} build={build} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
