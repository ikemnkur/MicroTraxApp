// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { PhotoCamera } from '@mui/icons-material';
// // import { Container, Stack, Typography, Card, CardContent, Divider, Skeleton } from '@mui/material';
// // import api from '../api/client';
// import { uploadTransactionScreenshot } from './api';
// import { useToast } from './contexts/ToastContext';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhotoCamera } from '@mui/icons-material';
import {
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Divider,
  Skeleton,
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
  ArrowForwardIos,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';
import { uploadTransactionScreenshot } from './api';
import { useToast } from './contexts/ToastContext';

export function CryptoCheckoutForm({ setCoins }) {

  // Wallet address mappings from your original code
  const walletAddressMap = {
    BTC: 'bc1q4j9e7equq4xvlyu7tan4gdmkvze7wc0egvykr6',
    LTC: 'ltc1qgg5aggedmvjx0grd2k5shg6jvkdzt9dtcqa4dh',
    SOL: 'qaSpvAumg2L3LLZA8qznFtbrRKYMP1neTGqpNgtCPaU',
    ETH: '0x9a61f30347258A3D03228F363b07692F3CBb7f27',
    XMR: '44X8AgosuXFCuRmBoDRc66Vw1FeCaL6vRiKRqrmqXeJdeKAciYuyaJj7STZnHMg7x8icHJL6M1hzeAPqSh8NSC1GGC9bkCp',
  };

  // Deposit wallet address mappings with blockchain info
  const depositWalletAddressMap = {
    BTC: { address: 'bc1q4j9e7equq4xvlyu7tan4gdmkvze7wc0egvykr6', blockchain: 'bitcoin' },
    LTC: { address: 'ltc1qgg5aggedmvjx0grd2k5shg6jvkdzt9dtcqa4dh', blockchain: 'litecoin' },
    SOL: { address: 'qaSpvAumg2L3LLZA8qznFtbrRKYMP1neTGqpNgtCPaU', blockchain: 'solana' },
    ETH: { address: '0x9a61f30347258A3D03228F363b07692F3CBb7f27', blockchain: 'ethereum' },
    XMR: { address: '44X8AgosuXFCuRmBoDRc66Vw1FeCaL6vRiKRqrmqXeJdeKAciYuyaJj7STZnHMg7x8icHJL6M1hzeAPqSh8NSC1GGC9bkCp', blockchain: 'monero' },
  };

  // Currency ID mapping for CoinGecko API
  const currencyIdMap = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    LTC: 'litecoin',
    SOL: 'solana',
    XMR: 'monero'
  };

  const [balance, setBalance] = useState(null);
  const { success, error } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialAmount = query.get('amount') || 12500; // Default to most popular
  const [amount, setAmount] = useState(initialAmount);
  let ud = JSON.parse(localStorage.getItem("userdata"))

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [currency, setCurrency] = useState('BTC'); // Default currency
  const [rate, setRate] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState(''); // For success messages
  const [walletAddress, setWalletAddress] = useState(walletAddressMap[currency] || 'YOUR_WALLET_ADDRESS_HERE');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    walletAddress: '',
    key: '',
    transactionId: '',
    time: ''
  });



  // ... existing state variables ...
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  // ... all existing state and configurations remain the same ...


  const dollarValueOfCoins = amount / 1000;
  const cryptoAmount = rate ? (dollarValueOfCoins / rate).toFixed(8) : '0.00000000';

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  };

  // Modified handleBuyCredits to automatically go to next step
  // const handleBuyCredits = (packageAmount, packagePrice) => {
  //   setAmount(packageAmount);
  //   // Automatically advance to next step after selection
  //   setTimeout(() => nextStep(), 500);
  // };

  const load = async () => {
    try {
      const { data } = await api.get('/api/wallet/balance');
      setBalance(data?.balance ?? 0);
    } catch (e) {
      console.error(e);
      setBalance(100); // demo fallback
    }
  };

  // Fetch crypto rate from CoinGecko API
  const fetchCryptoRate = async (cryptoCurrency) => {
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
      // Fallback rates for demo
      const fallbackRates = { BTC: 45000, ETH: 3000, LTC: 100, SOL: 50, XMR: 150 };
      return fallbackRates[cryptoCurrency] || 0;
    }
  };

  useEffect(() => {
    load();
    // Fetch initial rate
    fetchCryptoRate(currency).then(setRate);
  }, []);

  useEffect(() => {
    // Update rate when currency changes
    fetchCryptoRate(currency).then(setRate);
  }, [currency]);

  const handleBuyCredits = (packageAmount, packagePrice) => {
    // setAmount(packageAmount);
    // // Optionally scroll to next step or highlight it
    // document.querySelector('[data-step="3"]')?.scrollIntoView({ behavior: 'smooth' });
    setAmount(packageAmount);
    // Automatically advance to next step after selection
    setTimeout(() => nextStep(), 500);
  };

  const handleCancelOrder = () => {
    // Navigate back to dashboard or previous page
    navigate('/wallet'); // Adjust the path as needed
  };

  const handleCopyAddress = () => {
    const walletAddress = walletAddressMap[currency] || 'YOUR_WALLET_ADDRESS_HERE';
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        setMessage('Wallet address copied to clipboard!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
        setErrorMessage('Failed to copy address.');
      });
  };

  const handleCopyAmount = () => {
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
  };

  // Example function to upload file to backend:
  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append('media', file);

    try {
      // uploadMediaFiles should return the media link or an object with mediaLink property
      const response = await uploadTransactionScreenshot(formData);
      console.log('Transaction screenshot file uploaded:', response);

      // If your backend returns { mediaLink: "..." }
      if (response && response.url) {
        return response.url;
      }
      // If your backend returns { mediaLink: "..." }
      if (response && response.mediaLink) {
        return response.mediaLink;
      }
      // If your backend returns the link directly
      if (typeof response === 'string') {
        return response;
      }
      throw new Error('Upload failed or invalid response');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Enhanced screenshot upload handler
  const handleScreenshotUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // File type validation
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Please upload only PNG or JPG files.');
      setUploadedFile(null);
      setFilePreview(null);
      return;
    }

    // File size validation (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileError('File size must be less than 5MB.');
      setUploadedFile(null);
      setFilePreview(null);
      return;
    }

    // Clear any previous errors
    setFileError('');
    setUploadedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // // Store file info for later use
    // const fileInfo = {
    //   name: file.name,
    //   size: file.size,
    //   type: file.type,
    //   lastModified: file.lastModified,
    //   timestamp: Date.now(),
    //   userId: ud?.user_id || ud?.id || 'unknown'
    // };

    // // In a real app, you would upload to backend here
    // console.log('Screenshot uploaded:', fileInfo);
    // setMessage('Screenshot uploaded successfully!');

    // Upload logic (if you want to upload immediately)
    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('username', ud.username);
    formData.append('userId', ud.user_id || ud.id);
    formData.append('time', new Date().toISOString().split('T')[1]);
    formData.append('date', new Date().toISOString());

    try {
      let mediaLink;

      mediaLink = await uploadToBackend(file); // server returns { mediaLink }
      formData.append('mediaLink', mediaLink);

      setMessage('Screenshot uploaded successfully!');

    } catch (error) {
      console.error('API - Error uploading screenshot:', error);
      setFileError('An error occurred while uploading the image.');
    }
  };

  // Function to remove uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setFileError('');
    // Reset the file input
    const fileInput = document.getElementById('transaction-screenshot-upload');
    if (fileInput) fileInput.value = '';
  };
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('pending'); // pending, validating, confirmed, failed
  const [validationMessage, setValidationMessage] = useState('');
  const [enableOrderLogging, setEnableOrderLogging] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    // Only validate required fields (marked with asterisk)
    const requiredFields = ['name', 'email', 'walletAddress', 'transactionId'];
    const missingFields = requiredFields.filter(field => !userDetails[field]?.trim());

    if (missingFields.length > 0) {
      setErrorMessage(`Please fill out all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Send order details to backend
    try {
      let data = {
        username: ud?.username || 'anonymous',
        userId: ud?.user_id || ud?.id || 'unknown',
        name: userDetails.name,
        email: userDetails.email,
        walletAddress: userDetails.walletAddress,
        key: userDetails.key || '',
        transactionId: userDetails.transactionId,
        transactionHash: userDetails.transactionHash || '',
        blockExplorerLink: userDetails.blockExplorerLink || '',
        currency: currency,
        amount: amount,
        cryptoAmount: cryptoAmount,
        rate: rate,
        date: new Date(),
        timestamp: new Date().toISOString(),
        session_id: crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
        orderLoggingEnabled: enableOrderLogging,
        userAgent: navigator.userAgent,
        ip: 'client-side' // Would be set by backend
      }

      // Only log order if user opted in
      if (enableOrderLogging) {
        console.log("Logging order with user tracking:", data);
        // Store in localStorage as backup
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

      // Simulate API call since validateCryptoTransaction is not imported
      console.log("Submitting order:", data);

      setMessage(`Order submitted successfully! ${enableOrderLogging ? 'Order logged with user tracking.' : 'Processing without logging.'} Please wait for confirmation.`);
      setOrderSubmitted(true);
      setErrorMessage('');

      // Scroll to Step 5
      setTimeout(() => {
        document.querySelector('[data-step="5"]')?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);

    } catch (error) {
      console.error('Error submitting order:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };



  const handleValidateTransaction = async () => {
    if (!userDetails.transactionId.trim()) {
      setValidationMessage('Please enter a transaction ID to validate.');
      return;
    }

    setTransactionStatus('validating');
    setValidationMessage('Checking transaction on blockchain...');

    try {
      // Simulate API call to validate transaction
      // In real implementation, this would check the blockchain
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API delay

      // Simulate different outcomes based on transaction ID length
      const isValid = userDetails.transactionId.length > 10;

      

      if (isValid) {
        setTransactionStatus('confirmed');
        setValidationMessage('Transaction confirmed! Your credits will be added to your account within 10 minutes.');
        success('Transaction validated successfully!');
      } else {
        setTransactionStatus('failed');
        setValidationMessage('Transaction not found or invalid. Please check your transaction ID and try again.');
        error('Transaction validation failed');
      }
    } catch (err) {
      setTransactionStatus('failed');
      setValidationMessage('Error validating transaction. Please try again later.');
      error('Validation error occurred');
    }
  };

  const getExpectedWaitTime = (currency) => {
    const waitTimes = {
      BTC: '10-30 minutes (1-3 confirmations)',
      ETH: '5-15 minutes (12-35 confirmations)',
      LTC: '5-15 minutes (6 confirmations)',
      SOL: '1-3 minutes (32 confirmations)',
      XMR: '20-40 minutes (10 confirmations)'
    };
    return waitTimes[currency] || '10-30 minutes';
  };

  const onPaymentError = () => error('Payment could not be started');

  // Step content components
  // Step content components with light theme
  const StepContent = ({ stepIndex }) => {
    switch (stepIndex) {
      case 0:
        return (
          <Box sx={{ px: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                textAlign: 'center',
                color: '#1976d2',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Step 1: Choose Purchase Currency
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.7,
                mb: 3,
                textAlign: 'center',
                color: '#546e7a',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Select your preferred cryptocurrency to purchase credits.
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
              {[
                { code: 'BTC', name: 'Bitcoin', icon: '₿', color: '#f7931a' },
                { code: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627eea' },
                { code: 'LTC', name: 'Litecoin', icon: 'Ł', color: '#345d9d' },
                { code: 'SOL', name: 'Solana', icon: '◎', color: '#9945ff' },
                { code: 'XMR', name: 'Monero', icon: 'ɱ', color: '#ff6600' }
              ].map((crypto) => (
                <Grid item xs={6} sm={4} md={2.4} key={crypto.code}>
                  <Paper
                    elevation={currency === crypto.code ? 8 : 2}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: currency === crypto.code
                        ? `linear-gradient(135deg, ${crypto.color}15, ${crypto.color}25)`
                        : 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                      border: currency === crypto.code
                        ? `2px solid ${crypto.color}`
                        : '2px solid #e3f2fd',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                      borderRadius: 3
                    }}
                    onClick={() => {
                      setCurrency(crypto.code);
                      setWalletAddress(walletAddressMap[crypto.code]);
                    }}
                  >
                    <Box sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 1, color: crypto.color }}>
                      {crypto.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: { xs: '0.9rem', sm: '1.1rem' } }}>
                      {crypto.code}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#546e7a', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
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
                  ...lightStyles.primaryButton,
                  opacity: currency ? 1 : 0.5,
                  cursor: currency ? 'pointer' : 'not-allowed'
                }}
              >
                Continue to Packages
              </button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ px: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h4"
              sx={{
          mb: 2,
          textAlign: 'center',
          color: '#1976d2',
          fontWeight: 600,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Step 2: Purchase Credits
            </Typography>
            <Typography
              variant="body1"
              sx={{
          opacity: 0.7,
          mb: 3,
          textAlign: 'center',
          color: '#546e7a',
          fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Select an amount of credits to purchase. Current purchasing: <strong style={{ color: '#1976d2' }}>{parseInt(amount).toLocaleString()} credits</strong>
            </Typography>
            {/* Centered text input for currency */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <TextField
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth={false}
          sx={{ maxWidth: 160 }}
          label="Custom Amount"
          inputProps={{ min: 1, step: 1 }}
              />
            </Box>

            <Typography
              sx={{
          fontSize: { xs: '2.5rem', sm: '3rem', md: '48px' },
          fontWeight: 'bold',
          textAlign: 'center',
          opacity: 0.85,
          mb: 3,
          color: '#1976d2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          lineHeight: 1,
          letterSpacing: '2px'
              }}
            >
              <strong>OR</strong>
            </Typography>

            <Typography
              variant="body1"
              sx={{
          opacity: 0.7,
          mb: 3,
          textAlign: 'center',
          color: '#546e7a',
          fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Select a Promo Package below: 
            </Typography>


            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {[
          { amount: 2000, price: 2.5, popular: false },
          { amount: 5000, price: 5, popular: false },
          { amount: 12500, price: 11, popular: true },
          { amount: 25000, price: 24, popular: false },
          { amount: 55000, price: 53, popular: false },
          { amount: 120000, price: 115, popular: false },
              ].map((package_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={amount == package_.amount ? 8 : package_.popular ? 6 : 2}
              sx={{
                p: { xs: 2, sm: 3 },
                textAlign: 'center',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: package_.popular
            ? 'linear-gradient(135deg, #2196f3, #21cbf3)'
            : amount == package_.amount
              ? 'linear-gradient(135deg, #1976d2, #42a5f5)'
              : 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                color: package_.popular || amount == package_.amount ? 'white' : '#1976d2',
                border: amount == package_.amount ? '3px solid #1976d2' : package_.popular ? 'none' : '2px solid #e3f2fd',
                '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
                borderRadius: 3
              }}
              onClick={() => handleBuyCredits(package_.amount, package_.price)}
            >
              {package_.popular && (
                <Chip
            label="MOST POPULAR"
            sx={{
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#ff9800',
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '0.6rem', sm: '0.7rem' }
            }}
                />
              )}

              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {package_.amount.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                Credits
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                ${package_.price} USD
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                ≈ {cryptoAmount && rate ? (package_.price / rate).toFixed(6) : '0.000000'} {currency}
              </Typography>
            </Paper>
          </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ px: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                textAlign: 'center',
                color: '#1976d2',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Step 3: Send Cryptocurrency
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.7,
                mb: 3,
                textAlign: 'center',
                color: '#546e7a',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Send the exact amount of cryptocurrency to the wallet address below.
            </Typography>

            <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, mb: 3, background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', borderRadius: 3 }}>
              <Typography variant="h5" sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 600, mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                You are buying: {parseInt(amount).toLocaleString()} Credits
              </Typography>
              <Typography variant="h6" sx={{ textAlign: 'center', color: '#1565c0', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Total: ${((parseInt(amount) / 1000) || 0).toFixed(2)} USD
              </Typography>
            </Paper>

            {errorMessage && (
              <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: 2 }}>
                <Typography color="#d32f2f" sx={{ textAlign: 'center', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  {errorMessage}
                </Typography>
              </Paper>
            )}

            {message && (
              <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: 2 }}>
                <Typography color="#2e7d32" sx={{ textAlign: 'center', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  {message}
                </Typography>
              </Paper>
            )}

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', background: 'linear-gradient(135deg, #1976d2, #42a5f5)', color: 'white', borderRadius: 3 }}>
                  <Box sx={{ fontSize: { xs: '2rem', sm: '3rem' }, mb: 2 }}>
                    {{ BTC: '₿', ETH: 'Ξ', LTC: 'Ł', SOL: '◎', XMR: 'ɱ' }[currency]}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                    {{ BTC: 'Bitcoin', ETH: 'Ethereum', LTC: 'Litecoin', SOL: 'Solana', XMR: 'Monero' }[currency]} ({currency})
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    Current Rate: <strong>${rate ? rate.toLocaleString() : '...'}</strong> USD
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #ffffff, #f8f9fa)', border: '2px solid #2196f3', borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, textAlign: 'center', fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    Payment Instructions
                  </Typography>
                  <Typography sx={{ mb: 2, textAlign: 'center', color: '#546e7a', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    Please send <strong style={{ color: '#1976d2' }}>{cryptoAmount} {currency}</strong> to the following wallet address:
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Paper elevation={2} sx={{ p: 2, backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: 2 }}>
                      <Typography sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        Amount: {cryptoAmount} {currency}
                      </Typography>
                      <button
                        style={{ ...lightStyles.secondaryButton, width: '100%', marginTop: '8px' }}
                        onClick={handleCopyAmount}
                      >
                        Copy Amount
                      </button>
                    </Paper>
                  </Box>

                  <Box>
                    <Paper elevation={2} sx={{ p: 2, backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: 2 }}>
                      <Typography sx={{ wordBreak: 'break-all', fontFamily: 'monospace', mb: 1, color: '#1976d2', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                        {walletAddress}
                      </Typography>
                      <button
                        style={{ ...lightStyles.secondaryButton, width: '100%', marginTop: '8px' }}
                        onClick={handleCopyAddress}
                      >
                        Copy Address
                      </button>
                    </Paper>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <button onClick={nextStep} style={lightStyles.primaryButton}>
                I've Sent the Payment
              </button>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ px: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                textAlign: 'center',
                color: '#1976d2',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Step 4: Submit Transaction Details
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.7,
                mb: 3,
                textAlign: 'center',
                color: '#546e7a',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              After sending the cryptocurrency, please fill out the form below to log your order.
              Fields marked with <span style={{ color: '#f44336', fontWeight: 'bold' }}>*</span> are required.
            </Typography>

            <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #ffffff, #f8f9fa)', border: '1px solid #e3f2fd', borderRadius: 3 }}>
              <form onSubmit={handleOrderSubmit}>
                <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                  <Typography sx={{ textAlign: 'center', color: '#1976d2', fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    After sending <strong>{cryptoAmount} {currency}</strong> to wallet: {walletAddress.slice(0, 20)}...
                    <br />Fill out the form below to log your order for manual review.
                  </Typography>
                </Paper>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={lightStyles.formGroup}>
                      <label style={lightStyles.label}>Full Name:<span style={lightStyles.required}>*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={userDetails.name}
                        onChange={handleInputChange}
                        required
                        style={lightStyles.input}
                        placeholder="Enter your full name"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={lightStyles.formGroup}>
                      <label style={lightStyles.label}>Email Address:<span style={lightStyles.required}>*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleInputChange}
                        required
                        style={lightStyles.input}
                        placeholder="Enter your email address"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={lightStyles.formGroup}>
                      <label style={lightStyles.label}>Your Wallet Address:<span style={lightStyles.required}>*</span></label>
                      <input
                        type="text"
                        name="walletAddress"
                        value={userDetails.walletAddress}
                        onChange={handleInputChange}
                        required
                        style={lightStyles.input}
                        placeholder="Enter the wallet address you sent from"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={lightStyles.formGroup}>
                      <label style={lightStyles.label}>Transaction ID/Hash:<span style={lightStyles.required}>*</span></label>
                      <input
                        type="text"
                        name="transactionId"
                        value={userDetails.transactionId}
                        onChange={handleInputChange}
                        required
                        style={lightStyles.input}
                        placeholder="Enter the transaction ID or hash"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    {/* Upload Section */}
                    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f8f9fa', border: '2px dashed #2196f3', borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, fontWeight: 600, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                        Payment Screenshot (Optional):
                      </Typography>

                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <input
                          accept=".png,.jpg,.jpeg"
                          style={{ display: 'none' }}
                          id="transaction-screenshot-upload"
                          type="file"
                          onChange={handleScreenshotUpload}
                        />
                        <label htmlFor="transaction-screenshot-upload">
                          <button
                            type="button"
                            style={lightStyles.uploadButton}
                            onClick={() => document.getElementById('transaction-screenshot-upload').click()}
                          >
                            <PhotoCamera style={{ marginRight: '8px', fontSize: '20px' }} />
                            {uploadedFile ? 'Change Screenshot' : 'Upload Screenshot'}
                          </button>
                        </label>
                      </Box>

                      {fileError && (
                        <Paper elevation={1} sx={{ p: 2, backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: 1, mb: 2 }}>
                          <Typography color="#d32f2f" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                            ⚠️ {fileError}
                          </Typography>
                        </Paper>
                      )}

                      {uploadedFile && (
                        <Paper elevation={2} sx={{ p: 2, backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: 2, mb: 2 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={4}>
                              <img
                                src={filePreview}
                                alt="Payment screenshot preview"
                                style={{
                                  width: '100%',
                                  maxWidth: '128px',
                                  height: '128px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '2px solid #2196f3'
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                                📎 {uploadedFile.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#546e7a', mb: 1 }}>
                                {(uploadedFile.size / 1024).toFixed(1)} KB
                              </Typography>
                              <Chip
                                label={uploadedFile.type.split('/')[1].toUpperCase()}
                                size="small"
                                sx={{ backgroundColor: '#2196f3', color: 'white' }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <button
                                type="button"
                                onClick={handleRemoveFile}
                                style={lightStyles.removeButton}
                              >
                                🗑️
                              </button>
                            </Grid>
                          </Grid>
                        </Paper>
                      )}

                      <Typography variant="body2" sx={{ textAlign: 'center', color: '#546e7a', fontStyle: 'italic', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                        📸 Upload a screenshot of your payment confirmation (PNG or JPG only, max 5MB)
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <button style={lightStyles.submitButton} type="submit">
                    Log Your Order
                  </button>
                </Box>
              </form>
            </Paper>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ px: { xs: 1, sm: 2 } }}>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                textAlign: 'center',
                color: '#1976d2',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Step 5: Transaction Status & Validation
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.7,
                mb: 3,
                textAlign: 'center',
                color: '#546e7a',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              {orderSubmitted
                ? 'Your order has been logged. Use the tools below to check your transaction status.'
                : 'After submitting your order details, you can validate your transaction here.'
              }
            </Typography>

            <Paper elevation={4} sx={{ p: { xs: 2, sm: 3 }, mb: 3, background: 'linear-gradient(135deg, #ffffff, #f8f9fa)', border: '2px solid #2196f3', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ color: '#1976d2', mb: 3, textAlign: 'center', fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Transaction Validation
              </Typography>

              <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3, backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: 2 }}>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#2e7d32', mb: 1 }}>
                  <strong>Expected confirmation time for {currency}:</strong>
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, color: '#1b5e20', fontWeight: 600 }}>
                  {getExpectedWaitTime(currency)}
                </Typography>
              </Paper>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <button
                  type="button"
                  onClick={handleValidateTransaction}
                  disabled={transactionStatus === 'validating'}
                  style={{
                    ...lightStyles.primaryButton,
                    opacity: transactionStatus === 'validating' ? 0.6 : 1,
                    cursor: transactionStatus === 'validating' ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    padding: '15px 30px'
                  }}
                >
                  {transactionStatus === 'validating' ? (
                    <>
                      <span style={{ marginRight: '10px' }}>⏳</span>
                      Validating Transaction...
                    </>
                  ) : (
                    <>
                      <span style={{ marginRight: '10px' }}>🔍</span>
                      Validate Transaction
                    </>
                  )}
                </button>
              </Box>

              {validationMessage && (
                <Paper
                  elevation={2}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    textAlign: 'center',
                    backgroundColor: transactionStatus === 'confirmed' ? '#e8f5e8' :
                      transactionStatus === 'failed' ? '#ffebee' : '#e3f2fd',
                    border: `1px solid ${transactionStatus === 'confirmed' ? '#4caf50' :
                      transactionStatus === 'failed' ? '#f44336' : '#2196f3'}`,
                    borderRadius: 2
                  }}
                >
                  <Typography sx={{
                    color: transactionStatus === 'confirmed' ? '#2e7d32' :
                      transactionStatus === 'failed' ? '#d32f2f' : '#1976d2',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
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
                <button
                  onClick={() => navigate('/wallet')}
                  style={{
                    ...lightStyles.successButton,
                    fontSize: { xs: '14px', sm: '16px' },
                    padding: '15px 30px'
                  }}
                >
                  <span style={{ marginRight: '10px' }}>🎉</span>
                  Go to Wallet
                </button>
              ) : (
                <>
                  <button
                    onClick={() => window.location.reload()}
                    style={{
                      ...lightStyles.primaryButton,
                      fontSize: '14px',
                      padding: '12px 24px'
                    }}
                  >
                    Complete Purchase
                  </button>
                  <button
                    onClick={() => navigate('/wallet')}
                    style={{
                      ...lightStyles.secondaryButton,
                      fontSize: '14px',
                      padding: '12px 24px'
                    }}
                  >
                    Back to Wallet
                  </button>
                </>
              )}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, position: 'relative', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Progress Stepper */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          sx={{
            '& .MuiStepLabel-label': {
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
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
              '&.Mui-active': {
                color: '#1976d2'
              },
              '&.Mui-completed': {
                color: '#4caf50'
              }
            }
          }}
        >
          <Step>
            <StepLabel>Choose Currency</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select Package</StepLabel>
          </Step>
          <Step>
            <StepLabel>Send Payment</StepLabel>
          </Step>
          <Step>
            <StepLabel>Submit Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Validation</StepLabel>
          </Step>
        </Stepper>
      </Box>

      {/* Navigation Buttons */}
      <IconButton
        onClick={prevStep}
        disabled={currentStep === 0}
        sx={{
          position: 'fixed',
          top: '50%',
          left: { xs: 8, sm: 16 },
          transform: 'translateY(-50%)',
          zIndex: 1000,
          backgroundColor: currentStep === 0 ? '#e0e0e0' : '#2196f3',
          color: currentStep === 0 ? '#9e9e9e' : 'white',
          width: { xs: 45, sm: 55 },
          height: { xs: 45, sm: 55 },
          '&:hover': {
            backgroundColor: currentStep === 0 ? '#e0e0e0' : '#1976d2',
          },
          boxShadow: currentStep === 0 ? 'none' : '0 4px 15px rgba(33, 150, 243, 0.3)'
        }}
      >
        <ArrowBackIos sx={{ fontSize: { xs: 18, sm: 22 } }} />
      </IconButton>

      <IconButton
        onClick={nextStep}
        disabled={currentStep === totalSteps - 1}
        sx={{
          position: 'fixed',
          top: '50%',
          right: { xs: 8, sm: 16 },
          transform: 'translateY(-50%)',
          zIndex: 1000,
          backgroundColor: currentStep === totalSteps - 1 ? '#e0e0e0' : '#2196f3',
          color: currentStep === totalSteps - 1 ? '#9e9e9e' : 'white',
          width: { xs: 45, sm: 55 },
          height: { xs: 45, sm: 55 },
          '&:hover': {
            backgroundColor: currentStep === totalSteps - 1 ? '#e0e0e0' : '#1976d2',
          },
          boxShadow: currentStep === totalSteps - 1 ? 'none' : '0 4px 15px rgba(33, 150, 243, 0.3)'
        }}
      >
        <ArrowForwardIos sx={{ fontSize: { xs: 18, sm: 22 } }} />
      </IconButton>

      {/* Main Content Area */}
      <Card
        variant="outlined"
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '2px solid #e3f2fd',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(33, 150, 243, 0.1)',
          minHeight: '70vh',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Step Content with Slide Animation */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: { xs: '500px', sm: '600px' }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                width: `${totalSteps * 100}%`,
                transform: `translateX(-${(currentStep * 100) / totalSteps}%)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            >
              {Array.from({ length: totalSteps }, (_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: `${100 / totalSteps}%`,
                    flexShrink: 0,
                    p: { xs: 2, sm: 4 },
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: { xs: '500px', sm: '600px' }
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <StepContent stepIndex={index} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Step Indicators */}
      <Box sx={{
        position: 'fixed',
        bottom: { xs: 20, sm: 30 },
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 1,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 16px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <Box
            key={index}
            onClick={() => goToStep(index)}
            sx={{
              width: { xs: 10, sm: 14 },
              height: { xs: 10, sm: 14 },
              borderRadius: '50%',
              backgroundColor: index === currentStep ? '#2196f3' : '#e0e0e0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: index === currentStep ? '#1976d2' : '#bdbdbd',
                transform: 'scale(1.2)'
              },
              boxShadow: index === currentStep ? '0 0 10px rgba(33, 150, 243, 0.5)' : 'none'
            }}
          />
        ))}
      </Box>
    </Container>
  );
}

// Light theme styles
const lightStyles = {
  primaryButton: {
    padding: '12px 32px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
    ':hover': {
      backgroundColor: '#1976d2',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
    }
  },

  secondaryButton: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: '#2196f3',
    border: '2px solid #2196f3',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#2196f3',
      color: 'white',
      transform: 'translateY(-2px)',
    }
  },

  submitButton: {
    padding: '12px 32px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
    ':hover': {
      backgroundColor: '#43a047',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
    }
  },

  successButton: {
    padding: '12px 32px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
  },

  uploadButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
  },

  removeButton: {
    padding: '8px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    width: '100%',
    boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
  },

  formGroup: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#1976d2',
    fontSize: '14px',
  },

  required: {
    color: '#f44336',
    fontWeight: 'bold',
  },

  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #e3f2fd',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: '#333',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    ':focus': {
      outline: 'none',
      borderColor: '#2196f3',
      boxShadow: '0 0 10px rgba(33, 150, 243, 0.2)',
    },
    ':hover': {
      borderColor: '#bbdefb',
    },
  }
};