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
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { fetchInfoData, fetchUserProfile } from './api';
import Notifications from './Notifications';

const Info = () => {
  const navigate = useNavigate();

  // Component state
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

  // New state for modal and FAQ search
  const [openSupportModal, setOpenSupportModal] = useState(false);
  const [supportUsername, setSupportUsername] = useState('');
  const [supportProblemType, setSupportProblemType] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportTitle, setSupportTitle] = useState('');
  const [supportContactInfo, setSupportContactInfo] = useState('');
  const [faqSearch, setFaqSearch] = useState('');

  // Ref for seeking to timestamps in videos
  const howToVideoRef = useRef(null);

  // Load user profile
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
        setTier(parseInt(profileRes.accountTier));
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setSnackbarMessage(
          err.response?.data?.message ||
            'Failed to load user profile, please refresh or login again'
        );
        setOpenSnackbar(true);
        // if (err.response?.status === 401) {
          // setTimeout(() => navigate('/login'), 500);
        // }
      }
    };
    loadUserProfile();
  }, [navigate]);

  // Load info data
  useEffect(() => {
    const loadInfoData = async () => {
      try {
        // Placeholder: const data = await fetchInfoData();
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

  // Handle video seek (placeholder)
  const handleSeekTo = (seconds) => {
    if (howToVideoRef.current) {
      console.log(`Seeking to ${seconds} seconds (placeholder)`);
    }
  };

  // Modal open/close
  const handleOpenSupportModal = () => setOpenSupportModal(true);
  const handleCloseSupportModal = () => setOpenSupportModal(false);

  // Submit support ticket form (placeholder)
  const handleSubmitSupportTicket = () => {
    console.log('Submitting support ticket with:', {
      supportProblemType,
      supportTitle,
      supportMessage,
      supportContactInfo,
      supportUsername: userData.username || supportUsername,
      supportUserId: userData.id || "0" // Fallback to 0 if userData is not available
    });
    setSupportProblemType('');
    setSupportTitle('');
    setSupportMessage('');
    setSupportContactInfo('');
    setOpenSupportModal(false);
    setSnackbarMessage('Support ticket submitted (placeholder)');
    setOpenSnackbar(true);
  };

  // FAQ search (placeholder)
  const handleFaqSearch = () => {
    console.log('Searching FAQ with:', faqSearch);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: '1200px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Clout Coin Club
      </Typography>

      {/* Main Sections */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Explanation Section */}
        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="h5" gutterBottom>
            What is Clout Coin Club
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            It is a web app where users can upload content and monetize it. With Clout Coin, you can
            monetize anything digital. Have a link to share? At Clout Coin, anybody can monetize
            clout. If you have clout, sell it out! People will do anything for clout.
          </Typography>
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              mb: 2,
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/Q_KxEMxn2pc"
              title="Intro Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            ></iframe>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {/* <Button variant="outlined" onClick={() => navigate('/register')}>
              Try Clout Coin
            </Button> */}
            <Button variant="outlined" onClick={() => navigate('/login')}>
              Log In to Clout Coin
            </Button>
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Box>
        </Paper>

        {/* News Section */}
        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            News
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Welcome to our News & Info page! Here, you can share the latest updates, announcements,
            or articles. Customize this section with any relevant text or images you need.
          </Typography>
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/Q_KxEMxn2pc"
              title="News Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            ></iframe>
          </Box>
        </Paper>

        {/* How to Use Section */}
        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            How to Use
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1">
              <Button variant="text" onClick={() => handleSeekTo(10)}>Go</Button> • Buying Coins
            </Typography>
            <Typography variant="body1">
              <Button variant="text" onClick={() => handleSeekTo(27)}>Go</Button> • Sending Coins
            </Typography>
            <Typography variant="body1">
              <Button variant="text" onClick={() => handleSeekTo(35)}>Go</Button> • Unlocking Users' Content
            </Typography>
            <Typography variant="body1">
              <Button variant="text" onClick={() => handleSeekTo(45)}>Go</Button> • Creating Your Own Content
            </Typography>
            <Typography variant="body1">
              <Button variant="text" onClick={() => handleSeekTo(20)}>Go</Button> • Redeeming Coins
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              mt: 2,
            }}
          >
            <iframe
              ref={howToVideoRef}
              src="https://www.youtube.com/embed/Q_KxEMxn2pc"
              title="How-to Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            ></iframe>
          </Box>
        </Paper>
      </Box>

      {/* Support Section */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Need Help?
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Typography variant="body1">Submit a support ticket</Typography>
          <Button variant="contained" onClick={handleOpenSupportModal}>
            Support
          </Button>
        </Box>
      </Box>

      {/* FAQ Section */}
      {/* <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            label="Search FAQs"
            variant="outlined"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={handleFaqSearch}>
            Search
          </Button>
        </Box>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Rules, FAQs, and Comments!
          </Typography>
          <Typography variant="h6" gutterBottom>
            • Account Tiers
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Account Tiers help to allocate site and server resources for stable operation.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: What are the tiers and what features do they have?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            A: (Placeholder for tier details)
          </Typography>
          <Box sx={{ my: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tier</TableCell>
                  <TableCell>Features</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Tier 1</TableCell>
                  <TableCell>(Placeholder Features)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tier 2</TableCell>
                  <TableCell>(Placeholder Features)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tier 3</TableCell>
                  <TableCell>(Placeholder Features)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Typography variant="h6" gutterBottom>
            • Account Limits
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Q: Can I change the account limits I currently have?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            A: Yes, you can upgrade or downgrade to a different tier. Daily fees apply.
          </Typography>
          <Box sx={{ my: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tier</TableCell>
                  <TableCell>Limitations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Tier 1</TableCell>
                  <TableCell>(Placeholder Limit Info)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tier 2</TableCell>
                  <TableCell>(Placeholder Limit Info)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tier 3</TableCell>
                  <TableCell>(Placeholder Limit Info)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Typography variant="h6" gutterBottom>
            • Impersonation
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: Should you trust anyone on the site?
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            A: No, always verify outside the app that the person is who they say they are.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: Will I be banned for impersonation?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            A: Only if you are reported frequently or have many bad ratings/reviews.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            • Trick and Scams
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: How can I get scammed?
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            A: Always verify outside the app that the person you are engaging with is real.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: What to do if tricked or scammed?
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            A: Create a support ticket, include evidence of the scam so we can investigate.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: How can I get my money back?
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            A: Possibly for large transactions. There may be a penalty for conflict resolution.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: Should I worry about fraudsters?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            A: This site is not intended for truly significant purchases; proceed with caution.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            • Your Content
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Your content can be anything, but avoid breaking the rules.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Q: If I delete content, does my rating change?
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            • Content Limitations
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: What can't you create?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            A: Anything illegal or that violates site policy, child content, extreme gore, etc.
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            • Bans and Account Restrictions
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: How can an account be deleted?
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            A: Inactivity for 90 days, failing captchas, or causing a glitching event.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: How can you get banned?
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            A: Hacking, Scamming, Spamming, and Glitching.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Q: How can your account be restricted?
          </Typography>
          <Typography variant="body2">
            A: Accumulation of bad reviews or frequent reports.
          </Typography>
        </Paper>
      </Box> */}

      {/* Support Ticket Modal */}
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
            borderRadius: 2,
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
            label="Email or Other Contact Info"
            fullWidth
            value={supportContactInfo}
            onChange={(e) => setSupportContactInfo(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Username"
            fullWidth
            value={supportUsername}
            onChange={(e) => setSupportUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="text" onClick={handleCloseSupportModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmitSupportTicket}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
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
