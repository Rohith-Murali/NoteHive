import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 bg-[var(--bg-color)] min-h-screen">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
