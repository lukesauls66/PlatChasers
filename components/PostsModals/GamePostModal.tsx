import axios from "axios";
import { useState } from "react";
import { PostModal } from "../Util";
import { GamePost } from "@/types/game";

interface GamePostModalProps {
  gameId: string;
  onClose: () => void;
  addPost: (newPost: GamePost) => void;
  editingPost?: GamePost | null;
  submitEdit?: (updatedPost: GamePost) => void;
}

const GamePostModal: React.FC<GamePostModalProps> = ({
  gameId,
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
          `/api/games/${gameId}/gamePosts/${editingPost.id}`,
          { body }
        );

        const updatedPost = res.data;
        submitEdit(updatedPost);
      } else {
        const res = await axios.post(`/api/games/${gameId}/gamePosts`, {
          body,
        });

        const newPost = res.data;
        addPost(newPost);
      }

      onClose();
    } catch (error) {
      console.error("Error making new game post: ", error);
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

export default GamePostModal;
