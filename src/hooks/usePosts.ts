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

export function useToggleLike(postId: string, isLiked: boolean) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => (isLiked ? likesApi.unlike(postId) : likesApi.like(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useToggleSave(postId: string, isSaved: boolean) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => (isSaved ? savesApi.unsave(postId) : savesApi.save(postId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["mySaved"] });
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
