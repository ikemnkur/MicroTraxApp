import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Box } from '@mui/material';
import { fetchSubscriptions } from './api';

const Subscriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data - replace with actual data fetching
  const subscriptions = [
    { id: 1, date: '2023-08-18', name: "YT Channel", type: 'Daily', username: 'user1', AccountID: "ACC132145936", amount: 1 },
    { id: 2, date: '2023-08-17', name: " GameHub Sub", type: 'Monthly', username: 'user2', AccountID: "ACC132145936", amount: 2 },
    { id: 3, date: '2023-08-17', name: "Cool Artilces.com" , type: 'Weekly', username: 'user3', AccountID: "ACC132145936", amount: 4 },
    // ... more subs
  ];

  const filteredSubscriptions = subs.filter(t => 
    t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.amount.toString().includes(searchTerm)
  );

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const data = await fetchSubscriptions();
        console.log("Subsc. History Data: ", data)
        setSubs(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch Subscriptions:', err);
        setError('Failed to load Subscriptions history. Please try again later.');
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, []);


  return (
    <Box>
      <Typography variant="h4" gutterBottom>Your Subcsriptions</Typography>
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
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="username">Username</MenuItem>
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
              <TableCell>Type</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredsubs.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.date}</TableCell>
                <TableCell>{sub.type}</TableCell>
                <TableCell>{sub.username}</TableCell>
                <TableCell>${sub.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Subscriptions;