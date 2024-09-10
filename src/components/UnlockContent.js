import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Box, CircularProgress, Snackbar, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { fetchLockedContent, confirmUnlockContent, } from './api';
import axios from 'axios';

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

  const API_URL = 'http://localhost:5000/api/unlock'; // Adjust this if your API URL is different
  

  useEffect(() => {
    // alert("username: "+ username)
    // alert("ItemId: "+ itemid)
    const fetchData = async () => {
      try {
        // const [contentResponse, balanceResponse] = await Promise.all([
        //   axios.get(`${API_URL}/unlock-content/${username}/${itemId}`),
        //   axios.get(`${API_URL}/user-balance`)
        // ]);
        const [contentResponse, balanceResponse] = await fetchLockedContent(itemid);
        console.log("Content Resp. :" + contentResponse)
        
        console.log("Balance Resp. :" + balanceResponse)
        // alert("Balance Resp: "+ balanceResponse)
        setContentData(contentResponse.data);
        setUserBalance(balanceResponse.data.balance);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemid]);

  const handleUnlock = async () => {
    if (userBalance < contentData.cost) {
      setSnackbarMessage('Insufficient balance. Please reload your wallet.');
      return;
    }
    setOpenDialog(true);
  };

  const confirmUnlock = async () => {
    try {
      // await axios.post(`${API_URL}/unlock-content`, { contentId: contentData.id });
      await confirmUnlockContent(contentData);
      setUnlocked(true);
      setUserBalance(prevBalance => prevBalance - contentData.cost);
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
        return <a href={contentData.content.url} target="_blank" rel="noopener noreferrer">Access Content</a>;
      case 'image':
        return <img src={contentData.content.url} alt={contentData.title} style={{ maxWidth: '100%' }} />;
      case 'text':
        return <Typography>{contentData.content.text}</Typography>;
      case 'file':
        return <a href={contentData.content.url} download>Download File</a>;
      default:
        return <Typography>Content type not supported</Typography>;
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{contentData.title}</Typography>
      <Typography variant="body1" gutterBottom>{contentData.description}</Typography>
      <Typography variant="h6" gutterBottom>Cost: ${contentData.cost}</Typography>
      <Typography variant="subtitle1" gutterBottom>Your Balance: ${userBalance}</Typography>
      
      {!unlocked ? (
        <Button variant="contained" color="primary" onClick={handleUnlock}>
          Unlock Content
        </Button>
      ) : (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          {renderContent()}
        </Paper>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Unlock</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unlock this content for ${contentData.cost}?
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