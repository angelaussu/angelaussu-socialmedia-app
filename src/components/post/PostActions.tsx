"use client";

import { Heart, MessageText1, Send2, ArchiveBook } from "iconsax-react";
import { Post } from "@/types";
import { useToggleLike, useToggleSave } from "@/hooks/usePosts";
import { useAppDispatch } from "@/store/hooks";
import { openCommentModal, openLikedByModal } from "@/store/uiSlice";

export default function PostActions({ post }: { post: Post }) {
  const dispatch = useAppDispatch();
  const likeMutation = useToggleLike(post.id, post.isLiked ?? false);
  const saveMutation = useToggleSave(post.id, post.isSaved ?? false);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-5">
        {/* Like */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
            className="transition-transform active:scale-90"
          >
            <Heart
              size={24}
              color={post.isLiked ? "#ff3b5c" : "#a4a7ae"}
              variant={post.isLiked ? "Bold" : "Linear"}
            />
          </button>
          <button
            onClick={() => dispatch(openLikedByModal(post.id))}
            className="text-md-semibold text-neutral-25 hover:text-brand-200 transition-colors"
          >
            {post.likesCount}
          </button>
        </div>

        {/* Comment */}
        <button
          onClick={() => dispatch(openCommentModal(post.id))}
          className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
        >
          <MessageText1 size={24} color="#a4a7ae" variant="Linear" />
          <span className="text-md-semibold text-neutral-25">
            {post.commentsCount}
          </span>
        </button>

        {/* Share */}
        <button className="transition-opacity hover:opacity-70">
          <Send2 size={24} color="#a4a7ae" variant="Linear" />
        </button>
      </div>

      {/* Save */}
      <button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending}
        className="transition-transform active:scale-90"
      >
        <ArchiveBook
          size={24}
          color={post.isSaved ? "#7f51f9" : "#a4a7ae"}
          variant={post.isSaved ? "Bold" : "Linear"}
        />
      </button>
    </div>
  );
}
