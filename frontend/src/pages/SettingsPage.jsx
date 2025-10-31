import { useDispatch, useSelector } from "react-redux";
import {
  setTheme,
  setFontSize,
  setSortOrder,
  setNotifications,
  setAutoSave,
  resetSettings,
} from "../redux/slices/settingsSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  FiMoon,
  FiSun,
  FiType,
  FiArrowUpCircle,
  FiBell,
  FiCpu,
  FiUser,
  FiRotateCcw,
} from "react-icons/fi";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, fontSize, sortOrder, notifications, autoSave } = useSelector(
    (state) => state.settings
  );

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
    document.body.style.fontSize = `${fontSize}px`;
  }, [theme, fontSize]);

  return (
    <main
      className="transition-all duration-300"
    >
      <div
        className="container-fluid"
      >
        <h2 className="fw-bold text-center mb-5 text-2xl">
        Settings
        </h2>

        {/* 🌓 Appearance */}
        <SectionHeader icon={theme === "light" ? <FiSun/> : <FiMoon/>} title="Appearance" />
        <div className="row g-3 mb-4">
          <SettingCard
            title="Theme"
            desc="Choose light, dark, or follow system"
            theme={theme}
            right={
              <select
                className="form-select"
                value={theme}
                onChange={(e) => dispatch(setTheme(e.target.value))}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System (follow OS)</option>
              </select>
            }
          />
          <SettingCard
            title={
              <span className="d-flex align-items-center gap-2">
                <FiType /> Font Size
              </span>
            }
            desc={`Adjust text size (${fontSize}px)`}
            theme={theme}
            body={
              <input
                type="range"
                className="form-range mt-2"
                min="12"
                max="22"
                value={fontSize}
                onChange={(e) => dispatch(setFontSize(e.target.value))}
              />
            }
          />
        </div>

        {/* 🗂️ Organization */}
        <SectionHeader icon={<FiArrowUpCircle />} title="Organization" />
        <SettingCard
          title="Default Sort Order"
          desc="How notes and notebooks are arranged by default."
          theme={theme}
          body={
            <select
              className="form-select mt-3"
              value={sortOrder}
              onChange={(e) => dispatch(setSortOrder(e.target.value))}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
            </select>
          }
        />

        {/* 🔔 Functionality */}
        <SectionHeader icon={<FiCpu />} title="Functionality" />
        <div className="row g-3 mb-4">
          <SettingCard
            title={
              <span className="d-flex align-items-center gap-2">
                <FiBell /> Notifications
              </span>
            }
            desc="Enable reminders and updates (dummy)"
            theme={theme}
            right={
              <div className="form-check form-switch fs-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) =>
                    dispatch(setNotifications(e.target.checked))
                  }
                />
              </div>
            }
          />
          <SettingCard
            title={
              <span className="d-flex align-items-center gap-2">
                <FiCpu /> Auto-Save Notes
              </span>
            }
            desc="Automatically save while editing (dummy)"
            theme={theme}
            right={
              <div className="form-check form-switch fs-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => dispatch(setAutoSave(e.target.checked))}
                />
              </div>
            }
          />
        </div>

        {/* 👤 Account */}
        <SectionHeader icon={<FiUser />} title="Account" />
        <SettingCard
          title="Manage Account"
          desc="Update or remove your profile."
          theme={theme}
          body={
            <div className="d-flex gap-2 mt-3">
              <button
                onClick={() => navigate("/profile")}
                className="btn btn-outline-primary"
              >
                Edit Profile
              </button>
              <button className="btn btn-outline-danger">Delete Account</button>
            </div>
          }
        />

        {/* 🔄 Reset */}
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2 mx-auto px-4"
            onClick={() => dispatch(resetSettings())}
          >
            <FiRotateCcw /> Reset to Default
          </button>
        </div>
      </div>
    </main>
  );
}

/* 🔹 Reusable Section Header */
function SectionHeader({ icon, title }) {
  return (
    <h4 className="mb-3 mt-4 text-secondary d-flex align-items-center gap-2">
      {icon} {title}
    </h4>
  );
}

/* 🔹 Reusable Setting Card */
function SettingCard({ title, desc, right, body, theme }) {
  return (
    <div className="col-md-12 col-lg-12 border rounded p-2">
      <div
        className="card shadow-sm border-0 bg-gray-300 rounded hover:bg-gray-200"
      >
        <div className="card-body d-flex justify-content-between align-items-start flex-wrap">
          <div>
            <h5 className="card-title mb-1">{title}</h5>
            <small className="text-muted">{desc}</small>
            {body && <div>{body}</div>}
          </div>
          {right && <div>{right}</div>}
        </div>
      </div>
    </div>
  );
}
