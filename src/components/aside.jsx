// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  Home,
  User,
  LogOut,
  Image,
  Mail,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const menus = [
  { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
  { name: "Gallery", icon: <Image size={20} />, path: "/gallery" },
  { name: "Contact", icon: <Mail size={20} />, path: "/contact" },
  { name: "Bookings", icon: <Calendar size={20} />, path: "/bookings" },
  { name: "Profile", icon: <User size={20} />, path: "/profile" },
  { name: "Logout", icon: <LogOut size={20} />, path: "/logout" },
];

const Sidebar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Hamburger */}
      {isMobile && !expanded && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setExpanded(true)}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            <Menu size={28} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white text-gray-800 z-40 flex flex-col justify-between
          transition-all duration-300 shadow-lg
          ${isMobile ? (expanded ? "w-4/5" : "w-16") : "w-1/5"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {(!isMobile || expanded) && (
            <h1 className="text-2xl font-bold text-blue-600 tracking-wide">
              Okello Panel
            </h1>
          )}
          {isMobile && expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <X size={28} />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 flex flex-col mt-4 gap-2 overflow-y-auto px-2">
          {menus.map((menu) => (
            <a
              key={menu.name}
              href={menu.path}
              className={`
                flex items-center gap-4 p-3 rounded-xl transition-all
                ${isActive(menu.path) ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-gray-100"}
                ${!isMobile || expanded ? "justify-start" : "justify-center"}
              `}
              title={menu.name}
            >
              {menu.icon}
              {(!isMobile || expanded) && <span className="text-lg">{menu.name}</span>}
            </a>
          ))}
        </nav>

        {/* Footer */}
        {(!isMobile || expanded) && (
          <div className="p-6 border-t border-gray-200 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Joshua Creations
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isMobile && expanded && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={() => setExpanded(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
