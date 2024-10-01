import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import { loadStripe } from '@stripe/stripe-js';
// import Subscriptions from './components/Subscriptions';


const stripePromise = loadStripe('your_stripe_publishable_key');

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/send" element={<SendMoney />} />
            <Route path="/received" element={<ReceivedPayments />} />
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
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/sub/:itemid" element={<SubToContent />} />
            <Route path="/unlock/:itemid" element={<UnlockContent />} />
            <Route path="/manage-content" element={<ManageContent />} />
            <Route path="/reload-wallet" element={<AddToWallet />} />
            <Route path="/your-stuff" element={<YourStuff />} />
            <Route path="/login" element={<Auth isLogin={true} />} />
            <Route path="/register" element={<Auth isLogin={false} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;