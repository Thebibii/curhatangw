import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Curhatan Gw",
};
export default function TagLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
