require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { Typography, TextField, MenuItem,  Select, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  fetchWalletData,
} from './api';

const ReloadWallet = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reloading wallet with', amount, 'via', paymentMethod);
    goToCheckOut();
    setOpenSnackbar(true);
    setAmount('');
  };

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWalletData();
      setWalletData(data);
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to load wallet data. Please try again.');
      setTimeout(() => navigate('/'), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const goToCheckOut = () => {
    navigate(`/checkout?amount=${purchaseAmount}`);
  };

  useEffect(() => {
    // loadUserContent();
    // loadUserSubscriptions();
    loadWalletData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reload Digital Wallet</Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          {!isLoading && (
            <Box sx={{ display: 'block', justifyContent: 'space-around', mt: 2, padding: "5px" }}>
              <Typography variant="h6" gutterBottom>
                Current Balance: ₡{walletData?.balance}
              </Typography>
              {/* <Typography variant="body1" gutterBottom>
                Account Tier: {walletData?.accountTier}
              </Typography> */}
              <Typography variant="body1" gutterBottom>
                Coins that you can spend: ₡{walletData?.spendable}
              </Typography>
            </Box>
          )}

          {/* <TextField
            label="Amount"
            fullWidth
            margin="normal"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            inputProps={{ min: "0.01", step: "0.01" }}
          /> */}
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">Select an amount to buy: </FormLabel>
            <Select
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="1">1000 coins</MenuItem>
              <MenuItem value="2">2125 coins</MenuItem>
              <MenuItem value="5">5250 coins</MenuItem>
              <MenuItem value="10">10500 coins</MenuItem>
            </Select>
          </FormControl>
          <br></br>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Reload Wallet
          </Button>
        </form>
      </Paper><></>
      {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
        
      </Dialog> */}
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