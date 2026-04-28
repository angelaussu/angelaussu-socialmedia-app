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

function updatePostInPages(pages: PaginatedResponse<Post>[], postId: string, updater: (p: Post) => Post) {
  return pages.map((page) => ({
    ...page,
    data: page.data.map((p) => (p.id === postId ? updater(p) : p)),
  }));
}

export function useToggleLike(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isLiked: boolean) =>
      isLiked ? likesApi.unlike(postId) : likesApi.like(postId),
    onMutate: async (isLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      await queryClient.cancelQueries({ queryKey: ["explore"] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      const prevFeed = queryClient.getQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["feed"] });
      const prevExplore = queryClient.getQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["explore"] });
      const prevPost = queryClient.getQueryData<Post>(["post", postId]);

      const newIsLiked = !isLiked;
      const update = (p: Post) => ({
        ...p,
        isLiked: newIsLiked,
        likesCount: p.likesCount + (newIsLiked ? 1 : -1),
      });

      queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["feed"] }, (old) => {
        if (!old?.pages) return old;
        return { ...old, pages: updatePostInPages(old.pages, postId, update) };
      });
      queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["explore"] }, (old) => {
        if (!old?.pages) return old;
        return { ...old, pages: updatePostInPages(old.pages, postId, update) };
      });
      if (prevPost) {
        queryClient.setQueryData<Post>(["post", postId], update(prevPost));
      }

      return { prevFeed, prevExplore, prevPost };
    },
    onError: (_err, _isLiked, context) => {
      context?.prevFeed?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      context?.prevExplore?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      if (context?.prevPost) queryClient.setQueryData(["post", postId], context.prevPost);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useToggleSave(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isSaved: boolean) =>
      isSaved ? savesApi.unsave(postId) : savesApi.save(postId),
    onMutate: async (isSaved: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      await queryClient.cancelQueries({ queryKey: ["explore"] });

      const prevFeed = queryClient.getQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["feed"] });
      const prevExplore = queryClient.getQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["explore"] });

      const newIsSaved = !isSaved;
      const update = (p: Post) => ({ ...p, isSaved: newIsSaved });

      queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["feed"] }, (old) => {
        if (!old?.pages) return old;
        return { ...old, pages: updatePostInPages(old.pages, postId, update) };
      });
      queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["explore"] }, (old) => {
        if (!old?.pages) return old;
        return { ...old, pages: updatePostInPages(old.pages, postId, update) };
      });

      return { prevFeed, prevExplore };
    },
    onError: (_err, _isSaved, context) => {
      context?.prevFeed?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      context?.prevExplore?.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mySaved"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => postsApi.create(formData),
    onSuccess: (newPost) => {
      queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["feed"] }, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, data: [newPost, ...page.data] } : page
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => postsApi.delete(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] });
      const prevFeed = queryClient.getQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["feed"] });
      queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["feed"] }, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((p) => p.id !== postId),
          })),
        };
      });
      return { prevFeed };
    },
    onError: (_err, _postId, context) => {
      context?.prevFeed?.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
}
