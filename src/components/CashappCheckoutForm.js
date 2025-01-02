// Move these components to the top level of your file or into separate files
require('dotenv').config();
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
// import { stripePromise } from './path-to-stripe-promise'; // Ensure you import your stripePromise correctly
import { fetchUserProfile, walletCryptoReloadAction, logCashappTransaction } from "./api";
import { loadStripe } from '@stripe/stripe-js';
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

export const CashappCheckoutForm = ({ setCoins }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const amount = query.get('amount') || 0;
  let ud = JSON.parse(localStorage.getItem("userdata"))

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    cashappTag: '',
    key: '',
    transactionId: '',
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [currency, setCurrency] = useState('USD'); // Default currency
  const [rate, setRate] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState(''); // For success messages

// this is a copy of a file I made I am converting this 

  // Calculate the amount in USD and crypto
  const cashappAmount = amount / 1000; // Assuming 1000 coins = $1
  

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
    if (!userDetails.name || !userDetails.email || !userDetails.cashappTag) {
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
        cashappTag: userDetails.cashappTag,
        key: userDetails.key,
        transactionId: userDetails.transactionId,
        currency: currency,
        amount: amount,
        cashappAmount: cashappAmount,
        date: new Date(),
        session_id: uuidv4()
      }

      const response = await logCashappTransaction(data);

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
    const cashappTag = '$CloutCoinPay';
    navigator.clipboard
      .writeText(cashappTag)
      .then(() => {
        setMessage('Cash Tag copied to clipboard!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        console.error('Could not copy Cashapp tag: ', err);
        setErrorMessage('Failed to copy address.');
      });
  };

  const cashappTag = '$CloutCoinPay';

  if (orderSubmitted) {
    return (
      <div id="checkout" style={styles.container}>
        <h2>Order Logged!</h2>
        <h2>
          Step 3: Make you you have sent the make and wait for its confirmation
        </h2>
        <p>
          Please make sure that you have sent <strong>{cashappAmount} {currency}</strong> to the following the following CashApp Tag:
        </p>
        <div style={styles.cashappTagContainer}>
          <p style={styles.cashappTag}>{cashappTag}</p>
          <button style={styles.button} onClick={handleCopyAddress}>
            Copy Cashapp Tag
          </button>
        </div>
        {message && <p style={styles.successMessage}>{message}</p>}
        {/* <p>
            After sending the payment, please provide the transaction ID so we can verify your payment.
          </p> */}
        <p>
          You will receive your coins once the cashapp payment transaction is confirmed.
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
      <h2>
        Step 1: Send money to the cashapp account below:
      </h2>
      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      {message && <p style={styles.successMessage}>{message}</p>}
      <div style={styles.walletInfo}>
        <p>
          Please send <strong>{cashappAmount} {currency}</strong> to the following cashapp account:
        </p>
        <div style={styles.cashappTagContainer}>
          <img width="256px" src="./public/CashappQR.jpg"></img>
          <br></br>

        </div>
        <div style={styles.cashappTagContainer}>
          <p style={styles.cashappTag}>{cashappTag}</p>
          <button style={styles.button} onClick={handleCopyAddress}>
            Copy Cash App Tag
          </button>
        </div>
        {message && <p style={styles.successMessage}>{message}</p>}
      </div>
      <br></br>
      <h2>
        Step 2: Log the details of you order in this form below:
      </h2>
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

            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>
            Your Cashapp User Tag/Name:<span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="cashappTag"
            value={userDetails.cashappTag}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>


        <div style={styles.formGroup}>
          <label>Amount Sent ($USD):</label>
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
          <label>Date of Payment:</label>
          <br></br>
          <input
            // fullWidth
            // margin="normal"
            name="birthDate"
            label="Birth Date"
            type="date"
            // disabled={isUpdating}
            // value={userData.birthDate}
            // onChange={handleInputChange}
            // InputLabelProps={{ shrink: true }} 
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Time of Payment (HH:MM AM/PM):</label>

          <input
            type="text"
            name="Time"
            value={userDetails.transactionId}
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
  cashappTagContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px',
  },
  cashappTag: {
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
