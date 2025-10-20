import { FiSearch, FiBell, FiSettings } from "react-icons/fi";

export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between bg-white shadow-sm px-6 py-3 rounded-lg mb-5">
      {/* Search bar */}
      <div className="flex items-center gap-2 w-1/2 bg-[var(--secondary-color)] px-3 py-2 rounded-lg">
        <FiSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search your notes..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-[var(--secondary-color)]">
          <FiBell />
        </button>
        <button className="p-2 rounded-full hover:bg-[var(--secondary-color)]">
          <FiSettings />
        </button>
        <img
          src={`https://ui-avatars.com/api/?name=R+M&background=6c63ff&color=fff`}
          alt="user avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
}
