// hooks/useProfileUpload.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadProfilePicture } from '../store/slices/employeeSlice';

export const useProfileUpload = () => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (userId, file) => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    try {
      await dispatch(uploadProfilePicture({ userId, file })).unwrap();
      return true;
    } catch (err) {
      setError(err.message || 'Failed to upload profile picture');
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { handleUpload, uploading, error };
};