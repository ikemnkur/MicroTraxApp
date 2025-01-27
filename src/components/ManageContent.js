// src/components/ManageContent.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, TextField, Button, Select, Snackbar, Paper, MenuItem, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import { Delete as DeleteIcon, EditNote as EditNoteIcon, Share as ShareIcon, SortByAlpha, SortTwoTone } from '@mui/icons-material';
import QRCode from 'qrcode.react';
import Clipboard from "./Clipboard.js";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
// import useBaseUrl from '../hooks/useBaseUrl';

const ManageContent = () => {
  const navigate = useNavigate();

  // State variables for managing content and UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [contentList, setContentList] = useState([]);
  const [filteredContentList, setFilteredContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [thisUser] = useState(JSON.parse(localStorage.getItem("userdata")));

  // State for new or edited content
  const [newContent, setNewContent] = useState({
    username: thisUser.username,
    hostuser_id: thisUser.id,
    title: '',
    cost: 1,
    description: '',
    content: '',
    type: 'url',
    reference_id: uuidv4(),
    id: 0,
    account_id: thisUser.account_id
  });

  const API_URL = process.env.REACT_APP_API_SERVER_URL + '/api';
  // const siteURL = useBaseUrl();

  let siteURL = ""; //useBaseUrl();
  if (typeof window !== 'undefined') {
    siteURL = window.location.origin;
  } else {
    siteURL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
  }

  // const getBaseUrl = () => {
  //   if (typeof window !== 'undefined') {
  //     return window.location.origin;
  //   }
  //   // Fallback for SSR or other environments
  //   return process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
  // };

  // const useBaseUrl = () => {
  //   const [baseUrl, setBaseUrl] = useState('');

  //   useEffect(() => {
  //     const url = getBaseUrl();
  //     setBaseUrl(url);
  //   }, []);

  //   return baseUrl;
  // };

  // Function to load content from the server
  const loadContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/public-content/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setContentList(data);
      setFilteredContentList(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch content:', err);
      setError('Failed to load content. Please try again later.');
      setLoading(false);
    }
  };

  // Load content on component mount
  useEffect(() => {
    loadContent();
  }, []);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContent(prev => ({ ...prev, [name]: name === 'cost' ? parseInt(value) : value }));
  };

  // Search content based on the search term
  const searchContent = () => {
    const filtered = contentList.filter(item => {
      return (
        item.host_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cost.toString().includes(searchTerm) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.created_at.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredContentList(filtered);
  };

  const handleSearch = () => {
    searchContent();
  };

  // Delete content
  const handleDelete = async (contentId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/public-content/delete/${contentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Delete Content Response: ", response);
        loadContent();
      } catch (error) {
        console.error('Failed to delete content:', error);
        setSnackbarMessage('Failed to delete content.');
        setOpenSnackbar(true);
      }
    }
  };

  // Create new content
  const handleCreateContent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/public-content/create`, newContent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Create Content Response: ", response);

      // Reset form and close dialog
      setNewContent({
        username: thisUser.username,
        hostuser_id: thisUser.id,
        title: '',
        cost: 1,
        description: '',
        content: '',
        type: 'url',
        reference_id: ''
      });
      setOpenDialog(false);
      loadContent();
    } catch (error) {
      console.error('Failed to create content:', error);
      setSnackbarMessage('Failed to create content.');
      setOpenSnackbar(true);
    }
  };

  // Edit existing content
  const handleEdit = (item) => {
    setEditing(true);
    setNewContent({
      username: thisUser.username,
      hostuser_id: thisUser.id,
      title: item.title,
      cost: item.cost,
      description: item.description,
      content: item.content.content,
      type: item.type,
      reference_id: item.reference_id,
      id: item.id
    });
    setOpenDialog(true);
  };

  // Submit edited content
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/public-content/edit`, newContent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Edit Content Response: ", response);
      setSnackbarMessage('Successfully updated content.');
      // Reset form and close dialog
      setNewContent({
        username: thisUser.username,
        hostuser_id: thisUser.id,
        title: '',
        cost: 1,
        description: '',
        content: '',
        type: 'url',
        reference_id: ''
      });
      setEditing(false);
      setOpenDialog(false);
      loadContent();
    } catch (error) {
      console.error('Failed to update content');
      setSnackbarMessage('Failed to update content.');
      setOpenSnackbar(true);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditing(false);
    setNewContent({
      username: thisUser.username,
      hostuser_id: thisUser.id,
      title: '',
      cost: 1,
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

  // Share content
  const handleShare = (item) => {
    setShareLink(`${siteURL}/unlock/${item.reference_id}`);
    setOpenShareDialog(true);
  };

  return (
    <Box> 
      <Paper sx={{ p: 2, pb: 8, mb: 2 }}>
      <Typography variant="h4" style={{ alignContent: "center" }} gutterBottom>Manage Unlockable Content</Typography>
      <Box sx={{ gap: 2, mb: 2, alignContent: "center" }}>

        <div style={{ display: 'flex', gap: 15, mb: 2, margin: "0" }}>
          {/* <strong style={{ padding: "15px" }}>Search:</strong>  */}
          <TextField style={{ width: "30%", }}
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>


          <SortByAlpha />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="cost">Cost</MenuItem>
            <MenuItem value="username">Username</MenuItem>
          </Select>
          {/* <strong style={{ padding: "15px" }}>Sort:</strong> */}
          <SortTwoTone />
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>


        </div>
        <br></br>
        <div style={{ display: 'flex', gap: 10, mb: 2 }}>
          {/* <strong style={{ padding: "15px" }}>Filter:</strong> */}
          {/* <IconButton edge="end" aria-label="share" onClick={() => handleShare(item)}> */}

          {/* </IconButton> */}


        </div>

      </Box>
      <div style={{ maxHeight: 480 }}>
        {/* Table container with a fixed max height */}
        <TableContainer
          component={Paper}
          style={{ maxHeight: 360, overflowY: "auto" }}
        >
          <Table stickyHeader>
          
            {/* If you want the header to stay visible, use stickyHeader on the <Table> */}
            <TableHead style={{background: "white"}}>  {/* Override the coloring with XXS */}
              <TableRow >
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            {/* Remove custom height/overflow from here */}
            <TableBody>
              {!loading && filteredContentList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.created_at.slice(0, 10)}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>₡{item.cost}</TableCell>
                  <TableCell
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <IconButton aria-label="delete" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={() => handleEdit(item)}>
                      <EditNoteIcon />
                    </IconButton>
                    <IconButton aria-label="share" onClick={() => handleShare(item)}>
                      <ShareIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredContentList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={16} align="center">
                    No content available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Button style={{ float: 'right', margin: "15px 0px" }} variant="contained" color="tertiary" onClick={() => setOpenDialog(true)}>
        CREATE NEW CONTENT
      </Button>

      </Paper>

      {/* Dialog for creating/editing content */}
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
        <DialogTitle>{editing ? 'Edit Content' : 'Create Content'}</DialogTitle>
        <DialogContent style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          <form onSubmit={editing ? handleSubmitEdit : handleCreateContent}>
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
              label="Content Type"
              name="type"
              value={newContent.type}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{
                name: 'type',
              }}
            >
              <MenuItem value="url">URL</MenuItem>
              <MenuItem value="image">Image</MenuItem>
              <MenuItem value="code">Code</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="file">File</MenuItem>
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
                  Add Content
                </Button>
              )}
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for sharing content */}
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
        <DialogTitle>Share Content</DialogTitle>
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
          <Button onClick={() => setOpenShareDialog(false)}>Close</Button>
        </DialogActions>
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
        <DialogTitle>Share Content</DialogTitle>
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
            Share this Content:
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

export default ManageContent;
