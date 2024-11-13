// src/components/UnlockContent.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, TextField, Button, Box, CircularProgress, Snackbar, Paper,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Input, Modal, IconButton, Grid, Rating
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Auth from './Auth';
import {
  HeartBrokenRounded, LockOpenRounded, Star, ThumbDownAlt, ThumbUp, ThumbUpOutlined,ThumbDownAltOutlined, Visibility
} from '@mui/icons-material';

const UnlockContent = () => {
  const { itemid } = useParams();
  const navigate = useNavigate();
  const [contentData, setContentData] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  // New states for likes, dislikes, views, and ratings
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [views, setViews] = useState(0);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

  // New state variables
  const [userLikeStatus, setUserLikeStatus] = useState(0); // 1: liked, -1: disliked, 0: none

  const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch content data
        const contentResponse = await axios.get(`${API_URL}/api/unlock/unlock-content/${itemid}`);
        const content = contentResponse.data;
        setContentData(content);
        console.log("Content: ", content)

        // Set initial values for likes, dislikes, views, and rating
        setLikes(content.likes || 0);
        setDislikes(content.dislikes || 0);
        setViews(content.views || 0);
        setRating(content.rating || 0);

        // Check login status via wallet balance
        try {
          const token = localStorage.getItem('token');
          if (token) {
            // User is logged in, fetch balance
            const balanceResponse = await axios.get(`${API_URL}/api/wallet`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserBalance(balanceResponse.data.balance);
            setIsLoggedIn(true);
          }
        } catch (error) {
          setIsLoggedIn(false);
        }

        try {
          if (isLoggedIn) {
            // Fetch user's like/dislike status
            const token = localStorage.getItem('token');
            const [ratingResponse] = await axios.get(
              `${API_URL}/api/unlock/user-rating/${content.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserLikeStatus(ratingResponse.data.like_status || 0);
            setUserRating(ratingResponse.data.rating || 0);
          }
        } catch {
          setIsLoggedIn(false);
        }

        // Increment view count
        await axios.post(
          `${API_URL}/api/unlock/add-view`,
          { contentId: content.id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setViews((prevViews) => prevViews + 1);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setIsLoggedIn(false);
        } else {
          setError('Failed to load data');
        }
      } finally {
        setLoading(false);
      }

    };

    fetchData();

    // // Fetch user's like status when loading content
    // useEffect(() => {
    //   const fetchUserLikeStatus = async () => {
    //     if (isLoggedIn && contentData) {
    //       try {
    //         const response = await axios.get(
    //           `${API_URL}/api/unlock/user-like-status`,
    //           {
    //             params: { contentId: contentData.id },
    //             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    //           }
    //         );
    //         setUserLikeStatus(response.data.like_status);
    //       } catch (error) {
    //         console.error('Failed to fetch user like status.');
    //       }
    //     }
    //   };

    //   fetchUserLikeStatus();
    // }, [isLoggedIn, contentData]);

    // ... existing code ...
    // Add event listener for beforeunload when content is unlocked
    const handleBeforeUnload = (e) => {
      if (unlocked) {
        e.preventDefault();
        e.returnValue = 'Go to the unlocked content section in your Stuff Tab';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [itemid, unlocked]);

  const handleUnlock = async () => {
    if (!isLoggedIn) {
      // If user is not logged in, open login modal
      setOpenLoginModal(true);
      return;
    }

    if (userBalance < contentData.cost) {
      setSnackbarMessage('Insufficient balance. Please reload your wallet.');
      return;
    }
    setOpenDialog(true);
  };

  const confirmUnlock = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/unlock/unlock-content`,
        { contentId: contentData.id, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnlocked(true);
      setUserBalance((prevBalance) => prevBalance - contentData.cost);
      setSnackbarMessage('Content unlocked successfully!');
    } catch (err) {
      setSnackbarMessage('Failed to unlock content. Please try again.');
    } finally {
      setOpenDialog(false);
    }
  };

  const renderContent = () => {
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
        return <Typography>{contentData.content.content}</Typography>;
      case 'code':
        return <Typography>{contentData.content.content}</Typography>;
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

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setOpenLoginModal(false);
    // Re-fetch user balance after login
    const token = localStorage.getItem('token');
    const balanceResponse = await axios.get(`${API_URL}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUserBalance(balanceResponse.data.balance);
  };

  // Adjusted handlers for like and dislike
  const handleLike = async () => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/unlock/add-like`,
        { contentId: contentData.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // Update local state based on response
      if (response.data.message === 'Content liked successfully') {
        setLikes((prevLikes) => prevLikes + 1);
        if (userLikeStatus === -1) {
          setDislikes((prevDislikes) => prevDislikes - 1);
        }
        setUserLikeStatus(1);
      } else if (response.data.message === 'Like removed') {
        setLikes((prevLikes) => prevLikes - 1);
        setUserLikeStatus(0);
      }
    } catch (error) {
      setSnackbarMessage('Failed to like content.');
    }
  };

  const handleDislike = async () => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/api/unlock/add-dislike`,
        { contentId: contentData.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // Update local state based on response
      if (response.data.message === 'Content disliked successfully') {
        setDislikes((prevDislikes) => prevDislikes + 1);
        if (userLikeStatus === 1) {
          setLikes((prevLikes) => prevLikes - 1);
        }
        setUserLikeStatus(-1);
      } else if (response.data.message === 'Dislike removed') {
        setDislikes((prevDislikes) => prevDislikes - 1);
        setUserLikeStatus(0);
      }
    } catch (error) {
      setSnackbarMessage('Failed to dislike content.');
    }
  };

  // Handler for rating
  const handleRatingChange = async (event, newValue) => {
    if (!isLoggedIn) {
      setOpenLoginModal(true);
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/unlock/add-rating`,
        { contentId: contentData.id, rating: newValue },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUserRating(newValue);
      // Optionally, update the average rating from the server
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
      <Paper style={{ backgroundColor: 'lightblue', padding: '10px' }}>
        <Typography variant="h5" gutterBottom>
          Title: {contentData.title}
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

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Unlock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unlock this content for: ₡{contentData.cost}?
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
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            outline: 'none',
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

      {/* Snackbar for notifications */}
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
