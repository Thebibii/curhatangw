import prisma from "@/lib/db/prisma";

export const getTags = async (tag_ids: string[], tag_names: string) => {
  if (tag_ids?.length > 0) {
    const tags = await prisma.tag.findMany({
      take: 5,
      where: {
        id: {
          in: tag_ids?.map((id) => id),
        },
      },
    });

    return tags;
  }

  if (tag_names?.length > 0) {
    const tags = await prisma.tag.findMany({
      take: 5,
      where: {
        name: {
          contains: tag_names,
          mode: "insensitive",
        },
      },
    });

    return tags;
  }

  const tags = await prisma.tag.findMany({
    take: 5,
  });

  return tags;
};

export const getTagsByTrending = async () => {
  const tags = await prisma.tag.findMany({
    take: 5,
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      posts: {
        _count: "desc",
      },
    },
  });

  return tags;
};

export const createTag = async (name: string) => {
  const tag = await prisma.tag.create({ data: { name } });
  return tag;
};
