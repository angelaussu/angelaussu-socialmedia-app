import { User, UserProfile, Post, Comment, FollowUser, PaginatedResponse, AuthResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://be-social-media-api-production.up.railway.app";

// ── Token Management ──────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sociality_token");
}
export function setToken(token: string): void {
  localStorage.setItem("sociality_token", token);
}
export function removeToken(): void {
  localStorage.removeItem("sociality_token");
}

// ── Base Fetch ────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  const json = await response.json().catch(() => ({ message: "Something went wrong" }));
  if (!response.ok) {
    throw { message: json.message || "Request failed", statusCode: response.status, data: json.data };
  }
  // API wraps all responses in { success, message, data }
  return (json.data ?? json) as T;
}

// ── Normalizers ───────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeUser(u: any): User {
  return {
    id: String(u.id),
    name: u.name,
    username: u.username,
    email: u.email,
    phone: u.phone,
    bio: u.bio,
    avatar: u.avatarUrl ?? u.avatar,
    createdAt: u.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeUserProfile(u: any): UserProfile {
  return {
    ...normalizeUser(u),
    postsCount: u.postsCount ?? 0,
    followersCount: u.followersCount ?? 0,
    followingCount: u.followingCount ?? 0,
    likesCount: u.likesCount,
    isFollowing: u.isFollowedByMe ?? u.isFollowing,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePost(p: any): Post {
  return {
    id: String(p.id),
    caption: p.caption,
    image: p.imageUrl ?? p.image,
    author: normalizeUser(p.author ?? p.user ?? {}),
    likesCount: p.likeCount ?? p.likesCount ?? 0,
    commentsCount: p.commentCount ?? p.commentsCount ?? 0,
    isLiked: p.likedByMe ?? p.isLiked ?? false,
    isSaved: p.savedByMe ?? p.isSaved ?? false,
    createdAt: p.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeComment(c: any): Comment {
  return {
    id: String(c.id),
    text: c.text ?? c.content,
    author: normalizeUser(c.author ?? c.user ?? {}),
    postId: String(c.postId),
    createdAt: c.createdAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeFollowUser(u: any): FollowUser {
  return {
    id: String(u.id),
    name: u.name,
    username: u.username,
    avatar: u.avatarUrl ?? u.avatar,
    isFollowing: u.isFollowedByMe ?? u.isFollowing,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePaginated<T>(items: T[], pagination: any): PaginatedResponse<T> {
  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  return {
    data: items,
    page,
    limit: pagination?.limit ?? 10,
    total: pagination?.total ?? items.length,
    hasMore: page < totalPages,
  };
}

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; username: string; phone: string; password: string }) =>
    apiRequest<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
    return {
      token: raw.token ?? raw.accessToken,
      user: normalizeUser(raw.user ?? raw),
    };
  },
};

// ── Profile ───────────────────────────────────────────────
export const profileApi = {
  getMe: async (): Promise<UserProfile> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>("/api/me");
    // API returns { profile: { id, name, username, email, ... }, stats: { posts, followers, following, likes } }
    const profile = raw.profile ?? raw;
    const stats = raw.stats ?? {};
    const merged = {
      ...profile,
      postsCount: stats.posts ?? profile.postsCount ?? 0,
      followersCount: stats.followers ?? profile.followersCount ?? 0,
      followingCount: stats.following ?? profile.followingCount ?? 0,
      likesCount: stats.likes ?? profile.likesCount,
    };
    return normalizeUserProfile(merged);
  },

  updateMe: async (data: FormData) => {
    // If there's an avatar file, send as multipart FormData; otherwise send as JSON
    if (data.has("avatar") && (data.get("avatar") as File)?.size > 0) {
      return apiRequest("/api/me", { method: "PATCH", body: data });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json: Record<string, any> = {};
    data.forEach((value, key) => { if (key !== "avatar") json[key] = value; });
    return apiRequest("/api/me", { method: "PATCH", body: JSON.stringify(json) });
  },
};

// ── Users ─────────────────────────────────────────────────
export const usersApi = {
  search: async (query: string): Promise<FollowUser[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/users/search?q=${encodeURIComponent(query)}`);
    const items = Array.isArray(raw) ? raw : (raw.users ?? raw.items ?? raw.data ?? []);
    return items.map(normalizeFollowUser);
  },

  getProfile: async (username: string): Promise<UserProfile> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/users/${username}`);
    return normalizeUserProfile(raw);
  },

  getPosts: async (username: string, page = 1): Promise<PaginatedResponse<Post>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/users/${username}/posts?page=${page}`);
    const items = (raw.items ?? raw.posts ?? raw.data ?? []).map(normalizePost);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },

  getLikes: async (username: string, page = 1): Promise<PaginatedResponse<Post>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/users/${username}/likes?page=${page}`);
    const items = (raw.items ?? raw.posts ?? raw.data ?? []).map(normalizePost);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },
};

// ── Feed ──────────────────────────────────────────────────
export const feedApi = {
  get: async (page = 1): Promise<PaginatedResponse<Post>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/feed?page=${page}`);
    const items = (raw.items ?? raw.posts ?? raw.data ?? []).map(normalizePost);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },
};


// ── Explore ───────────────────────────────────────────────
export const exploreApi = {
  get: async (page = 1): Promise<PaginatedResponse<Post>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/posts?page=${page}`);
    const items = (raw.items ?? raw.posts ?? raw.data ?? []).map(normalizePost);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },
};

// ── Posts ─────────────────────────────────────────────────
export const postsApi = {
  create: async (data: FormData): Promise<Post> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>("/api/posts", { method: "POST", body: data });
    return normalizePost(raw.post ?? raw);
  },

  getById: async (id: string): Promise<Post> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/posts/${id}`);
    return normalizePost(raw.post ?? raw);
  },

  delete: (id: string) => apiRequest(`/api/posts/${id}`, { method: "DELETE" }),
};

// ── Likes ─────────────────────────────────────────────────
export const likesApi = {
  like: (postId: string) => apiRequest(`/api/posts/${postId}/like`, { method: "POST" }),
  unlike: (postId: string) => apiRequest(`/api/posts/${postId}/like`, { method: "DELETE" }),

  getLikes: async (postId: string, page = 1): Promise<PaginatedResponse<FollowUser>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/posts/${postId}/likes?page=${page}`);
    const items = (raw.items ?? raw.users ?? raw.data ?? []).map(normalizeFollowUser);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },

  getMyLikes: async (page = 1): Promise<PaginatedResponse<Post>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/me/likes?page=${page}`);
    const items = (raw.items ?? raw.posts ?? raw.data ?? []).map(normalizePost);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },
};

// ── Comments ──────────────────────────────────────────────
export const commentsApi = {
  getComments: async (postId: string, page = 1): Promise<PaginatedResponse<Comment>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/posts/${postId}/comments?page=${page}`);
    const items = (raw.items ?? raw.comments ?? raw.data ?? []).map(normalizeComment);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },

  create: async (postId: string, data: { text: string }): Promise<Comment> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/posts/${postId}/comments`, { method: "POST", body: JSON.stringify(data) });
    return normalizeComment(raw.comment ?? raw);
  },

  delete: (commentId: string) => apiRequest(`/api/comments/${commentId}`, { method: "DELETE" }),
};

// ── Follow ────────────────────────────────────────────────
export const followApi = {
  follow: (username: string) => apiRequest(`/api/follow/${username}`, { method: "POST" }),
  unfollow: (username: string) => apiRequest(`/api/follow/${username}`, { method: "DELETE" }),

  getFollowers: async (username: string, page = 1): Promise<PaginatedResponse<FollowUser>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/users/${username}/followers?page=${page}`);
    const items = (raw.items ?? raw.users ?? raw.followers ?? raw.data ?? []).map(normalizeFollowUser);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },

  getFollowing: async (username: string, page = 1): Promise<PaginatedResponse<FollowUser>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/users/${username}/following?page=${page}`);
    const items = (raw.items ?? raw.users ?? raw.following ?? raw.data ?? []).map(normalizeFollowUser);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },

  getMyFollowers: async (page = 1): Promise<PaginatedResponse<FollowUser>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/me/followers?page=${page}`);
    const items = (raw.items ?? raw.users ?? raw.followers ?? raw.data ?? []).map(normalizeFollowUser);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },

  getMyFollowing: async (page = 1): Promise<PaginatedResponse<FollowUser>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/me/following?page=${page}`);
    const items = (raw.items ?? raw.users ?? raw.following ?? raw.data ?? []).map(normalizeFollowUser);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },
};

// ── Saves ─────────────────────────────────────────────────
export const savesApi = {
  save: (postId: string) => apiRequest(`/api/posts/${postId}/save`, { method: "POST" }),
  unsave: (postId: string) => apiRequest(`/api/posts/${postId}/save`, { method: "DELETE" }),

  getMySaved: async (page = 1): Promise<PaginatedResponse<Post>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await apiRequest<any>(`/api/me/saved?page=${page}`);
    const items = (raw.items ?? raw.posts ?? raw.data ?? []).map(normalizePost);
    return normalizePaginated(items, raw.pagination ?? raw.meta);
  },
};

export { API_BASE_URL };
