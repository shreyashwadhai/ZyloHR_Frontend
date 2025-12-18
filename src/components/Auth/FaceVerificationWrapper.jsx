// FaceVerificationWrapper.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FaceLogin from './FaceLogin';

const FaceVerificationWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.redirectTo || '/dashboard';

  const handleSuccess = () => {
    navigate(redirectTo);
  };

  return <FaceLogin onSuccess={handleSuccess} />;
};

export default FaceVerificationWrapper;