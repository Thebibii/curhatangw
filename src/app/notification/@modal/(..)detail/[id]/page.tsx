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
import { useState } from "react";

export default function DetailModal() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [openModal, setOpenModal] = useState(true);
  const { data, isLoading, refetch } = useGetDetailPost({ postId: params.id });

  if (isMobile) {
    return (
      <Drawer
        defaultOpen={openModal}
        onOpenChange={(open) => {
          if (!open) {
            setOpenModal(false);
            router.back();
          }
        }}
      >
        <DrawerContent className="bg-bw " forceMount>
          <DrawerTitle>
            <VisuallyHidden />
          </DrawerTitle>
          <LoadingState
            data={data?.data}
            loadingFallback={<SkeletonCard length={1} />}
          >
            <div tabIndex={-1}>
              <PostDetail
                post={data?.data}
                isLoading={isLoading}
                dbUserId="id"
                refetch={refetch}
                isOpenModal={openModal}
                className="border-none"
              />
            </div>
          </LoadingState>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog
      open={openModal}
      onOpenChange={(open) => {
        if (!open) {
          setOpenModal(false);
          router.back();
        }
      }}
    >
      <DialogContent
        className="bg-bw lg:max-w-[65vw]  xl:max-w-[50vw]"
        forceMount
      >
        <DialogTitle>
          <VisuallyHidden />
        </DialogTitle>
        <LoadingState
          data={data?.data}
          loadingFallback={<SkeletonCard length={1} />}
        >
          <div tabIndex={-1}>
            <PostDetail
              post={data?.data}
              refetch={refetch}
              isLoading={isLoading}
              dbUserId="id"
              isOpenModal={openModal}
            />
          </div>
        </LoadingState>
      </DialogContent>
    </Dialog>
  );
}
