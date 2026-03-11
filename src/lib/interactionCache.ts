// Local cache for liked/saved post state (persists in localStorage)
import { Post } from "@/types";

const LIKED_KEY = "sociality_liked";
const SAVED_KEY = "sociality_saved";
const LIKED_POSTS_KEY = "sociality_liked_posts";
const SAVED_POSTS_KEY = "sociality_saved_posts";

function getSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const data = localStorage.getItem(key);
    return new Set(data ? JSON.parse(data) : []);
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function getPosts(key: string): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function savePosts(key: string, posts: Post[]) {
  // Keep max 100 posts to avoid localStorage bloat
  localStorage.setItem(key, JSON.stringify(posts.slice(0, 100)));
}

export function getCachedLiked(postId: string): boolean {
  return getSet(LIKED_KEY).has(postId);
}

export function getCachedSaved(postId: string): boolean {
  return getSet(SAVED_KEY).has(postId);
}

export function setCachedLiked(postId: string, liked: boolean, post?: Post) {
  const set = getSet(LIKED_KEY);
  liked ? set.add(postId) : set.delete(postId);
  saveSet(LIKED_KEY, set);

  if (post) {
    const posts = getPosts(LIKED_POSTS_KEY);
    if (liked) {
      const exists = posts.some((p) => p.id === postId);
      if (!exists) savePosts(LIKED_POSTS_KEY, [post, ...posts]);
    } else {
      savePosts(LIKED_POSTS_KEY, posts.filter((p) => p.id !== postId));
    }
  }
}

export function setCachedSaved(postId: string, saved: boolean, post?: Post) {
  const set = getSet(SAVED_KEY);
  saved ? set.add(postId) : set.delete(postId);
  saveSet(SAVED_KEY, set);

  if (post) {
    const posts = getPosts(SAVED_POSTS_KEY);
    if (saved) {
      const exists = posts.some((p) => p.id === postId);
      if (!exists) savePosts(SAVED_POSTS_KEY, [post, ...posts]);
    } else {
      savePosts(SAVED_POSTS_KEY, posts.filter((p) => p.id !== postId));
    }
  }
}

export function getCachedLikedPosts(): Post[] {
  return getPosts(LIKED_POSTS_KEY);
}

export function getCachedSavedPosts(): Post[] {
  return getPosts(SAVED_POSTS_KEY);
}
