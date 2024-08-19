import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Avatar, Paper, Box, Snackbar } from '@mui/material';
import { Send as SendIcon, Favorite as FavoriteIcon, Report as ReportIcon, Message as MessageIcon } from '@mui/icons-material';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Mock fetching user data
    const mockUser = { 
      id: userId, 
      username: 'exampleUser', 
      avatar: 'https://mui.com/static/images/avatar/1.jpg' 
    };
    setUser(mockUser);
  }, [userId]);

  const handleSendMoney = () => {
    setSnackbarMessage('Redirecting to Send Money page...');
    setOpenSnackbar(true);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setSnackbarMessage(isFavorite ? 'User removed from favorites' : 'User added to favorites');
    setOpenSnackbar(true);
  };

  const handleReport = () => {
    setSnackbarMessage('Report submitted');
    setOpenSnackbar(true);
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={user.avatar} alt={user.username} sx={{ width: 100, height: 100, mr: 2 }} />
        <Typography variant="h4">{user.username}</Typography>
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
      <Button variant="text" startIcon={<MessageIcon />} href={`/messages/${userId}`}>
        Send Message
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UserProfile;