"use client";

import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useComments } from "@/hooks/useComments";
import { useAppSelector } from "@/store/hooks";
import { useDeleteComment } from "@/hooks/useComments";
import { Comment } from "@/types";
import { Trash } from "iconsax-react";

dayjs.extend(relativeTime);

export default function CommentList({ postId }: { postId: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage } = useComments(postId);
  const currentUser = useAppSelector((state) => state.auth.user);
  const deleteMutation = useDeleteComment();

  const comments = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-6 h-6 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-md-regular text-neutral-400">No comments yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {comments.map((comment: Comment) => (
        <div
          key={comment.id}
          className="flex items-start gap-3 px-4 py-3 border-b border-neutral-900"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center shrink-0">
            {comment.author.avatar ? (
              <Image
                src={comment.author.avatar}
                alt={comment.author.name}
                width={36}
                height={36}
                className="object-cover"
              />
            ) : (
              <span className="text-sm-bold text-neutral-400">
                {comment.author.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm-bold text-neutral-25">
                {comment.author.username}
              </span>
              <span className="text-sm-regular text-neutral-400">
                {dayjs(comment.createdAt).fromNow()}
              </span>
            </div>
            <p className="text-sm-regular text-neutral-25 break-words">
              {comment.text}
            </p>
          </div>
          {currentUser?.id === comment.author.id && (
            <button
              onClick={() => deleteMutation.mutate(comment.id)}
              className="text-neutral-600 hover:text-red-400 transition-colors shrink-0"
            >
              <Trash size={16} color="currentColor" />
            </button>
          )}
        </div>
      ))}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="w-full py-3 text-sm-regular text-brand-200 hover:opacity-70"
        >
          Load more
        </button>
      )}
    </div>
  );
}
