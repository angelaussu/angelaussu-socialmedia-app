"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeLikedByModal } from "@/store/uiSlice";
import { useInfiniteQuery } from "@tanstack/react-query";
import { likesApi } from "@/lib/api";
import { PaginatedResponse, FollowUser } from "@/types";
import Image from "next/image";
import { CloseCircle } from "iconsax-react";
import FollowButton from "@/components/user/FollowButton";

export default function LikedByModal() {
  const dispatch = useAppDispatch();
  const { likedByModal } = useAppSelector((state) => state.ui);

  const { data } = useInfiniteQuery({
    queryKey: ["likedBy", likedByModal.postId],
    queryFn: ({ pageParam }) =>
      likesApi.getLikes(likedByModal.postId!, pageParam as number) as Promise<PaginatedResponse<FollowUser>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!likedByModal.postId && likedByModal.open,
  });

  if (!likedByModal.open) return null;

  const users = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={() => dispatch(closeLikedByModal())}
    >
      <div
        className="w-full max-w-sm bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900">
          <span className="text-md-bold text-neutral-25">Likes</span>
          <button onClick={() => dispatch(closeLikedByModal())}>
            <CloseCircle size={22} color="#a4a7ae" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-md-regular text-neutral-400 text-center py-8">
              No likes yet
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-5 py-3 border-b border-neutral-900 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center shrink-0">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-sm-bold text-neutral-400">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm-bold text-neutral-25">{user.name}</p>
                    <p className="text-sm-regular text-neutral-400">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <FollowButton
                  username={user.username}
                  isFollowing={user.isFollowing ?? false}
                  small
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
