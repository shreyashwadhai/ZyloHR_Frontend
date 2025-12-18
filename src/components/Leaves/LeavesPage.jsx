import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import moment from "moment";
import {
  CalendarDaysIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  fetchLeaves,
  addLeave,
  updateLeave,
  deleteLeave,
} from "../../store/slices/leaveSlice";
import LeaveModal from "../Modals/LeaveModel";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

const LeavesPage = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [editingLeave, setEditingLeave] = React.useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const { leaves, loading, error } = useSelector((state) => state.leaves);

  // Filter leaves based on user role
  const filteredLeaves =
    user.role === "admin" || user.role === "manager"
      ? leaves
      : leaves.filter((leave) => leave.employeeName === user.name);

  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

  const handleAddLeave = () => {
    if (user.role === "employee") {
      setEditingLeave({
        employeeName: user.name,
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
        status: "pending",
      });
    } else {
      setEditingLeave(null);
    }
    setShowModal(true);
  };

  const handleEditLeave = (leave) => {
    if (user.role === "admin" || user.role === "manager") {
      // Additional check if manager is trying to approve their own leave
      if (user.role === "manager" && leave.employeeName === user.name) {
        toast.warning(
          "You cannot approve your own leave request. Please contact admin."
        );
        return;
      }
      setEditingLeave(leave);
      setShowModal(true);
    } else if (leave.employeeName === user.name) {
      // Employees can edit their own leaves (except status)
      const editableLeave = { ...leave };
      delete editableLeave.status; // Remove status to prevent editing
      setEditingLeave(editableLeave);
      setShowModal(true);
    } else {
      toast.warning("You are not authorized to edit this leave.");
    }
  };

  const handleDeleteLeave = (leave) => {
    if (
      user.role === "admin" ||
      user.role === "manager" ||
      leave.employeeName === user.name
    ) {
      if (
        window.confirm("Are you sure you want to delete this leave request?")
      ) {
        dispatch(deleteLeave(leave._id));
      }
    } else {
      toast.warning("You can only delete your own leave requests");
    }
  };

  const handleSaveLeave = (leaveData) => {
    if (editingLeave) {
      dispatch(updateLeave({ ...leaveData, id: editingLeave._id }));
    } else {
      dispatch(addLeave(leaveData));
    }
    setShowModal(false);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 font-semibold">Error: {error.message || String(error)}</div>;


  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-12 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5"
      >
        <div>
          <h1
            className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            🗓️ Leaves Management
          </h1>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {filteredLeaves.length}{" "}
            {user.role === "employee" ? "your" : "total"} requests
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAddLeave}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-lg font-medium flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Leave</span>
        </motion.button>
      </motion.div>

      {/* Table */}
      <div
        className={`rounded-xl overflow-x-auto shadow-md border w-full max-w-full text-sm ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <CalendarDaysIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2
                className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Leave Requests
              </h2>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Showing {filteredLeaves.length}{" "}
                {user.role === "employee" ? "your" : ""} requests
              </p>
            </div>
          </div>
        </div>

        <table className="min-w-full">
          <thead className={`${darkMode ? "bg-gray-700/50" : "bg-gray-100"}`}>
            <tr>
              {[
                "Employee",
                "Reason",
                "From",
                "To",
                "Duration",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className={`py-3 px-5 text-sm font-semibold text-left ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave, index) => {
              const start = moment(leave.startDate);
              const end = moment(leave.endDate);
              const duration = end.diff(start, "days") + 1;

              return (
                <motion.tr
                  key={leave._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-t ${
                    darkMode
                      ? "border-gray-700 hover:bg-gray-700/20"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-5">{leave.employeeName}</td>
                  <td className="py-3 px-5">{leave.reason}</td>
                  <td className="py-3 px-5">{start.format("DD-MM-YYYY")}</td>
                  <td className="py-3 px-5">{end.format("DD-MM-YYYY")}</td>
                  <td className="py-3 px-5">{duration} days</td>
                  <td className="py-3 px-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        leave.status === "approved"
                          ? "bg-green-500 text-white"
                          : leave.status === "pending"
                            ? "bg-yellow-400 text-white"
                            : "bg-red-500 text-white"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex space-x-2">
                      {/* Edit button - admin/manager or leave owner */}
                      {(user.role === "admin" ||
                        user.role === "manager" ||
                        leave.employeeName === user.name) && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEditLeave(leave)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </motion.button>
                      )}

                      {/* Delete button - admin/manager or leave owner */}
                      {(user.role === "admin" ||
                        user.role === "manager" ||
                        leave.employeeName === user.name) && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteLeave(leave)}
                          className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <LeaveModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveLeave}
          leave={editingLeave}
          userRole={user.role}
          userName={user.name}
        />
      )}
    </div>
  );
};

export default LeavesPage;
