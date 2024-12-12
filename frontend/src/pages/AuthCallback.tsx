import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GITHUB_API_URL, API_POST_ENDPOINT_LOGIN } from '../constants';
import { toast } from 'react-toastify';

const AuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // GitHub login function
  const githubLogin = async (authCode: string) => {
    try {
      const response = await axios.post(API_POST_ENDPOINT_LOGIN, { code: authCode });
      console.log("GitHub Login Successful:", response.data);
      navigate("/config-mgmt");
      toast.success("Github Login successful!");
    } catch (error) {
      console.error("GitHub Login Error:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      githubLogin(code);
      axios.post(GITHUB_API_URL, { code })
        .then((response) => {
          console.log('GitHub user data:', response.data);
        })
        .catch((error) => {
          console.error('Error during GitHub login:', error);
        });
    } else {
      console.error('No GitHub code found in the URL');
    }
  }, [location]);

  return <div>Processing GitHub login...</div>;
};

export default AuthCallback;