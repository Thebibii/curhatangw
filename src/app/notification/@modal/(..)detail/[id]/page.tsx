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
import { useUserContext } from "@/contexts/UserContext";

export default function DetailModal() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user } = useUserContext();
  const [openModal, setOpenModal] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(true);
  const { data, isLoading, refetch } = useGetDetailPost({ postId: params.id });

  if (isMobile) {
    return (
      <Drawer
        open={openDrawer}
        onOpenChange={(open) => {
          if (!open) {
            setOpenDrawer(false);
            router.back();
          }
        }}
        // autoFocus={openDrawer}
      >
        <DrawerContent
          className="bg-bw "
          forceMount
          onOpenAutoFocus={(e) => e.preventDefault()}
          onClick={(e) => e.preventDefault()}
        >
          <DrawerTitle>
            <VisuallyHidden />
          </DrawerTitle>
          <LoadingState
            data={data?.data}
            loadingFallback={<SkeletonCard length={1} />}
          >
            <PostDetail
              post={data?.data}
              isLoading={isLoading}
              dbUserId={user?.data?.id}
              refetch={refetch}
              isOpenModal={openDrawer}
              className="border-none"
            />
          </LoadingState>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog
      open={openModal}
      onOpenChange={(open) => {
        if (!open && openModal) {
          setOpenModal(false);
          router.back();
        }
      }}
    >
      <DialogContent
        className="bg-bw lg:max-w-[65vw]  xl:max-w-[50vw]"
        forceMount
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle>
          <VisuallyHidden />
        </DialogTitle>
        <LoadingState
          data={data?.data}
          loadingFallback={<SkeletonCard length={1} />}
        >
          <PostDetail
            post={data?.data}
            refetch={refetch}
            isLoading={isLoading}
            dbUserId={user?.data?.id}
            isOpenModal={openModal}
          />
        </LoadingState>
      </DialogContent>
    </Dialog>
  );
}
