import React, { useCallback, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import SendMoney from './components/SendMoney';
import ReceivedPayments from './components/ReceivedPayments';
import { CheckoutForm, Return } from "./components/Stripe";

import { CryptoCheckoutForm } from "./components/CryptoCheckoutForm";
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

require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
// const stripePromise = loadStripe("sk_test_51OPgiOEViYxfJNd2Mp4NrKUMHAqfoRBAtj5dKCxD1VWbHNSYZEIERtq6ZaRCUttKEyY9kvDWxVM4I4QcoK2Nikv600rOQZmvTh");
const stripePromise = loadStripe('pk_test_51OPgiOEViYxfJNd2ZA0pYlZ3MKdsIHDEhE9vzihdcj6CUW99q7ULSgR44nWfNVwhKvEHJ1JQCaf1NcXGhTROu8Dh008XrwD0Hv');

function App() {

  const [coins, setCoins] = useState();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    encryptionKey: '',
    accountTier: 1,
    profilePicture: null,
    coins: 0,
  });

  const increaseCoins = useCallback(async (coin) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    try {
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

      const walletActionData = {
        username: updatedUserData.username,
        amount: parseInt(coin),
        date: d.getTime(),
        stripe: uuidv4(),
        session_id: sessionId
      };

      const result = await walletReloadAction(walletActionData);
      console.log("Coins purchased successfully!", result);

      // Update the local state with the new coin balance
      setUserData(prevData => ({
        ...prevData,
        coins: (prevData.coins || 0) + parseInt(coin)
      }));
    } catch (error) {
      console.log(error.message || "Failed to reload wallet. Please try again later.");
      if (error.response?.status === 401) {
        // Unauthorized, token might be expired
        setTimeout(() => window.location.href = '/wallet', 250);
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
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
          <Route path="/subscription/:itemid" element={<SubToContent />} />
          <Route path="/unlock/:itemid" element={<UnlockContent />} />
          <Route path="/manage-content" element={<ManageContent />} />
          <Route path="/reload-wallet" element={<AddToWallet />} />
          <Route path="/your-stuff" element={<YourStuff />} />
          <Route path="/login" element={<Auth isLogin={true} />} />
          <Route path="/" element={<Auth isLogin={true} />} />
          <Route path="/register" element={<Auth isLogin={false} />} />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          <Route path="/Admin" element={<AdminDashboard />} />

          <Route path="/stripe-checkout" element={<CheckoutForm setCoins={setCoins} />} />
          <Route path="/crypto-checkout" element={<CryptoCheckoutForm setCoins={setCoins} />} />
          <Route path="/return" element={<Return increaseCoins={increaseCoins} />} />

        </Routes>
        </NavBar>
      </Router>
    </ThemeProvider>
  );
}

export default App;