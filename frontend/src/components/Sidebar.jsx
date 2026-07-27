import { useState, useEffect } from "react";
import {
  FiMenu,
  FiTrash2,
  FiBook,
  FiUser,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onWidthChange, isMobile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // true = expanded, false = collapsed/icon rail
  const [expanded, setExpanded] = useState(!isMobile);

  // Reset state when screen size changes
  useEffect(() => {
    setExpanded(!isMobile);
  }, [isMobile]);

  // Inform Layout only on desktop
  useEffect(() => {
    if (isMobile) {
      onWidthChange?.(0);
    } else {
      onWidthChange?.(expanded ? 200 : 80);
    }
  }, [expanded, isMobile, onWidthChange]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      icon: <FiBook size={18} />,
      label: "Notebooks",
      path: "/",
    },
    {
      icon: <FiTrash2 size={18} />,
      label: "Trash",
      path: "/trash",
    },
    {
      icon: <FiSettings size={18} />,
      label: "Settings",
      path: "/settings",
    },
    {
      icon: <FiUser size={18} />,
      label: "Profile",
      path: "/profile",
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 z-50
        h-screen
        bg-sidebar
        shadow-lg
        overflow-hidden
        transition-all
        duration-300
        ${expanded ? "w-55" : "w-22"}
      `}
      style={{
        boxShadow: expanded && isMobile ? "0 0 0 9999px rgba(0,0,0,.35)" : "",
      }}
    >
      <div className="flex h-full flex-col justify-between">
        {/* Top */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            {expanded && (
              <h1 className="whitespace-nowrap text-2xl font-semibold text-[var(--primary-color)]">
                NoteHive
              </h1>
            )}

            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="shrink-0 text-gray-600 hover:text-[var(--primary-color)]"
            >
              <FiMenu size={18} />
            </button>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full
                  flex
                  items-center
                  rounded-lg
                  px-3
                  py-3
                  transition
                  hover:bg-[var(--secondary-color)]
                  ${
                    expanded
                      ? "justify-start gap-3"
                      : "justify-center"
                  }
                `}
                style={{ color: "var(--text-color)" }}
              >
                {item.icon}

                {expanded && (
                  <span className="whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className={`
              w-full
              flex
              items-center
              rounded-lg
              px-3
              py-3
              transition
              hover:bg-[var(--secondary-color)]
              ${
                expanded
                  ? "justify-start gap-3"
                  : "justify-center"
              }
            `}
            style={{ color: "var(--text-color)" }}
          >
            <FiLogOut size={18} />

            {expanded && (
              <span className="whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}