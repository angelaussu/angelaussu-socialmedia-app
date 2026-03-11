"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { store } from "@/store/store";
import { setUser, logout, setAuthLoading } from "@/store/authSlice";
import { profileApi, getToken, removeToken } from "@/lib/api";
import { User } from "@/types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1 },
  },
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      profileApi
        .getMe()
        .then((data) => store.dispatch(setUser(data as User)))
        .catch(() => {
          removeToken();
          store.dispatch(logout());
        })
        .finally(() => setReady(true));
    } else {
      store.dispatch(setAuthLoading(false));
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-black">
        <div className="w-8 h-8 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>{children}</AuthInitializer>
      </QueryClientProvider>
    </Provider>
  );
}
