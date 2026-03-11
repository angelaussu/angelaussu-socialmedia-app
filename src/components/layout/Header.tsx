"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { removeToken } from "@/lib/api";
import SearchBar from "@/components/ui/SearchBar";
import { LogoutCurve, Profile } from "iconsax-react";

function SocialityLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    removeToken();
    dispatch(logout());
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-base-black border-b border-neutral-900">
      <div className="flex items-center gap-3 h-16 md:h-20 px-4 md:px-10 lg:px-[120px]">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2 shrink-0">
          <SocialityLogo />
          <span className="text-md-bold md:text-display-xs text-neutral-25">Sociality</span>
        </Link>

        {/* Search — always visible, grows to fill space */}
        <div className="flex-1 min-w-0 mx-2 md:mx-6 max-w-[491px]">
          <SearchBar />
        </div>

        {/* User Dropdown */}
        {user && (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 md:gap-3"
            >
              <span className="text-md-bold text-neutral-25 hidden lg:block">
                {user.name || user.username}
              </span>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name ?? "avatar"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-sm-bold text-neutral-400">
                    {(user.name || user.username)?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 md:top-14 w-56 bg-neutral-950 border border-neutral-900 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-900">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center shrink-0">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name ?? "avatar"}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-sm-bold text-neutral-400">
                        {(user.name || user.username)?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm-bold text-neutral-25 truncate">{user.name || user.username}</p>
                    <p className="text-xs text-neutral-400 truncate">@{user.username}</p>
                  </div>
                </div>

                <Link
                  href="/me"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-neutral-25 hover:bg-neutral-900 transition-colors"
                >
                  <Profile size={18} color="currentColor" />
                  <span className="text-sm-regular">Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-neutral-900 transition-colors"
                >
                  <LogoutCurve size={18} color="currentColor" />
                  <span className="text-sm-regular">Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
