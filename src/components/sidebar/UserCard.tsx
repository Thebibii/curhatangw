"use client";
import { Card, CardContent } from "../ui/card";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import LoadingState from "../LoadingState";
import { useUserContext } from "@/contexts/UserContext";

export default function UserCard() {
  const { user } = useUserContext();

  return (
    <Card className="bg-bw">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Link
            href={`/profile/${user?.data?.username}`}
            className="flex flex-col items-center justify-center"
          >
            <Avatar className="w-20 h-20 border-2 ">
              <AvatarImage src={user?.data?.image} />
              <AvatarFallback>{user?.data?.name[0]}</AvatarFallback>
            </Avatar>

            <div className="mt-4 space-y-1 flex flex-col items-center">
              <LoadingState
                data={user?.data}
                loadingFallback={<Skeleton className="w-28 h-4 " />}
              >
                <h3 className="font-semibold">{user?.data?.name}</h3>
              </LoadingState>
              <LoadingState
                data={user?.data}
                loadingFallback={<Skeleton className="w-32 h-4 " />}
              >
                <p className="text-sm text-muted-foreground">
                  {user?.data?.username}
                </p>
              </LoadingState>
            </div>
          </Link>

          {user?.data?.bio && (
            <p className="mt-3 text-sm text-muted-foreground">
              {user?.data?.bio}
            </p>
          )}

          <div className="w-full">
            <Separator className="my-4" />
            <div className="flex justify-between">
              <div>
                <p className="font-medium">
                  {user?.data?._count.following ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="font-medium">
                  {user?.data?._count.followers ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
            </div>
            <Separator className="my-4" />
          </div>

          <div className="w-full space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="w-4 h-4 mr-2 shrink-0" />
              <LoadingState
                data={user?.data}
                loadingFallback={<Skeleton className="w-full h-4" />}
              >
                <p>{user?.data?.location || "No location"}</p>
              </LoadingState>
            </div>
            <div className="flex items-center text-muted-foreground">
              <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
              <LoadingState
                data={user?.data}
                loadingFallback={<Skeleton className="w-full h-4" />}
              >
                {user?.data?.website ? (
                  <a
                    href={
                      user?.data?.website.startsWith("http")
                        ? user?.data?.website
                        : `https://${user?.data?.website}`
                    }
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user?.data?.website}
                  </a>
                ) : (
                  <span>No website</span>
                )}
              </LoadingState>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
