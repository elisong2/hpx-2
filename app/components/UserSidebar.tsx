"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { User, Wrench, Heart, SlidersHorizontal, X } from "lucide-react";

type UserSidebarProps = {
  username: string;
};

const menuItems = (username: string) => [
  {
    href: `/user/${username}/profile`,
    icon: <User size={16} strokeWidth={2.5} />,
    label: "Profile",
  },
  {
    href: `/user/${username}/my-builds`,
    icon: <Wrench size={16} strokeWidth={2.5} />,
    label: "My Builds",
  },
  {
    href: `/user/${username}/wishlist`,
    icon: <Heart size={16} strokeWidth={2.5} />,
    label: "Wishlist",
  },
];

export default function UserSidebar({ username }: UserSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden te-border p-2 hover:bg-te-yellow transition-colors self-start"
      >
        <SlidersHorizontal size={18} />
      </button>

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
          {/* Username header */}
          <h2 className="font-pixel text-[10px] uppercase tracking-wider mb-4">
            {username}
          </h2>

          {/* Navigation */}
          <div>
            <h3 className="font-pixel text-[9px] uppercase tracking-wider mb-3 pb-2 border-b-2 border-te-border">
              Menu
            </h3>
            <div className="space-y-1">
              {menuItems(username).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 py-2 px-2 cursor-pointer group transition-colors ${
                      isActive
                        ? "bg-te-orange te-border"
                        : "hover:bg-te-grey"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-bold uppercase tracking-wide">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
