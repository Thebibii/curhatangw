import { CommentResponse } from "./comment";

export type ApiDetailPost = {
  success: boolean;
  data: DetailPost;
};

export type DetailPost = {
  id: string;
  title: string;
  content: string;
  image: string;
  author: {
    id?: string;
    name: string;
    username: string;
    email?: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
  comments: CommentResponse[];
};
