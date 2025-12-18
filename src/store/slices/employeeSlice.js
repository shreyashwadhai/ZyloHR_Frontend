import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

// ✅ Async Thunks with Token
export const getAllEmployees = createAsyncThunk(
  "employees/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}` + "/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      toast.error("Failed to fetch employees");
      return rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  "employees/uploadProfile",
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("media", file);

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/users/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile picture updated successfully");

      return response.data;

    } catch (error) {
      toast.error("Failed to upload profile picture");
      return rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

export const updateEmployeeAPI = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/users/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Employee updated successfully");

      return response.data;
    } catch (error) {
      // toast.error("Failed to update employee");
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

export const createEmployeeAPI = createAsyncThunk(
  "employees/createEmployee",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}` + "/api/users",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Employee created successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Creation failed");
    }
  }
);

export const deleteEmployeeAPI = createAsyncThunk(
  "employees/deleteEmployee",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Employee deleted successfully");
      dispatch(deleteEmployee(id));
      return id;
    } catch (error) {
      toast.error("Failed to delete employee");
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);



// ✅ Initial State
const initialState = {
  employees: [],
  loading: false,
  uploadLoading: false,
  error: null,
  birthdayEmployees: [],
  showBirthdayModal: false,
};

// ✅ Slice
const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    updateEmployeeProfilePic: (state, action) => {
      const { userId, profilePic } = action.payload;
      const employee = state.employees.find(emp => emp._id === userId);
      if (employee) {
        employee.profilePic = profilePic;
      }
    },
    resetError: (state) => {
      state.error = null;
    },

    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    addEmployee: (state, action) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.employees.findIndex((emp) => emp._id === action.payload._id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter((emp) => emp._id !== action.payload);
    },
    checkBirthdays: (state) => {
      const today = new Date().toISOString().split("T")[0];
      const birthdayEmployees = state.employees.filter((emp) => {
        const empBirthday = new Date(emp.birthday);
        const todayDate = new Date(today);
        return (
          empBirthday.getMonth() === todayDate.getMonth() &&
          empBirthday.getDate() === todayDate.getDate()
        );
      });
      if (birthdayEmployees.length > 0) {
        state.birthdayEmployees = birthdayEmployees;
        state.showBirthdayModal = true;
        birthdayEmployees.forEach((emp) => {
          toast.success(`🎉 Happy Birthday ${emp.name}!`, {
            position: "top-center",
            autoClose: 5000,
          });
        });
      }
    },
    closeBirthdayModal: (state) => {
      state.showBirthdayModal = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllEmployees.rejected, (state) => {
        state.loading = false;
      })

      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploadLoading = true;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.uploadLoading = false;
        const { _id, profilePic } = action.payload;
        const employee = state.employees.find((emp) => emp._id === _id);
        if (employee) {
          employee.profilePic = profilePic;
        }
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      })

      .addCase(updateEmployeeAPI.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.employees.findIndex((emp) => emp._id === updated._id);
        if (index !== -1) {
          state.employees[index] = updated;
        }
      })
      .addCase(createEmployeeAPI.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(deleteEmployeeAPI.fulfilled, (state, action) => {
        const id = action.payload;
        state.employees = state.employees.filter((emp) => emp._id !== id);
      })
      .addCase(deleteEmployeeAPI.rejected, (state, action) => {
        toast.error(action.payload || "Failed to delete employee");
      })

  },
});

export const {
  setEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  checkBirthdays,
  closeBirthdayModal,
  extraReducers,
  updateEmployeeProfilePic,
  resetError
} = employeeSlice.actions;
export default employeeSlice.reducer;