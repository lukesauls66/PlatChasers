"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Game } from "@/types/game";
import { Input } from "../Util";
import axios from "axios";

interface GameEditModalProps {
  onClose: () => void;
  editingGame: Game | null;
  submitEdit: (updatedGame: Game) => void;
}

interface NewValidationErrors {
  title?: string;
  description?: string;
}

interface Errors {
  title?: string;
  description?: string;
}

const GameEditModal: React.FC<GameEditModalProps> = ({
  onClose,
  editingGame,
  submitEdit,
}) => {
  const [title, setTitle] = useState<string>(editingGame?.title || "");
  const [description, setDescription] = useState<string>(
    editingGame?.description || ""
  );
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const gameEditValidationErrors = (title: string, description: string) => {
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

  const updateGame = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      const res = await axios.put(`/api/games/${editingGame?.id}`, formData);

      const updatedGame = res.data;
      submitEdit(updatedGame);
    } catch (error) {
      console.error("Error updating game:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        serverError: "An unexpected error occurred",
      }));
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrors({});

    const gameCreationErrors = gameEditValidationErrors(title, description);

    if (Object.keys(gameCreationErrors).length > 0) {
      setErrors(gameCreationErrors);
      return;
    }

    updateGame();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-5">
      <div className="bg-[#e7e7e7] p-6 rounded-lg shadow-lg w-full max-w-[30rem]">
        <h1 className="text-xl font-semibold mb-4">Edit Game</h1>
        <Input
          label="Game Title"
          type="text"
          id="title"
          value={title}
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
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write game description here..."
        />
        {errors?.description && (
          <p className="text-[#ae3634]">{errors.description}</p>
        )}
        <Input
          label="Game Preview Image"
          type="file"
          id="image"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewImageFile(e.target.files ? e.target.files[0] : null)
          }
          className="bg-white w-full border-[#53285f] border-[2px] shadow shadow-black"
        />
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

export default GameEditModal;
