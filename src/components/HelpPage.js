import React, { useState, useEffect } from 'react';
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
  TableBody,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Card,
  CardContent,
  InputAdornment,
  Divider,
  Alert
} from '@mui/material';
import {
  ExpandMore,
  Help,
  Support,
  Search,
  ContactSupport,
  LiveHelp,
  Security,
  AccountCircle,
  Payment,
  Warning,
  Info as InfoIcon
} from '@mui/icons-material';
import { fetchUserProfile } from './api';

const HelpPage = () => {
  const navigate = useNavigate();

  // Component state
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [userData, setUserData] = useState({});

  // Support modal state
  const [openSupportModal, setOpenSupportModal] = useState(false);
  const [supportProblemType, setSupportProblemType] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportTitle, setSupportTitle] = useState('');
  const [supportContactInfo, setSupportContactInfo] = useState('');

  // FAQ search and filtering
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedAccordion, setExpandedAccordion] = useState(false);

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
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setSnackbarMessage('Failed to load user profile');
        setOpenSnackbar(true);
        if (err.response?.status === 401) {
          setTimeout(() => navigate('/login'), 500);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadUserProfile();
  }, [navigate]);

  // FAQ categories and data
  const faqCategories = [
    { id: 'all', label: 'All Categories', icon: <Help /> },
    { id: 'account', label: 'Account & Tiers', icon: <AccountCircle /> },
    { id: 'payment', label: 'Payments & Coins', icon: <Payment /> },
    { id: 'security', label: 'Security & Safety', icon: <Security /> },
    { id: 'content', label: 'Content & Rules', icon: <InfoIcon /> },
    { id: 'support', label: 'Support & Issues', icon: <ContactSupport /> }
  ];

  const faqData = [
    {
      category: 'account',
      question: 'What are the account tiers and their features?',
      answer: 'Account tiers help allocate site and server resources for stable operation. Each tier offers different features and limitations.',
      details: (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Tier</strong></TableCell>
              <TableCell><strong>Features</strong></TableCell>
              <TableCell><strong>Daily Limit</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Tier 1</TableCell>
              <TableCell>Basic features, standard upload limits</TableCell>
              <TableCell>₡100 transactions</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tier 2</TableCell>
              <TableCell>Enhanced features, higher upload limits</TableCell>
              <TableCell>₡500 transactions</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tier 3</TableCell>
              <TableCell>Premium features, unlimited uploads</TableCell>
              <TableCell>₡1000+ transactions</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    },
    {
      category: 'account',
      question: 'Can I change my account tier?',
      answer: 'Yes, you can upgrade or downgrade to a different tier. Daily fees apply based on your selected tier level.'
    },
    {
      category: 'payment',
      question: 'How do I buy more coins?',
      answer: 'You can purchase coins through the dashboard using various payment methods including credit cards and digital wallets.'
    },
    {
      category: 'payment',
      question: 'How do I send coins to other users?',
      answer: 'Use the Send Money feature in your dashboard. Enter the recipient\'s username, amount, and a message to complete the transfer.'
    },
    {
      category: 'security',
      question: 'Should I trust other users on the site?',
      answer: 'No, always verify outside the app that the person is who they say they are. Be cautious of impersonation and scams.'
    },
    {
      category: 'security',
      question: 'How can I avoid being scammed?',
      answer: 'Always verify users outside the app, start with small transactions, and report suspicious behavior immediately.'
    },
    {
      category: 'security',
      question: 'What should I do if I\'ve been scammed?',
      answer: 'Create a support ticket immediately and include evidence of the scam so we can investigate. For large transactions, refunds may be possible with a penalty for conflict resolution.'
    },
    {
      category: 'content',
      question: 'What type of content can I create?',
      answer: 'You can create any digital content, but avoid anything illegal, child content, extreme gore, or content that violates site policy.'
    },
    {
      category: 'content',
      question: 'If I delete content, does my rating change?',
      answer: 'Deleting content may affect your rating depending on user feedback and the reason for deletion.'
    },
    {
      category: 'support',
      question: 'How can my account be banned or restricted?',
      answer: 'Accounts can be banned for hacking, scamming, spamming, and glitching. Restrictions occur from accumulation of bad reviews or frequent reports.'
    },
    {
      category: 'support',
      question: 'When are accounts deleted?',
      answer: 'Accounts are deleted after 90 days of inactivity, failing captchas repeatedly, or causing glitching events.'
    }
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Modal handlers
  const handleOpenSupportModal = () => setOpenSupportModal(true);
  const handleCloseSupportModal = () => {
    setOpenSupportModal(false);
    setSupportProblemType('');
    setSupportTitle('');
    setSupportMessage('');
    setSupportContactInfo('');
  };

  // Submit support ticket
  const handleSubmitSupportTicket = () => {
    console.log('Submitting support ticket:', {
      supportProblemType,
      supportTitle,
      supportMessage,
      supportContactInfo,
    });
    handleCloseSupportModal();
    setSnackbarMessage('Support ticket submitted successfully!');
    setOpenSnackbar(true);
  };

  // Accordion handler
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
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
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: '#1976d2',
            mb: 2
          }}
        >
          <LiveHelp sx={{ fontSize: '2.5rem', mr: 2, verticalAlign: 'middle' }} />
          Help & Support
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Find answers to common questions or get help from our support team
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Need Immediate Help?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              startIcon={<ContactSupport />}
              onClick={handleOpenSupportModal}
              sx={{ textTransform: 'none' }}
            >
              Submit Support Ticket
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Help />}
              onClick={() => navigate('/dashboard')}
              sx={{ textTransform: 'none' }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Search FAQs
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Search questions and answers"
            variant="outlined"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {faqCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {category.icon}
                  {category.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Category Chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {faqCategories.map((category) => (
            <Chip
              key={category.id}
              label={category.label}
              icon={category.icon}
              onClick={() => setSelectedCategory(category.id)}
              color={selectedCategory === category.id ? 'primary' : 'default'}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Paper>

      {/* FAQ Results */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Frequently Asked Questions
          <Chip 
            label={`${filteredFaqs.length} results`} 
            size="small" 
            sx={{ ml: 2 }} 
          />
        </Typography>

        {filteredFaqs.length === 0 ? (
          <Alert severity="info">
            No FAQs found matching your search criteria. Try adjusting your search terms or category filter.
          </Alert>
        ) : (
          filteredFaqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expandedAccordion === `panel${index}`}
              onChange={handleAccordionChange(`panel${index}`)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  {faqCategories.find(cat => cat.id === faq.category)?.icon}
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {faq.question}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {faq.answer}
                </Typography>
                {faq.details && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    {faq.details}
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      {/* Support Ticket Modal */}
      <Modal
        open={openSupportModal}
        onClose={handleCloseSupportModal}
        aria-labelledby="support-modal-title"
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
            width: { xs: '90%', sm: '500px' },
            borderRadius: 2,
            maxHeight: '90vh',
            overflow: 'auto'
          }}
        >
          <Typography id="support-modal-title" variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            <Support sx={{ mr: 1, verticalAlign: 'middle' }} />
            Submit Support Ticket
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
            <MenuItem value="billing-issue">Billing/Payment Issue</MenuItem>
            <MenuItem value="report-scammer">Report Scammer/Fraud</MenuItem>
            <MenuItem value="technical-issue">Technical Issue</MenuItem>
            <MenuItem value="content-issue">Content Issue</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          
          <TextField
            label="Ticket Title"
            fullWidth
            value={supportTitle}
            onChange={(e) => setSupportTitle(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Brief description of your issue"
          />
          
          <TextField
            label="Detailed Message"
            fullWidth
            multiline
            rows={4}
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Please provide as much detail as possible about your issue"
          />
          
          <TextField
            label="Contact Information"
            fullWidth
            value={supportContactInfo}
            onChange={(e) => setSupportContactInfo(e.target.value)}
            sx={{ mb: 3 }}
            placeholder="Email or phone number for follow-up"
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="text" onClick={handleCloseSupportModal}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmitSupportTicket}
              disabled={!supportProblemType || !supportTitle || !supportMessage}
            >
              Submit Ticket
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar */}
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

export default HelpPage;