"use client";

import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { data: session, status } = useSession();
  console.log("user: ", session?.user);

  return (
    <div>
      <div
        className={`fixed top-0 right-0 h-full bg-gray-400 text-purple-600 text-xl md:text-2xl font-bold transition-transform duration-300 ${
          isOpen ? "transform translate-x-0" : "transform translate-x-full"
        } w-[140px] md:w-[280px] p-4 z-40`}
      >
        {status === "authenticated" ? (
          <div>
            <p>{session?.user?.name}</p>
            <LogoutButton />
          </div>
        ) : (
          <ul className="flex flex-col gap-[1.5rem] p-[1rem]">
            <li className="flex justify-center">
              <a href="/login">Login</a>
            </li>
            <li className="flex justify-center">
              <a href="/signup">Signup</a>
            </li>
          </ul>
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
