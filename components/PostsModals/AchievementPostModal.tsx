"use client";

import axios from "axios";
import { useState } from "react";
import { PostModal } from "../Util";
import { AchievementPost } from "@/types/game";

interface AchievementPostModalProps {
  gameId: string;
  achievementId: string;
  onClose: () => void;
  addPost: (newPost: AchievementPost) => void;
  editingPost?: AchievementPost | null;
  submitEdit?: (updatedPost: AchievementPost) => void;
}

const AchievementPostModal: React.FC<AchievementPostModalProps> = ({
  gameId,
  achievementId,
  onClose,
  addPost,
  editingPost,
  submitEdit,
}) => {
  const [body, setBody] = useState<string>(editingPost?.body || "");

  const isEditing = !!editingPost;

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      if (isEditing && editingPost && submitEdit) {
        const res = await axios.put(
          `/api/games/${gameId}/achievements/${achievementId}/achievementPosts/${editingPost.id}`,
          { body }
        );

        const updatedPost = res.data;
        submitEdit(updatedPost);
      } else {
        const res = await axios.post(
          `/api/games/${gameId}/achievements/${achievementId}/achievementPosts`,
          {
            body,
          }
        );

        const newPost = res.data;
        addPost(newPost);
      }

      onClose();
    } catch (error) {
      console.error("Error making new achievement post:", error);
    }
  };

  return (
    <PostModal
      value={body}
      setValue={setBody}
      onClose={onClose}
      handleSubmit={handleSubmit}
      isEditing={isEditing}
    />
  );
};

export default AchievementPostModal;
