import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_SERVER_URL+'/api'; // Adjust this if your API URL is different

// const navigate = useNavigate();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Add this line
});


// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token has expired
      localStorage.removeItem('token'); // Remove the expired token
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export const fetchUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching user profile:', error);
    // setTimeout(() => {
    //   navigate("/login");
    //   setOpenSnackbar(true);
    // }, 1000)
    throw error;
  }
};

export const fetchRecieveTransactionHistory = async (userId) => {
  try {
    const response = await api.get(`/transactions/recieveHistory`);
    return response.data;
  } catch (error) {
    console.error('API - Error fetching recieve payment history:', error);
    throw error;
  }
};

export const fetchTransactionHistory = async (userId) => {
  try {
    const response = await api.get(`/transactions/history`);
    return response.data;
  } catch (error) {
    console.error('API - Error fetching transaction history:', error);
    throw error;
  }
};

export const fetchOtherUserProfile = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error('API - Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/user/profile', userData);
    return response.data;
  } catch (error) {
    console.error('API - Error updating user profile:', error);
    throw error;
  }
};

export const sendMoneyToOtherUser = async (sendmoneyData) => {
  try {
    const response = await api.post('/transactions/send', sendmoneyData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const walletReloadAction = async (walletActionData) => {
  try {
    console.log("walletReloadAction")
    const response = await api.post('/wallet/reload', walletActionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const walletWithdrawAction = async (walletActionData) => {
  try {
    console.log("walletWithdrawAction")
    const response = await api.post('/wallet/withdraw', walletActionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// In api.js
export const fetchDashboardData = async () => {
  try {
    const response = await api.get('/user/dashboard');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching dashboard data:', error);
    // setTimeout(() => {
    //   navigate("/login");
    //   setOpenSnackbar(true);
    // }, 1000)
    throw error;
  }
};

export const updateFavoriteStatus = async (userId, isFavorite) => {
  try {
    const response = await api.put(`/user/${userId}/favorite`, { isFavorite });
    return response.data;
  } catch (error) {
    console.error('API - Error updating favorite status:', error);
    throw error;
  }
};

export const submitUserReport = async (userId, reportMessage) => {
  try {
    const response = await api.post(`/user/${userId}/report`, { reportMessage });
    return response.data;
  } catch (error) {
    console.error('API - Error submitting user report:', error);
    throw error;
  }
};

export const fetchWalletData = async () => {
  try {
    const response = await api.get('/wallet');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching wallet data:', error);
    throw error;
  }
};

// In api.js

export const searchUsers = async (searchTerm) => {
  try {
    const response = await api.get(`/users/search?term=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error('API - Error searching users:', error);
    throw error;
  }
};

// ... (previous code remains the same)

// Fetch a users content
export const fetchUserContent = async () => {
  try {
    const response = await api.get('/content/user-content');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching user content:', error);
    throw error;
  }
};

// Public Stuff

// Creator can create a new public content item
export const handleSubmitNewPublicContent = async (newContent) => {
  try {
    const response = await api.post('/content/add-public-content', newContent);
    return response.data;
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

// Creator can edit a public content item
export const handleSubmitPublicContentEdit = async (editedContent) => {
  try {
    const response = await api.post('/content/edit-public-content', editedContent);
    return response.data;
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

// Creator can delete a old public content item
export const handleDeletePublicContent = async (contentId) => {
  try {
    const response = await api.delete(`/content/delete-public-content/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('API - Error deleting content:', error);
    throw error;
  }
};

// Your Content (user deletes his content that they have unlocked)
export const handleDeleteUserContent = async (contentId) => {
  try {
    const response = await api.delete(`/content/delete-your-content/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('API - Error deleting content:', error);
    throw error;
  }
};



// Idk what this does, but it adds a new column in the user_content table
export const confirmUnlockContent = async (contentData, message) => {
  try {
    const response = await api.post(`/unlock/unlock-content`, { contentId: contentData.id, msg : message });
    return response.data;
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

// Unlocking a new item, add to user content table
export const fetchLockedContent = async (itemId) => {
  try {
    const [contentResponse, balanceResponse] = await Promise.all([
      api.get(`/unlock/unlock-content/${itemId}`),
      api.get(`/unlock/user-balance`)
    ]);
    console.log("fetchLockedContent = "+ JSON.stringify(contentResponse.data)+ "&"+ JSON.stringify(balanceResponse.data) )
    return [contentResponse, balanceResponse];
  } catch (error) {
    console.error('API - Error fetching user content:', error);
    throw error;
  }
};

// Fetch all of a (user's) Subscriptions
export const fetchUserSubscriptions = async () => {
  try {
    const response = await api.get('/subscriptions');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching user content:', error);
    throw error;
  }
};

// Delete a Creator's Public Subscriptions
export const handleDeletePublicSubscription = async (contentId) => {
  try {
    const response = await api.delete(`/subs/delete-public-sub/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('API - Error deleting content:', error);
    throw error;
  }
};


// Adds a subcription to a user's Subscriptions
export const confirmUserSubToContent = async (contentData, message) => {
  try {
    const response = await api.post(`/sub/sub-to-content`, { contentId: contentData.id, msg : message });
    return response.data;
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

// delete a subcription from a user's Subscriptions
export const handleDeleteUserSubscription = async (contentId) => {
  try {
    const response = await api.delete(`/subs/delete-your-sub/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('API - Error deleting content:', error);
    throw error;
  }
};

export default api;

