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
  DialogTitle,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip
} from '@mui/material';
import { 
  PhotoCamera, 
  ArrowUpward, 
  ArrowDownward 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile, fetchWalletData } from './api';
import { useAuthCheck } from './useAuthCheck';
import axios from 'axios';
import { Autocomplete } from '@mui/material';
import moment from 'moment-timezone';

const API_URL = process.env.REACT_APP_API_SERVER_URL + '/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Organized time zones with region grouping and offset information
const organizeTimeZones = () => {
  const allTimeZones = moment.tz.names();
  
  // Group time zones by region
  const groupedTimeZones = allTimeZones.reduce((acc, tz) => {
    const now = moment().tz(tz);
    const offset = now.format('Z');
    const region = tz.split('/')[0];
    
    if (!acc[region]) {
      acc[region] = [];
    }
    
    acc[region].push({
      value: tz,
      label: `(${offset}) ${tz.replace('_', ' ')}`,
      offset: now.utcOffset()
    });
    
    return acc;
  }, {});
  
  // Sort each region by offset
  Object.keys(groupedTimeZones).forEach(region => {
    groupedTimeZones[region].sort((a, b) => a.offset - b.offset);
  });
  
  // Create a flat array of time zones with group headers
  const flatTimeZones = [];
  Object.keys(groupedTimeZones).sort().forEach(region => {
    flatTimeZones.push({
      value: region,
      label: region,
      isGroupHeader: true
    });
    
    flatTimeZones.push(...groupedTimeZones[region]);
  });
  
  return flatTimeZones;
};

const timeZoneOptions = organizeTimeZones();

// Account tier information
const tierInfo = {
  1: { name: 'Basic', features: ['Limited access', '5 entries per day', 'Standard support'] },
  2: { name: 'Standard', features: ['Full access', '15 entries per day', 'Priority email support'] },
  3: { name: 'Premium', features: ['Full access', 'Unlimited entries', '24/7 support', 'Advanced analytics'] },
  4: { name: 'Gold', features: ['Everything in Premium', 'API access', 'Dedicated account manager'] },
  5: { name: 'Platinum', features: ['Everything in Gold', 'Custom integrations', 'Weekly strategy calls'] },
  6: { name: 'Diamond', features: ['Everything in Platinum', 'White label options', 'Enterprise solutions'] },
  7: { name: 'Ultimate', features: ['Everything in Diamond', 'Custom development', 'Board level reporting'] }
};

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
    profilePictureUrl: '',
    timeZone: '',
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);

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
          timeZone: profile.timeZone || '',
        };

        setUserData(updatedUserData);
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

  // Handle Time Zone input changes
  const handleTimeZoneChange = (event, newValue) => {
    if (!newValue || newValue.isGroupHeader) return;
    
    setUserData((prev) => ({
      ...prev,
      timeZone: newValue.value || '',
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

  // Handle upgrade/downgrade tier
  const handleUpgradeTier = () => {
    if (userData.accountTier < 7) {
      navigate('/upgrade-account', { 
        state: { 
          currentTier: userData.accountTier,
          nextTier: userData.accountTier + 1 
        } 
      });
    } else {
      setSnackbarMessage('You are already at the highest tier!');
      setOpenSnackbar(true);
    }
  };

  const handleDowngradeTier = () => {
    if (userData.accountTier > 1) {
      navigate('/downgrade-account', { 
        state: { 
          currentTier: userData.accountTier,
          nextTier: userData.accountTier - 1 
        } 
      });
    } else {
      setSnackbarMessage('You are already at the lowest tier!');
      setOpenSnackbar(true);
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
        timeZone: '',
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

  // Custom grouping for time zone options
  const renderTimeZoneOption = (props, option) => {
    if (option.isGroupHeader) {
      return (
        <Box component="li" {...props} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', pointerEvents: 'none' }}>
          {option.label}
        </Box>
      );
    }
    return (
      <Box component="li" {...props}>
        {option.label}
      </Box>
    );
  };

  // Find the current time zone object from the options
  const currentTimeZoneObj = timeZoneOptions.find(
    option => !option.isGroupHeader && option.value === userData.timeZone
  );

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

          {/* Account Tier Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Account Tier: {tierInfo[userData.accountTier].name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowUpward />}
                onClick={handleUpgradeTier}
                disabled={userData.accountTier >= 7}
              >
                Upgrade Tier
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ArrowDownward />}
                onClick={handleDowngradeTier}
                disabled={userData.accountTier <= 1}
              >
                Downgrade Tier
              </Button>
            </Box>
          </Box>

          {/* Tier Overview */}
          {/* <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              All Account Tiers
            </Typography>
            <Box sx={{ display: 'flex', overflowX: 'auto', py: 2, gap: 2 }}>
              {Object.entries(tierInfo).map(([tierLevel, tier]) => {
                const tierNum = parseInt(tierLevel);
                const isCurrent = tierNum === userData.accountTier;
                const isUpgrade = tierNum > userData.accountTier;
                const isDowngrade = tierNum < userData.accountTier;
                
                return (
                  <Card 
                    key={tierLevel} 
                    sx={{ 
                      minWidth: 200,
                      border: isCurrent ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      backgroundColor: isCurrent ? '#e3f2fd' : 'white'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {tier.name}
                        {isCurrent && (
                          <Chip 
                            label="Current" 
                            size="small" 
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {tier.price}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ height: 80, overflow: 'auto' }}>
                        {tier.features.slice(0, 2).join(', ')}
                        {tier.features.length > 2 && '...'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {isUpgrade && (
                        <Button 
                          size="small" 
                          fullWidth
                          variant="outlined"
                          color="primary"
                          onClick={() => navigate('/upgrade-account', { 
                            state: { currentTier: userData.accountTier, nextTier: tierNum } 
                          })}
                        >
                          Upgrade To
                        </Button>
                      )}
                      {isDowngrade && (
                        <Button 
                          size="small" 
                          fullWidth
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate('/downgrade-account', { 
                            state: { currentTier: userData.accountTier, nextTier: tierNum } 
                          })}
                        >
                          Downgrade To
                        </Button>
                      )}
                      {isCurrent && (
                        <Button 
                          size="small" 
                          fullWidth
                          disabled
                        >
                          Current Tier
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                );
              })}
            </Box>
          </Box> */}

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

              {/* Improved Time Zone Selection */}
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={timeZoneOptions}
                  value={currentTimeZoneObj || null}
                  onChange={handleTimeZoneChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Time Zone"
                      variant="outlined"
                      margin="normal"
                      helperText="Search by region, city, or UTC offset"
                    />
                  )}
                  renderOption={renderTimeZoneOption}
                  groupBy={(option) => option.isGroupHeader ? option.label : ''}
                  getOptionLabel={(option) => option.label || ''}
                  filterSelectedOptions
                  autoHighlight
                  disableListWrap
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                />
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