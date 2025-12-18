import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { closeBirthdayModal } from "../../store/slices/employeeSlice"

const BirthdayModal = () => {
  const { birthdayEmployees, showBirthdayModal } = useSelector((state) => state.employees)
  const { darkMode } = useSelector((state) => state.theme)
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(closeBirthdayModal())
  }

  return (
    <AnimatePresence>
      {showBirthdayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 50, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative ${
              darkMode
                ? "bg-gradient-to-br from-gray-900/95 to-slate-900/95 border-gray-700/50"
                : "bg-gradient-to-br from-white/95 to-pink-50/95 border-pink-200/50"
            } rounded-3xl p-6 sm:p-8 lg:p-10 max-w-md w-full mx-4 shadow-2xl border backdrop-blur-xl overflow-hidden`}
          >
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-yellow-500/10"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-yellow-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 z-10"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
            </motion.button>

            <div className="text-center relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6"
              >
                🎉
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                } bg-gradient-to-r from-pink-600 via-purple-600 to-yellow-600 bg-clip-text text-transparent`}
              >
                Happy Birthday! 🎂
              </motion.h2>

              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {birthdayEmployees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 200 }}
                    className={`flex items-center space-x-4 p-4 sm:p-6 rounded-2xl ${
                      darkMode ? "bg-gray-800/50" : "bg-white/80"
                    } backdrop-blur-sm border border-white/20 shadow-lg hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="relative">
                      <img
                        src={employee.avatar || "/placeholder.svg"}
                        alt={employee.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-3 border-gradient-to-r from-pink-500 to-yellow-500 shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎈</div>
                    </div>
                    <div className="text-left flex-1">
                      <h3 className={`font-bold text-base sm:text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {employee.name}
                      </h3>
                      <p className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {employee.department}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-xs sm:text-sm">🎂</span>
                        <span
                          className={`text-xs sm:text-sm font-medium ${darkMode ? "text-pink-400" : "text-pink-600"}`}
                        >
                          Birthday Today!
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                🎊 Let's celebrate together and make this day special! 🎊
              </motion.p>

              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="bg-gradient-to-r from-pink-500 via-purple-600 to-yellow-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base lg:text-lg hover:from-pink-400 hover:via-purple-500 hover:to-yellow-400 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 flex items-center justify-center space-x-2"
              >
                <span>🎉 Let's Celebrate! 🎉</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default BirthdayModal
