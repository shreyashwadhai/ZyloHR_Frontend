import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  UserPlusIcon,
  PencilIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  uploadProfilePicture,
  updateEmployeeAPI,
  createEmployeeAPI,
  resetError,
} from "../../store/slices/employeeSlice";
import { toast } from "react-toastify";

const EmployeeModal = ({ isOpen, onClose, employee }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const { loading, uploadLoading, error } = useSelector(
    (state) => state.employees
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    department: "",
    birthday: "",
    status: "",
    profilePic: "",
    secretKey: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const canAdmin = user?.role === "admin";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        phone: employee.phone,
        department: employee.department || "",
        birthday: employee.birthday || "",
        status: employee.status || "",
        profilePic: employee.profilePic || "",
        password: "",
        secretKey: employee.secretKey || "",
      });
      setPreviewImage(employee.profilePic || "");
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        department: "",
        birthday: "",
        status: "",
        profilePic: "",
        secretKey: "",
      });
      setPreviewImage("");
    }
    dispatch(resetError());
  }, [employee, isOpen, dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file (JPEG, PNG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    // if (employee?._id) {
    //   dispatch(uploadProfilePicture({ userId: employee._id, file }));
    // } else {
    //   setFormData((prev) => ({ ...prev, profilePic: file }));
    // }

    // 👇 Store file but don't upload immediately
    setFormData((prev) => ({ ...prev, profilePic: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (
    //   !formData.name ||
    //   !formData.email ||
    //   !formData.phone ||
    //   !formData.role ||
    //   !formData.department

    // ) {
    //   toast.error("All fields are required");
    //   return;
    // }

    if (!employee && !formData.password) {
      toast.error("Password is required");
      return;
    }

    if (
      (formData.role === "admin" || formData.role === "manager") &&
      !formData.secretKey
    ) {
      toast.error("Secret key is required for Admin/Manager");
      return;
    }

    try {

      const dataToSend = {
        ...formData,
        ...(!employee && { password: formData.password }),
      };

      if (employee && !formData.password) delete dataToSend.password;
      if (dataToSend.profilePic instanceof File) delete dataToSend.profilePic;

      if (employee) {
        await dispatch(
          updateEmployeeAPI({ id: employee._id, data: dataToSend })
        ).unwrap();
      } else {
        await dispatch(createEmployeeAPI(dataToSend)).unwrap();
      }

      onClose();
    }

    // try {
    //   let profilePicUrl = employee?.profilePic || "";
    //   let public_id = employee?.public_id || "";

    //   // ✅ Upload profile picture if it's a new File
    //   if (formData.profilePic instanceof File) {
    //     const imageData = new FormData();
    //     imageData.append("file", formData.profilePic);
    //     imageData.append("userId", employee?._id || "new");

    //     const uploaded = await dispatch(
    //       uploadProfilePicture({
    //         file: formData.profilePic,
    //         userId: employee?._id,
    //       })
    //     ).unwrap();
    //     profilePicUrl = uploaded.profilePic;
    //     public_id = uploaded.public_id;
    //   }

    //   const dataToSend = {
    //     ...formData,
    //     profilePic: profilePicUrl,
    //     public_id,
    //     ...(!employee && { password: formData.password }),
    //   };

    //   if (employee && !formData.password) delete dataToSend.password;

    //   if (employee) {
    //     await dispatch(
    //       updateEmployeeAPI({ id: employee._id, data: dataToSend })
    //     ).unwrap();
    //   } else {
    //     await dispatch(createEmployeeAPI(dataToSend)).unwrap();
    //   }

    //   onClose();
    // } 
    catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`relative ${
              darkMode
                ? "bg-gradient-to-br from-gray-900/95 to-slate-900/95 border-gray-700/50"
                : "bg-gradient-to-br from-white/95 to-emerald-50/95 border-emerald-200/50"
            } rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-4 shadow-2xl border backdrop-blur-xl overflow-y-auto`}
            style={{ maxHeight: "90vh", margin: isMobile ? "0.5rem" : "1rem" }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl shadow-lg">
                    {employee ? (
                      <PencilIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <UserPlusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2
                      className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {employee ? "✏️ Edit Employee" : "➕ Add Employee"}
                    </h2>
                    <p
                      className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {employee
                        ? "Update employee information"
                        : "Add new team member"}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 sm:p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-3 p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-xs sm:text-sm">
                  {error.message || "An error occurred"}
                </div>
              )}

              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center mb-4 sm:mb-6">
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                  } overflow-hidden cursor-pointer`}
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <UserIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                    </div>
                  )}
                  {(uploadLoading || loading) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className={`mt-2 text-xs sm:text-sm border border-emerald-600 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl hover:bg-emerald-600/10 ${
                    darkMode ? "text-emerald-400" : "text-emerald-600"
                  } font-medium`}
                  disabled={uploadLoading || loading}
                >
                  {formData.profilePic ? "Change photo" : "Upload photo"}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {/* Full Name */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      👤 Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm ${
                        darkMode
                          ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                          : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm ${
                        darkMode
                          ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                          : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  {/* Role and Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        🏷️ Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm ${
                          darkMode
                            ? "bg-gray-800/50 border-gray-600/50 text-white"
                            : "bg-white/80 border-gray-300/50 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                        required
                      >
                         <option>Select a role</option>
                        <option value="employee">👨‍💼 Employee</option>
                        <option value="manager" disabled={!canAdmin}>
                          👥 Manager
                        </option>
                        <option value="admin" disabled={!canAdmin}>
                          ⚡ Admin
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        🏢 Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm ${
                          darkMode
                            ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                            : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                        placeholder="Enter department"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone and Birthday */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        📱 Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm ${
                          darkMode
                            ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                            : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        🎂 Birthday
                      </label>
                      <input
                        type="date"
                        name="birthday"
                        value={
                          formData.birthday
                            ? new Date(formData.birthday)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm ${
                          darkMode
                            ? "bg-gray-800/50 border-gray-600/50 text-white"
                            : "bg-white/80 border-gray-300/50 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      📊 Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm ${
                        darkMode
                          ? "bg-gray-800/50 border-gray-600/50 text-white"
                          : "bg-white/80 border-gray-300/50 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                    >
                      <option value="offline">🏢 Offline Mode</option>
                      <option value="online">🏡 Online Mode</option>
                    </select>
                  </div>

                  {!employee &&
                    (formData.role === "admin" ||
                      formData.role === "manager") && (
                      <div className="mt-2">
                        <label
                          className={`block text-sm font-medium mb-1 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          🕵️ Secret Key
                        </label>
                        <input
                          type="text"
                          name="secretKey"
                          value={formData.secretKey}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm ${
                            darkMode
                              ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                              : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500"
                          } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                          placeholder="Enter secret key"
                          required
                        />
                      </div>
                    )}

                  {/* Password (only for new employees) */}
                  {!employee && (
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        🔑 Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm ${
                          darkMode
                            ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                            : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500"
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-2 sm:py-3 rounded-lg font-medium text-sm hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                    disabled={loading || uploadLoading}
                  >
                    {loading ? (
                      <span>Processing...</span>
                    ) : (
                      <span>{employee ? "💾 Update" : "➕ Add Employee"}</span>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onClose}
                    className={`flex-1 py-2 sm:py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    ❌ Cancel
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmployeeModal;
