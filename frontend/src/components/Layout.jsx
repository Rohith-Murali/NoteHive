import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 798);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 798);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen overflow-auto">
      <Sidebar
        isMobile={isMobile}
        onWidthChange={setSidebarWidth}
      />

      <main
        className="min-h-screen transition-all duration-300 p-6"
        style={{
          marginLeft: isMobile ? sidebarWidth + 80 : sidebarWidth,
          width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        {children}
      </main>
    </div>
  );
}