"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { SearchNormal1 } from "iconsax-react";
import { usersApi } from "@/lib/api";
import { FollowUser } from "@/types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data } = useQuery({
    queryKey: ["headerSearch", debouncedQuery],
    queryFn: () => usersApi.search(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  const results = data ?? [];

  return (
    <div ref={ref} className="w-full relative">
      <div className="relative">
        <SearchNormal1
          size={18}
          color="#535862"
          className="absolute left-4 top-1/2 -translate-y-1/2"
        />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search..."
          className="w-full h-11 pl-11 pr-10 rounded-full bg-neutral-950 border border-neutral-900
            text-md-regular text-neutral-25 placeholder:text-neutral-600
            outline-none focus:border-brand-200 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setDebouncedQuery(""); setOpen(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-25 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {open && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden z-50 shadow-2xl">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-md-bold text-neutral-25 mb-1">No results found</p>
              <p className="text-sm-regular text-neutral-400">Change your keyword</p>
            </div>
          ) : (
            results.slice(0, 6).map((user: FollowUser) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                onClick={() => { setQuery(""); setOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-900 transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-900 shrink-0 flex items-center justify-center">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name ?? user.username}
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
                <div>
                  <p className="text-md-bold text-neutral-25">{user.name || user.username}</p>
                  <p className="text-sm-regular text-neutral-400">{user.username}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
