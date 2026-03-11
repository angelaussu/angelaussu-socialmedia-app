import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followApi } from "@/lib/api";
import { PaginatedResponse, FollowUser } from "@/types";

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

export function useToggleFollow(username: string, isFollowing: boolean) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      isFollowing ? followApi.unfollow(username) : followApi.follow(username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });
}
