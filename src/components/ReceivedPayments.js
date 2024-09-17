import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Box, CircularProgress } from '@mui/material';
import { fetchRecieveTransactionHistory } from './api';

const ReceivedPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchRecieveTransactionHistory();
        console.log("History Data: ", data)
        setTransactions(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch transaction history:', err);
        setError('Failed to load transaction history. Please try again later.');
        setLoading(false);
        if (error.response?.status === 403) {
          // Unauthorized, token might be expired
          setTimeout(() => navigate('/'), 1000);
        }
      }
    };

    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.sender_account_id.toString().includes(searchTerm.toLowerCase()) ||
    t.amount.toString().includes(searchTerm) ||
    (t.message && t.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'created_at') {
      return sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortBy === 'sender') {
      return sortOrder === 'asc' ? a.sender_account_id.localeCompare(b.sender_account_id) : b.sender_account_id.localeCompare(a.sender_account_id);
    }
    return 0;
  });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Received Payments</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField 
          label="Search" 
          variant="outlined" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="created_at">Date</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="sender">Sender</MenuItem>
        </Select>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Sender Account ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Reference ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
                <TableCell>{transaction.sender_account_id}</TableCell>
                <TableCell>${parseFloat(transaction.amount).toFixed(2)}</TableCell>
                <TableCell>{transaction.message || 'N/A'}</TableCell>
                <TableCell>{transaction.reference_id || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReceivedPayments;