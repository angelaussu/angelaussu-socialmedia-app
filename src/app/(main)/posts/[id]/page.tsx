"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { usePost } from "@/hooks/usePosts";
import PostActions from "@/components/post/PostActions";
import PostCaption from "@/components/post/PostCaption";
import CommentList from "@/components/comment/CommentList";
import CommentInput from "@/components/comment/CommentInput";
import { ArrowLeft2 } from "iconsax-react";

dayjs.extend(relativeTime);

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: post, isLoading } = usePost(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-md-regular text-neutral-400">Post not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      <Link
        href="/feed"
        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-25 mb-6 transition-colors"
      >
        <ArrowLeft2 size={20} color="currentColor" />
        <span className="text-sm-regular">Back</span>
      </Link>

      {/* Post */}
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/profile/${post.author.username}`}>
          <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <span className="text-md-bold text-neutral-400">
                {post.author.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </Link>
        <div>
          <Link href={`/profile/${post.author.username}`}>
            <p className="text-md-bold text-neutral-25">{post.author.name}</p>
          </Link>
          <p className="text-sm-regular text-neutral-400">
            {dayjs(post.createdAt).fromNow()}
          </p>
        </div>
      </div>

      <div className="w-full h-[400px] relative rounded-[8px] overflow-hidden bg-neutral-950 mb-0">
        <Image
          src={post.image}
          alt={post.caption}
          fill
          className="object-cover"
        />
      </div>

      <PostActions post={post} />
      <PostCaption author={post.author.username} caption={post.caption} />

      {/* Comments section */}
      <div className="mt-6 border-t border-neutral-900">
        <h2 className="text-md-bold text-neutral-25 py-4">Comments</h2>
        <CommentList postId={id} />
        <CommentInput postId={id} />
      </div>
    </div>
  );
}
