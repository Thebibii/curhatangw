"use client";

import { Icons } from "@/components/icons";
import LoadingState from "@/components/state/LoadingState";
import { NotificationsSkeleton } from "@/components/skeleton/NotificationCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetNotifications } from "@/hooks/reactQuery/notifications/useGetNotification.hook";
import { useReadNotifications } from "@/hooks/reactQuery/notifications/useReadNotifications.hook";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect } from "react";

export default function Notification() {
  const { data: notifications } = useGetNotifications();
  const { mutate: readNotifications } = useReadNotifications();

  useEffect(() => {
    const unreadIds = notifications?.data
      ?.filter((n: any) => !n.read)
      ?.map((n: any) => n.id);
    if (unreadIds?.length > 0) readNotifications(unreadIds);
  }, [notifications]);

  return (
    <LoadingState
      data={notifications?.data}
      loadingFallback={<NotificationsSkeleton />}
    >
      <div className="space-y-4">
        <Card className="bg-bw">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <span className="text-sm text-muted-foreground">
                {notifications?.data?.filter((n: any) => !n.read).length} unread
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(95vh-12rem)]">
              {notifications?.data?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications?.data?.map((notification: any) => (
                  <NotificationLink
                    key={notification.id}
                    type={notification.type}
                    postId={notification.post?.id}
                    commentId={notification.comment?.id}
                    creatorId={notification.creator.username}
                  >
                    <div
                      className={`flex items-start gap-4 p-4  border-b hover:bg-main/25 transition-colors ${
                        !notification.read && "bg-secondary/50"
                      }`}
                    >
                      <Avatar className="mt-1">
                        <AvatarImage
                          src={notification.creator.image ?? "/avatar.png"}
                          className="size-10 rounded-full"
                        />
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {getNotificationIcon(notification.type)}
                          <span className="group-hover:underline">
                            <span className="font-medium">
                              {notification.creator.name ??
                                notification.creator.username}
                            </span>{" "}
                            {notification.type === "FOLLOW"
                              ? "started following you"
                              : notification.type === "LIKE"
                              ? "liked your post"
                              : "commented on your post"}
                          </span>
                        </div>

                        {notification.post &&
                          (notification.type === "LIKE" ||
                            notification.type === "COMMENT") && (
                            <div className="pl-6 space-y-2 ">
                              <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                                <p>{notification.post.content}</p>
                                {notification.post.image && (
                                  <img
                                    src={notification.post.image}
                                    alt="Post content"
                                    className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                                  />
                                )}
                              </div>

                              {notification.type === "COMMENT" &&
                                notification.comment && (
                                  <div className="text-sm p-2 bg-accent/50 rounded-md">
                                    {notification.comment.content}
                                  </div>
                                )}
                            </div>
                          )}

                        <p className="text-sm text-muted-foreground pl-6">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </NotificationLink>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </LoadingState>
  );
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "LIKE":
      return <Icons.HeartIcon className="size-4 text-red-500" />;
    case "COMMENT":
      return <Icons.MessageCircleIcon className="size-4 text-blue-500" />;
    case "FOLLOW":
      return <Icons.UserPlusIcon className="size-4 text-green-500" />;
    default:
      return null;
  }
};

type TProps = {
  children: React.ReactNode;
  type: string;
  postId?: string;
  commentId?: string;
  creatorId?: string;
};

const NotificationLink: React.FC<TProps> = (props: TProps) => {
  switch (props.type) {
    case "LIKE":
      return (
        <Link href={`/detail/${props.postId}`} className="group">
          {props.children}
        </Link>
      );
    case "COMMENT":
      return (
        <Link href={`/detail/${props.postId}`} className="group">
          {props.children}
        </Link>
      );
    case "FOLLOW":
      return (
        <Link href={`/profile/${props.creatorId}`} className="group">
          {props.children}
        </Link>
      );
    default:
      return null;
  }
};
