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

import { TextField, Select, Snackbar, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete as DeleteIcon, EditAttributesRounded } from '@mui/icons-material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShareIcon from '@mui/icons-material/Share';
import { fetchUserContent, fetchSubscriptions, handleDeleteContent, handleSubmitNewContent, handleSubmitNewEdit, fetchWalletData } from './api';
import QRCode from 'qrcode.react';
import Clipboard from "./Clipboard.js";
import { } from './api'; // You'll need to implement this function

const YourStuff = () => {

  // Mock data - replace with actual data fetching
  const subscriptions = [
    { id: 1, date: '2023-08-18', name: "YT Channel", type: 'Daily', username: 'user1', AccountID: "ACC132145936", amount: 1 },
    { id: 2, date: '2023-08-17', name: " GameHub Sub", type: 'Monthly', username: 'user2', AccountID: "ACC132145936", amount: 2 },
    { id: 3, date: '2023-08-17', name: "Cool Artilces.com", type: 'Weekly', username: 'user3', AccountID: "ACC132145936", amount: 4 },
    // ... more subs
  ];

  const tiers = [
    { id: 1, name: 'Basic', limit: 100, fee: 0 },
    { id: 2, name: 'Standard', limit: 500, fee: 5 },
    { id: 3, name: 'Premium', limit: 1000, fee: 10 },
    { id: 4, name: 'Gold', limit: 5000, fee: 20 },
    { id: 5, name: 'Platinum', limit: 10000, fee: 35 },
    { id: 6, name: 'Diamond', limit: 50000, fee: 50 },
    { id: 7, name: 'Ultimate', limit: 100000, fee: 75 },
  ];



  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [subs, setSubs] = useState(subscriptions);
  const [filteredSubs, setFilteredSubs] = useState(subscriptions);
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const filteredSubs = subs.filter(t =>
  //   t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   t.amount.toString().includes(searchTerm)
  // );

  useEffect(() => {

    loadUserContent()
    loadUserSubscriptions()
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

  const loadUserContent = async () => {
    try {
      const content = await fetchUserContent();
      setContentList(content);
      console.log("Content: "+ JSON.stringify(content))
    } catch (error) {
      console.error('Failed to fetch user content:', error);
      if (error.response?.status === 403) {
        // Unauthorized, token might be expired
        setTimeout(() => navigate('/'), 250);
      }
      // Handle error (e.g., show error message to user)
      setSnackbarMessage('Failed to fetch user content');
      setOpenSnackbar(true);
    }
  };

  const loadUserSubscriptions = async () => {
    try {
      const subscriptions = await fetchSubscriptions();
      setSubscriptionList(subscriptions);
      setSubs(subscriptions)
      console.log("Subscriptions: "+ JSON.stringify(subscriptions))
    } catch (error) {
      console.error('Failed to fetch user content:', error);
      if (error.response?.status === 403) {
        // Unauthorized, token might be expired
        setTimeout(() => navigate('/'), 250);
      }
      // Handle error (e.g., show error message to user)
      setSnackbarMessage('Failed to fetch user content');
      setOpenSnackbar(true);
    }
  };

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

  const handleDelete = async (contentId) => {
    try {
      await handleDeleteContent(contentId);
      loadUserContent(); // Reload the content list after deletion
    } catch (error) {
      console.error('Failed to delete content:', error);
      // Handle error (e.g., show error message to user)
      setSnackbarMessage('Failed to delete content');
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmitNewContent(newContent);
      setNewContent({ title: '', username: thisUser.username, cost: 1, description: '', content: '', type: 'url', reference_id: '' });
      loadUserContent(); // Reload the content list after adding new content
    } catch (error) {
      console.error('Failed to add content:', error);
      // Handle error (e.g., show error message to user)
      setSnackbarMessage('Failed to load add content');
      setOpenSnackbar(true);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmitNewEdit(newContent);
      setNewContent({ title: '', username: thisUser.username, cost: 1, description: '', content: '', type: 'url', reference_id: '' });
      setEditing(false);
      loadUserContent(); // Reload the content list after adding new content
    } catch (error) {
      console.error('Failed to add content:', error);
      // Handle error (e.g., show error message to user)
      setSnackbarMessage('Failed to load add content');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (item) => {
    // e.preventDefault();
    try {
      // await handleSubmitNewContent(newContent);
      setEditing(true)
      setNewContent({ title: item.title, username: thisUser.username, cost: item.cost, description: item.description, content: (item.content.content), type: item.type, reference_id: '' });
      // loadUserContent(); // Reload the content list after adding new content
    } catch (error) {
      console.error('Failed to edit content:', error);
      // Handle error (e.g., show error message to user)
      setSnackbarMessage('Failed to edit content');
      setOpenSnackbar(true);
    }
  };

  const cancelEdit = (item) => {
    // e.preventDefault();
    try {
      // await handleSubmitNewContent(newContent);
      setEditing(false)
      setNewContent({ title: '', username: thisUser.username, cost: 1, description: '', content: '', type: 'url', reference_id: '' });
      // loadUserContent(); // Reload the content list after adding new content
    } catch (error) {
      console.error('Failed to edit content:', error);
      // Handle error (e.g., show error message to user)
      setSnackbarMessage('Failed to edit content');
      setOpenSnackbar(true);
    }
  };

  const searchSubscriptions = () => {
    const filtered = subs.filter(s => {
      return (
        s.host_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.cost.toString().includes(searchTerm)
      );
    });
    setFilteredSubs(filtered);
  };

  const handleSearchSubs = () => {
    searchSubscriptions();
  };

  const searchContent = () => {
    const filtered = contentList.filter(c => {
      return (
        c.host_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cost.toString().includes(searchTerm)
      );
    });
    setFilteredContent(filtered);
  };

  const handleSearchContent = () => {
    searchContent();
  };

  const sortSubscriptions = (subscriptionsToSort) => {
    return [...subscriptionsToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case 'username':
          aValue = a.recieving_user.toLowerCase();
          bValue = b.recieving_user.toLowerCase();
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortContent = (contentToSort) => {
    return [...contentToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case 'username':
          aValue = a.recieving_user.toLowerCase();
          bValue = b.recieving_user.toLowerCase();
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };


  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Your Stuff</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Typography variant="h6" gutterBottom>Current Balance: ₡{walletData?.balance}</Typography>
          <Typography variant="body1" gutterBottom>Account Tier: {walletData?.accountTier}</Typography>
          <Typography variant="body1" gutterBottom>Daily Transaction Limit: ₡{walletData?.dailyTransactionLimit}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <TableContainer component={Paper}>
            <Typography variant="h4" gutterBottom>My Unlocked Content</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSearchContent}>
                    Search
                </Button>
                <strong style={{ padding: "15px" }}>Filter:</strong>
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    variant="outlined"
                >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="username">Username</MenuItem>
                </Select>
                <strong style={{ padding: "15px" }}>Sort:</strong>
                <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    variant="outlined"
                >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog('reload')}>
                    Create New Content
                </Button>
            </Box>
            <Table style={{ background: "lightGreen", borderRadius: "5px", gap: "3px", padding: "5px", margin: "2px" }}>
              <TableHead>
                <TableRow style={{ backgroundColor: "lightgrey", borderRadius: 10 }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: "cyan", borderRadius: 10 }}>
                {contentList && contentList.map((item) => (
                  <TableRow key={item.id} style={{ backgroundColor: "lightblue", borderRadius: 5 }}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.created_at.slice(0,10)}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.host_username}</TableCell>
                    
                    <TableCell>${item.cost}</TableCell>
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
        <br></br>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          {/* <Typography variant="h4" gutterBottom>My Subscriptions</Typography> */}
          <TableContainer component={Paper}>
            <Typography variant="h4" gutterBottom>My Subscriptions</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSearchSubs}>
                    Search
                </Button>
                <strong style={{ padding: "15px" }}>Filter:</strong>
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    variant="outlined"
                >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="username">Username</MenuItem>
                </Select>
                <strong style={{ padding: "15px" }}>Sort:</strong>
                <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    variant="outlined"
                >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog('reload')}>
                    Create New Content
                </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "lightgrey", borderRadius: 10 }}>
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
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(sub.id)}>
                        <DeleteIcon style={{ paddingRight: "5px", fontSize: 24 }} />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleEdit(sub)}>
                        <EditNoteIcon style={{ paddingLeft: "5px" }} />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleShare(sub)}>
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