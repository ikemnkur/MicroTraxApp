import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Button, Avatar, Paper, Box, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Send as SendIcon, Favorite as FavoriteIcon, Report as ReportIcon, Message as MessageIcon } from '@mui/icons-material';
import { fetchOtherUserProfile, updateFavoriteStatus, submitUserReport } from './api'; // You'll need to implement these API functions

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportMessage, setReportMessage] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchOtherUserProfile(userId);
        // alert(userId)
        setUser(userData);
        setIsFavorite(userData.isFavorite);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setSnackbarMessage('Failed to load user profile of: ' + user);
        setOpenSnackbar(true);
        if (error.response?.status === 403) {
          // Unauthorized, token might be expired
          setTimeout(() => navigate('/'), 1000);
        }
      }
    };

    loadUserProfile();
  }, [userId]);

  const handleSendMoney = () => {
    navigate(`/send?recipient=${user.username}`);
  };

  const handleToggleFavorite = async () => {
    try {
      const newFavoriteStatus = !isFavorite;
      await updateFavoriteStatus(userId, newFavoriteStatus);
      setIsFavorite(newFavoriteStatus);
      setSnackbarMessage(newFavoriteStatus ? 'User added to favorites' : 'User removed from favorites');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating favorite status:', error);
      setSnackbarMessage('Failed to update favorite status');
      setOpenSnackbar(true);
    }
  };

  const handleReport = () => {
    setOpenReportDialog(true);
  };

  const handleSubmitReport = async () => {
    try {
      await submitUserReport(userId, reportMessage);
      setOpenReportDialog(false);
      setReportMessage('');
      setSnackbarMessage('Report submitted successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error submitting report:', error);
      setSnackbarMessage('Failed to submit report');
      setOpenSnackbar(true);
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 2, display: "block", background: "#EEEEFF", alignItems: 'center', mb: 2 }}>
        <div style={{display: "flex"}}>
          <Avatar src={user.avatar} alt={user.username} sx={{ width: 100, height: 100, mr: 2 }} />
          <Typography variant="h4" style={{marginTop: "30px"}}>{user.username}</Typography>
        </div>
        <div style={{display: "flex", padding: 5, margin: "10px"}}>
          <Typography variant="h4">Bio: {user.bio}</Typography>
        </div>
      </Paper>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<SendIcon />} onClick={handleSendMoney}>
          Send Money
        </Button>
        <Button
          variant={isFavorite ? "contained" : "outlined"}
          startIcon={<FavoriteIcon />}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? "Remove Favorite" : "Add Favorite"}
        </Button>
        <Button variant="outlined" startIcon={<ReportIcon />} onClick={handleReport}>
          Report
        </Button>
      </Box>
      {/* <Button variant="text" startIcon={<MessageIcon />} onClick={() => navigate(`/messages/${userId}`)}>
        Send Message
      </Button> */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
      <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}>
        <DialogTitle>Report User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for report"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={reportMessage}
            onChange={(e) => setReportMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitReport}>Submit Report</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;