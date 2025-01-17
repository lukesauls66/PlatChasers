"use client";

import { useEffect, useState } from "react";
import { Game } from "@/types/game";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useSession } from "next-auth/react";
import axios from "axios";
import GamePostsContainer from "./GamePostsContainer";
import AchievementsSection from "./AchievementsSection";

interface GamePageProps {
  gameId: string;
}

const GamePage: React.FC<GamePageProps> = ({ gameId }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchGame = async () => {
      const res = await axios.get(`/api/games/${gameId}`);
      setGame(res.data);

      const isGameFavorited = res.data.favoritedBy.some(
        (fav: { userId: string }) => fav.userId === session?.user.id
      );
      setIsFavorited(isGameFavorited);
    };

    fetchGame();
  }, [gameId, session?.user.id]);

  const handleFavoriteToggle = async () => {
    if (!session?.user.id) {
      return;
    }

    try {
      if (isFavorited) {
        setIsFavorited(false);

        session.user.games = session.user.games.filter(
          (game) => game.id !== gameId
        );

        await axios.delete(`/api/games/${gameId}/favorite`);
      } else {
        setIsFavorited(true);

        session.user.games.push({
          id: gameId,
          title: game?.title ?? "Untitled",
          description: game?.description ?? "No description available",
          image: game?.image ?? "/images/locked-achievement.png",
          isCompleted: false,
        });

        await axios.post(`/api/games/${gameId}/favorite`, { gameId });
      }
    } catch (error) {
      console.error("Error favoriting game: ", error);
      setIsFavorited(isFavorited);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-[#e7e7e7]">
      <h1 className="text-2xl text-center font-bold italic underline underline-offset-8">
        {game?.title}
      </h1>
      <div className="flex justify-center">
        <img
          className="w-[10rem] h-[10rem]"
          src={game?.image}
          alt={game?.title}
        />
      </div>
      {session?.user && (
        <div className="flex items-center">
          <span
            onClick={handleFavoriteToggle}
            className="cursor-pointer text-2xl"
          >
            {isFavorited ? <MdFavorite /> : <MdFavoriteBorder />}
          </span>
          <span className="ml-2">
            {isFavorited ? "Favorited" : "Not Favorited"}
          </span>
        </div>
      )}
      <p className="text-center">{game?.description}</p>
      <AchievementsSection game={game} />
      <GamePostsContainer gameId={gameId} game={game} />
    </div>
  );
};

export default GamePage;
