import { Suspense } from "react";

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
