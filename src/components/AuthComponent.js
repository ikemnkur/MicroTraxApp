import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Box, 
  Switch, 
  FormControlLabel,
  Avatar,
  Snackbar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Logging in with:', { email, password });
      setSnackbarMessage('Login successful!');
    } else {
      if (password !== confirmPassword) {
        setSnackbarMessage('Passwords do not match!');
        setOpenSnackbar(true);
        return;
      }
      console.log('Signing up with:', { username, email, password });
      setSnackbarMessage('Sign up successful!');
    }
    setOpenSnackbar(true);
    // Reset form
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
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
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={!isLogin} 
                  onChange={() => setIsLogin(!isLogin)} 
                  color="primary"
                />
              }
              label={isLogin ? "Sign Up" : "Login"}
              labelPlacement="start"
            />
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AuthComponent;