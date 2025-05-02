require('dotenv').config();
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';


const API_URL = process.env.REACT_APP_API_SERVER_URL + '/api'; // Adjust this if your API URL is different

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
// This redirected the user to the login in page if they are not logged in and are not on the
// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the current path starts with '/unlock'
    const unlockPage = window.location.pathname.startsWith('/unlock');
    const subPage = window.location.pathname.startsWith('/sub');

    if (unlockPage || subPage) {
      // User is on the unlock page; do not redirect to login
      // Allow the error to be handled by the component
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      // Token has expired or user is unauthorized
      localStorage.removeItem('token'); // Remove the expired token
      window.location.href = '/login'; // Redirect to login page
    }

    // For other errors, reject the promise to handle them elsewhere
    return Promise.reject(error);
  }
);

export const deleteTransaction = async (transactionId) => {
  try {
    const response = await api.delete(`/transactions/transaction/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('API - Error deleting transaction:', error);
    throw error;
  }
};

export const fetchUserProfile = async (page) => {
  try {
    const response = await api.get('/user/profile');
    console.log("FUP: ", response.data)
    return response.data;
  } catch (error) {
    console.error(`Page: ${page}; API - Error fetching user profile:`);
    // setTimeout(() => {
    //   navigate("/login");
    //   setOpenSnackbar(true);
    // }, 1000)
    throw error;
  }
};

export const fetchreceiveTransactionHistory = async (userId) => {
  try {
    const response = await api.get(`/transactions/receiveHistory`);
    return response.data;
  } catch (error) {
    console.error('API - Error fetching receive payment history:', error);
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

export const fetchOtherUserProfile = async (username) => {
  try {
    const response = await api.get(`/user/${username}/profile`);
    console.log("Fetch Other UserP: ", response.data)
    return response.data;
  } catch (error) {
    console.error('API - Error fetching other user profile, username =', username);
    throw error;
  }
};

export const fetchOtherUserProfileId = async (userId) => {
  try {
    const response = await api.get(`/user/id/${userId}/profile`);
    console.log("Fetch Other UserP: ", response.data)
    return response.data;
  } catch (error) {
    console.error('API - Error fetching other user profile, id =', userId);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/user/profile', userData);
    return response.data;
  } catch (error) {
    console.error('API - Error updating user profile:', userData);
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

export const walletStripeReloadAction = async (walletActionData) => {
  try {
    console.log("walletStripeReloadAction")
    const response = await api.post('/wallet/stripe-reload', walletActionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const walletCryptoReloadAction = async (walletActionData) => {
  try {
    console.log("walletCryptoReloadAction")
    const response = await api.post('/wallet/crypto-reload', walletActionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const validateCryptoTransaction = async (transactionData) => {
  try {
    console.log("verify transaction")
    const response = await api.post('/crypto/validate-transaction', transactionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logCoinbaseTransaction = async (transactionData) => {
  try {
    console.log("log transaction")
    const response = await api.post('/coinbase/log-transaction', transactionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logCashappTransaction = async (transactionData) => {
  try {
    console.log("logged transaction")
    const response = await api.post('/cashapp/log-transaction', transactionData);
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

export const walletConvertAction = async (walletActionData) => {
  try {
    console.log("walletConvertAction")
    const response = await api.post('/wallet/convert', walletActionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// In api.js
export const fetchInfoData = async () => {
  try {
    const response = await api.get('/info');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching Info data:', error);
    // setTimeout(() => {
    //   navigate("/login");
    //   setOpenSnackbar(true);
    // }, 1000)
    throw error;
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

// In api.js
export const fetchNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    console.log("response: ", response)
    return response.data;
  } catch (error) {
    console.error('API - Error fetching notifications data:', error);
    // setTimeout(() => {
    //   navigate("/login");
    //   setOpenSnackbar(true);
    // }, 1000)
    throw error;
  }
};

export const getFavoritesList = async (favoritesList) => {
  try {
    const response = await api.get(`/searchForUsers/favorites?list=${encodeURIComponent(favoritesList)}`);
    return response.data;
  } catch (error) {
    console.error('API - Error searching users:', error);
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

export const submitUserReport = async (userId, reportMessage, reportedUser, reportingUser) => {
  try {
    const response = await api.post(`/user/${userId}/report`, { reportMessage: reportMessage, reportedUser:  reportedUser , reportingUser: reportingUser });
    return response.data;
  } catch (error) {
    console.error('API - Error submitting user report:', error);
    throw error;
  }
};

export const submitUserMessage = async (userId, userMessage, messagedUser, messagingUser) => {
  try {
    const response = await api.post(`/user/${userId}/message`, { userMessage: userMessage, messagingUser: messagingUser, messagedUser: messagedUser });
    return response.data;
  } catch (error) {
    console.error('API - Error submitting mesage to user :', error);
    throw error;
  }
};


// // api.js (or whichever file has fetchUploadProfilePicture)
// export async function fetchUploadProfilePicture({ file, username, id, date }) {
//   // 1) Create FormData
//   const formData = new FormData();
//   // 2) Append the actual file; the key must match the multer field name ("profilePicture")
//   formData.append('profilePicture', file);
//   // 3) Append extra data
//   formData.append('username', username);
//   formData.append('id', id);
//   formData.append('date', date);

//   // 4) Make the request with "multipart/form-data"
//   const response = await api.post('/api/upload-profile-picture', {
//     method: 'POST',
//     body: formData,
//     // Do NOT set `Content-Type`; fetch will do it for you
//   });

//   // 5) Return response (or handle errors)
//   return response;
// }



// export const fetchUploadProfilePicture = async (data) => {
//   console.log("data: ", data)

//    // 1) Create FormData
//    const formData = new FormData();
//    // 2) Append the actual file; the key must match the multer field name ("profilePicture")
//    formData.append('profilePicture', data.file);
//    // 3) Append extra data
//    formData.append('username', data.username);
//    formData.append('id', data.id);
//    formData.append('date', data.date);
 
//    try {
//     const response = await api.post(`/upload-profile-picture`, { formData });
//     return response;
//   } catch (error) {
//     console.error('API - Error submitting user profile image:');
//     throw error;
//   }
// }; 

// export const fetchUploadProfilePicture = async (formData) => {
//   try {
//    const response = await api.post(`/uploadImage/upload-profile-picture`, { formData });
//    return response.data;
//  } catch (error) {
//    console.error('API - Error submitting user profile image:', error);
//    throw error;
//  }
// };

// By the HTTP specification, GET requests typically don’t include a body. Instead, data is usually passed as query parameters. If your intention is to send the user_id associated with ud alongside the GET request, you can include it as params in the Axios configuration object. For example:

// export const fetchWalletData = async (ud) => {
//   try {
//     console.log("UD: ", ud);
//     const response = await api.get('/wallet', {
//       params: {
//         user_id: ud.user_id
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('API - Error fetching wallet data:', error);
//     throw error;
//   }
// };


export const fetchWalletData = async (ud) => {
  try {
    console.log("UD: ", ud);
    const response = await api.post('/wallet', ud);
    return response.data;
  } catch (error) {
    console.error('API - Error fetching wallet data:', error);
    throw error;
  }
};

// In api.js

export const searchUsers = async (searchTerm) => {
  try {
    const response = await api.get(`/searchForUsers/search?term=${encodeURIComponent(searchTerm)}`);
    return response.data;
  } catch (error) {
    console.error('API - Error searching users:', error);
    throw error;
  }
};

// ... (previous code remains the same)


// User Content

// Fetch a users content
export const fetchUserContent = async () => {
  try {
    const response = await api.get('/user-content/get');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching user content:', error);
    throw error;
  }
};

// Your Content List (user deletes his content that they have unlocked)
export const handleDeleteUserContent = async (contentId) => {
  try {
    const response = await api.delete(`/user-content/delete/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('API - Error deleting content:', error);
    throw error;
  }
};



// Public Content Stuff

// Creator can create a new public content item
export const handleCreatePublicContent = async (newContent) => {
  try {
    const response = await api.post('/public-content/add', newContent);
    return response.data;
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

// Creator can edit a public content item
export const handleEditPublicContent = async (editedContent) => {
  try {
    const response = await api.post('/public-content/edit', editedContent);
    return response.data;
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

// Creator can delete a old public content item
export const handleDeletePublicContent = async (contentId) => {
  try {
    const response = await api.delete(`/public-content/delete/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('API - Error deleting content:', error);
    throw error;
  }
};



// Idk what this does, but it adds a new column in the user_content table
export const confirmUnlockContent = async (contentData, message) => {
  try {
    const response = await api.post(`/unlock/unlock-content`, { contentId: contentData.id, msg: message });
    return response.data;
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

// User Unlocking a new item, add to user content table
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


// Users Subscriptions List

// Fetch all of a (user's) Subscriptions
export const fetchUserSubscriptions = async () => {
  try {
    const response = await api.get('/user-subscriptions/get');
    return response.data;
  } catch (error) {
    console.error('API - Error fetching user content:', error);
    throw error;
  }
};


// Adds a subcription to a user's Subscriptions list
export const confirmUserSubToContent = async (contentData, message) => {
  try {
    const response = await api.post(`/user-subscriptions/sub-to-content`, { contentId: contentData.id, msg: message });
    return response.data;
  } catch (error) {
    console.error('API - Error adding new content:', error);
    throw error;
  }
};

// delete a subcription from a user's Subscriptions
export const handleDeleteUserSubscription = async (contentId) => {
  try {
    const response = await api.delete(`/user-subscriptions/delete/${contentId}`);
    return response.data;
  } catch (error) {
    console.error('API - Error deleting content:', error);
    throw error;
  }
};



export default api;

