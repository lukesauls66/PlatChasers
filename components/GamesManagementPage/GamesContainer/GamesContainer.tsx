import { Game } from "@/types/game";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

interface GamesContainerProps {
  games: Game[];
}

const GamesContainer: React.FC<GamesContainerProps> = ({ games }) => {
  const router = useRouter();

  const handleAddGameClick = () => {
    router.push("/games/create");
  };

  return (
    <div className="flex flex-col items-center pt-4">
      <h1 className="text-2xl font-bold">Manage Games</h1>
      <Separator className="bg-black w-[16rem] mt-6 mb-10" />
      <Button
        onClick={handleAddGameClick}
        variant={"destructive"}
        size={"lg"}
        className="bg-[#ae3634] hover:bg-[#ae3634]/80"
      >
        Add Game
      </Button>
      <Separator className="bg-black w-[16rem] my-10" />
      <div className="flex flex-col">
        {games.map((game, index) => {
          const isLastGame = index === games.length - 1;

          return (
            <div key={game.id} className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-5">
                <Link
                  href={`games/${game.id}`}
                  className="flex items-center w-[16rem]"
                >
                  <img
                    className="w-[5rem] h-[5rem]"
                    src={game.image}
                    alt={game.title}
                  />
                  <h2 className="text-center w-full font-semibold">
                    {game.title}
                  </h2>
                </Link>
                <div className="w-[16rem]">
                  <p className="text-start">{game.description}</p>
                </div>
                <div className="flex justify-between w-full">
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem]"
                  >
                    Edit
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem]"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {!isLastGame && <Separator className="bg-black w-[16rem] my-8" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GamesContainer;
