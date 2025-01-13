"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPostByUserId } from "@/stores/posts/useGetPostByUserId";
export default function PostTable() {
  const { data } = useGetPostByUserId();
  return (
    <Table>
      <TableCaption>A list of your recent posts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Content</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data?.map((post: any) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
