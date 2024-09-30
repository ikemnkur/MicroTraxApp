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

import { Typography, TextField, Button, Select, Snackbar, MenuItem, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle } from '@mui/material';
import { Delete as DeleteIcon, EditAttributesRounded } from '@mui/icons-material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShareIcon from '@mui/icons-material/Share';
import { fetchUserContent, handleDeleteContent, handleSubmitNewContent, handleSubmitNewEdit, fetchWalletData} from './api';
import QRCode from 'qrcode.react';
import Clipboard from "./Clipboard.js";
import {  } from './api'; // You'll need to implement this function

const YourStuff = () => {
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

    // Mock data - replace with actual data fetching
    const subscriptions = [
      { id: 1, date: '2023-08-18', name: "YT Channel", type: 'Daily', username: 'user1', AccountID: "ACC132145936", amount: 1 },
      { id: 2, date: '2023-08-17', name: " GameHub Sub", type: 'Monthly', username: 'user2', AccountID: "ACC132145936", amount: 2 },
      { id: 3, date: '2023-08-17', name: "Cool Artilces.com", type: 'Weekly', username: 'user3', AccountID: "ACC132145936", amount: 4 },
      // ... more subs
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
      <Typography variant="h4" gutterBottom>My Services</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Current Balance: ${walletData?.balance}</Typography>
        <Typography variant="body1" gutterBottom>Account Tier: {walletData?.accountTier}</Typography>
        <Typography variant="body1" gutterBottom>Daily Transaction Limit: ${walletData?.dailyTransactionLimit}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Typography variant="h4" gutterBottom>My Unlocked Content</Typography>
          <List style={{ gap: "3px" }}>
                {contentList && contentList.map((item) => (
                    <>
                        <div>
                            <ListItem key={item.id} style={{ background: "lightGreen", borderRadius: "5px", gap: "3px", padding: "5px", margin: "2px" }}>
                                <ListItemText
                                    primary={item.title}
                                    secondary={`Cost: $${item.cost} | Type: ${item.type} | Item Id: ${item.reference_id}`}
                                />
                            
                            </ListItem>
                        </div>

                        <br></br>
                    </>

                ))}
            </List>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
        <Typography variant="h4" gutterBottom>My Subscriptions</Typography>
        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ backgroundColor: "cyan", borderRadius: 10 }}>
            {filteredSubs.map((sub) => (
              <TableRow key={sub.id} style={{ backgroundColor: "lightblue", borderRadius: 5 }}>
                <TableCell>{sub.name}</TableCell>
                <TableCell>{sub.date}</TableCell>
                <TableCell>{sub.type}</TableCell>
                <TableCell>{sub.username}</TableCell>
                <TableCell>${sub.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
                    <DeleteIcon style={{ paddingRight: "5px", fontSize: 24 }} />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleEdit(item)}>
                    <EditNoteIcon style={{ paddingLeft: "5px" }} />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleShare(item)}>
                    <ShareIcon style={{ paddingLeft: "5px" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

export default YourStuff;