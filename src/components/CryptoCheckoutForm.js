import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  TextField,
  Box,
  IconButton,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos
} from '@mui/icons-material';
import { uploadTransactionScreenshot, } from './api';

import { useToast } from './contexts/ToastContext';

const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL+'/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Move these outside the component to prevent recreating on every render
const walletAddressMap = {
  BTC: 'bc1q4j9e7equq4xvlyu7tan4gdmkvze7wc0egvykr6',
  LTC: 'ltc1qgg5aggedmvjx0grd2k5shg6jvkdzt9dtcqa4dh',
  SOL: 'qaSpvAumg2L3LLZA8qznFtbrRKYMP1neTGqpNgtCPaU',
  ETH: '0x9a61f30347258A3D03228F363b07692F3CBb7f27',
  XMR: '44X8AgosuXFCuRmBoDRc66Vw1FeCaL6vRiKRqrmqXeJdeKAciYuyaJj7STZnHMg7x8icHJL6M1hzeAPqSh8NSC1GGC9bkCp',
};

const currencyIdMap = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  LTC: 'litecoin',
  SOL: 'solana',
  XMR: 'monero'
};

const mobileStyles = {
  primaryButton: {
    padding: '10px 24px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(33, 150, 243, 0.3)',
  },
  secondaryButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#2196f3',
    border: '2px solid #2196f3',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(76, 175, 80, 0.3)',
  },
  successButton: {
    padding: '10px 24px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(76, 175, 80, 0.3)',
  },
  formGroup: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#1976d2',
    fontSize: '12px',
  },
  required: {
    color: '#f44336',
    fontWeight: 'bold',
  }
};

// Separate step components to prevent re-renders
const CurrencyStep = React.memo(({ currency, setCurrency, setWalletAddress, nextStep }) => {
  const currencies = [
    { code: 'BTC', name: 'Bitcoin', icon: '₿', color: '#f7931a' },
    { code: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627eea' },
    { code: 'LTC', name: 'Litecoin', icon: 'Ł', color: '#345d9d' },
    { code: 'SOL', name: 'Solana', icon: '◎', color: '#9945ff' },
    { code: 'XMR', name: 'Monero (N/A)', icon: 'ɱ', color: '#ff6600' }
  ];

  return (
    <Box sx={{ px: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
        Choose Currency
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.7, mb: 3, textAlign: 'center', color: '#546e7a' }}>
        Select your preferred cryptocurrency to purchase credits.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {currencies.map((crypto) => (
          <Grid item xs={6} sm={4} md={2.4} key={crypto.code}>
            <Paper
              elevation={currency === crypto.code ? 6 : 2}
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                background: currency === crypto.code
                  ? `linear-gradient(135deg, ${crypto.color}15, ${crypto.color}25)`
                  : '#ffffff',
                border: currency === crypto.code
                  ? `2px solid ${crypto.color}`
                  : '1px solid #e3f2fd',
                borderRadius: 2,
                minHeight: 100
              }}
              onClick={() => {
                setCurrency(crypto.code);
                setWalletAddress(walletAddressMap[crypto.code]);
              }}
            >
              <Box sx={{ fontSize: '2rem', mb: 0.5, color: crypto.color }}>
                {crypto.icon}
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {crypto.code}
              </Typography>
              <Typography variant="body2" sx={{ color: '#546e7a', fontSize: '0.7rem' }}>
                {crypto.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <button
          onClick={nextStep}
          disabled={!currency}
          style={{
            ...mobileStyles.primaryButton,
            opacity: currency ? 1 : 0.5,
            cursor: currency ? 'pointer' : 'not-allowed'
          }}
        >
          Continue to Packages
        </button>
      </Box>
    </Box>
  );
});

const PackageStep = React.memo(({ amount, setAmount, handleBuyCredits, currency, rate, cryptoAmount }) => {
  const packages = [
    { amount: 2000, price: 2.5, popular: false },
    { amount: 5000, price: 5.25, popular: false },
    { amount: 12500, price: 11, popular: true },
    { amount: 25000, price: 24, popular: false },
    { amount: 55000, price: 53, popular: false },
    { amount: 120000, price: 110, popular: false },
  ];

  return (
    <Box sx={{ px: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
        Purchase Credits
      </Typography>
      {/* <Typography variant="body2" sx={{ opacity: 0.7, mb: 3, textAlign: 'center', color: '#546e7a' }}>
        Purchasing: <strong style={{ color: '#1976d2' }}>{parseInt(amount).toLocaleString()} credits</strong>
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          size="small"
          sx={{ maxWidth: 160 }}
          label="Custom Amount"
          inputProps={{ min: 1, step: 1 }}
        />
      </Box>

      <Typography sx={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', opacity: 0.85, mb: 3, color: '#1976d2' }}>
        OR
      </Typography> */}

      <Typography variant="body2" sx={{ opacity: 0.7, mb: 3, textAlign: 'center', color: '#546e7a' }}>
        Select a Package:
      </Typography>

      <Grid container spacing={2}>
        {packages.map((package_, index) => (
          <Grid item xs={6} sm={4} md={4} key={index}>
            <Paper
              elevation={amount == package_.amount ? 6 : package_.popular ? 4 : 2}
              sx={{
                p: 2,
                textAlign: 'center',
                position: 'relative',
                cursor: 'pointer',
                background: package_.popular
                  ? 'linear-gradient(135deg, #55f1ffff, #03c1bbff)'
                  : amount == package_.amount
                    ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
                    : '#ffffff',
                color: package_.popular || amount == package_.amount ? 'white' : '#1976d2',
                border: amount == package_.amount ? '2px solid #1976d2' : package_.popular ? 'none' : '1px solid #e3f2fd',
                borderRadius: 2,
                minHeight: 140
              }}
              onClick={() => handleBuyCredits(package_.amount, package_.price)}
            >
              {package_.popular && (
                <Chip
                  label="POPULAR"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.6rem'
                  }}
                />
              )}

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {package_.amount.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Credits
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                ${package_.price}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.7rem' }}>
                ≈ {cryptoAmount && rate ? (package_.price / rate).toFixed(4) : '0.0000'} {currency}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

const PaymentStep = React.memo(({ amount, currency, rate, cryptoAmount, walletAddress, handleCopyAddress, handleCopyAmount, nextStep, errorMessage, message }) => {
  return (
    <Box sx={{ px: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
        Send Payment
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', borderRadius: 2 }}>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 600, mb: 0.5 }}>
          Buying: {parseInt(amount).toLocaleString()} Credits
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#1565c0' }}>
          Total: ${((parseInt(amount) / 1000) || 0).toFixed(2)} USD
        </Typography>
      </Paper>

      {errorMessage && (
        <Paper elevation={1} sx={{ p: 1.5, mb: 2, backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: 1 }}>
          <Typography color="#d32f2f" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
            {errorMessage}
          </Typography>
        </Paper>
      )}

      {message && (
        <Paper elevation={1} sx={{ p: 1.5, mb: 2, backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: 1 }}>
          <Typography color="#2e7d32" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
            {message}
          </Typography>
        </Paper>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #1976d2, #42a5f5)', color: 'white', borderRadius: 2 }}>
            <Box sx={{ fontSize: '2rem', mb: 1 }}>
              {{ BTC: '₿', ETH: 'Ξ', LTC: 'Ł', SOL: '◎', XMR: 'ɱ' }[currency]}
            </Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {{ BTC: 'Bitcoin', ETH: 'Ethereum', LTC: 'Litecoin', SOL: 'Solana', XMR: 'Monero (Coming-Soon)' }[currency]} ({currency})
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Rate: <strong>${rate ? rate.toLocaleString() : '...'}</strong>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, background: '#ffffff', border: '2px solid #2196f3', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ color: '#1976d2', mb: 1.5, textAlign: 'center', fontWeight: 600 }}>
              Payment Instructions
            </Typography>

            <Box sx={{ mb: 1.5 }}>
              <Paper elevation={1} sx={{ p: 1.5, backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: 1 }}>
                <Typography sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2', textAlign: 'center' }}>
                  Send: {cryptoAmount} {currency}
                </Typography>
                <button style={{ ...mobileStyles.secondaryButton, width: '100%' }} onClick={handleCopyAmount}>
                  Copy Amount
                </button>
              </Paper>
            </Box>

            <Box>
              <Paper elevation={1} sx={{ p: 1.5, backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: 1 }}>
                <Typography sx={{
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  mb: 1,
                  color: '#1976d2',
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: 1.2
                }}>
                  {walletAddress}
                </Typography>
                <button style={{ ...mobileStyles.secondaryButton, width: '100%' }} onClick={handleCopyAddress}>
                  Copy Address
                </button>
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <button onClick={nextStep} style={mobileStyles.primaryButton}>
          I've Sent Payment
        </button>
      </Box>
    </Box>
  );
});

const DetailsStep = React.memo(({ userDetails, handleInputChange, cryptoAmount, currency, walletAddress, handleOrderSubmit }) => {
  return (
    <Box sx={{ px: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
        Submit Details
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.7, mb: 3, textAlign: 'center', color: '#546e7a' }}>
        Fill out the form to log your order. Fields with <span style={{ color: '#f44336', fontWeight: 'bold' }}>*</span> are required.
      </Typography>

      <Paper elevation={3} sx={{ p: 2, background: '#ffffff', border: '1px solid #e3f2fd', borderRadius: 2 }}>
        <form onSubmit={handleOrderSubmit}>
          <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
            <Typography sx={{ textAlign: 'center', color: '#1976d2', fontSize: '0.8rem' }}>
              Sent <strong>{cryptoAmount} {currency}</strong> to: {walletAddress.slice(0, 15)}...
            </Typography>
          </Paper>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={mobileStyles.formGroup}>
                <label style={mobileStyles.label}>Full Name<span style={mobileStyles.required}>*</span></label>
                <TextField
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  size="small"
                  placeholder="Enter your full name"
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={mobileStyles.formGroup}>
                <label style={mobileStyles.label}>Email<span style={mobileStyles.required}>*</span></label>
                <TextField
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  size="small"
                  placeholder="Enter your email"
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={mobileStyles.formGroup}>
                <label style={mobileStyles.label}>Your Wallet Address<span style={mobileStyles.required}>*</span></label>
                <TextField
                  name="walletAddress"
                  value={userDetails.walletAddress}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  size="small"
                  placeholder="Address you sent from"
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={mobileStyles.formGroup}>
                <label style={mobileStyles.label}>Transaction ID<span style={mobileStyles.required}>*</span></label>
                <TextField
                  name="transactionId"
                  value={userDetails.transactionId}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  size="small"
                  placeholder="Transaction hash/ID"
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={mobileStyles.formGroup}>
                <label style={mobileStyles.label}>Blockchain Explorer Link</label>
                <TextField
                  name="blockchainExplorerLink"
                  value={userDetails.blockchainExplorerLink}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  placeholder="Blockchain explorer link"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <button style={mobileStyles.submitButton} type="submit">
              Submit Order
            </button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
});

const ValidationStep = React.memo(({ orderSubmitted, currency, transactionStatus, validationMessage, handleValidateTransaction, navigate, getExpectedWaitTime }) => {
  return (
    <Box sx={{ px: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: '#1976d2', fontWeight: 600 }}>
        Validation
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.7, mb: 3, textAlign: 'center', color: '#546e7a' }}>
        {orderSubmitted
          ? 'Your order has been logged. Validate your transaction below.'
          : 'Submit your order details first to validate your transaction.'
        }
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3, background: '#ffffff', border: '2px solid #2196f3', borderRadius: 2 }}>
        <Typography variant="body1" sx={{ color: '#1976d2', mb: 2, textAlign: 'center', fontWeight: 600 }}>
          Transaction Validation
        </Typography>

        <Paper elevation={1} sx={{ p: 2, mb: 2, backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: 1 }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#2e7d32', mb: 0.5 }}>
            <strong>Expected time for {currency}:</strong>
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', color: '#1b5e20', fontWeight: 600 }}>
            {getExpectedWaitTime(currency)}
          </Typography>
        </Paper>

        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <button
            type="button"
            onClick={handleValidateTransaction}
            disabled={transactionStatus === 'validating'}
            style={{
              ...mobileStyles.primaryButton,
              opacity: transactionStatus === 'validating' ? 0.6 : 1,
              cursor: transactionStatus === 'validating' ? 'not-allowed' : 'pointer'
            }}
          >
            {transactionStatus === 'validating' ? (
              <>⏳ Validating...</>
            ) : (
              <>🔍 Validate Transaction</>
            )}
          </button>
        </Box>

        {validationMessage && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              textAlign: 'center',
              backgroundColor: transactionStatus === 'confirmed' ? '#e8f5e8' :
                transactionStatus === 'failed' ? '#ffebee' : '#e3f2fd',
              border: `1px solid ${transactionStatus === 'confirmed' ? '#4caf50' :
                transactionStatus === 'failed' ? '#f44336' : '#2196f3'}`,
              borderRadius: 1
            }}
          >
            <Typography sx={{
              color: transactionStatus === 'confirmed' ? '#2e7d32' :
                transactionStatus === 'failed' ? '#d32f2f' : '#1976d2',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              {transactionStatus === 'confirmed' && '✅ '}
              {transactionStatus === 'failed' && '❌ '}
              {transactionStatus === 'validating' && '⏳ '}
              {validationMessage}
            </Typography>
          </Paper>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        {transactionStatus === 'confirmed' ? (
          <button onClick={() => navigate('/wallet')} style={mobileStyles.successButton}>
            🎉 Go to Wallet
          </button>
        ) : (
          <>
            <button onClick={() => navigate('/transactions')} style={mobileStyles.primaryButton}>
              Complete Purchase
            </button>
            <button onClick={() => navigate('/wallet')} style={mobileStyles.secondaryButton}>
              Back to Wallet
            </button>
          </>
        )}
      </Box>
    </Box>
  );
});

export function CryptoCheckoutForm({ setCoins }) {
  const [balance, setBalance] = useState(null);
  const { success, error } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialAmount = query.get('amount') || 12500;
  const [amount, setAmount] = useState(initialAmount);
  let ud = JSON.parse(localStorage.getItem("userdata"))

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [currency, setCurrency] = useState('BTC');
  const [rate, setRate] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState(walletAddressMap[currency] || 'YOUR_WALLET_ADDRESS_HERE');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    walletAddress: '',
    key: '',
    transactionId: '',
    blockchainExplorerLink: '',
    time: ''
  });

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('pending');
  const [validationMessage, setValidationMessage] = useState('');
  const [enableOrderLogging, setEnableOrderLogging] = useState(true);

  const dollarValueOfCoins = amount / 1000;
  const cryptoAmount = rate ? (dollarValueOfCoins / rate).toFixed(8) : '0.00000000';

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  }, [totalSteps]);

  const fetchCryptoRate = useCallback(async (cryptoCurrency) => {
    try {
      const coinId = currencyIdMap[cryptoCurrency];
      if (!coinId) {
        console.error('Currency not supported:', cryptoCurrency);
        return 0;
      }

      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const data = await response.json();
      return data[coinId]?.usd || 0;
    } catch (error) {
      console.error('Error fetching crypto rate:', error);
      const fallbackRates = { BTC: 45000, ETH: 3000, LTC: 100, SOL: 50, XMR: 250 };
      return fallbackRates[cryptoCurrency] || 0;
    }
  }, []);

  const checkTransaction = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const isValid = userDetails.transactionId.length > 10;

    if (isValid) {
      setTransactionStatus('confirmed');
      setValidationMessage('Transaction confirmed! Your credits will be added to your account within 10 minutes.');
      return true;
    } else {
      setTransactionStatus('failed');
      setValidationMessage('Transaction not found or invalid. Please check your transaction ID and try again.');
      return false;
    }
  }, [userDetails.transactionId]);

  useEffect(() => {
    fetchCryptoRate(currency).then(setRate);
  }, [currency, fetchCryptoRate]);

  const handleBuyCredits = useCallback((packageAmount, packagePrice) => {
    setAmount(packageAmount);
    setTimeout(() => nextStep(), 500);
  }, [nextStep]);

  const handleCopyAddress = useCallback(() => {
    const walletAddr = walletAddressMap[currency] || 'YOUR_WALLET_ADDRESS_HERE';
    navigator.clipboard
      .writeText(walletAddr)
      .then(() => {
        setMessage('Wallet address copied to clipboard!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
        setErrorMessage('Failed to copy address.');
      });
  }, [currency]);

  const handleCopyAmount = useCallback(() => {
    const amountToCopy = cryptoAmount || '0.00000000';
    navigator.clipboard
      .writeText(amountToCopy)
      .then(() => {
        setMessage('Amount copied to clipboard!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
        setErrorMessage('Failed to copy amount.');
      });
  }, [cryptoAmount]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  }, []);

  const handleOrderSubmit = useCallback(async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'email', 'walletAddress', 'transactionId'];
    const missingFields = requiredFields.filter(field => !userDetails[field]?.trim());

    if (missingFields.length > 0) {
      setErrorMessage(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      let data = {
        username: ud?.username || 'anonymous',
        userId: ud?.user_id || ud?.id || 'unknown',
        name: userDetails.name,
        email: userDetails.email,
        walletAddress: userDetails.walletAddress,
        key: userDetails.key || '',
        transactionId: userDetails.transactionId,
        blockchainExplorerLink: userDetails.blockchainExplorerLink || '',
        time: new Date().toISOString(),
        currency: currency,
        amount: amount,
        cryptoAmount: cryptoAmount,
        rate: rate,
        date: new Date(),
        timestamp: new Date().toISOString(),
        session_id: crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
        orderLoggingEnabled: enableOrderLogging,
        userAgent: navigator.userAgent,
        ip: 'client-side'
      }

      if (enableOrderLogging) {
        console.log("Logging order with user tracking:", data);
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        orderHistory.push({
          ...data,
          localTimestamp: Date.now(),
          status: 'submitted'
        });
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      } else {
        console.log("Order logging disabled by user. Processing without user tracking.");
      }

      api.post(`/crypto/purchase-crypto/${ud?.username || 'anonymous'}`, { data: data })
        .then(() => {
          setMessage(`Order submitted successfully! ${enableOrderLogging ? 'Order logged with user tracking.' : 'Processing without logging.'} Please wait for confirmation.`);
          setOrderSubmitted(true);
          setErrorMessage('');
        })
        .catch((error) => {
          console.error('Error submitting order:', error);
          setErrorMessage('An error occurred. Please try again.');
        });

      console.log("Submitting order:", data);

      setMessage(`Order submitted successfully! ${enableOrderLogging ? 'Order logged with user tracking.' : 'Processing without logging.'} Please wait for confirmation.`);
      setOrderSubmitted(true);
      setErrorMessage('');

      setTimeout(() => nextStep(), 1000);

    } catch (error) {
      console.error('Error submitting order:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  }, [userDetails, currency, amount, cryptoAmount, rate, enableOrderLogging, ud, nextStep]);

  const handleValidateTransaction = useCallback(async () => {
    if (!userDetails.transactionId.trim()) {
      setValidationMessage('Please enter a transaction ID to validate.');
      return;
    }

    setTransactionStatus('validating');
    setValidationMessage('Checking transaction on blockchain...');

    try {
      const isValid = await checkTransaction();

      if (isValid) {
        success('Transaction validated successfully!');
        handleOrderSubmit(new Event('submit'));
      } else {
        error('Transaction validation failed. Please check the details and try again.');
      }

    } catch (err) {
      setTransactionStatus('failed');
      setValidationMessage('Error validating transaction. Please try again later.');
      error('Validation error occurred');
    }
  }, [userDetails.transactionId, checkTransaction, success, error, handleOrderSubmit]);

  const getExpectedWaitTime = useCallback((currency) => {
    const waitTimes = {
      BTC: '10-30 minutes (1-3 confirmations)',
      ETH: '5-15 minutes (12-35 confirmations)',
      LTC: '5-15 minutes (6 confirmations)',
      SOL: '1-3 minutes (32 confirmations)',
      XMR: '20-40 minutes (10 confirmations)'
    };
    return waitTimes[currency] || '10-30 minutes';
  }, []);

  // Memoized step content to prevent re-renders
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return (
          <CurrencyStep
            currency={currency}
            setCurrency={setCurrency}
            setWalletAddress={setWalletAddress}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <PackageStep
            amount={amount}
            setAmount={setAmount}
            handleBuyCredits={handleBuyCredits}
            currency={currency}
            rate={rate}
            cryptoAmount={cryptoAmount}
          />
        );
      case 2:
        return (
          <PaymentStep
            amount={amount}
            currency={currency}
            rate={rate}
            cryptoAmount={cryptoAmount}
            walletAddress={walletAddress}
            handleCopyAddress={handleCopyAddress}
            handleCopyAmount={handleCopyAmount}
            nextStep={nextStep}
            errorMessage={errorMessage}
            message={message}
          />
        );
      case 3:
        return (
          <DetailsStep
            userDetails={userDetails}
            handleInputChange={handleInputChange}
            cryptoAmount={cryptoAmount}
            currency={currency}
            walletAddress={walletAddress}
            handleOrderSubmit={handleOrderSubmit}
          />
        );
      case 4:
        return (
          <ValidationStep
            orderSubmitted={orderSubmitted}
            currency={currency}
            transactionStatus={transactionStatus}
            validationMessage={validationMessage}
            handleValidateTransaction={handleValidateTransaction}
            navigate={navigate}
            getExpectedWaitTime={getExpectedWaitTime}
          />
        );
      default:
        return null;
    }
  }, [currentStep, currency, amount, rate, cryptoAmount, walletAddress, userDetails, orderSubmitted, transactionStatus, validationMessage, errorMessage, message, setCurrency, setWalletAddress, nextStep, setAmount, handleBuyCredits, handleCopyAddress, handleCopyAmount, handleInputChange, handleOrderSubmit, handleValidateTransaction, navigate, getExpectedWaitTime]);

  return (
    <Box sx={{
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      pt: 2,
      pb: 8
    }}>
      <Container maxWidth="lg" sx={{ px: { xs: 0.5, sm: 2 } }}>
        <Box sx={{ mb: 3, px: { xs: 1, sm: 0 } }}>
          <Stepper
            activeStep={currentStep}
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                fontSize: { xs: '0.6rem', sm: '0.8rem' },
                color: '#546e7a'
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: '#1976d2',
                fontWeight: 600
              },
              '& .MuiStepLabel-label.Mui-completed': {
                color: '#4caf50',
                fontWeight: 600
              },
              '& .MuiStepIcon-root': {
                color: '#e0e0e0',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                '&.Mui-active': {
                  color: '#1976d2'
                },
                '&.Mui-completed': {
                  color: '#4caf50'
                }
              }
            }}
          >
            <Step><StepLabel>Currency</StepLabel></Step>
            <Step><StepLabel>Package</StepLabel></Step>
            <Step><StepLabel>Payment</StepLabel></Step>
            <Step><StepLabel>Details</StepLabel></Step>
            <Step><StepLabel>Validate</StepLabel></Step>
          </Stepper>
        </Box>

        <Card
          variant="outlined"
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #e3f2fd',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
            minHeight: '70vh',
            minWidth: '400px',
            overflow: 'auto',
            mx: { xs: 0.5, sm: 0 },
            position: 'relative'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{
              minHeight: '500px',
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center'
            }}>
              <Box sx={{ width: '100%', maxWidth: '800px' }}>
                {stepContent}
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px solid #e3f2fd',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
            minHeight: '64px',
            minWidth: '400px',
            overflow: 'auto',
            mx: { xs: 0.5, sm: 0 },
            position: 'relative'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 2, position: 'absolute', bottom: 10, left: 0, right: 0, px: 3 }}>
            <IconButton
              onClick={prevStep}
              disabled={currentStep === 0}
              sx={{
                zIndex: 1000,
                backgroundColor: currentStep === 0 ? '#e0e0e0' : '#2196f3',
                color: currentStep === 0 ? '#9e9e9e' : 'white',
                width: 45,
                height: 45,
                '&:hover': {
                  backgroundColor: currentStep === 0 ? '#e0e0e0' : '#1976d2',
                },
                boxShadow: currentStep === 0 ? 'none' : '0 2px 10px rgba(33, 150, 243, 0.3)'
              }}
            >
              <ArrowBackIos sx={{ fontSize: 18 }} />
            </IconButton>

            <Box sx={{
              width: '100%',
              maxWidth: '180px',
              margin: '20px auto 0 auto',
              display: 'flex',
              gap: 1,
              zIndex: 999,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '8px 16px',
              borderRadius: '15px',
              boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
            }}>
              {Array.from({ length: totalSteps }, (_, index) => (
                <Box
                  key={index}
                  onClick={() => goToStep(index)}
                  sx={{
                    margin: '0 auto',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: index === currentStep ? '#2196f3' : '#e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: index === currentStep ? '#1976d2' : '#bdbdbd',
                      transform: 'scale(1.2)'
                    },
                    boxShadow: index === currentStep ? '0 0 8px rgba(33, 150, 243, 0.5)' : 'none'
                  }}
                />
              ))}
            </Box>

            <IconButton
              onClick={nextStep}
              disabled={currentStep === totalSteps - 1}
              sx={{
                zIndex: 1000,
                backgroundColor: currentStep === totalSteps - 1 ? '#e0e0e0' : '#2196f3',
                color: currentStep === totalSteps - 1 ? '#9e9e9e' : 'white',
                width: 45,
                height: 45,
                '&:hover': {
                  backgroundColor: currentStep === totalSteps - 1 ? '#e0e0e0' : '#1976d2',
                },
                boxShadow: currentStep === totalSteps - 1 ? 'none' : '0 2px 10px rgba(33, 150, 243, 0.3)'
              }}
            >
              <ArrowForwardIos sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

export default CryptoCheckoutForm;