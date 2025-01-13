// require('dotenv').config();
// import React, { useState, useEffect } from 'react';
// import { Typography, TextField, MenuItem, Select, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Snackbar } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import {
//   fetchWalletData,
// } from './api';

// const ReloadWallet = () => {
//   const [amount, setAmount] = useState(10000);
//   const [paymentMethod, setPaymentMethod] = useState('stripe');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [walletData, setWalletData] = useState(null);
//   const [purchaseAmount, setPurchaseAmount] = useState('20');

//   const [isLoading, setIsLoading] = useState(true);

//   const navigate = useNavigate()

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Reloading wallet with', amount, 'via', paymentMethod);
//     goToCheckOut();
//     setOpenSnackbar(true);
//     setAmount('');
//   };

//   const loadWalletData = async () => {
//     try {
//       setIsLoading(true);
//       const data = await fetchWalletData();
//       setWalletData(data);
//     } catch (err) {
//       console.error('Error fetching wallet data:', err);
//       setError('Failed to load wallet data. Please try again.');
//       setTimeout(() => navigate('/'), 1000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit2 = async (e) => {
//     e.preventDefault();

//     // Validation: Check if amount meets the minimum withdrawal requirement
//     if (amountNum < min) {
//       setSnackbarMessage(`Minimum withdrawal amount for ${methodNames[withdrawMethod]} is ${min} coins.`);
//       setOpenSnackbar(true);
//       return;
//     }

//     // Prepare withdrawal data
//     const withdrawData = {
//       username: userData.username,
//       amount: amountNum,
//       email: userData.email,
//       firstname: userData.firstName,
//       lastname: userData.lastName,
//       date: new Date().toISOString(),
//       currency: withdrawMethod === 'USD' ? 'USD' : withdrawMethod,
//       rate: rate,
//       minWithdraw: min,
//       fees: fee,
//       serverCost: serverCost,
//       balance: walletData?.balance,
//       waitTime: time,
//       method: withdrawMethod,
//       extraData: extraFormData,
//     };

//     // Call the withdrawal function
//     await makeWithdraw(withdrawData);
//     setAmount('');
//     setExtraFormData({});
//   };

//   const goToCheckOut = () => {
//     if (paymentMethod === "stripe")
//       navigate(`/stripe-checkout?amount=${purchaseAmount}`);
//     if (paymentMethod === "crypto")
//       navigate(`/crypto-checkout?amount=${amount}`);
//     if (paymentMethod === "cashapp")
//       navigate(`/cashapp-checkout?amount=${amount}`);
//     if (paymentMethod === "coinbase")
//       navigate(`/coinbase-checkout?amount=${purchaseAmount*1000}`);

//   };

//   useEffect(() => {
//     // loadUserContent();
//     // loadUserSubscriptions();
//     loadWalletData();
//   }, []);

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>Reload Digital Wallet</Typography>
//       <Paper sx={{ p: 2 }}>
//         <form onSubmit={handleSubmit}>
//           {!isLoading && (
//             <Box sx={{ display: 'block', justifyContent: 'space-around', mt: 2, padding: "5px" }}>
//               <Typography variant="h6" gutterBottom>
//                 Current Balance: ₡{walletData?.balance}
//               </Typography>
//               {/* <Typography variant="body1" gutterBottom>
//                 Account Tier: {walletData?.accountTier}
//               </Typography> */}
//               <Typography variant="body1" gutterBottom>
//                 Coins that you can spend: ₡{walletData?.spendable}
//               </Typography>
//             </Box>
//           )}

//           {/* Payment Method */}
//           <FormControl margin="normal">
//             <FormLabel>Select a payment method</FormLabel>
//             <br></br>
//             <Select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               variant="outlined"
//             >
//               <MenuItem value="crypto">Crypto (Manual)</MenuItem>
//               <MenuItem value="cashapp">CashApp</MenuItem>
//               <MenuItem value="coinbase">Coinbase</MenuItem> 
//               <MenuItem value="stripe">Stripe</MenuItem>
//             </Select>
//           </FormControl>

//           {/* Amount Selection */}
//           <Box marginTop={2}>
//           {paymentMethod != 'coinbase' && (<FormLabel>Select an amount to buy</FormLabel>)}
//             <></>
//             <br></br>
//             {/* If crypto, show TextField */}
//             {paymentMethod === 'crypto' && (
//               <TextField
//                 label="Amount"
//                 fullWidth
//                 margin="normal"
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 required
//                 inputProps={{ min: '0.01', step: '0.01' }}
//               />
//             )}
//             {/* If cashapp, show +/- buttons + TextField */}
//             {paymentMethod === 'cashapp' && (
//               <div style={{ display: 'flex' }}>
//                 <button
//                   onClick={() => setAmount(amount - 1)}
//                   style={{ width: 32, height: 32, margin: 'auto 10px', padding: 5 }}
//                 >
//                   -
//                 </button>
//                 <TextField
//                   label="Amount"
//                   fullWidth
//                   margin="normal"
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   required
//                   inputProps={{ min: '5', step: '0.5' }}
//                 />
//                 <button
//                   onClick={() => setAmount(amount + 1)}
//                   style={{ width: 32, height: 32, margin: 'auto 10px', padding: 5 }}
//                 >
//                   +
//                 </button>
//               </div>
//             )}
//             {/* If stripe, show a second Select */}
//             {paymentMethod === 'stripe' && (
//               <FormControl >
//                 <Select
//                   value={purchaseAmount}
//                   onChange={(e) => setPurchaseAmount(e.target.value)}
//                   variant="outlined"
//                 >
//                   <MenuItem value="3">3000 coins</MenuItem>
//                   <MenuItem value="5">5000 coins</MenuItem>
//                   <MenuItem value="10">10000 coins</MenuItem>
//                   <MenuItem value="20">20000 coins</MenuItem>
//                   <MenuItem value="50">50000 coins</MenuItem>
//                   <MenuItem value="100">100000 coins</MenuItem>
//                 </Select>
//               </FormControl>
//             )}
//             {paymentMethod === 'coinbase' && (
//                <FormControl >
//                <Select
//                  value={purchaseAmount}
//                  onChange={(e) => setPurchaseAmount(e.target.value)}
//                  variant="outlined"
//                >
//                  <MenuItem value="3">3000 coins</MenuItem>
//                  <MenuItem value="5">5000 coins</MenuItem>
//                  <MenuItem value="10">10000 coins</MenuItem>
//                  <MenuItem value="20">20000 coins</MenuItem>
//                  <MenuItem value="50">50000 coins</MenuItem>
//                  <MenuItem value="100">100000 coins</MenuItem>
//                </Select>
//              </FormControl>
//             )}
//           </Box>



//           <br></br>
//           <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//             Reload Wallet
//           </Button>
//         </form>
//       </Paper><></>
//       {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
        
//       </Dialog> */}
//       <Snackbar
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={() => setOpenSnackbar(false)}
//         message={`Wallet reloaded with $${amount} via ${paymentMethod}!`}
//       />
//     </Box>
//   );
// };

// export default ReloadWallet;

require('dotenv').config();
import React, { useState, useEffect } from 'react';
import { Typography, TextField, MenuItem, Select, Button, Paper, FormControl, FormLabel, Box, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchWalletData } from './api';

const ReloadWallet = () => {
  const [amount, setAmount] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState('20');
  const [error, setError] = useState(null); // Add an error state if not already declared
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Load wallet data
  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWalletData();
      setWalletData(data);
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to load wallet data. Please try again.');
      setTimeout(() => navigate('/'), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  // Handle the main form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reloading wallet with', amount, 'coins via', paymentMethod);
    goToCheckOut();
    setOpenSnackbar(true);
    // Optionally reset amount if you want:
    // setAmount('');
  };

  // Navigate to the correct checkout route
  const goToCheckOut = () => {
    if (paymentMethod === 'stripe') {
      navigate(`/stripe-checkout?amount=${purchaseAmount}`);
    } else if (paymentMethod === 'crypto') {
      navigate(`/crypto-checkout?amount=${amount}`);
    } else if (paymentMethod === 'cashapp') {
      navigate(`/cashapp-checkout?amount=${amount}`);
    } else if (paymentMethod === 'coinbase') {
      navigate(`/coinbase-checkout?amount=${purchaseAmount * 1000}`);
    }
  };

  // Helpers for adjusting amount when paymentMethod === 'cashapp'
  const handleDecrement = () => {
    // Convert string->number if amount is string:
    setAmount((prev) => Number(prev) - 1);
  };

  const handleIncrement = () => {
    setAmount((prev) => Number(prev) + 1);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reload Digital Wallet
      </Typography>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={handleSubmit}>
          {!isLoading && (
            <Box sx={{ display: 'block', justifyContent: 'space-around', mt: 2, padding: '5px' }}>
              <Typography variant="h6" gutterBottom>
                Current Balance: ₡{walletData?.balance}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Coins that you can spend: ₡{walletData?.spendable}
              </Typography>
            </Box>
          )}

          {/* Payment Method */}
          <FormControl margin="normal">
            <FormLabel>Select a payment method</FormLabel>
            <br />
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="crypto">Crypto (Manual)</MenuItem>
              <MenuItem value="cashapp">CashApp</MenuItem>
              <MenuItem value="coinbase">Coinbase</MenuItem>
              <MenuItem value="stripe">Stripe</MenuItem>
            </Select>
          </FormControl>

          {/* Amount Selection */}
          <Box marginTop={2}>
            {paymentMethod !== 'coinbase' && <FormLabel>Select an amount to buy</FormLabel>}
            <br />

            {/* If crypto, show TextField for any numeric input */}
            {paymentMethod === 'crypto' && (
              <TextField
                label="Amount"
                fullWidth
                margin="normal"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                inputProps={{ min: '0.01', step: '0.01' }}
              />
            )}

            {/* If cashapp, show +/- buttons around a TextField */}
            {paymentMethod === 'cashapp' && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"     // Prevents form submission
                  onClick={handleDecrement}
                  style={{ width: 32, height: 32, margin: 'auto 10px', padding: 5 }}
                >
                  -
                </button>
                <TextField
                  label="Amount"
                  style={{ flex: 1 }}
                  margin="normal"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  inputProps={{ min: '5', step: '0.5' }}
                />
                <button
                  type="button"     // Prevents form submission
                  onClick={handleIncrement}
                  style={{ width: 32, height: 32, margin: 'auto 10px', padding: 5 }}
                >
                  +
                </button>
              </div>
            )}

            {/* If stripe, show a second select for preset amounts */}
            {paymentMethod === 'stripe' && (
              <FormControl>
                <Select
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="3">3000 coins</MenuItem>
                  <MenuItem value="5">5000 coins</MenuItem>
                  <MenuItem value="10">10000 coins</MenuItem>
                  <MenuItem value="20">20000 coins</MenuItem>
                  <MenuItem value="50">50000 coins</MenuItem>
                  <MenuItem value="100">100000 coins</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* If coinbase, show similar select for preset amounts but multiply by 1000 in goToCheckOut */}
            {paymentMethod === 'coinbase' && (
              <FormControl>
                <Select
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="3">3000 coins</MenuItem>
                  <MenuItem value="5">5000 coins</MenuItem>
                  <MenuItem value="10">10000 coins</MenuItem>
                  <MenuItem value="20">20000 coins</MenuItem>
                  <MenuItem value="50">50000 coins</MenuItem>
                  <MenuItem value="100">100000 coins</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>

          <br />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Reload Wallet
          </Button>
        </form>
      </Paper>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={`Wallet reloaded with ${amount} coins via ${paymentMethod}!`}
      />
    </Box>
  );
};

export default ReloadWallet;