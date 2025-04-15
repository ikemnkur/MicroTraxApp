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
import { searchUsers, getFavoritesList } from './api';

const mockUsers = [
  { id: 1, username: 'alice123', avatar: 'https://mui.com/static/images/avatar/1.jpg' },
  { id: 2, username: 'bob456', avatar: 'https://mui.com/static/images/avatar/2.jpg' },
  { id: 3, username: 'charlie789', avatar: 'https://mui.com/static/images/avatar/3.jpg' },
];

const Search4User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchUsers(searchTerm);
      let x = JSON.parse(localStorage.getItem('userdata'))
      setFavoritesList(x.favorites)
      console.log("Your favorites: "+ favoritesList)
      const favoritesResultsList = await getFavoritesList(searchTerm);

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
    <>
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
                <Avatar src={user.profilePic || user.avatar} alt={user.username} />
              </ListItemAvatar>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}
        </List>


      </Box>

      <Box>
        <Typography variant="h4" gutterBottom>
          Favorites List:
        </Typography>
        {/* <Paper sx={{ p: 2, mb: 2 }}>
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
        </Paper> */}
        {isLoading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        <List>
          {favoritesResultsList.map((fav) => (
            <ListItem key={fav.id} button onClick={() => gotofavProfile(fav)}>
              <ListItemAvatar>
                <Avatar src={fav.profilePic || fav.avatar} alt={fav.favname} />
              </ListItemAvatar>
              <ListItemText primary={fav.favname} />
            </ListItem>
          ))}
        </List>


      </Box>
    </>

  );
};

export default Search4User;
