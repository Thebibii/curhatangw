"use server";
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

    // Create notification if commenting on someone else's post
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
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
}
