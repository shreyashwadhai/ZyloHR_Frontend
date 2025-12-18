// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { CameraIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

// const UserProfile = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { darkMode } = useSelector((state) => state.theme);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editData, setEditData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     phone: user?.phone || '',
//     department: user?.department || ''
//   });
//   const [profileImage, setProfileImage] = useState(user?.profileImage || null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSave = () => {
//     // Here you would dispatch an action to update user data
//     console.log('Saving:', editData);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setEditData({
//       name: user?.name || '',
//       email: user?.email || '',
//       phone: user?.phone || '',
//       department: user?.department || ''
//     });
//     setIsEditing(false);
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImage(reader.result);
//         // Here you would upload the image to your server
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className={`max-w-3xl mx-auto p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Profile Image Section */}
//         <div className="flex flex-col items-center">
//           <div className="relative group">
//             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
//               {profileImage ? (
//                 <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
//               ) : (
//                 <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                   <span className="text-4xl font-bold">
//                     {user?.name?.charAt(0).toUpperCase() || 'U'}
//                   </span>
//                 </div>
//               )}
//             </div>
//             <label 
//               htmlFor="profile-upload"
//               className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer transform translate-y-1/4 group-hover:opacity-100 transition-opacity"
//             >
//               <CameraIcon className="h-5 w-5 text-white" />
//               <input
//                 id="profile-upload"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageUpload}
//               />
//             </label>
//           </div>
//           <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
//           <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user?.role}</p>
//         </div>

//         {/* Profile Details Section */}
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-semibold">Profile Information</h3>
//             {isEditing ? (
//               <div className="flex gap-2">
//                 <button 
//                   onClick={handleSave}
//                   className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
//                 >
//                   <CheckIcon className="h-5 w-5" />
//                 </button>
//                 <button 
//                   onClick={handleCancel}
//                   className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                 >
//                   <XMarkIcon className="h-5 w-5" />
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 onClick={() => setIsEditing(true)}
//                 className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
//               >
//                 <PencilIcon className="h-5 w-5" />
//               </button>
//             )}
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="name"
//                   value={editData.name}
//                   onChange={handleInputChange}
//                   className={`mt-1 block w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//                 />
//               ) : (
//                 <p className="mt-1">{user?.name}</p>
//               )}
//             </div>

//             <div>
//               <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
//               {isEditing ? (
//                 <input
//                   type="email"
//                   name="email"
//                   value={editData.email}
//                   onChange={handleInputChange}
//                   className={`mt-1 block w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//                 />
//               ) : (
//                 <p className="mt-1">{user?.email}</p>
//               )}
//             </div>

//             <div>
//               <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
//               {isEditing ? (
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={editData.phone}
//                   onChange={handleInputChange}
//                   className={`mt-1 block w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//                 />
//               ) : (
//                 <p className="mt-1">{user?.phone || 'Not provided'}</p>
//               )}
//             </div>

//             <div>
//               <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="department"
//                   value={editData.department}
//                   onChange={handleInputChange}
//                   className={`mt-1 block w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//                 />
//               ) : (
//                 <p className="mt-1">{user?.department || 'Not assigned'}</p>
//               )}
//             </div>

          
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CameraIcon, PencilIcon, CheckIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const UserProfile = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    jobTitle: user?.jobTitle || ''
  });
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [activeTab, setActiveTab] = useState('profile');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Dispatch action to update user data
    console.log('Saving:', editData);
    setIsEditing(false);
    // Add your API call here
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      jobTitle: user?.jobTitle || ''
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // Add your image upload API call here
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900/80' : 'bg-black/50'}`}>
      <div 
        className={`relative max-w-4xl w-full rounded-2xl shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors z-10`}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-2xl font-bold flex items-center">
            <span>User Profile</span>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
              {user?.role}
            </span>
          </h2>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your personal information and settings
          </p>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === 'profile' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === 'settings' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm flex items-center ${activeTab === 'security' ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center md:items-start">
                <div className="relative group mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-lg">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <span className="text-4xl font-bold">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profile-upload"
                    className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} shadow-md border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  >
                    <CameraIcon className="w-5 h-5" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {user?.jobTitle || 'No position specified'}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                    Member since {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Profile Details Section */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSave}
                        className={`px-3 py-1 rounded-md flex items-center gap-1 ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white transition-colors`}
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button 
                        onClick={handleCancel}
                        className={`px-3 py-1 rounded-md flex items-center gap-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                      >
                        <XMarkIcon className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className={`px-3 py-1 rounded-md flex items-center gap-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        className={`w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 transition-colors`}
                      />
                    ) : (
                      <p className={`p-2 rounded-md ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>{user?.name}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleInputChange}
                        className={`w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 transition-colors`}
                      />
                    ) : (
                      <p className={`p-2 rounded-md ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>{user?.email}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        className={`w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 transition-colors`}
                      />
                    ) : (
                      <p className={`p-2 rounded-md ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>{user?.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Department</label>
                    {isEditing ? (
                      <div className="relative">
                        <select
                          name="department"
                          value={editData.department}
                          onChange={handleInputChange}
                          className={`w-full rounded-md border p-2 appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 transition-colors pr-8`}
                        >
                          <option value="">Select Department</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                          <option value="HR">Human Resources</option>
                        </select>
                        <ChevronDownIcon className={`w-4 h-4 absolute right-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      </div>
                    ) : (
                      <p className={`p-2 rounded-md ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>{user?.department || 'Not assigned'}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Job Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="jobTitle"
                        value={editData.jobTitle}
                        onChange={handleInputChange}
                        className={`w-full rounded-md border p-2 ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-500'} focus:ring-1 focus:ring-blue-500 transition-colors`}
                      />
                    ) : (
                      <p className={`p-2 rounded-md ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>{user?.jobTitle || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Settings content goes here...
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Security content goes here...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-gray-50'} flex justify-end`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;