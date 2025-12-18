import React from "react";

import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import store from "./store/store";
import Login from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import BirthdayModal from "./components/Modals/BirthdayModal";
import { useSelector, useDispatch } from "react-redux";
import { checkBirthdays } from "./store/slices/employeeSlice";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import FaceLogin from "./components/Auth/FaceLogin";
import FaceVerificationWrapper from "./components/Auth/FaceVerificationWrapper";

function AppContent() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { employees } = useSelector((state) => state.employees);

  const { showBirthdayModal } = useSelector((state) => state.employees);

  useEffect(() => {
    if (user) {
      dispatch(checkBirthdays());
    }
  }, [user, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route
            path="/dashboard/verify-face"
            element={<FaceVerificationWrapper />}
          /> */}

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>

      {showBirthdayModal && <BirthdayModal />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-16 mr-2 sm:mr-4"
        toastClassName="rounded-xl shadow-2xl"
      />
    </div>
  );
}

function App() {
  return (
    // <Provider store={store}>
    <Router>
      <AppContent />
    </Router>
    // </Provider>
  );
}

export default App;
