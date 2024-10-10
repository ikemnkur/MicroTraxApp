import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Box } from '@mui/material';
import { fetchTransactionHistory } from './api';

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data - replace with actual data fetching
  // const transactions = [
  //   { id: 1, date: '2023-08-18', type: 'Send', username: 'user1', amount: 50 },
  //   { id: 2, date: '2023-08-17', type: 'Receive', username: 'user2', amount: 30 },
  //   // ... more transactions
  // ];

  let transactionHist = [];
  let filteredTransactionHist = [];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchTransactionHistory();
        transactionHist = data;
        console.log("Transaction History Data: ", data)
        // setTransactions(...data);
        searchTransactions();
        
        setTimeout(() => {
          console.log("Transc: ", transactionHist)
          setLoading(false);
        }, 150)
        
      } catch (err) {
        console.error('Failed to fetch transaction history:', err);
        setError('Failed to load transaction history. Please try again later.');
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const searchTransactions = async (e) => {
    if (searchTerm) {
      filteredTransactionHist = transactionHist.filter(t => {
        console.log("Transaction Item: ", t)
        t.recieving_user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.amount.toString().includes(searchTerm)
      });
    } else {
      filteredTransactionHist = transactionHist
    }
    if (searchTerm) {
      setFilteredTransactions(filteredTransactionHist)
    } else {
      setFilteredTransactions(transactionHist)
      console.log("else")
    }
    setTimeout(() => {
      console.log("Filtered Transcations: ", filteredTransactionHist)
    }, 100)
  }

  const handleSearch = async (e) => {
    searchTransactions();
  }


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
        <Button variant="contained" color="primary" onClick={() => handleSearch()}>
          Search
        </Button>
        <strong style={{ padding: "15px" }}>
          Filter:
        </strong>

        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="username">Username</MenuItem>
        </Select>
        <strong style={{ padding: "15px" }}>
          Sort:
        </strong>
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
              <TableCell>Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* <TableRow key={"transaction.id"}>
              <TableCell>{"transaction.date"}</TableCell>
              <TableCell>{"transaction.time"}</TableCell>
              <TableCell>{"transaction.type"}</TableCell>
              <TableCell>{"transaction.username"}</TableCell>
              <TableCell>${"transaction.amount.toFixed(2)"}</TableCell>
            </TableRow> */}
            {!loading && (filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.created_at.slice(0, 10)}</TableCell>
                <TableCell>{transaction.created_at.slice(11, 19)}</TableCell>
                <TableCell>{transaction.transaction_type}</TableCell>
                <TableCell>{transaction.recieving_user}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionHistory;