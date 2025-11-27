import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { FiBookOpen } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { teacher_nav_item } from "../../public/assist";

const TeacherNavBar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed lg:relative z-50 w-64 h-screen bg-gradient-to-b from-green-600 to-emerald-700 text-white flex flex-col shadow-lg
        ${sidebarOpen ? "block" : "hidden lg:flex"} overflow-y-scroll`}
      >
        <div className="p-6">
          <h1 className="text-lg font-bold flex items-center">
            <FiBookOpen className="mr-2" />
            IslamicLearn Admin
          </h1>
          <p className="text-green-100 text-sm mt-1">
            Administration Dashboard
          </p>
        </div>

        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-1">
            {teacher_nav_item.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition ${
                      isActive
                        ? "bg-white text-green-700 shadow-lg"
                        : "text-green-100 hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-green-500/30">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center px-4 py-3 text-green-100 hover:bg-white/10 rounded-xl transition"
          >
            <FaHome className="mr-3" />
            Go to Home
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default TeacherNavBar;
