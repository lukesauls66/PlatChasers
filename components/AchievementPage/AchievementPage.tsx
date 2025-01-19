"use client";

import { Achievement } from "@/types/game";
import axios from "axios";
import { useEffect, useState } from "react";
import AchievementPostsContainer from "./AchievementPostsContainer";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

interface AchievementPageProps {
  gameId: string;
  achievementId: string;
}

const AchievementPage: React.FC<AchievementPageProps> = ({
  gameId,
  achievementId,
}) => {
  const [achievement, setAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const fetchAchievement = async () => {
      const res = await axios.get(
        `/api/games/${gameId}/achievements/${achievementId}`
      );
      setAchievement(res.data);
    };

    fetchAchievement();
  }, [achievementId, gameId]);

  return (
    <div className="flex flex-col items-center gap-6 px-3 py-6 min-h-screen h-full bg-[#e7e7e7]">
      <div className="flex flex-col gap-4 justify-start w-full">
        <Link
          className="text-lg font-semibold text-gray-600"
          href={`/games/${gameId}`}
        >
          <div className="flex text-xl lg:text-2xl">
            <IoIosArrowBack className="text-xl lg:text-2xl mt-1" /> Back
          </div>
        </Link>
        <h1 className="text-2xl lg:text-3xl xl:text-4xl text-center font-bold italic underline underline-offset-8">
          {achievement?.title}
        </h1>
      </div>
      <div className="flex justify-center">
        <img
          className="w-[10rem] h-[10rem] xl:w-[12rem] xl:h-[12rem]"
          src={achievement?.image}
          alt={achievement?.title}
        />
      </div>
      <div className="w-full max-w-[30rem]">
        <p className="text-center text-lg lg:text-[1.3rem] font-semibold">
          {achievement?.description}
        </p>
      </div>
      <AchievementPostsContainer
        gameId={gameId}
        achievementId={achievementId}
        achievement={achievement}
      />
    </div>
  );
};

export default AchievementPage;
