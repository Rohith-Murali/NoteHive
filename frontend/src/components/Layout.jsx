import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 798);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 798);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        isMobile={isMobile}
        onWidthChange={setSidebarWidth}
      />

      <main
        className="flex-1 min-w-0 p-4 sm:p-6 transition-all duration-300"
        style={{
          marginLeft: isMobile ? 80 : sidebarWidth,
        }}
      >
        {children}
      </main>
    </div>
  );
}