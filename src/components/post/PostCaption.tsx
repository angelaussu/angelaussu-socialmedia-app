"use client";

import { useState } from "react";
import Link from "next/link";

interface PostCaptionProps {
  author: string;
  caption: string;
}

export default function PostCaption({ author, caption }: PostCaptionProps) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 150;
  const isLong = caption.length > maxLength;

  return (
    <p className="text-md-regular text-neutral-25 mt-3">
      <Link
        href={`/profile/${author}`}
        className="text-md-bold text-neutral-25 mr-2 hover:text-brand-200 transition-colors"
      >
        {author}
      </Link>
      {isLong && !expanded ? (
        <>
          {caption.slice(0, maxLength)}...{" "}
          <button
            onClick={() => setExpanded(true)}
            className="text-brand-200 text-md-regular"
          >
            Show More
          </button>
        </>
      ) : (
        caption
      )}
    </p>
  );
}
