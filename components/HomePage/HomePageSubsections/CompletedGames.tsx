"use client";

import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import axios from "axios";

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
    <div>
      {isGames ? (
        <div className="flex flex-col gap-4 items-center h-[12rem] w-[16.5rem] rounded-md border-black border-2 bg-white overflow-y-auto">
          <div className="sticky top-0 flex justify-center bg-[#53285f]/90 mt-2 pt-1 w-60 h-8">
            <h1 className="font-semibold text-xl text-[#e7e7e7]">
              Completed Games
            </h1>
          </div>
          <div className="flex flex-col gap-4 pb-2 px-2 w-[100%]">
            {sortedCompletedGames.map((game) => {
              return (
                <div key={game.id} className="flex flex-col gap-5">
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
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CompletedGames;
