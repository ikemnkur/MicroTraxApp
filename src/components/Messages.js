import React, { useState, useEffect, useRef } from 'react';
// import { ArrowForward } from '@mui/material'; // Add this to your imports
import { useNavigate } from 'react-router-dom'; // Add this if not already imported


import {
  Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, Paper, Box, Grid, CircularProgress, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, InputAdornment, Divider,
  Menu, MenuItem, Alert, Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon,
  Send as SendIcon, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon,
  Reply as ReplyIcon, Close as CloseIcon, Search as SearchIcon, MoreVert as MoreVertIcon,
  Block as BlockIcon, Delete as DeleteIcon, Schedule as ScheduleIcon, Clear as ClearIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [currentUserPic, setCurrentUserPic] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const [conversationSearch, setConversationSearch] = useState('');
  const [openNewChat, setOpenNewChat] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  // New states for user search functionality
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedSearchUser, setSelectedSearchUser] = useState(null);

  const messagesEndRef = useRef(null);
  const { username } = useParams();

  const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000';

  // Add this inside your component (before the return statement):
  const navigate = useNavigate();

  // Also update your handleProfileNavigation function:
  const handleProfileNavigation = (username, event) => {
    event.stopPropagation();
    navigate(`/user/${username}`);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
    if (username) {
      setSelectedUser(username);
      fetchConversation(username);
    }
  }, [username]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  // Filter conversations based on search
  useEffect(() => {
    if (conversationSearch.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conv => {
        // console.log('Filtering conversation (otherUser):', conv.otherUser);
        let temp = conv.otherUser.username || conv.otherUser.toLowerCase();
        return temp.includes(conversationSearch.toLowerCase()) ||
          (conv.lastMessage && conv.lastMessage.toLowerCase().includes(conversationSearch.toLowerCase()));
      });
      setFilteredConversations(filtered);
    }
  }, [conversations, conversationSearch]);

  // New useEffect for user search
  useEffect(() => {
    const searchUsers = async () => {
      if (searchUsername.length >= 3) {
        setSearchLoading(true);
        setSearchError('');
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/api/user/search?q=${encodeURIComponent(searchUsername)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSearchResults(response.data.users || []);
        } catch (error) {
          console.error('Error searching users:', error);
          setSearchError('Failed to search users. Please try again.');
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
        setSearchError('');
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchUsername]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchCurrentUser = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userdata') || '{}');
      setCurrentUser(userData.username || '');
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchConversation = async (otherUser) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/messages/conversation/${otherUser}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentConversation(response.data);

      // Mark messages as read
      await markMessagesAsRead(otherUser);
    } catch (error) {
      if (error.response?.status === 403) {
        setSnackbar({
          open: true,
          message: `This conversation is blocked by ${error.response.data.blockedBy}`,
          severity: 'warning'
        });
      }
      console.error('Error fetching conversation:', error);
    }
  };

  const markMessagesAsRead = async (otherUser) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/messages/mark-read`, { otherUser }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchConversations(); // Refresh to update unread counts
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSelectUser = (username) => {
    // get profile picture of the selected user
    const selectedConversation = conversations.find(conv => conv.otherUser.username === username);
    setSelectedUser(username);
    setCurrentUserPic(selectedConversation?.otherUser.profilePic || '');
    fetchConversation(username);
    setReplyingTo(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedUser) {
      try {
        const token = localStorage.getItem('token');

        await axios.post(`${API_URL}/api/messages/send`, {
          toUser: selectedUser,
          messageText: messageText.trim(),
          replyTo: replyingTo ? {
            id: replyingTo.id,
            text: replyingTo.text,
            sender: replyingTo.sender
          } : null
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMessageText('');
        setReplyingTo(null);
        fetchConversation(selectedUser);
        fetchConversations();
      } catch (error) {
        if (error.response?.status === 429) {
          setSnackbar({
            open: true,
            message: error.response.data.message,
            severity: 'warning'
          });
        } else if (error.response?.status === 403) {
          setSnackbar({
            open: true,
            message: 'Cannot send message. Conversation is blocked.',
            severity: 'error'
          });
        }
        console.error('Error sending message:', error);
      }
    }
  };

  const handleLikeMessage = async (messageId, currentLikeStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/messages/like`, {
        conversationId: currentConversation.conversationId,
        messageId,
        liked: !currentLikeStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchConversation(selectedUser);
    } catch (error) {
      console.error('Error liking message:', error);
    }
  };

  const handleBlockUser = async (block = true) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/messages/block`, {
        otherUser: selectedUser,
        block
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: `User ${block ? 'blocked' : 'unblocked'} successfully`,
        severity: 'success'
      });

      fetchConversation(selectedUser);
      fetchConversations();
      setMenuAnchor(null);
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };

  const handleDeleteConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/messages/conversation/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSnackbar({
        open: true,
        message: 'Conversation deleted successfully',
        severity: 'success'
      });

      setSelectedUser(null);
      setCurrentConversation(null);
      fetchConversations();
      setMenuAnchor(null);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  // Updated function to validate user existence
  const validateAndStartConversation = async (username) => {
    try {
      const token = localStorage.getItem('token');

      // Check if user exists
      const response = await axios.get(`${API_URL}/api/user/exists/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.exists) {
        setSelectedUser(username);
        setCurrentConversation({ messages: [], pendingResponse: false });
        setOpenNewChat(false);
        setSearchUsername('');
        setSearchResults([]);
        setSelectedSearchUser(null);
        setSearchError('');
      } else {
        setSearchError('User does not exist');
      }
    } catch (error) {
      console.error('Error validating user:', error);
      if (error.response?.status === 404) {
        setSearchError('User does not exist');
      } else {
        setSearchError('Failed to validate user. Please try again.');
      }
    }
  };

  const startNewConversation = async () => {
    const username = selectedSearchUser || searchUsername.trim();
    if (username) {
      await validateAndStartConversation(username);
    }
  };

  const handleSelectSearchUser = (user) => {
    setSelectedSearchUser(user.username);
    setSearchUsername(user.username);
  };

  const handleCloseNewChat = () => {
    setOpenNewChat(false);
    setSearchUsername('');
    setSearchResults([]);
    setSelectedSearchUser(null);
    setSearchError('');
  };

  const clearConversationSearch = () => {
    setConversationSearch('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const formatAutoDeleteTime = (timestamp) => {
    const deleteDate = new Date(timestamp);
    const now = new Date();
    const diffTime = deleteDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Soon';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  };

  const renderMessage = (msg, index) => {
    if (!currentConversation?.messages) return null;

    const isOwnMessage = msg.sender === currentUser;
    const isSystemMessage = msg.type === 'system';
    const showDate = index === 0 ||
      formatDate(msg.timestamp) !== formatDate(currentConversation.messages[index - 1]?.timestamp || msg.timestamp);

    if (isSystemMessage) {
      return (
        <Box key={msg.id} sx={{ textAlign: 'center', my: 2 }}>
          <Chip
            label={msg.text}
            size="small"
            color={msg.text.includes('blocked') ? 'error' : 'success'}
            variant="outlined"
          />
        </Box>
      );
    }

    return (
      <Box key={msg.id}>
        {showDate && (
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Chip label={formatDate(msg.timestamp)} size="small" />
          </Box>
        )}
        <Box sx={{
          mb: 1,
          display: 'flex',
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
          alignItems: 'flex-end'
        }}>
          <Box sx={{
            maxWidth: '70%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
          }}>
            {msg.replyTo && (
              <Paper sx={{
                p: 1,
                mb: 0.5,
                bgcolor: 'grey.100',
                borderLeft: 3,
                borderColor: 'primary.main',
                maxWidth: '100%'
              }}>
                <Typography variant="caption" color="primary">
                  Replying to {msg.replyTo.sender}:
                </Typography>
                <Typography variant="body2" sx={{
                  fontStyle: 'italic',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {msg.replyTo.text}
                </Typography>
              </Paper>
            )}
            <Paper sx={{
              p: 1.5,
              bgcolor: isOwnMessage ? 'primary.main' : 'grey.200',
              color: isOwnMessage ? 'white' : 'text.primary',
              borderRadius: 2,
              position: 'relative'
            }}>
              <Typography variant="body1">{msg.text}</Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 0.5
              }}>
                <Typography variant="caption" sx={{
                  opacity: 0.7,
                  color: isOwnMessage ? 'inherit' : 'text.secondary'
                }}>
                  {formatTime(msg.timestamp)}
                  {msg.read && isOwnMessage && ' • Read'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleLikeMessage(msg.id, msg.liked)}
                    sx={{ color: isOwnMessage ? 'inherit' : 'text.secondary' }}
                  >
                    {msg.liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleReply(msg)}
                    sx={{ color: isOwnMessage ? 'inherit' : 'text.secondary' }}
                  >
                    <ReplyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>Messages</Typography>

      <Grid container spacing={2} sx={{ height: '80vh' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpenNewChat(true)}
                sx={{ mb: 2 }}
              >
                New Chat
              </Button>

              {/* Search Bar */}
              <TextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                value={conversationSearch}
                onChange={(e) => setConversationSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: conversationSearch && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearConversationSearch}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />
            </Box>
            <Divider />
            {/* // Modified List component: */}
            {/* // Updated List component with profile pictures: */}
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <ListItem
                    button
                    key={conv.otherUser.username}
                    selected={selectedUser === conv.otherUser.username}
                    onClick={() => handleSelectUser(conv.otherUser.username)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover .profile-arrow': {
                        opacity: 1,
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={conv.otherUser.profilePic}
                        alt={conv.otherUser.username}
                      >
                        {conv.otherUser.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {conv.otherUser.username}
                          </Typography>
                          {conv.isBlocked && (
                            <Chip label="Blocked" size="small" color="error" />
                          )}
                          {conv.pendingResponse && (
                            <Chip label="Waiting" size="small" color="warning" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {conv.lastMessage || 'No messages yet'}
                          </Typography>
                          {conv.autoDeleteAt && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <ScheduleIcon fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                Auto-delete in {formatAutoDeleteTime(conv.autoDeleteAt)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {conv.unreadCount > 0 && (
                        <Chip
                          label={conv.unreadCount}
                          size="small"
                          color="primary"
                        />
                      )}
                      <IconButton
                        className="profile-arrow"
                        size="small"
                        onClick={(event) => handleProfileNavigation(conv.otherUser.username, event)}
                        sx={{
                          opacity: 0.7,
                          transition: 'opacity 0.2s ease',
                          '&:hover': {
                            opacity: 1,
                            backgroundColor: 'action.hover'
                          }
                        }}
                        title={`View ${conv.otherUser.username}'s profile`}
                      >
                        <ArrowForwardIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="text.secondary" align="center">
                        {conversationSearch ? 'No conversations found' : 'No conversations yet'}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Messages Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedUser ? (
              <>
                {/* Header */}
                <Box sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}> {/* <ListItemAvatar> */}
                  <Avatar style={{ marginRight: '-65%' }}
                    src={currentUserPic}
                    alt={selectedUser}
                  >
                    {selectedUser.charAt(0).toUpperCase()}
                  </Avatar>
                  {/* </ListItemAvatar> */}
                  <Box>

                    <Typography variant="h6">{selectedUser}</Typography>
                    {currentConversation?.pendingResponse && (
                      <Typography variant="caption" color="warning.main">
                        Waiting for response before you can send another message
                      </Typography>
                    )}
                    {currentConversation?.autoDeleteAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Auto-delete in {formatAutoDeleteTime(currentConversation.autoDeleteAt)}
                      </Typography>
                    )}
                  </Box>
                  <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                {/* Messages */}
                <Box sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {currentConversation?.status?.includes('blocked') && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      This conversation is blocked by {currentConversation.status === 'blocked_by_user1' ?
                        (currentConversation.user1 === currentUser ? 'you' : currentConversation.user1) :
                        (currentConversation.user2 === currentUser ? 'you' : currentConversation.user2)
                      }
                    </Alert>
                  )}

                  {currentConversation?.messages?.length > 0 ? (
                    currentConversation.messages.map((msg, index) => renderMessage(msg, index))
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%'
                    }}>
                      <Typography color="text.secondary">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Reply Preview */}
                {replyingTo && (
                  <Box sx={{ p: 1, bgcolor: 'grey.50', borderTop: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="primary">
                          Replying to {replyingTo.sender}:
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          {replyingTo.text}
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => setReplyingTo(null)}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {/* Message Input */}
                {!currentConversation?.status?.includes('blocked') && (
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
                      <TextField
                        fullWidth
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={currentConversation?.pendingResponse ?
                          "Wait for response..." : "Type your message..."
                        }
                        variant="outlined"
                        size="small"
                        multiline
                        maxRows={4}
                        disabled={currentConversation?.pendingResponse}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        endIcon={<SendIcon />}
                        disabled={!messageText.trim() || currentConversation?.pendingResponse}
                      >
                        Send
                      </Button>
                    </form>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}>
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleBlockUser(true)}>
          <BlockIcon sx={{ mr: 1 }} />
          Block User
        </MenuItem>
        <MenuItem onClick={() => handleBlockUser(false)}>
          <BlockIcon sx={{ mr: 1 }} />
          Unblock User
        </MenuItem>
        <MenuItem onClick={handleDeleteConversation} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Conversation
        </MenuItem>
      </Menu>

      {/* Enhanced New Chat Dialog */}
      <Dialog
        open={openNewChat}
        onClose={handleCloseNewChat}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { minHeight: '60vh', maxHeight: '80vh' }
        }}
      >
        <DialogTitle>Start New Conversation</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Search Users"
            fullWidth
            variant="outlined"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Type at least 3 characters to search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchLoading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
            error={!!searchError}
            helperText={searchError || (searchUsername.length > 0 && searchUsername.length < 3 ? 'Type at least 3 characters' : '')}
            sx={{ mb: 2 }}
          />

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                Search Results ({searchResults.length})
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  maxHeight: '300px'
                }}
              >
                <List dense>
                  {searchResults.map((user) => (
                    <ListItem
                      key={user.username}
                      button
                      selected={selectedSearchUser === user.username}
                      onClick={() => handleSelectSearchUser(user)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={user.profilePic}
                          alt={user.username}
                          sx={{ width: 40, height: 40 }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {user.username}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            {user.firstName && user.lastName && (
                              <Typography variant="body2" color="text.secondary">
                                {user.firstName} {user.lastName}
                              </Typography>
                            )}
                            {user.bio && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {user.bio}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      {user.isOnline && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'success.main',
                            ml: 1,
                          }}
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}

          {/* No Results Message */}
          {searchUsername.length >= 3 && !searchLoading && searchResults.length === 0 && !searchError && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No users found matching "{searchUsername}"
              </Typography>
            </Box>
          )}

          {/* Help Text */}
          {searchUsername.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Search for users to start a new conversation
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseNewChat}>
            Cancel
          </Button>
          <Button
            onClick={startNewConversation}
            variant="contained"
            disabled={!searchUsername.trim() || searchLoading}
          >
            {selectedSearchUser ? `Start Chat with ${selectedSearchUser}` : 'Start Chat'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Messages;