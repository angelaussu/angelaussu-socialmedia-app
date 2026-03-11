import Image from "next/image";
import Link from "next/link";
import { UserProfile } from "@/types";
import ProfileStats from "./ProfileStats";
import FollowButton from "@/components/user/FollowButton";
import Button from "@/components/ui/Button";

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwn?: boolean;
}

export default function ProfileHeader({ profile, isOwn = false }: ProfileHeaderProps) {
  const stats = [
    { label: "Posts", value: profile.postsCount },
    { label: "Followers", value: profile.followersCount },
    { label: "Following", value: profile.followingCount },
    ...(profile.likesCount !== undefined
      ? [{ label: "Likes", value: profile.likesCount }]
      : []),
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-6 border-b border-neutral-900">
      {/* Avatar */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center shrink-0">
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt={profile.name}
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
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-1">
          <h1 className="text-xl-bold text-neutral-25">{profile.name}</h1>
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
        </div>
        <p className="text-md-regular text-neutral-400 mb-4">
          @{profile.username}
        </p>
        {profile.bio && (
          <p className="text-md-regular text-neutral-25 mb-4">{profile.bio}</p>
        )}
        <ProfileStats stats={stats} />
      </div>
    </div>
  );
}
