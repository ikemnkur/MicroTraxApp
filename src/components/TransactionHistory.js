import React, { useState, useEffect } from 'react';
import {
  Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Select, MenuItem, Box
} from '@mui/material';
import { fetchTransactionHistory, deleteTransaction } from './api';
require('dotenv').config();

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
        t.receiving_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.sending_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          aValue = a.receiving_user.toLowerCase();
          bValue = b.receiving_user.toLowerCase();
          break;
        case 'status':
            aValue = a.status.toLowerCase();
            bValue = b.status.toLowerCase();
            break; 
        case 'type':
            aValue = a.transaction_type.toLowerCase();
            bValue = b.transaction_type.toLowerCase();
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

  const exportToCSV = () => {
    const headers = ['Amount', 'From', 'To', 'Message', 'Type', 'Date', 'Time', 'Status'];
    const rows = transactionsToDisplay.map(transaction => [
      transaction.amount,
      transaction.sending_user,
      transaction.receiving_user,
      transaction.message,
      transaction.transaction_type,
      transaction.created_at.slice(0, 10),
      transaction.created_at.slice(11, 19),
      transaction.status,
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(transactionId);
        setTransactions(transactions.filter(transaction => transaction.id !== transactionId));
        setFilteredTransactions(filteredTransactions.filter(transaction => transaction.id !== transactionId));
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        setError('Failed to delete transaction. Please try again later.');
      }
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, pb: 8, mb: 2 }}>
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
       
        <strong style={{ paddingTop: "15px" }}>Sort:</strong>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select> 
        <strong style={{ paddingTop: "15px" }}>By:</strong>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="username">Username</MenuItem>
          <MenuItem value="type">Type</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </Select>
        <Button variant="contained" color="secondary" onClick={exportToCSV}>
          Export to CSV
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && transactionsToDisplay.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.amount}₡</TableCell>
                <TableCell>{transaction.sending_user}</TableCell>
                <TableCell>{transaction.receiving_user}</TableCell>
                <TableCell>{transaction.message}</TableCell>
                <TableCell>{transaction.transaction_type}</TableCell>
                <TableCell>{transaction.created_at.slice(0, 10)}</TableCell>
                <TableCell>{transaction.created_at.slice(11, 19)}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(transaction.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && transactionsToDisplay.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </Box>
  );
};

export default TransactionHistory;