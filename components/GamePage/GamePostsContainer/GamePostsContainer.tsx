import { Button } from "@/components/ui/button";
import { Game, GamePost } from "@/types/game";
import axios from "axios";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { IoIosThumbsUp, IoIosThumbsDown } from "react-icons/io";

interface GamePostsContainerProps {
  game: Game | null;
}

const GamePostsContainer: React.FC<GamePostsContainerProps> = ({ game }) => {
  const [gamePosts, setGamePosts] = useState<GamePost[]>([]);

  useEffect(() => {
    const fetchUsernames = async () => {
      if (!game?.gamePosts) return;

      const postsWithUsernames = await Promise.all(
        game.gamePosts.map(async (post) => {
          try {
            const res = await axios.get(`/api/users/${post.userId}`);
            return { ...post, username: res.data.username };
          } catch (error) {
            return { ...post, username: "Unknown user" };
          }
        })
      );

      setGamePosts(postsWithUsernames);
    };

    fetchUsernames();
  }, [game]);

  const arePosts = gamePosts.length > 0;

  return (
    <div className="flex flex-col gap-4 items-center h-[20rem] w-[16.5rem] rounded-md border-black border-2 bg-white overflow-y-auto">
      <div className="sticky top-0 flex justify-center bg-[#53285f]/90 mt-2 pt-1 w-60 h-8 rounded-sm">
        <h1 className="font-semibold text-xl text-[#e7e7e7]">Game Posts</h1>
      </div>
      {arePosts ? (
        <div className="flex flex-col items-center gap-4 pb-2 px-2 w-[100%]">
          <Button
            variant={"destructive"}
            size={"lg"}
            className="bg-[#ae3634] hover:bg-[#ae3634]/80"
          >
            Post
          </Button>
          {gamePosts.map((post, index) => {
            const isLastPost = index === gamePosts.length - 1;

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
            className="bg-[#53285f]/90 hover:bg-purple-700/80"
          >
            Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default GamePostsContainer;
