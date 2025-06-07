require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Card,
  CardContent,
  CardMedia,
  Link,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  EditNote as EditNoteIcon,
  Share as ShareIcon,
  Visibility,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  fetchUserContent,
  fetchUserSubscriptions,
  handleDeleteUserContent,
  fetchWalletData,
} from './api.js';
import Clipboard from './Clipboard.js';
import QRCode from 'qrcode.react';
import axios from 'axios';
import { useAuthCheck } from './useAuthCheck.js';
import { lightBlue } from '@mui/material/colors';

const API_URL = process.env.REACT_APP_API_SERVER_URL + '/api';

let siteURL = "";
if (typeof window !== 'undefined') {
  siteURL = window.location.origin;
} else {
  siteURL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
}

const OtherUserStuff = () => {
  const navigate = useNavigate();
  useAuthCheck();

  const [searchTermContent, setSearchTermContent] = useState('');
  const [searchTermSub, setSearchTermSub] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [editing, setEditing] = useState(false);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userdata')) || {});
  const [subs, setSubs] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [ud] = useState(JSON.parse(localStorage.getItem("userdata")));

  // New state for view content modal
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewingContent, setViewingContent] = useState(null);

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

  const [shareLink, setShareLink] = useState('');
  const [shareItem, setShareItem] = useState('');
  const [openShareDialog, setOpenShareDialog] = useState(false);

  // For now, using walletData username or default
  // const thisUser = { username: walletData?.username || 'CurrentUser' };
  
  const otherUsername = useParams().user;  // Changed from .username to .user
  console.log("Other Username: ", otherUsername);

  useEffect(() => {
    if (otherUsername) {  // Add this check to ensure username exists
      loadOtherUserContent(otherUsername);
    } else {
      // If no username, stop loading and show error
      setIsLoading(false);
      setError('No username provided');
    }
  }, [otherUsername]);  // Add otherUsername as dependency

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

  const loadOtherUserContent = async (otherUsername) => {
    setIsLoading(true); // Set loading to true when starting
    setError(null); // Clear any previous errors
    
    console.log("Loading content for user:", otherUsername);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user-content/getOther/${otherUsername}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      console.log(`${otherUsername}'s Stuff Data:`, data);
      setContentList(data);
      setFilteredContent(data);
    } catch (err) {
      console.error('Failed to fetch content:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setIsLoading(false); // Always set loading to false when done
    }
  };

  const loadOtherUserSubscriptions = async () => {
    try {
      const subscriptions = await fetchUserSubscriptions();
      setSubs(subscriptions);
      setFilteredSubs(subscriptions);
      console.log('Subscriptions: ', JSON.stringify(subscriptions));
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      if (error.response?.status === 403) {
        setTimeout(() => navigate('/'), 250);
      }
      setSnackbarMessage('Failed to fetch subscriptions');
      setOpenSnackbar(true);
    }
  };

  const handleShare = (item, type) => {
    console.log(item);
    if (type === "content") {
      setShareLink(`${siteURL}/unlock/${item.reference_id}`);
    }
    if (type === "subscription") {
      setShareLink(`${siteURL}/subscription/${item.reference_id}`);
    }
    try {
      setShareItem({
        title: item.title,
        username: otherUsername,
        cost: item.cost,
        description: item.description,
        content: item.content?.content,
        type: item.type,
        reference_id: '',
      });
    } catch (error) {
      console.error('Failed to share content:', error);
      setSnackbarMessage('Failed to generate share content');
      setOpenSnackbar(true);
    }
    console.log('Share item:', item);
    setOpenShareDialog(true);
  };

  const searchContent = () => {
    const filtered = contentList.filter((c) =>
      c.host_username.toLowerCase().includes(searchTermContent.toLowerCase()) ||
      c.cost.toString().includes(searchTermContent) ||
      c.title.toLowerCase().includes(searchTermContent.toLowerCase())
    );
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

  const handleViewContent = (item) => {
    setViewingContent(item);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewingContent(null);
  };

  const renderContentPreview = (content) => {
    if (!content) return null;

    // Safely extract content data, handling nested content objects
    let contentData;
    if (typeof content.content === 'object' && content.content !== null) {
      contentData = content.content.content || JSON.stringify(content.content);
    } else {
      contentData = content.content || content;
    }

    // Ensure we have a string to display
    if (typeof contentData === 'object') {
      contentData = JSON.stringify(contentData);
    }

    switch (content.type) {
      case 'image':
        return (
          <Card sx={{ maxWidth: '100%', mb: 2 }}>
            <CardMedia
              component="img"
              height="300"
              image={String(contentData)}
              alt={content.title || 'Content image'}
              sx={{ objectFit: 'contain' }}
            />
          </Card>
        );

      case 'video':
        return (
          <Card sx={{ maxWidth: '100%', mb: 2 }}>
            <CardMedia
              component="video"
              height="300"
              src={String(contentData)}
              controls
              sx={{ objectFit: 'contain' }}
            />
          </Card>
        );

      case 'url':
        return (
          <Card sx={{ maxWidth: '100%', mb: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                URL Content:
              </Typography>
              <Link
                href={String(contentData)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ wordBreak: 'break-all' }}
              >
                <Typography variant="body1">
                  {String(contentData)}
                </Typography>
              </Link>
            </CardContent>
          </Card>
        );

      case 'text':
      default:
        return (
          <Card sx={{ maxWidth: '100%', mb: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Text Content:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {String(contentData)}
              </Typography>
            </CardContent>
          </Card>
        );
    }
  };

  const contentToDisplay = sortContent(filteredContent);
  const subscriptionsToDisplay = sortSubscriptions(filteredSubs);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Loading {otherUsername ? `${otherUsername}'s` : ''} content...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ mt: 2 }}>
          <TableContainer component={Paper} sx={{ backgroundColor: lightBlue[90] }}>
            <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
              {otherUsername ? `${otherUsername}'s Content` : 'User Content'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center', px: 2 }}>
              <TextField
                label="Search"
                variant="outlined"
                value={searchTermContent}
                onChange={(e) => setSearchTermContent(e.target.value)}
                sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' } }}
              />
              <Button variant="contained" color="primary" onClick={handleSearchContent}>
                Search
              </Button>
              <Typography sx={{ pt: 1 }}>Filter:</Typography>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                variant="outlined"
                size="small"
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="username">Username</MenuItem>
              </Select>
              <Typography sx={{ pt: 1 }}>Sort:</Typography>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                variant="outlined"
                size="small"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'lightgrey' }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contentToDisplay && contentToDisplay.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.created_at?.slice(0, 10)}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.cost}</TableCell>
                    <TableCell>
                      <IconButton aria-label="View" onClick={() => navigate(`/unlock/${item.reference_id}`)}>
                        <Visibility />
                      </IconButton>
                      <IconButton aria-label="share" onClick={() => handleShare(item, "content")}>
                        <ShareIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {contentToDisplay.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {otherUsername ? `No content found for ${otherUsername}.` : 'No content found.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

   
      {/* Share Dialog */}
      <Dialog
        open={openShareDialog}
        onClose={() => setOpenShareDialog(false)}
        PaperProps={{
          sx: {
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
            textAlign: 'center',
          }}
        >
          <DialogContentText>Share this item:</DialogContentText>
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
        <DialogActions sx={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={() => setOpenShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default OtherUserStuff;