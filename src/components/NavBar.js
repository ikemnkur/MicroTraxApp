// src/components/NavBar.js
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
  AccountBalance,
  Search,
  Share,
  AccountCircle,
  Settings as SettingsIcon,
  LockOutlined,
  BookmarkAdd,
  LogoutOutlined,
} from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import { fetchUserProfile } from './api';

const drawerWidth = 190;
const collapsedDrawerWidth = 40;

const NavBar = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/Dashboard' },
    { text: 'Your Wallet', icon: <AccountBalance />, path: '/wallet' },
    { text: 'Send Coins', icon: <Send />, path: '/send' },
    { text: 'Look for Users', icon: <Search />, path: '/search' },
    { text: 'Share Your Wallet', icon: <Share />, path: '/share' },
    { text: 'Transaction History', icon: <History />, path: '/transactions' },
    { text: 'Published Content', icon: <LockOutlined />, path: '/manage-content' },
    // { text: 'Public Subscriptions', icon: <BookmarkAdd />, path: '/manage-subscriptions' },
    { text: 'Your Stuff', icon: <CategoryIcon />, path: '/your-stuff' },
    { text: 'Account', icon: <AccountCircle />, path: '/account' },
  ];

  const unlockPage = location.pathname.startsWith('/unlock');
  const subPage = location.pathname.startsWith('/sub');
  const hideNavBar = ['/login', '/register', '/'].includes(location.pathname);

  function refreshPage() {
    window.location.reload(false);
  }

  useEffect(() => {
    if (hideNavBar || unlockPage || subPage) {
      // Do nothing if NavBar is hidden
      return;
    }

    const loadDashboardData = async () => {
      try {
        const profile = await fetchUserProfile('NavBar');
        const updatedUserData = {
          ...profile,
          birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
          accountTier: profile.accountTier || 1,
          encryptionKey: profile.encryptionKey || '',
        };
        localStorage.setItem('userdata', JSON.stringify(updatedUserData));
      } catch (err) {
        console.log('Error: ', err);
        setTimeout(() => {
          navigate('/login');
          refreshPage();
        }, 250);
      }
    };

    loadDashboardData();
  }, [navigate, location.pathname, hideNavBar, unlockPage, subPage]);

  if (hideNavBar || unlockPage || subPage) {
    return children;
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
            sx={{ mr: 1 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center' }}
          >
            Clout Coin
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/settings')}>
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/account')}>
            <AccountCircle />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/login')}>
            <LogoutOutlined />
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
                    // Change horizontal padding to 5px
                    px: '5px',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      // Change icon margin to 5px
                      mr: open ? '5px' : 'auto',
                      justifyContent: 'center',
                      px: '5px',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={open ? item.text : ''}
                    sx={{ opacity: open ? 1 : 0,
                      px: '05px 10px 10px 0px',
                     }}
                     style={{paddingTop: 5}}
                  />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
          },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default NavBar;