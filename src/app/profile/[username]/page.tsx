import ProfilePageClient from "./ProfilPageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <ProfilePageClient username={username} />;
}
