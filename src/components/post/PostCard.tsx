"use client";

import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Post } from "@/types";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";

dayjs.extend(relativeTime);

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="py-6 border-b border-neutral-900">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/profile/${post.author.username}`}>
          <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center shrink-0">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xl-bold text-neutral-400">
                {post.author.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </Link>
        <div>
          <Link href={`/profile/${post.author.username}`}>
            <p className="text-md-bold text-neutral-25 hover:text-brand-200 transition-colors">
              {post.author.name}
            </p>
          </Link>
          <p className="text-sm-regular text-neutral-400">
            {dayjs(post.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* Post image */}
      <div className="w-full h-[400px] md:h-[500px] relative rounded-[8px] overflow-hidden bg-neutral-950">
        <Image
          src={post.image}
          alt={post.caption}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {/* Actions */}
      <PostActions post={post} />

      {/* Caption */}
      <PostCaption author={post.author.username} caption={post.caption} />
    </article>
  );
}
