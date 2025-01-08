import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_SERVER_URL // Adjust this if your API URL is different

// const navigate = useNavigate();




const AdminPurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('DESC');

  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true // Add this line
  });

  // Load the purchases from backend
  const loadPurchases = async () => {
    try {
      const res = await api.get('/api/adminp/purchases', {
        params: {
          search,
          status: statusFilter,
          sortField,
          sortDirection
        }
      });
      setPurchases(res.data);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    }
  };

  // Fetch user details and transactions
  const fetchUserInfo = async (username) => {
    try {
      const res = await api.get(`/api/adminp/user-info/${username}`);
      setUserInfo(res.data);
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, [search, statusFilter, sortField, sortDirection]);

  // Handle single click to load user info
  const handleSelectPurchase = (purchase) => {
    setSelectedPurchase(purchase);
    fetchUserInfo(purchase.username);
  };

  // Handle double click to confirm purchase
  const handleConfirmPurchase = (purchase) => {
    setSelectedPurchase(purchase);
    setShowConfirmModal(true);
  };

  const confirmPurchaseYes = async () => {
    if (!selectedPurchase) return;

    try {
      // Example: Increase user’s account by the purchase amount, or any custom logic
      await api.post(`/api/adminp/confirm-purchase/${selectedPurchase.id}`, {
        username: selectedPurchase.username,
        created_at: selectedPurchase.created_at,
        increaseAmount: selectedPurchase.amount // or a custom amount
      });

      alert('Purchase confirmed successfully.');
      setShowConfirmModal(false);
      loadPurchases(); // Reload to see status changes
    } catch (error) {
      console.error('Error confirming purchase:', error);
      alert('Failed to confirm purchase.');
    }
  };

  const confirmPurchaseNo = () => {
    setShowConfirmModal(false);
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
      <h1>Admin Purchases (Last 48 Hours)</h1>

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

      {/* Purchases List */}
      <ul style={styles.purchaseList}>
        {purchases.map((purchase) => (
          <li
            key={purchase.id}
            style={styles.purchaseItem}
            onClick={() => handleSelectPurchase(purchase)}
            onDoubleClick={() => handleConfirmPurchase(purchase)}
          >
            <strong>{purchase.username}</strong> - {purchase.amount} coins
            <br />
            Status: {purchase.status || 'N/A'} | Created: {purchase.created_at}
          </li>
        ))}
      </ul>

      {/* User Info and Transactions */}
      {selectedPurchase && userInfo && userInfo.user && (
        <div style={styles.userInfoContainer}>
          <h2>User Details: {userInfo.user.username}</h2>
          <p>Email: {userInfo.user.email}</p>
          {/* Display more fields as needed */}
          <h3>User Transactions:</h3>
          <ul>
            {userInfo.transactions.map((tx) => (
              <li key={tx.id}>
                Type: {tx.transaction_type} | Amount: {tx.amount} |
                Status: {tx.status} | Created: {tx.created_at}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <h3>
              Are you sure you want to confirm this purchase for "
              {selectedPurchase?.username}"?
            </h3>
            <div style={styles.modalButtons}>
              <button onClick={confirmPurchaseYes}>Yes</button>
              <button onClick={confirmPurchaseNo}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPurchasesPage;

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
  purchaseList: {
    listStyle: 'none',
    padding: 0,
  },
  purchaseItem: {
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