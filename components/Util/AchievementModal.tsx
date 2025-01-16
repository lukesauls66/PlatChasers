"use client";

import { Button } from "../ui/button";
import Input from "./Input";

const GameAchievementModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[18rem]">
        <h1 className="text-xl font-semibold mb-4"></h1>
        <Input label="Title" type="text" id="" />
        <Input label="Description" type="text" id="" />
        <Input label="Image" type="file" id="" />
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

export default GameAchievementModal;
