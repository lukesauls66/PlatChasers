import { useState, useEffect, useRef } from "react";
import { Game } from "@/types/game";
import Link from "next/link";

interface SearchBarProps {
  games: Game[];
}

const SearchBar: React.FC<SearchBarProps> = ({ games }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sortedGames = games.sort((a, b) => (a.title > b.title ? 1 : -1));

    setFilteredGames(
      sortedGames.filter((game) =>
        game.title.toLowerCase().startsWith(searchInput.toLowerCase())
      )
    );
  }, [searchInput, games]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const areGamesToSearch = filteredGames.length > 0;

  return (
    <div ref={searchBarRef} className="relative w-full max-w-md">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          setIsDropdownOpen(true);
        }}
        placeholder="Search Games"
        className="text-center w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#53285f]/90"
      />
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto shadow-lg">
          {areGamesToSearch ? (
            filteredGames.map((game) => (
              <div key={game.id}>
                <Link href={`/games/${game.id}`}>
                  <div className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                    <p className="text-center">{game.title}</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No games found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
