import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";

const AttendanceModal = ({ isOpen, onClose, records }) => {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative ${
              darkMode
                ? "bg-gradient-to-br from-gray-900/95 to-slate-900/95 border-gray-700/50"
                : "bg-gradient-to-br from-white/95 to-blue-50/95 border-blue-200/50"
            } rounded-xl p-6 sm:p-8 max-w-6xl w-[96vw] mx-4 max-h-[85vh] overflow-hidden shadow-2xl border backdrop-blur-xl`}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h2
                      className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      📊 Attendance History
                    </h2>
                    <p
                      className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Complete attendance records
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                {/* Mobile View */}
                <div className="block lg:hidden space-y-4">
                  {records.map((record, index) => {
                    const hours = record.punchOut
                      ? (
                          (new Date(record.punchOut) -
                            new Date(record.punchIn)) /
                          (1000 * 60 * 60)
                        ).toFixed(1)
                      : "Active";

                    return (
                      <motion.div
                        key={record._id || record.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        className={`p-4 sm:p-6 rounded-2xl border ${
                          darkMode
                            ? "bg-gray-800/50 border-gray-600/50"
                            : "bg-white/80 border-gray-200/50"
                        } backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p
                              className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              📅{" "}
                              {new Date(record.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-bold ${
                              record.status === "present"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                            }`}
                          >
                            {record.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p
                              className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                            >
                              🕐 Punch In
                            </p>
                            <p
                              className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {new Date(record.punchIn).toLocaleTimeString()}
                            </p>
                          </div>
                          <div>
                            <p
                              className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                            >
                              🕐 Punch Out
                            </p>
                            <p
                              className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {record.punchOut
                                ? new Date(record.punchOut).toLocaleTimeString()
                                : "-"}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p
                              className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                            >
                              ⏱️ Total Hours
                            </p>
                            <p
                              className={`font-bold text-lg ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                            >
                              {hours} {hours !== "Active" ? "hrs" : ""}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={`border-b-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <th
                          className={`text-left py-4 px-6 font-bold text-base ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          📅 Date
                        </th>
                        <th
                          className={`text-left py-4 px-6 font-bold text-base ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          🕐 Punch In
                        </th>
                        <th
                          className={`text-left py-4 px-6 font-bold text-base ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          🕐 Punch Out
                        </th>
                        <th
                          className={`text-left py-4 px-6 font-bold text-base ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ⏱️ Hours
                        </th>
                        <th
                          className={`text-left py-4 px-6 font-bold text-base ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          📊 Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record, index) => {
                        const hours = record.punchOut
                          ? `${(
                              (new Date(record.punchOut) -
                                new Date(record.punchIn)) /
                              (1000 * 60 * 60)
                            ).toFixed(1)} hours`
                          : "Active";

                        return (
                          <motion.tr
                            key={record._id || record.id || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            className={`border-b transition-colors duration-200 ${
                              darkMode
                                ? "border-gray-700/50 hover:bg-gray-800/30"
                                : "border-gray-200/50 hover:bg-gray-50/50"
                            }`}
                          >
                            <td
                              className={`py-4 px-6 font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {new Date(record.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td
                              className={`py-4 px-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                            >
                              {new Date(record.punchIn).toLocaleTimeString()}
                            </td>
                            <td
                              className={`py-4 px-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                            >
                              {record.punchOut
                                ? new Date(record.punchOut).toLocaleTimeString()
                                : "-"}
                            </td>
                            <td
                              className={`py-4 px-6 font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                            >
                              {hours} {hours !== "Active" ? "hrs" : ""}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-4 py-2 rounded-xl text-sm font-bold ${
                                  record.status === "present"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                    : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                }`}
                              >
                                {record.status.toUpperCase()}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AttendanceModal;
