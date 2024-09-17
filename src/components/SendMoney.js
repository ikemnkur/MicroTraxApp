import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Typography, TextField, Button, Paper, Box, Snackbar, Avatar } from '@mui/material';
import { fetchUserProfile, fetchOtherUserProfile, sendMoneyToOtherUser } from './api'; // Make sure this import is correct



const SendMoney = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [toUser, setToUser] = useState(null);
  const [UserNotFound, setUserNotFound] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [thisUser, setThisUser] = useState(JSON.parse(localStorage.getItem("userdata")))
  const usernameInputRef = useRef(null);

  useEffect(() => {
    let ud = JSON.parse(localStorage.getItem("userdata"))
    console.log("this user data: ", ud)
    setThisUser(ud)

    const searchParams = new URLSearchParams(location.search);
    const recipientFromUrl = searchParams.get('recipient');
    const amountFromUrl = searchParams.get('amount');

    if (recipientFromUrl) setRecipient(recipientFromUrl);
    if (amountFromUrl) setAmount(amountFromUrl);


    loadUserProfile();
  }, [userId, location.search]);

  const loadUserProfile = async () => {
    if (userId) {
    try {
      const userData = await fetchUserProfile(userId);
      // setToUser(userData);
    } catch (error) {
      console.error('Error fetching toUser profile:', error);
      setSnackbarMessage('Failed to load toUser profile');
      setOpenSnackbar(true);
      if (error.response?.status === 403) {
        // Unauthorized, token might be expired
        setTimeout(() => navigate('/'), 1000);
      }
    }
    console.log("User ID: ", userId);
    console.log("toUser Data: ", toUser);
    }
  };

  const search4user = async (e) => {
    let term = recipient;
    try {
      const s4uData = await fetchOtherUserProfile(term);
      setTimeout(() =>{
        console.log("S4U: ", s4uData)
        setToUser(s4uData);}
        , 100
      )
      setUserNotFound(false)
    } catch (error) {
      setUserNotFound(true)
      console.error(`Error fetching ${term} profile:`, error);
      setSnackbarMessage(`Failed to find User: ${term}`);
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending', amount, 'to', recipient);
    try {
      const sendmoneyData = {
        recipient,
        recipientId: toUser.id,
        amount: parseFloat(amount),
        message
      };
      await sendMoneyToOtherUser(sendmoneyData);
      setSnackbarMessage("Money sent successfully!");
      setOpenSnackbar(true);
      // Reset form
      setRecipient('');
      setAmount('');
      setMessage('');
    } catch (error) {
      setSnackbarMessage(error.message || "Failed to send money. Please try again later.");
      setOpenSnackbar(true);
      if (error.response?.status === 401) {
        // Unauthorized, token might be expired
        setTimeout(() => navigate('/login'), 1500);
      }
    }
  };

  const goToUserProfile = (e) => {
    // e.preventDefault();
    navigate(`/user/${toUser.username}`)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Send Money</Typography>
      {UserNotFound && (
        <Paper sx={{ p: 2, display: 'flex', color: "lightgrey", alignItems: 'center', mb: 2 }}>
          
          <Typography variant="h4">{`Username: "${recipient}" was not found in the database.`}</Typography>
         
        </Paper>
      )}
      {toUser && (
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={toUser.avatar} alt={toUser.username} sx={{ width: 100, height: 100, mr: 2 }} />
          <Typography variant="h4">{toUser.username}</Typography>
          <Button style={{float: 'right', marginLeft: "50px"}} onClick={goToUserProfile} variant="contained" color="primary" sx={{ mt: 2 }}>
              View Profile
          </Button>
        </Paper>
      )}
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <div style={{display: "flex", gap: 5}}>
            <TextField
              label="Recipient Username"
              fullWidth
              margin="normal"
              value={recipient}
              ref={usernameInputRef}
              onChange={(e) => { setRecipient(e.target.value) }}
              required
            />
            <Button onClick={ search4user } variant="contained" color="primary" sx={{ mt: 2 }}>
              Search
            </Button>
          </div>

          <TextField
            label="Amount"
            fullWidth
            margin="normal"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            inputProps={{ min: "0.01", step: "0.01" }}
          />
          <TextField
            label="Leave a Message"
            fullWidth
            margin="normal"
            placeholder={`${recipient} Enjoy: ${amount} !!!, from ${thisUser.username}`}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Send Money
          </Button>
        </form>
      </Paper>
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

export default SendMoney;