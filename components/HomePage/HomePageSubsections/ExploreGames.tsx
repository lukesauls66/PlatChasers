"use client";

import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface ExploreGamesProps {
  games: Game[];
}

const shuffleArray = (array: Game[]): Game[] => {
  const shuffledArray: Game[] = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));

    const temp: Game = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }

  return shuffledArray;
};

const ExploreGames: React.FC<ExploreGamesProps> = ({ games }) => {
  const [randomGames, setRandomGames] = useState<Game[]>([]);

  useEffect(() => {
    if (games.length > 0) {
      const shuffledGames = shuffleArray(games);
      setRandomGames(shuffledGames);
    }
  }, [games]);

  return (
    <div className="flex flex-col gap-4 items-center h-[22rem] md:h-full w-full max-w-[80rem] rounded-md border-black border-2 bg-white overflow-y-auto md:overflow-y-visible">
      <div className="sticky top-0 flex justify-center bg-[#53285f]/90 pt-1 w-full h-full">
        <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl text-[#e7e7e7]">
          Explore Games
        </h1>
      </div>
      <div className="flex flex-col gap-4 pb-2 px-2 w-full">
        {randomGames.map((game, index) => {
          const isLastGame = index === randomGames.length - 1;

          return (
            <div key={game.id} className="flex flex-col w-full">
              <div className="flex flex-col gap-5 bg-[#e7e7e7]">
                <div>
                  <Link
                    href={`games/${game.id}`}
                    className="flex justify-between"
                  >
                    <img
                      className="w-[3.5rem] h-[3.5rem] sm:w-[5rem] sm:h-[5rem] md:w-[7rem] md:h-[7rem] xl:w-[9rem] xl:h-[9rem]"
                      src={game.image}
                      alt={game.title}
                    />
                    <div className="flex flex-grow items-center justify-center bg-[#e7e7e7] px-2">
                      <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center font-semibold">
                        {game.title}
                      </h3>
                    </div>
                  </Link>
                </div>
                <div className="flex justify-evenly">
                  <div className="flex flex-col gap-1 bg-[#e7e7e7] px-1 pb-1">
                    <p className="text-sm sm:text-md md:text-lg lg:text-2xl font-semibold">
                      Description:
                    </p>
                    <p className="text-sm sm:text-md md:text-lg lg:text-2xl">
                      {game.description}
                    </p>
                  </div>
                </div>
              </div>
              {!isLastGame && <Separator className="mt-5 mb-1.5 bg-[#333]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreGames;
