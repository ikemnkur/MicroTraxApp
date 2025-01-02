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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile, fetchWalletData } from './api';
import { useAuthCheck } from './useAuthCheck';
import axios from 'axios';
import { Autocomplete } from '@mui/material';
import moment from 'moment-timezone'; // or use Intl.supportedValuesOf('timeZone')

const API_URL = process.env.REACT_APP_API_SERVER_URL + '/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


const allTimeZones = moment.tz.names(); // ["Africa/Abidjan", "Africa/Accra", ...]
const timeZoneOptions = allTimeZones.map((tz) => tz); // or an object { label, value }


// // This is a new JavaScript API
// const allTimeZones = Intl.supportedValuesOf('timeZone'); 
// // => ["Africa/Abidjan", "Africa/Accra", "Africa/Algiers", ...]

// const timeZones = allTimeZones.map((tz) => ({
//   label: tz,
//   value: tz,
// }));

// **Sample** time zones (expand as you wish)
// const timeZones = [
//   { label: '(UTC-05:00) Eastern Time (US & Canada)', value: 'America/New_York' },
//   { label: '(UTC-06:00) Central Time (US & Canada)', value: 'America/Chicago' },
//   { label: '(UTC-07:00) Mountain Time (US & Canada)', value: 'America/Denver' },
//   { label: '(UTC-08:00) Pacific Time (US & Canada)', value: 'America/Los_Angeles' },
//   { label: '(UTC+00:00) UTC', value: 'UTC' },
// ];

const AccountPage = () => {
  useAuthCheck(); // Checks token and redirects if necessary

  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    encryptionKey: '',
    accountTier: 1,
    profilePicture: '',
    account_id: '',
    bio: '',
    // We'll store the server-provided avatar URL here
    profilePictureUrl: '',
    // Store the user's time zone value here
    timeZone: '',
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeZone, setSelectedTimeZone] = useState('');

  const [tier, setTier] = useState(1);
  const navigate = useNavigate();

  // Save userData to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userdata', JSON.stringify(userData));
  }, [userData]);

  // Fetch user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        const updatedUserData = {
          ...profile,
          birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
          accountTier: profile.accountTier || 1,
          encryptionKey: profile.encryptionKey || '',
          bio: profile.bio || '',
          profilePictureUrl: profile.profilePictureUrl || '',
          // Suppose the API returns userData.timeZone = "America/New_York"
          timeZone: profile.timeZone || '',
        };

        setUserData(updatedUserData);
        setTier(parseInt(updatedUserData.accountTier));
      } catch (error) {
        console.error('AccountPG - Error fetching user profile:', error);
        setSnackbarMessage(
          error.response?.data?.message ||
          'Failed to load user profile, refresh page or login again'
        );
        setOpenSnackbar(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  // (Optional) Fetch wallet data
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        setIsLoading(true);
        await fetchWalletData();
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

  // Handle text input changes (for most fields)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle account tier changes
  const handleTierInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };

  // Handle Time Zone input changes
  // const handleTimeZoneInputChange = (event) => {
  //   const { value } = event.target;
  //   setUserData((prevData) => ({
  //     ...prevData,
  //     timeZone: value,
  //   }));
  // };

  const handleTimeZoneChange = (event, newValue) => {
    setUserData((prev) => ({
      ...prev,
      timeZone: newValue || '',
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Show immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: file, // store the File object
        }));
      };
      reader.readAsDataURL(file);

      // Build form data for uploading
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('username', userData.username);
      formData.append('userId', userData.user_id); // Adjust if your API expects something else
      formData.append('date', new Date().toISOString());

      try {
        const response = await api.post('/upload-profile-picture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Response: ', response.data);

        // Update userData with new URL from server
        setUserData((prevData) => ({
          ...prevData,
          profilePictureUrl: response.data.url || '',
        }));
        setSnackbarMessage('Profile picture uploaded successfully!');
      } catch (error) {
        console.error('API - Error uploading user profile image:', error);
        setSnackbarMessage('An error occurred while uploading the image.');
      } finally {
        setOpenSnackbar(true);
      }
    }
  };

  // Handle account deletion
  const deleteUserAccount = async () => {
    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId: userData.id }),
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

  // Confirm account deletion
  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      localStorage.removeItem('token');
      localStorage.removeItem('userdata');
      setSnackbarMessage('Account deleted successfully.');
      setOpenSnackbar(true);
      // setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('AcntPG - Error deleting account:', error);
      setSnackbarMessage(
        error.response?.data?.message ||
        'Failed to delete account. Please try again.'
      );
      setOpenSnackbar(true);
      if (error.response?.status === 403) {
        setTimeout(() => navigate('/'), 1000);
      }
    }
    setOpenDeleteDialog(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userdata');
    setSnackbarMessage('Logged out successfully.');
    setOpenSnackbar(true);

    setTimeout(() => {
      navigate('/login');
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
        profilePicture: '',
        bio: '',
        profilePictureUrl: '',
        timezone: '',
      });
    }, 500);
  };

  // Handle account updates (Save Changes)
  const handleUpdateAccount = async (event) => {
    event.preventDefault();
    setIsUpdating(true);
    try {
      const { encryptionKey, ...profileData } = userData;
      await updateUserProfile(profileData);
      setSnackbarMessage('Account updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('AcntPG - Error updating account:', error);
      setSnackbarMessage(
        error.response?.data?.message ||
        'Failed to update account. Please try again.'
      );
      setOpenSnackbar(true);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Account
      </Typography>

      {isLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <Paper sx={{ p: 3 }}>
          {/* Profile Picture Upload Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar
              src={
                profilePicturePreview ||
                userData.profilePic ||
                '/default-avatar.png'
              }
              alt="Profile Preview"
              sx={{ width: 100, height: 100, mb: 2, margin: 'auto' }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleProfilePictureChange}
            />
            <label htmlFor="profile-picture-upload">
              <Button
                style={{ margin: '5px' }}
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
              >
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
                  InputLabelProps={{ shrink: true }}
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
              <Grid item xs={12}>
              {/* Time Zone Selection */}
              <Autocomplete
                fullWidth
                options={timeZoneOptions}
                // Optionally, you can format label vs. value:
                // options={timeZoneOptions.map((tz) => ({ label: tz, value: tz }))}

                value={userData.timeZone}
                onChange={handleTimeZoneChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Time Zone"
                    variant="outlined"
                    margin="normal"
                  />
                )}

                // value={selectedTimeZone}
                // onChange={(event, newValue) => {
                //   setSelectedTimeZone(newValue || '');
                // }}

                // // The text box for searching
                // renderInput={(params) => (
                //   <TextField
                //     {...params}
                //     label="Search Time Zone"
                //     variant="outlined"
                //   />
                // )}

                // This helps "type to search" among your array
                filterSelectedOptions
                autoHighlight
              />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControl fullWidth margin="normal" disabled={isUpdating}>
                  <InputLabel>Time Zone</InputLabel>
                  <Select
                    name="timeZone"
                    value={userData.timeZone || ''}
                    onChange={handleTimeZoneInputChange}
                    label="Time Zone"
                  >
                    {timeZones.map((tz) => (
                      <MenuItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> */}

              {/* Account Tier Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" disabled={isUpdating}>
                  <InputLabel>Account Tier</InputLabel>
                  <Select
                    name="accountTier"
                    value={userData.accountTier}
                    onChange={handleTierInputChange}
                    label="Account Tier"
                  >
                    {/* Example of data (replace with your "tiers" array) */}
                    {/* If you want to keep your existing tier structure, do so here */}
                    <MenuItem value={1}>Basic</MenuItem>
                    <MenuItem value={2}>Standard</MenuItem>
                    <MenuItem value={3}>Premium</MenuItem>
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
          <Button onClick={handleDeleteAccount} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountPage;
