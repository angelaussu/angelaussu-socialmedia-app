"use client";

import { useState } from "react";
import { useToggleFollow } from "@/hooks/useFollow";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
  small?: boolean;
}

export default function FollowButton({ username, isFollowing, small = false }: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const { mutate, isPending } = useToggleFollow(username);

  function handleFollow() {
    const prev = following;
    setFollowing(!following);
    mutate(following, {
      onError: () => setFollowing(prev),
    });
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={cn(
        "rounded-full text-sm-bold transition-all disabled:opacity-50",
        small ? "px-4 h-8 text-xs" : "px-5 h-9",
        following
          ? "border border-neutral-900 text-neutral-25 bg-transparent hover:border-red-500 hover:text-red-400"
          : "bg-brand-300 text-white hover:opacity-90"
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
