"use client";

import { useState } from "react";
import { Heart, MessageText1, Send2, ArchiveBook } from "iconsax-react";
import { Post } from "@/types";
import { useToggleLike, useToggleSave } from "@/hooks/usePosts";
import { useAppDispatch } from "@/store/hooks";
import { openCommentModal, openLikedByModal } from "@/store/uiSlice";
import { getCachedLiked, getCachedSaved, setCachedLiked, setCachedSaved } from "@/lib/interactionCache";

export default function PostActions({ post }: { post: Post }) {
  const dispatch = useAppDispatch();
  const [liked, setLiked] = useState(() => getCachedLiked(post.id) || (post.isLiked ?? false));
  const [saved, setSaved] = useState(() => getCachedSaved(post.id) || (post.isSaved ?? false));
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const likeMutation = useToggleLike(post.id, liked, post);
  const saveMutation = useToggleSave(post.id);

  function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setCachedLiked(post.id, newLiked, post);
    setLikesCount((v) => (newLiked ? v + 1 : v - 1));
    likeMutation.mutate();
  }

  function handleSave() {
    const newSaved = !saved;
    setSaved(newSaved);
    setCachedSaved(post.id, newSaved, post);
    saveMutation.mutate(saved, {
      onError: () => {
        setSaved(saved);
        setCachedSaved(post.id, saved);
      },
    });
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-5">
        {/* Like */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className="transition-transform active:scale-90"
          >
            <Heart
              size={24}
              color={liked ? "#ff3b5c" : "#a4a7ae"}
              variant={liked ? "Bold" : "Linear"}
            />
          </button>
          <button
            onClick={() => dispatch(openLikedByModal(post.id))}
            className="text-md-semibold text-neutral-25 hover:text-brand-200 transition-colors"
          >
            {likesCount}
          </button>
        </div>

        {/* Comment */}
        <button
          onClick={() => dispatch(openCommentModal(post.id))}
          className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
        >
          <MessageText1 size={24} color="#a4a7ae" variant="Linear" />
          <span className="text-md-semibold text-neutral-25">{post.commentsCount}</span>
        </button>

        {/* Share */}
        <button className="transition-opacity hover:opacity-70">
          <Send2 size={24} color="#a4a7ae" variant="Linear" />
        </button>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saveMutation.isPending}
        className="transition-transform active:scale-90"
      >
        <ArchiveBook
          size={24}
          color={saved ? "#7f51f9" : "#a4a7ae"}
          variant={saved ? "Bold" : "Linear"}
        />
      </button>
    </div>
  );
}
