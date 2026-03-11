"use client";

import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types";

export default function GalleryGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-md-bold text-neutral-25">No posts yet</p>
        <p className="text-sm-regular text-neutral-400 mt-1">
          Posts will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <div className="aspect-square relative bg-neutral-950 rounded-[6px] overflow-hidden">
            <Image
              src={post.image}
              alt={post.caption}
              fill
              className="object-cover hover:opacity-80 transition-opacity"
              sizes="(max-width: 768px) 33vw, 268px"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
