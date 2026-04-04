import Link from "next/link";
import { ExternalLink } from "lucide-react";

type GuideLink = {
  name: string;
  url: string;
  description: string;
};

type MakeSection = {
  make: string;
  models: {
    model: string;
    links: GuideLink[];
  }[];
};

const guidesData: MakeSection[] = [
  {
    make: "Honda",
    models: [
      {
        model: "NSX",
        links: [
          {
            name: "NSX Prime",
            url: "https://www.nsxprime.com/",
            description:
              "The definitive NSX community — forums, tech articles, and marketplace.",
          },
        ],
      },
    ],
  },
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="te-border-thick border-t-0 border-l-0 border-r-0 px-6 py-5 flex items-center justify-between">
        <h1 className="font-pixel text-lg uppercase tracking-tight">Guides</h1>
        <span className="te-border font-pixel text-[9px] uppercase px-2 py-1 bg-te-yellow text-te-dark">
          Coming Soon
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
        <p className="text-sm leading-relaxed text-gray-600">
          Useful resources organized by make and model. More guides and
          step-by-step install walkthroughs are on the way.
        </p>

        {guidesData.map((section) => (
          <div key={section.make} className="flex flex-col gap-4">
            {/* Make heading */}
            <div className="flex items-center gap-3">
              <div className="te-border bg-te-orange px-3 py-1">
                <h2 className="font-pixel text-[11px] uppercase text-te-dark">
                  {section.make}
                </h2>
              </div>
              <div className="flex-1 border-t-2 border-te-border" />
            </div>

            {section.models.map((modelGroup) => (
              <div key={modelGroup.model} className="flex flex-col gap-2 ml-2">
                <h3 className="font-pixel text-[10px] uppercase tracking-wide">
                  {modelGroup.model}
                </h3>

                {modelGroup.links.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="te-border te-shadow-sm te-card-hover p-4 flex items-start gap-3 group"
                  >
                    <ExternalLink
                      size={14}
                      strokeWidth={2.5}
                      className="mt-0.5 shrink-0 group-hover:text-te-orange transition-colors"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold uppercase group-hover:text-te-orange transition-colors">
                        {link.name}
                      </span>
                      <span className="text-xs text-gray-600 leading-relaxed">
                        {link.description}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        ))}

        {/* Empty state / placeholder for more content */}
        <div className="te-border-thick border-dashed p-8 flex flex-col items-center gap-3 text-center">
          <p className="font-pixel text-[10px] uppercase text-gray-400">
            More guides coming soon
          </p>
          <p className="text-xs text-gray-500">
            Install walkthroughs, wiring diagrams, and community-written
            tutorials.
          </p>
        </div>
      </div>
    </main>
  );
}
