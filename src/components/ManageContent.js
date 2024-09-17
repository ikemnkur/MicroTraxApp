import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Select, Snackbar, MenuItem, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle } from '@mui/material';
import { Delete as DeleteIcon, EditAttributesRounded } from '@mui/icons-material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShareIcon from '@mui/icons-material/Share';
import { fetchUserContent, handleDeleteContent, handleSubmitNewContent, handleSubmitNewEdit } from './api';
import QRCode from 'qrcode.react';
import Clipboard from "../components/Clipboard.js";
import axios from 'axios';
import { lightGreen } from '@mui/material/colors';

const ManageContent = () => {
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [contentData, setContentData] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [contentList, setContentList] = useState([]);
    const [editing, setEditing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [shareItem, setShareItem] = useState('');
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

    useEffect(() => {
        loadUserContent();
    }, []);

    const loadUserContent = async () => {
        try {
            const content = await fetchUserContent();
            setContentList(content);
        } catch (error) {
            console.error('Failed to fetch user content:', error);
            if (error.response?.status === 403) {
                // Unauthorized, token might be expired
                setTimeout(() => navigate('/'), 1250);
            }
            // Handle error (e.g., show error message to user)
            setSnackbarMessage('Failed to fetch user content');
            setOpenSnackbar(true);
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


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContent(prev => ({ ...prev, [name]: name === 'cost' ? parseInt(value) : value }));
    };

    const handleShare = (item) => {
        // e.preventDefault();
        try {
           createShareLink(item.id)
           setShareItem({ title: item.title, username: thisUser.username, cost: item.cost, description: item.description, content: (item.content.content), type: item.type, reference_id: '' });
        } catch (error) {
            console.error('Failed to share content:', error);
            // Handle error (e.g., show error message to user)
            setSnackbarMessage('Failed to generate share content');
            setOpenSnackbar(true);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Unlockable Content</Typography>
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Create Unlockable Content</Typography>
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
                >
                    <MenuItem value="url">URL</MenuItem>
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="code">Code</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="file">File</MenuItem>
                </Select>
                {!editing && (
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Add Content
                    </Button>
                )}
                {editing && (
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

            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Your Content</Typography>
            <List style={{ gap: "3px" }}>
                {contentList && contentList.map((item) => (
                    <>
                        <div>
                            <ListItem key={item.id} style={{ background: "lightGreen", borderRadius: "5px", gap: "3px", padding: "5px", margin: "2px" }}>
                                <ListItemText
                                    primary={item.title}
                                    secondary={`Cost: $${item.cost} | Type: ${item.type} | Item Id: ${item.reference_id}`}
                                />
                                <ListItemSecondaryAction style={{ gap: "10px" }}>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
                                        <DeleteIcon style={{ paddingRight: "5px", fontSize: 24 }} />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleEdit(item)}>
                                        <EditNoteIcon style={{ paddingLeft: "5px" }} />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleShare(item)}>
                                        <ShareIcon style={{ paddingLeft: "5px" }} />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </div>

                        <br></br>
                    </>

                ))}
            </List>
         
            <Dialog
                open={openDialog}
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
            
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </Box>

    );
};

export default ManageContent;