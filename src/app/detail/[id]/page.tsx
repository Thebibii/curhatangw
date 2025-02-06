import React from "react";

export default async function Detail({ params }: any) {
  const { id } = await params;

  return <p>{id} a</p>;
}
