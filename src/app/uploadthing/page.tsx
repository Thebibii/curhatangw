import PostForm from "@/components/ui/uploadthing/post-form";
import PostTable from "@/components/ui/uploadthing/post-table";

export default function Page() {
  return (
    <main className="flex min-h-screen justify-between p-24 gap-x-8">
      <div className="flex flex-col items-center justify-between">
        <PostForm />
      </div>
      <div>
        <PostTable />
      </div>
    </main>
  );
}
