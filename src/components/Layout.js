require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
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
  Tooltip,
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
  LockOutlined,
  BookmarkAdd,
} from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import { fetchUserProfile } from './api';



const drawerWidth = 260;
const collapsedDrawerWidth = 60;

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/Dashboard' },
    { text: 'Your Wallet', icon: <AccountBalance />, path: '/wallet' },
    { text: 'Send Money', icon: <Send />, path: '/send' },
    { text: 'Look for Users', icon: <Search />, path: '/search' },
    { text: 'Share Your Wallet', icon: <Share />, path: '/share' },
    // { text: 'Received Payments', icon: <Inbox />, path: '/received' },
    { text: 'Transaction History', icon: <History />, path: '/transactions' },




    // { text: 'Messages', icon: <Message />, path: '/messages' },

    { text: 'Published Content', icon: <LockOutlined />, path: '/manage-content' },
    { text: 'Public Subscriptions', icon: <BookmarkAdd />, path: '/manage-subscriptions' },
    { text: 'Your Stuff', icon: <CategoryIcon />, path: '/your-stuff' },
    { text: 'Account', icon: <AccountCircle />, path: '/account' },
  ];

  const hideLayout = ['/login', '/register'].includes(location.pathname);

  if (hideLayout) {
    return children;
  } else {
    // useEffect(() => {
    const loadDashboardData = async () => {
      try {

        const profile = await fetchUserProfile();

        const updatedUserData = {
          ...profile,
          birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
          accountTier: profile.accountTier || 1, // Ensure accountTier is set
          encryptionKey: profile.encryptionKey || '' // Ensure encryptionKey is set
        };

        // setUserData(updatedUserData);
        localStorage.setItem("userdata", JSON.stringify(updatedUserData));

      } catch (err) {
        console.log("Error: ", err)
        // alert('Failed to load dashboard data, Please Re-Login');
        setTimeout(() => {
          navigate("/login");
          // setOpenSnackbar(true);
        }, 250)
      } finally {
        // setIsLoading(false);
      }
    };

    setTimeout(() => {
      loadDashboardData();
      // navigate("/login");
      // setOpenSnackbar(true);
    }, 250)
    // loadDashboardData();
    // }, []);
  }




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
          width: open ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: 'width 0.3s',
          },
        }}
        open={open}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <Tooltip title={open ? '' : item.text} placement="right" key={item.text}>
                <ListItem
                  button
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={open ? item.text : ''}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;