import React from "react";
import { Button } from "../ui/button";

interface PostModalProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isEditing?: boolean;
}

const PostModal: React.FC<PostModalProps> = ({
  value,
  setValue,
  onClose,
  handleSubmit,
  isEditing = false,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[18rem] sm:w-[23rem] md:w-[27rem] lg:w-[32rem] md:h-[20rem] lg:h-[24rem]">
        <h1 className="text-xl xl:text-2xl font-semibold mb-4">
          {isEditing ? "Update Post" : "Create New Post"}
        </h1>
        <textarea
          className="w-full md:h-[11rem] lg:h-[15rem] lg:text-lg p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#53285f] focus:ring-1 focus:ring-[#53285f]"
          rows={4}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write your post here..."
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="bg-gray-300 hover:bg-gray-400 xl:w-[5rem] xl:text-lg"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="bg-[#ae3634] hover:bg-[#ae3634]/80 xl:w-[4rem] xl:text-lg"
            onClick={handleSubmit}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
