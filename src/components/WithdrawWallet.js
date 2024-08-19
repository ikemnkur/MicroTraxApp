import React, { useState } from 'react';
import { Typography, TextField, Button, Paper, Select, MenuItem, FormControl, InputLabel, Box, Snackbar } from '@mui/material';

const WithdrawWallet = () => {
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Requesting withdrawal of', amount, 'via', withdrawMethod);
    setOpenSnackbar(true);
    setAmount('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Withdraw from Wallet</Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Withdrawal Method</InputLabel>
            <Select
              value={withdrawMethod}
              onChange={(e) => setWithdrawMethod(e.target.value)}
              label="Withdrawal Method"
            >
              <MenuItem value="bank">Bank Transfer</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
              <MenuItem value="check">Check by Mail</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Request Withdrawal
          </Button>
        </form>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={`Withdrawal request of $${amount} via ${withdrawMethod} submitted!`}
      />
    </Box>
  );
};

export default WithdrawWallet;