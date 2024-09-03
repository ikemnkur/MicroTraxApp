import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, Box, Grid, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { username } = useParams(); // Get username from URL if available

  useEffect(() => {
    fetchConversations();
    if (username) {
      startNewConversation(username);
    }
  }, [username]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations');
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const startNewConversation = async (username) => {
    try {
      const response = await axios.post('/api/messages/conversations', { username });
      const newConversation = response.data;
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      fetchMessages(newConversation.id);
    } catch (error) {
      console.error('Error starting new conversation:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`/api/messages/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    fetchMessages(conv.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedConversation) {
      try {
        await axios.post(`/api/messages/conversations/${selectedConversation.id}/messages`, { content: message });
        setMessage('');
        fetchMessages(selectedConversation.id);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Messages</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper>
            <List>
              {conversations.map((conv) => (
                <ListItem
                  button
                  key={conv.id}
                  selected={selectedConversation && selectedConversation.id === conv.id}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <ListItemAvatar>
                    <Avatar>{conv.other_participants[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={conv.other_participants} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <React.Fragment>
                <Typography variant="h6" gutterBottom>{selectedConversation.other_participants}</Typography>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                  {messages.map((msg) => (
                    <Box key={msg.id} sx={{ mb: 1, textAlign: msg.sender_username === selectedConversation.other_participants ? 'left' : 'right' }}>
                      <Paper sx={{ display: 'inline-block', p: 1, bgcolor: msg.sender_username === selectedConversation.other_participants ? 'grey.200' : 'primary.light' }}>
                        <Typography>{msg.content}</Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
                <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                    Send
                  </Button>
                </form>
              </React.Fragment>
            ) : (
              <Typography>Select a conversation to start messaging</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Messages;