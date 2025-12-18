import React from "react";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginSuccess } from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import axios from "axios";
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "employee",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const response = axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    response
      .then((res) => {
        const user = res.data.data;
        dispatch(loginSuccess(user));
        // console.log("Login successful:", user);
        toast.success(`Welcome back, ${user.name}!`);
        navigate("/dashboard");

        localStorage.setItem("token", res.data.token);
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.error("Invalid credentials!");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl border border-white/20 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-xl"></div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="text-center mb-6 sm:mb-8 relative z-10"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-600 rounded-full sm:rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            {/* <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold tracking-wider">
              EMS
            </span> */}
            <div className="w-12 h-12 bg-white-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
              <img
                src="https://tse3.mm.bing.net/th/id/OIP.mAZ65c3S-H6icVKUoI0FtwHaHa?pid=Api&P=0&h=180"
                alt=""
              />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-blue-100/80 text-sm sm:text-base lg:text-lg font-medium">
            Sign in to your workspace
          </p>
        </motion.div>

        <form
          onSubmit={handleLogin}
          className="space-y-4 sm:space-y-6 relative z-10"
        >
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label className="block text-white text-sm sm:text-base font-semibold mb-2 sm:mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-4 bg-white/10 border border-white/30 rounded-xl sm:rounded-2xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
              placeholder="Enter your email"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="block text-white text-sm sm:text-base font-semibold mb-2 sm:mb-3">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-4 bg-white/10 border border-white/30 rounded-xl sm:rounded-2xl text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base backdrop-blur-sm"
              placeholder="Enter your password"
              required
            />
          </motion.div>

          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-1 mt-7"
          >
            Sign In to Dashboard
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
