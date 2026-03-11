"use client";

import { useToggleFollow } from "@/hooks/useFollow";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
  small?: boolean;
}

export default function FollowButton({
  username,
  isFollowing,
  small = false,
}: FollowButtonProps) {
  const { mutate, isPending } = useToggleFollow(username, isFollowing);

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      className={cn(
        "rounded-full text-sm-bold transition-all disabled:opacity-50",
        small ? "px-4 h-8 text-xs" : "px-5 h-9",
        isFollowing
          ? "border border-neutral-900 text-neutral-25 bg-transparent hover:border-red-500 hover:text-red-400"
          : "bg-brand-300 text-white hover:opacity-90"
      )}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
