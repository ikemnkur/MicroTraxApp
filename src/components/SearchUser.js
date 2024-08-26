import React, { useState } from 'react';
import { Typography, TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const mockUsers = [
    { id: 1, username: 'alice123', avatar: 'https://mui.com/static/images/avatar/1.jpg' },
    { id: 2, username: 'bob456', avatar: 'https://mui.com/static/images/avatar/2.jpg' },
    { id: 3, username: 'charlie789', avatar: 'https://mui./static/images/avatar/3.jpg' },
  ];

  const SearchUser = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    const handleSearch = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
  
      try {
        const results = await searchUsers(searchTerm);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('An error occurred while searching. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    function randomIntFromInterval(min, max) { // min and max included 
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Search Users</Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <form onSubmit={handleSearch}>
            <TextField
              label="Search by username"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              margin="normal"
            />
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<SearchIcon />}
              disabled={isLoading}
            >
              Search
            </Button>
          </form>
        </Paper>
        {isLoading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        <List>
          {searchResults.map((user) => (
            <ListItem 
              key={user.id} 
              button 
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <ListItemAvatar>
                <Avatar src={user.avatar} alt={user.username} />
                <Avatar src={`https://mui.com/static/images/avatar/${randomIntFromInterval(1,5)}.jpg`} alt={user.username} />
              </ListItemAvatar>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };
  
  export default SearchUser;