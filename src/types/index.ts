// ── Auth ──────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ── User ──────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface UserProfile extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesCount?: number;
  isFollowing?: boolean;
}

export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  phone?: string;
  email?: string;
  bio?: string;
  avatar?: File;
}

// ── Post ──────────────────────────────────────────────────
export interface Post {
  id: string;
  caption: string;
  image: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface CreatePostPayload {
  image: File;
  caption: string;
}

// ── Comment ───────────────────────────────────────────────
export interface Comment {
  id: string;
  text: string;
  author: User;
  postId: string;
  createdAt: string;
}

export interface CreateCommentPayload {
  text: string;
}

// ── Follow ────────────────────────────────────────────────
export interface FollowUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isFollowing?: boolean;
}

// ── Pagination ────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// ── API Error ─────────────────────────────────────────────
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
