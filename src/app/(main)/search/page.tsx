"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { FollowUser } from "@/types";
import UserInfoRow from "@/components/user/UserInfoRow";
import { SearchNormal1 } from "iconsax-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => usersApi.search(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  const results = data ?? [];

  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      <h1 className="text-xl-bold text-neutral-25 mb-6">Search</h1>

      {/* Search input */}
      <div className="relative mb-6">
        <SearchNormal1
          size={18}
          color="#535862"
          className="absolute left-4 top-1/2 -translate-y-1/2"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people..."
          autoFocus
          className="w-full h-12 pl-11 pr-4 rounded-xl bg-neutral-950 border border-neutral-900
            text-md-regular text-neutral-25 placeholder:text-neutral-600
            outline-none focus:border-brand-200 transition-colors"
        />
      </div>

      {/* Results */}
      {isLoading && debouncedQuery ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div>
          {results.map((user: FollowUser) => (
            <UserInfoRow key={user.id} user={user} />
          ))}
        </div>
      ) : debouncedQuery ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p className="text-md-bold text-neutral-25">No results found</p>
          <p className="text-sm-regular text-neutral-400">
            Try a different name or username
          </p>
        </div>
      ) : (
        <p className="text-md-regular text-neutral-400 text-center py-8">
          Start typing to search for people
        </p>
      )}
    </div>
  );
}
