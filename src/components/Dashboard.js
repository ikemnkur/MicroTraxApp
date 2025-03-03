// // In Dashboard.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Typography, Grid, Paper, Box, CircularProgress, Snackbar } from '@mui/material';
// import { fetchDashboardData } from './api';
// import { fetchUserProfile } from './api';
// import Notifications from './Notifications'; // Import the Notifications component

// const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     birthDate: '',
//     encryptionKey: '',
//     accountTier: 1,
//     profilePicture: null
//   });
//   const [tier, setTier] = useState(true);
//   const navigate = useNavigate();


//   console.log("dashboard data: ", dashboardData)


//   useEffect(() => {
//     const loadUserProfile = async () => {
//       try {
//         const profile = await fetchUserProfile();
//         setProfile(profile);
//         const updatedUserData = {
//           ...profile,
//           birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
//         };

//         setUserData(updatedUserData);
//         localStorage.setItem("userdata", JSON.stringify(updatedUserData));

//         console.log("Account Tier: ", profile.accountTier);
//         setTier(parseInt(profile.accountTier));

//       } catch (error) {
//         console.error('DashBrdPG - Error fetching user profile:', error);
//         setSnackbarMessage(error.response?.data?.message || 'Failed to load user profile, refresh page or login again');
//         setOpenSnackbar(true);
//         if (error.response?.status === 401) {
//           // Unauthorized, token might be expired
//           setTimeout(() => navigate('/login'), 500);
//         }
//       }
//     };

//     loadUserProfile();
//   }, [navigate]);



//   useEffect(() => {
//     const loadDashboardData = async () => {
//       try {
//         const data = await fetchDashboardData();
//         setDashboardData(data);
//       } catch (err) {
//         setError('Failed to load dashboard data, Please Re-Login');
//         // setTimeout(() => {
//         //   navigate("/login");
//         //   setOpenSnackbar(true);
//         // }, 500)
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadDashboardData();
//   }, []);

//   if (isLoading) {
//     return <CircularProgress />;
//   }

//   if (error) {
//     return <Typography color="error">{error}</Typography>;
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Dashboard
//       </Typography>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h5" gutterBottom>
//               Balance: {dashboardData?.balance ?? 'N/A'}₡ 
//             </Typography>
//             <Typography variant="h6">
//               {/* ${dashboardData?.balance?.toFixed(2) ?? 'N/A'} */}
//               {/* {dashboardData?.balance ?? 'N/A'}₡  */}
//               <Typography variant="h6">Spendable: {dashboardData?. spendable ?? 0}</Typography>
//               <Typography variant="h6"> Redeemable: {dashboardData?.redeemable ?? 0} </Typography>



//             </Typography>
//           </Paper>
//         </Grid>
//         {/* <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Account Tier
//             </Typography>
//             <Typography variant="h4">
//               Tier {dashboardData?.accountTier ?? 'N/A'}
//             </Typography>
//           </Paper>
//         </Grid> */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Transactions Limits
//             </Typography>
//             <Typography>
//               Times Sent: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
//               {/* <Typography>
//                 Times: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
//               </Typography> */}
//             </Typography>
//             <Typography>
//               Times Received: {dashboardData?.receivedTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
//               {/* <Typography>
//                 Times: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
//               </Typography> */}
//             </Typography>

//           </Paper>
//         </Grid>
//         {/* <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Subscriptions
//             </Typography>
//             <Typography variant="h4">
//               Count: {profile?.subscriptions ?? 'N/A'}
//             </Typography>
//           </Paper>
//         </Grid> */}
//         {/* <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Unlocked Content
//             </Typography>
//             <Typography variant="h4">
//               Count: {profile?.unlocks ?? 'N/A'}
//             </Typography>
//           </Paper>
//         </Grid> */}
//         {/* <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Account Tier
//             </Typography>
//             <Typography variant="h4">
//               Tier {dashboardData?.accountTier ?? 'N/A'}
//             </Typography>
//           </Paper>
//         </Grid> */}

//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Recent Transactions
//             </Typography>
//             <Typography>
//               Sent: {dashboardData?.sentTransactions ?? 0}₡
//             </Typography>
//             <Typography>
//               Received: {dashboardData?.sentTransactions ?? 0}₡
//             </Typography>

//           </Paper>
//         </Grid>

//       </Grid>
//        {/* Insert Notifications component below the cards */}
//        <Notifications />
//       <Snackbar
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={() => setOpenSnackbar(false)}
//         message="Link copied to clipboard!"
//       />
//     </Box>
//   );
// };

// export default Dashboard;

// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Grid, Paper, Box, CircularProgress, Snackbar } from '@mui/material';
import { fetchDashboardData } from './api';
import { fetchUserProfile } from './api';
import Notifications from './Notifications';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
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

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileRes = await fetchUserProfile();
        setProfile(profileRes);

        const updatedUserData = {
          ...profileRes,
          birthDate: profileRes.birthDate ? profileRes.birthDate.split('T')[0] : '',
        };

        setUserData(updatedUserData);
        localStorage.setItem('userdata', JSON.stringify(updatedUserData));

        // Convert account tier to int and store
        setTier(parseInt(profileRes.accountTier));
      } catch (err) {
        console.error('DashBrdPG - Error fetching user profile:', err);
        setSnackbarMessage(err.response?.data?.message || 'Failed to load user profile, refresh page or login again');
        setOpenSnackbar(true);
        if (err.response?.status === 401) {
          // Unauthorized, token might be expired
          setTimeout(() => navigate('/login'), 500);
        }
      }
    };

    loadUserProfile();
  }, [navigate]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        console.log('Fetched dashboard data:', data); // Debug log
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data, Please Re-Login');
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
        {/* Balance, spendable, redeemable */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Balance: {(dashboardData?.spendable + dashboardData?.redeemable) ?? 'N/A'}₡
            </Typography>
            <Typography variant="h6">
              Spendable: {dashboardData?.spendable ?? 0}₡
            </Typography>
            <Typography variant="h6">
              Redeemable: {dashboardData?.redeemable ?? 0}₡
            </Typography>
          </Paper>
        </Grid>

        {/* Transaction limits */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Limits
            </Typography>
            <Typography>
              Times Sent Today: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
            </Typography>
            <Typography>
              {/* Coins Sent Today: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyCoinLimit ?? 'N/A'} */}
            </Typography>
            <Typography>
              Times Received Today: {dashboardData?.receivedTransactions ?? 0} / {dashboardData?.dailyLimit ?? 'N/A'}
            </Typography>
            <Typography>
              {/* Coins Received Today: {dashboardData?.sentTransactions ?? 0} / {dashboardData?.dailyCoinLimit ?? 'N/A'} */}
            </Typography>
          </Paper>
        </Grid>

        {/* Recent transactions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <Typography>
              Sent in last 24h: {dashboardData?.totalAmountSentLast24Hours ?? 0} / {dashboardData?.dailyCoinLimit ?? 'N/A'}₡
            </Typography>
            <Typography>
              Received in last 24h: {dashboardData?.totalAmountReceivedLast24Hours ?? 0} / {dashboardData?.dailyCoinLimit ?? 'N/A'}₡

            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Insert Notifications component below the cards */}
      <Notifications />
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

export default Dashboard;