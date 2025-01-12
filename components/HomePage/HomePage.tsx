import {
  CompletedGames,
  FavoritedGames,
  ExploreGames,
} from "./HomePageSubsections";
import { useSession } from "next-auth/react";

const HomePage = () => {
  const { status } = useSession();

  return (
    <div>
      {status === "authenticated" ? (
        <div className="flex flex-col items-center gap-8 pt-8">
          <CompletedGames />
          <FavoritedGames />
          <ExploreGames />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 pt-8">
          <ExploreGames />
        </div>
      )}
    </div>
  );
};

export default HomePage;
