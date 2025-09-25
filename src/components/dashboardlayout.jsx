// src/components/DashboardWrapper.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./aside";

const DashboardWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // default open

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <Sidebar
        isMobile={isMobile}
        expanded={sidebarOpen}
        setExpanded={setSidebarOpen}
        className="w-[20%]"
      />

      {/* Main Content */}
      <main
        className={` transition-all duration-300
          w-[80%]
          ${isMobile && !sidebarOpen ? "ml-0" : "ml-[20%]"}
        `}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
