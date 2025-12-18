import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { toast } from "react-toastify";

const LeaveModel = ({ isOpen, onClose, onSave, leave, userRole, user }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: null,
    isManualEntry: false,
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    status: "pending",
  });

  // Fetch employees for admin/manager
  useEffect(() => {
    const BASE_URL = "https://zylohr-backend.onrender.com/api";
    const token = localStorage.getItem("token");

    if ((userRole === "admin" || userRole === "manager") && !leave) {
      axios
        .get(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEmployees(res.data.data))
        .catch(console.error);
    }
  }, [userRole, leave]);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return ""; // Fallback in case of invalid date

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // ✅ Correct format for HTML input type="date"
  };

  // Format DD-MM-YYYY to YYYY-MM-DD for date inputs
  const formatDateForStorage = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Initialize form data
  useEffect(() => {
    if (leave) {
      setFormData({
        employeeName: leave.employeeName,
        employeeId: leave.employeeId || null,
        isManualEntry: leave.isManualEntry || false,
        leaveType: leave.leaveType,
        startDate: formatDateForInput(leave.startDate),
        endDate: formatDateForInput(leave.endDate),
        reason: leave.reason,
        status: leave.status,
      });
    } else {
      setFormData({
        employeeName: user?.name || "",
        employeeId: user?._id || null,
        isManualEntry: false,
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
        status: "pending",
      });
    }
  }, [leave, user]);

  const isEditMode = !!leave;
  const isRejected = leave?.status === "rejected";
  const isEmployee = userRole === "employee";

  // Employees can't edit rejected leaves, but admins/managers can edit any leave
  const isDisabledForEmployee = isEditMode && isRejected && isEmployee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.employeeName ||
      !formData.leaveType ||
      !formData.reason ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl p-6 relative shadow-xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEditMode ? "Edit Leave" : "Add Leave"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee name display (readonly for edits) */}
          {/* <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee Name
            </label>
            <input
              type="text"
              value={formData.employeeName}
              readOnly
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            />
          </div> */}

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Employee Name
            </label>

            {(userRole === "admin" || userRole === "manager") && !leave ? (
              <select
                name="employeeId"
                value={formData.employeeId || ""}
                onChange={(e) => {
                  const selected = employees.find(
                    (emp) => emp._id === e.target.value
                  );
                  setFormData((prev) => ({
                    ...prev,
                    employeeId: selected?._id,
                    employeeName: selected?.name,
                  }));
                }}
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.employeeName}
                readOnly
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Leave Type
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
              disabled={isDisabledForEmployee}
            >
              <option value="">Select Leave Type</option>
              <option value="Casual">Casual</option>
              <option value="Sick">Sick</option>
              <option value="Earned">Earned</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={isDisabledForEmployee}
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={isDisabledForEmployee}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason
            </label>
            <textarea
              name="reason"
              placeholder="Reason for leave"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white resize-none"
              required
              disabled={isDisabledForEmployee}
            />
          </div>

          {/* Status field (only for admin/manager when editing) */}
          {(userRole === "admin" || userRole === "manager") && isEditMode && (
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white font-semibold hover:shadow-md transition-all ${
                isDisabledForEmployee
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500"
              }`}
              disabled={isDisabledForEmployee}
            >
              {isEditMode ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default LeaveModel;
