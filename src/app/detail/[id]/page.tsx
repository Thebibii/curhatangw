"use client";
import PostDetail from "@/components/post/detail/PostDetail";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import LoadingState from "@/components/state/LoadingState";
import { useGetDetailPost } from "@/hooks/reactQuery/posts/useGetDetailPost";
import { useParams } from "next/navigation";
import React from "react";

export default function Detail() {
  const params = useParams<{ id: string }>();

  const { data, isLoading, refetch } = useGetDetailPost({ postId: params.id });

  return (
    <LoadingState
      data={data?.data}
      loadingFallback={<SkeletonCard length={1} />}
    >
      {/* <p>p</p> */}
      <PostDetail
        post={data?.data}
        refetch={refetch}
        dbUserId="id"
        isLoading={isLoading}
      />
    </LoadingState>
  );
}
