/*
  Warnings:

  - The primary key for the `PostTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PostTag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostTag" DROP CONSTRAINT "PostTag_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId", "tagId");
