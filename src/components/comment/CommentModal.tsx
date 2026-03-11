"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { closeCommentModal } from "@/store/uiSlice";
import { usePost } from "@/hooks/usePosts";
import Image from "next/image";
import { CloseCircle } from "iconsax-react";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";

function PostImagePanel({ postId }: { postId: string }) {
  const { data: post } = usePost(postId);
  if (!post) return <div className="w-[560px] bg-neutral-900 animate-pulse" />;
  return (
    <div className="w-[560px] shrink-0 relative bg-neutral-900">
      <Image src={post.image} alt={post.caption} fill className="object-cover" />
    </div>
  );
}

export default function CommentModal() {
  const dispatch = useAppDispatch();
  const { commentModal } = useAppSelector((state) => state.ui);

  if (!commentModal.open || !commentModal.postId) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={() => dispatch(closeCommentModal())}
    >
      <div
        className="w-[1000px] max-w-[95vw] h-[680px] bg-neutral-950 border border-neutral-900 rounded-2xl flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Post image */}
        <PostImagePanel postId={commentModal.postId} />

        {/* Right: Comments */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900 shrink-0">
            <span className="text-md-bold text-neutral-25">Comments</span>
            <button onClick={() => dispatch(closeCommentModal())}>
              <CloseCircle size={22} color="#a4a7ae" />
            </button>
          </div>
          <CommentList postId={commentModal.postId} />
          <CommentInput postId={commentModal.postId} />
        </div>
      </div>
    </div>
  );
}
