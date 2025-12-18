// import React from "react";
// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { motion } from "framer-motion";
// import {
//   ClockIcon,
//   CalendarIcon,
//   PlayIcon,
//   StopIcon,
//   ExclamationTriangleIcon,
//   LockClosedIcon,
// } from "@heroicons/react/24/outline";
// import {
//   punchIn,
//   punchOut,
//   fetchTodayAttendance,
//   fetchAttendanceRecords,
//   setLocationStatus,
//   clearAttendanceError,
// } from "../../store/slices/attendanceSlice";
// import AttendanceModal from "../Modals/AttendanceModal";
// import { toast } from "react-toastify";

// // Office coordinates configuration
// const OFFICE_CONFIG = {
//   latitude: 21.165047,
//   longitude: 79.078782,
//   maxDistance: 5000,
// };

// const AttendanceView = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [password, setPassword] = useState("");
//   const [verificationInProgress, setVerificationInProgress] = useState(false);

//   const { user } = useSelector((state) => state.auth);

//   // const [locationStatus, setLocationStatus] = useState({
//   //   loading: false,
//   //   coordinates: null,
//   //   error: null,
//   //   distance: null,
//   // });

//   const {
//     attendanceRecords,
//     todayAttendance,
//     loading,
//     error,
//     locationStatus,
//     // fetchAttendanceRecords,
//   } = useSelector((state) => state.attendance);

//   const { darkMode } = useSelector((state) => state.theme);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     console.log(attendanceRecords);
//     const fetchData = async () => {
//       try {
//         if (user?._id) {
//           await dispatch(fetchTodayAttendance(user._id));
//           await dispatch(fetchAttendanceRecords(user._id));
//         }
//       } catch (err) {
//         console.error("Failed to fetch attendance data:", err);
//         toast.error("Failed to load attendance data");
//       }
//     };

//     fetchData();
//   }, [dispatch, user?._id]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearAttendanceError());
//     }
//   }, [error, dispatch]);

//   const checkGeolocation = () => {
//     dispatch(setLocationStatus({ loading: true, error: null }));

//     if (!navigator.geolocation) {
//       dispatch(
//         setLocationStatus({
//           loading: false,
//           error: "Geolocation is not supported by your browser",
//         })
//       );
//       return Promise.resolve(false);
//     }

//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const userCoords = {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           };

//           const distance = calculateDistance(
//             userCoords.latitude,
//             userCoords.longitude,
//             OFFICE_CONFIG.latitude,
//             OFFICE_CONFIG.longitude
//           );

//           dispatch(
//             setLocationStatus({
//               loading: false,
//               coordinates: userCoords,
//               error: null,
//               distance: distance,
//             })
//           );

//           resolve(distance <= OFFICE_CONFIG.maxDistance);
//         },
//         (error) => {
//           const errorMsg = error.message || "Unable to retrieve your location";
//           dispatch(
//             setLocationStatus({
//               loading: false,
//               error: errorMsg,
//             })
//           );
//           reject(new Error(errorMsg));
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0,
//         }
//       );
//     });
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // Earth radius in meters
//     const φ1 = (lat1 * Math.PI) / 180;
//     const φ2 = (lat2 * Math.PI) / 180;
//     const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//     const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   };

//   // Verify all conditions before punch in/out
//   const verifyConditions = async () => {
//     try {
//       const isLocationValid = await checkGeolocation();
//       if (!isLocationValid) {
//         if (locationStatus.error) {
//           toast.error(`Location error: ${locationStatus.error}`, {
//             autoClose: 5000,
//           });
//         } else {
//           toast.error(
//             `You must be within ${OFFICE_CONFIG.maxDistance}m of the office to punch in/out.`,
//             { autoClose: 5000 }
//           );
//         }
//         return false;
//       }
//       return true;
//     } catch (error) {
//       toast.error(error.message, { autoClose: 5000 });
//       return false;
//     }
//   };

//   // const handlePunchIn = async () => {
//   //   if (!canPunchIn()) {
//   //     toast.error("You can only punch in once per day", { autoClose: 5000 });
//   //     return;
//   //   }

//   //   const verified = await verifyConditions();
//   //   if (!verified) return;

//   //   dispatch(punchIn({ employeeId: user.id }));
//   //   toast.success("🎯 Punched in successfully!");
//   // };

//   // const handlePunchOut = async () => {
//   //   if (!hasPunchedIn || hasPunchedOut) return;

//   //   try {
//   //     setVerificationInProgress(true);
//   //     const verified = await verifyConditions();

//   //     if (verified) {
//   //       dispatch(punchOut({ employeeId: user.id }));
//   //       toast.success("✅ Punched out successfully!");
//   //     }
//   //   } catch (error) {
//   //     toast.error(`Error: ${error.message}`, { autoClose: 5000 });
//   //   } finally {
//   //     setVerificationInProgress(false);
//   //   }
//   // };

//   const handlePunchIn = async () => {
//     if (!canPunchIn()) {
//       toast.error("You can only punch in once per day", { autoClose: 5000 });
//       return;
//     }

//     setVerificationInProgress(true);
//     try {
//       const verified = await verifyConditions();
//       if (!verified) {
//         setVerificationInProgress(false);
//         return;
//       }

//       console.log("Current user ID:", user?._id);
//       const result = await dispatch(punchIn(user._id)).unwrap();
//       toast.success("🎯 Punched in successfully!");
//       console.log("Punch in result:", result);
//     } catch (error) {
//       console.error("Punch in failed:", error);

//       toast.error(error.message || "Failed to punch in");
//     } finally {
//       setVerificationInProgress(false);
//     }
//   };

//   // const handlePunchOutClick = async () => {
//   //   if (hasPunchedOutToday()) {
//   //     toast.error("You have already punched out today", { autoClose: 5000 });
//   //     return;
//   //   }

//   //   const verified = await verifyConditions();
//   //   if (!verified) return;

//   //   setShowPasswordModal(true);
//   // };

//   const handlePunchOutClick = async () => {
//     if (hasPunchedOutToday()) {
//       toast.error("You have already punched out today", { autoClose: 5000 });
//       return;
//     }

//     setVerificationInProgress(true);
//     const verified = await verifyConditions();
//     if (!verified) {
//       setVerificationInProgress(false);
//       return;
//     }

//     setShowPasswordModal(true);
//     setVerificationInProgress(false);
//   };

//   const handlePunchOutConfirm = async () => {
//     if (password !== "0000") {
//       toast.error("Incorrect punch out password", { autoClose: 5000 });
//       return;
//     }

//     try {
//       await dispatch(punchOut(user.id)).unwrap();
//       toast.success("✅ Punched out successfully!");
//       setShowPasswordModal(false);
//       setPassword("");
//     } catch (error) {
//       toast.error(error.message || "Failed to punch out");
//     }
//   };

//   const userAttendance = attendanceRecords
//     .filter((record) => record.employeeId === user?._id)
//     .sort((a, b) => new Date(b.date) - new Date(a.date));

//   const hasPunchedIn = todayAttendance && !todayAttendance.punchOut;
//   const hasPunchedOut = todayAttendance && todayAttendance.punchOut;

//   // Check if user has already punched in today
//   const hasPunchedInToday = () => {
//     if (!todayAttendance) return false;
//     const today = new Date().toDateString();
//     const punchInDate = new Date(todayAttendance.punchIn).toDateString();
//     return today === punchInDate;
//   };

//   // Check if user has already punched out today
//   const hasPunchedOutToday = () => {
//     if (!todayAttendance || !todayAttendance?.punchOut) return false;
//     const today = new Date().toDateString();
//     const punchOutDate = new Date(todayAttendance.punchOut).toDateString();
//     return today === punchOutDate;
//   };

//   // Check if user can punch in (only allowed once per day)
//   const canPunchIn = () => {
//     return !hasPunchedInToday() || !hasPunchedOutToday();
//   };

//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const formattedTime = currentTime.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });

//   return (
//     <div className="space-y-6 sm:space-y-8 lg:space-y-10">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6"
//       >
//         <div>
//           <h1
//             className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}
//           >
//             ⏰ Attendance Tracker
//           </h1>
//           <p
//             className={`text-base sm:text-lg lg:text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//           >
//             Track your daily work hours and attendance
//           </p>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.05, y: -2 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setShowModal(true)}
//           className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 w-full sm:w-auto"
//         >
//           📊 View History
//         </motion.button>
//       </motion.div>

//       {/* Status Indicators */}
//       <div className="flex flex-wrap gap-3 sm:gap-4">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
//             locationStatus.coordinates
//               ? locationStatus.distance <= OFFICE_CONFIG.maxDistance
//                 ? darkMode
//                   ? "bg-green-900/30 border-green-500/30"
//                   : "bg-green-100 border-green-200"
//                 : darkMode
//                   ? "bg-red-900/30 border-red-500/30"
//                   : "bg-red-100 border-red-200"
//               : darkMode
//                 ? "bg-yellow-900/30 border-yellow-500/30"
//                 : "bg-yellow-100 border-yellow-200"
//           } border`}
//         >
//           <div
//             className={`w-3 h-3 rounded-full ${
//               locationStatus.coordinates
//                 ? locationStatus.distance <= OFFICE_CONFIG.maxDistance
//                   ? "bg-green-500"
//                   : "bg-red-500"
//                 : "bg-yellow-500"
//             }`}
//           ></div>
//           <span
//             className={`text-sm font-medium ${
//               darkMode ? "text-gray-300" : "text-gray-700"
//             }`}
//           >
//             {locationStatus.loading
//               ? "Checking location..."
//               : locationStatus.error
//                 ? "Location error"
//                 : locationStatus.coordinates
//                   ? locationStatus.distance <= OFFICE_CONFIG.maxDistance
//                     ? `In office (${Math.round(locationStatus.distance)}m)`
//                     : `Out of office (${Math.round(locationStatus.distance)}m)`
//                   : "Location not checked"}
//           </span>
//         </motion.div>
//       </div>

//       {/* Current Time Display */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 0.2, duration: 0.5 }}
//         className={`text-center py-8 sm:py-12 px-4 sm:px-6 lg:px-10 rounded-2xl sm:rounded-3xl ${
//           darkMode
//             ? "bg-gradient-to-br from-gray-900/50 to-slate-900/50 border-gray-700/50"
//             : "bg-gradient-to-br from-white/70 to-slate-50/70 border-gray-200/50"
//         } border backdrop-blur-xl shadow-xl`}
//       >
//         <div
//           className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}
//         >
//           {/* {getCurrentTime()} */}
//           {formattedTime}
//         </div>
//         <p
//           className={`text-base sm:text-lg mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//         >
//           Current Time
//         </p>
//       </motion.div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
//         {/* Today's Attendance */}
//         <motion.div
//           initial={{ opacity: 0, x: -30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.3, duration: 0.6 }}
//           className={`rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl border ${
//             darkMode
//               ? "bg-gradient-to-br from-gray-900/50 to-slate-900/50 border-gray-700/50"
//               : "bg-gradient-to-br from-white/70 to-blue-50/70 border-blue-200/50"
//           } backdrop-blur-xl relative overflow-hidden`}
//         >
//           {/* Background decoration */}
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
//           <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>

//           <div className="relative z-10">
//             <div className="flex items-center space-x-4 mb-6 sm:mb-8">
//               <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
//                 <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//               </div>
//               <div>
//                 <h2
//                   className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
//                 >
//                   Today's Attendance
//                 </h2>
//                 <p
//                   className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//                 >
//                   {new Date().toLocaleDateString("en-US", {
//                     weekday: "long",
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </p>
//               </div>
//             </div>

//             {/* Verification warnings */}
//             {locationStatus.coordinates &&
//               locationStatus.distance > OFFICE_CONFIG.maxDistance && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${
//                     darkMode ? "bg-red-900/30" : "bg-red-100"
//                   }`}
//                 >
//                   <ExclamationTriangleIcon
//                     className={`w-5 h-5 mt-0.5 ${darkMode ? "text-red-400" : "text-red-600"}`}
//                   />
//                   <div>
//                     <p
//                       className={`font-medium ${darkMode ? "text-red-300" : "text-red-800"}`}
//                     >
//                       Attendance restrictions in effect
//                     </p>
//                     <ul
//                       className={`list-disc list-inside text-sm ${darkMode ? "text-red-400" : "text-red-600"} space-y-1 mt-1`}
//                     >
//                       {locationStatus.coordinates &&
//                         locationStatus.distance > OFFICE_CONFIG.maxDistance && (
//                           <li>
//                             You must be within {OFFICE_CONFIG.maxDistance}m of
//                             the office
//                           </li>
//                         )}
//                     </ul>
//                   </div>
//                 </motion.div>
//               )}

//             <div className="space-y-4 sm:space-y-6">
//               {todayAttendance ? (
//                 <div className="space-y-4">
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`p-4 sm:p-6 rounded-2xl ${
//                       darkMode
//                         ? "bg-emerald-900/20 border-emerald-500/30"
//                         : "bg-emerald-50 border-emerald-200"
//                     } border-2`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p
//                           className={`text-sm sm:text-base lg:text-lg font-semibold  ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
//                         >
//                           ✅ Punch In Time
//                         </p>
//                         <p
//                           className={`text-xl sm:text-2xl lg:text-3xl font-bold ${darkMode ? "text-white" : "text-emerald-800"}`}
//                         >
//                           {new Date(
//                             todayAttendance.punchIn
//                           ).toLocaleTimeString()}
//                         </p>
//                       </div>
//                       <div className="p-3 bg-emerald-500 rounded-xl">
//                         <PlayIcon className="w-6 h-6 text-white" />
//                       </div>
//                     </div>
//                   </motion.div>

//                   {todayAttendance.punchOut && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.2 }}
//                       className={`p-4 sm:p-6 rounded-2xl ${
//                         darkMode
//                           ? "bg-red-900/20 border-red-500/30"
//                           : "bg-red-50 border-red-200"
//                       } border-2`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p
//                             className={`text-sm font-semibold ${darkMode ? "text-red-400" : "text-red-600"}`}
//                           >
//                             🛑 Punch Out Time
//                           </p>
//                           <p
//                             className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-red-800"}`}
//                           >
//                             {new Date(
//                               todayAttendance.punchOut
//                             ).toLocaleTimeString()}
//                           </p>
//                         </div>
//                         <div className="p-3 bg-red-500 rounded-xl">
//                           <StopIcon className="w-6 h-6 text-white" />
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}

//                   {todayAttendance.punchOut && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.4 }}
//                       className={`p-4 sm:p-6 rounded-2xl ${
//                         darkMode
//                           ? "bg-blue-900/20 border-blue-500/30"
//                           : "bg-blue-50 border-blue-200"
//                       } border-2`}
//                     >
//                       <p
//                         className={`text-sm font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"} mb-2`}
//                       >
//                         ⏱️ Total Hours Worked
//                       </p>
//                       <p
//                         className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-blue-800"}`}
//                       >
//                         {(
//                           (new Date(todayAttendance.punchOut) -
//                             new Date(todayAttendance.punchIn)) /
//                           (1000 * 60 * 60)
//                         ).toFixed(1)}{" "}
//                         hours
//                       </p>
//                     </motion.div>
//                   )}
//                 </div>
//               ) : (
//                 <div
//                   className={`text-center py-8 sm:py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
//                 >
//                   <ClockIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-50" />
//                   <p className="text-lg sm:text-xl font-semibold mb-2">
//                     No attendance record for today
//                   </p>
//                   <p className="text-sm sm:text-base">
//                     Punch in to start tracking your time
//                   </p>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
//                 <motion.button
//                   whileHover={{ scale: 1.02, y: -2 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handlePunchIn}
//                   disabled={hasPunchedIn || verificationInProgress}
//                   className={`flex-1 py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
//                     hasPunchedIn || verificationInProgress
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg hover:shadow-emerald-500/25"
//                   }`}
//                 >
//                   {verificationInProgress ? (
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                   ) : (
//                     <PlayIcon className="w-5 h-5" />
//                   )}
//                   <span>Punch In</span>
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02, y: -2 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handlePunchOutClick}
//                   disabled={
//                     !hasPunchedInToday() ||
//                     hasPunchedOutToday() ||
//                     verificationInProgress
//                   }
//                   className={`flex-1 py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
//                     !hasPunchedInToday() ||
//                     hasPunchedOutToday() ||
//                     verificationInProgress
//                       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                       : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400 shadow-lg hover:shadow-red-500/25"
//                   }`}
//                 >
//                   {verificationInProgress ? (
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                   ) : (
//                     <StopIcon className="w-5 h-5" />
//                   )}
//                   <span>Punch Out</span>
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Recent Attendance */}
//         <motion.div
//           initial={{ opacity: 0, x: 30 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border ${
//             darkMode
//               ? "bg-gradient-to-br from-gray-900/50 to-slate-900/50 border-gray-700/50"
//               : "bg-gradient-to-br from-white/70 to-purple-50/70 border-purple-200/50"
//           } backdrop-blur-xl relative overflow-hidden`}
//         >
//           {/* Background decoration */}
//           <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
//           <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>

//           <div className="relative z-10">
//             <div className="flex items-center space-x-4 mb-6 sm:mb-8">
//               <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
//                 <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//               </div>
//               <div>
//                 <h2
//                   className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
//                 >
//                   Recent Attendance
//                 </h2>
//                 <p
//                   className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//                 >
//                   Last 5 attendance records
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
//               {userAttendance
//                 .slice(0, 5)
//                 // .reverse()
//                 .map((record, index) => (
//                   <motion.div
//                     key={record._id || record.id || index}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1, duration: 0.5 }}
//                     className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105 ${
//                       darkMode
//                         ? "bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70"
//                         : "bg-gray-50/80 border-gray-200/50 hover:bg-white/90"
//                     }`}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <p
//                           className={`font-bold text-base sm:text-lg ${darkMode ? "text-white" : "text-gray-900"}`}
//                         >
//                           📅{" "}
//                           {new Date(record.date || record.punchIn).toLocaleDateString("en-US", {
//                             weekday: "short",
//                             month: "short",
//                             day: "numeric",
//                           })}
//                         </p>
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-1 sm:space-y-0">
//                           <p
//                             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//                           >
//                             🕐 In:{" "}
//                             {new Date(record.punchIn).toLocaleTimeString()}
//                           </p>
//                           <p
//                             className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
//                           >
//                             🕐 Out:{" "}
//                             {record.punchOut
//                               ? new Date(record.punchOut).toLocaleTimeString()
//                               : "Active"}
//                           </p>
//                         </div>
//                         {record.punchOut && (
//                           <p
//                             className={`text-sm mt-1 font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
//                           >
//                             ⏱️{" "}
//                             {(
//                               (new Date(record.punchOut) -
//                                 new Date(record.punchIn)) /
//                               (1000 * 60 * 60)
//                             ).toFixed(1)}{" "}
//                             hours
//                           </p>
//                         )}
//                       </div>
//                       <span
//                         className={`px-3 py-1 rounded-xl text-xs font-bold ${
//                           record.status === "present"
//                             ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
//                             : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
//                         }`}
//                       >
//                         {record.status.toUpperCase()}
//                       </span>
//                     </div>
//                   </motion.div>
//                 ))}
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {showModal && (
//         <AttendanceModal
//           isOpen={showModal}
//           onClose={() => setShowModal(false)}
//           records={attendanceRecords}
//         />
//       )}

//       {showPasswordModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div
//             className={`p-6 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"} w-full max-w-md`}
//           >
//             <div className="flex items-center space-x-3 mb-4">
//               <LockClosedIcon className="w-8 h-8 text-red-500" />
//               <h3
//                 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
//               >
//                 Punch Out Verification
//               </h3>
//             </div>
//             <p
//               className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
//             >
//               Please enter the punch out password to confirm
//             </p>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} mb-4`}
//               placeholder="Enter password"
//             />
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setShowPasswordModal(false);
//                   setPassword("");
//                 }}
//                 className={`px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handlePunchOutConfirm}
//                 className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
//               >
//                 Confirm Punch Out
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceView;

import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  ClockIcon,
  CalendarIcon,
  PlayIcon,
  StopIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";
import {
  punchIn,
  punchOut,
  fetchTodayAttendance,
  fetchAttendanceRecords,
  setLocationStatus,
  clearAttendanceError,
} from "../../store/slices/attendanceSlice";
import AttendanceModal from "../Modals/AttendanceModal";
import { toast } from "react-toastify";

// Office coordinates configuration
const OFFICE_CONFIG = {
  latitude: 21.165047,
  longitude: 79.078782,
  maxDistance: 5000,
};

const AttendanceView = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [workFromHome, setWorkFromHome] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { user } = useSelector((state) => state.auth);
  const { attendanceRecords, todayAttendance, loading, error, locationStatus } =
    useSelector((state) => state.attendance);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?._id) {
          await dispatch(fetchTodayAttendance(user._id));
          await dispatch(fetchAttendanceRecords(user._id));
        }
      } catch (err) {
        console.error("Failed to fetch attendance data:", err);
        toast.error("Failed to load attendance data");
      }
    };

    fetchData();
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAttendanceError());
    }
  }, [error, dispatch]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const checkGeolocation = () => {
    if (workFromHome) {
      return Promise.resolve(true);
    }

    dispatch(setLocationStatus({ loading: true, error: null }));

    if (!navigator.geolocation) {
      dispatch(
        setLocationStatus({
          loading: false,
          error: "Geolocation is not supported by your browser",
        })
      );
      return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          const distance = calculateDistance(
            userCoords.latitude,
            userCoords.longitude,
            OFFICE_CONFIG.latitude,
            OFFICE_CONFIG.longitude
          );

          dispatch(
            setLocationStatus({
              loading: false,
              coordinates: userCoords,
              error: null,
              distance: distance,
            })
          );

          resolve(distance <= OFFICE_CONFIG.maxDistance);
        },
        (error) => {
          const errorMsg = error.message || "Unable to retrieve your location";
          dispatch(
            setLocationStatus({
              loading: false,
              error: errorMsg,
            })
          );
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  };

  const verifyConditions = async () => {
    if (workFromHome) {
      return true;
    }

    try {
      const isLocationValid = await checkGeolocation();
      if (!isLocationValid) {
        if (locationStatus.error) {
          toast.error(`Location error: ${locationStatus.error}`, {
            autoClose: 5000,
          });
        } else {
          toast.error(
            `You must be within ${OFFICE_CONFIG.maxDistance}m of the office to punch in/out.`,
            { autoClose: 5000 }
          );
        }
        return false;
      }
      return true;
    } catch (error) {
      toast.error(error.message, { autoClose: 5000 });
      return false;
    }
  };

  const handlePunchIn = async () => {
    if (hasPunchedInToday()) {
      toast.error("You have already punched in today", { autoClose: 5000 });
      return;
    }

    setVerificationInProgress(true);
    try {
      const verified = await verifyConditions();
      if (!verified) {
        setVerificationInProgress(false);
        return;
      }

      await dispatch(punchIn(user._id)).unwrap();
      await dispatch(fetchTodayAttendance(user._id)); // ⚠️ Refetch data
      toast.success("🎯 Punched in successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to punch in");
    } finally {
      setVerificationInProgress(false);
    }
  };

  const handlePunchOutClick = async () => {
    if (!hasPunchedInToday()) {
      toast.error("You need to punch in first", { autoClose: 5000 });
      return;
    }

    if (hasPunchedOutToday()) {
      toast.error("You have already punched out today", { autoClose: 5000 });
      return;
    }

    setVerificationInProgress(true);
    const verified = await verifyConditions();
    if (!verified) {
      setVerificationInProgress(false);
      return;
    }

    setShowPasswordModal(true);
    setVerificationInProgress(false);
  };

  const handlePunchOutConfirm = async () => {
    if (password !== "0000") {
      toast.error("Incorrect punch out password", { autoClose: 5000 });
      return;
    }

    try {
      await dispatch(punchOut(user._id)).unwrap();
      toast.success("✅ Punched out successfully!");
      setShowPasswordModal(false);
      setPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to punch out");
    }
  };

  const hasPunchedInToday = () => {
    // return (
    //   todayAttendance?.punchIn &&
    //   new Date(todayAttendance.punchIn).toDateString() ===
    //     new Date().toDateString()
    // );

    if (!todayAttendance?.punchIn) return false;

    const today = new Date().toDateString();
    const punchInDate = new Date(todayAttendance.punchIn).toDateString();

    return today === punchInDate;
  };

  const hasPunchedOutToday = () => {
    if (!todayAttendance?.punchOut) return false;

    const today = new Date().toDateString();
    const punchOutDate = new Date(todayAttendance.punchOut).toDateString();

    return today === punchOutDate;

    // return (
    //   todayAttendance?.punchOut &&
    //   new Date(todayAttendance.punchOut).toDateString() ===
    //     new Date().toDateString()
    // );
  };

  
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const userAttendance = attendanceRecords
    .filter((record) => record.employeeId === user?._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Work Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
      >
        <div>
          <h3
            className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Work Mode
          </h3>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {workFromHome
              ? "Location verification disabled"
              : "Location verification required"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <BuildingOfficeIcon
            className={`w-5 h-5 ${!workFromHome ? "text-blue-500" : "text-gray-500"}`}
          />

          <Switch
            checked={workFromHome}
            onChange={setWorkFromHome}
            className={`${
              workFromHome ? "bg-blue-600" : "bg-gray-400"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span
              className={`${
                workFromHome ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <HomeIcon
            className={`w-5 h-5 ${workFromHome ? "text-green-500" : "text-gray-500"}`}
          />
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6"
      >
        <div>
          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}
          >
            ⏰ Attendance Tracker
          </h1>
          <p
            className={`text-base sm:text-lg lg:text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Track your daily work hours and attendance
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 w-full sm:w-auto"
        >
          📊 View History
        </motion.button>
      </motion.div>

      {/* Status Indicators */}
      <div className="flex flex-wrap gap-3 sm:gap-4">
        {workFromHome ? (
          <motion.div
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-purple-900/30 border-purple-500/30"
                : "bg-purple-100 border-purple-200"
            } border`}
          >
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Work From Home Mode
            </span>
          </motion.div>
        ) : (
          <motion.div
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              locationStatus.coordinates
                ? locationStatus.distance <= OFFICE_CONFIG.maxDistance
                  ? darkMode
                    ? "bg-green-900/30 border-green-500/30"
                    : "bg-green-100 border-green-200"
                  : darkMode
                    ? "bg-red-900/30 border-red-500/30"
                    : "bg-red-100 border-red-200"
                : darkMode
                  ? "bg-yellow-900/30 border-yellow-500/30"
                  : "bg-yellow-100 border-yellow-200"
            } border`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                locationStatus.coordinates
                  ? locationStatus.distance <= OFFICE_CONFIG.maxDistance
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-yellow-500"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {locationStatus.loading
                ? "Checking location..."
                : locationStatus.error
                  ? "Location error"
                  : locationStatus.coordinates
                    ? locationStatus.distance <= OFFICE_CONFIG.maxDistance
                      ? `In office (${Math.round(locationStatus.distance)}m)`
                      : `Out of office (${Math.round(locationStatus.distance)}m)`
                    : "Location not checked"}
            </span>
          </motion.div>
        )}
      </div>

      {/* Current Time Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`text-center py-8 sm:py-12 px-4 sm:px-6 lg:px-10 rounded-2xl sm:rounded-3xl ${
          darkMode
            ? "bg-gradient-to-br from-gray-900/50 to-slate-900/50 border-gray-700/50"
            : "bg-gradient-to-br from-white/70 to-slate-50/70 border-gray-200/50"
        } border backdrop-blur-xl shadow-xl`}
      >
        <div
          className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}
        >
          {formattedTime}
        </div>
        <p
          className={`text-base sm:text-lg mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Current Time
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Today's Attendance */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className={`rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl border ${
            darkMode
              ? "bg-gradient-to-br from-gray-900/50 to-slate-900/50 border-gray-700/50"
              : "bg-gradient-to-br from-white/70 to-blue-50/70 border-blue-200/50"
          } backdrop-blur-xl relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Today's Attendance
                </h2>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {!workFromHome &&
              locationStatus.coordinates &&
              locationStatus.distance > OFFICE_CONFIG.maxDistance && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${
                    darkMode ? "bg-red-900/30" : "bg-red-100"
                  }`}
                >
                  <ExclamationTriangleIcon
                    className={`w-5 h-5 mt-0.5 ${darkMode ? "text-red-400" : "text-red-600"}`}
                  />
                  <div>
                    <p
                      className={`font-medium ${darkMode ? "text-red-300" : "text-red-800"}`}
                    >
                      Attendance restrictions in effect
                    </p>
                    <ul
                      className={`list-disc list-inside text-sm ${darkMode ? "text-red-400" : "text-red-600"} space-y-1 mt-1`}
                    >
                      <li>
                        You must be within {OFFICE_CONFIG.maxDistance}m of the
                        office
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

            <div className="space-y-4 sm:space-y-6">
              {todayAttendance ? (
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 sm:p-6 rounded-2xl ${
                      darkMode
                        ? "bg-emerald-900/20 border-emerald-500/30"
                        : "bg-emerald-50 border-emerald-200"
                    } border-2`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-sm sm:text-base lg:text-lg font-semibold  ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                        >
                          ✅ Punch In Time
                        </p>
                        <p
                          className={`text-xl sm:text-2xl lg:text-3xl font-bold ${darkMode ? "text-white" : "text-emerald-800"}`}
                        >
                          {new Date(todayAttendance.punchIn).toLocaleTimeString(
                            "en-US"
                          )}

                          {/* {new Date().toISOString().split('T')[0]} */}
                          {/* {todayAttendance.punchIn
                            ? new Date(
                                todayAttendance.punchIn
                              ).toLocaleTimeString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                            : "No punch-in time"} */}
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-500 rounded-xl">
                        <PlayIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {todayAttendance.punchOut && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`p-4 sm:p-6 rounded-2xl ${
                        darkMode
                          ? "bg-red-900/20 border-red-500/30"
                          : "bg-red-50 border-red-200"
                      } border-2`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-sm font-semibold ${darkMode ? "text-red-400" : "text-red-600"}`}
                          >
                            🛑 Punch Out Time
                          </p>
                          <p
                            className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-red-800"}`}
                          >
                            {new Date(
                              todayAttendance.punchOut
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="p-3 bg-red-500 rounded-xl">
                          <StopIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {todayAttendance.punchOut && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`p-4 sm:p-6 rounded-2xl ${
                        darkMode
                          ? "bg-blue-900/20 border-blue-500/30"
                          : "bg-blue-50 border-blue-200"
                      } border-2`}
                    >
                      <p
                        className={`text-sm font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"} mb-2`}
                      >
                        ⏱️ Total Hours Worked
                      </p>
                      <p
                        className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-blue-800"}`}
                      >
                        {(
                          (new Date(todayAttendance.punchOut) -
                            new Date(todayAttendance.punchIn)) /
                          (1000 * 60 * 60)
                        ).toFixed(1)}{" "}
                        hours
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div
                  className={`text-center py-8 sm:py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  <ClockIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg sm:text-xl font-semibold mb-2">
                    No attendance record for today
                  </p>
                  <p className="text-sm sm:text-base">
                    Punch in to start tracking your time
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePunchIn}
                  disabled={hasPunchedInToday() || verificationInProgress}
                  className={`flex-1 py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    hasPunchedInToday() || verificationInProgress
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg hover:shadow-emerald-500/25"
                  }`}
                >
                  {verificationInProgress ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <PlayIcon className="w-5 h-5" />
                  )}
                  <span>Punch In</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePunchOutClick}
                  disabled={
                    !hasPunchedInToday() ||
                    hasPunchedOutToday() ||
                    verificationInProgress
                  }
                  className={`flex-1 py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center space-x-2 
                    ${
                      !hasPunchedInToday() ||
                      hasPunchedOutToday() ||
                      verificationInProgress
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400 shadow-lg hover:shadow-red-500/25"
                    }`}
                >
                  {verificationInProgress ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <StopIcon className="w-5 h-5" />
                  )}
                  <span>Punch Out</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border ${
            darkMode
              ? "bg-gradient-to-br from-gray-900/50 to-slate-900/50 border-gray-700/50"
              : "bg-gradient-to-br from-white/70 to-purple-50/70 border-purple-200/50"
          } backdrop-blur-xl relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6 sm:mb-8">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Recent Attendance
                </h2>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Last 5 attendance records
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
              {userAttendance.slice(0, 5).map((record, index) => (
                <motion.div
                  key={record._id || record.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/70"
                      : "bg-gray-50/80 border-gray-200/50 hover:bg-white/90"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p
                        className={`font-bold text-base sm:text-lg ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        📅{" "}
                        {new Date(
                          record.date || record.punchIn
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-1 sm:space-y-0">
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          🕐 In: {new Date(record.punchIn).toLocaleTimeString()}
                        </p>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          🕐 Out:{" "}
                          {record.punchOut
                            ? new Date(record.punchOut).toLocaleTimeString()
                            : "Active"}
                        </p>
                      </div>
                      {record.punchOut && (
                        <p
                          className={`text-sm mt-1 font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                        >
                          ⏱️{" "}
                          {(
                            (new Date(record.punchOut) -
                              new Date(record.punchIn)) /
                            (1000 * 60 * 60)
                          ).toFixed(1)}{" "}
                          hours
                        </p>
                      )}
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
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {showModal && (
        <AttendanceModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          records={attendanceRecords}
        />
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"} w-full max-w-md`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <LockClosedIcon className="w-8 h-8 text-red-500" />
              <h3
                className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Punch Out Verification
              </h3>
            </div>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Please enter the punch out password to confirm
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} mb-4`}
              placeholder="Enter password"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
                className={`px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                Cancel
              </button>
              <button
                onClick={handlePunchOutConfirm}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Confirm Punch Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceView;
