"use server";
import prisma from "@/lib/db/prisma";
import { auth, createClerkClient, currentUser } from "@clerk/nextjs/server";

const userCache = new Map<string, string>();
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return await prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
          notifications: {
            where: {
              read: false,
            },
          },
        },
      },
    },
  });
}

export async function getDbUserId() {
  /* const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (!user) throw new Error("User not found");

  return user.id; */
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  if (userCache.has(clerkId)) {
    return userCache.get(clerkId);
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) throw new Error("User not found");

  userCache.set(clerkId, user.id); // Simpan userId di cache
  return user.id;
}

export async function updateCurrentUser(dataUpdated: any) {
  const name = dataUpdated.name.split(" ");
  const firstName = name[0];
  const lastName = name.slice(1).join(" ");
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    // const name = formData.get("name") as string;
    // const bio = formData.get("bio") as string;
    // const location = formData.get("location") as string;
    // const website = formData.get("website") as string;

    const user = await prisma.user.update({
      where: { clerkId },
      data: dataUpdated,
    });

    await clerkClient.users.updateUser(clerkId, {
      firstName,
      lastName,
    });

    return user;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();

    if (!userId) return [];

    const totalUsers = await prisma.user.count({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
    });

    if (totalUsers === 0) throw new Error("No available users found");

    const skip = Math.min(
      Math.floor(Math.random() * totalUsers),
      Math.max(0, totalUsers - 3)
    );

    // get 3 random users exclude ourselves & users that we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
      skip,
    });

    return randomUsers;
  } catch (error) {
    console.log("Error fetching random users", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    if (userId === targetUserId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // unfollow
      await prisma.$transaction([
        prisma.follows.delete({
          where: {
            followerId_followingId: {
              followerId: userId,
              followingId: targetUserId,
            },
          },
        }),

        // Hapus notifikasi follow yang terkait saat unfollow
        prisma.notification.deleteMany({
          where: {
            type: "FOLLOW",
            userId: targetUserId, // user yang di-follow
            creatorId: userId, // user yang melakukan follow
          },
        }),
      ]);
    } else {
      // Check if notification already exists to prevent spam
      const existingNotification = await prisma.notification.findFirst({
        where: {
          type: "FOLLOW",
          userId: targetUserId,
          creatorId: userId,
          read: false,
        },
      });

      // follow
      if (existingNotification) {
        // Skip creating new notification if one already exists
        await prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        });
      } else {
        // Create both follow and notification if no notification exists
        await prisma.$transaction([
          prisma.follows.create({
            data: {
              followerId: userId,
              followingId: targetUserId,
            },
          }),

          prisma.notification.create({
            data: {
              type: "FOLLOW",
              userId: targetUserId, // user being followed
              creatorId: userId, // user following
            },
          }),
        ]);
      }
    }

    return;
  } catch (error) {
    console.log("Error in toggleFollow", error);
    return { success: false, error: "Error toggling follow" };
  }
}

export async function isFollowing(username: string) {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) return false;
    const userId = await getDbUserByUsername(username);

    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId.id,
        },
      },
    });

    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

export async function getDbUserByUsername(username: string) {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { username },
    });

    return user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }
}
