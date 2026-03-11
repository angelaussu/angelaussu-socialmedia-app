"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import SearchBar from "@/components/ui/SearchBar";

function SocialityLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-base-black border-b border-neutral-900 flex items-center gap-8 px-6 md:px-16 lg:px-[120px]">
      {/* Logo */}
      <Link href="/feed" className="flex items-center gap-2 shrink-0">
        <SocialityLogo />
        <span className="text-display-xs text-neutral-25">Sociality</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-[491px] mx-auto hidden md:block">
        <SearchBar />
      </div>

      {/* User avatar */}
      {user && (
        <Link href="/me" className="flex items-center gap-3 shrink-0 ml-auto">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-md-bold text-neutral-400">
                {(user.name || user.username)?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-md-bold text-neutral-25">
            {user.name || user.username}
          </span>
        </Link>
      )}
    </header>
  );
}
