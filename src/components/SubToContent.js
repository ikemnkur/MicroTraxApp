require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLockedContent, confirmUserSubToContent, } from './api';
import { Margin } from '@mui/icons-material';
import {
  Typography, TextField, Button, Box, CircularProgress, Snackbar, Paper,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Input, Modal, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Auth from './Auth'; // Import the Auth component

const SubToContent = () => {
  const { itemid } = useParams();
  const navigate = useNavigate();
  const [contentData, setContentData] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribed, setsubscribed] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status
  const [openLoginModal, setOpenLoginModal] = useState(false); // State to control the login modal

  const [thisUser, setThisUser] = useState(JSON.parse(localStorage.getItem("userdata")))

  const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000';


  useEffect(() => {
    alert("Subbing to Content")
    const fetchData = async () => {
      try {
        // Fetch content data
        const contentResponse = await axios.get(`${API_URL}/api/subscribe/get/${itemid}`);
        console.log(contentResponse.data)
        setContentData(contentResponse.data);


        // Check login status via wallet balance
        try {
          const token = localStorage.getItem('token');
          if (token) {
            // alert("check login in status")
            // User is logged in, fetch balance
            const balanceResponse = await axios.get(`${API_URL}/api/wallet`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserBalance(balanceResponse.data.balance);
            setIsLoggedIn(true);
            // alert("you are logged in ")
          }
        } catch (error) {
          setIsLoggedIn(false);
          console.log("Not logged in")
        }

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

    // Add event listener for beforeunload when content is subscribed
    const handleBeforeUnload = (e) => {
      if (subscribed) {
        e.preventDefault();
        e.returnValue = 'Your have subscribed to: ';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [itemid, subscribed]);

  const handleSubscribe = async () => {
    if (userBalance < contentData.cost) {
      setSnackbarMessage('Insufficient balance. Please reload your wallet.');
      return;
    }
    setOpenDialog(true);
  };

  const confirmsubscribe = async () => {
    try {
      await confirmUserSubToContent(contentData, message);
      setsubscribed(true);
      setUserBalance(prevBalance => prevBalance - contentData.cost);
      setSnackbarMessage('Content subscribed successfully!');
    } catch (err) {
      setTimeout(() => {
        navigate("/dashboard")
      }, 1000)
      setSnackbarMessage('Failed to subscribe content. Please try again.');
    } finally {
      setOpenDialog(false);
    }
  };

  const renderContent = () => {
    console.log("contentData.type: ", contentData.type)
    console.log("contentData.conent: ", contentData.content.content)
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
      <Paper style={{ backgroundColor: "lightblue", padding: "10px" }}>
        <Typography variant="h4" gutterBottom>Title: {contentData.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>Description: {contentData.description}</Typography>
        <Typography variant="body1" gutterBottom>Cost: ₡{contentData.cost}</Typography>
        {isLoggedIn && (
          <Typography variant="body1" gutterBottom>
            Balance: ₡{userBalance}
          </Typography>
        )}
      </Paper>

      {!subscribed ? (
        <>
          <div style={{ marginTop: "30px" }}>
            <Typography variant="subtitle1" gutterBottom>Leave a message for the Creator: </Typography>
            <TextField
              label="Leave a Message"
              fullWidth
              margin="normal"
              placeholder={`${recipient} Enjoy: ₡{amount} !!!, from ${thisUser.username}`}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

          </div>
          <br></br>
          <div style={{ arginTop: "10px" }}>

            <Button variant="contained" color="primary" onClick={handleSubscribe}>
              Subscribe to this Content
            </Button>
          </div>
        </>

      ) : (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom> Subscribed Content </Typography>
          {renderContent()}
        </Paper>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Subscription</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to subcribe this content for ${contentData.cost} per ${contentData.frequency}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmsubscribe} color="primary">Confirm</Button>
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

export default SubToContent;