// In Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Grid, Paper, Box, CircularProgress, Snackbar } from '@mui/material';
import { fetchDashboardData } from './api';
import { fetchUserProfile } from './api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    encryptionKey: '',
    accountTier: 1,
    profilePicture: null
  });
  const [tier, setTier] = useState(true);
  const navigate = useNavigate();



  // useEffect(() => {
  //   const loadUserProfile = async () => {
  //     try {
  //       const profile = await fetchUserProfile();
  //       setUserData(prevData => ({
  //         ...prevData,
  //         ...profile,
  //         birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
  //       }));
  //       localStorage.setItem("userdata", JSON.stringify(userData))
  //       console.log("Account Tier: ", profile.accountTier)
  //       setTier(parseInt(userData.accountTier))
  //     } catch (error) {
  //       console.error('DashBrdPG - Error fetching user profile:', error);
  //       setSnackbarMessage(error.response?.data?.message || 'Failed to load user profile, refresh page or login again');
  //       setOpenSnackbar(true);
  //       if (error.response?.status === 401) {
  //         // Unauthorized, token might be expired
  //         setTimeout(() => navigate('/login'), 1500);
  //       }
  //     }
  //   };
  //   loadUserProfile();
  // }, [navigate]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        
        const updatedUserData = {
          ...profile,
          birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
        };
  
        setUserData(updatedUserData);
        localStorage.setItem("userdata", JSON.stringify(updatedUserData));
        
        console.log("Account Tier: ", profile.accountTier);
        setTier(parseInt(profile.accountTier));
  
      } catch (error) {
        console.error('DashBrdPG - Error fetching user profile:', error);
        setSnackbarMessage(error.response?.data?.message || 'Failed to load user profile, refresh page or login again');
        setOpenSnackbar(true);
        if (error.response?.status === 401) {
          // Unauthorized, token might be expired
          setTimeout(() => navigate('/login'), 1500);
        }
      }
    };
  
    loadUserProfile();
  }, [navigate]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data, Please Re-Login');
        setTimeout(() => {
          navigate("/login");
          setOpenSnackbar(true);
        }, 1500)
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Balance
            </Typography>
            <Typography variant="h4">
              {/* ${dashboardData?.balance?.toFixed(2) ?? 'N/A'} */}
              ${dashboardData?.balance ?? 'N/A'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Tier
            </Typography>
            <Typography variant="h4">
              Tier {dashboardData?.accountTier ?? 'N/A'}
            </Typography>
          </Paper>
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Account Tier
            </Typography>
            <Typography variant="h4">
              Tier {dashboardData?.accountTier ?? 'N/A'}
            </Typography>
          </Paper>
        </Grid> */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Daily Transactions Limits
            </Typography>
            <Typography>
              Sent Amount: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
              {/* <Typography>
                Times: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
              </Typography> */}
            </Typography>
            <Typography>
              Received: {dashboardData?.receivedTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
              {/* <Typography>
                Times: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
              </Typography> */}
            </Typography>

          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <Typography>
              Sent: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
            </Typography>

          </Paper>
        </Grid>

      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Link copied to clipboard!"
      />
    </Box>
  );
};

export default Dashboard;