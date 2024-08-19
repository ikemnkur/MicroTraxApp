import React, { useState } from 'react';
import { Typography, TextField, Button, Paper, Box, Snackbar } from '@mui/material';

const SendMoney = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending', amount, 'to', recipient);
    setOpenSnackbar(true);
    // Reset form
    setRecipient('');
    setAmount('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Send Money</Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Recipient Username"
            fullWidth
            margin="normal"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
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
        message="Money sent successfully!"
      />
    </Box>
  );
};

export default SendMoney;