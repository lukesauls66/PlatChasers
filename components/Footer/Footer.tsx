import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex justify-between items-center h-[2.5rem] py-3 px-6 sm:h-[4rem] md:h-[6rem] md:pt-4 md:px-[2.5rem] xl:px-[4rem] bg-[#53285f] border-t-[#333]">
      <a
        href="https://www.linkedin.com/in/luke-sauls-437786330/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="flex justify-center items-center bg-[#0077b5] h-4 w-4 sm:h-8 sm:w-8 text-text-white hover:cursor-pointer hover:scale-110">
          <FaLinkedin className="size-[1rem] sm:size-[2rem] md:size-[2.5rem] lg:size-[3.5rem]" />
        </button>
      </a>
      <a
        href="https://github.com/lukesauls66"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="flex justify-center items-center bg-[#333] h-4 w-4 sm:h-8 sm:w-8 hover:cursor-pointer hover:scale-110">
          <FaGithub className="size-[1rem] sm:size-[2rem] md:size-[2.5rem] lg:size-[3.5rem]" />
        </button>
      </a>
    </div>
  );
};

export default Footer;
