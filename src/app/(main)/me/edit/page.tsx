"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema, EditProfileFormData } from "@/schemas";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useUpdateProfile } from "@/hooks/useProfile";
import { showAlert } from "@/store/uiSlice";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { ArrowLeft2, Camera } from "iconsax-react";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { mutate, isPending } = useUpdateProfile();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        email: user.email ?? "",
        phone: user.phone ?? "",
        bio: user.bio ?? "",
      });
    }
  }, [user, reset]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  function onSubmit(data: EditProfileFormData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (avatarFile) formData.append("avatar", avatarFile);

    mutate(formData, {
      onSuccess: () => {
        dispatch(showAlert({ message: "Profile updated!", type: "success" }));
        router.push("/me");
      },
      onError: (err: unknown) => {
        const apiErr = err as { message?: string };
        dispatch(
          showAlert({
            message: apiErr?.message || "Update failed",
            type: "error",
          })
        );
      },
    });
  }

  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      {/* Back */}
      <Link
        href="/me"
        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-25 mb-6 transition-colors"
      >
        <ArrowLeft2 size={20} color="currentColor" />
        <span className="text-sm-regular">Back</span>
      </Link>

      <h1 className="text-xl-bold text-neutral-25 mb-8">Edit Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center">
            {avatarPreview || user?.avatar ? (
              <Image
                src={avatarPreview ?? user!.avatar!}
                alt="Avatar"
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xl-bold text-neutral-400">
                {user?.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand-300 flex items-center justify-center cursor-pointer">
            <Camera size={14} color="white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
        <div>
          <p className="text-md-bold text-neutral-25">{user?.name}</p>
          <p className="text-sm-regular text-neutral-400">@{user?.username}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <InputField
          label="Full Name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
        />
        <InputField
          label="Username"
          placeholder="Your username"
          error={errors.username?.message}
          {...register("username")}
        />
        <InputField
          label="Email"
          type="email"
          placeholder="Your email"
          error={errors.email?.message}
          {...register("email")}
        />
        <InputField
          label="Phone"
          type="tel"
          placeholder="Your phone number"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm-bold text-neutral-25">Bio</label>
          <textarea
            placeholder="Tell people about yourself..."
            className="w-full h-24 px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-900
              text-md-regular text-neutral-25 placeholder:text-neutral-600
              outline-none focus:border-brand-200 transition-colors resize-none"
            {...register("bio")}
          />
          {errors.bio && (
            <span className="text-sm-regular text-red-400">
              {errors.bio.message}
            </span>
          )}
        </div>

        <Button type="submit" fullWidth isLoading={isPending} className="mt-2">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
