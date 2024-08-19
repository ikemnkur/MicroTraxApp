import React, { useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Box } from '@mui/material';

const ReceivedPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const mockPayments = [
    { id: 1, date: '2023-08-18', sender: 'Alice', amount: 50 },
    { id: 2, date: '2023-08-17', sender: 'Bob', amount: 30 },
    { id: 3, date: '2023-08-16', sender: 'Charlie', amount: 75 },
    { id: 4, date: '2023-08-15', sender: 'David', amount: 100 },
  ];

  const filteredPayments = mockPayments.filter(p => 
    p.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.amount.toString().includes(searchTerm)
  );

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
          <MenuItem value="date">Date</MenuItem>
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
              <TableCell>Sender</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.sender}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReceivedPayments;