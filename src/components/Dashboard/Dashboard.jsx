import React from "react"

import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import Header from "./Header"
import DashboardHome from "./DashboardHome"
import EmployeeList from "../Employee/EmployeeList"
import AttendanceView from "../Attendance/AttendanceView"
import MessageCenter from "../Messages/MessageCenter"
import FeedView from "../Feed/FeedView"
import LeavesPage from "../Leaves/LeavesPage"

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { darkMode } = useSelector((state) => state.theme)

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={` App flex h-screen w-full overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      }`}
    >
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <motion.main
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8"
        >
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/attendance" element={<AttendanceView />} />
            <Route path="/messages" element={<MessageCenter />} />
            <Route path="/leaves" element={<LeavesPage />} />
            <Route path="/feeds" element={<FeedView />} />
          </Routes>
        </motion.main>
      </div>
    </div>
  )
}

export default Dashboard
