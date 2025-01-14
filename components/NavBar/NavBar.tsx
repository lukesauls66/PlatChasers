"use client";

import Link from "next/link";
import { useVariant } from "@/context/Variant";
import { GiTrophyCup } from "react-icons/gi";
import Hamburger from "./Hamburger";

const NavBar: React.FC = () => {
  const { setVariant } = useVariant();

  return (
    <div className="flex items-center justify-between py-5 px-6 bg-[#53285f]">
      <Link
        onClick={() => setVariant("home")}
        href="/"
        className="flex items-center"
      >
        <h1 className="text-[2rem] md:text-4xl font-bold text-[#e7e7e7]">
          PlatChasers
        </h1>
        <GiTrophyCup className="w-8 h-[2rem] text-[#e7e7e7] mb-2" />
      </Link>
      <div>
        <Hamburger />
      </div>
    </div>
  );
};

export default NavBar;

// purple-600
