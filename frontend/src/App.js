import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import NotesPage from "./pages/NotesPage";
import TasksPage from "./pages/TasksPage";
import NotebookPage from "./pages/NotebookPage";
import TrashPage from "./pages/TrashPage";
import SettingsPage from "./pages/SettingsPage";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { theme, fontSize } = useSelector((state) => state.settings);

  useEffect(() => {
    // compute effective theme: if user selected 'system' follow OS preference
    const getEffectiveTheme = () => {
      if (theme === "system") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        return "light";
      }
      return theme;
    };

    const applyTheme = (t) => {
      document.body.setAttribute("data-bs-theme", t);
    };

    // initial apply
    const effective = getEffectiveTheme();
    applyTheme(effective);

    // listen to system preference changes when user chooses 'system'
    let mq;
    const handleChange = (e) => {
      if (theme === "system") applyTheme(e.matches ? "dark" : "light");
    };
    if (window.matchMedia) {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener ? mq.addEventListener("change", handleChange) : mq.addListener(handleChange);
    }

    // Set font size on the root so Tailwind/rem-based sizes scale with settings
    try {
      document.documentElement.style.fontSize = `${fontSize}px`;
      document.body.style.fontSize = `${fontSize}px`;
    } catch (e) {
      document.body.style.fontSize = `${fontSize}px`;
    }

    return () => {
      if (mq) mq.removeEventListener ? mq.removeEventListener("change", handleChange) : mq.removeListener(handleChange);
    };
  }, [theme, fontSize]);
  
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private */}
        {/* Private routes are wrapped by PrivateRoute, then by Layout so all private pages share the layout */}
        <Route element={<PrivateRoute />}>
          <Route
            element={
              <Layout>
                <Outlet />
              </Layout>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/notebook/:notebookId" element={<NotebookPage />} />
            <Route path="/notebook/:notebookId/notes/new" element={<NotesPage />} />
            <Route path="/notebook/:notebookId/tasks/new" element={<TasksPage />} />
            <Route path="/notebook/:notebookId/notes/:noteId" element={<NotesPage />} />
            <Route path="/notebook/:notebookId/tasks/:taskId" element={<TasksPage />} />
            <Route path="/trash" element={<TrashPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
