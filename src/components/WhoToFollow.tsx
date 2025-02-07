import { useGetRandomUser } from "@/hooks/reactQuery/user/useGetRandomUser";
import { useUserContext } from "@/contexts/UserContext";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowAndUnfollow from "./FollowAndUnfollow";

export default function WhoToFollow() {
  const { user } = useUserContext();

  const { data: users } = useGetRandomUser(user?.data?.id);

  if (user === undefined) return null;
  if (users?.length === 0) return null;
  return (
    <Card className="bg-bw">
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.map((user) => (
            <div
              key={user.id}
              className="flex gap-2 items-center justify-between "
            >
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-xs">
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium cursor-pointer"
                  >
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">
                    {user._count.followers} followers
                  </p>
                </div>
              </div>
              <FollowAndUnfollow userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
