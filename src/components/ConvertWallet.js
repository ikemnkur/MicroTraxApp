require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Paper, FormControl, FormLabel, Box, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchWalletData, walletConvertAction } from './api';

const ConvertWallet = () => {
  const [amount, setAmount] = useState(1000);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userdata')) || {});
  const [walletData, setWalletData] = useState(null);
  const [fee, setFee] = useState(0);
  const [convertMethod, setConvertMethod] = useState('spend');
  const [otherMethod, setOtherMethod] = useState('redeem');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Load wallet data
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

  // Prepare conversion data
  const conversionData = {
    username: userData.username,
    amount: amount,
    email: userData.email,
    firstname: userData.firstName,
    lastname: userData.lastName,
    date: new Date().toISOString(),
    fees: fee,
    balance: walletData?.balance,
    method: convertMethod,
  };

  async function convertCoins() {
    await walletConvertAction(conversionData);
    console.log(`${amount} coins have been converted to ${convertMethod}!`);
    setOpenSnackbar(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  }

  useEffect(() => {
    loadWalletData();
  }, []);

  // Handle the main form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount < 250) {
      alert("Minimum conversion amount is 250 Coins");
      return;
    }
    if (convertMethod === "spend") {
      setFee(Math.floor(amount * 0.05));
    }
    if (convertMethod === "redeem") {
      setFee(Math.floor(amount * 0.1));
    }

    convertCoins();

    // Optionally reset amount if you want:
    setAmount('');
  };

  // Helpers for adjusting amount
  const handleDecrement = () => {
    setAmount((prev) => Math.max(0, Number(prev) - 25)); // Prevent negative values
  };

  const handleIncrement = () => {
    setAmount((prev) => Number(prev) + 25);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Convert Coin Balance Type
      </Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          {!isLoading && (
            <Box sx={{ display: 'block', justifyContent: 'space-around', mt: 2, padding: '5px' }}>
              <Typography variant="h6" gutterBottom>
                Current Balance: ₡{walletData?.balance}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Coins that you can spend: ₡{walletData?.spendable}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Coins that you can redeem: ₡{walletData?.redeemable}
              </Typography>
            </Box>
          )}

          {/* Conversion Method */}
          <FormControl margin="normal" sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Convert: {convertMethod}
            </Typography>
            <FormLabel>Select a conversion method:</FormLabel>
            <br />

            {/* Parent container to hold the two divs side by side and center them */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4 // gap creates space between the two blocks
              }}
            >
              {/* Block 1 */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1">Convert: Spendable coins to Redeemable coins</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setConvertMethod("redeem");
                    setOtherMethod("spend");
                  }}
                >
                  Convert to Redeem
                </Button>
              </Box>

              {/* Block 2 */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1">Convert: Redeemable coins to Spendable coins</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setConvertMethod("spend");
                    setOtherMethod("redeem");
                  }}
                >
                  Convert to Spend
                </Button>
              </Box>
            </Box>
          </FormControl>

          {/* Amount Selection */}
          <Box marginTop={2}>
            <FormLabel>Select an amount of {otherMethod + "able"} coins to convert to {convertMethod + "able"} coins:</FormLabel>
            <br />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleDecrement}
                style={{ width: 32, height: 32, margin: 'auto 10px', padding: 5 }}
              >
                -
              </button>
              <TextField
                label="Amount"
                style={{ flex: 1 }}
                margin="normal"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                inputProps={{ min: '5', step: '0.5' }}
              />
              <button
                type="button"
                onClick={handleIncrement}
                style={{ width: 32, height: 32, margin: 'auto 10px', padding: 5 }}
              >
                +
              </button>
            </div>
            <Typography variant="body1" gutterBottom>
              Fee (Coins): ₡{fee}
            </Typography>
          </Box>

          <br />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Convert Coins
          </Button>
        </form>
      </Paper>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={`${amount} coins have been converted to ${convertMethod}!`}
      />
    </Box>
  );
};

export default ConvertWallet;