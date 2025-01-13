import Akun from "@/components/ui/uploadthing/akun";
import PostForm from "@/components/ui/uploadthing/post-form";
import PostTable from "@/components/ui/uploadthing/post-table";

export default function Page() {
  return (
    <main className=" min-h-screen w-full  justify-between p-24 ">
      <Akun />
      <div className="flex flex-col md:flex-row w-full gap-x-8 ">
        <PostForm />
        <PostTable />
      </div>
    </main>
  );
}
