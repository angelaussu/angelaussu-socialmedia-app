import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followApi } from "@/lib/api";
import { PaginatedResponse, FollowUser, UserProfile } from "@/types";

export function useFollowers(username: string) {
  return useInfiniteQuery({
    queryKey: ["followers", username],
    queryFn: ({ pageParam }) =>
      followApi.getFollowers(username, pageParam as number) as Promise<PaginatedResponse<FollowUser>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!username,
  });
}

export function useFollowing(username: string) {
  return useInfiniteQuery({
    queryKey: ["following", username],
    queryFn: ({ pageParam }) =>
      followApi.getFollowing(username, pageParam as number) as Promise<PaginatedResponse<FollowUser>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!username,
  });
}

export function useToggleFollow(username: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isFollowing: boolean) =>
      isFollowing ? followApi.unfollow(username) : followApi.follow(username),
    onMutate: async (isFollowing: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["profile", username] });
      const prevProfile = queryClient.getQueryData<UserProfile>(["profile", username]);

      queryClient.setQueryData<UserProfile>(["profile", username], (old) => {
        if (!old) return old;
        return {
          ...old,
          isFollowing: !isFollowing,
          followersCount: old.followersCount + (isFollowing ? -1 : 1),
        };
      });

      return { prevProfile };
    },
    onError: (_err, _isFollowing, context) => {
      if (context?.prevProfile) {
        queryClient.setQueryData(["profile", username], context.prevProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
      queryClient.invalidateQueries({ queryKey: ["followers", username] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
