import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, profileApi } from "@/lib/api";
import { UserProfile, User } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/authSlice";

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => usersApi.getProfile(username) as Promise<UserProfile>,
    enabled: !!username,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => profileApi.getMe() as Promise<UserProfile>,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (data: FormData) => {
      await profileApi.updateMe(data);
      return profileApi.getMe();
    },
    onSuccess: (profile) => {
      dispatch(setUser(profile as User));
      queryClient.setQueryData(["me"], profile);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
