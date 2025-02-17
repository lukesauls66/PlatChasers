"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleManageGames = () => {
    router.push("/games");
    toggleSidebar();
  };

  const handleManageUsers = () => {
    router.push("/users");
    toggleSidebar();
  };

  const isAdmin = session?.user.isAdmin === true;

  return (
    <div>
      <div
        className={`fixed top-0 right-0 h-full bg-[#c0bfbf] text-[#53285f] text-lg sm:text-2xl xl:text-3xl font-bold transition-transform duration-300 ${
          isOpen ? "transform translate-x-0" : "transform translate-x-full"
        } w-[11rem] md:w-[280px] py-4 px-2 z-40`}
      >
        {status === "authenticated" && isAdmin ? (
          <div className="flex flex-col items-center h-[95vh] justify-between">
            <div className="flex flex-col gap-4 items-center">
              <p className="text-center">{session?.user?.username}</p>
              <Separator className="bg-black w-[8rem]" />
              <div className="flex flex-col gap-4">
                <p className="text-center">Admin Tasks:</p>
                <Button
                  onClick={handleManageGames}
                  variant={"destructive"}
                  size={"sm"}
                  className="bg-[#ae3634] hover:bg-[#ae3634]/80 lg:h-[3rem] lg:text-lg xl:text-lg"
                >
                  Manage Games
                </Button>
                <Button
                  onClick={handleManageUsers}
                  variant={"destructive"}
                  size={"sm"}
                  className="bg-[#ae3634] hover:bg-[#ae3634]/80 lg:h-[3rem] lg:text-lg xl:text-lg"
                >
                  Manage Users
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center">
              <Separator className="bg-black w-[8rem]" />
              <LogoutButton />
            </div>
          </div>
        ) : status === "authenticated" && !isAdmin ? (
          <div className="flex flex-col items-center h-[95vh] justify-between">
            <p>{session?.user?.username}</p>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex flex-col gap-[1.5rem] lg:gap-[3rem] p-[1rem]">
            <button
              onClick={() => {
                toggleSidebar();
                history.pushState(null, "", "/?Variant=login");
                const event = new PopStateEvent("popstate");
                dispatchEvent(event);
                router.push("/?Variant=login");
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                toggleSidebar();
                history.pushState(null, "", "/?Variant=register");
                const event = new PopStateEvent("popstate");
                dispatchEvent(event);
                router.push("/?Variant=register");
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-30"
        />
      )}
    </div>
  );
};

export default Sidebar;
