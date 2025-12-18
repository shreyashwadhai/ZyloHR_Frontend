// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { toast } from "react-toastify";

// // Get token
// const token = localStorage.getItem("token");

// // Base API
// const BASE_URL = "https://zylohr-backend.onrender.com/api";
// // const BASE_URL = "https://zylohr-backend.onrender.com/api";


// // Thunks
// // export const fetchLeaves = createAsyncThunk("leaves/fetchAll", async (_, { rejectWithValue }) => {
// //   try {
// //     const res = await axios.get(`${BASE_URL}/leaves`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     // console.log(res.data.data);

// //     return res.data.data;
// //   } catch (err) {
// //     toast.error("Failed to fetch leaves");
// //     console.log(err);

// //     return rejectWithValue(err.response?.data || "Fetch failed");
// //   }
// // });

// export const fetchLeaves = createAsyncThunk(
//   "leaves/fetchAll",
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const state = getState();
//       const userRole = state.auth.user.role;
//       const userName = state.auth.user.name;

//       let url = `${BASE_URL}/leaves`;

//       // For employees, fetch only their own leaves
//       if (userRole === "employee") {
//         url = `${BASE_URL}/leaves?employeeName=${userName}`;
//       }

//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return res.data.data;
//     } catch (err) {
//       toast.error("Failed to fetch leaves");
//       return rejectWithValue(err.response?.data || "Fetch failed");
//     }
//   }
// );

// export const addLeave = createAsyncThunk("leaves/add", async (leaveData, { rejectWithValue }) => {
//   try {
//     const res = await axios.post(`${BASE_URL}/leave`, leaveData, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     toast.success("Leave added successfully");
//     return res.data.data;
//   } catch (err) {
//     toast.error("Failed to add leave");
//     return rejectWithValue(err.response?.data || "Add failed");
//   }
// });

// // export const updateLeave = createAsyncThunk(
// //   "leaves/update",
// //   async ({ id, ...leaveData }, { rejectWithValue }) => {
// //     try {
// //       const res = await axios.put(`${BASE_URL}/leave/${id}`, leaveData, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       toast.success("Leave updated successfully");
// //       return res.data.data;
// //     } catch (err) {
// //       toast.error("Failed to update leave");
// //       return rejectWithValue(err.response?.data || "Update failed");
// //     }
// //   }
// // );


// export const updateLeave = createAsyncThunk(
//   "leaves/update",
//   async ({ id, ...leaveData }, { rejectWithValue, getState }) => {
//     try {
//       const state = getState();
//       const userRole = state.auth.user.role;

//       // Additional validation for manager trying to approve their own leave
//       if (userRole === 'manager') {
//         const leave = state.leaves.leaves.find(l => l._id === id);
//         if (leave.employeeName === state.auth.user.name && leaveData.status === 'approved') {
//           throw new Error("Managers cannot approve their own leaves");
//         }
//       }

//       const res = await axios.put(`${BASE_URL}/leave/${id}`, leaveData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Leave updated successfully");
//       return res.data.data;
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to update leave");
//       return rejectWithValue(err.response?.data || "Update failed");
//     }
//   }
// );

// // export const deleteLeave = createAsyncThunk("leaves/delete", async (id, { rejectWithValue }) => {
// //   try {
// //     await axios.delete(`${BASE_URL}/leave/${id}`, {
// //       headers: { Authorization: `Bearer ${token}` },
// //     });
// //     toast.success("Leave deleted successfully");
// //     return id;
// //   } catch (err) {
// //     toast.error("Failed to delete leave");
// //     return rejectWithValue(err.response?.data || "Delete failed");
// //   }
// // });

// // Slice

// export const deleteLeave = createAsyncThunk(
//   "leaves/delete",
//   async (id, { rejectWithValue, getState }) => {
//     try {
//       const state = getState();
//       const user = state.auth.user;
//       const leave = state.leaves.leaves.find(l => l._id === id);

//       // Additional authorization check
//       if (user.role !== 'admin' && user.role !== 'manager' && leave.employeeName !== user.name) {
//         throw new Error("Unauthorized to delete this leave");
//       }

//       await axios.delete(`${BASE_URL}/leave/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       toast.success("Leave deleted successfully");
//       return id;
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to delete leave");
//       return rejectWithValue(err.response?.data || "Delete failed");
//     }
//   }
// );

// const leaveSlice = createSlice({
//   name: "leaves",
//   initialState: {
//     leaves: [],
//     loading: false,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchLeaves.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchLeaves.fulfilled, (state, action) => {
//         state.loading = false;
//         state.leaves = action.payload;
//       })
//       .addCase(addLeave.fulfilled, (state, action) => {
//         state.leaves.push(action.payload);
//       })
//       .addCase(updateLeave.fulfilled, (state, action) => {
//         const index = state.leaves.findIndex((l) => l._id === action.payload._id);
//         if (index !== -1) state.leaves[index] = action.payload;
//       })
//       .addCase(deleteLeave.fulfilled, (state, action) => {
//         state.leaves = state.leaves.filter((l) => l._id !== action.payload);
//       });
//   },
// });

// export default leaveSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");
const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

export const fetchLeaves = createAsyncThunk(
  "leaves/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userRole = state.auth.user.role;
      const userName = state.auth.user.name;

      let url = `${BASE_URL}/leaves`;

      if (userRole === "employee") {
        url = `${BASE_URL}/leaves?employeeName=${userName}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🚀 Fetch Leaves :", res.data.data);

      return res.data.data;
    } catch (err) {
      console.log("🚀 ~ fetchLeaves ~ error:", err);

      // if (err.response.data.message === "Token expired" || err.response.statusText === "Unauthorized") {

      //   toast.error("Session expired. Please log in again.");

      //   setTimeout(() => {
      //     window.location.href = "/login";
      //   }, 3000);
      // }
      toast.error("Failed to fetch leaves");
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  }
);

export const addLeave = createAsyncThunk(
  "leaves/add",
  async (leaveData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user = state.auth.user;

      if (user.role === "employee") {
        leaveData = {
          ...leaveData,
          employeeName: user.name,
          employeeId: user._id,
          isManualEntry: false,
          status: "pending"
        };
      }

      // For admin/manager, validate manual entries
      if ((user.role === "admin" || user.role === "manager") &&
        !leaveData.isManualEntry && !leaveData.employeeId) {
        throw new Error("Please select an employee or mark as manual entry");
      }

      const res = await axios.post(`${BASE_URL}/leave`, leaveData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Leave added successfully");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to add leave");
      return rejectWithValue(err.response?.data || "Add failed");
    }
  }
);

export const updateLeave = createAsyncThunk(
  "leaves/update",
  async ({ id, ...leaveData }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      const leave = state.leaves.leaves.find(l => l._id === id);

      // Additional validation
      if (user.role === "manager" && leave.employeeName === user.name && leaveData.status === "approved") {
        throw new Error("Managers cannot approve their own leaves");
      }

      const res = await axios.put(`${BASE_URL}/leave/${id}`, leaveData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Leave updated successfully");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update leave");
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

export const deleteLeave = createAsyncThunk(
  "leaves/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      const leave = state.leaves.leaves.find(l => l._id === id);

      if (user.role !== "admin" && user.role !== "manager" && leave.employeeName !== user.name) {
        throw new Error("Not authorized to delete this leave");
      }

      await axios.delete(`${BASE_URL}/leave/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Leave deleted successfully");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete leave");
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  }
);

const leaveSlice = createSlice({
  name: "leaves",
  initialState: {
    leaves: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addLeave.fulfilled, (state, action) => {
        state.leaves.unshift(action.payload);
      })
      .addCase(updateLeave.fulfilled, (state, action) => {
        const index = state.leaves.findIndex(l => l._id === action.payload._id);
        if (index !== -1) state.leaves[index] = action.payload;
      })
      .addCase(deleteLeave.fulfilled, (state, action) => {
        state.leaves = state.leaves.filter(l => l._id !== action.payload);
      });
  },
});

export default leaveSlice.reducer;