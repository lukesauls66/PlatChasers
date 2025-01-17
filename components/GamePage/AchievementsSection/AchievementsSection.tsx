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
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ game }) => {
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
    <div className="flex flex-col gap-4 items-center h-[30rem] w-[16.5rem] rounded-md border-black border-2 bg-white overflow-y-auto">
      <div className="sticky top-0 flex justify-center bg-[#53285f]/90 mt-2 pt-1 w-60 h-8 rounded-sm">
        <h1 className="font-semibold text-xl text-[#e7e7e7]">Achievements</h1>
      </div>
      {isAdmin && (
        <div>
          <Button
            variant={"destructive"}
            size={"lg"}
            className="bg-[#ae3634] hover:bg-[#ae3634]/80"
            onClick={handleModalOpen}
          >
            Add Achievement
          </Button>
        </div>
      )}
      {areAchievements ? (
        <div className="flex flex-col items-center gap-4 pb-2 px-2 w-[100%]">
          {achievements.map((achievement) => {
            const isUnlocked =
              achievement.unlockedBy.length > 0 &&
              achievement.unlockedBy[0]?.isUnlocked;

            return (
              <div key={achievement.id}>
                <div className="flex flex-col gap-4 bg-[#e7e7e7] p-2 border-black border-2 rounded-sm w-[15.4rem]">
                  <div>
                    <Link
                      href={`${game?.id}/achievements/${achievement.id}`}
                      className="flex items-center justify-between"
                    >
                      <img
                        className="w-14 h-14 cursor-pointer"
                        src={
                          isUnlocked
                            ? achievement.image
                            : "/images/locked-achievement.png"
                        }
                        alt={achievement.title}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleIsUnlocked(achievement.id, isUnlocked);
                        }}
                      />
                      <div className="flex flex-grow items-center justify-center">
                        <h3 className="text-md text-center font-semibold">
                          {achievement.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col gap-1 bg-[#e7e7e7] px-1 pb-1">
                      <p className="text-sm font-semibold text-start">
                        Description:
                      </p>
                      <p className="text-sm text-start">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-between">
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem]"
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
                        className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem]"
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
        <h2>No achievements to view at this time.</h2>
      )}
    </div>
  );
};

export default AchievementsSection;
