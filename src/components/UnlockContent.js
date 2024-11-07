// src/components/UnlockContent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, TextField, Button, Box, CircularProgress, Snackbar, Paper,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Input, Modal, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Auth from './Auth'; // Import the Auth component
import { HeartBrokenRounded, LockOpenRounded, ThumbUp, Visibility } from '@mui/icons-material';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status
  const [openLoginModal, setOpenLoginModal] = useState(false); // State to control the login modal

  const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch content data
        const contentResponse = await axios.get(`${API_URL}/api/unlock/unlock-content/${itemid}`);
        setContentData(contentResponse.data);
        
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
        
        // Check login status
        // const token = localStorage.getItem('token');
        // if (token) {
        //   // User is logged in, fetch balance
        //   const balanceResponse = await axios.get(`${API_URL}/api/wallet`, {
        //     headers: { Authorization: `Bearer ${token}` },
        //   });
        //   setUserBalance(balanceResponse.data.balance);
        //   setIsLoggedIn(true);
        // } else {
        //   // User is not logged in
        //   setIsLoggedIn(false);
        // }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Handle 401 error if needed
          setIsLoggedIn(false);
          // Optionally, show a message or prompt login
        } else {
          setError('Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

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
      <Paper style={{ backgroundColor: 'lightgray', padding: '10px', alignContent: 'center' }}>
        <Typography variant="h5" gutterBottom>
          <Visibility/>: 20  <ThumbUp/>: 3 <LockOpenRounded/>: 3
        </Typography>
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
          <div style={{ marginTop: '10px' }}>
            <Button variant="contained" color="primary" onClick={handleUnlock}>
              Unlock Content
            </Button>
          </div>
        </>
      ) : (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Unlocked Content
          </Typography>
          {renderContent()}
        </Paper>
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
