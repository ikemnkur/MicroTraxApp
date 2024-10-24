import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api'; // Adjust this if your API URL is different

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

export const fetchUserContent = async () => {
  try {
    const response = await api.get('/unlock/user-content');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching user content:', error);
    throw error;
  }
};

export const handleDeleteContent = async (contentId, mode) => {
  try { 
    if (mode == "subscription") {
      const response = await api.delete(`/sub/delete-content/${contentId}`);
      return response.data;
    } else {
       const response = await api.delete(`/unlock/delete-content/${contentId}`);
       return response.data;
    }
    
  } catch (error) {
    console.error('API - Error deleting content:', error);
    throw error;
  }
};

export const handleSubmitNewContent = async (newContent, mode) => {
  try {
    if (mode == "subscription") {
      const response = await api.post('/sub/add-content', newContent);
      return response.data;
    } else {
      const response = await api.post('/unlock/add-content', newContent);
      return response.data;
    }
    
    
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

export const handleSubmitNewEdit = async (editedContent, mode) => {
  try {
    if (mode == "subscription") {
      const response = await api.post('/sub/edit-content', editedContent);
      return response.data;
    } else {
      const response = await api.post('/unlock/edit-content', editedContent);
      return response.data;
    }
    
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

export const confirmUnlockContent = async (contentData, message, mode) => {
  try {
    if (mode == "subscription") { 
      const response = await api.post(`/sub/sub-to-content`, { contentId: contentData.id, msg: message });
      return response.data;
    } else {
      const response = await api.post(`/unlock/unlock-content`, { contentId: contentData.id, msg: message });
      return response.data;
    }
   
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};


export const fetchLockedContent = async (itemId) => {
  try {
    const [contentResponse, balanceResponse] = await Promise.all([
      api.get(`/unlock/unlock-content/${itemId}`),
      api.get(`/unlock/user-balance`)
    ]);
    console.log("fetchLockedContent = " + JSON.stringify(contentResponse.data) + "&" + JSON.stringify(balanceResponse.data))
    return [contentResponse, balanceResponse];
  } catch (error) {
    console.error('API - Error fetching user content:', error);
    throw error;
  }
};


export const fetchSubscriptions = async () => {
  try {
    const response = await api.get('/subscriptions');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching user content:', error);
    throw error;
  }
};

export const confirmSubToContent = async (contentData, message) => {
  try {
    const response = await api.post(`/sub/unlock-content`, { contentId: contentData.id, msg: message });
    return response.data;
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};


export default api;