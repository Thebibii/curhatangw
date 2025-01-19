import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/post/PostCard";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();
  /* const posts = await getPosts();
  const dbUserId = await getDbUserId(); */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}

        <div className="space-y-6">
          <PostCard />
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        {/* <WhoToFollow /> */}
      </div>
    </div>
  );
}
