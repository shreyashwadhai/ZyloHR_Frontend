import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/users/profile`;


// Update user profile
const updateProfile = async (profileData) => {
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    // Create FormData for file upload
    const formData = new FormData();
    if (profileData.text) formData.append('text', profileData.text);
    if (profileData.profileImage) formData.append('media', profileData.profileImage);

    const userId = JSON.parse(localStorage.getItem("user"))._id;

    const response = await axios.put(`${API_URL}/${userId}`, formData, config);
    return response.data;
};

const profileService = {
    updateProfile
};

export default profileService;