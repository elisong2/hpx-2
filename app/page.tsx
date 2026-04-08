import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ---- Hero ---- */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Logo / brand mark */}
        <div className="te-border-thick te-shadow bg-te-orange px-6 py-3 mb-8">
          <h1 className="font-pixel text-2xl sm:text-4xl tracking-tight text-te-dark">
            HPX-2
          </h1>
        </div>

        <p className="font-pixel text-[10px] sm:text-xs leading-relaxed uppercase tracking-wider max-w-xl mb-4">
          The PCPartPicker for car enthusiasts
        </p>

        <p className="text-sm sm:text-base max-w-lg leading-relaxed mb-10 text-gray-600">
          Discover parts, browse guides, and share completed builds.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/parts"
            className="te-border-thick te-shadow te-card-hover bg-te-yellow text-te-dark font-pixel text-[10px] uppercase px-8 py-4 flex items-center gap-3"
          >
            Browse Parts
            <ArrowRight size={16} strokeWidth={3} />
          </Link>
          <Link
            href="/completedBuilds"
            className="te-border-thick te-shadow te-card-hover bg-[var(--background)] font-pixel text-[10px] uppercase px-8 py-4 flex items-center gap-3"
          >
            Browse Builds
            <ArrowRight size={16} strokeWidth={3} />
          </Link>
        </div>
      </section>

      {/* ---- Notice strip ---- */}
      <section className="border-t-3 border-te-border">
        <div className="flex items-center justify-center gap-3 px-6 py-5">
          <UserPlus
            size={16}
            strokeWidth={2.5}
            className="text-[var(--ana-dark-blue)]"
          />
          <p className="font-pixel text-[9px] sm:text-[10px] uppercase tracking-wider">
            Log in to save your favorite parts and connect with others!
          </p>
        </div>
      </section>
    </div>
  );
}
