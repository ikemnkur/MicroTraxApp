// useAuthCheck.js
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Ensure you've installed this: npm install jwt-decode

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // List of paths where we don't want to redirect even if the user is not authenticated
    const exemptedPaths = ['/unlock'];

    // Check if current path starts with '/unlock', to handle dynamic unlock paths like '/unlock/:itemid'
    const isExempted = exemptedPaths.some(path => location.pathname.startsWith(path));

    if (isExempted) {
      // Do not redirect; user can stay on the unlock page
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        // Token has expired
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate, location.pathname]);
};

export default useAuthCheck;
