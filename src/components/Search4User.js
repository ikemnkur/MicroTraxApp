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
import { searchUsers } from './api';

const Search4User = () => {
  // Main search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Favorites state
  const [favoritesList, setFavoritesList] = useState([]);
  const [favoritesSearchTerm, setFavoritesSearchTerm] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  const navigate = useNavigate();

  // Load favorites on component mount
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('userdata'));
      if (userData && userData.favorites) {
        console.log('Loaded favorites from localStorage:', userData.favorites);
        // Ensure favorites is an array
        const favoritesArray = Array.isArray(userData.favorites) ? userData.favorites : [];
        setFavoritesList(favoritesArray);
        setFilteredFavorites(favoritesArray);
      }
    } catch (err) {
      console.error('Error loading favorites from localStorage:', err);
      // Initialize with empty arrays if there's an error
      setFavoritesList([]);
      setFilteredFavorites([]);
    }
  }, []);

  // Filter favorites based on search term
  useEffect(() => {
    // Ensure favoritesList is an array
    if (!Array.isArray(favoritesList)) {
      console.error('favoritesList is not an array:', favoritesList);
      setFilteredFavorites([]);
      return;
    }

    if (!favoritesSearchTerm.trim()) {
      setFilteredFavorites(favoritesList);
      return;
    }

    const filtered = favoritesList.filter(fav => 
      fav && fav.favname && fav.favname.toLowerCase().includes(favoritesSearchTerm.toLowerCase())
    );
    setFilteredFavorites(filtered);
  }, [favoritesSearchTerm, favoritesList]);

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
  const handleFavoritesSearch = (e) => {
    setFavoritesSearchTerm(e.target.value);
  };

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
            label="Filter your favorites"
            fullWidth
            value={favoritesSearchTerm}
            onChange={handleFavoritesSearch}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterList />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
          <List>
            {Array.isArray(filteredFavorites) && filteredFavorites.length > 0 ? (
              filteredFavorites.map((fav) => (
                <ListItem key={fav.id || fav.user_id || `fav-${Math.random()}`} button onClick={() => gotofavProfile(fav)}>
                  <ListItemAvatar>
                    <Avatar src={fav.profilePic || fav.avatar} alt={fav.favname || 'Favorite'} />
                  </ListItemAvatar>
                  <ListItemText primary={fav.favname || 'Unnamed Favorite'} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary={
                  Array.isArray(favoritesList) && favoritesList.length > 0
                    ? "No favorites match your filter"
                    : "You haven't added any favorites yet"
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