"use client";

import { useRef, useCallback, useState } from "react";
import { useFeed, useExplore } from "@/hooks/usePosts";
import PostCard from "@/components/post/PostCard";
import EmptyState from "@/components/ui/EmptyState";
import CommentModal from "@/components/comment/CommentModal";
import CommentSheet from "@/components/comment/CommentSheet";
import LikedByModal from "@/components/ui/LikedByModal";
import { Post } from "@/types";

function PostList({
  posts,
  isFetchingNextPage,
  lastPostRef,
}: {
  posts: Post[];
  isFetchingNextPage: boolean;
  lastPostRef: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      {posts.map((post: Post, index: number) => (
        <div
          key={post.id}
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <PostCard post={post} />
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

function FeedTab() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useFeed();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );
  const posts = data?.pages.flatMap((page) => page.data) ?? [];
  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" /></div>;
  if (isError) return <EmptyState title="Failed to load feed" description="Something went wrong. Please refresh the page." />;
  if (posts.length === 0) return <EmptyState title="Your feed is empty" description="Follow some people to see their posts here." />;
  return <PostList posts={posts} isFetchingNextPage={isFetchingNextPage} lastPostRef={lastPostRef} />;
}

function ExploreTab() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useExplore();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );
  const posts = data?.pages.flatMap((page) => page.data) ?? [];
  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" /></div>;
  if (isError) return <EmptyState title="Failed to load posts" description="Something went wrong. Please refresh the page." />;
  if (posts.length === 0) return <EmptyState title="No posts yet" description="Be the first to post something!" />;
  return <PostList posts={posts} isFetchingNextPage={isFetchingNextPage} lastPostRef={lastPostRef} />;
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "explore">("feed");

  return (
    <>
      {/* Tabs */}
      <div className="w-full max-w-[600px] mx-auto px-4 mb-6">
        <div className="flex gap-1 bg-neutral-950 border border-neutral-900 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex-1 h-9 rounded-lg text-sm-bold transition-colors ${
              activeTab === "feed"
                ? "bg-brand-300 text-neutral-25"
                : "text-neutral-400 hover:text-neutral-25"
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex-1 h-9 rounded-lg text-sm-bold transition-colors ${
              activeTab === "explore"
                ? "bg-brand-300 text-neutral-25"
                : "text-neutral-400 hover:text-neutral-25"
            }`}
          >
            Explore
          </button>
        </div>
      </div>

      {activeTab === "feed" ? <FeedTab /> : <ExploreTab />}

      {/* Modals */}
      <div className="hidden md:block">
        <CommentModal />
      </div>
      <div className="md:hidden">
        <CommentSheet />
      </div>
      <LikedByModal />
    </>
  );
}
