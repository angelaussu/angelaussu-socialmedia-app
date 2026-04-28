# Sociality

A dark-themed social media web app where users can post photos, follow each other, like and comment on posts.

**Live Demo:** [https://angelaussu-socialmedia-app.vercel.app](https://angelaussu-socialmedia-app.vercel.app)

## Tech Stack

- **Next.js 16** — App Router, TypeScript
- **Tailwind CSS v4** — utility-first styling with custom design tokens
- **Redux Toolkit** — global auth & UI state management
- **TanStack Query v5** — server state, data fetching, and cache management
- **React Hook Form + Zod** — form handling and validation
- **shadcn/ui** — base UI components
- **iconsax-react** — icon library
- **dayjs** — date formatting
- **emoji-picker-react** — emoji support in comments

## Features

- Register & login
- Browse feed and explore posts with infinite scroll (no duplicates)
- Like, comment, and save posts
- Follow / unfollow users
- Search users with debounce
- Create posts — appears in feed instantly without page reload
- Edit profile (name, username, bio, avatar)
- Share profile link to clipboard
- View followers & following lists
- Liked and saved posts tabs on profile

## State Management Architecture

- **Redux** — auth user and UI state only (modals, alerts)
- **TanStack Query** — all server state with proper cache invalidation
- **localStorage** — like/save interaction persistence across page refreshes

## Optimistic UI

All social actions update the UI instantly before the server responds, with automatic rollback on error:

- **Like / Unlike** — heart icon and count update immediately; cache rolled back on failure
- **Save / Unsave** — bookmark icon updates immediately; cache rolled back on failure
- **Follow / Unfollow** — button and follower count update immediately; cache rolled back on failure
- **Delete comment** — comment removed instantly and `commentsCount` decremented in feed
- **Create comment** — comment appears immediately and `commentsCount` incremented in feed
- **Create post** — new post prepended to feed without waiting for a refetch

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment

The app connects to a hosted REST API. No additional environment setup is required for local development.
