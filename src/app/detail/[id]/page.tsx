import React from "react";

type TProps = {
  params: {
    id: string;
  };
};

export default async function Detail({ params }: TProps) {
  const { id } = params;

  return <p>{id} a</p>;
}
