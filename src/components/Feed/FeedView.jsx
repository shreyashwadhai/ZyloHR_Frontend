import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  PlusIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  DocumentTextIcon,
  UserCircleIcon,
  CameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import {
  likePost,
  addComment,
  createPost,
  fetchPosts,
} from "../../store/slices/feedSlice";

import { toast } from "react-toastify";
import axios from "axios";

const FeedView = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    media: null,
    mediaPreview: null,
  });
  const [commentInputs, setCommentInputs] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { posts = [], status, error } = useSelector((state) => state.feeds);
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (status === "idle") {
  //     dispatch(fetchPosts());
  //   }
  // }, [dispatch, status]);

  // useEffect(() => {
  //   dispatch(fetchPosts());
  // }, [dispatch]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        await dispatch(fetchPosts());
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        toast.error(error.message || "Failed to load posts");
      }
    };

    if (status === "idle") {
      loadPosts();
    }
  }, [dispatch, status]);

  useEffect(() => {
    console.log("Current posts:", posts);
  }, [posts]);

  const canCreatePost =
    user?.role === "manager" ||
    user?.role === "admin" ||
    user?.role === "employee";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only images (JPEG, PNG, GIF) and MP4 videos are allowed");
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size too large. Maximum 50MB allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPost({
        ...newPost,
        media: file,
        mediaPreview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeMedia = () => {
    setNewPost({
      ...newPost,
      media: null,
      mediaPreview: null,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      return toast.error("Title and content are required");
    }

    setIsCreating(true);
    try {
      await dispatch(
        createPost({
          title: newPost.title,
          content: newPost.content,
          media: newPost.media,
        })
      ).unwrap();

      toast.success("Post created successfully!");
      setNewPost({ title: "", content: "", media: null, mediaPreview: null });
      setShowCreatePost(false);

      // Refresh the posts list
      await dispatch(fetchPosts());
    } catch (error) {
      console.error("Post creation failed:", error);
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsCreating(false);
    }
  };
  const handleLikePost = (postId) => {
    if (!likedPosts.has(postId)) {
      dispatch(likePost(postId));
      setLikedPosts((prev) => new Set([...prev, postId]));
      toast.success("❤️ Post liked!");
    }
  };

  const handleAddComment = (postId) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) return;

    dispatch(
      addComment({
        postId,
        comment: {
          author: user.name,
          authorId: user.id,
          content: comment,
        },
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    toast.success("💬 Comment added!");
  };

  // In fetchPosts thunk
  // console.log("API Response:", response.data);
  // console.log("Data structure:", {
  //   hasData: !!response.data.data,
  //   isArray: Array.isArray(response.data.data),
  //   firstItem: response.data.data?.[0],
  // });

  // In FeedView component
  useEffect(() => {
    console.log("Posts in component:", {
      posts,
      firstPost: posts?.[0],
      firstPostMedia: posts?.[0]?.media,
    });
  }, [posts]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 sticky top-0 z-10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl bg-cyan-50 "
      >
        <div>
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${darkMode ? "" : "text-gray-900"} mb-2`}
          >
            📰 Company Feed
          </h1>
          <p
            className={`text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Stay updated with company announcements and news
          </p>
        </div>
        {canCreatePost && (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-center"
          >
            <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Create Post</span>
          </motion.button>
        )}
      </motion.div>

      {/* Create Post Form */}
      {showCreatePost && canCreatePost && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border ${
            darkMode
              ? "bg-gradient-to-br from-gray-900/50 to-slate-900/50 border-gray-700/50"
              : "bg-gradient-to-br from-white/70 to-emerald-50/70 border-emerald-200/50"
          } backdrop-blur-xl relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <h2
                className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                ✍️ Create New Post
              </h2>
            </div>

            <form
              onSubmit={handleCreatePost}
              className="space-y-4 sm:space-y-6"
            >
              <input
                type="text"
                name="title"
                value={newPost.title}
                onChange={handleInputChange}
                placeholder="📝 Post title..."
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                    : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500"
                } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300`}
                required
              />

              {/* Media Upload Section */}
              <div className="space-y-2">
                <label
                  htmlFor="post-media"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border-2 border-dashed ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-500/10"
                      : darkMode
                        ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
                        : "border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } transition-colors`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <CameraIcon className="w-5 h-5" />
                  <span>
                    {isDragging
                      ? "Drop your file here"
                      : "Add Media (or drag & drop)"}
                  </span>
                </label>
                <input
                  id="post-media"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {newPost.mediaPreview && (
                  <div className="relative mt-2">
                    {newPost.media.type.startsWith("image/") ? (
                      <img
                        src={newPost.mediaPreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={newPost.mediaPreview}
                        controls
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute top-2 right-2 p-2 bg-gray-800/70 rounded-full hover:bg-gray-700/90 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}
              </div>

              <textarea
                name="content"
                value={newPost.content}
                onChange={handleInputChange}
                rows={5}
                placeholder="💭 What's on your mind? Share company updates, announcements, or news..."
                className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                    : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500"
                } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none transition-all duration-300`}
                required
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isCreating}
                  className={`bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 shadow-lg ${
                    isCreating ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isCreating ? "⏳ Uploading..." : "🚀 Publish Post"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  ❌ Cancel
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6 sm:space-y-8">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post, index) => (
            <motion.div
              key={post.id || index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border ${
                darkMode
                  ? "bg-gradient-to-br from-gray-900/50 to-slate-900/50 border-gray-700/50"
                  : "bg-gradient-to-br from-white/70 to-blue-50/70 border-blue-200/50"
              } backdrop-blur-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                {/* Post Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3
                          className={`font-bold text-base sm:text-lg ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {user.name}
                        </h3>
                        <span
                          className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          📅{" "}
                          {post.updatedAt
                            ? new Date(post.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : new Date(post.timestamp).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                        </span>
                      </div>
                    </div>
                    <h2
                      className={`text-lg sm:text-xl lg:text-2xl font-bold mt-3 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {post.title}
                    </h2>
                    <p
                      className={`mt-3 text-sm sm:text-base lg:text-lg leading-relaxed ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {post.content}
                    </p>
                  </div>
                </div>
                {console.log("Post media:", post.media)}

                {/* Media Display */}
                {/* {post.media && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    <img
                      src={post.media}
                      alt="Post media"
                      className="w-full max-h-96 object-contain rounded-lg"
                    />
                  </div>
                )} */}

                {post.media?.url && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    {post.media.type.startsWith("image/") ? (
                      <img
                        src={post.media.url}
                        alt="Post media"
                        className="w-full max-h-96 object-contain rounded-lg"
                      />
                    ) : (
                      <video controls className="w-full max-h-96">
                        <source src={post.media.url} type={post.media.type} />
                      </video>
                    )}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/20 dark:border-gray-700/30">
                  <div className="flex items-center space-x-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-2 transition-colors duration-200 ${
                        likedPosts.has(post.id)
                          ? "text-red-500"
                          : darkMode
                            ? "text-gray-400 hover:text-red-400"
                            : "text-gray-600 hover:text-red-500"
                      }`}
                    >
                      {likedPosts.has(post.id) ? (
                        <HeartSolidIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                      <span className="font-semibold text-sm sm:text-base">
                        {post.likes}
                      </span>
                    </motion.button>

                    <div
                      className={`flex items-center space-x-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      <ChatBubbleOvalLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="font-semibold text-sm sm:text-base">
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                {post.comments.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4
                      className={`font-semibold text-sm sm:text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      💬 Comments ({post.comments.length})
                    </h4>
                    {post.comments.map((comment) => (
                      <motion.div
                        key={comment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl ${darkMode ? "bg-gray-800/50" : "bg-gray-50/80"} backdrop-blur-sm`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            👤 {comment.author}
                          </span>
                          <span
                            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p
                          className={`text-sm sm:text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {comment.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="💭 Add a comment..."
                    className={`flex-1 px-4 py-3 rounded-xl border text-sm sm:text-base ${
                      darkMode
                        ? "bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
                        : "bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500"
                    } backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddComment(post.id)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base hover:from-blue-400 hover:to-purple-500 transition-all duration-300 shadow-lg sm:whitespace-nowrap"
                  >
                    💬 Comment
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div
            className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {posts === null ? "Loading posts..." : "No posts available"}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedView;
