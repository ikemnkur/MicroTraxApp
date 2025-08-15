// src/components/Subscriptions.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, TextField, Button, Select, Snackbar, Paper, MenuItem, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import { Delete as DeleteIcon, EditNote as EditNoteIcon, Share as ShareIcon } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import Clipboard from "./Clipboard.js";
import axios from 'axios';
import { fetchUserSubscriptions } from './api.js';
import { v4 as uuidv4 } from 'uuid';
// import useBaseUrl from '../hooks/useBaseUrl.js';

const Subscriptions = () => {


  // Mock data - replace with actual data fetching
  const subscriptions = [
    { id: 1, date: '2023-08-18', name: "YT Channel", type: 'Daily', username: 'user1', AccountID: "ACC132145936", amount: 1 },
    { id: 2, date: '2023-08-17', name: " GameHub Sub", type: 'Monthly', username: 'user2', AccountID: "ACC132145936", amount: 2 },
    { id: 3, date: '2023-08-17', name: "Cool Artilces.com", type: 'Weekly', username: 'user3', AccountID: "ACC132145936", amount: 4 },
    // ... more subs
  ];

  const navigate = useNavigate();

  // State variables for managing subscriptions and UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [subs, setSubs] = useState(subscriptions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [openShareDialog, setOpenShareDialog] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [shareLink, setShareLink] = useState('');
  const [shareItem, setShareItem] = useState('');

  const [editing, setEditing] = useState(false);
  const [thisUser] = useState(JSON.parse(localStorage.getItem("userdata")));

  // State for new or edited subscription
  const [newSubscription, setNewSubscription] = useState({
    username: thisUser.username,
    hostuser_id: thisUser.id,
    title: '',
    cost: 1,
    frequency: '',
    description: '',
    content: '',
    type: 'url',
    reference_id: uuidv4(),
    id: 0,
    account_id: thisUser.account_id
  });

  const API_URL = process.env.REACT_APP_API_SERVER_URL + '/api';
  // const baseUrl = useBaseUrl();

  let siteURL = ""; //useBaseUrl();
  if (typeof window !== 'undefined') {
    siteURL = window.location.origin;
  } else {
    siteURL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
  }


  // Function to load user subscriptions from the server
  const loadSubscriptions = async () => {
    try {
      let data;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL + '/public-subscriptions/get', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubs(response.data);
        setFilteredSubs(response.data);
        data = response.data
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setSnackbarMessage('Failed to load any subscriptions.');
        setOpenSnackbar(true);
        setSubs([]);
        setFilteredSubs([]);
      }

      console.log("Subscriptions Data: ", data);
      // if (data == undefined) {
      //   setFilteredSubs([]);
      // } else {
      //   setFilteredSubs(data);
      // }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
      setError('Failed to load any subscriptions. Please try again later.');
      setLoading(false);
    }
  };


  // Load subscriptions on component mount
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const data = await fetchSubscriptions();
        console.log("Subsc. History Data: ", data)
        setSubs(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch Subscriptions:', err);
        setError('Failed to load Subscriptions history. Please try again later.');
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscription(prev => ({ ...prev, [name]: name === 'cost' ? parseInt(value) : value }));
  };


  // Search subscriptions based on the search term
  const searchSubscriptions = () => {
    const filtered = subs.filter(sub => {
      return (
        sub.host_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.cost.toString().includes(searchTerm) ||
        sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.created_at.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredSubs(filtered);
  };

  const handleSearch = () => {
    searchSubscriptions();
  };

  // Delete a subscription
  const handleDelete = async (subId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/public-subscriptions/delete/${subId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Delete Subscription Response: ", response);
        loadSubscriptions();
      } catch (error) {
        console.error('Failed to delete subscription:', error);
        setSnackbarMessage('Failed to delete subscription.');
        setOpenSnackbar(true);
      }
    }
  };

  // Create a new subscription
  const handleCreateSub = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/public-subscriptions/create`, newSubscription, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Create Subscription Response: ", response);

      // Reset form and close dialog
      setNewSubscription({
        username: thisUser.username,
        hostuser_id: thisUser.id,
        title: '',
        cost: 1,
        frequency: '',
        description: '',
        content: '',
        type: 'url',
        reference_id: ''
      });
      setOpenDialog(false);
      loadSubscriptions();

    } catch (error) {
      console.error('Failed to create subscription:', error);
      setSnackbarMessage('Failed to create subscription.');
      setOpenSnackbar(true);
    }
  };

  // Edit an existing subscription
  const handleEdit = (item) => {
    setEditing(true);
    setNewSubscription({
      username: thisUser.username,
      hostuser_id: thisUser.id,
      title: item.title,
      cost: item.cost,
      frequency: item.frequency,
      description: item.description,
      content: item.content,
      type: item.type,
      reference_id: item.reference_id
    });
    setOpenDialog(true);
  };

  // Submit edited subscription
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/public-subscriptions/edit`, newSubscription, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Edit Subscription Response: ", response);
      setSnackbarMessage("Successfully updated Subscription Service")

      // Reset form and close dialog
      setNewSubscription({
        username: thisUser.username,
        hostuser_id: thisUser.id,
        title: '',
        cost: 1,
        frequency: '',
        description: '',
        content: '',
        type: 'url',
        reference_id: ''
      });
      setEditing(false);
      setOpenDialog(false);
      loadSubscriptions();
    } catch (error) {
      console.error('Failed to update subscription');
      setSnackbarMessage('Failed to update subscription.');
      setOpenSnackbar(true);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditing(false);
    setNewSubscription({
      username: thisUser.username,
      hostuser_id: thisUser.id,
      title: '',
      cost: 1,
      frequency: '',
      description: '',
      content: '',
      type: 'url',
      reference_id: ''
    });
    setOpenDialog(false);
  };


  // State variables for sharing functionality
  // const [shareLink, setShareLink] = useState('');
  const [openShareDialog, setOpenShareDialog] = useState(false);

  // Share a subscription
  const handleShare = (item) => {
    const link = `${siteURL}/subscribe/${item.reference_id}`; // Corrected URL
    setShareLink(link);
    setOpenShareDialog(true);
  };


  return (
    <Box>
      <Typography variant="h4" gutterBottom>Manage Subscription Services</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="date">Date</MenuItem>

          <MenuItem value="cost">Cost</MenuItem>

          <MenuItem value="username">Username</MenuItem>
        </Select>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Create Subscription
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>

              <TableCell>Description</TableCell>
              <TableCell>Create Date</TableCell>
              {/* <TableCell>Create Time</TableCell> */}
              <TableCell>Frequency</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && filteredSubs && (filteredSubs.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.title}</TableCell>
                <TableCell>{sub.description}</TableCell>
                <TableCell>{sub.created_at.slice(0, 10)}</TableCell>
                {/* <TableCell>{sub.created_at.slice(11, 19)}</TableCell> */}
                <TableCell>{sub.frequency}</TableCell>
                <TableCell>₡{sub.cost}</TableCell>
                <TableCell>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(sub.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(sub)}>
                    <EditNoteIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="share" onClick={() => handleShare(sub)}>
                    <ShareIcon />

                  </IconButton>
                </TableCell>
              </TableRow>
            )))}
            {filteredSubs.length === 0 && (
              <TableRow>
                <TableCell colSpan={16} align="center">
                  No content available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for creating/editing subscription */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          style: {
            width: '512px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
        }}
      >
        <DialogTitle>{editing ? 'Edit Subscription Service' : 'Create Subscription Service'}</DialogTitle>
        <DialogContent style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>

          <form onSubmit={editing ? handleSubmitEdit : handleCreateSub}>
            <TextField
              label="Title"
              name="title"
              value={newSubscription.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Cost"
              name="cost"
              type="number"
              value={newSubscription.cost}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <Select
              label="Subscription Type"
              name="frequency"
              value={newSubscription.frequency}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{
                name: 'frequency',
              }}
            >
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Quarterly">Quarterly</MenuItem>
            </Select>
            <TextField
              label="Description"
              name="description"
              value={newSubscription.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              label="Content"
              name="content"
              value={newSubscription.content}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              rows={3}
              multiline
              required
              helperText="Enter URL, text, or file path based on content type"
            />
            <Select
              label="Media Type"
              name="type"
              value={newSubscription.type}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              inputProps={{
                name: 'type',
              }}
            >
              <MenuItem value="url">Website/Blog</MenuItem>
              <MenuItem value="software">Software</MenuItem>
              <MenuItem value="game">Game</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="music">Music</MenuItem>
            </Select>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              {editing ? (

                <>
                  <Button onClick={cancelEdit} variant="contained" color="secondary" sx={{ mr: 2 }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button type="submit" variant="contained" color="primary">
                  Add Subscription
                </Button>
              )}
            </Box>
          </form>
        </DialogContent>
      </Dialog>

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
        <DialogTitle>Share Subscription</DialogTitle>
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
            Share this subscription:
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Subscriptions;
