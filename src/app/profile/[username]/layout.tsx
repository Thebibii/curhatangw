import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const username = (await params).username;
  const upperCaseUsername =
    username.charAt(0).toUpperCase() + username.slice(1);
  return {
    title: `Curhatan Gw | ${upperCaseUsername}`,
  };
}
export default function NotificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
