import axios from "axios";
import {
  CompletedGames,
  FavoritedGames,
  ExploreGames,
} from "./HomePageSubsections";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { status } = useSession();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Games: ", games);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get("/api/games");
        console.log("Fetched games res: ", res.data);
        setGames(res.data);
      } catch (error) {
        setError("Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {status === "authenticated" ? (
        <div className="flex flex-col items-center gap-8 pt-8">
          <CompletedGames />
          <FavoritedGames />
          <ExploreGames games={games} />
        </div>
      ) : (
        <div className="flex flex-col items-center pt-8">
          <ExploreGames games={games} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
