import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import {
  getAllEmployees,
  deleteEmployeeAPI,
  addEmployee,
  updateEmployee,
} from "../../store/slices/employeeSlice";
import EmployeeModal from "../Modals/EmployeeModal";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "",
    role: "",
    status: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  const { employees, loading, error } = useSelector((state) => state.employees);
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const canManageEmployees = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    dispatch(getAllEmployees());
  }, [dispatch, getAllEmployees]);

  // Get unique values for filters
  const departments = [
    ...new Set(employees.map((emp) => emp.department)),
  ].filter(Boolean);
  const roles = [...new Set(employees.map((emp) => emp.role))].filter(Boolean);
  const statuses = [...new Set(employees.map((emp) => emp.status))].filter(
    Boolean
  );

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredEmployees = sortedEmployees.filter((emp) => {
    const matchesSearch = [emp?.name, emp?.email, emp?.department].some(
      (field) => field?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesFilters =
      (!filters.department || emp.department === filters.department) &&
      (!filters.role || emp.role === filters.role) &&
      (!filters.status || emp.status === filters.status);

    return matchesSearch && matchesFilters;
  });

  const handleEditEmployee = (emp) => {
    setEditingEmployee(emp);
    setShowModal(true);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteEmployeeAPI(id))
        .unwrap()
        .then(() => toast.success("Employee deleted successfully!"))
        .catch(() => toast.error("Failed to delete employee"));
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleSaveEmployee = (employeeData) => {
    const action = editingEmployee
      ? updateEmployee({ ...employeeData, id: editingEmployee._id })
      : addEmployee(employeeData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          `Employee ${editingEmployee ? "updated" : "added"} successfully!`
        );
        setShowModal(false);
      })
      .catch(() => {
        toast.error(`Failed to ${editingEmployee ? "update" : "add"} employee`);
      });
  };

  const clearFilters = () => {
    setFilters({
      department: "",
      role: "",
      status: "",
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      suspended:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return (
      statusClasses[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      employee:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    };
    return (
      roleClasses[role] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    );
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1
            className={`text-2xl md:text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            👥 Employee Management
          </h1>
          <p
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Manage your organization's workforce efficiently
          </p>
        </div>
        {canManageEmployees && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddEmployee}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center space-x-2 text-sm sm:text-base shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Employee</span>
          </motion.button>
        )}
      </motion.div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search employees by name, email or department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm sm:text-base ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
            } focus:outline-none focus:ring-2 shadow-sm`}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 text-sm font-medium px-3 py-2 rounded-lg w-max ${
              darkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Filters</span>
            {showFilters ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`overflow-hidden rounded-lg p-4 space-y-3 ${
                  darkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Department
                    </label>
                    <select
                      value={filters.department}
                      onChange={(e) =>
                        setFilters({ ...filters, department: e.target.value })
                      }
                      className={`w-full rounded-md border text-sm ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) =>
                        setFilters({ ...filters, role: e.target.value })
                      }
                      className={`w-full rounded-md border text-sm ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      <option value="">All Roles</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className={`w-full rounded-md border text-sm ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      <option value="">All Statuses</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {(filters.department || filters.role || filters.status) && (
                  <div className="flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center space-x-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span>Clear filters</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className={`rounded-xl p-4 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Total Employees
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {
                  employees.filter(
                    (e) => e.role === "employee" || e.role === "manager"
                  ).length
                }
              </p>
            </div>
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <UsersIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className={`rounded-xl p-4 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Total Managers
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {employees.filter((e) => e.role === "manager").length}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className={`rounded-xl p-4 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Offline Employees
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {filteredEmployees.filter((e) => e.status === "offline").length
                  ? filteredEmployees.filter((e) => e.status).length
                  : 0}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <UsersIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className={`rounded-xl p-4 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Online Employees
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {filteredEmployees.filter((e) => e.status === "online").length
                  ? filteredEmployees.filter((e) => e.status).length
                  : 0}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <UsersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex flex-col items-center justify-center py-12 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <UsersIcon className="w-16 h-16 mb-4 text-gray-400" />
          <h3
            className={`text-xl font-medium mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No employees found
          </h3>
          <p
            className={`text-center max-w-md ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {searchTerm || filters.department || filters.role || filters.status
              ? "No employees match your search criteria"
              : "You haven't added any employees yet"}
          </p>
          {canManageEmployees && (
            <button
              onClick={handleAddEmployee}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Your First Employee</span>
            </button>
          )}
        </motion.div>
      )}

      {/* Mobile View */}
      <div className="block md:hidden space-y-3">
        {filteredEmployees.map((emp, i) => (
          <motion.div
            key={emp._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-xl border shadow-sm ${
              darkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700/50"
                : "bg-white border-gray-200 hover:bg-gray-50"
            } transition-colors duration-200`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                {emp.profilePic ? (
                  <img
                    src={emp.profilePic}
                    alt={emp.name}
                    className="w-12 h-12 rounded-full border-2 border-white/20 shadow"
                  />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3
                    className={`text-base font-semibold truncate ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {emp.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${getRoleBadge(emp.role)}`}
                  >
                    {emp.role}
                  </span>
                </div>
                <p
                  className={`text-sm truncate ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {emp.email}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {emp.department}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(emp.status)}`}
                  >
                    {emp.status}
                  </span>
                </div>
              </div>
            </div>
            {canManageEmployees && (
              <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-700/30">
                <button
                  onClick={() => handleEditEmployee(emp)}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm flex items-center justify-center space-x-1"
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteEmployee(emp._id)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm flex items-center justify-center space-x-1"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div
          className={`rounded-xl overflow-hidden border shadow-sm w-full max-w-full ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <UsersIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Employee Directory
                  </h2>
                  <p
                    className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Showing {filteredEmployees.length} of {employees.length}{" "}
                    employees
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Sorted by: {sortConfig.key} ({sortConfig.direction})
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead
                className={`${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
              >
                <tr>
                  {[
                    "Employee",
                    "Email",
                    "Department",
                    "Role",
                    "Status",
                    "Actions",
                  ].map((header) => {
                    const key = header.toLowerCase();
                    const isSortable = [
                      "employee",
                      "email",
                      "department",
                      "role",
                      "status",
                    ].includes(key);
                    return (
                      <th
                        key={header}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        } ${isSortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : ""}`}
                        onClick={() =>
                          isSortable &&
                          handleSort(key === "employee" ? "name" : key)
                        }
                      >
                        <div className="flex items-center">
                          {header}
                          {isSortable &&
                            sortConfig.key ===
                              (key === "employee" ? "name" : key) && (
                              <span className="ml-1">
                                {sortConfig.direction === "ascending" ? (
                                  <ChevronUpIcon className="w-4 h-4" />
                                ) : (
                                  <ChevronDownIcon className="w-4 h-4" />
                                )}
                              </span>
                            )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEmployees.map((emp, index) => (
                  <motion.tr
                    key={emp._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`${
                      darkMode ? "hover:bg-gray-700/20" : "hover:bg-gray-50"
                    } transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {emp.profilePic ? (
                            <img
                              className="h-10 w-10 rounded-full border-2 border-white/20 shadow"
                              src={emp.profilePic}
                              alt={emp.name}
                            />
                          ) : (
                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div
                            className={`text-sm font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {emp.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {emp.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {emp.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(emp.role)}`}
                      >
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(emp.status)}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {canManageEmployees && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditEmployee(emp)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg"
                              title="Edit"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteEmployee(emp._id)}
                              className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <EmployeeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveEmployee}
          employee={editingEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeList;
