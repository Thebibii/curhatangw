import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curhatan Gw | Detail Postingan",
};
export default function DetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
