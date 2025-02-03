import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Snackbar,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem
} from '@mui/material';
import { fetchInfoData, fetchUserProfile } from './api';
import Notifications from './Notifications';

const Info = () => {
  const navigate = useNavigate();

  // States from original code
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

  // ------------------------------------------------------------------
  // New state for modal and FAQ search
  // ------------------------------------------------------------------
  const [openSupportModal, setOpenSupportModal] = useState(false);
  const [supportProblemType, setSupportProblemType] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportTitle, setSupportTitle] = useState('');
  const [supportContactInfo, setSupportContactInfo] = useState('');
  const [faqSearch, setFaqSearch] = useState('');

  // Refs for seeking to timestamps in videos
  const howToVideoRef = useRef(null);

  // Load user profile
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

  // Load info data
  useEffect(() => {
    const loadInfoData = async () => {
      try {
        // Placeholder for API call
        // const data = await fetchInfoData();
        // setInfoData(data);
      } catch (err) {
        setTimeout(() => navigate('/login'), 500);
        setError('Failed to load data, Please Re-Login');
      } finally {
        setIsLoading(false);
      }
    };
    loadInfoData();
  }, [navigate]);

  // Handle timestamp seeking for the "How to Use" video
  const handleSeekTo = (seconds) => {
    // Simple example using an HTML5 <iframe> reference (YouTube).
    // Note: Directly manipulating currentTime within an iframe is not
    // straightforward. Instead, you might pass parameters to the embed URL
    // or use the YouTube Player API in a real-world scenario.
    if (howToVideoRef.current) {
      console.log(`Seeking to ${seconds} seconds (placeholder call)`);
      // For a real implementation, consider the YouTube Iframe API to programmatically set time.
    }
  };

  // Modal open/close
  const handleOpenSupportModal = () => setOpenSupportModal(true);
  const handleCloseSupportModal = () => setOpenSupportModal(false);

  // Submit support ticket form
  const handleSubmitSupportTicket = () => {
    // Placeholder for an API call to create a support ticket
    console.log('Submitting support ticket with:');
    console.log('Problem Type:', supportProblemType);
    console.log('Title:', supportTitle);
    console.log('Message:', supportMessage);
    console.log('Contact Info:', supportContactInfo);

    // Reset form and close modal
    setSupportProblemType('');
    setSupportTitle('');
    setSupportMessage('');
    setSupportContactInfo('');
    setOpenSupportModal(false);
    setSnackbarMessage('Support ticket submitted (placeholder)');
    setOpenSnackbar(true);
  };

  // Filter FAQ results by the search query
  const handleFaqSearch = () => {
    console.log('Searching FAQ with:', faqSearch);
    // Implement filtering logic or an API call if needed
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Inline styles for layout
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    margin: '0 auto',
    padding: '16px',
    maxWidth: '1200px',
  };

  const responsiveBoxStyle = {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 2,
    marginTop: '16px',
  };

  const responsiveVideoWrapper = {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    marginTop: '16px',
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

      {/* Sections side-by-side on desktop, stacked on mobile */}
      <Box sx={responsiveBoxStyle}>
        {/* Explanation Section */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            What is Clout Coin Club
          </Typography>
          <Typography variant="body1">
            It is a web app where users can upload content and monetize it. With Clout Coin,
            you can monetize anything digital. Have a link to share? At Clout Coin,
            anybody can monetize clout. If you have clout, sell it out! People will do anything
            for clout, "They do anything for clout?
          </Typography>

          
          {/* Intro Video */}
          <Box sx={responsiveVideoWrapper}>
            <iframe
              style={responsiveIframe}
              src="https://www.youtube.com/embed/Q_KxEMxn2pc"
              title="Embedded Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
          
          {/* Links - navigation placeholders */}
          <Box mt={2} display="flex" gap={1}>
            <Button variant="outlined" onClick={() => navigate('/register')}>
              Try Clout Coin
            </Button>
            <Button variant="outlined" onClick={() => navigate('/login')}>
              Log In to Clout Coin
            </Button>
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Box>

        </Paper>

        {/* News Section */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            News
          </Typography>
          <Typography variant="body1" gutterBottom>
            Welcome to our News & Info page! Here, you can share the latest updates,
            announcements, or articles. Customize this section with any relevant text
            or images you need.
          </Typography>

          {/* News Video */}
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

        {/* Usage Section */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            How to Use
          </Typography>
          <Typography variant="body1">
          
            <button onClick={() => handleSeekTo(10)}>
              Go
            </button>  
            • Buying Coins{' '}
          </Typography>
          <Typography variant="body1">
           
            <button onClick={() => handleSeekTo(27)}>
              Go
            </button> 
            • Sending Coins{' '}
          </Typography>
          <Typography variant="body1">
           
            <button onClick={() => handleSeekTo(35)}>
              Go
            </button>
            • Unlocking Users' Content{' '}
          </Typography>
          <Typography variant="body1">
            
            <button onClick={() => handleSeekTo(45)}>
              Go
            </button>
            • Creating Your Own Content{' '}
          </Typography>
          <Typography variant="body1">
            
            <button onClick={() => handleSeekTo(20)}>
              Go
            </button>
            • Redeeming Coins{' '}
          </Typography>

          {/* How to Use Site Video (ref used for placeholder demonstration) */}
          <Box sx={responsiveVideoWrapper}>
            <iframe
              ref={howToVideoRef}
              style={responsiveIframe}
              src="https://www.youtube.com/embed/Q_KxEMxn2pc"
              title="How-to Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
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
          <Button variant="contained" onClick={handleOpenSupportModal}>
            Support
          </Button>
        </Box>
      </Box>

      {/* FAQ Section: includes a search bar for the FAQ */}
      <Box mt={3}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <TextField
            label="Search FAQs"
            variant="outlined"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
          />
          <Button variant="outlined" onClick={handleFaqSearch}>
            Search
          </Button>
        </Box>

        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Rules, FAQs, and Comments!
          </Typography>

          <Typography variant="h6" gutterBottom>
            • Account Tiers
          </Typography>
          <Typography variant="body1">
            Account Tiers help to allocate site and server resources for stable operation.
          </Typography>
          <Typography variant="body2">
            Q: What are the tiers and what features do they have?
          </Typography>
          <Typography variant="body2">A: (Placeholder for tier details)</Typography>
          <Box mt={1} mb={2}>
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Features</th>
                </tr>
              </thead>
              <tbody>
                {/* TODO: Insert tier features table items here */}
                <tr>
                  <td>Tier 1</td>
                  <td>(Placeholder Features)</td>
                </tr>
                <tr>
                  <td>Tier 2</td>
                  <td>(Placeholder Features)</td>
                </tr>
                <tr>
                  <td>Tier 3</td>
                  <td>(Placeholder Features)</td>
                </tr>
              </tbody>
            </table>
          </Box>

          <Typography variant="h6" gutterBottom>
            • Account Limits
          </Typography>
          <Typography variant="body1">
            Q: Can I change the account limits I currently have?
          </Typography>
          <Typography variant="body1">
            A: Yes, you can upgrade or downgrade to a different tier. Daily fees apply.
          </Typography>
          <Box mt={1} mb={2}>
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Limitations</th>
                </tr>
              </thead>
              <tbody>
                {/* TODO: Insert account-tier limits table items here */}
                <tr>
                  <td>Tier 1</td>
                  <td>(Placeholder Limit Info)</td>
                </tr>
                <tr>
                  <td>Tier 2</td>
                  <td>(Placeholder Limit Info)</td>
                </tr>
                <tr>
                  <td>Tier 3</td>
                  <td>(Placeholder Limit Info)</td>
                </tr>
              </tbody>
            </table>
          </Box>

          <Typography variant="h6" gutterBottom>
            • Impersonation
          </Typography>
          <Typography variant="body2">Q: Should you trust anyone on the site?</Typography>
          <Typography variant="body2">
            A: No, always verify outside the app that the person is who they say they are.
          </Typography>
          <Typography variant="body2">Q: Will I be banned for impersonation?</Typography>
          <Typography variant="body2">
            A: Only if you are reported frequently or have many bad ratings/reviews.
          </Typography>

          <Typography variant="body1" mt={2}>
            • Trick and Scams
          </Typography>
          <Typography variant="body2">Q: How can I get scammed?</Typography>
          <Typography variant="body2">
            A: Always verify outside the app that the person you are engaging with is real.
          </Typography>
          <Typography variant="body2">Q: What to do if tricked or scammed?</Typography>
          <Typography variant="body2">
            A: Create a support ticket, include evidence of the scam so we can investigate.
          </Typography>
          <Typography variant="body2">Q: How can I get my money back?</Typography>
          <Typography variant="body2">
            A: Possibly for large transactions. There may be a penalty for conflict resolution.
          </Typography>
          <Typography variant="body2">Q: Should I worry about fraudsters?</Typography>
          <Typography variant="body2">
            A: This site is not intended for truly significant purchases; proceed with caution.
          </Typography>

          <Typography variant="body1" mt={2}>
            • Your Content
          </Typography>
          <Typography variant="body2">
            Your content can be anything, but avoid breaking the rules.
          </Typography>
          <Typography variant="body2">Q: If I delete content, does my rating change?</Typography>
          <Typography variant="body2">
            A: No, the rating changes with new content added or as time passes.
          </Typography>

          <Typography variant="body1" mt={2}>
            • Content Limitations
          </Typography>
          <Typography variant="body2">Q: What can't you create?</Typography>
          <Typography variant="body2">
            A: Anything illegal or that violates site policy, child content, extreme gore, etc.
          </Typography>

          <Typography variant="body1" mt={2}>
            • Bans and Account Restrictions
          </Typography>
          <Typography variant="body2">Q: How can an account be deleted?</Typography>
          <Typography variant="body2">
            A: Inactivity for 90 days, failing captchas, or causing a glitching event.
          </Typography>
          <Typography variant="body2">Q: How can you get banned?</Typography>
          <Typography variant="body2">A: Hacking, Scamming, Spamming, and Glitching.</Typography>
          <Typography variant="body2">Q: How can your account be restricted?</Typography>
          <Typography variant="body2">
            A: Accumulation of bad reviews or frequent reports.
          </Typography>
        </Paper>
      </Box>

      {/* Modal for Support Ticket Form */}
      <Modal
        open={openSupportModal}
        onClose={handleCloseSupportModal}
        aria-labelledby="support-modal-title"
        aria-describedby="support-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: { xs: '90%', sm: '400px' },
          }}
        >
          <Typography id="support-modal-title" variant="h6" gutterBottom>
            Submit a Support Ticket
          </Typography>

          <Select
            fullWidth
            value={supportProblemType}
            onChange={(e) => setSupportProblemType(e.target.value)}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Select Problem Type
            </MenuItem>
            <MenuItem value="account-issue">Account Issue</MenuItem>
            <MenuItem value="billing-issue">Billing Issue</MenuItem>
            <MenuItem value="report-scammer">Report Scammer</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>

          <TextField
            label="Title"
            fullWidth
            value={supportTitle}
            onChange={(e) => setSupportTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Message"
            fullWidth
            multiline
            rows={3}
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Contact Info"
            fullWidth
            value={supportContactInfo}
            onChange={(e) => setSupportContactInfo(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="text" onClick={handleCloseSupportModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmitSupportTicket}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

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