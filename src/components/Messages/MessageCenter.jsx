import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  fetchMessages,
  sendMessageAPI,
  markAsReadAPI,
  receiveMessage,
} from "../../store/slices/messageSlice";

import { toast } from "react-toastify";
import { getAllEmployees } from "../../store/slices/employeeSlice";
import ZegoUIKitPrebuilt from "@zegocloud/zego-uikit-prebuilt";
import { useSocket } from "../../contexts/SocketContext";

// ZegoCloud integration
// if (typeof window !== "undefined" && window.ZegoUIKitPrebuilt) {
//   ZegoUIKitPrebuilt = window.ZegoUIKitPrebuilt;
// }

if (typeof window !== "undefined" && !window.ZegoUIKitPrebuilt) {
  window.ZegoUIKitPrebuilt = ZegoUIKitPrebuilt;
}

const MessageCenter = () => {
  const [newMessage, setNewMessage] = useState("");
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCallUI, setShowCallUI] = useState(false);
  const [callConfig, setCallConfig] = useState(null);
  const [showConversationList, setShowConversationList] = useState(true);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [callStarting, setCallStarting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const zegoContainerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { employees, loading: employeesLoading } = useSelector(
    (state) => state.employees
  );
  const {
    messages = [],
    loading: messagesLoading,
    error: messagesError,
  } = useSelector((state) => state.messages || {});
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const socket = useSocket();

  // Check for authentication errors
  useEffect(() => {
    if (messagesError) {
      toast.error(`Error loading messages: ${messagesError}`);
    }
  }, [messagesError]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to access messages");
      return;
    }

    dispatch(getAllEmployees());

    if (user) {
      dispatch(fetchMessages());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (activeConversation) {
      const otherUserId = activeConversation
        .split("-")
        .find((id) => id !== user._id);
      dispatch(fetchMessages(otherUserId));

      // Mark messages as read
      dispatch(markAsReadAPI(otherUserId));
    }
  }, [activeConversation, dispatch, user]);

  // Socket.IO event listeners
  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on("newMessage", (message) => {
        dispatch(receiveMessage(message));

        // If this message is part of the active conversation, scroll to bottom
        if (
          activeConversation &&
          (message.sender === activeConversation.split("-")[0] ||
            message.sender === activeConversation.split("-")[1] ||
            message.receiver === activeConversation.split("-")[0] ||
            message.receiver === activeConversation.split("-")[1])
        ) {
          setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }

        // Show notification if not in active conversation
        if (
          !activeConversation ||
          (message.senderId !== activeConversation.split("-")[0] &&
            message.senderId !== activeConversation.split("-")[1])
        ) {
          toast.info(`New message from ${message.senderName}`);
        }
      });

      // Listen for typing indicators
      socket.on("userTyping", (data) => {
        setTypingUsers((prev) => ({
          ...prev,
          [data.senderId]: data.isTyping,
        }));
      });

      // Clean up on unmount
      return () => {
        socket.off("newMessage");
        socket.off("userTyping");
      };
    }
  }, [socket, activeConversation, dispatch]);

  // Handle typing indicator
  const handleTyping = (isTyping) => {
    if (socket && activeConversation) {
      const receiverId = activeConversation
        .split("-")
        .find((id) => id !== user._id);
      socket.emit("typing", {
        senderId: user._id,
        receiverId,
        isTyping,
      });
    }
  };

  // Filter available users to message
  const availableReceivers = employees.filter(
    (emp) =>
      emp._id !== user._id &&
      (user.role === "employee"
        ? emp.role === "manager" || emp.role === "admin"
        : true)
  );

  console.log("messages", messages);

  // // Handle HTML response error
  // if (typeof messages === "string" && messages.startsWith("<!")) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <div className="text-red-500 text-center">
  //         <p>Authentication error. Please log in again.</p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
  //         >
  //           Reload
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // if (messagesError) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <div className="text-red-500 text-center">
  //         <p>Error loading messages: {messagesError}</p>
  //         <button
  //           onClick={() => dispatch(fetchMessages())}
  //           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  // if (employeesLoading || messagesLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  // Safely filter messages
  const userMessages = (Array.isArray(messages) ? messages : [])
  .filter((msg) => {
    if (!msg) return false; // Skip undefined messages
    
    // Handle both message structures
    const senderId = msg.senderId || (msg.sender && msg.sender._id);
    const receiverId = msg.receiverId || (msg.receiver && msg.receiver._id);
    return senderId === user._id || receiverId === user._id;
  })
  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Group messages by conversation
  const conversations = {};
  userMessages.forEach((msg) => {
    // Handle both message structures
    const senderId = msg.senderId || (msg.sender && msg.sender._id);
    const receiverId = msg.receiverId || (msg.receiver && msg.receiver._id);
    const senderName = msg.senderName || (msg.sender && msg.sender.name);
    const receiverName =
      msg.receiverName || (msg.receiver && msg.receiver.name);

    const otherUserId = senderId === user._id ? receiverId : senderId;
    const otherUserName = senderId === user._id ? receiverName : senderName;
    const conversationId = [user._id, otherUserId].sort().join("-");

    if (!conversations[conversationId]) {
      conversations[conversationId] = {
        id: conversationId,
        otherUser: employees.find((emp) => emp._id === otherUserId) || {
          _id: otherUserId,
          name: otherUserName,
          role: "unknown",
          department: "unknown",
          email: "unknown",
        },
        messages: [],
        unreadCount: 0,
        lastMessage: msg,
      };
    }

    conversations[conversationId].messages.push(msg);
    conversations[conversationId].lastMessage = msg;
  });

  // Get conversation list
  const conversationList = Object.values(conversations).sort(
    (a, b) =>
      new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
  );

  // Filter conversations based on search term
  const filteredConversations = conversationList.filter((conv) =>
    conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter all users based on search term
  const filteredAllUsers = employees
    .filter((emp) => emp._id !== user._id)
    .filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.department &&
          emp.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (emp.role && emp.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Get messages for active conversation
  const activeConversationMessages = activeConversation
    ? conversations[activeConversation]?.messages || []
    : [];

  // Get current typing user for active conversation
  const currentTypingUser = activeConversation
    ? typingUsers[activeConversation.split("-").find((id) => id !== user._id)]
    : false;

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversationMessages]);

  // Initialize ZegoCloud call
  useEffect(() => {
    if (
      showCallUI &&
      callConfig &&
      zegoContainerRef.current &&
      ZegoUIKitPrebuilt
    ) {
      const appID = 239916047;
      const serverSecret = "b0bdacc54249d4a7234745f3cd430846";

      if (!appID || !serverSecret) {
        toast.error("ZegoCloud credentials not configured");
        setShowCallUI(false);
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        callConfig.roomID,
        user._id,
        user.name
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: zegoContainerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        turnOnMicrophoneWhenJoining:
          callConfig.type === "voice" || callConfig.type === "video",
        turnOnCameraWhenJoining: callConfig.type === "video",
        showMyCameraToggleButton: callConfig.type === "video",
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: callConfig.type === "video",
        showTextChat: false,
        showUserList: false,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: false,
      });

      return () => {
        zp.destroy();
      };
    }
  }, [showCallUI, callConfig, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const receiverId = activeConversation
      .split("-")
      .find((id) => id !== user._id);

    const receiver = employees.find((emp) => emp._id === receiverId);

    if (!receiver) return;

    dispatch(
      sendMessageAPI({
        receiverId: receiver._id,
        content: newMessage,
      })
    );

    setNewMessage("");
    // Stop typing indicator
    handleTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send message via Socket.IO if available, otherwise use Redux
    if (socket) {
      socket.emit("privateMessage", {
        senderId: user._id,
        senderName: user.name,
        receiverId: receiver._id,
        receiverName: receiver.name,
        content: newMessage,
      });
    } else {
      dispatch(
        sendMessageStart({
          senderId: user._id,
          senderName: user.name,
          receiverId: receiver._id,
          receiverName: receiver.name,
          content: newMessage,
        })
      );
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Handle typing indicator
    if (!typingTimeoutRef.current) {
      handleTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  // const handleClearMessages = () => {
  //   dispatch(clearMessages());
  // };

  const startNewConversation = (userItem) => {
    const conversationId = [user._id, userItem._id].sort().join("-");
    setActiveConversation(conversationId);
    setShowAllUsers(false);
    if (window.innerWidth < 768) setShowConversationList(false);
  };

  const initiateCall = async (type) => {
    if (!activeConversation) {
      toast.error("Please select a conversation first");
      return;
    }

    const receiverId = activeConversation
      .split("-")
      .find((id) => id !== user._id);
    const receiver = employees.find((emp) => emp._id === receiverId);

    if (!receiver) {
      toast.error("User not found");
      return;
    }

    setCallStarting(true);

    // Simulate call initiation with a slight delay for animation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setCallConfig({
      type,
      roomID: `call_${Date.now()}`,
      receiver,
    });
    setShowCallUI(true);
    setCallStarting(false);
  };

  const closeCallUI = () => {
    setShowCallUI(false);
    setCallConfig(null);
  };

  const getMessageBubbleStyle = (message) => {
    const isSent = message.sender === user._id || message.senderId === user._id;
    return isSent
      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
      : darkMode
        ? "bg-gray-700 text-white mr-auto"
        : "bg-gray-100 text-gray-900 mr-auto";
  };

  // Responsive layout for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowConversationList(!activeConversation);
      } else {
        setShowConversationList(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeConversation]);

  if (employeesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Call UI Overlay */}
      <AnimatePresence>
        {showCallUI && callConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4"
          >
            <div className="w-full h-full flex flex-col">
              <div className="flex justify-between items-center p-4 bg-gray-800">
                <h2 className="text-white text-lg font-semibold">
                  {callConfig.type === "voice" ? "Voice Call" : "Video Call"}{" "}
                  with {callConfig.receiver.name}
                </h2>
                <button
                  onClick={closeCallUI}
                  className="text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div ref={zegoContainerRef} className="flex-1 bg-black"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Starting Animation */}
      <AnimatePresence>
        {callStarting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              className="p-6 bg-blue-600 rounded-full"
            >
              {callConfig?.type === "voice" ? (
                <PhoneIcon className="w-12 h-12 text-white" />
              ) : (
                <VideoCameraIcon className="w-12 h-12 text-white" />
              )}
            </motion.div>
            <p className="text-white mt-4 text-lg">
              Calling {callConfig?.receiver.name}...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List - Hidden on mobile when conversation is active */}
        {(showConversationList || !activeConversation) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r ${
              darkMode
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            } flex flex-col`}
          >
            {/* Header */}
            <div
              className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h1
                  className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  💬 Messages
                </h1>
                <button
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  className={`p-2 rounded-lg ${
                    showAllUsers
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                  title={showAllUsers ? "Show Conversations" : "Show All Users"}
                >
                  <UsersIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div
                className={`relative rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
              >
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder={
                    showAllUsers ? "Search users..." : "Search conversations..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg focus:outline-none ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b dark:border-gray-700">
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  !showAllUsers
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setShowAllUsers(false)}
              >
                Conversations
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  showAllUsers
                    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setShowAllUsers(true)}
              >
                All Users
              </button>
            </div>

            {/* Conversation/User List */}
            <div className="flex-1 overflow-y-auto">
              {!showAllUsers ? (
                /* Conversations List */
                filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      whileHover={{
                        backgroundColor: darkMode
                          ? "rgba(55, 65, 81, 0.5)"
                          : "rgba(243, 244, 246, 0.5)",
                      }}
                      className={`p-4 border-b cursor-pointer flex items-center ${
                        darkMode
                          ? "border-gray-800 hover:bg-gray-800"
                          : "border-gray-100 hover:bg-gray-50"
                      } ${activeConversation === conversation.id ? (darkMode ? "bg-gray-800" : "bg-blue-50") : ""}`}
                      onClick={() => {
                        setActiveConversation(conversation.id);
                        if (window.innerWidth < 768)
                          setShowConversationList(false);
                      }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {conversation.otherUser.name.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3
                            className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            {conversation.otherUser.name}
                          </h3>
                          <span
                            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {new Date(
                              conversation.lastMessage.timestamp
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p
                          className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {conversation.lastMessage.senderId === user._id
                            ? "You: "
                            : ""}
                          {conversation.lastMessage.content}
                        </p>
                        <div className="flex items-center mt-1">
                          <span
                            className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                          >
                            {conversation.otherUser.role} •{" "}
                            {conversation.otherUser.department}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 p-4">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <p className={darkMode ? "text-gray-500" : "text-gray-400"}>
                      No conversations yet
                    </p>
                    <p className="text-xs mt-2 text-center">
                      Start a conversation from the <strong>All Users</strong>{" "}
                      tab
                    </p>
                  </div>
                )
              ) : /* All Users List */
              filteredAllUsers.length > 0 ? (
                filteredAllUsers.map((userItem) => (
                  <motion.div
                    key={userItem._id}
                    whileHover={{
                      backgroundColor: darkMode
                        ? "rgba(55, 65, 81, 0.5)"
                        : "rgba(243, 244, 246, 0.5)",
                    }}
                    className={`p-4 border-b cursor-pointer flex items-center ${
                      darkMode
                        ? "border-gray-800 hover:bg-gray-800"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                    onClick={() => startNewConversation(userItem)}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {userItem.name.charAt(0)}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3
                          className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {userItem.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            userItem.role === "admin"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : userItem.role === "manager"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {userItem.role}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {userItem.department}
                      </p>
                      <p
                        className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {userItem.email}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 p-4">
                  <UserGroupIcon className="w-12 h-12 text-gray-400 mb-4" />
                  <p className={darkMode ? "text-gray-500" : "text-gray-400"}>
                    No users found
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Chat Interface - Hidden on mobile when no conversation is selected */}
        {(activeConversation || window.innerWidth >= 768) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex-1 flex flex-col ${darkMode ? "bg-gray-900" : "bg-white"}`}
          >
            {/* Chat Header */}
            {activeConversation && (
              <div
                className={`p-4 border-b flex items-center justify-between ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex items-center">
                  {window.innerWidth < 768 && (
                    <button
                      onClick={() => {
                        setActiveConversation(null);
                        setShowConversationList(true);
                      }}
                      className="mr-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                  )}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {conversations[activeConversation]?.otherUser.name.charAt(
                      0
                    )}
                  </div>
                  <div className="ml-3">
                    <h3
                      className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {conversations[activeConversation]?.otherUser.name}
                    </h3>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {conversations[activeConversation]?.otherUser.role} •{" "}
                      {conversations[activeConversation]?.otherUser.department}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => initiateCall("voice")}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                    title="Voice Call"
                  >
                    <PhoneIcon className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => initiateCall("video")}
                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    title="Video Call"
                  >
                    <VideoCameraIcon className="w-5 h-5" />
                  </motion.button>
                  <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Messages Container */}
            <div
              className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
            >
              {activeConversation ? (
                <>
                  {activeConversationMessages.length > 0 ? (
                    <div className="space-y-4">
                      {activeConversationMessages.map((message, index) => (
                        <motion.div
                          key={message.id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`max-w-[75%] sm:max-w-[65%] md:max-w-[60%] lg:max-w-[50%] ${getMessageBubbleStyle(message)} p-3 rounded-2xl`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold opacity-80">
                              {message.senderId === user._id
                                ? "You"
                                : message.senderName}
                            </span>
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </motion.div>
                      ))}

                      {/* Typing indicator */}
                      {currentTypingUser && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="max-w-[75%] sm:max-w-[65%] md:max-w-[60%] lg:max-w-[50%] bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl mr-auto"
                        >
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </motion.div>
                      )}

                      <div ref={messageEndRef} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mb-4" />
                      <p
                        className={darkMode ? "text-gray-500" : "text-gray-400"}
                      >
                        No messages yet
                      </p>
                      <p
                        className={`text-sm mt-1 ${darkMode ? "text-gray-600" : "text-gray-500"}`}
                      >
                        Start a conversation with{" "}
                        {conversations[activeConversation]?.otherUser.name}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3
                      className={`text-lg font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {showAllUsers
                        ? "Select a user to start chatting"
                        : "Select a conversation"}
                    </h3>
                    <p className={darkMode ? "text-gray-500" : "text-gray-400"}>
                      {showAllUsers
                        ? "Choose a user from the list to start a new conversation"
                        : "Choose a conversation from the list to view messages"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            {activeConversation && (
              <div
                className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyDown={() => {
                      if (!typingTimeoutRef.current) {
                        handleTyping(true);
                      }
                    }}
                    placeholder="Type a message..."
                    className={`flex-1 py-2 px-4 rounded-full focus:outline-none ${
                      darkMode
                        ? "bg-gray-700 text-white placeholder-gray-400"
                        : "bg-gray-100 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <motion.button
                    type="submit"
                    disabled={!newMessage.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;
