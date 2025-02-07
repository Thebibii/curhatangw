import prisma from "@/lib/db/prisma";
import { getDbUserId } from "./user.action";

export async function createComment(postId: string, content: string) {
  const userId = await getDbUserId();

  if (!userId) return;
  if (!content) throw new Error("Content is required");

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post) throw new Error("Post not found");

  // Create comment and notification in a transaction
  const [comment] = await prisma.$transaction(async (tx) => {
    // Create comment first
    const newComment = await tx.comment.create({
      data: {
        content,
        authorId: userId,
        postId,
      },
    });

    if (post.authorId !== userId) {
      await tx.notification.create({
        data: {
          type: "COMMENT",
          userId: post.authorId,
          creatorId: userId,
          postId,
          commentId: newComment.id,
        },
      });
    }

    return [newComment];
  });

  return comment;
}

export async function getComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function deleteComment(commentId: string) {
  try {
    const userId = await getDbUserId();
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) throw new Error("Comment not found");

    if (comment.authorId !== userId)
      throw new Error("Unauthorized - no delete permission");

    await prisma.comment.delete({
      where: { id: commentId },
    });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}
