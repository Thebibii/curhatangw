import ProfilePageClient from "./ProfilPageClient";

// "use client";
export default async function Page({ params }: any) {
  const { username } = await params;
  return <ProfilePageClient username={username} />;
}
