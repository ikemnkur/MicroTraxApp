require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Button, Avatar, Paper, Box, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Rating } from '@mui/material';
import { Send as SendIcon, Favorite as FavoriteIcon, Report as ReportIcon, Message as MessageIcon, ThumbDownAlt, ThumbDownAltOutlined, ThumbUpOutlined, ThumbUp } from '@mui/icons-material';
import { fetchOtherUserProfile, updateFavoriteStatus, submitUserReport, fetchOtherUserProfileId } from './api'; // You'll need to implement these API functions
import StarIcon from '@mui/icons-material/Star';
// import * as React from 'react';
// import Rating from '@mui/material/Rating';
// import Box from '@mui/material/Box';
// import StarIcon from '@mui/icons-material/Star';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  // const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);

  // New state variables
  const [userLikeStatus, setUserLikeStatus] = useState(0); // 1: liked, -1: disliked, 0: none

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }


  const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  };



  useEffect(() => {

    const loadUserProfile = async () => {
      try {
        let userData = await fetchOtherUserProfileId(userId);

        // Convert created_at timestamp
        if (userData.created_at) {
          userData.created_at = convertTimestamp(userData.created_at);
        }

        setUser(userData);
        console.log("User: ", userData);
        setIsFavorite(userData.isFavorite);
      } catch (error) {
        try {
          const userData = await fetchOtherUserProfile(userId);
          setUser(userData);
          setIsFavorite(userData.isFavorite);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setSnackbarMessage('Failed to load user profile of: ' + user);
          setOpenSnackbar(true);
          if (error.response?.status === 403) {
            // Unauthorized, token might be expired
            setTimeout(() => navigate('/dashboard'), 1000);
          }
        }
      }
    };

    // Utility function to convert an ISO timestamp to the desired format
    // Format Example: "2024-08-31T05:10:57.000Z" => "2024-08-31 at 05:10:57 AM"
    function convertTimestamp(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      let hour = date.getHours();
      let meridiem = 'AM';

      // Convert 24-hour time to 12-hour time
      if (hour === 0) {
        hour = 12; // midnight is 12 AM
      } else if (hour === 12) {
        meridiem = 'PM';
      } else if (hour > 12) {
        hour -= 12;
        meridiem = 'PM';
      }

      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      // Build the final string
      return `${year}-${month}-${day} at ${String(hour).padStart(2, '0')}:${minutes}:${seconds} ${meridiem}`;
    }


    const getLoginStatus = async () => {
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
          console.log("logged in")
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    }
    getLoginStatus();
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

  // Handler for rating
  // const handleRatingChange = async (event, newValue) => {
  //   // if (!isLoggedIn) {
  //   //   // setOpenLoginModal(true);
  //   //   return;
  //   // }
  //   alert("you rated this user a: ", userRating)
  //   console.log("User Rating: ", userRating)
  //   try {
  //     await axios.post(
  //       `${API_URL}/api/user/add-rating`,
  //       { rateduserId: contentData.id, rating: userRating },
  //       { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  //     );

  //     setUserRating(newValue);
  //     // Optionally, update the average rating from the server
  //   } catch (error) {
  //     setSnackbarMessage('Failed to submit rating.');
  //   }
  // };


  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 2, display: "block", background: "#EEEEFF", alignItems: 'center', mb: 2 }}>
        <div style={{ display: "flex" }}>
          <Avatar src={user.profilePic || user.avatar} alt={user.username} sx={{ width: 100, height: 100, mr: 2 }} />
          <Typography variant="h1" style={{ marginTop: "30px" }}>{user.username}</Typography>

        </div>
        <div style={{ display: "flex", padding: 5, margin: "10px" }}>
          <Typography variant="h4">Bio: {user.bio}</Typography>
        </div>
        <div style={{ display: "flex", padding: 5, margin: "10px" }}>
          <Typography variant="h4">Joined: {user.created_at}</Typography>
        </div>
        <div style={{ display: "flex", padding: 5, margin: "10px" }}>
          <Typography variant="h4">Rating: {user.rating}<StarIcon /></Typography>
        </div>

      </Paper>
      {/* <Paper style={{ backgroundColor: 'lightgray', padding: '10px', margin: '10px' }}>
        <Typography variant="h6" gutterBottom align="center">
          Rate this User
        </Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item>
            <Typography component="legend">
              <Rating
                name="content-rating"
                value={userRating}
                onChange={handleRatingChange}
              />
              <Rating
                name="hover-feedback"
                value={value}
                precision={0.5}
                // getLabelText={getLabelText}
                onChange={(event, newValue) => {
                  setUserRating(newValue);
                  console.log("rating",newValue);
                  handleRatingChange(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              <Rating
                name="hover-feedback"
                value={value}
                precision={0.5}
                getLabelText={getLabelText}
                onChange={(event, newValue) => {
                  setValue(newValue);
                  handleRatingChange("", newValue);
                  setUserRating(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
              {value !== null && (
                <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
              )}

            </Typography>

          </Grid>
        </Grid>
      </Paper> */}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" startIcon={<SendIcon />} onClick={handleSendMoney}>
          send coins
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