import GamePage from "@/components/GamePage";

export default async function Game({ params }: { params: { gameId: string } }) {
  const { gameId } = await params;

  return <GamePage gameId={gameId} />;
}
