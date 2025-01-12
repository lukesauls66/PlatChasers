"use client";

import { useSession } from "next-auth/react";
import { useVariant } from "@/context/Variant";
import LogoutButton from "./LogoutButton";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { data: session, status } = useSession();
  console.log("user: ", session?.user);

  const { setVariant } = useVariant();

  return (
    <div>
      <div
        className={`fixed top-0 right-0 h-full bg-[#c0bfbf] text-[#53285f] text-xl md:text-2xl font-bold transition-transform duration-300 ${
          isOpen ? "transform translate-x-0" : "transform translate-x-full"
        } w-[140px] md:w-[280px] p-4 z-40`}
      >
        {status === "authenticated" ? (
          <div className="flex flex-col items-center h-[95vh] justify-between">
            <p>{session?.user?.username}</p>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex flex-col gap-[1.5rem] p-[1rem]">
            <button
              onClick={() => {
                toggleSidebar();
                setVariant("login");
              }}
            >
              Login
            </button>
            <button
              onClick={() => {
                toggleSidebar();
                setVariant("register");
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
