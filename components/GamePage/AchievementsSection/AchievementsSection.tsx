import { Achievement, Game } from "@/types/game";
import { useEffect, useState } from "react";

interface AchievementsSectionProps {
  game: Game | null;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ game }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(game?.achievements ?? []);
  }, [game]);

  const areAchievements = achievements.length > 0;

  return (
    <div className="flex flex-col gap-4 items-center h-[30rem] w-[16.5rem] rounded-md border-black border-2 bg-white overflow-y-auto">
      <div className="sticky top-0 flex justify-center bg-[#53285f]/90 mt-2 pt-1 w-60 h-8 rounded-sm">
        <h1 className="font-semibold text-xl text-[#e7e7e7]">Achievements</h1>
      </div>
      {areAchievements ? (
        <div className="flex flex-col items-center gap-4 pb-2 px-2 w-[100%]">
          {achievements.map((achievement, index) => {
            return (
              <div key={achievement.id}>
                <div className="flex flex-col gap-4 bg-[#e7e7e7] p-2 border-black border-2 rounded-sm w-[15.4rem]">
                  <div className="flex items-center justify-between">
                    <img
                      className="w-14 h-14"
                      src={achievement.image}
                      alt={achievement.title}
                    />
                    <div className="flex flex-grow items-center justify-center">
                      <h3 className="text-md text-center font-semibold">
                        {achievement.title}
                      </h3>
                    </div>
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
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <h2>No achievements to view at this time.</h2>
      )}
    </div>
  );
};

export default AchievementsSection;
