"use client";

import Image from "next/image";
import Link from "next/link";
import { Send2 } from "iconsax-react";
import { UserProfile } from "@/types";
import ProfileStats from "./ProfileStats";
import FollowButton from "@/components/user/FollowButton";
import Button from "@/components/ui/Button";
import { useAppDispatch } from "@/store/hooks";
import { showAlert } from "@/store/uiSlice";

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwn?: boolean;
}

export default function ProfileHeader({
  profile,
  isOwn = false,
}: ProfileHeaderProps) {
  const dispatch = useAppDispatch();

  function handleShareProfile() {
    const url = `${window.location.origin}/profile/${profile.username}`;
    navigator.clipboard.writeText(url).then(() => {
      dispatch(showAlert({ message: "Profile link copied!", type: "success" }));
    });
  }
  const stats = [
    { label: "Posts", value: profile.postsCount },
    { label: "Followers", value: profile.followersCount },
    { label: "Following", value: profile.followingCount },
    ...(profile.likesCount !== undefined
      ? [{ label: "Likes", value: profile.likesCount }]
      : []),
  ];

  return (
    <div className="flex items-start gap-5 pb-6 border-b border-neutral-900">
      {/* Avatar */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center shrink-0">
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt={profile.name ?? "avatar"}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-display-xs text-neutral-400">
            {profile.name?.[0]?.toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Name + Buttons row */}
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <h1 className="text-xl-bold text-neutral-25">{profile.name}</h1>
          <div className="flex items-center gap-2 ml-auto">
            {isOwn ? (
              <Link href="/me/edit">
                <Button variant="outline" className="h-9 px-5 text-sm-bold">
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <FollowButton
                username={profile.username}
                isFollowing={profile.isFollowing ?? false}
              />
            )}
            <button
              onClick={handleShareProfile}
              className="w-9 h-9 rounded-full border border-neutral-900 flex items-center justify-center text-neutral-400 hover:text-neutral-25 transition-colors"
            >
              <Send2 size={16} color="currentColor" />
            </button>
          </div>
        </div>

        {/* Username */}
        <p className="text-md-regular text-neutral-400 mb-2">
          {profile.username}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p className="text-md-regular text-neutral-25 mb-4">{profile.bio}</p>
        )}

        {/* Stats */}
        <ProfileStats stats={stats} />
      </div>
    </div>
  );
}
