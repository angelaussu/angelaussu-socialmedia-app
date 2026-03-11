"use client";

import { useState } from "react";
import { use } from "react";
import { useUserProfile } from "@/hooks/useProfile";
import { useUserPosts, useUserLikes } from "@/hooks/usePosts";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import GalleryGrid from "@/components/profile/GalleryGrid";
import { Post } from "@/types";

const TABS = [
  { key: "gallery", label: "Gallery" },
  { key: "liked", label: "Liked" },
];

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [activeTab, setActiveTab] = useState("gallery");
  const { data: profile, isLoading } = useUserProfile(username);
  const { data: postsData } = useUserPosts(username);
  const { data: likesData } = useUserLikes(username);

  const posts = postsData?.pages.flatMap((p) => p.data) ?? [];
  const liked = likesData?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-md-regular text-neutral-400">User not found</p>
      </div>
    );
  }

  const displayPosts: Post[] = activeTab === "gallery" ? posts : liked;

  return (
    <div className="w-full max-w-[812px] mx-auto px-4">
      <ProfileHeader profile={profile} isOwn={false} />
      <div className="mt-6">
        <ProfileTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-4">
          <GalleryGrid posts={displayPosts} />
        </div>
      </div>
    </div>
  );
}
