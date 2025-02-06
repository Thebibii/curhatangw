import React from "react";

type TProps = {
  children: React.ReactNode;
  params: any;
};
export default async function Detail(props: TProps) {
  const { id } = await props.params;

  return <p>{id} a</p>;
}
