import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, TextField, Button, Box, CircularProgress, Snackbar, Paper,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Modal, IconButton, Grid, Rating
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Auth from './Auth';
import {
  LockOpenRounded, Star, ThumbDownAlt, ThumbUp, ThumbUpOutlined,
  ThumbDownAltOutlined, Visibility
} from '@mui/icons-material';
import { fetchUserProfile } from './api';

const UnlockContent = () => {
  const { itemid } = useParams();
  const navigate = useNavigate();
  const [contentData, setContentData] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  // Notification & Dialog states
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  // Maintain user profile data (make sure you include user_id)
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    encryptionKey: '',
    accountTier: 1,
    profilePicture: null,
    user_id: null, // important for identifying the currently logged-in user
  });

  // Track likes, dislikes, views, rating, etc.
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userLikeStatus, setUserLikeStatus] = useState(0); // 1: liked, -1: disliked, 0: none

  // For building notification data before submission
  const [notificationData, setNotificationData] = useState(null);

  const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000';

  // Create notification by sending notificationData to backend
  const createNotification = async (notifBody) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_URL + '/notifications/create-unlock', notifBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('New notification:', notifBody.message);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Load user profile from server
  const loadUserProfile = async () => {
    try {
      const profile = await fetchUserProfile();
      const updatedUserData = {
        ...profile,
        birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
      };
      setUserData(updatedUserData);
      localStorage.setItem('userdata', JSON.stringify(updatedUserData));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setSnackbarMessage(error.response?.data?.message || 'Failed to load user profile. Please refresh or login again.');
      if (error.response?.status === 401) {
        setTimeout(() => navigate('/login'), 500);
      }
    }
  };

  // Fetch content data and handle initial logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Get content info
        const contentResponse = await axios.get(`${API_URL}/api/unlock/unlock-content/${itemid}`);
        const content = contentResponse.data;
        setContentData(content);

        setLikes(content.likes || 0);
        setDislikes(content.dislikes || 0);
        setViews(content.views || 0);
        setRating(content.rating || 0);

        // 2) Check if user is logged in
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const balanceResponse = await axios.get(`${API_URL}/api/wallet`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserBalance(balanceResponse.data.balance);
            setIsLoggedIn(true);
          }
        } catch {
          setIsLoggedIn(false);
        }

        // 3) If logged in, load user profile & user rating
        if (isLoggedIn) {
          await loadUserProfile();
          try {
            const token = localStorage.getItem('token');
            const ratingResp = await axios.get(
              `${API_URL}/api/unlock/user-rating/${content.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserLikeStatus(ratingResp.data.like_status || 0);
            setUserRating(ratingResp.data.rating || 0);
          } catch (error) {
            console.error('Failed to fetch user rating:', error);
          }
        }

        // 4) Increment view count
        await axios.post(
          `${API_URL}/api/unlock/add-view`,
          { contentId: content.id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setViews((prev) => prev + 1);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setIsLoggedIn(false);
        } else {
          setError('Failed to load data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Warn user if they leave after unlocking
    const handleBeforeUnload = (e) => {
      if (unlocked) {
        e.preventDefault();
        e.returnValue = 'Go to the unlocked content section in your Stuff Tab';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [itemid, unlocked, isLoggedIn, API_URL]);

  // User initiates unlock
  const handleUnlock = () => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    if (userBalance < (contentData?.cost || 0)) {
      setSnackbarMessage('Insufficient balance. Please reload your wallet.');
      return;
    }
    setOpenDialog(true);
  };

  // Confirm unlock after user sees the dialog
  const confirmUnlock = async () => {
    try {
      const token = localStorage.getItem('token');
      alert('You will need to confirm your login credentials. This helps reduce spam or abuse.');
      await axios.post(
        `${API_URL}/api/unlock/unlock-content`,
        { contentId: contentData.id, message: message, user_id: userData.user_id, type: 'Unlock',
          recipient_user_id: contentData.host_user_id, // The content owner's user ID
          recipient_username: contentData.host_username,
          Nmessage: `User "${userData.username}" unlocked your content "${contentData.title}" and you earned ₡${contentData.cost}.`,
          from_user: userData.user_id, // The current user's ID
          date: new Date(), },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnlocked(true);
      setUserBalance((prev) => prev - contentData.cost);
      setSnackbarMessage('Content unlocked successfully!');

      // Build the notification if the content has a host user
      if (contentData.host_user_id) {
        const newNotification = {
          type: 'Unlock',
          recipient_user_id: contentData.host_user_id, // The content owner's user ID
          recipient_username: contentData.host_username,
          message: `User "${userData.username}" unlocked your content "${contentData.title}" and you earned ₡${contentData.cost}.`,
          from_user: userData.user_id, // The current user's ID
          date: new Date(),
        };
        setNotificationData(newNotification);
        await createNotification(newNotification);
      }
    } catch (err) {
      setSnackbarMessage('Failed to unlock content. Please try again.');
    } finally {
      setOpenDialog(false);
    }
  };

  const renderContent = () => {
    if (!contentData) return null;
    switch (contentData.type) {
      case 'url':
        return (
          <a href={contentData.content.content} target="_blank" rel="noopener noreferrer">
            Access Content
          </a>
        );
      case 'image':
        return (
          <img
            src={contentData.content.content}
            alt={contentData.title}
            style={{ maxWidth: '100%' }}
          />
        );
      case 'text':
      case 'code':
      case 'video':
        return <Typography>{contentData.content.content}</Typography>;
      case 'file':
        return (
          <a href={contentData.content.content} download>
            Download File
          </a>
        );
      default:
        return <Typography>Content type not supported</Typography>;
    }
  };

  // Handle successful login (close login modal and refresh balance)
  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setOpenLoginModal(false);
    const token = localStorage.getItem('token');
    const balanceResponse = await axios.get(`${API_URL}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserBalance(balanceResponse.data.balance);
  };

  // Like and dislike handlers
  const handleLike = async () => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      alert('Please log in again to prevent spam/abuse.');
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/unlock/add-like`,
        { contentId: contentData.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (response.data.message === 'Content liked successfully') {
        setLikes((prev) => prev + 1);
        if (userLikeStatus === -1) {
          setDislikes((prev) => prev - 1);
        }
        setUserLikeStatus(1);
      } else if (response.data.message === 'Like removed') {
        setLikes((prev) => prev - 1);
        setUserLikeStatus(0);
      }
    } catch (error) {
      setSnackbarMessage('Failed to like content.');
    }
  };

  const handleDislike = async () => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      alert('Please log in again to prevent spam/abuse.');
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/unlock/add-dislike`,
        { contentId: contentData.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (response.data.message === 'Content disliked successfully') {
        setDislikes((prev) => prev + 1);
        if (userLikeStatus === 1) {
          setLikes((prev) => prev - 1);
        }
        setUserLikeStatus(-1);
      } else if (response.data.message === 'Dislike removed') {
        setDislikes((prev) => prev - 1);
        setUserLikeStatus(0);
      }
    } catch (error) {
      setSnackbarMessage('Failed to dislike content.');
    }
  };

  const handleRatingChange = async (event, newValue) => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      alert('Please log in again to prevent spam/abuse.');
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/unlock/add-rating`,
        { contentId: contentData.id, rating: newValue },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUserRating(newValue);
    } catch (error) {
      setSnackbarMessage('Failed to submit rating.');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Unlock Content
      </Typography>

      {/* Basic info about the content */}
      <Paper style={{ backgroundColor: 'lightblue', padding: '10px' }}>
        <Typography variant="h5" gutterBottom>
          Title: {contentData.title}
        </Typography>
        <Typography variant="h5" gutterBottom>
          By: {contentData.host_username}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Description: {contentData.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Cost: ₡{contentData.cost}
        </Typography>
        {isLoggedIn && (
          <Typography variant="body1" gutterBottom>
            Balance: ₡{userBalance}
          </Typography>
        )}
      </Paper>

      {/* Content stats */}
      <Paper style={{ backgroundColor: '#DEEFFF', padding: '10px', marginTop: '20px' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item>
            <Visibility /> {views}
          </Grid>
          <Grid item>
            <LockOpenRounded /> {contentData.unlocks || 0}
          </Grid>
          <Grid item>
            <ThumbUp /> {likes}
          </Grid>
          <Grid item>
            <ThumbDownAlt /> {dislikes}
          </Grid>
          <Grid item>
            <Star /> {rating.toFixed(1)}
          </Grid>
        </Grid>
      </Paper>

      {/* Unlock Button or Unlocked Content */}
      {!unlocked ? (
        <>
          <div style={{ marginTop: '30px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Leave a Message:
            </Typography>
            <TextField
              label="Leave a Message"
              fullWidth
              margin="normal"
              placeholder={`Enjoy: ₡${contentData.cost}!`}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleUnlock}>
              Unlock Content
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Unlocked Content
            </Typography>
            {renderContent()}
          </Paper>

          <Paper style={{ backgroundColor: 'lightgray', padding: '10px', marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom align="center">
              Like and Rate Content
            </Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item>
                <Button
                  variant={userLikeStatus === 1 ? 'contained' : 'outlined'}
                  startIcon={userLikeStatus === 1 ? <ThumbUp /> : <ThumbUpOutlined />}
                  onClick={handleLike}
                >
                  {likes}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant={userLikeStatus === -1 ? 'contained' : 'outlined'}
                  startIcon={userLikeStatus === -1 ? <ThumbDownAlt /> : <ThumbDownAltOutlined />}
                  onClick={handleDislike}
                >
                  {dislikes}
                </Button>
              </Grid>
              <Grid item>
                <Typography component="legend">Rate:</Typography>
                <Rating
                  name="content-rating"
                  value={userRating}
                  onChange={handleRatingChange}
                />
              </Grid>
            </Grid>
          </Paper>
        </>
      )}

      {/* Unlock Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Unlock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unlock this content for ₡{contentData.cost}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmUnlock} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login Modal */}
      <Modal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <Box
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', width: 400,
            bgcolor: 'background.paper', boxShadow: 24, p: 4, outline: 'none',
          }}
        >
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setOpenLoginModal(false)}
          >
            <CloseIcon />
          </IconButton>
          <Auth isLogin={true} onLoginSuccess={handleLoginSuccess} />
        </Box>
      </Modal>

      {/* Snackbar for messages */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UnlockContent;