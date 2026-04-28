import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "@/lib/api";
import { PaginatedResponse, Comment, Post } from "@/types";

export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) =>
      commentsApi.getComments(postId, pageParam as number) as Promise<PaginatedResponse<Comment>>,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!postId,
  });
}

function incrementCommentCount(queryClient: ReturnType<typeof useQueryClient>, postId: string, delta: number) {
  const updatePages = (old: { pages: PaginatedResponse<Post>[] } | undefined) => {
    if (!old?.pages) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.map((p) =>
          p.id === postId ? { ...p, commentsCount: Math.max(0, p.commentsCount + delta) } : p
        ),
      })),
    };
  };
  queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["feed"] }, updatePages);
  queryClient.setQueriesData<{ pages: PaginatedResponse<Post>[] }>({ queryKey: ["explore"] }, updatePages);
  queryClient.setQueryData<Post>(["post", postId], (old) =>
    old ? { ...old, commentsCount: Math.max(0, old.commentsCount + delta) } : old
  );
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => commentsApi.create(postId, { text }),
    onSuccess: (newComment) => {
      // Add new comment to top of comments cache
      queryClient.setQueryData<{ pages: PaginatedResponse<Comment>[] }>(["comments", postId], (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, data: [newComment, ...page.data] } : page
          ),
        };
      });
      // Sync commentsCount in feed/post caches
      incrementCommentCount(queryClient, postId, 1);
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentsApi.delete(commentId),
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const prevComments = queryClient.getQueryData(["comments", postId]);

      // Remove comment from cache immediately
      queryClient.setQueryData<{ pages: PaginatedResponse<Comment>[] }>(["comments", postId], (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((c) => c.id !== commentId),
          })),
        };
      });
      // Sync commentsCount down
      incrementCommentCount(queryClient, postId, -1);

      return { prevComments };
    },
    onError: (_err, _commentId, context) => {
      if (context?.prevComments) {
        queryClient.setQueryData(["comments", postId], context.prevComments);
      }
      incrementCommentCount(queryClient, postId, 1);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}
