export type PostsInfinite = {
  pages: {
    success: boolean;
    message: string;
    data: {
      id: string;
      authorId: string;
      content: string;
      image: string;
      createdAt: string;
      updatedAt: string;
      author: {
        id: string;
        name: string;
        image: string;
        username: string;
      };
      likes: {
        userId: string;
      }[];
      _count: {
        likes: number;
        comments: number;
      };
    }[];
    nextCursor: string;
  }[];
  pageParams: string | undefined[];
};
