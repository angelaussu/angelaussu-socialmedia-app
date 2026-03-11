"use client";

import { useState } from "react";
import { useCreateComment } from "@/hooks/useComments";
import { Send2 } from "iconsax-react";

export default function CommentInput({ postId }: { postId: string }) {
  const [text, setText] = useState("");
  const { mutate, isPending } = useCreateComment(postId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || isPending) return;
    mutate(text.trim(), { onSuccess: () => setText("") });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-4 py-3 border-t border-neutral-900"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 bg-transparent text-md-regular text-neutral-25 placeholder:text-neutral-600 outline-none"
      />
      <button
        type="submit"
        disabled={!text.trim() || isPending}
        className="text-brand-200 disabled:text-neutral-600 transition-colors"
      >
        <Send2 size={20} color="currentColor" variant="Bold" />
      </button>
    </form>
  );
}
