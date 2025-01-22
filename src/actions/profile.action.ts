import prisma from "@/lib/db/prisma";

export async function getProfileByUsername(username: string) {
  const decodedUsername = decodeURIComponent(username);

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { username: decodedUsername },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }
}
