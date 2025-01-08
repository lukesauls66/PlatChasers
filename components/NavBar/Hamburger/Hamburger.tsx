"use client";

import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import Sidebar from "@/components/NavBar/SideBar";

const Hamburger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="flex flex-col justify-center items-center w-8 h-8 space-y-1 z-50"
      >
        <RxHamburgerMenu className="w-8 h-8" />
      </button>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Hamburger;
