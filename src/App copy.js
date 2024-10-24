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
// import { Elements } from '@stripe/react-stripe-js';
import AdminDashboard from './components/AdminDashboard';

import { Elements } from '@stripe/react-stripe-js';
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
  const [coins, setCoins] = useState();
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
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const amount = query.get('amount');
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
      const fetchClientSecret = async () => {
        const YOUR_DOMAIN = 'http://localhost:5000';
        const response = await fetch(`${YOUR_DOMAIN}/create-checkout-session?amount=${amount}`, {
          method: "POST",
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      };

      fetchClientSecret();
    }, []);

    setCoins(parseInt(amount))
    console.log(coins)

    if (!clientSecret) {
      return <div>Loading...</div>;
    }

    return (
      <div id="checkout">
        <div style={{ margin: "auto", padding: "auto", textAlign: "center" }}>
          <h1>You are buying: {(amount * 1000).toLocaleString()} Coins.</h1>
        </div>
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  };

  const Return = () => {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');

      const YOUR_DOMAIN = 'http://localhost:5000';
      fetch(`${YOUR_DOMAIN}/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          // alert("status:", data.status)
          setCustomerEmail(data.customer_email);
        });

    }, []);

    // alert("Purchasing: ", status)

    if (status === 'open') {
      return (
        <Navigate to="/checkout" />
      )
    }

    if (status === 'complete') {
      if (done !== true) {
        // const amount = parseInt(new URLSearchParams(window.location.search).get('amount')) || 0;
        const amount = parseInt(new URLSearchParams(window.location.search).get('amount')) || 0;
        setCoins(amount)
        increaseCoins(amount * 1000);
        // increaseCoins(parseInt(coins) * 1000);
        alert("Coins: ", coins)
        setDone(true)
        alert("Purchase Successful");
        

        return (
          <section id="success">
            <p>
              We appreciate your business! A confirmation email will be sent to {customerEmail}.
              If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
            </p>
          </section>
        )
      }
    }
    // return 
    // return (
    //   <>nothing</>
    // )
  }

  const increaseCoins = async (coin) => {
    const profile = await fetchUserProfile();

    const updatedUserData = {
      ...profile,
      birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
    };

    setUserData(updatedUserData);
    localStorage.setItem("userdata", JSON.stringify(updatedUserData));

    const d = new Date();

    console.log('Adding ', coin, ' coins to your wallet');
    console.log("At time: " + d);
    try {
      const walletActionData = {
        username: userData.username,
        amount: parseInt(coin),
        date: d.getTime()
      };
      const result = await walletReloadAction(walletActionData);
      console.log("Coins purchased successfully!", result);
      // Update the local state with the new coin balance
      setUserData(prevData => ({
        ...prevData,
        coins: prevData.coins + parseInt(coin)
      }));
    } catch (error) {
      console.log(error.message || "Failed to reload wallet. Please try again later.");
      if (error.response?.status === 401) {
        // Unauthorized, token might be expired
        setTimeout(() => window.location.href = '/wallet', 250);
      }
    }
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