"use client";

import { useState, useRef, useEffect } from "react";
import { useCreateComment } from "@/hooks/useComments";
import { Send2, Happyemoji } from "iconsax-react";
import dynamic from "next/dynamic";
import type { EmojiClickData } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function CommentInput({ postId }: { postId: string }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { mutate, isPending } = useCreateComment(postId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleEmoji(emojiData: EmojiClickData) {
    setText((v) => v + emojiData.emoji);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || isPending) return;
    mutate(text.trim(), { onSuccess: () => setText("") });
  }

  return (
    <div className="relative">
      {showEmoji && (
        <div ref={pickerRef} className="absolute bottom-full left-0 z-50 mb-2">
          <EmojiPicker
            onEmojiClick={handleEmoji}
            theme={"dark" as never}
            width={300}
            height={380}
          />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 px-4 py-3 border-t border-neutral-900"
      >
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className="text-neutral-400 hover:text-brand-200 transition-colors shrink-0"
        >
          <Happyemoji size={22} color="currentColor" variant={showEmoji ? "Bold" : "Linear"} />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-md-regular text-neutral-25 placeholder:text-neutral-600 outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim() || isPending}
          className="text-brand-200 disabled:text-neutral-600 transition-colors shrink-0"
        >
          <Send2 size={20} color="currentColor" variant="Bold" />
        </button>
      </form>
    </div>
  );
}
