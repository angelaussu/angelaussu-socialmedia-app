"use client";

import { useState } from "react";
import { useMyProfile } from "@/hooks/useProfile";
import { useUserPosts, useMyLikes, useMySaved } from "@/hooks/usePosts";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import GalleryGrid from "@/components/profile/GalleryGrid";
import { Post } from "@/types";

const TABS = [
  { key: "gallery", label: "Gallery" },
  { key: "saved", label: "Saved" },
  { key: "liked", label: "Liked" },
];

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState("gallery");
  const { data: profile, isLoading } = useMyProfile();

  const { data: postsData } = useUserPosts(profile?.username ?? "");
  const { data: savedData } = useMySaved();
  const { data: likedData } = useMyLikes();

  const posts = postsData?.pages.flatMap((p) => p.data) ?? [];
  const saved = savedData?.pages.flatMap((p) => p.data) ?? [];
  const liked = likedData?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const displayPosts: Post[] =
    activeTab === "gallery" ? posts : activeTab === "saved" ? saved : liked;

  return (
    <div className="w-full max-w-[812px] mx-auto px-4">
      <ProfileHeader profile={profile} isOwn />
      <div className="mt-6">
        <ProfileTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-4">
          <GalleryGrid posts={displayPosts} />
        </div>
      </div>
    </div>
  );
}
