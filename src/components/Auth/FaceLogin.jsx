// import React, { useRef, useState } from "react";
// import axios from "axios";

// const FaceLogin = ({ onSuccess }) => {
//   const videoRef = useRef(null);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [status, setStatus] = useState("");

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;

//       setTimeout(() => {
//         captureAndVerify();
//       }, 1000); // 1 second delay
//     } catch (err) {
//       alert("Camera access denied.");
//     }
//   };

//   const captureAndVerify = async (retry = false) => {
//     setIsVerifying(true);
//     setStatus(retry ? "Retrying..." : "Verifying...");

//     try {
//       if (!videoRef.current || !videoRef.current.videoWidth) {
//         throw new Error("Camera not ready");
//       }

//       const canvas = document.createElement("canvas");
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

//       const blob = await new Promise((resolve) => {
//         canvas.toBlob(resolve, "image/jpeg", 0.9);
//       });

//       const formData = new FormData();
//       formData.append("file", blob, "face.jpg");

//       const res = await axios.post(
//         "http://127.0.0.1:5000/verify-face",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           timeout: 10000,
//           withCredentials: true,
//         }
//       );

//       if (res.data.name && res.data.name !== "Unknown") {
//         setStatus(`✅ Verified as ${res.data.name}`);
//         onSuccess();
//       } else {
//         setStatus("❌ Face not recognized");
//         throw new Error(res.data.name || "Verification failed");
//       }
//     } catch (error) {
//       const message = error.response?.data?.name || error.message;

//       if (message.includes("No face") || message.includes("Please blink")) {
//         setStatus(`⚠️ ${message}`);

//         // Retry once after 3 seconds
//         if (!retry) {
//           setTimeout(() => {
//             captureAndVerify(true);
//           }, 3000);
//         }
//       } else {
//         setStatus(`❌ Error: ${message}`);
//       }

//       console.error("Verification Error:", message);
//     } finally {
//       if (!retry) {
//         setTimeout(() => setIsVerifying(false), 3000);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
//       <h1 className="text-2xl mb-4">Face Recognition Attendance</h1>

//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         className="rounded-xl border border-white w-[350px] h-[280px]"
//       />
//       <div className="mt-4">
//         <button
//           onClick={startCamera}
//           disabled={isVerifying}
//           className={`px-4 py-2 rounded ${
//             isVerifying ? "bg-gray-500" : "bg-green-600"
//           }`}
//         >
//           {isVerifying ? "Verifying..." : "Scan Your Face"}
//         </button>
//       </div>

//       <p className="mt-4">{status}</p>
//     </div>
//   );
// };

// export default FaceLogin;


import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FiCamera, FiCheckCircle, FiXCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

const FaceLogin = ({ onSuccess }) => {
  const videoRef = useRef(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" }); // info, success, error, warning
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showOverlay, setShowOverlay] = useState(false);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setStatus({ message: "Initializing camera...", type: "info" });
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user" 
        } 
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      
      // Start countdown before verification
      setStatus({ message: "Get ready for verification...", type: "info" });
      setShowOverlay(true);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            captureAndVerify();
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err) {
      setStatus({ 
        message: "Camera access denied. Please enable camera permissions.", 
        type: "error" 
      });
      console.error("Camera Error:", err);
    }
  };

  const captureAndVerify = async (retry = false) => {
    setIsVerifying(true);
    setShowOverlay(false);
    setStatus({ 
      message: retry ? "Retrying verification..." : "Verifying your identity...", 
      type: "info" 
    });

    try {
      if (!videoRef.current || !videoRef.current.videoWidth) {
        throw new Error("Camera not ready");
      }

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      // Draw image with subtle enhancement
      ctx.filter = "contrast(1.1) brightness(1.05)";
      ctx.drawImage(videoRef.current, 0, 0);
      ctx.filter = "none";

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.92);
      });

      const formData = new FormData();
      formData.append("file", blob, "face.jpg");

      const res = await axios.post(
        "http://127.0.0.1:5000/verify-face",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 10000,
          withCredentials: true,
        }
      );

      if (res.data.name && res.data.name !== "Unknown") {
        setStatus({ 
          message: `Verified as ${res.data.name}`, 
          type: "success" 
        });
        // Add success animation before callback
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setStatus({ 
          message: "Face not recognized", 
          type: "error" 
        });
        throw new Error(res.data.name || "Verification failed");
      }
    } catch (error) {
      const message = error.response?.data?.name || error.message;

      if (message.includes("No face") || message.includes("Please blink")) {
        setStatus({ 
          message: message.includes("No face") 
            ? "Please position your face in the frame" 
            : "Please blink naturally for liveness detection",
          type: "warning"
        });

        if (!retry) {
          setTimeout(() => {
            setShowOverlay(true);
            setCountdown(3);
            captureAndVerify(true);
          }, 3000);
        }
      } else {
        setStatus({ 
          message: `Error: ${message}`, 
          type: "error" 
        });
      }

      console.error("Verification Error:", message);
    } finally {
      if (!retry) {
        setTimeout(() => {
          setIsVerifying(false);
          setShowOverlay(false);
        }, 3000);
      }
    }
  };

  const getStatusIcon = () => {
    switch (status.type) {
      case "success":
        return <FiCheckCircle className="text-green-500 text-2xl" />;
      case "error":
        return <FiXCircle className="text-red-500 text-2xl" />;
      case "warning":
        return <FiAlertCircle className="text-yellow-500 text-2xl" />;
      default:
        return <FiLoader className="text-blue-500 text-2xl animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status.type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Face Recognition Login</h1>
          <p className="text-blue-100 mt-1">Secure biometric authentication</p>
        </div>
        
        {/* Camera Preview */}
        <div className="relative p-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Camera overlay */}
            {showOverlay && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="text-white text-center">
                  <div className="text-5xl font-bold mb-2">{countdown}</div>
                  <p className="text-lg">Position your face in the frame</p>
                </div>
              </div>
            )}
            
            {/* Face detection frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-blue-400 rounded-full w-64 h-64 opacity-80"></div>
            </div>
          </div>
        </div>
        
        {/* Status */}
        {status.message && (
          <div className={`px-4 py-3 mx-4 mb-4 rounded-lg ${getStatusColor()} flex items-center space-x-3`}>
            {getStatusIcon()}
            <span className="font-medium">{status.message}</span>
          </div>
        )}
        
        {/* Controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {!cameraActive ? (
            <button
              onClick={startCamera}
              disabled={isVerifying}
              className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${
                isVerifying
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <FiCamera className="text-lg" />
              <span>{isVerifying ? "Processing..." : "Start Face Scan"}</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (videoRef.current?.srcObject) {
                    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                  }
                  setCameraActive(false);
                  setStatus({ message: "", type: "" });
                }}
                className="py-3 px-4 rounded-xl font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowOverlay(true);
                  setCountdown(3);
                }}
                disabled={isVerifying}
                className={`py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors ${
                  isVerifying
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                }`}
              >
                {isVerifying ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <FiCamera className="text-lg" />
                )}
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>For security, ensure good lighting and remove sunglasses</p>
        <p className="mt-1">© {new Date().getFullYear()} Your Company</p>
      </div>
    </div>
  );
};

export default FaceLogin;