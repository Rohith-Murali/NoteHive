import { useState, useEffect, useRef } from "react";
import {
  FiMenu,
  FiEdit3,
  FiFileText,
  FiTag,
  FiTrash2,
  FiBook,
  FiUser,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onWidthChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const actualCollapsed = collapsed && (!hovered || !isMobile);

  // Responsive collapse/expand based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        // below lg breakpoint
        setCollapsed(true);
        setIsMobile(true);
      } else {
        setCollapsed(false);
        setIsMobile(false);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Notify parent layout (Dashboard, etc.) about width changes
  useEffect(() => {
    const width = actualCollapsed ? 100 : 256;
    if (onWidthChange) onWidthChange(width);
  }, [actualCollapsed, onWidthChange]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { icon: <FiBook />, label: "Notebooks", path: "/" },
    { icon: <FiEdit3 />, label: "Add New", path: "/new" },
    { icon: <FiFileText />, label: "Your Notes", path: "/notes" },
    { icon: <FiTag />, label: "Tags", path: "/tags" },
    { icon: <FiTrash2 />, label: "Trash", path: "/trash" },
    { icon: <FiSettings />, label: "Settings", path: "/settings" },
  ];

  return (
    <aside
      className={`${actualCollapsed ? "w-28" : "w-64"}
        bg-sidebar h-screen shadow-md flex flex-col justify-between fixed left-0 top-0 transition-all duration-300 z-50`}
      onMouseEnter={() => isMobile && setHovered(true)}
      onMouseLeave={() => isMobile && setHovered(false)}
    >
      {/* Top Section */}
      <div className="flex flex-col p-4">
        {/* Header / Logo */}
        <div className="flex items-center justify-between mb-8">
          {!actualCollapsed && (
            <h1 className="text-2xl font-semibold text-[var(--primary-color)]">
              NoteHive
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-[var(--primary-color)]"
          >
            <FiMenu size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--secondary-color)] transition"
              style={{ color: "var(--text-color)" }}
            >
              {item.icon}
              {!actualCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Section */}
      <div className="relative p-4 border-t" ref={profileRef}>
        <button
          className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--secondary-color)] transition"
          onClick={() => setProfileMenuOpen((prev) => !prev)}
        >
          <img
            src={`https://ui-avatars.com/api/?name=R+M&background=6c63ff&color=fff`}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          {!actualCollapsed && (
            <div className="flex-1 text-left">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-color)" }}
              >
                Rohith Murali
              </p>
            </div>
          )}
        </button>

        {/* Dropdown Menu */}
        {profileMenuOpen && (
          <div
            className={`absolute bottom-16 left-0 bg-sidebar shadow-lg border rounded-lg overflow-hidden transition-all duration-200 ${
              actualCollapsed ? "w-48 translate-x-10" : "w-full"
            }`}
            onMouseEnter={() => setProfileMenuOpen(true)}
            onMouseLeave={() => setProfileMenuOpen(false)}
          >
            <button
              onClick={() => {
                navigate("/profile");
                setProfileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 py-2 px-3 text-left text-gray-700 hover:bg-[var(--secondary-color)]"
            >
              <FiUser /> View Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 py-2 px-3 text-left text-red-500 hover:bg-[var(--secondary-color)]"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
