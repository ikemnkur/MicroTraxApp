import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, TextField, Button, Select, Snackbar, Paper, MenuItem, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { Delete as DeleteIcon, EditAttributesRounded } from '@mui/icons-material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShareIcon from '@mui/icons-material/Share';
import { fetchUserContent, handleDeleteContent, handleSubmitNewContent, handleSubmitNewEdit } from './api.js';
import QRCode from 'qrcode.react';
import Clipboard from "./Clipboard.js";

import { fetchSubscriptions } from './api.js';

const Subscriptions = () => {

  // Mock data - replace with actual data fetching
  const subscriptions = [
    { id: 1, date: '2023-08-18', name: "YT Channel", type: 'Daily', username: 'user1', AccountID: "ACC132145936", amount: 1 },
    { id: 2, date: '2023-08-17', name: " GameHub Sub", type: 'Monthly', username: 'user2', AccountID: "ACC132145936", amount: 2 },
    { id: 3, date: '2023-08-17', name: "Cool Artilces.com", type: 'Weekly', username: 'user3', AccountID: "ACC132145936", amount: 4 },
    // ... more subs
  ];

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [subs, setSubs] = useState(subscriptions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [contentList, setContentList] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [shareItem, setShareItem] = useState('');
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [thisUser, setThisUser] = useState(JSON.parse(localStorage.getItem("userdata")))
  const [newContent, setNewContent] = useState({
    username: thisUser.username,
    title: '',
    cost: 1,
    description: '',
    content: '',
    type: 'url',
    reference_id: ''
  });

  const createShareLink = (id) => {
    setShareLink(`https://microtrax.com/unlock/${id}`);
    setOpenDialog(true)
  }

  // useEffect(() => {
  //   loadUserContent();
  // }, []);

  // const loadUserContent = async () => {
  //   try {
  //     const content = await fetchUserContent();
  //     setContentList(content);
  //   } catch (error) {
  //     console.error('Failed to fetch user content:', error);
  //     if (error.response?.status === 403) {
  //       // Unauthorized, token might be expired
  //       setTimeout(() => navigate('/'), 1250);
  //     }
  //     // Handle error (e.g., show error message to user)
  //     setSnackbarMessage('Failed to fetch user content');
  //     setOpenSnackbar(true);
  //   }
  // };


  const filteredSubs = subs.filter(t =>
    t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.amount.toString().includes(searchTerm)
  );

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContent(prev => ({ ...prev, [name]: name === 'cost' ? parseInt(value) : value }));
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Manage Subcsription Services</Typography>
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
          <MenuItem value="amount">Amount</MenuItem>
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
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog('reload')}>
          Create Subscription
        </Button>
      </Box>
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
        <DialogTitle>Create Subscription Service </DialogTitle>
        <DialogContent style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          <DialogContentText style={{ textAlign: 'center' }}>
            Share this content:
          </DialogContentText>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Title"
                name="title"
                value={newContent.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Cost"
                name="cost"
                type="number"
                value={newContent.cost}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
              />
               <Select
                label="Subscription Type"
                name="type"
                value={newContent.type}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Quaterly">Quaterly</MenuItem>
              </Select>
              <TextField
                label="Description"
                name="description"
                value={newContent.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
              <TextField
                label="Content"
                name="content"
                value={newContent.content}
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
                value={newContent.type}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                rows={3}
                multiline
                required
              >
                <MenuItem value="url">Website/Blog</MenuItem>
                <MenuItem value="software">Software</MenuItem>
                <MenuItem value="game">Game</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="music">Music</MenuItem>
              </Select>
              {!creating && (
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Add Content
                </Button>
              )}
              {creating && (
                <>
                  <Button onChange={handleSubmitEdit} variant="contained" color="primary" style={{ background: "green", marginRight: 10 }} sx={{ mt: 2 }}>
                    Edit
                  </Button>
                  <Button onClick={cancelEdit} ariant="contained" color="primary" style={{ color: "white", background: "red", marginRight: 0 }} sx={{ mt: 2 }}>
                    Cancel Edit
                  </Button>
                </>
              )}

            </form>
            {/* <Clipboard Item={shareLink} /> */}
          </Box>
        </DialogContent>
        <DialogActions style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openShareDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          style: {
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          },
        }}
      >
        <DialogTitle>Share Locked Item</DialogTitle>
        <DialogContent style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          <DialogContentText style={{ textAlign: 'center' }}>
            Share this content:
          </DialogContentText>
          <Box sx={{ my: 2 }}>
            <QRCode value={shareLink} size={256} />
          </Box>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Clipboard Item={shareLink} />
          </Box>
        </DialogContent>
        <DialogActions style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subscriptions;