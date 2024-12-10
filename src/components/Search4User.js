import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  CircularProgress,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Box,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from './api';

const mockUsers = [
  { id: 1, username: 'alice123', avatar: 'https://mui.com/static/images/avatar/1.jpg' },
  { id: 2, username: 'bob456', avatar: 'https://mui.com/static/images/avatar/2.jpg' },
  { id: 3, username: 'charlie789', avatar: 'https://mui.com/static/images/avatar/3.jpg' },
];

const Search4User = () => {
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

      // If your searchUsers function doesn't provide avatars, you can assign default avatars here
      const resultsWithAvatars = results.map((user) => ({
        ...user,
        avatar: user.avatar || `https://mui.com/static/images/avatar/${randomIntFromInterval(1, 5)}.jpg`,
      }));

      setSearchResults(resultsWithAvatars);
      console.log('search results: ', resultsWithAvatars);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate a random integer between min and max (inclusive)
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function gotoUserProfile(user) {
    console.log('User: ', user);
    navigate(`/user/${user.user_id}`);
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Search Users
      </Typography>
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
            sx={{ mt: 1 }}
          >
            Search
          </Button>
        </form>
      </Paper>
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {searchResults.map((user) => (
          <ListItem key={user.id} button onClick={() => gotoUserProfile(user)}>
            <ListItemAvatar>
              <Avatar src={user.avatar} alt={user.username} />
            </ListItemAvatar>
            <ListItemText primary={user.username} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Search4User;
