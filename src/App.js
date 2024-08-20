import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import SearchUser from './components/SearchUser';
import UserProfile from './components/UserProfile';
import ShareWallet from './components/ShareWallet';
import Messages from './components/Messages';
import Account from './components/Account';
import SettingsPage from './components/SettingsPage';

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
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;