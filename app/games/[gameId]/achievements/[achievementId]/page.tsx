import AchievementPage from "@/components/AchievementPage";

export default async function Achievement({
  params,
}: {
  params: Promise<{ gameId: string; achievementId: string }>;
}) {
  const { gameId, achievementId } = await params;

  return <AchievementPage gameId={gameId} achievementId={achievementId} />;
}
