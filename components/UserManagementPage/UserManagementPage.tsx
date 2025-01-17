"use client";

import { User } from "next-auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("/api/users");

      const users = res.data;

      const sorted = users.sort((a: User, b: User) => {
        if (a.isAdmin === b.isAdmin) {
          return a.firstName.localeCompare(b.firstName);
        }
        return a.isAdmin ? 1 : -1;
      });
      setUsers(sorted);
    };

    fetchUsers();
  }, []);

  const handleUnderReview = async (userId: string, underReview: boolean) => {
    try {
      await axios.put(`/api/users/${userId}`, {
        underReview: !underReview,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, underReview: !underReview } : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/users/${userId}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="h-[100%] bg-[#e7e7e7] flex flex-col gap-10 py-8">
      <h1 className="text-2xl text-center font-bold italic underline underline-offset-8">
        Users
      </h1>
      <div className="flex flex-col gap-6">
        {users.map((user, index) => {
          const isLastUser = index === users.length - 1;

          return (
            <div key={user.id} className="flex flex-col items-center gap-6">
              <div className=" flex flex-col gap-4 items-start w-[90%] border-2 border-[#53285f] p-2 bg-white">
                <div className="flex gap-1">
                  <p className="font-semibold">{user.firstName}</p>
                  <p className="font-semibold">{user.lastName}:</p>
                </div>
                <div className="flex flex-col justify-between gap-4 w-full">
                  <p>{user.email}</p>
                  <p className="text-center flex w-full">
                    Num games: <strong>{user.games.length}</strong>
                  </p>
                  <p className="w-full">
                    Num game posts: <strong>{user.gamePosts.length}</strong>
                  </p>
                  <p className="w-full">
                    Num achievement posts:{" "}
                    <strong>{user.achievementPosts.length}</strong>
                  </p>
                  <div className="flex gap-4">
                    <p>Admin?</p>
                    <strong>{user.isAdmin ? "Yes" : "No"}</strong>
                  </div>
                  <div className="flex gap-4">
                    <p>Under review?</p>
                    <strong>{user.underReview ? "Yes" : "No"}</strong>
                  </div>
                </div>
                <div className="flex gap-[1.7rem]">
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    className="bg-[#ae3634] hover:bg-[#ae3634]/80 w-[9rem]"
                    onClick={() => {
                      if (user.id) {
                        handleUnderReview(user.id, user.underReview);
                      }
                    }}
                  >
                    {user.underReview
                      ? "Remove from review"
                      : "Place under review"}
                  </Button>
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    className="bg-[#ae3634] hover:bg-[#ae3634]/80"
                    onClick={() => {
                      if (user.id) {
                        handleDeleteUser(user.id);
                      }
                    }}
                  >
                    Delete User
                  </Button>
                </div>
              </div>

              {!isLastUser && <Separator className="my-4 bg-black w-[8rem]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserManagementPage;
