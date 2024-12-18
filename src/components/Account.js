require('dotenv').config();
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
import { fetchUserProfile, updateUserProfile, fetchWalletData, fetchUploadProfilePicture} from './api';
import { useAuthCheck } from './useAuthCheck';

const AccountPage = () => {
  useAuthCheck(); // This will check the token and redirect if necessary
  const [userData, setUserData] = useState({
    id: '', // Added to store user ID
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    encryptionKey: '',
    accountTier: 1,
    profilePicture: "",
    account_id: "",
    bio: '', // Added to store biography
    profilePictureUrl: '' // Added to store the URL
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null); // To store the URL returned from the server
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tier, setTier] = useState(1);
  const navigate = useNavigate();

  // Save userData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userdata", JSON.stringify(userData));
  }, [userData]);

  // Fetch user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();

        const updatedUserData = {
          ...profile,
          birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
          accountTier: profile.accountTier || 1, // Ensure accountTier is set
          encryptionKey: profile.encryptionKey || '', // Ensure encryptionKey is set
          bio: profile.bio || '', // Ensure bio is set
          profilePictureUrl: profile.profilePictureUrl || '' // Ensure profilePictureUrl is set
        };

        setUserData(updatedUserData);
        // Removed redundant localStorage.setItem here

        console.log("Account Tier: ", updatedUserData.accountTier);
        setTier(parseInt(updatedUserData.accountTier));
      } catch (error) {
        console.error('AccountPG - Error fetching user profile:', error);
        setSnackbarMessage(error.response?.data?.message || 'Failed to load user profile, refresh page or login again');
        setOpenSnackbar(true);
        // if (error.response?.status === 401) {
        //   setTimeout(() => navigate('/login'), 1500);
        // }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  // Fetch wallet data on component mount (if applicable)
  // Assuming fetchWalletData is still relevant for this component
  // If not, you can remove this useEffect
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWalletData();
        // Process wallet data as needed
        // Example: setWalletData(data);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setSnackbarMessage('Failed to load wallet data.');
        setOpenSnackbar(true);
        setTimeout(() => navigate('/'), 1000);
      } finally {
        setIsLoading(false);
      }
    };

    loadWalletData();
  }, [navigate]);

  

  // Handle input changes for form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: name === 'accountTier' ? parseInt(value) : value
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("image vaild")
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
        setUserData(prevData => ({
          ...prevData,
          profilePicture: file // Store the file object, not the data URL
        }));
      };
      reader.readAsDataURL(file);

      // Prepare form data
      // const formData = new FormData();
      // formData.append('profilePicture', file);
      // formData.append('username', userData.username);
      // formData.append('id', userData.id);
      // formData.append('date', ;
      console.log(file)
      let formData = {
        profilePicture: JSON.stringify(file),
        file: event.target.files[0],
        username: userData.username,
        id: userData.id,
        date: new Date().toISOString(),
      }

      try {
        const response = await fetchUploadProfilePicture(formData);
        // await fetch('/upload-profile-picture', { // Adjust the endpoint as needed
        //   method: 'POST',
        //   body: formData,
        //   // Note: Do not set the 'Content-Type' header when sending FormData
        // });

        if (response.ok) {
          const data = await response.json();
          setProfilePictureUrl(data.url); // Assuming the server returns the URL
          setUserData(prevData => ({
            ...prevData,
            profilePictureUrl: data.url,
          }));
          setSnackbarMessage('Profile picture uploaded successfully!');
        } else {
          const errorData = await response.json();
          setSnackbarMessage(errorData.message || 'Failed to upload profile picture.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setSnackbarMessage('An error occurred while uploading the image.');
      } finally {
        setOpenSnackbar(true);
      }
    }
  };

  // Implement the deleteUserAccount function
  const deleteUserAccount = async () => {
    try {
      const response = await fetch('/api/delete-account', { // Ensure this endpoint exists
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token if required
        },
        body: JSON.stringify({ userId: userData.id }) // Adjust according to your backend requirements
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account.');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  };

  // Account tiers data
  const tiers = [
    { id: 1, name: 'Basic', limit: 2000, fee: 30 },
    { id: 2, name: 'Standard', limit: 5000, fee: 65 },
    { id: 3, name: 'Premium', limit: 10000, fee: 125 },
    { id: 4, name: 'Gold', limit: 20000, fee: 250 },
    { id: 5, name: 'Platinum', limit: 40000, fee: 350 },
    { id: 6, name: 'Diamond', limit: 50000, fee: 400 },
    { id: 7, name: 'Ultimate', limit: 100000, fee: 500 },
  ];

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount(); // Ensure this function is correctly implemented
      localStorage.removeItem('token');
      localStorage.removeItem('userdata'); // Clear user data
      setSnackbarMessage('Account deleted successfully.');
      setOpenSnackbar(true);
      // setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('AcntPG - Error deleting account:', error);
      setSnackbarMessage(error.response?.data?.message || 'Failed to delete account. Please try again.');
      setOpenSnackbar(true);
      if (error.response?.status === 403) {
        // Unauthorized, token might be expired
        setTimeout(() => navigate('/'), 1000);
      }
    }
    setOpenDeleteDialog(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userdata'); // Clear user data
    
    setSnackbarMessage('Logged out successfully.');
    setOpenSnackbar(true);
    // In a real app, you'd want to clear user session/tokens here
    setTimeout(() => {
      navigate('/login')
      setUserData({
            id: '',
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            birthDate: '',
            encryptionKey: '',
            accountTier: 1,
            profilePicture: "",
            bio: '',
            profilePictureUrl: ''
          });
    }, 500);
  };

  // Handle account updates
  const handleUpdateAccount = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setIsUpdating(true);
    try {
      // Optionally, exclude certain fields before sending
      const { encryptionKey, ...profileData } = userData;

      await updateUserProfile(profileData); // Ensure the backend expects the correct data
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
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Account </Typography>
      {isLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <Paper sx={{ p: 3 }}>
          {/* Profile Picture Upload Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar
              src={profilePictureUrl || profilePicturePreview || '/default-avatar.png'} // Ensure a default avatar exists at this path
              alt="Profile Preview"
              sx={{ width: 130, height: 130, mb: 2, margin: 'auto', padding: "5px" }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleProfilePictureChange}
            />
            <label htmlFor="profile-picture-upload">
              <Button style={{margin: "5px"}} variant="contained" component="span" startIcon={<PhotoCamera />}>
                Upload Profile Picture
              </Button>
            </label>
          </Box>

          {/* Update Profile Form */}
          <form onSubmit={handleUpdateAccount}>
            <Grid container spacing={2}>
              {/* Username and Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="username"
                  label="Username"
                  disabled={isUpdating}
                  value={userData.username}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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

              {/* First Name and Last Name */}
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

              {/* Phone Number and Birth Date */}
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

              {/* Biography */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="bio"
                  label="Biography"
                  disabled={isUpdating}
                  value={userData.bio || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                />
              </Grid>

              {/* Encryption Key */}
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

              {/* Account Tier Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" disabled={isUpdating}>
                  <InputLabel>Account Tier</InputLabel>
                  <Select
                    name="accountTier"
                    value={userData.accountTier}
                    onChange={handleInputChange}
                    label="Account Tier"
                  >
                    {tiers.map((tierItem) => (
                      <MenuItem key={tierItem.id} value={tierItem.id}>
                        {`${tierItem.name} - Wallet Limit: ₡${tierItem.limit.toLocaleString()}, Monthly Fee: ₡${tierItem.fee}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setOpenDeleteDialog(true)}
                  sx={{ mr: 1 }}
                  disabled={isUpdating}
                >
                  Delete Account
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  disabled={isUpdating}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
        )}
        {/* Snackbar for user feedback */}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
        />

        {/* Delete Account Confirmation Dialog */}
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
