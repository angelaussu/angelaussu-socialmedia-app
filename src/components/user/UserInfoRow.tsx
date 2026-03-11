import Image from "next/image";
import Link from "next/link";
import { FollowUser } from "@/types";
import FollowButton from "./FollowButton";

interface UserInfoRowProps {
  user: FollowUser;
  showFollow?: boolean;
}

export default function UserInfoRow({ user, showFollow = true }: UserInfoRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-900 last:border-0">
      <Link href={`/profile/${user.username}`} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center shrink-0">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <span className="text-sm-bold text-neutral-400">
              {user.name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm-bold text-neutral-25">{user.name}</p>
          <p className="text-sm-regular text-neutral-400">@{user.username}</p>
        </div>
      </Link>
      {showFollow && (
        <FollowButton
          username={user.username}
          isFollowing={user.isFollowing ?? false}
          small
        />
      )}
    </div>
  );
}
