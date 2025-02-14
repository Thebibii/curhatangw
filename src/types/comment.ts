export type CommentResponse = {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  author: {
    id?: string;
    name: string;
    username: string;
    email?: string;
    image?: string;
  };
};

export type CommentsApiResponse = {
  success: boolean;
  data: Comment[];
};
