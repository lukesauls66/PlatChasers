"use client";

import axios from "axios";
import {
  CompletedGames,
  FavoritedGames,
  ExploreGames,
} from "./HomePageSubsections";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Game } from "@/types/game";

const HomePage = () => {
  const { data: session, status } = useSession();
  const [games, setGames] = useState([]);
  const [userGames, setUserGames] = useState<Game[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get("/api/games");
        setGames(res.data);
      } catch (error) {
        setError("Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    setUserGames(session?.user?.games ?? null);

    fetchGames();
  }, [session?.user?.games]);

  if (loading) {
    return (
      <div className="flex items-center justify-center font-bold text-4xl pt-20">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pb-8">
      {status === "authenticated" ? (
        <div className="flex flex-col items-center gap-4 pt-4">
          <p className="text-lg font-bold font-it text-center italic">
            CHASE YOUR <br /> ACHIEVEMENT GOALS!
          </p>
          <CompletedGames />
          <FavoritedGames userGames={userGames} />
          <ExploreGames games={games} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 pt-6">
          <p className="text-2xl font-bold">Welcome!</p>
          <ExploreGames games={games} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
