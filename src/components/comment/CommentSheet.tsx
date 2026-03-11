"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { closeCommentModal } from "@/store/uiSlice";
import { CloseCircle } from "iconsax-react";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";

export default function CommentSheet() {
  const dispatch = useAppDispatch();
  const { commentModal } = useAppSelector((state) => state.ui);

  if (!commentModal.open || !commentModal.postId) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-end"
      onClick={() => dispatch(closeCommentModal())}
    >
      <div
        className="w-full bg-neutral-950 border-t border-neutral-900 rounded-t-2xl flex flex-col"
        style={{ maxHeight: "75vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900">
          <span className="text-md-bold text-neutral-25">Comments</span>
          <button onClick={() => dispatch(closeCommentModal())}>
            <CloseCircle size={22} color="#a4a7ae" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <CommentList postId={commentModal.postId} />
        </div>
        <CommentInput postId={commentModal.postId} />
      </div>
    </div>
  );
}
