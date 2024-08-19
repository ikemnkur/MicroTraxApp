import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, ListItemIcon, Container, CssBaseline } from '@mui/material';
import { Dashboard, History, Send, Inbox, AccountBalance, Search, Share, Message, AccountCircle } from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Transaction History', icon: <History />, path: '/transactions' },
  { text: 'Send Money', icon: <Send />, path: '/send' },
  { text: 'Received Payments', icon: <Inbox />, path: '/received' },
  { text: 'Wallet', icon: <AccountBalance />, path: '/wallet' },
  { text: 'Search User', icon: <Search />, path: '/search' },
  { text: 'Share Wallet', icon: <Share />, path: '/share' },
  { text: 'Messages', icon: <Message />, path: '/messages' },
  { text: 'Account Tier', icon: <AccountCircle />, path: '/account-tier' },
];

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            MicroPay
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: '24px' }}>
        <Toolbar />
        <Container>{children}</Container>
      </main>
    </div>
  );
};

export default Layout;