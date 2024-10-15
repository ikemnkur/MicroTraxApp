import React, { useState, useEffect } from 'react';
import {
  Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Select, MenuItem, Box
} from '@mui/material';
import { fetchTransactionHistory } from './api';

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactionHistory();
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        setTransactions(parsedData);
        setFilteredTransactions(parsedData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch transaction history:', err);
        setError('Failed to load transaction history. Please try again later.');
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const searchTransactions = () => {
    const filtered = transactions.filter(t => {
      return (
        t.recieving_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm)
      );
    });
    setFilteredTransactions(filtered);
  };

  const handleSearch = () => {
    searchTransactions();
  };

  const sortTransactions = (transactionsToSort) => {
    return [...transactionsToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case 'username':
          aValue = a.recieving_user.toLowerCase();
          bValue = b.recieving_user.toLowerCase();
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const transactionsToDisplay = sortTransactions(filteredTransactions);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Transaction History</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <strong style={{ padding: "15px" }}>Filter:</strong>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="username">Username</MenuItem>
        </Select>
        <strong style={{ padding: "15px" }}>Sort:</strong>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && transactionsToDisplay.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.created_at.slice(0, 10)}</TableCell>
                <TableCell>{transaction.created_at.slice(11, 19)}</TableCell>
                <TableCell>{transaction.transaction_type}</TableCell>
                <TableCell>{transaction.recieving_user}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
              </TableRow>
            ))}
            {!loading && transactionsToDisplay.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionHistory;
