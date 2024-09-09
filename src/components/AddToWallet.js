// src/components/ReloadWallet.js

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, TextField, Box, Typography, Snackbar } from '@mui/material';
import axios from 'axios';

const AddToWallet = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet. Please try again.');
      setLoading(false);
      return;
    }

    try {
      // Create PaymentIntent
      const { data: { clientSecret } } = await axios.post('/api/payments/create-payment-intent', {
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: 'usd',
      });

      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Customer Name', // You might want to get this from your user data
          },
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Confirm the payment on the server and update user's balance
          await axios.post('/api/payments/confirm-payment', {
            paymentIntentId: result.paymentIntent.id,
          });
          setMessage('Payment succeeded! Your wallet has been reloaded.');
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Reload Wallet</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Amount (USD)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <CardElement options={{style: {base: {fontSize: '16px'}}}} />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={!stripe || loading} 
          sx={{ mt: 2 }}
        >
          {loading ? 'Processing...' : 'Pay'}
        </Button>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Box>
  );
};

export default AddToWallet;