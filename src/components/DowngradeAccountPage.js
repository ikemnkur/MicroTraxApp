import React, { useState } from 'react';
import {
  Typography,
  Button,
  Paper,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
  TextField,
  Chip
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon,
  Warning as WarningIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUserProfile } from './api';

// Account tier information
const tierInfo = {
  1: { 
    name: 'Basic', 
    features: ['Limited access', '5 entries per day', 'Standard support'],
    price: 'Free'
  },
  2: { 
    name: 'Standard', 
    features: ['Full access', '15 entries per day', 'Priority email support'],
    price: '$4.99/month'
  },
  3: { 
    name: 'Premium', 
    features: ['Full access', 'Unlimited entries', '24/7 support', 'Advanced analytics'],
    price: '$9.99/month'
  },
  4: { 
    name: 'Gold', 
    features: ['Everything in Premium', 'API access', 'Dedicated account manager'],
    price: '$29.99/month'
  },
  5: { 
    name: 'Platinum', 
    features: ['Everything in Gold', 'Custom integrations', 'Weekly strategy calls'],
    price: '$49.99/month'
  },
  6: { 
    name: 'Diamond', 
    features: ['Everything in Platinum', 'White label options', 'Enterprise solutions'],
    price: '$99.99/month'
  },
  7: { 
    name: 'Ultimate', 
    features: ['Everything in Diamond', 'Custom development', 'Board level reporting'],
    price: '$199.99/month'
  }
};

const DowngradeAccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTier = 2, nextTier = 1 } = location.state || {};
  
  const [step, setStep] = useState(0);
  const [confirmText, setConfirmText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const handleNextStep = () => {
    setStep(current => current + 1);
  };
  
  const handlePreviousStep = () => {
    setStep(current => current - 1);
  };
  
  const openConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };
  
  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };
  
  const handleDowngrade = async () => {
    setProcessing(true);
    setError('');
    closeConfirmDialog();
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile with new tier
      await updateAccountTier({ accountTier: nextTier });

      setSuccess(true);
      setTimeout(() => {
        navigate('/account');
      }, 3000);
    } catch (err) {
      console.error('Error downgrading account:', err);
      setError('Failed to downgrade account. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  
  // Find the features that will be lost by downgrading
  const getLostFeatures = () => {
    const currentFeatures = new Set(tierInfo[currentTier].features);
    const nextFeatures = new Set(tierInfo[nextTier].features);
    
    return [...currentFeatures].filter(feature => !nextFeatures.has(feature));
  };
  
  const lostFeatures = getLostFeatures();
  
  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Downgrade Successful!
          </Typography>
          <Typography variant="body1" paragraph>
            Your account has been downgraded to the {tierInfo[nextTier].name} tier.
            You will be redirected to your account page in a moment.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/account')}
          >
            Go to Account
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Downgrade Your Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review what features you'll lose before downgrading.
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current: {tierInfo[currentTier].name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {tierInfo[currentTier].price}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  {tierInfo[currentTier].features.map((feature, index) => (
                    <ListItem key={`current-${index}`}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  New: {tierInfo[nextTier].name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {tierInfo[nextTier].price}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  {tierInfo[nextTier].features.map((feature, index) => (
                    <ListItem key={`next-${index}`}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {lostFeatures.length > 0 && (
          <Box sx={{ mt: 4, p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} gutterBottom>
              <WarningIcon color="warning" />
              Features you'll lose
            </Typography>
            <List dense>
              {lostFeatures.map((feature, index) => (
                <ListItem key={`lost-${index}`}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CloseIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/account')}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="warning"
            onClick={openConfirmDialog}
            disabled={processing}
            startIcon={<ArrowDownwardIcon />}
          >
            {processing ? 'Processing...' : 'Confirm Downgrade'}
          </Button>
        </Box>
      </Paper>
      
      {/* All Account Tiers */}
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          All Account Tiers
        </Typography>
        <Box sx={{ display: 'flex', overflowX: 'auto', py: 2, gap: 2 }}>
          {Object.entries(tierInfo).map(([tierLevel, tier]) => {
            const tierNum = parseInt(tierLevel);
            const isCurrent = tierNum === currentTier;
            const isTarget = tierNum === nextTier;
            const isUpgrade = tierNum > currentTier;
            const isDowngrade = tierNum < currentTier;
            
            return (
              <Card 
                key={tierLevel} 
                sx={{ 
                  minWidth: 200,
                  border: isCurrent 
                    ? '2px solid #1976d2' 
                    : isTarget 
                      ? '2px solid #ed6c02' 
                      : '1px solid #e0e0e0',
                  backgroundColor: isCurrent 
                    ? '#e3f2fd' 
                    : isTarget 
                      ? '#fff3e0' 
                      : 'white'
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {tier.name}
                    {isCurrent && (
                      <Chip 
                        label="Current" 
                        size="small" 
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    )}
                    {isTarget && (
                      <Chip 
                        label="Target" 
                        size="small" 
                        color="warning"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {tier.price}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ height: 80, overflow: 'auto' }}>
                    {tier.features.slice(0, 2).join(', ')}
                    {tier.features.length > 2 && '...'}
                  </Typography>
                </CardContent>
                <CardActions>
                  {isUpgrade && (
                    <Button 
                      size="small" 
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate('/upgrade-account', { 
                        state: { currentTier: currentTier, nextTier: tierNum } 
                      })}
                    >
                      Upgrade To
                    </Button>
                  )}
                  {isDowngrade && !isTarget && (
                    <Button 
                      size="small" 
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate('/downgrade-account', { 
                        state: { currentTier: currentTier, nextTier: tierNum } 
                      })}
                    >
                      Downgrade To
                    </Button>
                  )}
                  {isCurrent && (
                    <Button 
                      size="small" 
                      fullWidth
                      disabled
                    >
                      Current Tier
                    </Button>
                  )}
                  {isTarget && (
                    <Button 
                      size="small" 
                      fullWidth
                      variant="contained"
                      color="warning"
                      onClick={openConfirmDialog}
                    >
                      Select This
                    </Button>
                  )}
                </CardActions>
              </Card>
            );
          })}
        </Box>
      </Paper>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
      >
        <DialogTitle>Confirm Downgrade</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to downgrade from {tierInfo[currentTier].name} to {tierInfo[nextTier].name}?
            {lostFeatures.length > 0 && " You will lose access to some features."}
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, fontWeight: 'bold' }}>
            Type "DOWNGRADE" to confirm:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancel</Button>
          <Button 
            onClick={handleDowngrade} 
            color="warning"
            disabled={confirmText !== "DOWNGRADE"}
          >
            Downgrade Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DowngradeAccountPage;