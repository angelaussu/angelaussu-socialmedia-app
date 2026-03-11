"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema, CreatePostFormData } from "@/schemas";
import { postsApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { showAlert } from "@/store/uiSlice";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft2, GalleryAdd } from "iconsax-react";

export default function CreatePostPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function onSubmit(data: CreatePostFormData) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("image", data.image as File);
      formData.append("caption", data.caption);
      await postsApi.create(formData);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      dispatch(showAlert({ message: "Post created!", type: "success" }));
      router.push("/feed");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      dispatch(
        showAlert({
          message: apiErr?.message || "Failed to create post",
          type: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      <Link
        href="/feed"
        className="flex items-center gap-2 text-neutral-400 hover:text-neutral-25 mb-6 transition-colors"
      >
        <ArrowLeft2 size={20} color="currentColor" />
        <span className="text-sm-regular">Back</span>
      </Link>

      <h1 className="text-xl-bold text-neutral-25 mb-8">Create Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Image upload */}
        <div>
          <label className="text-sm-bold text-neutral-25 block mb-1.5">
            Image
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full h-64 rounded-xl border-2 border-dashed border-neutral-900
              flex flex-col items-center justify-center gap-3 cursor-pointer
              hover:border-brand-200 transition-colors overflow-hidden relative bg-neutral-950"
          >
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <>
                <GalleryAdd size={40} color="#535862" />
                <p className="text-md-regular text-neutral-600">
                  Click to upload an image
                </p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          {errors.image && (
            <span className="text-sm-regular text-red-400 mt-1 block">
              {String(errors.image.message)}
            </span>
          )}
        </div>

        {/* Caption */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm-bold text-neutral-25">Caption</label>
          <textarea
            placeholder="Write a caption..."
            className="w-full h-28 px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-900
              text-md-regular text-neutral-25 placeholder:text-neutral-600
              outline-none focus:border-brand-200 transition-colors resize-none"
            {...register("caption")}
          />
          {errors.caption && (
            <span className="text-sm-regular text-red-400">
              {errors.caption.message}
            </span>
          )}
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Share Post
        </Button>
      </form>
    </div>
  );
}
