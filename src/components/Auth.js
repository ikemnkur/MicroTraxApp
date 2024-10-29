// src/components/Auth.jsx
require('dotenv').config();
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Avatar,
  Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';
import DotCaptcha from './DotCaptcha'; // Import the DotCaptcha component

const Auth = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [captchaFailed, setCaptchaFailed] = useState(false);
  const [blockTime, setBlockTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null); // Add this line

  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_SERVER_URL || "http://localhost:5000";

  // Function to check block status
  const checkBlockStatus = useCallback(() => {
    const blockData = localStorage.getItem('captchaBlock');
    if (blockData) {
      const { timestamp } = JSON.parse(blockData);
      const currentTime = Date.now();
      if (currentTime - timestamp < 30 * 60 * 1000) { // 0.5 hour
        setBlockTime(timestamp + 30 * 60 * 1000);
      } else {
        localStorage.removeItem('captchaBlock');
      }
    }
  }, []);

  // Function to handle unblocking
  const handleUnblock = useCallback(() => {
    setBlockTime(null);
    setRemainingTime(null); // Reset remaining time
    localStorage.removeItem('captchaBlock');
    localStorage.removeItem('failedCaptcha'); // Reset failed attempts
  }, []);

  // Check if user is blocked on mount
  useEffect(() => {
    checkBlockStatus();
  }, [checkBlockStatus]);

  // Set up a timer to unblock the user after blockTime and update remaining time
  useEffect(() => {
    if (blockTime) {
      const updateRemainingTime = () => {
        const remaining = Math.max(0, Math.ceil((blockTime - Date.now()) / 1000));
        setRemainingTime(remaining);
      };

      updateRemainingTime(); // Initial call to set the remaining time
      const timer = setInterval(() => {
        updateRemainingTime();
        const currentTime = Date.now();
        if (currentTime >= blockTime) {
          handleUnblock();
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [blockTime, handleUnblock]);

  // Handler for successful CAPTCHA
  const handleCaptchaSuccess = useCallback(() => {
    setCaptchaPassed(true);
    setCaptchaFailed(false);
  }, []);

  // Handler for failed CAPTCHA
  const handleCaptchaFailure = useCallback(() => {
    const failedAttempts = parseInt(localStorage.getItem('failedCaptcha') || '0', 10) + 1;
    localStorage.setItem('failedCaptcha', failedAttempts);
    if (failedAttempts >= 3) { // Changed from 4 to 3
      localStorage.setItem('captchaBlock', JSON.stringify({ timestamp: Date.now() }));
      setBlockTime(Date.now() + 60 * 60 * 1000); // Block for 1 hour
      setCaptchaFailed(true);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaPassed) {
      alert('Please complete the CAPTCHA correctly before submitting.');
      return;
    }
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { username, email, password };
      
      const link = `${API_URL}${endpoint}`;
      console.log("link: "+ link);

      const response = await axios.post(link, payload);
      
      localStorage.setItem('token', response.data.token);
      // Optionally, clear failed CAPTCHA attempts on success
      localStorage.removeItem('failedCaptcha');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Auth error:', error.response?.data?.message || 'An error occurred');
      alert(error.response?.data?.message || 'An error occurred during authentication.');
    }
  };

  if (blockTime) {
    const remaining = remainingTime !== null
      ? remainingTime
      : Math.max(0, Math.ceil((blockTime - Date.now()) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return (
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8
        }}
      >
        <Card sx={{ maxWidth: 400, width: '100%', textAlign: 'center', padding: 2 }}>
          <CardContent>
            <Typography variant="h6" color="error">
              Too many failed attempts.
            </Typography>
            <Typography variant="body1">
              Please try again in {minutes} minute{minutes !== 1 ? 's' : ''} and {seconds} second{seconds !== 1 ? 's' : ''}.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardHeader 
          title={isLogin ? "Login" : "Sign Up"} 
          sx={{ textAlign: 'center' }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
              disabled={!captchaPassed}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to={isLogin ? '/register' : '/login'}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Link>
          </Box>
          {!captchaPassed && (
            <DotCaptcha 
              onSuccess={handleCaptchaSuccess} 
              onFailure={handleCaptchaFailure} 
            />
          )}
          {captchaFailed && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
              You have been blocked due to multiple failed CAPTCHA attempts. Please try again later.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Auth;
