// import { createSlice } from "@reduxjs/toolkit"

// const initialState = {
//   attendanceRecords: [],
//   todayAttendance: null,
//   loading: false,
// }

// const attendanceSlice = createSlice({
//   name: "attendance",
//   initialState,
//   reducers: {
//     punchIn: (state, action) => {
//       const today = new Date().toISOString().split("T")[0]
//       const newRecord = {
//         id: Date.now(),
//         employeeId: action.payload.employeeId,
//         date: today,
//         punchIn: new Date().toISOString(),
//         punchOut: null,
//         status: "present",
//       }
//       state.attendanceRecords.push(newRecord)
//       state.todayAttendance = newRecord
//     },
//     punchOut: (state, action) => {
//       const record = state.attendanceRecords.find((r) => r.employeeId === action.payload.employeeId && !r.punchOut)
//       if (record) {
//         record.punchOut = new Date().toISOString()
//         state.todayAttendance = record
//       }
//     },
//     setAttendanceRecords: (state, action) => {
//       state.attendanceRecords = action.payload
//     },
//   },
// })

// export const { punchIn, punchOut, setAttendanceRecords } = attendanceSlice.actions
// export default attendanceSlice.reducer


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunks
export const punchIn = createAsyncThunk(
  "attendance/punchIn",
  async (employeeId, { rejectWithValue }) => {
    try {
      console.log("Sending employeeId:", employeeId);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/attendance/punch-in`, { employeeId }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Full response:", response);

      return response.data;
    } catch (error) {
      console.error("Punch in error:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const punchOut = createAsyncThunk(
  "attendance/punchOut",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}` + "/api/attendance/punch-out", { employeeId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTodayAttendance = createAsyncThunk(
  "attendance/fetchToday",
  async (employeeId, { rejectWithValue }) => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/attendance/today/${employeeId}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Today's attendance response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAttendanceRecords = createAsyncThunk(
  "attendance/fetchRecords",
  async (employeeId, { rejectWithValue }) => {
    try {
      console.log(employeeId);

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/attendance/records/${employeeId}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Attendance records response:", response.data);

      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  attendanceRecords: [],
  todayAttendance: null,
  loading: false,
  error: null,
  locationStatus: {
    loading: false,
    coordinates: null,
    error: null,
    distance: null,
  },
};


const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setLocationStatus: (state, action) => {
      state.locationStatus = action.payload;
    },
    clearAttendanceError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Punch In
      .addCase(punchIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(punchIn.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAttendance = action.payload;
        state.attendanceRecords.unshift(action.payload);
      })
      .addCase(punchIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to punch in";
      })

      // Punch Out
      .addCase(punchOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(punchOut.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAttendance = action.payload;
        const index = state.attendanceRecords.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) {
          state.attendanceRecords[index] = action.payload;
        }
      })
      .addCase(punchOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to punch out";
      })

      // Fetch Today's Attendance
      .addCase(fetchTodayAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.todayAttendance = action.payload;
        state.attendanceRecords.unshift(action.payload);
      })
      .addCase(fetchTodayAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch today's attendance";
      })

      // Fetch Attendance Records
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch attendance records";
      });
  },
});

export const { setLocationStatus, clearAttendanceError, } = attendanceSlice.actions;
export default attendanceSlice.reducer;