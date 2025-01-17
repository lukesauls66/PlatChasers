"use client";

import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface FavoritedGamesProps {
  userGames: Game[] | null;
}

const FavoritedGames: React.FC<FavoritedGamesProps> = ({ userGames }) => {
  const [sortedGames, setSortedGames] = useState<Game[]>([]);

  useEffect(() => {
    if (userGames) {
      const sorted = [...userGames].sort((a, b) =>
        a.title > b.title ? 1 : -1
      );
      setSortedGames(sorted);
    }
  }, [userGames]);

  const isGames = sortedGames.length > 0;

  return (
    <div className="flex flex-col gap-4 items-center h-[12rem] w-[16.5rem] rounded-md border-black border-2 bg-white overflow-y-auto">
      <div className="sticky top-0 flex justify-center bg-[#53285f]/90 mt-2 pt-1 w-60 h-8">
        <h1 className="font-semibold text-xl text-[#e7e7e7]">Favorite Games</h1>
      </div>
      <div>
        {isGames ? (
          <div className="flex flex-col gap-4 pb-2 px-2 w-[16rem]">
            {sortedGames?.map((game, index) => {
              const isLastGame = index === sortedGames.length - 1;

              return (
                <div key={game.id} className="flex flex-col">
                  <div className="flex flex-col gap-5 bg-[#e7e7e7]">
                    <div>
                      <Link
                        href={`/games/${game.id}`}
                        className="flex justify-between"
                      >
                        <img
                          className="w-[3.5rem] h-[3.5rem]"
                          src={game.image}
                          alt={game.title}
                        />
                        <div className="flex flex-grow items-center justify-center bg-[#e7e7e7]">
                          <h3 className="text-md text-center font-semibold">
                            {game.title}
                          </h3>
                        </div>
                      </Link>
                    </div>
                  </div>
                  {!isLastGame && <Separator className="mt-5 mb-1 bg-[#333]" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-60 pt-6">
            <h2 className="text-center text-xl">
              Explore our site and start tracking your progress
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritedGames;
