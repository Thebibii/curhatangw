import prisma from "@/lib/db/prisma";

export const getTags = async () => {
  const tags = await prisma.tag.findMany();
  return tags;
};

export const createTag = async (name: string) => {
  const tag = await prisma.tag.create({ data: { name } });
  return tag;
};
