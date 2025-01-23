import ProfilePageClient from "./ProfilPageClient";

export default async function Page({ params }: any) {
  const { username } = await params;
  return <ProfilePageClient username={username} />;
}
