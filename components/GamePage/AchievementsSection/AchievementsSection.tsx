"use client";

import { Achievement, Game } from "@/types/game";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AchievementPostAndEditModal from "@/components/AchievementPostAndEditModal";
import axios from "axios";

interface AchievementsSectionProps {
  game: Game | null;
  isFavorited: boolean;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  game,
  isFavorited,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    setAchievements(game?.achievements ?? []);
  }, [game]);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleAddAchievement = async (newAchievement: Achievement) => {
    setAchievements((prev) => [newAchievement, ...prev]);
  };

  const handleEditAchievement = (updatedAchievement: Achievement) => {
    setAchievements((prev) =>
      prev.map((achievement) =>
        achievement.id === updatedAchievement.id
          ? updatedAchievement
          : achievement
      )
    );
  };

  const handleDeleteAchievement = async (achievementId: string) => {
    await axios.delete(`/api/games/${game?.id}/achievements/${achievementId}`);

    setAchievements((prev) =>
      prev.filter((achievement) => achievement.id !== achievementId)
    );
  };

  const toggleIsUnlocked = async (
    achievementId: string,
    isUnlocked: boolean
  ) => {
    if (!session?.user?.id) return;

    if (!isFavorited) {
      alert("Please favorite this game to start tracking progress");
      return;
    }

    try {
      if (isUnlocked) {
        await axios.delete(
          `/api/users/${session.user.id}/achievements?achievementId=${achievementId}`
        );
      } else {
        await axios.post(`/api/users/${session.user.id}/achievements`, {
          achievementId,
          isUnlocked: true,
        });
      }

      const res = await axios.get(`/api/games/${game?.id}`);
      setAchievements(res.data.achievements ?? []);
    } catch (error) {
      console.error(
        `Error ${isUnlocked ? "locking" : " unlocking"} achievement`,
        error
      );
    }
  };

  const areAchievements = achievements.length > 0;

  const isAdmin = session?.user.isAdmin === true;

  return (
    <div className="flex flex-col gap-4 items-center h-[30rem] sm:h-[35rem] md:h-[40rem] lg:h-[45rem] w-full max-w-[40rem] rounded-md border-black border-2 bg-white overflow-y-auto">
      <div className="sticky top-0 flex justify-center bg-[#53285f]/90 pt-1 w-full h-[2rem] xl:h-[2.5rem]">
        <h1 className="font-semibold text-xl md:text-xl lg:text-2xl xl:text-3xl text-[#e7e7e7]">
          Achievements
        </h1>
      </div>
      {isAdmin && (
        <div>
          <Button
            variant={"destructive"}
            size={"lg"}
            className="bg-[#ae3634] hover:bg-[#ae3634]/80 md:text-lg"
            onClick={handleModalOpen}
          >
            Add Achievement
          </Button>
        </div>
      )}
      {areAchievements ? (
        <div className="flex flex-col items-center gap-4 pb-2 px-4 w-full">
          {achievements.map((achievement) => {
            const isUnlocked =
              Array.isArray(achievement.unlockedBy) &&
              achievement.unlockedBy.length > 0
                ? achievement.unlockedBy[0]?.isUnlocked
                : false;

            return (
              <div className="w-full" key={achievement.id}>
                <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-[3rem] bg-[#e7e7e7] p-2 border-black border-2 rounded-sm w-full">
                  <div>
                    <Link
                      href={`${game?.id}/achievements/${achievement.id}`}
                      className="flex items-center justify-between"
                    >
                      <img
                        className="w-[3.5rem] h-[3.5rem] sm:w-[5rem] sm:h-[5rem] md:w-[7rem] md:h-[7rem] xl:w-[9rem] xl:h-[9rem] cursor-pointer"
                        src={
                          session?.user
                            ? isUnlocked
                              ? achievement.image
                              : "/images/locked-achievement.png"
                            : "/images/locked-achievement.png"
                        }
                        alt={achievement.title}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleIsUnlocked(achievement.id, isUnlocked);
                        }}
                      />
                      <div className="flex flex-grow items-center justify-center">
                        <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center font-semibold">
                          {achievement.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col gap-1 bg-[#e7e7e7] px-1 pb-1">
                      <p className="text-sm sm:text-md md:text-lg xl:text-[1.3rem] font-semibold text-start">
                        Description:
                      </p>
                      <p className="text-sm sm:text-md md:text-lg xl:text-[1.3rem] text-start">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-between">
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem] md:w-[7rem] xl:w-[9rem] xl:h-[3rem] md:text-lg xl:text-2xl"
                        onClick={() => {
                          handleModalOpen();
                          setEditingAchievement(achievement);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem] md:w-[7rem] xl:w-[9rem] xl:h-[3rem] md:text-lg xl:text-2xl"
                        onClick={() => handleDeleteAchievement(achievement.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isModalOpen && (
            <AchievementPostAndEditModal
              gameId={game?.id}
              achievementId={editingAchievement?.id}
              onClose={() => {
                handleModalClose();
                setEditingAchievement(null);
              }}
              addAchievement={handleAddAchievement}
              editingAchievement={editingAchievement}
              submitEdit={handleEditAchievement}
            />
          )}
        </div>
      ) : (
        <h2 className="text-lg font-semibold pt-[4rem] text-center">
          No achievements to view at this time.
        </h2>
      )}
    </div>
  );
};

export default AchievementsSection;
