import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_SERVER_URL // Adjust this if your API URL is different

// const navigate = useNavigate();




const AdminWithdrawsPage = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('DESC');

  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true // Add this line
  });

  // Load the withdraws from backend
  const loadWithdraws = async () => {
    try {
      const res = await api.get('/api/adminw/withdraws', {
        params: {
          search,
          status: statusFilter,
          sortField,
          sortDirection
        }
      });
      setWithdraws(res.data);
    } catch (err) {
      console.error('Error fetching withdraws:', err);
    }
  };

  // Fetch user details and transactions
  const fetchUserInfo = async (username) => {
    try {
      const res = await api.get(`/api/adminw/user-info/${username}`);
      setUserInfo(res.data);
      console.log("user info: ", res.data);
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  useEffect(() => {
    loadWithdraws();
  }, [search, statusFilter, sortField, sortDirection]);

  // Handle single click to load user info
  const handleSelectWithdraw = (withdraw) => {
    setSelectedWithdraw(withdraw);
    fetchUserInfo(withdraw.username);
  };

  // Handle double click to confirm withdraw
  const handleConfirmWithdraw = (withdraw) => {
    setSelectedWithdraw(withdraw);
    setShowConfirmModal(true);
  };

  const confirmWithdrawYes = async () => {
    if (!selectedWithdraw) return;

    try {
      // Example: Increase user’s account by the withdraw amount, or any custom logic
      await api.post(`/api/adminw/confirm-withdraw/${selectedWithdraw.id}`, {
        username: selectedWithdraw.username,
        created_at: selectedWithdraw.created_at,
        increaseAmount: selectedWithdraw.amount // or a custom amount
      });

      alert('Withdraw confirmed successfully.');
      const notif = {
        type: 'withdraw-confirmed',
        recipient_user_id: toUser.user_id,
        message: `Your Withdraw has been confirmed and approved, Enjoy: ${increaseAmount} coins.`,
        from_user: thisUser.user_id,
        date: new Date(),
        recipient_username: toUser.username
      }

      createNotification(notif)
      setShowConfirmModal(false);
      loadWithdraws(); // Reload to see status changes
    } catch (error) {
      console.error('Error confirming withdraw:', error);
      alert('Failed to confirm withdraw.');
    }
  };

  const confirmWithdrawNo = () => {
    setShowConfirmModal(false);
  };

  const createNotification = async (notificationData) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/notifications/create', notificationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("New notification: ", notificationData.message)
      // Optionally, update the notifications state or refetch notifications
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };


  const SortOption = ({ field, label }) => (
    <button
      onClick={() => {
        setSortField(field);
        setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
      }}
    >
      {label} {sortField === field ? `(${sortDirection})` : ''}
    </button>
  );



  return (
    <div style={styles.container}>
      <h1>Admin Withdraws (Last 48 Hours)</h1>

      {/* Search/Filter/Sort Controls */}
      <div style={styles.controlsContainer}>
        <input
          type="text"
          placeholder="Search by username, reference, etc."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.input}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <div style={styles.sortContainer}>
          <SortOption field="created_at" label="Date" />
          <SortOption field="username" label="Username" />
        </div>
      </div>

      {/* Withdraws List */}
      <ul style={styles.withdrawList}>
        {withdraws.map((withdraw) => (
          <li
            key={withdraw.id}
            style={styles.withdrawItem}
            onClick={() => handleSelectWithdraw(withdraw)}
            onDoubleClick={() => handleConfirmWithdraw(withdraw)}
          >
            <strong>{withdraw.username}</strong> - {withdraw.amount} coins
            <br />
            Status: {withdraw.status || 'N/A'} | Created: {withdraw.created_at}
          </li>
        ))}
      </ul>

      {/* User Info and Transactions */}
      {selectedWithdraw && userInfo && userInfo.user && (
        <div style={styles.userInfoContainer}>
          <h2>User Details: {userInfo.user.username}</h2>
          <p>Email: {userInfo.user.email}</p>
          <p>Balance: {userInfo.account.balance}</p>
          {/* Display more fields as needed */}
          <h3>User Transactions:</h3>
          <ul>
            {userInfo.transactions.map((tx) => {
              let sign = "-";
              console.log("tx.recipient_user_id: ", tx.recipient_account_id  )
              console.log("userInfo.user.user_id: ", userInfo.user.user_id  )
              if (tx.recipient_account_id === userInfo.user.user_id) {
                sign = "+";
              }

              return (
                <li key={tx.id}>
                  Type: {sign} {tx.transaction_type} | Amount: {tx.amount} |
                  Status: {tx.status} | Created: {tx.created_at}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <h3>
              Are you sure you want to confirm this withdraw for "
              {selectedWithdraw?.username}"?
            </h3>
            <div style={styles.modalButtons}>
              <button onClick={confirmWithdrawYes}>Yes</button>
              <button onClick={confirmWithdrawNo}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawsPage;

// Basic styling
const styles = {
  container: {
    margin: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  controlsContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    padding: '6px',
    fontSize: '14px',
  },
  sortContainer: {
    display: 'flex',
    gap: '10px',
  },
  withdrawList: {
    listStyle: 'none',
    padding: 0,
  },
  withdrawItem: {
    padding: '10px',
    marginBottom: '5px',
    border: '1px solid #ddd',
    cursor: 'pointer',
  },
  userInfoContainer: {
    border: '1px solid #ccc',
    padding: '10px',
    marginTop: '20px',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '20px',
  },
};