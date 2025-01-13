import { Game } from "@/types/game";
import { useEffect, useState } from "react";

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

  return (
    <div className="flex flex-col gap-4 items-center h-[12rem] w-[16.5rem] rounded-md border-black border-2 bg-white overflow-y-auto">
      <div className="flex justify-center bg-[#53285f]/90 mt-2 pt-1 w-60 h-8">
        <h1 className="font-semibold text-xl text-[#e7e7e7]">Favorite Games</h1>
      </div>
      <div>
        {sortedGames ? (
          <div className="flex flex-col gap-4 pb-2 px-2 w-[100%]">
            {sortedGames?.map((game, index) => {
              const isLastGame = index === sortedGames.length - 1;

              return (
                <div key={game.id} className="flex flex-col gap-5">
                  <div className="flex justify-between">
                    <img
                      className="w-12 h-12"
                      src={game.image}
                      alt={game.title}
                    />
                    <div className="flex flex-grow items-center justify-center bg-[#e7e7e7]">
                      <h3 className="text-md text-center font-semibold">
                        {game.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-60">
            <h2 className="text-center text-lg">
              Explore our site and start tracking your progress
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritedGames;
