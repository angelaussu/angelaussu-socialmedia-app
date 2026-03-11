import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { feedApi, exploreApi, postsApi, likesApi, savesApi, usersApi } from "@/lib/api";
import { PaginatedResponse, Post } from "@/types";

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) =>
      feedApi.get(pageParam as number) as Promise<PaginatedResponse<Post>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function useExplore() {
  return useInfiniteQuery({
    queryKey: ["explore"],
    queryFn: ({ pageParam }) =>
      exploreApi.get(pageParam as number) as Promise<PaginatedResponse<Post>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => postsApi.getById(postId) as Promise<Post>,
    enabled: !!postId,
  });
}

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: ["userPosts", username],
    queryFn: ({ pageParam }) =>
      usersApi.getPosts(username, pageParam as number) as Promise<PaginatedResponse<Post>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!username,
  });
}

export function useMyLikes() {
  return useInfiniteQuery({
    queryKey: ["myLikes"],
    queryFn: ({ pageParam }) =>
      likesApi.getMyLikes(pageParam as number) as Promise<PaginatedResponse<Post>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function useUserLikes(username: string) {
  return useInfiniteQuery({
    queryKey: ["userLikes", username],
    queryFn: ({ pageParam }) =>
      usersApi.getLikes(username, pageParam as number) as Promise<PaginatedResponse<Post>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!username,
  });
}

export function useMySaved() {
  return useInfiniteQuery({
    queryKey: ["mySaved"],
    queryFn: ({ pageParam }) =>
      savesApi.getMySaved(pageParam as number) as Promise<PaginatedResponse<Post>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function useToggleLike(postId: string, isLiked: boolean, post?: Post) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => (isLiked ? likesApi.unlike(postId) : likesApi.like(postId)),
    onSuccess: (data: any) => {
      const newIsLiked = !isLiked;
      const newCount = data?.likeCount ?? undefined;
      // Update feed cache directly
      queryClient.setQueriesData({ queryKey: ["feed"] }, (old: any) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: Post) =>
              p.id === postId
                ? { ...p, isLiked: newIsLiked, likesCount: newCount ?? p.likesCount + (newIsLiked ? 1 : -1) }
                : p
            ),
          })),
        };
      });
      // Update myLikes cache directly
      if (post) {
        queryClient.setQueryData(["myLikes"], (old: any) => {
          if (!old?.pages) return old;
          if (newIsLiked) {
            // Add post to first page
            return {
              ...old,
              pages: old.pages.map((page: any, i: number) =>
                i === 0
                  ? { ...page, data: [{ ...post, isLiked: true }, ...page.data.filter((p: Post) => p.id !== postId)] }
                  : page
              ),
            };
          } else {
            // Remove post from all pages
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                data: page.data.filter((p: Post) => p.id !== postId),
              })),
            };
          }
        });
      }
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useToggleSave(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (currentlySaved: boolean) =>
      currentlySaved ? savesApi.unsave(postId) : savesApi.save(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      queryClient.invalidateQueries({ queryKey: ["mySaved"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
}
