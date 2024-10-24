import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { fetchWalletData } from './api'; // You'll need to implement this function

const Wallet = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const tiers = [
    { id: 1, name: 'Basic', limit: 100, fee: 0 },
    { id: 2, name: 'Standard', limit: 500, fee: 5 },
    { id: 3, name: 'Premium', limit: 1000, fee: 10 },
    { id: 4, name: 'Gold', limit: 5000, fee: 20 },
    { id: 5, name: 'Platinum', limit: 10000, fee: 35 },
    { id: 6, name: 'Diamond', limit: 50000, fee: 50 },
    { id: 7, name: 'Ultimate', limit: 100000, fee: 75 },
  ];

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWalletData();
        setWalletData(data);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to load wallet data. Please try again.');
        // if (error.response?.status === 403) {
          // Unauthorized, token might be expired
          setTimeout(() => navigate('/'), 1000);
        // }
      } finally {
        setIsLoading(false);
      }
    };

    loadWalletData();
  }, []);

  const handleOpenDialog = (selectedAction) => {
    setAction(selectedAction);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    setOpenDialog(false);
    if (action === 'reload') {
      navigate('/reload');
    } else if (action === 'withdraw') {
      navigate('/withdraw');
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Wallet</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Current Balance: ₡{walletData?.balance}</Typography>
        <Typography variant="body1" gutterBottom>Account Tier: {walletData?.accountTier}</Typography>
        <Typography variant="body1" gutterBottom>Daily Transaction Limit: ₡{walletData?.dailyTransactionLimit}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog('reload')}>
            Reload Wallet
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleOpenDialog('withdraw')}>
            Withdraw Funds
          </Button>
        </Box>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{action === 'reload' ? 'Reload Wallet' : 'Withdraw Funds'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {action === 'reload' ? 'reload your wallet' : 'withdraw funds'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wallet;