require('dotenv').config();
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logCashappTransaction } from "./api";
import { loadStripe } from '@stripe/stripe-js';
const { v4: uuidv4 } = require('uuid');

export const CashappCheckoutForm = ({ setCoins }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const amount = query.get('amount') || 0;
  let ud = JSON.parse(localStorage.getItem("userdata")) || {};

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    cashappTag: '',
    key: '',
    transactionId: '',
    time: '',
    date: ''
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [currency, setCurrency] = useState('USD'); // Default currency
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');

  // Calculate the amount in USD based on user assumption (e.g., 1000 coins = $1)
  const cashappAmount = amount / 1000;

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

    try {
      // Data payload for backend
      const data = {
        username: ud.username,
        userId: ud.user_id,
        name: userDetails.name,
        email: userDetails.email,
        cashappTag: userDetails.cashappTag,
        key: userDetails.key,
        transactionId: userDetails.transactionId, // You might rename this field if it's actually an amount
        currency: currency,
        amount: amount,
        cashappAmount: cashappAmount,
        date: userDetails.date || new Date().toISOString().split('T')[0],
        time: userDetails.time,
        session_id: uuidv4()
      };

      const response = await logCashappTransaction(data);
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

  const handleCancelOrder = () => {
    navigate('/dashboard'); // or another path as needed
  };

  const handleCopyAddress = () => {
    const cashappTagStatic = '$CloutCoinPay';
    navigator.clipboard
      .writeText(cashappTagStatic)
      .then(() => {
        setMessage('Cash Tag copied to clipboard!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        console.error('Could not copy Cashapp tag: ', err);
        setErrorMessage('Failed to copy address.');
      });
  };

  const cashappTagStatic = '$CloutCoinPay';

  if (orderSubmitted) {
    return (
      <div id="checkout" style={styles.container}>
        <h2>Order Logged!</h2>
        <h2>
          Step 3: Confirm that you have sent the payment, then wait for its confirmation by the system.
        </h2>
        <p>
          Please confirm you have sent <strong>{cashappAmount} {currency}</strong> to the following CashApp Tag:
        </p>
        <div style={styles.cashappTagContainer}>
          <p style={styles.cashappTag}>{cashappTagStatic}</p>
          <button style={styles.button} onClick={handleCopyAddress}>
            Copy Cashapp Tag
          </button>
        </div>
        {message && <p style={styles.successMessage}>{message}</p>}
        <p>
          You will receive your coins once the cashapp payment transaction is confirmed.
        </p>
      </div>
    );
  }

  return (
    <div id="checkout" style={styles.container}>
      <div style={styles.header}>
        <h1>You are buying: {parseInt(amount).toLocaleString()} Coins</h1>
      </div>

      <h2>Step 1: Send money to the CashApp account below:</h2>

      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      {message && <p style={styles.successMessage}>{message}</p>}

      <div style={styles.walletInfo}>
        <p>
          Please send <strong>{cashappAmount} {currency}</strong> to the following CashApp account:
        </p>
        <div style={styles.cashappTagContainer}>
          <img width="256px" src="./public/CashappQR.jpg" alt="CashApp QR" />
        </div>
        <div style={styles.cashappTagContainer}>
          <p style={styles.cashappTag}>{cashappTagStatic}</p>
          <button style={styles.button} onClick={handleCopyAddress}>
            Copy CashApp Tag
          </button>
        </div>
      </div>

      <h2>Step 2: Log the details of your order in this form below:</h2>

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
            Your CashApp User Tag/Name:<span style={styles.required}>*</span>
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
            placeholder="e.g. 10.00"
            value={userDetails.transactionId}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Date of Payment:</label>
          <input
            type="date"
            name="date"
            value={userDetails.date}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Time of Payment (HH:MM AM/PM):</label>
          <input
            type="text"
            name="time"
            placeholder="e.g. 09:30 AM"
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
  required: {
    color: 'red',
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
    marginBottom: '20px',
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