import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [sidebarWidth, setSidebarWidth] = useState(256);
  return (
    <div className="flex">
      <Sidebar onWidthChange={setSidebarWidth} />
      <main
        className="transition-all duration-300 p-6"
        style={{ marginLeft: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)` }}
      >
        {children}
      </main>
    </div>
  );
}
