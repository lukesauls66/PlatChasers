"use client";

import { useEffect, useState } from "react";
import { Game } from "@/types/game";
import axios from "axios";
import GamePostsContainer from "./GamePostsContainer";
import AchievementsSection from "./AchievementsSection";

interface GamePageProps {
  gameId: string;
}

const GamePage: React.FC<GamePageProps> = ({ gameId }) => {
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      const res = await axios.get(`/api/games/${gameId}`);
      setGame(res.data);
    };

    fetchGame();
  }, [gameId]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-[#e7e7e7]">
      <h1 className="text-2xl text-center font-bold italic underline underline-offset-8">
        {game?.title}
      </h1>
      <div className="flex justify-center">
        <img
          className="w-[10rem] h-[10rem]"
          src={game?.image}
          alt="Elden Ring"
        />
      </div>
      <p className="text-center">{game?.description}</p>
      <AchievementsSection game={game} />
      <GamePostsContainer game={game} />
    </div>
  );
};

export default GamePage;
