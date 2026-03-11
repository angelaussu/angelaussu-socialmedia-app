"use client";

import { useAppSelector } from "@/store/hooks";
import { useFollowing } from "@/hooks/useFollow";
import UserInfoRow from "@/components/user/UserInfoRow";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-react";
import { FollowUser } from "@/types";

export default function MyFollowingPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, fetchNextPage, hasNextPage } = useFollowing(
    user?.username ?? ""
  );
  const following = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      <Link
        href="/me"
        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-25 mb-6 transition-colors"
      >
        <ArrowLeft2 size={20} color="currentColor" />
        <span className="text-sm-regular">Back</span>
      </Link>
      <h1 className="text-xl-bold text-neutral-25 mb-6">Following</h1>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : following.length === 0 ? (
        <p className="text-md-regular text-neutral-400 text-center py-8">
          Not following anyone yet
        </p>
      ) : (
        <>
          {following.map((u: FollowUser) => (
            <UserInfoRow key={u.id} user={u} />
          ))}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className="w-full py-4 text-sm-regular text-brand-200"
            >
              Load more
            </button>
          )}
        </>
      )}
    </div>
  );
}
