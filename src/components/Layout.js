import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  CssBaseline,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard,
  History,
  Send,
  Inbox,
  AccountBalance,
  Search,
  Share,
  Message,
  AccountCircle,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Transaction History', icon: <History />, path: '/transactions' },
    { text: 'Send Money', icon: <Send />, path: '/send' },
    { text: 'Received Payments', icon: <Inbox />, path: '/received' },
    { text: 'Wallet', icon: <AccountBalance />, path: '/wallet' },
    { text: 'Search User', icon: <Search />, path: '/search' },
    { text: 'Share Wallet', icon: <Share />, path: '/share' },
    { text: 'Messages', icon: <Message />, path: '/messages' },
    { text: 'Account', icon: <AccountCircle />, path: '/account' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            MicroPay
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/settings')}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', position: 'relative' },
        }}
        open={open}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} component={RouterLink} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;