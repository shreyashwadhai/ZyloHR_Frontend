import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from '../service/profileService';

const initialState = {
  profile: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'profile/update',
  async ({ profileData, token }, thunkAPI) => {
    try {
      return await profileService.updateProfile(profileData, token);
    } catch (error) {
      const message = (
        error.response?.data?.message ||
        error.message ||
        error.toString()
      );
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = profileSlice.actions;
export default profileSlice.reducer;