"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home2, Add, ProfileCircle } from "iconsax-react";
import { cn } from "@/lib/utils";

export default function BottomMenu() {
  const pathname = usePathname();

  const isHome = pathname === "/feed";
  const isProfile = pathname.startsWith("/me");

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-8 px-10 h-20 rounded-[1000px] bg-neutral-950 border border-neutral-900">
        <Link
          href="/feed"
          className={cn(
            "flex items-center gap-2 text-sm-regular transition-colors",
            isHome ? "text-brand-200" : "text-neutral-400"
          )}
        >
          <Home2
            size={24}
            color="currentColor"
            variant={isHome ? "Bold" : "Linear"}
          />
          <span>Home</span>
        </Link>

        <Link href="/posts/create">
          <div className="w-12 h-12 rounded-full bg-brand-300 flex items-center justify-center hover:opacity-90 transition-opacity">
            <Add size={24} color="white" />
          </div>
        </Link>

        <Link
          href="/me"
          className={cn(
            "flex items-center gap-2 text-sm-regular transition-colors",
            isProfile ? "text-brand-200" : "text-neutral-400"
          )}
        >
          <ProfileCircle
            size={24}
            color="currentColor"
            variant={isProfile ? "Bold" : "Linear"}
          />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
