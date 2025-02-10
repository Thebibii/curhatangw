"use client";
import LoadingState from "@/components/state/LoadingState";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useGetDetailPost } from "@/hooks/reactQuery/posts/useGetDetailPost";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import PostDetail from "@/components/post/detail/PostDetail";

export default function DetailModal() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useGetDetailPost({ postId: params.id });

  return (
    <Dialog
      open={true}
      // modal={false}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="bg-bw max-w-[50vw]">
        <DialogTitle>
          <VisuallyHidden />
        </DialogTitle>
        <LoadingState
          data={data?.data}
          loadingFallback={<SkeletonCard length={1} />}
        >
          <PostDetail post={data?.data} isLoading={isLoading} dbUserId="id" />
        </LoadingState>
      </DialogContent>
    </Dialog>
  );
}
