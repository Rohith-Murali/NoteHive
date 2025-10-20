import { FiEdit3, FiFileText, FiBell, FiTag, FiTrash2, FiBook } from "react-icons/fi";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen shadow-md flex flex-col justify-between fixed left-0 top-0 p-5">
      {/* Logo */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--primary-color)] mb-8">NoteHive</h1>

        {/* Menu */}
        <nav className="space-y-3">
          <button className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--secondary-color)] transition">
            <FiEdit3 /> Add New
          </button>
          <button className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--secondary-color)] transition">
            <FiFileText /> Your Notes
          </button>
          <button className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--secondary-color)] transition">
            <FiBook /> Notebooks
          </button>
          <button className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--secondary-color)] transition">
            <FiBell /> Reminders
          </button>
          <button className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--secondary-color)] transition">
            <FiTag /> Tags
          </button>
          <button className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--secondary-color)] transition">
            <FiTrash2 /> Bin
          </button>
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 NoteHive</p>
      </div>
    </aside>
  );
}
