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
import useBaseUrl from '../hooks/useBaseUrl.js';

const Subscriptions = () => {
  const navigate = useNavigate();

  // State variables for managing subscriptions and UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [subs, setSubs] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
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
  const baseUrl = useBaseUrl();

  // Function to load user subscriptions from the server
  const loadSubscriptions = async () => {
    try {
        let data;
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(API_URL+'/public-subscriptions/get', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSubs(response.data);
          data = response.data
        } catch (error) {
          console.error('Error fetching subscriptions:', error);
          setSnackbarMessage('Failed to load subscriptions.');
          setOpenSnackbar(true);   
          setSubs([]);
        }
      
      console.log("Subscriptions Data: ", data);
   
      setFilteredSubs(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
      setError('Failed to load subscriptions. Please try again later.');
      setLoading(false);
    }
  };

  // Load subscriptions on component mount
  useEffect(() => {
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
      const response = await axios.put(`${API_URL}/public-subscriptions/edit/${newSubscription.reference_id}`, newSubscription, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Edit Subscription Response: ", response);

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
      console.error('Failed to update subscription:', error);
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
  const [shareLink, setShareLink] = useState('');
  const [openShareDialog, setOpenShareDialog] = useState(false);

  // Share a subscription
  const handleShare = (item) => {
    const link = `${siteURL}/sub/${item.reference_id}`; // Corrected URL
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
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <strong style={{ padding: "15px" }}>Filter:</strong>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="cost">Cost</MenuItem>
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
              <TableCell>Create Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && filteredSubs.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.title}</TableCell>
                <TableCell>{sub.description}</TableCell>
                <TableCell>{sub.created_at.slice(0, 10)}</TableCell>
                <TableCell>{sub.created_at.slice(11, 19)}</TableCell>
                <TableCell>{sub.type}</TableCell>
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
            ))}
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
