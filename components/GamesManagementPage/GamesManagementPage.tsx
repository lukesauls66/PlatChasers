"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SearchBar } from "../Util";
import GamesContainer from "./GamesContainer";

const GamesManagementPage = () => {
  const { data: session, status } = useSession();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get("/api/games");
        setGames(res.data);
      } catch (error) {
        console.error("Error fetching games:", error);
        setError("Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

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
      <SearchBar games={games} />
      <GamesContainer games={games} />
    </div>
  );
};

export default GamesManagementPage;
