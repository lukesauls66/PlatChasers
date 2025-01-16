import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../Util";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface NewValidationErrors {
  title?: string;
  description?: string;
}

interface Errors {
  title?: string;
  description?: string;
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
    const newValidationErrors: NewValidationErrors = {};

    if (title[0] !== title[0].toUpperCase()) {
      newValidationErrors.title = "Title must be capitalized";
    }

    if (description.length > 300) {
      newValidationErrors.description =
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
        for (let achievement of achievements) {
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
      console.error("Error submitting form:", error);
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
    }
  };

  const areAchievements = achievements.length > 0;

  return (
    <div className="flex flex-col items-center py-5 h-[100%] bg-[#e7e7e7]">
      <h1 className="text-2xl font-bold">Create New Game</h1>
      <Separator className="mt-5 mb-7 bg-black w-[14rem]" />
      {/* <form onSubmit={onSubmit} className="flex flex-col items-center gap-8"> */}
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Input
            label="Game Title"
            type="title"
            id="title"
            value={title}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            className="w-[16rem] border-[#53285f] border-[2px]"
          />
          {errors?.title && <p className="text-[#ae3634]">{errors.title}</p>}
          <Input
            label="Game Description"
            type="description"
            id="description"
            value={description}
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
            className="w-[16rem] border-[#53285f] border-[2px]"
          />
          {errors?.description && (
            <p className="text-[#ae3634]">{errors.description}</p>
          )}
          <Input
            label="Game Preview Image"
            type="file"
            id="image"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            className="bg-white w-[16rem] border-[#53285f] border-[2px]"
          />
        </div>
        <Separator className="bg-black w-[14rem]" />
        {areAchievements && (
          <ul className="">
            {achievements.map((achievement, index) => (
              <div key={index}>
                <li key={index} className="flex justify-center">
                  <strong>{achievement.title}</strong>:{" "}
                  {achievement.description}
                </li>
                <Separator className="bg-black w-[14rem] mt-6 mb-2" />
              </div>
            ))}
          </ul>
        )}
        <div className="flex flex-col items-center justify-center gap-2 border-black border-[3px] w-[15.5rem] h-[18rem] p-2">
          <Input
            label="Achievement Title"
            type="text"
            id="achievementTitle"
            value={newAchievementTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAchievementTitle(e.target.value)
            }
            className="w-[13rem] border-[#53285f] border-[2px]"
          />
          <Input
            label="Achievement Description"
            type="text"
            id="achievementDescription"
            value={newAchievementDescription}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAchievementDescription(e.target.value)
            }
            className="w-[13rem] border-[#53285f] border-[2px]"
          />
          <Input
            label="Achievement Image"
            type="file"
            id="achievementImage"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAchievementImage(e.target.files ? e.target.files[0] : null)
            }
            className="bg-white w-[13rem] border-[#53285f] border-[2px]"
          />
          <Button
            variant={"destructive"}
            size={"lg"}
            onClick={handleAddAchievement}
            className="mt-2 bg-[#ae3634]"
          >
            Add Achievement
          </Button>
        </div>
        <Button
          variant={"destructive"}
          size={"lg"}
          onClick={onSubmit}
          className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5.8rem]"
        >
          Create
        </Button>
      </div>
      {/* </form> */}
    </div>
  );
};

export default GameCreationPage;
