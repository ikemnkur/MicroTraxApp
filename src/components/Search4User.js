import React, { useState, useEffect } from 'react';
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
  Divider,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchFavorites, searchUsers } from './api';

const Search4User = () => {
  // Main search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [error, setError] = useState(null);
  const [favoritesError, setFavoritesError] = useState(null);

  // Favorites state
  const [favoritesSearchTerm, setFavoritesSearchTerm] = useState('');
  const [favoritesSearchResults, setFavoritesSearchResults] = useState([]);
  
  const navigate = useNavigate();

  // Handle main database user search
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Search for users in the database
      if (searchTerm.length < 4) {
        setError('Enter more than 4 characters to start search.');
        setSearchResults([]);
      } else {
        let results = await searchUsers(searchTerm);

        // Ensure results is an array
        if (!Array.isArray(results)) {
          console.error('Search results is not an array:', results);
          results = [];
        }

        // Add avatars if needed
        const resultsWithAvatars = results.map((user) => ({
          ...user,
          avatar: user.avatar || `https://mui.com/static/images/avatar/${randomIntFromInterval(1, 5)}.jpg`,
        }));

        setSearchResults(resultsWithAvatars);
        console.log('search results: ', resultsWithAvatars);
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setError('An error occurred while searching. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle favorites search input change
  const handleFavoritesInputChange = (e) => {
    setFavoritesSearchTerm(e.target.value);
  };

  // Handle favorites search request
  const handleFavoritesSearch = async (e) => {
    // Prevent form submission if this is triggered from a form
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    setIsLoadingFavorites(true);
    setFavoritesError(null);

    try {
      // Search for favorite users in the database
      if (favoritesSearchTerm.length < 4) {
        setFavoritesError('Enter more than 4 characters to start search.');
        setFavoritesSearchResults([]);
      } else {
        let results = await searchFavorites(favoritesSearchTerm);

        // Ensure results is an array
        if (!Array.isArray(results)) {
          console.error('Favorites search results is not an array:', results);
          results = [];
        }

        // Add avatars if needed
        const resultsWithAvatars = results.map((fav) => ({
          ...fav,
          avatar: fav.avatar || fav.profilePic || `https://mui.com/static/images/avatar/${randomIntFromInterval(1, 5)}.jpg`,
        }));
        
        setFavoritesSearchResults(resultsWithAvatars);
        console.log('favorites search results: ', resultsWithAvatars);
      }
    } catch (err) {
      console.error('Error searching favorites:', err);
      setFavoritesError('An error occurred while searching favorites. Please try again.');
      setFavoritesSearchResults([]);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  // Effect to handle favorites search when search term changes
  useEffect(() => {
    // If search term is empty, clear results
    if (!favoritesSearchTerm || favoritesSearchTerm.length < 4) {
      setFavoritesSearchResults([]);
      return;
    }

    // Debounce search to reduce API calls
    const delayDebounceFn = setTimeout(() => {
      handleFavoritesSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [favoritesSearchTerm]);

  // Function to generate a random integer between min and max (inclusive)
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function gotoUserProfile(user) {
    console.log('User: ', user);
    navigate(`/user/${user.user_id}`);
  }

  function gotofavProfile(fav) {
    console.log('Favorite: ', fav);
    navigate(`/user/${fav.user_id}`);
  }

  return (
    <>
      {/* Global User Search Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Users
        </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <form onSubmit={handleSearch}>
            <TextField
              label="Search all users by username"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 1 }}
            >
              Search
            </Button>
          </form>
        </Paper>
        {isLoading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
          <List>
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <ListItem key={user.id || `search-${Math.random()}`} button onClick={() => gotoUserProfile(user)}>
                  <ListItemAvatar>
                    <Avatar src={user.profilePic || user.avatar} alt={user.username} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.username}
                    secondary={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ""}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary={searchTerm ? "No users found" : "Search for users above"} />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>

      {/* Divider between sections */}
      <Divider sx={{ my: 3 }} />

      {/* Favorites Section */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Your Favorites
        </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            label="Search your favorites"
            fullWidth
            value={favoritesSearchTerm}
            onChange={handleFavoritesInputChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterList />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Enter at least 4 characters to search your favorites
          </Typography>
        </Paper>
        {isLoadingFavorites && <CircularProgress />}
        {favoritesError && <Typography color="error">{favoritesError}</Typography>}

        <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
          <List>
            {Array.isArray(favoritesSearchResults) && favoritesSearchResults.length > 0 ? (
              favoritesSearchResults.map((fav) => (
                <ListItem key={fav.id || fav.user_id || `fav-${Math.random()}`} button onClick={() => gotofavProfile(fav)}>
                  <ListItemAvatar>
                    <Avatar src={fav.profilePic || fav.avatar} alt={fav.username || fav.favname || 'Favorite'} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={fav.username || fav.favname || 'Unnamed Favorite'}
                    secondary={fav.firstName && fav.lastName ? `${fav.firstName} ${fav.lastName}` : ""}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary={
                  favoritesSearchTerm && favoritesSearchTerm.length >= 4
                    ? "No favorites match your search"
                    : "Enter at least 4 characters to search your favorites"
                } />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </>
  );
};

export default Search4User;