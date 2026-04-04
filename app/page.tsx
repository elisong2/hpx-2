import Link from "next/link";
import LoginButton from "./components/LoginLogoutButton";
import { ArrowRight, Wrench, LayoutGrid, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <LoginButton />

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
            href="/completedBuilds"
            className="te-border-thick te-shadow te-card-hover bg-te-yellow text-te-dark font-pixel text-[10px] uppercase px-8 py-4 flex items-center gap-3"
          >
            Browse Builds
            <ArrowRight size={16} strokeWidth={3} />
          </Link>
          <Link
            href="/newBuild"
            className="te-border-thick te-shadow te-card-hover bg-[var(--background)] font-pixel text-[10px] uppercase px-8 py-4 flex items-center gap-3"
          >
            Share Your Build
            <ArrowRight size={16} strokeWidth={3} />
          </Link>
        </div>
      </section>

      {/* ---- Feature cards strip ---- */}
      <section className="border-t-3 border-te-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-te-border border-x-0">
          <FeatureCard
            icon={<LayoutGrid size={24} strokeWidth={2.5} />}
            label="Gallery"
            description="Explore builds from the community, filtered by make, model, and style."
            color="bg-te-cyan"
          />
          <FeatureCard
            icon={<Wrench size={24} strokeWidth={2.5} />}
            label="Parts"
            description="Compare prices across retailers. Find the best deal on every mod."
            color="bg-te-orange"
          />
          <FeatureCard
            icon={<BookOpen size={24} strokeWidth={2.5} />}
            label="Guides"
            description="Step-by-step install guides written by real builders."
            color="bg-te-yellow"
          />
        </div>
      </section>

      {/* ---- Ticker / marquee strip ---- */}
      {/* <div className="te-border-thick border-l-0 border-r-0 border-b-0 bg-te-dark text-[var(--background)] overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap font-pixel text-[9px] uppercase tracking-widest">
          {Array(4)
            .fill(
              "HPX-2 \u2022 Browse \u2022 Build \u2022 Compare \u2022 Share \u2022 ",
            )
            .join("")}
        </div>
      </div> */}
    </div>
  );
}

function FeatureCard({
  icon,
  label,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}) {
  return (
    <div className="p-6 flex flex-col gap-3">
      <div
        className={`te-border w-10 h-10 ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
      <h3 className="font-pixel text-[11px] uppercase">{label}</h3>
      <p className="text-xs leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
