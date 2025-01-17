import { Achievement } from "@/types/game";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { Input } from "../Util";
import axios from "axios";

interface AchievementPostAndEditModalProps {
  gameId?: string;
  achievementId?: string;
  onClose: () => void;
  addAchievement: (newAchievement: Achievement) => void;
  editingAchievement?: Achievement | null;
  submitEdit?: (updatedAchievement: Achievement) => void;
}

interface NewValidationErrors {
  title?: string;
  description?: string;
  image?: string;
}

interface Errors {
  title?: string;
  description?: string;
  image?: string;
}

const AchievementPostAndEditModal: React.FC<
  AchievementPostAndEditModalProps
> = ({
  gameId,
  achievementId,
  onClose,
  addAchievement,
  editingAchievement,
  submitEdit,
}) => {
  const [title, setTitle] = useState<string>(editingAchievement?.title || "");
  const [description, setDescription] = useState<string>(
    editingAchievement?.description || ""
  );
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const isEditing = !!editingAchievement;

  const achievementValidationErrors = (title: string, description: string) => {
    const newValidationErrors: NewValidationErrors = {};

    if (!title.length) {
      newValidationErrors.title = "Title is required";
    } else if (title[0] !== title[0].toUpperCase()) {
      newValidationErrors.title = "Title must be capitalized";
    }

    if (!description.length) {
      newValidationErrors.description = "Description is required";
    } else if (description.length > 300) {
      newValidationErrors.description =
        "Description must be less than 300 characters";
    }

    if (!image && !isEditing) {
      newValidationErrors.image = "Image is required";
    }

    return newValidationErrors;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrors({});

    const achievementErrors = achievementValidationErrors(title, description);

    if (Object.keys(achievementErrors).length > 0) {
      setErrors(achievementErrors);
      return;
    }

    try {
      if (isEditing && editingAchievement && submitEdit) {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);

        if (image) {
          formData.append("image", image);
        }

        const res = await axios.put(
          `/api/games/${gameId}/achievements/${achievementId}`,
          formData
        );

        const updatedAchievement = res.data;
        submitEdit(updatedAchievement);
        onClose();
      } else {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);

        if (image) {
          formData.append("image", image);
        }

        const res = await axios.post(
          `/api/games/${gameId}/achievements`,
          formData
        );

        const newAchievement = res.data;
        addAchievement(newAchievement);
        onClose();
      }
    } catch (error) {
      console.error("Error making/editing achievement:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[18rem]">
        <h1 className="text-xl font-semibold mb-4">
          {isEditing ? "Update Achievement" : "Create New Achievement"}
        </h1>
        <Input
          label="Achievement Title"
          type="text"
          id="title"
          value={title}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          className="w-full border-[#53285f] border-[2px] shadow shadow-black"
        />
        {errors?.title && <p className="text-[#ae3634]">{errors.title}</p>}
        <textarea
          className="w-full h-[8rem] p-2 border-2 border-black rounded-md mt-4 mb-2 shadow shadow-black"
          rows={4}
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write achievement description here..."
        />
        {errors?.description && (
          <p className="text-[#ae3634]">{errors.description}</p>
        )}
        <Input
          label="Achievement Preview Image"
          type="file"
          id="image"
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setImage(e.target.files ? e.target.files[0] : null)
          }
          className="bg-white w-full border-[#53285f] border-[2px] shadow shadow-black"
        />
        {errors?.image && <p className="text-[#ae3634]">{errors.image}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="bg-[#ae3634] hover:bg-[#ae3634]/80"
            onClick={handleSubmit}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AchievementPostAndEditModal;
