import { Button } from "@/components/ui/button";
import { Game, GamePost } from "@/types/game";
import axios from "axios";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IoIosThumbsUp, IoIosThumbsDown } from "react-icons/io";
import { useSession } from "next-auth/react";
import { GamePostModal } from "@/components/PostsModals";

interface GamePostsContainerProps {
  gameId: string;
  game: Game | null;
}

const GamePostsContainer: React.FC<GamePostsContainerProps> = ({
  gameId,
  game,
}) => {
  const [gamePosts, setGamePosts] = useState<GamePost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<GamePost | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchGamePostUsernames = async () => {
      if (!game?.gamePosts) return;

      const newGamePosts = game.gamePosts;

      newGamePosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setGamePosts(newGamePosts);
    };

    fetchGamePostUsernames();
  }, [game]);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleAddPost = async (newPost: GamePost) => {
    setGamePosts((prev) => [newPost, ...prev]);
  };

  const handleEditPost = (updatedPost: GamePost) => {
    setGamePosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handlePostDelete = async (gamePostId: string) => {
    await axios.delete(`/api/games/${game?.id}/gamePosts/${gamePostId}`);

    setGamePosts((prev) => prev.filter((post) => post.id !== gamePostId));
  };

  const areGamePosts = gamePosts.length > 0;

  return (
    <div className="flex flex-col gap-4 items-center h-[20rem] w-[16.5rem] rounded-md border-black border-2 bg-white overflow-y-auto">
      <div className="sticky top-0 flex justify-center bg-[#53285f]/90 mt-2 pt-1 w-60 h-8 rounded-sm">
        <h1 className="font-semibold text-xl text-[#e7e7e7]">Game Posts</h1>
      </div>
      {areGamePosts ? (
        <div className="flex flex-col items-center gap-4 pb-2 px-2 w-[100%]">
          <Button
            variant={"destructive"}
            size={"lg"}
            className="bg-[#ae3634] hover:bg-[#ae3634]/80"
            onClick={handleModalOpen}
          >
            Post
          </Button>
          {gamePosts.map((post, index) => {
            const isLastPost = index === gamePosts.length - 1;

            const isOwner = post.userId === session?.user.id;

            return (
              <div key={post.id}>
                <div className="flex flex-col gap-4 bg-[#e7e7e7] p-3 border-black border-2 rounded-sm w-[15.4rem]">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold">Posted by:</p>
                    <p className="text-sm italic">{post.username}</p>
                  </div>
                  <p className="text-sm">{post.body}</p>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <IoIosThumbsUp className="text-2xl" />
                      <p>{post.likes}</p>
                    </div>
                    <div className="flex gap-2">
                      <IoIosThumbsDown className="text-2xl" />
                      <p>{post.dislikes}</p>
                    </div>
                  </div>
                  {isOwner && (
                    <div className="flex justify-between">
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem]"
                        onClick={() => {
                          handleModalOpen();
                          setEditingPost(post);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem]"
                        onClick={() => handlePostDelete(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
                {!isLastPost && <Separator className="mt-5 mb-1 bg-[#333]" />}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-6 pt-4">
          <p className="text-xl italic">Make the First Post</p>
          <Button
            variant={"destructive"}
            size={"lg"}
            className="bg-[#ae3634] hover:bg-[#ae3634]/80"
            onClick={handleModalOpen}
          >
            Post
          </Button>
        </div>
      )}
      {isModalOpen && (
        <GamePostModal
          gameId={gameId}
          onClose={() => {
            handleModalClose();
            setEditingPost(null);
          }}
          addPost={handleAddPost}
          editingPost={editingPost}
          submitEdit={handleEditPost}
        />
      )}
    </div>
  );
};

export default GamePostsContainer;
