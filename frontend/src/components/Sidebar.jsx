import { useState, useEffect } from "react";
import {
  FiMenu,
  FiTrash2,
  FiBook,
  FiUser,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onWidthChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
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
  }, [user]);

  // Notify parent layout (Dashboard, etc.) about width changes
  useEffect(() => {
    const width = actualCollapsed ? 100 : 256;
    if (onWidthChange) onWidthChange(width);
  }, [actualCollapsed, onWidthChange]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { icon: <FiBook />, label: "Notebooks", path: "/" },
    { icon: <FiTrash2 />, label: "Trash", path: "/trash" },
    { icon: <FiSettings />, label: "Settings", path: "/settings" },
    { icon: <FiUser />, label: "Profile", path: "/profile" }
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
      <div className="relative p-4 border-t">
        <button
          className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--secondary-color)] transition"
          onClick={handleLogout}
        >
          {!actualCollapsed && (
            <div className="flex-1 text-left">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-color)" }}
              >
                <FiLogOut />Logout
              </p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
