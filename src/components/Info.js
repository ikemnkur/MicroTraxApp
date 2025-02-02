import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Snackbar,
  Button
} from '@mui/material';
import { fetchInfoData, fetchUserProfile } from './api';
import Notifications from './Notifications';

const Info = () => {
  const [InfoData, setInfoData] = useState(null);
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
          birthDate: profileRes.birthDate
            ? profileRes.birthDate.split('T')[0]
            : '',
        };
        setUserData(updatedUserData);
        localStorage.setItem('userdata', JSON.stringify(updatedUserData));

        // Convert account tier to int and store
        setTier(parseInt(profileRes.accountTier));
      } catch (err) {
        console.error('DashBrdPG - Error fetching user profile:', err);
        setSnackbarMessage(
          err.response?.data?.message ||
          'Failed to load user profile, please refresh or login again'
        );
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
    const loadInfoData = async () => {
      // try {
      // const data = await fetchInfoData();
      // setInfoData(data);
      // } catch (err) {
      //   setTimeout(() => navigate('/login'), 500);
      //   setError('Failed to load data, Please Re-Login');
      // } finally {
      setIsLoading(false);
      // }
    };
    loadInfoData();
  }, [navigate]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Inline styles, using MUI breakpoint-friendly approaches
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    margin: '0 auto',
    padding: '16px',
    maxWidth: '1200px',
  };

  // This Box will be responsive:
  // On small (xs) screens, it stacks papers (flexDirection="column"),
  // On medium (md) and up, it places them side-by-side (flexDirection="row").
  const responsiveBoxStyle = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 2, // MUI spacing notation
    marginTop: '16px',
  };

  // Helper style for the video container to make it mobile-friendly
  const responsiveVideoWrapper = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
  };

  const responsiveIframe = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
  };

  return (
    <Box sx={containerStyle}>
      <Typography variant="h4" gutterBottom>
        Info
      </Typography>

      {/* A flex container that holds the main info sections side-by-side on desktop, stacked on mobile */}
      <Box sx={responsiveBoxStyle}>
        {/* 1) Explanation Section */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            What is Clout Coin Club
          </Typography>
          <Typography variant="body1">
            It is a web app where users can upload content and monetize it. With Clout Coin,
            you can monetize anything digital. Have a link to share? At Clout Coin,
            anybody can monetize clout. If you have clout, sell it! People will do anything
            for clout—why not combine it with money?
          </Typography>
          {/* Responsive Video */}
          <Box sx={responsiveVideoWrapper}>
            <iframe
              style={responsiveIframe}
              src="https://www.youtube.com/embed/Q_KxEMxn2pc"
              title="Embedded Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        </Paper>

        {/* 2) News Section */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            News
          </Typography>
          <Typography variant="body1" gutterBottom>
            Welcome to our News & Info page! Here, you can share the latest updates,
            announcements, or articles. Customize this section with any relevant text
            or images you need.
          </Typography>

          {/* Responsive Video */}
          <Box sx={responsiveVideoWrapper}>
            <iframe
              style={responsiveIframe}
              src="https://www.youtube.com/embed/Q_KxEMxn2pc"
              title="Embedded Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
        </Paper>

        {/* 3) Usage Section */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            How to Use
          </Typography>
          <Typography variant="body1">• Buying Coins</Typography>
          <Typography variant="body1">• Sending Coins</Typography>
          <Typography variant="body1">• Unlocking Users' Content</Typography>
          <Typography variant="body1">• Creating Your Own Content</Typography>
          <Typography variant="body1">• Redeeming Coins</Typography>
        </Paper>
      </Box>

      {/* Support Section */}
      <Box mt={3}>
        <Typography variant="h4" gutterBottom>
          Need Help?
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>

          <Typography variant="body1">
            Submit a support ticket
          </Typography>
          <Button variant="contained">Support</Button>
          {/* TODO: Create Modal */}
        </Box>
      </Box>

      {/* Faq section */}
      {/* <Button variant="outlined">FAQ</Button> */}
      {/* Search bar */}
      <Box>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h" gutterBottom>
            Rules, FAQs, and Comments!
          </Typography>
          <Typography variant="h6">• Account Tiers
            <p>
              Account Tier help to allocate site and server resources for traffic on the site to remain stable and sustainable.
              <Typography variant="body1">  Q: What are the tiers and what features do they have ?</Typography>
              <Typography variant="body1">  A: .</Typography>
              <table>
                {/* TODO: Insert tier features table here */}
              </table>
            </p>
          </Typography>
          <Typography variant="h6">• Account Limits
            <p>Account Tier exist to limit the amount of traffic on the site from bieng to excessive
              <Typography variant="body1">  Q: Can I change the account limits that I currenlty have?</Typography>
              <Typography variant="body1">  A: Yes, upgrade/downgrade to a different tier; there are daily fees for each account type.</Typography>
              <table>
                {/* TODO: Insert account-teir limits table here */}
              </table>
            </p>
          </Typography>
          <Typography variant="h6">• Impersonation
            <p>
              <Typography variant="body1">  Q: Should you trust anyone on the site?</Typography>
              <Typography variant="body1">  A: No, always verfify out side the app that the person you are engaging with is real.</Typography>
              <Typography variant="body1">  Q: Will I be banned for impersonation?</Typography>
              <Typography variant="body1">  A: Only if you are reported alot or have many bad ratings or reviews.</Typography>
            </p>
          </Typography>

          <Typography variant="body1">• Trick and Scams
            <p>
              <Typography variant="body1">  Q: How can I scammed?</Typography>
              <Typography variant="body1">  A: No, always verfify out side the app that the person you are engaging with is real.</Typography>
              <Typography variant="body1">  Q: What to do if tricked or scammed?</Typography>
              <Typography variant="body1">  A: You need to create a support ticket, and add evidence of the scam in order to report and punish the offending user.</Typography>
              <Typography variant="body1">  Q: How can I get my money back after being tricked?</Typography>
              <Typography variant="body1">  A: Yes, but only for large transactions. There will also be a penalty for resolving conflicts.</Typography>
              <Typography variant="body1">  Q: Should I worry about fraudsters and scammers?</Typography>
              <Typography variant="body1">  A: No, this site is not designed for handling things of significant purchase.</Typography>
            </p>
          </Typography>
          <Typography variant="body1">• Your Content
            <p>
              Your content can be any thing, at the bare minimum just have a link to it. Alos avoid braking the rules.
              <Typography variant="body1">  Q: I delete content will my rating change?</Typography>
              <Typography variant="body1">  A: No, rating only change with new contente added and changes as a moving average as time passes.</Typography>
            </p>

          </Typography>
          <Typography variant="body1">• Content Limitations
            <Typography variant="body1">  Q: What cant you create?</Typography>
            <Typography variant="body1">  A: Stuff that will get the site shut down for legal reasons, Viruses and Malware, Inappropriate Child Content, Excessive X-rated gore and porn (shock-sites), maybe: Racist? Stuff (idk depends) </Typography>
          </Typography>

          <Typography variant="body1">• Bans and Account Restirctions
            <p>
              <Typography variant="body1">  Q: How can your account be deleted?</Typography>
              <Typography variant="body1">  A: Inactivity for 90 days. Failing Captchas. Causing glitching event. Leftover coins may be redeemed/recovered via email support services.</Typography>
              <Typography variant="body1">  Q: How can you get banned?</Typography>
              <Typography variant="body1">  A: Hacking, Scamming, Spamming, Glitching</Typography>
              <Typography variant="body1">  Q: How can you get your account resiteristed?</Typography>
              <Typography variant="body1">  A: By having many bad reviews or being reported alot</Typography>
            </p>
          </Typography>

        </Paper>
      </Box>


      {/* Notifications and Error Handling */}
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

export default Info;