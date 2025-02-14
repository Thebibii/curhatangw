export type TagApiResponse = {
  success: boolean;
  data: Tag[];
};

export type Tag = {
  id: string;
  name: string;
};
