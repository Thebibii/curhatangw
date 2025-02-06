"use client";
import LoadingState from "@/components/LoadingState";
import PostCard from "@/components/post/PostCard";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useGetDetailPost } from "@/hooks/reactQuery/posts/useGetDetailPost";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type TProps = {
  children?: React.ReactNode;
};
export default function DetailModal(props: TProps) {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data } = useGetDetailPost({ postId: params.id });

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="bg-bw">
        <DialogTitle>
          <VisuallyHidden />
        </DialogTitle>
        <LoadingState
          data={data?.data}
          loadingFallback={<SkeletonCard length={1} />}
        >
          <PostCard post={data?.data} dbUserId="id" />
        </LoadingState>
      </DialogContent>
    </Dialog>
  );
}
