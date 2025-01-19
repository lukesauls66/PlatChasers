"use client";

import { Button } from "@/components/ui/button";
import { Achievement, AchievementPost } from "@/types/game";
import axios from "axios";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { AchievementPostModal } from "@/components/PostsModals";
import { useSession } from "next-auth/react";

interface AchievementPostsContainerProps {
  gameId: string;
  achievementId: string;
  achievement: Achievement | null;
}

const AchievementPostsContainer: React.FC<AchievementPostsContainerProps> = ({
  gameId,
  achievementId,
  achievement,
}) => {
  const [achievementPosts, setAchievementPosts] = useState<AchievementPost[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AchievementPost | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAchievementPostUsernames = async () => {
      if (!achievement?.achievementPosts) return;

      const newAchievementPosts = achievement.achievementPosts;

      newAchievementPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAchievementPosts(newAchievementPosts);
    };

    fetchAchievementPostUsernames();
  }, [achievement]);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleAddPost = async (newPost: AchievementPost) => {
    setAchievementPosts((prev) => [newPost, ...prev]);
  };

  const handleEditPost = (updatedPost: AchievementPost) => {
    setAchievementPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handleDeletePost = async (achievementPostId: string) => {
    await axios.delete(
      `/api/games/${gameId}/achievements/${achievementId}/achievementPosts/${achievementPostId}`
    );

    setAchievementPosts((prev) =>
      prev.filter((post) => post.id !== achievementPostId)
    );
  };

  const areAchievementPosts = achievementPosts.length > 0;

  const isAdmin = session?.user.isAdmin === true;

  return (
    <div className="flex flex-col gap-4 items-center h-[23rem] md:h-full w-full max-w-[40rem] rounded-md border-black border-2 bg-white overflow-y-auto md:overflow-y-visible">
      <div className="sticky top-0 flex justify-center bg-[#53285f]/90 pt-1 w-full h-8">
        <h1 className="font-semibold text-xl text-[#e7e7e7]">
          Achievement Posts
        </h1>
      </div>
      {areAchievementPosts ? (
        <div className="flex flex-col items-center gap-4 pb-2 px-2 w-full">
          {session?.user && session?.user.underReview === false ? (
            <Button
              variant={"destructive"}
              size={"lg"}
              className="bg-[#ae3634] hover:bg-[#ae3634]/80 md:text-lg"
              onClick={handleModalOpen}
            >
              Post
            </Button>
          ) : null}
          {achievementPosts.map((post, index) => {
            const isLastPost = index === achievementPosts.length - 1;

            const isOwner = post.userId === session?.user.id;

            return (
              <div className="w-full" key={post.id}>
                <div className="flex flex-col gap-4 md:gap-8 lg:gap-[3rem] bg-[#e7e7e7] p-3 border-black border-2 rounded-sm w-full">
                  <div className="flex justify-between">
                    <p className="text-sm sm:text-md md:text-lg xl:text-[1.3rem] font-semibold">
                      Posted by:
                    </p>
                    <p className="text-sm sm:text-md md:text-lg xl:text-[1.3rem] italic">
                      {post?.username}
                    </p>
                  </div>
                  <p className="text-sm sm:text-md md:text-lg xl:text-[1.3rem]">
                    {post.body}
                  </p>
                  {(isOwner && (
                    <div>
                      {session?.user.underReview === false ? (
                        <div className="flex justify-between">
                          <Button
                            variant={"destructive"}
                            size={"sm"}
                            className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem] md:w-[7rem] xl:w-[9rem] xl:h-[3rem] md:text-lg xl:text-2xl"
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
                            className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem] md:w-[7rem] xl:w-[9rem] xl:h-[3rem] md:text-lg xl:text-2xl"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  )) ||
                    (isAdmin && (
                      <div className="flex justify-end">
                        <Button
                          variant={"destructive"}
                          size={"sm"}
                          className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[5rem] md:w-[7rem] xl:w-[9rem] xl:h-[3rem] md:text-lg xl:text-2xl"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                </div>
                {!isLastPost && <Separator className="mt-5 mb-1 bg-[#333]" />}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {session?.user ? (
            <div className="flex flex-col gap-6 py-[5rem]">
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
          ) : (
            <div className="flex pt-[5rem]">
              <p className="text-lg font-semibold">Sign in to start posting!</p>
            </div>
          )}
        </div>
      )}
      {isModalOpen && (
        <AchievementPostModal
          gameId={gameId}
          achievementId={achievementId}
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

export default AchievementPostsContainer;
