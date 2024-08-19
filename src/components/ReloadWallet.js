import React, { useState } from 'react';
import { Typography, TextField, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Snackbar } from '@mui/material';

const ReloadWallet = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reloading wallet with', amount, 'via', paymentMethod);
    setOpenSnackbar(true);
    setAmount('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reload Digital Wallet</Typography>
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
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Payment Method</FormLabel>
            <RadioGroup 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="stripe" control={<Radio />} label="Stripe" />
              <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
              <FormControlLabel value="cashapp" control={<Radio />} label="Cash App" />
            </RadioGroup>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Reload Wallet
          </Button>
        </form>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={`Wallet reloaded with $${amount} via ${paymentMethod}!`}
      />
    </Box>
  );
};

export default ReloadWallet;