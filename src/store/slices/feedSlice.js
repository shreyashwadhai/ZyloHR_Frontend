

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  posts: [],
  token: null,
  loading: false,
  status: "idle",
  error: null,
};
const token = localStorage.getItem("token");

// Async thunks for API calls
export const fetchPosts = createAsyncThunk(
  "feeds/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}` + "/api/feeds",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Received posts:", response.data.data);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  "feeds/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("title", String(postData.title));
      formData.append("content", String(postData.content));

      if (postData.media) {
        console.log('Media file details:', {
          name: postData.media.name,
          type: postData.media.type,
          size: postData.media.size
        });
        formData.append("media", postData.media);
        console.log('Media file:', postData.media);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}` + "/api/feed",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 10000
        }
      );
      console.log('Create post response:', response.data);

      return response.data.data || response.data;
    } catch (error) {
      console.error('Create post error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  "feeds/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/feed/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  "feeds/addComment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/feed/comment/${postId}`, {
        text: comment.content,
      });
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const feedSlice = createSlice({
  name: "feeds",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = Array.isArray(action.payload) ? action.payload.map(post => ({
          ...post,
          id: post._id, // Ensure we have an id field
          media: post.media || null // Ensure media is properly structured
        })) : [];
        state.status = 'succeeded';
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch posts";
      })

      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.status = 'succeeded';
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create post";
      })

      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) {
          post.likes = action.payload.likes;
        }
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.comments.push(comment);
        }
      });
  },
});

export default feedSlice.reducer;