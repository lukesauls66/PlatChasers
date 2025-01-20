import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../Util";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface NewGameValidationErrors {
  gameTitle?: string;
  gameDescription?: string;
}

interface NewAchievementErrors {
  achievementTitle?: string;
  achievementDescription?: string;
}

interface Errors {
  gameTitle?: string;
  gameDescription?: string;
  achievementTitle?: string;
  achievementDescription?: string;
  achievementForm?: string;
}

interface Achievement {
  title: string;
  description: string;
  image: File | string;
}

const GameCreationPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievementTitle, setNewAchievementTitle] = useState("");
  const [newAchievementDescription, setNewAchievementDescription] =
    useState("");
  const [newAchievementImage, setNewAchievementImage] = useState<File | null>(
    null
  );
  const [errors, setErrors] = useState<Errors>({});

  const gameCreationValidationErrors = (title: string, description: string) => {
    const newValidationErrors: NewGameValidationErrors = {};

    if (title[0] !== title[0].toUpperCase()) {
      newValidationErrors.gameTitle = "Title must be capitalized";
    }

    if (description.length > 300) {
      newValidationErrors.gameDescription =
        "Description must be less than 300 characters";
    }

    return newValidationErrors;
  };

  const achievementCreationValidationErrors = (
    title: string,
    description: string
  ) => {
    const newValidationErrors: NewAchievementErrors = {};

    if (title[0] !== title[0].toUpperCase()) {
      newValidationErrors.achievementTitle = "Title must be capitalized";
    }

    if (description.length > 300) {
      newValidationErrors.achievementDescription =
        "Description must be less than 300 characters";
    }

    return newValidationErrors;
  };

  const makeNewGame = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post("/api/games", formData);

      const game = await res.data;

      if (game.id) {
        for (const achievement of achievements) {
          if (achievement.image) {
            const achievementFormData = new FormData();

            achievementFormData.append("title", achievement.title);
            achievementFormData.append("description", achievement.description);
            achievementFormData.append("image", achievement.image);

            await axios.post(
              `/api/games/${game.id}/achievements`,
              achievementFormData
            );
          }
        }

        router.push(`${game.id}`);
      }
    } catch (error) {
      console.error("Error submitting game:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        serverError: "An unexpected error occurred",
      }));
    }
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrors({});

    const gameCreationErrors = gameCreationValidationErrors(title, description);

    if (Object.keys(gameCreationErrors).length > 0) {
      setErrors(gameCreationErrors);
      return;
    }

    makeNewGame();
  };

  const handleAddAchievement = () => {
    if (
      newAchievementTitle.trim() &&
      newAchievementDescription.trim() &&
      newAchievementImage
    ) {
      try {
        setErrors({});

        const achievementCreationErrors = achievementCreationValidationErrors(
          newAchievementTitle,
          newAchievementDescription
        );

        if (Object.keys(achievementCreationErrors).length > 0) {
          setErrors(achievementCreationErrors);
          return;
        }

        setAchievements((prev) => [
          ...prev,
          {
            title: newAchievementTitle,
            description: newAchievementDescription,
            image: newAchievementImage,
          },
        ]);

        setNewAchievementTitle("");
        setNewAchievementDescription("");
        setNewAchievementImage(null);
      } catch (error) {
        console.error("Error adding achievement: ", error);
      }
    } else {
      setErrors({ achievementForm: "Must fill out entire form" });
    }
  };

  const areAchievements = achievements.length > 0;

  return (
    <div className="flex flex-col items-center py-5 px-8 h-full bg-[#e7e7e7]">
      <h1 className="text-2xl lg:text-3xl font-bold">Create New Game</h1>
      <Separator className="mt-5 mb-7 bg-black w-[14rem] lg:w-[18rem]" />
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="flex flex-col items-center gap-.5 w-full">
          <Input
            label="Game Title"
            type="title"
            id="title"
            value={title}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            className="w-[16rem] sm:w-[22.6rem] md:w-[32rem] border-[#53285f] border-[3px]"
          />
          {errors?.gameTitle && (
            <p className="text-[#ae3634]">{errors.gameTitle}</p>
          )}
          <textarea
            className="w-[16rem] sm:w-[22.6rem] md:w-[32rem] h-[8rem] p-2 border-2 border-black rounded-md my-2"
            rows={4}
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write game description here..."
          />
          {errors?.gameDescription && (
            <p className="text-[#ae3634]">{errors.gameDescription}</p>
          )}
          <Input
            label="Game Preview Image"
            type="file"
            id="image"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            className="bg-white w-[16rem] sm:w-[22.6rem] md:w-[32rem] border-[#53285f] border-[2px]"
          />
        </div>
        <Separator className="bg-black w-[14rem] lg:w-[18rem]" />
        <div className="flex flex-col items-center justify-center gap-2 border-black border-[3px] rounded-md w-[15.5rem] sm:w-[22.6rem] md:w-[32rem] h-[20rem] p-2">
          <Input
            label="Achievement Title"
            type="text"
            id="achievementTitle"
            value={newAchievementTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAchievementTitle(e.target.value)
            }
            className="w-[14.2rem] sm:w-[21.3rem] md:w-[30.7rem] border-[#53285f] border-[2px]"
          />
          {errors?.achievementTitle && (
            <p className="text-[#ae3634]">{errors.achievementTitle}</p>
          )}
          <textarea
            className="w-full h-[8rem] p-2 border-2 border-black rounded-md"
            rows={4}
            value={newAchievementDescription}
            onChange={(e) => setNewAchievementDescription(e.target.value)}
            placeholder="Write achievement description here..."
          />
          {errors?.achievementDescription && (
            <p className="text-[#ae3634]">{errors.achievementDescription}</p>
          )}
          <Input
            label="Achievement Image"
            type="file"
            id="achievementImage"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAchievementImage(e.target.files ? e.target.files[0] : null)
            }
            className="bg-white w-full md:w-[30.7rem] border-[#53285f] border-[2px]"
          />
          {errors.achievementForm && (
            <p className="text-[#ae3634]">{errors.achievementForm}</p>
          )}
          <Button
            variant={"destructive"}
            size={"lg"}
            onClick={handleAddAchievement}
            className="mt-2 bg-[#ae3634]"
          >
            Add Achievement
          </Button>
        </div>
        {areAchievements && (
          <ul className="w-[16rem] md:w-[32rem]">
            {achievements.map((achievement, index) => (
              <div key={index}>
                <li
                  key={index}
                  className="flex flex-col items-center sm:text-lg md:text-xl lg:text-[1.4rem]"
                >
                  <strong className="text-center">{achievement.title}</strong>
                  <p className="text-center">{achievement.description}</p>
                </li>
                <div className="flex justify-center">
                  <Separator className="bg-black w-[14rem] my-4" />
                </div>
              </div>
            ))}
          </ul>
        )}
        <Button
          variant={"destructive"}
          size={"lg"}
          onClick={onSubmit}
          className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5.8rem]"
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default GameCreationPage;
