// store/slices/messageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for API calls
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationWith = null, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      let url = '/api/messages';

      if (conversationWith) {
        url += `?conversationWith=${conversationWith}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        validateStatus: function (status) {
          return status >= 200 && status < 300; // Only resolve for 2xx status codes
        }
      });

      // Check if response is HTML (indicating an error)
      if (typeof response.data === 'string' && response.data.startsWith('<!')) {
        throw new Error('Received HTML response instead of JSON. Check authentication.');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendMessageAPI = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/messages', messageData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAsReadAPI = createAsyncThunk(
  'messages/markAsRead',
  async (senderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/messages/read/${senderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return senderId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null,
    sending: false
  },
  reducers: {
    receiveMessage: (state, action) => {
      // Check if message already exists to avoid duplicates
      const existingMessage = state.messages.find(
        msg => msg._id === action.payload._id
      );

      if (!existingMessage) {
        state.messages.push(action.payload);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send message
      .addCase(sendMessageAPI.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessageAPI.fulfilled, (state, action) => {
        state.sending = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessageAPI.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })
      // Mark as read
      .addCase(markAsReadAPI.fulfilled, (state, action) => {
        const senderId = action.payload;
        state.messages.forEach(msg => {
          if (msg.sender === senderId || msg.sender._id === senderId) {
            msg.read = true;
            msg.readAt = new Date().toISOString();
          }
        });
      });
  }
});

// Make sure to export all actions
export const { receiveMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;