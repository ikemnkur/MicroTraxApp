import React, { useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  FormControl,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Snackbar,
} from '@mui/material';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    emailFrequency: 'daily',
    textNotifications: true,
    newsletterSubscription: true,
    paymentNotifications: true,
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value !== undefined ? value : checked
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Saving settings:', settings);
    setOpenSnackbar(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.darkMode}
                onChange={handleChange}
                name="darkMode"
              />
            }
            label="Dark Mode"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Email Frequency</InputLabel>
            <Select
              value={settings.emailFrequency}
              onChange={handleChange}
              name="emailFrequency"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={settings.textNotifications}
                onChange={handleChange}
                name="textNotifications"
              />
            }
            label="Text Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.newsletterSubscription}
                onChange={handleChange}
                name="newsletterSubscription"
              />
            }
            label="Newsletter Subscription"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.paymentNotifications}
                onChange={handleChange}
                name="paymentNotifications"
              />
            }
            label="Payment Notifications"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Save Settings
          </Button>
        </form>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Settings saved successfully!"
      />
    </Box>
  );
};

export default Settings;