"use client";

import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Separator } from "@/components/ui/separator";

const CompletedGames = () => {
  const { data: session } = useSession();
  const [completedGames, setCompletedGames] = useState<Game[]>([]);
  const [sortedCompletedGames, setSortedCompletedGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletedGames = async () => {
      try {
        const res = await axios.get(`api/users/${session?.user?.id}/games`);
        setCompletedGames(res.data);
      } catch (error) {
        console.error("Error fetching users completed games:", error);
        setError("Failed to fetch completed games");
      }
    };

    fetchCompletedGames();
  }, [session?.user?.id]);

  useEffect(() => {
    if (completedGames) {
      const sorted = [...completedGames].sort((a, b) =>
        a.title > b.title ? 1 : -1
      );
      setSortedCompletedGames(sorted);
    }
  }, [completedGames]);

  if (error) {
    return <div>{error}</div>;
  }

  const isGames = completedGames.length > 0;

  return (
    <>
      {isGames ? (
        <div className="flex flex-col gap-4 items-center h-[12rem] md:h-full w-full max-w-[80rem] rounded-md border-black border-2 bg-white overflow-y-auto md:overflow-y-visible">
          <div className="sticky top-0 flex justify-center bg-[#53285f]/90 pt-1 w-full h-full">
            <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl text-[#e7e7e7]">
              Completed Games
            </h1>
          </div>
          <div className="flex flex-col gap-4 pb-2 px-2 w-full">
            {sortedCompletedGames.map((game, index) => {
              const isLastGame = index === sortedCompletedGames.length - 1;

              return (
                <div key={game.id} className="flex flex-col gap-5 w-full">
                  <div>
                    <Link
                      href={`/games/${game.id}`}
                      className="flex justify-between w-full"
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
                  {!isLastGame && (
                    <Separator className="my-[.2rem] bg-[#333]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CompletedGames;
