
require('dotenv').config();
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
  TextField,
  Select,
  Snackbar,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, EditNote as EditNoteIcon, Share as ShareIcon } from '@mui/icons-material';
import {
  fetchUserContent,
  fetchUserSubscriptions,
  handleDeleteUserContent,
  // handleSubmitNewContent_YourStuff,
  // handleSubmitNewEdit_YourStuff,
  fetchWalletData,
} from './api';
import Clipboard from './Clipboard.js'; // If you have a Clipboard component
import QRCode from 'qrcode.react'; // If you use QR codes
import axios from 'axios';
import { useAuthCheck } from './useAuthCheck';
import useBaseUrl from '../hooks/useBaseUrl.js';

const API_URL = process.env.REACT_APP_API_SERVER_URL + '/api';
const siteURL = useBaseUrl();

const YourStuff = () => {

  const [searchTermContent, setSearchTermContent] = useState('');
  const [searchTermSub, setSearchTermSub] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [editing, setEditing] = useState(false);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [subs, setSubs] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  const [newContent, setNewContent] = useState({
    title: '',
    username: '',
    cost: 1,
    description: '',
    content: '',
    type: 'url',
    reference_id: '',
  });

  const [userSubscription, setUserSubscription] = useState({
    username: "",
    hostuser_id: "",
    title: '',
    cost: 1,
    frequency: '',
    description: '',
    content: '',
    type: 'url',
    reference_id: "",
    id: 0,
    account_id: ""
  });

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  useAuthCheck();

  const thisUser = { username: walletData?.username || 'CurrentUser' };

  useEffect(() => {
    loadUserContent();
    loadUserSubscriptions();
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

  // const setUserData = async () => {
  //   try {
  //       let data;
  //       try {
  //         const token = localStorage.getItem('token');
  //         let ud = JSON.parse(localStorage.getItem("userdata"))
  //         console.log("CL: ", contentList.length);
  //         console.log("SL: ", subscriptionList.length);

  //         const response = await axios.put(API_URL+'/user-data', {CL: 2, SL: 3, UD: ud}, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         setSubs(response.data);
  //         data = response.data
  //       } catch (error) {
  //         console.error('Error sending content and subscriptions data back:', error);
  //         setSnackbarMessage('Failed to send back data.');
  //         setOpenSnackbar(true);   
  //         setSubs([]);
  //       }

  //     // console.log("Subscriptions Data: ", data);

  //     // setFilteredSubs(data);
  //     // setLoading(false);
  //   } catch (err) {
  //     console.error('Failed to send user-data:', err);
  //     // setError('Failed to load subscriptions. Please try again later.');
  //     // setLoading(false);
  //   }
  // };

  // useEffect(() => {
  // setTimeout(() => {
  //   setUserData()
  // }, 250);
  // }, []);


  // Function to load content from the server
  const loadUserContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user-content/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setContentList(data);
      setFilteredContent(data);
      // setLoading(false);
    } catch (err) {
      console.error('Failed to fetch content:', err);
      setError('Failed to load content. Please try again later.');
      // setLoading(false);
    }
  };


  const loadUserSubscriptions = async () => {
    try {
      const subscriptions = await fetchUserSubscriptions();
      // const token = localStorage.getItem('token');
      // const subscriptions = await axios.get(`${API_URL}/user-subscriptions/get`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      setSubs(subscriptions);
      setFilteredSubs(subscriptions);
      console.log('Subscriptions: ' + JSON.stringify(subscriptions));
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      if (error.response?.status === 403) {
        setTimeout(() => navigate('/'), 250);
      }
      setSnackbarMessage('Failed to fetch subscriptions');
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
      setTimeout(() => navigate('/'), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubscription = async (contentId) => {
    try {
      // let response = await handleDeleteUserContent(contentId);

      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/user-subscriptions/delete/${subId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Delete User Subscription Response: ", response);
      // console.log("Delete User Sub: ", response)
      loadUserContent();
    } catch (error) {
      console.error('Failed to delete content:', error);
      setSnackbarMessage('Failed to delete content');
      setOpenSnackbar(true);
    }
  };


  const [shareLink, setShareLink] = useState('');
  const [shareItem, setShareItem] = useState('');
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const handleShare = (item, type) => {
    // Implement sharing functionality here
    console.log(item)
    if (type === "content") {
      setShareLink(`${siteURL}/unlock/${item.reference_id}`);
    }
    if (type === "subscription") {
      setShareLink(`${siteURL}/subscription/${item.reference_id}`);
    }

    try {
      setShareItem({ title: item.title, username: thisUser.username, cost: item.cost, description: item.description, content: (item.content.content), type: item.type, reference_id: '' });
    } catch (error) {
      console.error('Failed to share content:', error);
      // Handle error (e.g., show error message to user)
      setSnackbarMessage('Failed to generate share content');
      setOpenSnackbar(true);
    }
    console.log('Share item:', item)
    setOpenShareDialog(true);
  };

  const searchSubscriptions = () => {
    const filtered = subs.filter((s) => {
      return (
        s.host_username.toLowerCase().includes(searchTermSub.toLowerCase()) ||
        s.cost.toString().includes(searchTermSub) ||
        s.title.toLowerCase().includes(searchTermSub.toLowerCase())
      );
    });
    setFilteredSubs(filtered);
  };

  const handleSearchSubs = () => {
    searchSubscriptions();
  };

  const searchContent = () => {
    const filtered = contentList.filter((c) => {
      return (
        c.host_username.toLowerCase().includes(searchTermContent.toLowerCase()) ||
        c.cost.toString().includes(searchTermContent) ||
        c.title.toLowerCase().includes(searchTermContent.toLowerCase())
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
          aValue = parseFloat(a.cost);
          bValue = parseFloat(b.cost);
          break;
        case 'username':
          aValue = a.host_username.toLowerCase();
          bValue = b.host_username.toLowerCase();
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
          aValue = parseFloat(a.cost);
          bValue = parseFloat(b.cost);
          break;
        case 'username':
          aValue = a.host_username.toLowerCase();
          bValue = b.host_username.toLowerCase();
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

  const contentToDisplay = sortContent(filteredContent);
  const subscriptionsToDisplay = sortSubscriptions(filteredSubs);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h3" gutterBottom>
          Your Stuff
        </Typography>
        <Box sx={{ display: 'block', justifyContent: 'space-around', mt: 2, padding: "5px" }}>
          <Typography variant="h6" gutterBottom>
            Current Balance: ₡{walletData?.balance}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Account Tier: {walletData?.accountTier}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Daily Transaction Limit: ₡{walletData?.dailyTransactionLimit}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <TableContainer component={Paper}>
            <Typography variant="h4" gutterBottom>
              My Unlocked Content
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Search"
                variant="outlined"
                value={searchTermContent}
                onChange={(e) => setSearchTermContent(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSearchContent}>
                Search
              </Button>
              <strong style={{ padding: '15px' }}>Filter:</strong>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} variant="outlined">
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="username">Username</MenuItem>
              </Select>
              <strong style={{ padding: '15px' }}>Sort:</strong>
              <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} variant="outlined">
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
              {/* <Button variant="contained" color="primary" onClick={() => handleOpenDialog('create')}>
                Create New Content
              </Button> */}
            </Box>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: 'lightgrey', borderRadius: 10 }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Host User</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contentToDisplay && contentToDisplay.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.created_at.slice(0, 10)}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.host_username}</TableCell>
                    <TableCell>${parseFloat(item.cost).toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteUserContent(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                      {/* <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(item)}>
                        <EditNoteIcon />
                      </IconButton> */}
                      <IconButton edge="end" aria-label="share" onClick={() => handleShare(item, "content")}>
                        <ShareIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {contentToDisplay.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No content found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ mt: 4 }}>
          <TableContainer component={Paper}>
            <Typography variant="h4" gutterBottom>
              My Subscriptions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Search"
                variant="outlined"
                value={searchTermSub}
                onChange={(e) => setSearchTermSub(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSearchSubs}>
                Search
              </Button>
              <strong style={{ padding: '15px' }}>Filter:</strong>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} variant="outlined">
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="username">Username</MenuItem>
              </Select>
              <strong style={{ padding: '15px' }}>Sort:</strong>
              <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} variant="outlined">
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </Box>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: 'lightgrey', borderRadius: 10 }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Host User</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptionsToDisplay && subscriptionsToDisplay.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.title}</TableCell>
                    <TableCell>{sub.created_at.slice(0, 10)}</TableCell>
                    <TableCell>{sub.type}</TableCell>
                    <TableCell>{sub.host_username}</TableCell>
                    <TableCell>${parseFloat(sub.cost).toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSubscription(sub.id)}>
                        <DeleteIcon />
                      </IconButton>
                      {/* <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(sub)}>
                        <EditNoteIcon />
                      </IconButton> */}
                      <IconButton edge="end" aria-label="share" onClick={() => handleShare(sub, "subscription")}>
                        <ShareIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {subscriptionsToDisplay.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No subscriptions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* Dialog for sharing subscription */}
      <Dialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
        PaperProps={{
          style: {
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
        }}
      >
        <DialogTitle>Share this item to others</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center', // Center vertically
            textAlign: 'center',
          }}
        >
          <DialogContentText>
            Share this item:
          </DialogContentText>
          {shareLink && (
            <>
              <Box sx={{ my: 2 }}>
                <QRCode value={shareLink} size={256} />
              </Box>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Clipboard Item={shareLink} />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={() => setOpenShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

     

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

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default YourStuff;
