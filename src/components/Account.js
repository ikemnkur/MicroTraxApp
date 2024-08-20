import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  Box,
  TextField,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

const AccountPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    encryptionKey: '',
    accountTier: 1,
    profilePicture: null
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Mock fetching user data
    const mockUserData = {
      username: 'johndoe',
      email: 'johndoe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123-456-7890',
      birthDate: '1990-01-01',
      encryptionKey: 'abc123xyz789',
      accountTier: 2,
      profilePicture: 'https://mui.com/static/images/avatar/1.jpg'
    };
    setUserData(mockUserData);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prevData => ({
          ...prevData,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Updating user data:', userData);
    setSnackbarMessage('Account updated successfully!');
    setOpenSnackbar(true);
  };

  const tiers = [
    { id: 1, name: 'Basic', limit: 100, fee: 0 },
    { id: 2, name: 'Standard', limit: 500, fee: 5 },
    { id: 3, name: 'Premium', limit: 1000, fee: 10 },
    { id: 4, name: 'Gold', limit: 5000, fee: 20 },
    { id: 5, name: 'Platinum', limit: 10000, fee: 35 },
    { id: 6, name: 'Diamond', limit: 50000, fee: 50 },
    { id: 7, name: 'Ultimate', limit: 100000, fee: 75 },
  ];
  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    setOpenDeleteDialog(false);
    setSnackbarMessage('Account deleted successfully.');
    setOpenSnackbar(true);
    // In a real app, you'd want to navigate to a logout page or home page after a short delay
    setTimeout(() => navigate('/'), 3000);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setSnackbarMessage('Logged out successfully.');
    setOpenSnackbar(true);
    // In a real app, you'd want to clear user session/tokens here
    setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Account Settings</Typography>
      <Paper sx={{ p: 2 }}>
        {/* ... (previous form content remains the same) */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
          <Box>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenDeleteDialog(true)}
              sx={{ mr: 1 }}
            >
              Delete Account
            </Button>
            <Button
              variant="outlined"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountPage;