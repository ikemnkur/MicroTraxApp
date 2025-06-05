import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUserProfile } from './api';

// Account tier information
const tierInfo = {
  1: { 
    name: 'Basic', 
    features: ['Limited access', '5 transactions per day', 'No support'],
    price: 'Free'
  },
  2: { 
    name: 'Standard', 
    features: ['Standard speed access', '10 transactions per day', 'Simple in-app report support'],
    price: '10 coins/day'
  },
  3: { 
    name: 'Premium', 
    features: ['Full speed site access', '20 transactions per day', 'Advanced in-app support', 'Advanced analytics'],
    price: '$20 coins/day'
  },
  4: { 
    name: 'Gold', 
    features: ['Everything in Premium', '30 Daily transactions', 'Higher transaction limits', 'Email support', "Increased withdraw limits"],
    price: '$50 coins/day'
  },
  5: { 
    name: 'Platinum', 
    features: ['Everything in Gold', 'No transaction size limits', 'Expedited withdrawls', "No Max Balance", 'Priority support'],
    price: '$75 coins/day'
  },
  6: { 
    name: 'Diamond', 
    features: ['Everything in Platinum', 'No transaction count limits', "Advanced Rapid Support",'Special features'],
    price: '100 coins/day'
  },
  7: { 
    name: 'Ultimate', 
    features: ['Everything in Diamond', 'No transaction fees', 'No transaction limits', "Immediate withdrawals"],
    price: '200 coins/day'
  }
};

const UpgradeAccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentTier = 1, nextTier = 2 } = location.state || {};
  
  const [step, setStep] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNextStep = () => {
    setStep(current => current + 1);
  };
  
  const handlePreviousStep = () => {
    setStep(current => current - 1);
  };
  
  const handleUpgrade = async () => {
    setProcessing(true);
    setError('');
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user profile with new tier
      await updateUserProfile({ accountTier: nextTier });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/account');
      }, 3000);
    } catch (err) {
      console.error('Error upgrading account:', err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  
  const validatePaymentDetails = () => {
    const { cardNumber, cardName, expiryDate, cvv } = paymentDetails;
    return cardNumber.length >= 16 && cardName.length > 0 && expiryDate.length > 0 && cvv.length >= 3;
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Compare Plans - (Prices in Coins/Subject to change)
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title={`Current: ${tierInfo[currentTier].name}`} 
                    subheader={tierInfo[currentTier].price}
                    sx={{ backgroundColor: '#f5f5f5' }}
                  />
                  <CardContent>
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
                <Card variant="outlined" sx={{ border: '2px solid #1976d2' }}>
                  <CardHeader 
                    title={`New: ${tierInfo[nextTier].name}`}
                    subheader={tierInfo[nextTier].price}
                    sx={{ backgroundColor: '#e3f2fd' }}
                  />
                  <CardContent>
                    <List dense>
                      {tierInfo[nextTier].features.map((feature, index) => (
                        <ListItem key={`new-${index}`}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={handleNextStep}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Proceed to Payment
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You will be charged {tierInfo[nextTier].price} for the {tierInfo[nextTier].name} tier.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  disabled={processing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  name="cardName"
                  value={paymentDetails.cardName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  disabled={processing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                  disabled={processing}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  type="password"
                  required
                  disabled={processing}
                />
              </Grid>
              
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={handlePreviousStep}
                    disabled={processing}
                  >
                    Back
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleUpgrade}
                    disabled={!validatePaymentDetails() || processing}
                    startIcon={<CreditCardIcon />}
                  >
                    {processing ? 'Processing...' : `Upgrade to ${tierInfo[nextTier].name}`}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Upgrade Successful!
          </Typography>
          <Typography variant="body1" paragraph>
            Your account has been upgraded to the {tierInfo[nextTier].name} tier.
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
            Upgrade Your Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get more features and benefits with our premium tiers.
          </Typography>
        </Box>
        
        <Stepper activeStep={step} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Compare Plans</StepLabel>
          </Step>
          <Step>
            <StepLabel>Payment</StepLabel>
          </Step>
        </Stepper>
        
        <Divider sx={{ mb: 4 }} />
        
        {renderStepContent()}
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
                      ? '2px solid #2e7d32' 
                      : '1px solid #e0e0e0',
                  backgroundColor: isCurrent 
                    ? '#e3f2fd' 
                    : isTarget 
                      ? '#e8f5e9' 
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
                        color="success"
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
                  {isUpgrade && !isTarget && (
                    <Button 
                      size="small" 
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setStep(0);
                        navigate('/upgrade-account', { 
                          state: { currentTier: currentTier, nextTier: tierNum } 
                        });
                      }}
                    >
                      Upgrade To
                    </Button>
                  )}
                  {isDowngrade && (
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
                      color="success"
                      onClick={() => handleNextStep()}
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
    </Container>
  );
};

export default UpgradeAccountPage;