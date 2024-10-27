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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [snoozedNotifications, setSnoozedNotifications] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  // Mock notifications data
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'money_received',
        message: 'You received ₡500 from JohnDoe.',
        timestamp: new Date(),
        isNew: true,
        link: '/transactions',
      },
      {
        id: 2,
        type: 'balance_reloaded',
        message: 'Your balance was reloaded with ₡1000.',
        timestamp: new Date(),
        isNew: true,
        link: '/account',
      },
      {
        id: 3,
        type: 'item_unlocked',
        message: 'JaneDoe paid to unlock your item.',
        timestamp: new Date(),
        isNew: true,
        link: '/items/unlocked',
      },
      // Add more mock notifications as needed
    ];

    setNotifications(mockNotifications);
  }, []);

  // Handle Dismiss Notification
  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    setSnackbarMessage('Notification dismissed');
    setOpenSnackbar(true);
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
  const handleView = (link) => {
    navigate(link);
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
                  secondary={notif.timestamp.toLocaleString()}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="view"
                    onClick={() => handleView(notif.link)}
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
