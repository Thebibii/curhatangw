"use client";
import LoadingState from "@/components/state/LoadingState";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useGetDetailPost } from "@/hooks/reactQuery/posts/useGetDetailPost";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import PostDetail from "@/components/post/detail/PostDetail";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

export default function DetailModal() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { data, isLoading } = useGetDetailPost({ postId: params.id });
  console.log(isMobile);

  if (isMobile) {
    return (
      <Drawer
        open
        onOpenChange={(open) => {
          if (!open) {
            router.back();
          }
        }}
      >
        <DrawerTitle>
          <VisuallyHidden />
        </DrawerTitle>
        <DrawerContent>
          <LoadingState
            data={data?.data}
            loadingFallback={<SkeletonCard length={1} />}
          >
            <PostDetail post={data?.data} isLoading={isLoading} dbUserId="id" />
          </LoadingState>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent className="bg-bw lg:max-w-[65vw]  xl:max-w-[50vw]">
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
