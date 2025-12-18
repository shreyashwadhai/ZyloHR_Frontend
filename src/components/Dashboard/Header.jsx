"use client";
import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { toggleTheme } from "../../store/slices/themeSlice";
import UserProfile from "../Modals/UserProfile";

const Header = ({ toggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const { unreadCount } = useSelector((state) => state.messages);
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Log user data for debugging
    // console.log("Current User:", user)
  }, [user]);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`${
          darkMode
            ? "bg-gray-900/80 border-gray-700/50"
            : "bg-white/80 border-slate-200/50"
        } border-b backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shadow-lg sticky top-0 z-30`}
      >
        <div className="flex items-center space-x-3 sm:space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className={`p-2 sm:p-3 rounded-xl ${
              darkMode
                ? "hover:bg-gray-800 text-gray-300"
                : "hover:bg-gray-100 text-gray-700"
            } transition-all duration-200`}
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
          <div>
            <h1
              className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none`}
            >
              Dashboard
            </h1>
            <p
              className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} hidden sm:block`}
            >
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(toggleTheme())}
            className={`p-2 sm:p-3 rounded-xl ${
              darkMode
                ? "hover:bg-gray-800 text-yellow-400"
                : "hover:bg-gray-100 text-gray-700"
            } transition-all duration-300`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <button
              className={`p-2 sm:p-3 rounded-xl ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              } transition-all duration-200 relative`}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
            >
              <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg"
                >
                  {unreadCount === 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
            onClick={toggleProfile}
          >
            <img
              src={
                user.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt={user?.name}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/10 shadow-lg"
            />
            <div className="hidden sm:block">
              <span
                className={`text-sm lg:text-base font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                } block truncate max-w-[100px] lg:max-w-none`}
              >
                {user?.name}
              </span>
              <span
                className={`text-xs lg:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* User Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              onClick={toggleProfile}
            >
              <div
                className={`absolute inset-0 ${darkMode ? "bg-gray-900" : "bg-gray-500"} opacity-75`}
              ></div>
            </div>

            {/* Modal container */}
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <UserProfile onClose={toggleProfile} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
