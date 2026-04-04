import { Wrench, Search, DollarSign } from "lucide-react";

export default function PartsPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="te-border-thick border-t-0 border-l-0 border-r-0 px-6 py-5 flex items-center justify-between">
        <h1 className="font-pixel text-lg uppercase tracking-tight">Parts</h1>
        <span className="te-border font-pixel text-[9px] uppercase px-2 py-1 bg-te-cyan text-te-dark">
          Coming Soon
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center gap-10">
        {/* Big icon block */}
        <div className="te-border-thick te-shadow bg-te-orange w-20 h-20 flex items-center justify-center">
          <Wrench size={36} strokeWidth={2.5} />
        </div>

        <div className="text-center flex flex-col gap-3">
          <h2 className="font-pixel text-sm uppercase">
            Parts Aggregator
          </h2>
          <p className="text-sm leading-relaxed text-gray-600 max-w-md">
            Search for car parts across multiple retailers and compare prices —
            all in one place. No more opening 15 tabs.
          </p>
        </div>

        {/* Feature preview cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div className="te-border te-shadow-sm p-4 flex flex-col gap-2">
            <div className="te-border w-8 h-8 bg-te-yellow flex items-center justify-center">
              <Search size={16} strokeWidth={2.5} />
            </div>
            <h3 className="font-pixel text-[9px] uppercase">Cross-Retailer Search</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              One search, results from every major parts store.
            </p>
          </div>

          <div className="te-border te-shadow-sm p-4 flex flex-col gap-2">
            <div className="te-border w-8 h-8 bg-te-green flex items-center justify-center">
              <DollarSign size={16} strokeWidth={2.5} />
            </div>
            <h3 className="font-pixel text-[9px] uppercase">Price Comparison</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Side-by-side pricing so you always get the best deal.
            </p>
          </div>
        </div>

        {/* Placeholder search bar (non-functional) */}
        <div className="w-full max-w-lg te-border-thick p-1 flex items-center gap-2 opacity-50">
          <Search size={16} className="ml-2" />
          <div className="flex-1 font-pixel text-[9px] uppercase py-3 text-gray-400">
            Search parts...
          </div>
          <div className="te-border bg-te-dark text-[var(--background)] font-pixel text-[8px] uppercase px-4 py-2">
            Search
          </div>
        </div>
        <p className="font-pixel text-[8px] uppercase text-gray-400 -mt-6">
          Functional search coming soon
        </p>
      </div>
    </main>
  );
}
