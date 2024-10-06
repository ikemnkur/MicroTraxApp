import React, { useState } from 'react';
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

const Auth = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  var x = ( process.env.REACT_APP_API_SERVER_URL  === undefined) ? "http://localhost:5000" : process.env.REACT_APP_API_SERVER_URL;
  
  const API_URL = x
 
  

  console.log(API_URL)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { username, email, password };
      
      const link = API_URL + `${endpoint}`
      console.log("link: "+ API_URL)

      const response = await axios.post(link, payload);
      
      localStorage.setItem('token', response.data.token);
      // Store user info or update global state here
      navigate('/'); // Redirect to dashboard
    } catch (error) {
      console.error('Auth error:', error.response?.data?.message || 'An error occurred');
      // Handle error (show message to user)
    }
  };

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
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to={isLogin ? '/register' : '/login'}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Auth;