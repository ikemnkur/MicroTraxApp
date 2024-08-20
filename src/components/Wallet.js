import React, { useState } from 'react';
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
} from '@mui/material';

const Wallet = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState('');
  const navigate = useNavigate();

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Wallet</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Current Balance: $1000.00</Typography>
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