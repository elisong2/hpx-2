import Link from "next/link";

export default function NavbarDynamic() {
  return (
    <nav className="px-6 py-3 flex items-center gap-1">
      <Link
        className="font-pixel text-sm uppercase px-4 py-3 hover:!bg-[var(--te-orange)] transition-colors"
        href="/"
      >
        Home
      </Link>
      <Link
        className="font-pixel text-sm uppercase px-4 py-3 hover:!bg-[var(--te-orange)] transition-colors"
        href="/completedBuilds"
      >
        Gallery
      </Link>
      <Link
        className="font-pixel text-sm uppercase px-4 py-3 hover:!bg-[var(--te-orange)] transition-colors"
        href="/parts"
      >
        Parts
      </Link>
      <Link
        className="font-pixel text-sm uppercase px-4 py-3 hover:!bg-[var(--te-orange)] transition-colors"
        href="/guides"
      >
        Guides
      </Link>
      <Link
        className="font-pixel text-sm uppercase px-4 py-3 hover:!bg-[var(--te-orange)] transition-colors"
        href="/about"
      >
        About
      </Link>
    </nav>
  );
}
