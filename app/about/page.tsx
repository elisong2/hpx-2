import { Wrench, Code, Car } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="te-border-thick border-t-0 border-l-0 border-r-0 px-6 py-5">
        <h1 className="font-pixel text-lg uppercase tracking-tight">About</h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-10">
        {/* Status badge */}
        <div className="te-border te-shadow-sm bg-te-yellow font-pixel text-[9px] uppercase px-3 py-2 self-start">
          In Development
        </div>

        {/* Intro */}
        <div className="flex flex-col gap-4">
          <h2 className="font-pixel text-sm uppercase">What is HPX-2?</h2>
          <p className="text-sm leading-relaxed">
            Born from a lifelong love of cars and technology, HPX-2 is the
            PCPartPicker for car enthusiasts. Browse completed builds from the
            community, compare parts and prices across retailers, and share your
            own ride.
          </p>
          <p className="text-sm leading-relaxed text-gray-600">
            This is an ongoing project — there is much more to come. Thanks for
            visiting.
          </p>
        </div>

        {/* Roadmap cards */}
        <div className="flex flex-col gap-3">
          <h2 className="font-pixel text-[11px] uppercase mb-1">Roadmap</h2>

          <RoadmapItem
            icon={<Car size={18} strokeWidth={2.5} />}
            title="Completed Builds Gallery"
            status="live"
            description="Browse and filter community builds by make, model, and more."
          />
          <RoadmapItem
            icon={<Wrench size={18} strokeWidth={2.5} />}
            title="Parts Aggregator"
            status="wip"
            description="Compare prices across multiple retailers for any car part."
          />
          <RoadmapItem
            icon={<Code size={18} strokeWidth={2.5} />}
            title="Community Forums"
            status="planned"
            description="Discuss builds, troubleshoot installs, and share knowledge."
          />
        </div>

        {/* Tech stack */}
        <div className="te-border-thick p-5 bg-te-dark text-[var(--background)]">
          <h3 className="font-pixel text-[10px] uppercase mb-3">Built With</h3>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "React", "Supabase", "Tailwind", "Vercel"].map(
              (tech) => (
                <span
                  key={tech}
                  className="border border-[var(--background)] font-pixel text-[8px] uppercase px-2 py-1"
                >
                  {tech}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function RoadmapItem({
  icon,
  title,
  status,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  status: "live" | "wip" | "planned";
  description: string;
}) {
  const statusStyles = {
    live: "bg-te-green text-te-dark",
    wip: "bg-te-yellow text-te-dark",
    planned: "bg-te-grey text-te-dark",
  };

  const statusLabels = {
    live: "Live",
    wip: "In Progress",
    planned: "Planned",
  };

  return (
    <div className="te-border te-shadow-sm p-4 flex items-start gap-4">
      <div className="te-border w-9 h-9 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h4 className="font-pixel text-[10px] uppercase">{title}</h4>
          <span
            className={`te-border font-pixel text-[7px] uppercase px-2 py-0.5 ${statusStyles[status]}`}
          >
            {statusLabels[status]}
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
