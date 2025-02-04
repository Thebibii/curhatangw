import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // define routes for different upload types
  postImage: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    try {
      return { fileUrl: file.url };
    } catch (error) {
      console.error("Error in onUploadComplete:", error);
      throw error;
    }
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
