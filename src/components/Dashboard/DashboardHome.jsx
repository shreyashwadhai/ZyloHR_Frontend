"use client";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  UsersIcon,
  UserGroupIcon,
  DocumentTextIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import DashboardChart from "./DashboardChart";
import { getAllEmployees } from "../../store/slices/employeeSlice";
import { fetchLeaves } from "../../store/slices/leaveSlice";
import { fetchAttendanceRecords } from "../../store/slices/attendanceSlice";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { employees, loading } = useSelector((state) => state.employees);
  const { attendanceRecords } = useSelector((state) => state.attendance);
  const { leaves } = useSelector((state) => state.leaves);
  const { darkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "manager") {
      dispatch(getAllEmployees());
      dispatch(fetchLeaves());
      // dispatch(fetchAttendanceRecords());
    }
  }, [dispatch, user?.role]);

  const activeEmployees = useMemo(() => {
    return employees.filter((emp) => emp?.status === "active");
  }, [employees]);

  // useEffect(() => {
  //   console.log("Fetched Employees in Dashboard:", employees);

  //   console.log("Fetched Leaves in Dashboard:", leaves);
  // }, [employees, leaves]);

  const stats = [
    ...(user?.role === "admin" || user?.role === "manager"
      ? [
          {
            name: "Total Employees",
            value:
              employees.filter(
                (e) => e.role === "employee" || e.role === "manager"
              ).length || 0,

            icon: UsersIcon,
            gradient: "from-emerald-500 via-teal-500 to-cyan-500",
            bgGradient: "from-emerald-50 to-teal-50",
            darkBgGradient: "from-emerald-900/20 to-teal-900/20",
            iconColor: "text-emerald-600 dark:text-emerald-400",
          },
        ]
      : []),
    {
      name: "Leave Applications",
      value: leaves.length || 0,
      icon: DocumentTextIcon,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-50 to-indigo-50",
      darkBgGradient: "from-blue-900/20 to-indigo-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Attendance Today",
      // value: attendanceRecords.filter((record) => {
      //   const today = new Date().toISOString().split("T")[0];
      //   return record.date === today;
      // }).length,
      value: attendanceRecords.length,
      icon: UserGroupIcon,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgGradient: "from-amber-50 to-orange-50",
      darkBgGradient: "from-amber-900/20 to-orange-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      name: "Absent Today",
      value: 0,
      icon: UserMinusIcon,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-50 to-rose-50",
      darkBgGradient: "from-pink-900/20 to-rose-900/20",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center sm:text-left"
      >
        <h1
          className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {user?.name}
          </span>
          ! 👋
        </h1>
        <p
          className={`text-base sm:text-lg lg:text-xl font-medium ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Here's what's happening at your company today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              y: -8,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border ${
              darkMode
                ? `bg-gradient-to-br ${stat.darkBgGradient} border-gray-700/50 backdrop-blur-sm`
                : `bg-gradient-to-br ${stat.bgGradient} border-white/50 backdrop-blur-sm`
            }`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
            ></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <p
                  className={`text-sm sm:text-base font-semibold mb-2 sm:mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {stat.name}
                </p>
                <p
                  className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {stat.value}
                </p>
                <div
                  className={`w-full h-1 bg-gradient-to-r ${stat.gradient} rounded-full`}
                ></div>
              </div>
              <div
                className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className={`rounded-2xl sm:rounded-3xl px-6 sm:px-10 py-8 sm:py-12 shadow-xl border overflow-hidden relative ${
          darkMode
            ? "bg-gray-900/50 border-gray-700/50 backdrop-blur-xl"
            : "bg-white/70 border-white/50 backdrop-blur-xl"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Analytics Dashboard
              </h2>
              <p
                className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Year 2025 Performance Overview
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span
                className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Live Data
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px] lg:min-w-0">
              <DashboardChart />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
