"use client";

// import { useRouter } from "next/router";
import Link from "next/link";
import { GiDiamondTrophy } from "react-icons/gi";
import Hamburger from "@/components/NavBar/HamburgerIcon";

const NavBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between py-5 px-6 bg-purple-600">
      <Link href="/" className="flex justify-center items-center">
        <h1 className="text-[2rem] md:text-4xl font-bold text-gray-400">
          PlatChasers
        </h1>
        <GiDiamondTrophy className="w-8 h-[2rem] text-gray-400" />
      </Link>
      <div>
        <Hamburger />
      </div>
    </div>
  );
};

export default NavBar;
