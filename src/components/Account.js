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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile } from './api';
// // In Dashboard.js, AccountPage.js, and other protected components
import { useAuthCheck } from './useAuthCheck';


const AccountPage = () => {
  useAuthCheck(); // This will check the token and redirect if necessary
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    encryptionKey: '',
    accountTier: 1,
    profilePicture: ""
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tier, setTier] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("userdata", JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();

        const updatedUserData = {
          ...profile,
          birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
          accountTier: profile.accountTier || 1, // Ensure accountTier is set
          encryptionKey: profile.encryptionKey || '' // Ensure encryptionKey is set
        };

        setUserData(updatedUserData);
        localStorage.setItem("userdata", JSON.stringify(updatedUserData));

        console.log("Account Tier: ", updatedUserData.accountTier);
        setTier(parseInt(updatedUserData.accountTier));
      } catch (error) {
        console.error('DashBrdPG - Error fetching user profile:', error);
        setSnackbarMessage(error.response?.data?.message || 'Failed to load user profile, refresh page or login again');
        setOpenSnackbar(true);
        if (error.response?.status === 401) {
          setTimeout(() => navigate('/login'), 1500);
        }
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: name === 'accountTier' ? parseInt(value) : value
    }));
  };

  // useEffect(() => {
  //   const loadUserProfile = async () => {
  //     try {
  //       const profile = await fetchUserProfile();
  //       // Map accountTierId to a number between 1 and 7
  //       const accountTierMap = {
  //         1: 1, // Basic
  //         2: 2, // Standard
  //         3: 3, // Premium
  //         4: 4, // Gold
  //         5: 5, // Platinum
  //         6: 6, // Diamond
  //         7: 7  // Ultimate
  //       };

  //       const updatedUserData = {
  //         ...profile,
  //         // accountTier: accountTierMap[userData.accountTier] ?? 1, // Default to 1 if not found
  //         birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
  //       };

  //       setUserData(updatedUserData);
  //       localStorage.setItem("userdata", JSON.stringify(updatedUserData));

  //       console.log("Account Tier: ", profile.accountTier);
  //       setTier(parseInt(userData.accountTier));
  //       console.log("Tier#: ", tier)

  //     } catch (error) {
  //       console.error('DashBrdPG - Error fetching user profile:', error);
  //       setSnackbarMessage(error.response?.data?.message || 'Failed to load user profile, refresh page or login again');
  //       setOpenSnackbar(true);
  //       if (error.response?.status === 401) {
  //         // Unauthorized, token might be expired
  //         setTimeout(() => navigate('/login'), 1500);
  //       }
  //     }
  //   };

  //   loadUserProfile();
  // }, [navigate]);

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setUserData(prevData => ({
  //     ...prevData,
  //     [name]: value
  //   }));
  // };


  // const handleProfilePictureChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setUserData(prevData => ({
  //         ...prevData,
  //         profilePicture: reader.result
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
        setUserData(prevData => ({
          ...prevData,
          profilePicture: file // Store the file object, not the data URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  async function deleteUserAccount() {

  }

  const tiers = [
    { id: 1, name: 'Basic', limit: 100, fee: 0 },
    { id: 2, name: 'Standard', limit: 500, fee: 5 },
    { id: 3, name: 'Premium', limit: 1000, fee: 10 },
    { id: 4, name: 'Gold', limit: 5000, fee: 20 },
    { id: 5, name: 'Platinum', limit: 10000, fee: 35 },
    { id: 6, name: 'Diamond', limit: 50000, fee: 50 },
    { id: 7, name: 'Ultimate', limit: 100000, fee: 75 },
  ];

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount(); // You'll need to implement this function in your API
      localStorage.removeItem('token');
      setSnackbarMessage('Account deleted successfully.');
      setOpenSnackbar(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('AcntPG - Error deleting account:', error);
      setSnackbarMessage(error.response?.data?.message || 'Failed to delete account. Please try again.');
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSnackbarMessage('Logged out successfully.');
    setOpenSnackbar(true);
    // In a real app, you'd want to clear user session/tokens here
    setTimeout(() => navigate('/login'), 1500);
  };

  const handleUpdateAccount = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setIsUpdating(true);
    try {
      await updateUserProfile(userData);
      setSnackbarMessage('Account updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('AcntPG - Error updating account:', error);
      setSnackbarMessage(error.response?.data?.message || 'Failed to update account. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Account Settings</Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleUpdateAccount}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={userData.profilePicture}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                // value={""}
                onChange={handleProfilePictureChange}
              />
              <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </Grid> */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={profilePicturePreview || userData.profilePicture}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="icon-button-file"
                type="file"
                onChange={handleProfilePictureChange}
              />
              <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <TextField
                fullWidth
                margin="normal"
                name="username"
                label="Username"
                disabled={isUpdating}
                value={userData.username}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                name="email"
                label="Email"
                type="email"
                disabled={isUpdating}
                value={userData.email}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="firstName"
                label="First Name"
                disabled={isUpdating}
                value={userData.firstName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="lastName"
                label="Last Name"
                disabled={isUpdating}
                value={userData.lastName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="phoneNumber"
                label="Phone Number"
                disabled={isUpdating}
                value={userData.phoneNumber}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                name="birthDate"
                label="Birth Date"
                type="date"
                disabled={isUpdating}
                value={userData.birthDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={24}>
              <TextField
                fullWidth
                margin="normal"
                name="bio"
                label="Biograhpy"
                disabled={isUpdating}
                value={userData.bio}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                name="encryptionKey"
                label="Encryption Key"
                disabled={isUpdating}
                value={userData.encryptionKey}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Account Tier</InputLabel>
                <Select
                  name="accountTier"
                  value={userData.accountTier}
                  onChange={handleInputChange}
                  label="Account Tier"
                >
                  {tiers.map((tier) => (
                    <MenuItem key={tier.id} value={tier.id}>
                      {`${tier.name} - Daily Limit: $${tier.limit.toLocaleString()}, Monthly Fee: $${tier.fee}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isUpdating}
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
        </form>

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