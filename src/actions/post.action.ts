import prisma from "@/lib/db/prisma";
import { getDbUserByUsername, getDbUserId } from "./user.action";
import { NotificationType } from "@/types/enum";

export async function createPost(content: string, image: string, tags: any) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
        tags:
          tags?.length > 0
            ? {
                create: tags.map((tag: any) => ({
                  tag: {
                    connectOrCreate: {
                      where: { id: tag.id },
                      create: { id: tag.id, name: tag.name },
                    },
                  },
                })),
              }
            : undefined, // Jika tags kosong, Prisma tidak akan membuat relasi
      },
      // include: {
      //   author: {
      //     select: { id: true, name: true, username: true, image: true },
      //   },
      //   likes: { select: { userId: true } },
      //   tags: { select: { tag: { select: { id: true, name: true } } } },
      //   _count: { select: { comments: true } },
      // },
    });
    return post;
  } catch (error) {
    console.error("Failed to create post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function updatePost(
  postId: string,
  content: string,
  image: string,
  tags: any
) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("Unauthorized");

    const checkPost = await prisma.post.findFirst({
      where: { id: postId },
    });

    if (!checkPost) throw new Error("Post not found");

    const post = await prisma.$transaction(async (tx) => {
      // Update data post
      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          content,
          image,
        },
      });

      // Hapus semua tag yang berhubungan dengan post ini
      await tx.postTag.deleteMany({
        where: { postId: postId },
      });

      // Jika ada tag baru, tambahkan kembali ke tabel pivot
      if (tags.length > 0) {
        const tagsOnPost = tags.map((tag: any) => ({
          tagId: tag.id,
          postId: postId,
        }));

        await tx.postTag.createMany({
          data: tagsOnPost,
        });
      }

      return updatedPost;
    });

    return post;
  } catch (error) {
    console.error("Failed to update post:", error);
    return { success: false, error: "Failed to update post" };
  }
}

export async function getPosts(limit: number, cursor?: string | undefined) {
  const currentUserId = await getDbUserId();
  const posts = await prisma.post.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  // Menambahkan properti isFollowing untuk setiap post
  const postsWithFollowStatus = await Promise.all(
    posts.map(async (post) => {
      // Memeriksa apakah user saat ini memfollow autho
      const followRelation = currentUserId
        ? await prisma.follows.findUnique({
            where: {
              followerId_followingId: {
                followerId: currentUserId,
                followingId: post.author.id,
              },
            },
          })
        : null;

      return {
        ...post,
        isFollowing: !!followRelation,
      };
    })
  );

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

  return { posts: postsWithFollowStatus, nextCursor };
}

export async function getDetailPost(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (error) {
    throw new Error("Failed to fetch post");
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId)
      throw new Error("Unauthorized - no delete permission");

    await prisma.post.delete({
      where: { id: postId },
    });

    return { postId: post.id };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

export async function getUserPosts(username: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          username: username,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        tags: { select: { tag: { select: { id: true, name: true } } } },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw new Error("Failed to fetch user posts");
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    // check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like and create notification (only if liking someone else's post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: NotificationType.like,
                  userId: post.authorId, // recipient (post author)
                  creatorId: userId, // person who liked
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    return;
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}
