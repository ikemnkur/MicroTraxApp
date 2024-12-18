// Move these components to the top level of your file or into separate files
require('dotenv').config();
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
// import { stripePromise } from './path-to-stripe-promise'; // Ensure you import your stripePromise correctly
import { fetchUserProfile, walletReloadAction, validateCryptoTransaction } from "./api";
import { loadStripe } from '@stripe/stripe-js';
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

export const CryptoCheckoutForm = ({ setCoins }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const amount = query.get('amount') || 0;
    let ud = JSON.parse(localStorage.getItem("userdata"))
  
    const [userDetails, setUserDetails] = useState({
      name: '',
      email: '',
      walletAddress: '',
      key: '',
      transactionId: '',
    });
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [currency, setCurrency] = useState('BTC'); // Default currency
    const [rate, setRate] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState(''); // For success messages
  
    // Map for cryptocurrency IDs used by CoinGecko API
    const currencyIdMap = {
      BTC: 'bitcoin',
      LTC: 'litecoin',
      SOL: 'solana',
      ETH: 'ethereum',
      XMR: 'monero',
    };
  
    // Map for wallet addresses
    const walletAddressMap = {
      BTC: 'your-bitcoin-wallet-address',
      LTC: 'your-litecoin-wallet-address',
      SOL: 'your-solana-wallet-address',
      ETH: 'your-ethereum-wallet-address',
      XMR: '44X8AgosuXFCuRmBoDRc66Vw1FeCaL6vRiKRqrmqXeJdeKAciYuyaJj7STZnHMg7x8icHJL6M1hzeAPqSh8NSC1GGC9bkCp',
    };
  
    // Fetch current crypto rates whenever currency changes
    useEffect(() => {
      const fetchRate = async () => {
        try {
          const currencyId = currencyIdMap[currency];
  
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${currencyId}&vs_currencies=usd`
          );
          const data = await response.json();
          setRate(data[currencyId].usd); // USD value of 1 unit of selected currency
        } catch (error) {
          console.error('Error fetching crypto rates:', error);
          setErrorMessage('Unable to fetch current rates. Please try again later.');
        }
      };
      setTimeout(()=>{
          fetchRate();
      }, 500)
      
    }, [currency]);
  
    // Calculate the amount in USD and crypto
    const dollarValueOfCoins = amount / 1000; // Assuming 1000 coins = $1
    const cryptoAmount = rate ? (dollarValueOfCoins / rate).toFixed(8) : '0.00000000'; // Amount of crypto to send
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUserDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleOrderSubmit = async (e) => {
      e.preventDefault();
  
      // Simple validation
      if (!userDetails.name || !userDetails.email || !userDetails.walletAddress) {
        setErrorMessage('Please fill out all required fields.');
        return;
      }
  
      // Send order details to backend
      try {
  
      let data = {
          username: ud.username,
          userId: ud.user_id,
          name: userDetails.name,
          email: userDetails.email,
          walletAddress: userDetails.walletAddress,
          key:  userDetails.key,
          transactionId: userDetails.transactionId,
          currency: currency,
          amount: amount,
          cryptoAmount: cryptoAmount,
          date: new Date(),
          session_id: uuidv4()
      }
  
        const response = await validateCryptoTransaction(data);
       
        console.log("Response: ", response)

        if (response.ok) {
          setOrderSubmitted(true);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to submit order.');
        }
      } catch (error) {
        console.error('Error submitting order:', error);
        setErrorMessage('An error occurred. Please try again.');
      }
    };
  
    const handleCancelOrder = () => {
      // Navigate back to dashboard or previous page
      navigate('/dashboard'); // Adjust the path as needed
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
  
    const walletAddress = walletAddressMap[currency] || 'YOUR_WALLET_ADDRESS_HERE';
  
    if (orderSubmitted) {
      return (
        <div id="checkout" style={styles.container}>
          <h2>Order Logged!</h2>
          <p>
            Please send <strong>{cryptoAmount} {currency}</strong> to the following wallet address:
          </p>
          <div style={styles.walletAddressContainer}>
            <p style={styles.walletAddress}>{walletAddress}</p>
            <button style={styles.button} onClick={handleCopyAddress}>
              Copy Address
            </button>
          </div>
          {message && <p style={styles.successMessage}>{message}</p>}
          {/* <p>
            After sending the payment, please provide the transaction ID so we can verify your payment.
          </p> */}
          <p>
            You will receive your coins once the transaction is confirmed.
            You check back on this order in a few hours.
          </p>
        </div>
      );
    }
  
    return (
      <div id="checkout" style={styles.container}>
        <div style={styles.header}>
          <h1>You are buying: {parseInt(amount).toLocaleString()} Coins</h1>
        </div>
  
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        {message && <p style={styles.successMessage}>{message}</p>}
         <div style={styles.walletInfo}>
          <p>
            Please send <strong>{cryptoAmount} {currency}</strong> to the following wallet address:
          </p>
          <div style={styles.walletAddressContainer}>
            <p style={styles.walletAddress}>{walletAddress}</p>
            <button style={styles.button} onClick={handleCopyAddress}>
              Copy Address
            </button>
          </div>
          {message && <p style={styles.successMessage}>{message}</p>}
        </div>
        <br></br>
        <form onSubmit={handleOrderSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label>
              Name:<span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={userDetails.name}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
  
          <div style={styles.formGroup}>
            <label>
              Email:<span style={styles.required}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
  
          <div style={styles.formGroup}>
            <label>
              Your Wallet Address:<span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="walletAddress"
              value={userDetails.walletAddress}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
  
          <div style={styles.formGroup}>
            <label>
            Note (KEY):
            </label>
            <input
              type="text"
              name="key"
              value={userDetails.key}
              onChange={handleInputChange}
              style={styles.input}
            />
            <small>For looking up your order later (optional)</small>
          </div>
  
          <div style={styles.formGroup}>
            <label>Transaction ID:</label>
            <input
              type="text"
              name="transactionId"
              value={userDetails.transactionId}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
  
          <div style={styles.formGroup}>
            <label>Cryptocurrency:</label>
            <select
              name="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={styles.select}
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="LTC">Litecoin (LTC)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="XMR">Monero (XMR)</option>
            </select>
          </div>
  
          <div style={styles.rateInfo}>
            <p>
              Amount to Send: <strong>{cryptoAmount} {currency}</strong>
            </p>
            <p>
              Rate: 1 {currency} = ${rate} USD ~ {(1000 * rate).toLocaleString()} Coins (Max purchase is 100,000)
            </p>
          </div>
  
          <div style={styles.buttonGroup}>
            <button style={styles.button} type="submit">
              Log Your Order
            </button>
            <button style={styles.cancel_button} type="button" onClick={handleCancelOrder}>
              Cancel Order
            </button>
          </div>
        </form>
  
       
      </div>
    );
  };
  
  // Styles object
  const styles = {
    container: {
      maxWidth: '600px',
      margin: 'auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    form: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '5px',
      marginBottom: '30px',
    },
    formGroup: {
      marginBottom: '15px',
    },
    input: {
      width: '100%',
      padding: '8px 10px',
      marginTop: '5px',
      borderRadius: '3px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
    select: {
      width: '100%',
      padding: '8px 10px',
      marginTop: '5px',
      borderRadius: '3px',
      border: '1px solid #ccc',
      fontSize: '16px',
      backgroundColor: '#fff',
    },
    required: {
      color: 'red',
    },
    rateInfo: {
      marginTop: '20px',
      marginBottom: '20px',
      backgroundColor: '#e0f7fa',
      padding: '15px',
      borderRadius: '5px',
    },
    buttonGroup: {
      textAlign: 'center',
    },
    button: {
      padding: '10px 20px',
      margin: '5px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    cancel_button: {
      padding: '10px 20px',
      margin: '5px',
      backgroundColor: '#F01b2f',
      color: '#fff',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    walletInfo: {
      backgroundColor: '#fff8e1',
      padding: '15px',
      borderRadius: '5px',
    },
    walletAddressContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
      marginBottom: '10px',
    },
    walletAddress: {
      flexGrow: 1,
      fontSize: '16px',
      wordBreak: 'break-all',
    },
    errorMessage: {
      color: 'red',
      marginBottom: '20px',
    },
    successMessage: {
      color: 'green',
      marginBottom: '20px',
    },
  };
  