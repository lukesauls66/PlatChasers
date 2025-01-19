import { Game } from "@/types/game";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import GameEditModal from "@/components/GameEditModal";
import axios from "axios";

interface GamesContainerProps {
  games: Game[];
}

const GamesContainer: React.FC<GamesContainerProps> = ({ games }) => {
  const router = useRouter();
  const [listGames, setListGames] = useState<Game[]>(games);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleAddGameClick = () => {
    router.push("/games/create");
  };

  const handleEditGame = (updatedGame: Game) => {
    setListGames((prev) =>
      prev.map((game) => (game.id === updatedGame.id ? updatedGame : game))
    );
  };

  const handleGameDelete = async (gameId: string) => {
    await axios.delete(`/api/games/${gameId}`);

    setListGames((prev) => prev.filter((game) => game.id !== gameId));
  };

  return (
    <div className="flex flex-col items-center pt-4 w-full">
      <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold">
        Manage Games
      </h1>
      <div className="flex justify-center w-full px-8 sm:px-[4rem] md:px-[6rem] lg:px-[8rem]">
        <Separator className="bg-black w-full mt-6 mb-10" />
      </div>
      <Button
        onClick={handleAddGameClick}
        variant={"destructive"}
        size={"lg"}
        className="bg-[#ae3634] hover:bg-[#ae3634]/80"
      >
        Add Game
      </Button>
      <div className="flex justify-center w-full px-8 sm:px-[4rem] md:px-[6rem] lg:px-[8rem]">
        <Separator className="bg-black w-full my-10" />
      </div>
      <div className="flex flex-col w-full px-8 sm:px-[4rem] md:px-[6rem] lg:px-[8rem] xl:px[6rem]">
        {listGames.map((game, index) => {
          const isLastGame = index === listGames.length - 1;

          return (
            <div key={game.id} className="flex flex-col items-center w-full">
              <div className="flex flex-col items-center gap-5 md:gap-8 lg:gap-[3rem] xl:gap-[4rem] w-full">
                <Link
                  href={`games/${game.id}`}
                  className="flex items-center w-full"
                >
                  <img
                    className="w-[5rem] h-[5rem] sm:w-[6.5rem] sm:h-[6.5rem] md:w-[9rem] md:h-[9rem] xl:w-[11rem] xl:h-[11rem]"
                    src={game.image}
                    alt={game.title}
                  />
                  <h2 className="text-center sm:text-lg md:text-xl lg:text-2xl xl:text-3xl w-full font-semibold">
                    {game.title}
                  </h2>
                </Link>
                <div className="w-full">
                  <p className="text-start sm:text-lg md:text-xl xl:text-2xl">
                    {game.description}
                  </p>
                </div>
                <div className="flex justify-between w-full">
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem] md:w-[7rem] xl:w-[9rem] xl:h-[3rem] md:text-lg xl:text-2xl"
                    onClick={() => {
                      handleModalOpen();
                      setEditingGame(game);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem] md:w-[7rem] xl:w-[9rem] xl:h-[3rem] md:text-lg xl:text-2xl"
                    onClick={() => handleGameDelete(game.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {!isLastGame && (
                <div className="flex justify-center w-full px-8 sm:px-[4rem] md:px-[6rem] lg:px-[8rem]">
                  <Separator className="bg-black w-full my-8 md:my-[3rem] lg:my-[4rem]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <GameEditModal
          onClose={() => {
            handleModalClose();
            setEditingGame(null);
          }}
          editingGame={editingGame}
          submitEdit={handleEditGame}
        />
      )}
    </div>
  );
};

export default GamesContainer;
