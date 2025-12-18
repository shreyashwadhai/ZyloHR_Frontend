
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../../store/slices/authSlice";
import useIsMobile from "../../hooks/useIsMobile"; // ✅ Custom hook
import AppLogo from "../../assets/app_logo.jpg"

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile(); // ✅ Detect screen size

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: HomeIcon,
      path: "/dashboard",
      roles: ["admin", "manager", "employee"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Employees",
      icon: UsersIcon,
      path: "/dashboard/employees",
      roles: ["admin", "manager"],
      color: "from-emerald-500 to-teal-400",
    },
    {
      name: "Attendance",
      icon: ClockIcon,
      path: "/dashboard/attendance",
      roles: ["admin", "manager", "employee"],
      color: "from-emerald-500 to-teal-400",
      requiresFaceVerification: true,
    },
    {
      name: "Messages",
      icon: ChatBubbleLeftRightIcon,
      path: "/dashboard/messages",
      roles: ["admin", "manager", "employee"],
      color: "from-emerald-500 to-teal-400",
    },
    {
      name: "Leaves",
      icon: CalendarDaysIcon,
      path: "/dashboard/leaves",
      roles: ["admin", "manager", "employee"],
      color: "from-emerald-500 to-teal-400",
    },
    {
      name: "Feeds",
      icon: DocumentTextIcon,
      path: "/dashboard/feeds",
      roles: ["admin", "manager", "employee"],
      color: "from-emerald-500 to-teal-400",
    },
    {
      name: "Settings",
      icon: Cog6ToothIcon,
      path: "/dashboard/settings",
      roles: ["admin", "manager", "employee"],
      color: "from-emerald-500 to-teal-400",
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 lg:w-72 xl:w-80 bg-[#090e4a] text-white border-r border-white/10 backdrop-blur-xl shadow-2xl lg:static lg:inset-0`}
          >
            {/* Header */}
            <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 border-b border-white/10">
              <div className="flex items-center gap-2 space-x-3 sm:space-x-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20 shadow">
                  <img
                    src={AppLogo}
                    alt="logo"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-bold text-xl sm:text-2xl">ZyloHR</h1>
                  <p className="text-sm text-white/70 ">
                 {user?.role === "admin" ? "Admin Portal" : "Employee Portal"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex flex-col h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] overflow-y-auto">
              <nav className="flex-1 px-4 sm:px-6 py-6 space-y-2">
                {filteredMenuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      onClick={(e) => {
                        if (item.requiresFaceVerification) {
                          e.preventDefault();
                          navigate("/dashboard/attendance", {
                            state: { redirectTo: item.path },
                          });
                          // navigate("/dashboard/verify-face", {
                          //   state: { redirectTo: item.path },
                          // });
                          if (isMobile) setIsOpen(false);
                        } else {
                          if (isMobile) setIsOpen(false);
                        }
                      }}
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center gap-4 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white shadow-md scale-[1.03]`
                            : "hover:bg-white/10 hover:scale-[1.02] text-white/80"
                        }`
                      }
                    >
                      <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-base">{item.name}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* User Profile */}
              <div className="p-4 sm:p-6 border-t border-white/10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-4 mb-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md"
                >
                  <img
                    src={
                      user?.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={user?.name}
                    className="w-12 h-12 rounded-full border-2 border-white/20 shadow"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-bold truncate">{user?.name}</p>
                    <p className="text-sm text-white/70">
                      {user?.role?.toUpperCase()}
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="flex items-center w-full px-5 py-3 text-base font-semibold text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-2xl transition-all duration-300 group cursor-pointer"
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" />
                  Sign Out
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
