import { notFound } from "next/navigation";
import { CREATOR_PROFILES } from "@/lib/mock-data";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function CreatorProfilePage({ params }: PageProps) {
  const { username } = await params;

  const profile = CREATOR_PROFILES.find(
    (item) => item.username === username
  );

  if (!profile) {
    notFound();
  }

  return (
    <main>
      <h1>{profile.creator}</h1>
      <p>{profile.job}</p>
    </main>
  );
}
