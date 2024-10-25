import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography, TextField, Button, Select, Snackbar, MenuItem, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Delete as DeleteIcon, EditAttributesRounded } from '@mui/icons-material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShareIcon from '@mui/icons-material/Share';
import { fetchUserContent,  handleDeletePublicContent,  handleSubmitNewPublicContent,  handleSubmitPublicContentEdit } from './api';
import QRCode from 'qrcode.react';
import Clipboard from "../components/Clipboard.js";
import axios from 'axios';
import { lightGreen } from '@mui/material/colors';

const ManageContent = () => {
    const navigate = useNavigate();
    // const [openDialog, setOpenDialog] = useState(false);
    const [action, setAction] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // const [contentData, setContentData] = useState(null);
    const [contentList, setContentList] = useState([]);
    const [filteredContentList, setFilteredContentList] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [editing, setEditing] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
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
        setShareLink(`http://localhost:3000/unlock/${id}`);
        setOpenShareDialog(true)
    }

    useEffect(() => {
        loadUserContent();
    }, []);

    const loadUserContent = async () => {
        try {
            const content = await fetchUserContent();
            setContentList(content);
            setFilteredContentList(content)
            console.log("Content: ", content)
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

    const handleOpenDialog = (selectedAction) => {
        setAction(selectedAction);
        setOpenCreateDialog(true);
    };

    const handleDelete = async (contentId) => {
        try {
            await  handleDeletePublicContent(contentId);
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
            await handleSubmitNewPublicContent(newContent);
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
            await handleSubmitPublicContentEdit(newContent);
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

    const handleEdit = async (item) => {
        // e.preventDefault();
        try {
            // fasdhandleSubmitNewPublicContent(newContent);
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

    const cancelEdit = async (item) => {
        // e.preventDefault();
        try {
            // await  handleSubmitNewPublicContent(newContent);
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
            createShareLink(item.reference_id)
            setShareItem({ title: item.title, username: thisUser.username, cost: item.cost, description: item.description, content: (item.content.content), type: item.type, reference_id: '' });
        } catch (error) {
            console.error('Failed to share content:', error);
            // Handle error (e.g., show error message to user)
            setSnackbarMessage('Failed to generate share content');
            setOpenSnackbar(true);
        }
    };

    const searchContent = () => {
        const filtered = contentList.filter(c => {
            return (
                c.host_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.cost.toString().includes(searchTerm)
            );
        });
        console.log("FC: " + JSON.stringify(filtered))
        setFilteredContentList(filtered);
    };

    const handleSearch = () => {
        searchContent();
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Unlockable Content</Typography>
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
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog('create')}>
                    Create New Content
                </Button>
            </Box>


            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Your Content</Typography>
            <List style={{ gap: "3px" }}>
                {filteredContentList && filteredContentList.map((item) => (
                    <>
                        <div>
                            <ListItem key={item.id} style={{ background: "lightGreen", borderRadius: "5px", gap: "3px", padding: "5px", margin: "2px" }}>
                                <ListItemText
                                    primary={item.title}
                                    secondary={`Cost: ₡${item.cost} | Type: ${item.type} | Item Id: ${item.reference_id}`}
                                />
                                <ListItemText
                                    secondary={`Content: ${item.content}`}
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
                    <Button onClick={() => setOpenShareDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
                PaperProps={{
                    style: {
                        width: '512px',
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
                        Create some content:
                    </DialogContentText>
                    {/* <Box sx={{ my: 2 }}>
                        <QRCode value={shareLink} size={256} />
                    </Box> */}

                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
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
                    </Box>
                </DialogContent>
                <DialogActions style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => setOpenCreateDialog(false)}>Close</Button>
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