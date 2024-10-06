import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TextField, Button, 
  CircularProgress, Box
} from '@mui/material';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const filteredVisits = data?.pageVisits.filter(visit => 
    visit.url.toLowerCase().includes(filter.toLowerCase()) ||
    visit.ip.includes(filter) ||
    visit.location.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>Admin Dashboard</Typography>
      
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>Server Uptime</Typography>
        <Typography>{Math.floor(data.uptime / (1000 * 60 * 60))} hours</Typography>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>Page Visits</Typography>
        <TextField
          label="Filter visits"
          variant="outlined"
          fullWidth
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Count</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVisits.map((visit, index) => (
                <TableRow key={index}>
                  <TableCell>{visit.count}</TableCell>
                  <TableCell>{visit.url}</TableCell>
                  <TableCell>{visit.time}</TableCell>
                  <TableCell>{visit.ip}</TableCell>
                  <TableCell>{visit.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>Recent Requests</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Method</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>IP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.recentRequests.map((request, index) => (
                <TableRow key={index}>
                  <TableCell>{request.method}</TableCell>
                  <TableCell>{request.url}</TableCell>
                  <TableCell>{request.time}</TableCell>
                  <TableCell>{request.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Button variant="contained" color="primary" onClick={fetchData}>Refresh Data</Button>
    </Container>
  );
};

export default AdminDashboard;