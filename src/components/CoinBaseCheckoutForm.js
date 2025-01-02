// Move these components to the top level of your file or into separate files
require('dotenv').config();
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUserProfile, walletCryptoReloadAction, logCoinbaseTransaction } from "./api";
import { loadStripe } from '@stripe/stripe-js';
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

export const CoinBaseCheckoutForm = ({ setCoins }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const amount = query.get('amount') || 0;
  let ud = JSON.parse(localStorage.getItem("userdata"));

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    coinbaseURL: '',
    key: '',
    transactionId: '',
    phoneNumber: '',
    date: '',
    time: '',
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [currency, setCurrency] = useState('USD'); // Default currency
  const [rate, setRate] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState(''); // For success messages
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Fetch or define your coinbase URLs
  const coinbaseURLMap = {
    C100000: 'https://commerce.coinbase.com/checkout/23b70d38-042f-418e-bee3-e16fe5721322',
    C50000: 'https://commerce.coinbase.com/checkout/a499c377-6a1f-4528-8965-a88e246f97ea',
    C20000: 'https://commerce.coinbase.com/checkout/c0fa2234-38e3-4bde-9297-a504ced038ba',
    C10000: 'https://commerce.coinbase.com/checkout/b54bf531-2dd9-4ee5-9c86-7af589810d61',
    C5000:  'https://commerce.coinbase.com/checkout/ad2a75c8-f694-4f0f-ab9a-2eebb943118d',
    C3000:  'https://commerce.coinbase.com/checkout/339b4a35-0a38-40b9-982a-18e4a75262a3',
  };

  // Just an example rate usage
  // useEffect(() => {
  //   // ...
  // }, [currency]);

  // For demonstration, we can say 1000 coins = 1 USD
  const dollarValueOfCoins = amount / 1000;
  // If you had a real rate for a crypto currency, you'd calculate `cryptoAmount`.
  const cryptoAmount = rate ? (dollarValueOfCoins / rate).toFixed(8) : '0.00000000';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!userDetails.name || !userDetails.email || !userDetails.coinbaseURL) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    // Show the confirmation dialog **before** actually doing the request
    setShowConfirmDialog(true);
  };

  // If user confirms from the dialog, proceed with submission
  const confirmSubmission = async () => {
    setShowConfirmDialog(false); // close the dialog

    try {
      let data = {
        username: ud.username,
        userId: ud.user_id,
        name: userDetails.name,
        email: userDetails.email,
        coinbaseURL: userDetails.coinbaseURL,
        key: userDetails.key,
        // transactionId: userDetails.transactionId,
        currency: currency,
        amount: amount,
        // cryptoAmount: cryptoAmount,
        date: userDetails.date,
        time: userDetails.time,
        session_id: uuidv4(),
      };

      const response = await logCoinbaseTransaction(data);

      console.log("Response: ", response);
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

  // If user cancels from the dialog
  const cancelSubmission = () => {
    setShowConfirmDialog(false);
  };

  const handleCancelOrder = () => {
    navigate('/dashboard');
  };

  // Copy the link to the clipboard
  const handleCopyURL = () => {
    const coinbaseURL = coinbaseURLMap["C" + amount] || "https://commerce.coinbase.com";
    navigator.clipboard
      .writeText(coinbaseURL)
      .then(() => {
        setMessage('URL copied to clipboard!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        console.error('Could not copy URL: ', err);
        setErrorMessage('Failed to copy address.');
      });
  };

  // **Open the link in a new tab** (mobile devices typically also open it in a new tab or new window)
  const handleOpenLink = () => {
    const coinbaseURL = coinbaseURLMap["C" + amount] || "https://commerce.coinbase.com";
    // Use window.open with _blank to open in a new tab:
    window.open(coinbaseURL, '_blank', 'noopener,noreferrer');
  };

  // Check if the order was already submitted
  if (orderSubmitted) {
    const coinbaseURL = coinbaseURLMap["C" + amount] || 'https://commerce.coinbase.com';
    return (
      <div id="checkout" style={styles.container}>
        <h2>Order Logged!</h2>
        <h2>
          Step 3: Make you you have sent the make and wait for its confirmation in your notifications.
        </h2>
        <p>
          Incase you have not visited the  link:
        </p>
        <div style={styles.coinbaseURLContainer}>
          <p style={styles.coinbaseURL}>{coinbaseURL}</p>
          <button style={styles.button} onClick={handleCopyURL}>
            Copy URL
          </button>
          {/* New button: open link in new tab */}
          <button style={styles.openButton} onClick={handleOpenLink}>
            Open Link
          </button>
        </div>
        {message && <p style={styles.successMessage}>{message}</p>}
        <p>
          You will receive your coins once the Coinbase Commerce payment is confirmed.
          Check back on this order in a few hours.
        </p>
      </div>
    );
  }

  const coinbaseURL = coinbaseURLMap["C" + amount] || 'https://commerce.coinbase.com';

  return (
    <div id="checkout" style={styles.container}>
      <div style={styles.header}>
        <h1>You are buying: {parseInt(amount).toLocaleString()} Coins</h1>
      </div>

      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      {message && <p style={styles.successMessage}>{message}</p>}
      <div style={styles.walletInfo}>
        <p>
          Please go to this link/URL to buy coins:
        </p>
        <div style={styles.coinbaseURLContainer}>
          <p style={styles.coinbaseURL}>{coinbaseURL}</p>
          <button style={styles.button} onClick={handleCopyURL}>
            Copy URL
          </button>
          {/* New button to open link in a new tab */}
          <button style={styles.openButton} onClick={handleOpenLink}>
            Open Link
          </button>
        </div>
        {message && <p style={styles.successMessage}>{message}</p>}
      </div>

      <br />

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
            Your Phone Number:<span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={userDetails.phoneNumber}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>
            Your Username:<span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="coinbaseURL"
            value={userDetails.coinbaseURL}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Amount:</label>
          <input
            type="text"
            name="transactionId"
            value={userDetails.transactionId}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Date:</label>
          <br />
          <input
            name="date"
            type="date"
            value={userDetails.date}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Time:</label>
          <input
            type="text"
            name="time"
            value={userDetails.time}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
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

      {/* Simple overlay for confirmation */}
      {showConfirmDialog && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <h3>Confirm Your Order</h3>
            <p>Please confirm all details are correct before proceeding.</p>
            <p>
              <strong>Amount:</strong> {parseInt(amount).toLocaleString()} coins
            </p>
            <p>
              <strong>Name:</strong> {userDetails.name}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            {/* Add any other fields you'd like to confirm */}
            <div style={styles.dialogButtonGroup}>
              <button onClick={confirmSubmission} style={styles.button}>
                Yes, Submit
              </button>
              <button onClick={cancelSubmission} style={styles.cancel_button}>
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
    position: 'relative',
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
  openButton: {
    padding: '10px 20px',
    marginLeft: '5px',
    backgroundColor: '#28a745',
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
  coinbaseURLContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px',
  },
  coinbaseURL: {
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
  dialogButtonGroup: {
    textAlign: 'center',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '80%',
    maxWidth: '400px',
    textAlign: 'center',
  },
};

