// Notifications.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
} from '@mui/material';
import { Close, Snooze, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [snoozedNotifications, setSnoozedNotifications] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_SERVER_URL+'/api'; // Adjust this if your API URL is different

  // Fetch notifications from the backend API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL+'/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setSnackbarMessage('Failed to load notifications.');
        setOpenSnackbar(true);
      }
    };

    fetchNotifications();
  }, []);

  // Handle Dismiss Notification
  const handleDismiss = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(API_URL+`/notifications/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setSnackbarMessage('Notification dismissed');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setSnackbarMessage('Failed to dismiss notification.');
      setOpenSnackbar(true);
    }
  };

  // Handle Snooze Notification
  const handleSnooze = (id) => {
    const snoozedNotif = notifications.find((notif) => notif.id === id);
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    setSnoozedNotifications((prev) => [...prev, snoozedNotif]);

    setSnackbarMessage('Notification snoozed for 1 hour');
    setOpenSnackbar(true);

    // Show the notification again after 1 hour
    setTimeout(() => {
      setNotifications((prev) => [...prev, snoozedNotif]);
      setSnoozedNotifications((prev) =>
        prev.filter((notif) => notif.id !== id)
      );
    }, 3600000); // 1 hour in milliseconds
  };

  // Handle View Notification
  const handleView = (notification) => {
    // Navigate to the relevant page based on notification type
    switch (notification.type) {
      case 'money_received':
        navigate('/transactions');
        break;
      case 'balance_reloaded':
        navigate('/account');
        break;
      case 'item_unlocked':
        navigate('/items/unlocked');
        break;
      // Add cases for other notification types
      default:
        navigate('/');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      {notifications.length > 0 ? (
        <Paper>
          <List>
            {notifications.map((notif) => (
              <ListItem key={notif.id} alignItems="flex-start">
                <ListItemText
                  primary={notif.message}
                  secondary={new Date(notif.created_at).toLocaleString()}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="view"
                    onClick={() => handleView(notif)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="snooze"
                    onClick={() => handleSnooze(notif.id)}
                  >
                    <Snooze />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="dismiss"
                    onClick={() => handleDismiss(notif.id)}
                  >
                    <Close />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant="body1">No new notifications.</Typography>
      )}

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

export default Notifications;
