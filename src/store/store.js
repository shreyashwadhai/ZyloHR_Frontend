import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import employeeSlice from "./slices/employeeSlice"
import attendanceSlice from "./slices/attendanceSlice"
import messageSlice from "./slices/messageSlice"
import leaveSlice from "./slices/leaveSlice"
import feedSlice from "./slices/feedSlice"
import themeSlice from "./slices/themeSlice"
import profileSlice from "./slices/profileSlice"


const store = configureStore({
  reducer: {
    auth: authSlice,
    employees: employeeSlice,
    attendance: attendanceSlice,
    messages: messageSlice,
    leaves: leaveSlice,
    feeds: feedSlice,
    theme: themeSlice,
    profile: profileSlice,
  },
})

export default store
