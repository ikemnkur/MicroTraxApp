require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Button,
  Avatar,
  Paper,
  Box,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Rating
} from '@mui/material';
import {
  Send as SendIcon,
  PictureAsPdfOutlined as PictureIcon,
  Favorite as FavoriteIcon,
  Report as ReportIcon,
  Message as MessageIcon,
  Star as StarIcon,
  ThumbUpRounded,
  PictureInPicture
} from '@mui/icons-material';
import {
  fetchOtherUserProfile,
  fetchOtherUserProfileId,
  updateFavoriteStatus,
  submitUserReport,
  submitUserMessage
} from './api'; // Ensure submitUserMessage is implemented in your API file

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Utility to convert ISO timestamps to a more readable format
  const convertTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hour = date.getHours();
    let meridiem = 'AM';
    if (hour === 0) {
      hour = 12;
    } else if (hour === 12) {
      meridiem = 'PM';
    } else if (hour > 12) {
      hour -= 12;
      meridiem = 'PM';
    }
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} at ${String(hour).padStart(2, '0')}:${minutes}:${seconds} ${meridiem}`;
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        let userData = await fetchOtherUserProfileId(userId);
        if (userData.created_at) {
          userData.created_at = convertTimestamp(userData.created_at);
        }
        console.log("user-profile: User ID = ", userId)
        console.log("user-profile-data: ", userData)
        setUser(userData);
        setIsFavorite(userData.isFavorite);
      } catch (error) {
        try {
          let username = userId;
          console.log("user-profile: UserName = ", username)
          const userData = await fetchOtherUserProfile(username);
          setUser(userData);
          // console.log("user-profile: User ID = ", userId)
          console.log("user-profile-data: ", userData)
          setIsFavorite(userData.isFavorite);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setSnackbarMessage('Failed to load user profile.');
          setOpenSnackbar(true);
          if (error.response?.status === 403) {
            setTimeout(() => navigate('/dashboard'), 1000);
          }
        }
      }
    };

    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
    loadUserProfile();
  }, [userId, navigate]);

  const handleSendMoney = () => {
    navigate(`/send?recipient=${user.username}`);
  };

  const handleViewingUserPosts = () => {
    navigate(`/user-posts/${user.username}`);
  };

  const handleToggleFavorite = async () => {

    try {
      const newFavoriteStatus = !isFavorite;
      console.log("user-profile: User ID = ", userId)
      console.log("user-profile-data: ", user)
      await updateFavoriteStatus(userId, newFavoriteStatus, user);
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
    confirmation('Are you sure you want to report this user? This will cost you 10 coins.')
    if (!reportMessage) {
      setSnackbarMessage('Please provide a reason for reporting');
      setOpenSnackbar(true);
      return;
    }
    if (reportMessage.length < 10) {
      setSnackbarMessage('Report message must be at least 10 characters long');
      setOpenSnackbar(true);
      return;
    }
    if (reportMessage.length > 500) {
      setSnackbarMessage('Report message cannot exceed 500 characters');
      setOpenSnackbar(true);
      return;
    }
    try {
      let reportedUser = user.username;
      let reportingUser = localStorage.getItem('username');
      await submitUserReport(userId, reportMessage, reportedUser, reportingUser);
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

  const handleMessage = () => {
    navigate(`/messages/${user.username}`);
    // setOpenMessageDialog(true);
  };

  const handleSubmitMessage = async () => {
    try {
      await submitUserMessage(userId, userMessage);
      setOpenMessageDialog(false);
      setUserMessage('');
      setSnackbarMessage('Message sent successfully');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbarMessage('Failed to send message');
      setOpenSnackbar(true);
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, backgroundColor: '#EEEEFF', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user.profilePic || user.avatar}
            alt={user.username}
            sx={{ width: 100, height: 100 }}
          />
          <Typography variant="h3" sx={{ mt: 2 }}>
            {user.username}
          </Typography>

        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
          <div style={{ padding: 5, margin: "10px" }}>
            <Typography variant="h4">Bio: {user.bio}</Typography>
          </div>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', my: 2 }}>
          <Typography variant="h5">
            Rating: {user.avgRating} <StarIcon sx={{ ml: 1 }} />
          </Typography>
          <Typography variant="h5">
            Likes: {user.numberOfLikes} <ThumbUpRounded sx={{ ml: 1 }} />
          </Typography>
          <Typography variant="h5">
            Posts: {user.numberOfPosts} <PictureInPicture sx={{ ml: 1 }} />
          </Typography>
          <Typography variant="h5">
            Favorites: {user.numberOfFavorites} <FavoriteIcon sx={{ ml: 1 }} />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', my: 2 }}>
          <Button
            variant="contained"
            startIcon={<PictureIcon />}
            onClick={handleViewingUserPosts}
          >
            <Typography sx={{ mt: 1 }}>View Posts</Typography>
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendMoney}
          >
            <Typography sx={{ mt: 1 }}>Send Coins</Typography>
          </Button>
          <Button
            variant={isFavorite ? "contained" : "outlined"}
            startIcon={<FavoriteIcon />}
            onClick={handleToggleFavorite}
          >
            <Typography sx={{ mt: 1 }}>
              {isFavorite ? "Remove Favorite" : "Add Favorite"}
            </Typography>
          </Button>
          <Button
            variant="outlined"
            startIcon={<ReportIcon />}
            onClick={handleReport}
          >
            <Typography sx={{ mt: 1 }}>Report</Typography>
          </Button>
          <Button
            variant="outlined"
            startIcon={<MessageIcon />}
            onClick={handleMessage}
          >
            <Typography sx={{ mt: 1 }}>Message</Typography>
          </Button>
        </Box>
      </Paper>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />

      {/* Report Dialog */}
      <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            maxWidth: '90vw',
            height: '270px',
            maxHeight: '90vh'
          }
        }}>
        <DialogTitle>Report User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for report"
            type="text"
            fullWidth
            multiline
            rows={6}
            value={reportMessage}
            onChange={(e) => setReportMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitReport}>Submit Report</Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      {/* Message Dialog */}
      <Dialog
        open={openMessageDialog}
        onClose={() => setOpenMessageDialog(false)}
        sx={{
          '& .MuiDialog-paper': {
            width: '600px',
            maxWidth: '90vw',
            height: '300px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>Send a Message to {user.username}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Message to user"
            type="text"
            fullWidth
            multiline
            rows={8}
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
