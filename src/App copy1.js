import React, { useCallback, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import SendMoney from './components/SendMoney';
import ReceivedPayments from './components/ReceivedPayments';

import ReloadWallet from './components/ReloadWallet';
import WithdrawWallet from './components/WithdrawWallet';
import SearchUser from './components/Search4User';
import UserProfile from './components/UserProfile';
import ShareWallet from './components/ShareWallet';
import Messages from './components/Messages';
import Account from './components/Account';
import Settings from './components/Settings';
import Auth from './components/Auth';
import Wallet from './components/Wallet';
import UnlockContent from './components/UnlockContent';
import Subscriptions from './components/ManageSubscriptions';
import SubToContent from './components/SubToContent';
import ManageContent from './components/ManageContent';
import AddToWallet from './components/AddToWallet';
import YourStuff from './components/YourStuff';
import { Elements } from '@stripe/react-stripe-js';
import AdminDashboard from './components/AdminDashboard';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

import { fetchUserProfile, walletReloadAction, walletWithdrawAction } from "./components/api";

import { useParams } from 'react-router-dom';



const stripePromise = loadStripe('pk_test_51OPgiOEViYxfJNd2ZA0pYlZ3MKdsIHDEhE9vzihdcj6CUW99q7ULSgR44nWfNVwhKvEHJ1JQCaf1NcXGhTROu8Dh008XrwD0Hv');
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
// const stripePromise = loadStripe("sk_test_51OPgiOEViYxfJNd2Mp4NrKUMHAqfoRBAtj5dKCxD1VWbHNSYZEIERtq6ZaRCUttKEyY9kvDWxVM4I4QcoK2Nikv600rOQZmvTh");



function App() {
  // const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  // const [userData, setUserData] = useState(null);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    encryptionKey: '',
    accountTier: 1,
    profilePicture: null
  });

  const CheckoutForm = () => {

    const query = new URLSearchParams(useLocation().search);

    const amount = query.get('amount');
    console.log("Amount: ", amount)

    const fetchClientSecret = useCallback(() => {
      // Create a Checkout Session


      const YOUR_DOMAIN = 'http://localhost:5000';
      return fetch(`${YOUR_DOMAIN}/create-checkout-session?amount=${amount}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => data.clientSecret);
    }, []);

    const options = { fetchClientSecret };

    const coins = amount * 1000
    setCoins(coins)

    return (
      <div id="checkout">
        <div style={{ margin: "auto", padding: "auto", textAlign: "center" }}>
          <h1>
            Your are buying:       ${coins.toLocaleString()}    Coins.
          </h1>
        </div>
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    )
  }

  // const increaseCoins = async (coin) => {

  //   const profile = await fetchUserProfile();

  //   const updatedUserData = {
  //     ...profile,
  //     birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
  //   };

  //   setUserData(updatedUserData);
  //   localStorage.setItem("userdata", JSON.stringify(updatedUserData));

  //   const d = new Date();

  //   console.log('Adding ', coin, 's to your wallet');
  //   console.log ("At time: " + d)
  //   try {
  //     const walletActionData = {
  //       username: userData.username,
  //       amount: coins,
  //       date: d.getTime()
  //     };
  //     await walletReloadAction(walletActionData);
  //     console.log("Coins purchased successfully!");
  //     // setOpenSnackbar(true);
  //     // Reset form
  //     // setRecipient('');
  //     // setAmount('');
  //     // setMessage('');
  //   } catch (error) {
  //     console.log(error.message || "Failed to send money. Please try again later.");
  //     // setOpenSnackbar(true);
  //     if (error.response?.status === 401) {
  //       // Unauthorized, token might be expired
  //       setTimeout(() => href('/wallet'), 250);
  //     }
  //   }
  // }

  const Return = () => {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');

    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');

      fetch(`/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        });
    }, []);

    if (status === 'open') {
      return (
        <Navigate to="/checkout" />
      )
    }

    if (status === 'complete') {

      // increaseCoins(coins);

      return (
        <section id="success">

          <p>
            We appreciate your business! A confirmation email will be sent to {customerEmail}.

            If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
          </p>
        </section>
      )
    }

    return
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/send" element={<SendMoney />} />
            
            <Route path="/reload" element={<ReloadWallet />} />
            <Route path="/withdraw" element={<WithdrawWallet />} />
            <Route path="/search" element={<SearchUser />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/share" element={<ShareWallet />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:username" element={<Messages />} />
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/manage-subscriptions" element={<Subscriptions />} />
            <Route path="/sub/:itemid" element={<SubToContent />} />
            <Route path="/unlock/:itemid" element={<UnlockContent />} />
            <Route path="/manage-content" element={<ManageContent />} />
            <Route path="/reload-wallet" element={<AddToWallet />} />
            <Route path="/your-stuff" element={<YourStuff />} />
            <Route path="/login" element={<Auth isLogin={true} />} />
            <Route path="/register" element={<Auth isLogin={false} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/Admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/return" element={<Return />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;