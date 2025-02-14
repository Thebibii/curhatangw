export type ApiPostsInfinite = {
  pages: PostInfinite[];
  pageParams: string | undefined[];
};

export type PostInfinite = {
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
    tags: {
      tag: {
        id: string;
        name: string;
      };
    }[];
    likes: {
      userId: string;
    }[];
    _count: {
      likes: number;
      comments: number;
    };
  }[];
  nextCursor: string;
};
