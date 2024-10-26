require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Box, CircularProgress, Snackbar, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input } from '@mui/material';
import { fetchLockedContent, confirmUnlockContent, } from './api';
import axios from 'axios';
import { Margin } from '@mui/icons-material';


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
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [thisUser, setThisUser] = useState(JSON.parse(localStorage.getItem("userdata")))

  const API_URL = process.env.REACT_APP_API_SERVER_URL+'/api/unlock'; // Adjust this if your API URL is different


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentResponse, balanceResponse] = await fetchLockedContent(itemid);
        setContentData(contentResponse.data);
        setUserBalance(balanceResponse.data.balance);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Add event listener for beforeunload when content is unlocked
    const handleBeforeUnload = (e) => {
      if (unlocked) {
        e.preventDefault();
        // e.returnValue = 'This is a pay-per-view site. If you leave, you\'ll need to pay again to view this content.';
        e.returnValue = 'Go to the unlocked content section in the your Your Stuff Tab';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [itemid, unlocked]);

  const handleUnlock = async () => {
    if (userBalance < contentData.cost) {
      setSnackbarMessage('Insufficient balance. Please reload your wallet.');
      return;
    }
    setOpenDialog(true);
  };

  const confirmUnlock = async () => {
    try {
      await confirmUnlockContent(contentData, message);
      setUnlocked(true);
      setUserBalance(prevBalance => prevBalance - contentData.cost);
      setSnackbarMessage('Content unlocked successfully!');
    } catch (err) {
      setTimeout(() => {
        navigate("/dashboard")
      }, 1000)
      setSnackbarMessage('Failed to unlock content. Please try again.');
    } finally {
      setOpenDialog(false);
    }
  };

  const renderContent = () => {
    console.log("contentData.type: ", contentData.type)
    console.log("contentData.conent: ", contentData.content.content)
    switch (contentData.type) {
      case 'url':
        return <a href={contentData.content.content} target="_blank" rel="noopener noreferrer">Access Content</a>;
      case 'image':
        return <img src={contentData.content.content} alt={contentData.title} style={{ maxWidth: '100%' }} />;
      case 'text':
        return <Typography>{contentData.content.content}</Typography>;
      case 'code':
        return <Typography>{contentData.content.content}</Typography>;
      case 'video':
        return <Typography>{contentData.content.content}</Typography>;
      case 'file':
        return <a href={contentData.content.content} download>Download File</a>;
      default:
        return <Typography>Content type not supported</Typography>;
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Paper style={{ backgroundColor: "lightblue", padding: "10px" }}>
        <Typography variant="h4" gutterBottom>Title: {contentData.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>Description: {contentData.description}</Typography>
        <Typography variant="body1" gutterBottom>Cost: ₡{contentData.cost}</Typography>
        <Typography variant="body1" gutterBottom>Balance: ₡{userBalance}</Typography>

      </Paper>

      {!unlocked ? (
        <>
          <div style={{ marginTop: "30px" }}>
            <Typography variant="subtitle1" gutterBottom>Leave a Message: </Typography>
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

            <Button variant="contained" color="primary" onClick={handleUnlock}>
              Unlock Content
            </Button>
          </div>
        </>

      ) : (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom> Unlocked Content </Typography>
          {renderContent()}
        </Paper>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Unlock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unlock this content for: ₡{contentData.cost}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmUnlock} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

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