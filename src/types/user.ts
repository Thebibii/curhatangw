export type User = {
  id: string;
  name: string;
  username: string;
  bio?: string;
  image?: string;
  location?: string;
  website?: string;
  createdAt: string;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
};
