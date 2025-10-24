import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import NotesPage from "./pages/NotesPage";
import TasksPage from "./pages/TasksPage";
import NotebookPage from "./pages/NotebookPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
