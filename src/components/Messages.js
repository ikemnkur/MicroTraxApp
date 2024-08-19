import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, Box, Grid } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch conversations - replace with actual API call
    setConversations([
      { id: 1, username: 'user1', avatar: '/path/to/avatar1.jpg', messages: [] },
      { id: 2, username: 'user2', avatar: '/path/to/avatar2.jpg', messages: [] },
    ]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && selectedConversation) {
      // Send message logic here
      console.log('Sending message to', selectedConversation.username, ':', message);
      setMessage('');
    }
  };

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
                  // selected={selectedConversation?.id === conv.id}
                  selected={selectedConversation && selectedConversation.id === conv.id}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <ListItemAvatar>
                    <Avatar src={conv.avatar} alt={conv.username} />
                  </ListItemAvatar>
                  <ListItemText primary={conv.username} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <React.Fragment>
                <Typography variant="h6" gutterBottom>{selectedConversation.username}</Typography>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                  {selectedConversation.messages.map((msg, index) => (
                    <Box key={index} sx={{ mb: 1, textAlign: msg.sent ? 'right' : 'left' }}>
                      <Paper sx={{ display: 'inline-block', p: 1, bgcolor: msg.sent ? 'primary.light' : 'grey.200' }}>
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