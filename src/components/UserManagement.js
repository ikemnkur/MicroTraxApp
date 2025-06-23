import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowBack as ArrowLeft,
  CheckCircle,
  Cancel as XCircle,
  Edit as Pencil,
  VpnKey as Key,
  PersonOff as PersonX,
  PersonAdd as PersonCheck,
  Visibility as Eye,
  LockOpen as Unlock,
  Favorite as Heart,
  Star,
  AttachMoney as DollarSign,
  Link,
  Code,
  Movie as Film,
  Image,
  Description as FileText,
  InsertDriveFile as File
} from '@mui/icons-material';

// Mock data for demo purposes
const mockUserData = {
  user: {
    id: 1,
    user_id: 'user_123',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    birthDate: '1990-01-15',
    timezone: 'America/New_York',
    bio: 'Software developer passionate about creating amazing user experiences.',
    profilePic: '/images/default-profile.png',
    accountTier: '2',
    rating: '4.2',
    unlocks: '15',
    subscriptions: '3',
    created_at: '2023-01-15T10:30:00Z',
    paidLast: '2024-06-01',
    Favorites: 'React, JavaScript, Node.js',
    data: '{"preferences": {"theme": "dark", "notifications": true}}',
    status: 'active'
  },
  transactions: [
    {
      id: 1,
      transaction_type: 'purchase',
      amount: '$29.99',
      status: 'completed',
      sending_user: 'johndoe',
      receiving_user: 'platform',
      created_at: '2024-06-01T14:30:00Z'
    },
    {
      id: 2,
      transaction_type: 'unlock',
      amount: '$4.99',
      status: 'completed',
      sending_user: 'johndoe',
      receiving_user: 'creator123',
      created_at: '2024-05-28T09:15:00Z'
    }
  ],
  public_content: [
    {
      id: 1,
      reference_id: 'ref_001',
      title: 'React Best Practices',
      type: 'code',
      description: 'A comprehensive guide to React development best practices',
      content: 'const Component = () => {\n  return <div>Hello World</div>;\n};',
      cost: 5,
      views: 1250,
      unlocks: 89,
      likes: 156,
      rating: 4.8,
      created_at: '2024-05-15T08:00:00Z'
    },
    {
      id: 2,
      reference_id: 'ref_002',
      title: 'JavaScript Algorithms',
      type: 'text',
      description: 'Common algorithms implemented in JavaScript',
      content: 'This content covers sorting algorithms, search algorithms, and data structures...',
      cost: 8,
      views: 890,
      unlocks: 67,
      likes: 98,
      rating: 4.5,
      created_at: '2024-05-10T12:30:00Z'
    }
  ]
};

// Utility Functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const getTypeBadge = (type) => {
  const badges = {
    url: { icon: Link, class: 'bg-blue-500', text: 'URL' },
    code: { icon: Code, class: 'bg-green-500', text: 'Code' },
    video: { icon: Film, class: 'bg-red-500', text: 'Video' },
    image: { icon: Image, class: 'bg-cyan-500', text: 'Image' },
    text: { icon: FileText, class: 'bg-gray-500', text: 'Text' }
  };
  
  const badge = badges[type] || { icon: File, class: 'bg-gray-500', text: type };
  const IconComponent = badge.icon;
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${badge.class} ml-2`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {badge.text}
    </span>
  );
};

const getStatusBadgeColor = (status) => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Modal Components
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg ${sizeClasses[size]} w-full mx-4 max-h-90vh overflow-y-auto`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Content Card Component
const ContentCard = ({ content, onEdit }) => {
  const createdDate = formatDate(content.created_at);
  let contentValue = '';
  
  try {
    contentValue = typeof content.content === 'string' ? content.content : JSON.stringify(content.content);
  } catch (e) {
    contentValue = JSON.stringify(content.content);
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md border mb-4">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h5 className="text-lg font-semibold flex items-center">
            {content.title}
            {getTypeBadge(content.type)}
          </h5>
          <button
            onClick={() => onEdit(content)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-3">
          Created: {createdDate} | Reference ID: {content.reference_id}
        </p>
        <p className="text-gray-700 mb-4">{content.description}</p>
        
        <div className="mb-4">
          <strong>Content:</strong>
          <pre className="border bg-gray-50 p-3 rounded mt-2 text-sm overflow-auto max-h-24">
            {contentValue}
          </pre>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Eye className="w-4 h-4 mr-1" />
            {content.views} Views
          </div>
          <div className="flex items-center text-gray-600">
            <Unlock className="w-4 h-4 mr-1" />
            {content.unlocks} Unlocks
          </div>
          <div className="flex items-center text-gray-600">
            <Heart className="w-4 h-4 mr-1" />
            {content.likes} Likes
          </div>
          <div className="flex items-center text-gray-600">
            <Star className="w-4 h-4 mr-1" />
            {content.rating.toFixed(2)} Rating
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-1" />
            {content.cost} Cost
          </div>
        </div>
      </div>
    </div>
  );
};

// Content Edit Modal Component
const ContentEditModal = ({ isOpen, onClose, content, onSave, onDelete }) => {
  const [formData, setFormData] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    if (content) {
      let contentValue = '';
      try {
        contentValue = typeof content.content === 'string' ? content.content : content.content.content || JSON.stringify(content.content);
      } catch (e) {
        contentValue = JSON.stringify(content.content);
      }
      
      setFormData({
        id: content.id,
        reference_id: content.reference_id,
        title: content.title,
        cost: content.cost,
        type: content.type,
        description: content.description,
        content: contentValue,
        views: content.views,
        unlocks: content.unlocks,
        likes: content.likes,
        rating: content.rating
      });
    }
  }, [content]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const handleDelete = () => {
    onDelete(content.id);
    setShowDeleteConfirm(false);
  };
  
  if (!content) return null;
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Content" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
              <input
                type="number"
                value={formData.cost || ''}
                onChange={(e) => setFormData({...formData, cost: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="url">URL</option>
                <option value="code">Code</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="text">Text</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number"
                value={formData.rating || ''}
                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                step="0.01"
                min="0"
                max="5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Views</label>
              <input
                type="number"
                value={formData.views || ''}
                onChange={(e) => setFormData({...formData, views: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unlocks</label>
              <input
                type="number"
                value={formData.unlocks || ''}
                onChange={(e) => setFormData({...formData, unlocks: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Likes</label>
              <input
                type="number"
                value={formData.likes || ''}
                onChange={(e) => setFormData({...formData, likes: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="5"
              required
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
            >
              Delete Content
            </button>
            <div className="space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </Modal>
      
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Confirm Delete">
        <div className="space-y-4">
          <p>Are you sure you want to delete this content item?</p>
          <p className="text-red-600 font-semibold">This action cannot be undone.</p>
          <p>Title: {content.title}</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Main User Management Component
const UserManagement = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userContent, setUserContent] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalFormData, setOriginalFormData] = useState({});
  const [formData, setFormData] = useState({});
  const [userNotFound, setUserNotFound] = useState(false);
  const [contentSortOption, setContentSortOption] = useState('date-desc');
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showSaveChangesModal, setShowSaveChangesModal] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [contentEditModal, setContentEditModal] = useState({ isOpen: false, content: null });
  
  const searchUser = async () => {
    if (!searchValue.trim()) {
      alert('Please enter a username to search');
      return;
    }
    
    // Simulate API call - replace with actual API call
    try {
      // For demo, we'll use mock data
      if (searchValue.toLowerCase() === 'johndoe') {
        setCurrentUser(mockUserData.user);
        setUserContent(mockUserData.public_content);
        setTransactions(mockUserData.transactions);
        setFormData(mockUserData.user);
        setOriginalFormData(mockUserData.user);
        setUserNotFound(false);
      } else {
        setUserNotFound(true);
        setCurrentUser(null);
        setUserContent([]);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      alert('An error occurred while searching for the user');
    }
  };
  
  const handleFormChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Check if there are changes
    const hasChanges = Object.keys(newFormData).some(key => 
      newFormData[key] !== originalFormData[key]
    );
    setHasUnsavedChanges(hasChanges);
  };
  
  const discardChanges = () => {
    setFormData(originalFormData);
    setHasUnsavedChanges(false);
    setIsEditMode(false);
  };
  
  const saveChanges = async () => {
    try {
      // Simulate API call
      console.log('Saving user data:', formData);
      
      // Update current user and reset states
      setCurrentUser(formData);
      setOriginalFormData(formData);
      setHasUnsavedChanges(false);
      setIsEditMode(false);
      setShowSaveChangesModal(false);
      
      alert('User data updated successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes');
    }
  };
  
  const resetPassword = async () => {
    try {
      // Simulate API call
      console.log('Resetting password for user:', currentUser.id);
      setShowResetPasswordModal(false);
      alert(`Password has been reset for ${currentUser.username} and sent to their email.`);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password');
    }
  };
  
  const toggleUserAccount = async () => {
    const action = currentUser.status === 'active' ? 'disable' : 'enable';
    
    if (!confirm(`Are you sure you want to ${action} this account?`)) {
      return;
    }
    
    try {
      const newStatus = action === 'disable' ? 'disabled' : 'active';
      const updatedUser = { ...currentUser, status: newStatus };
      setCurrentUser(updatedUser);
      setFormData(updatedUser);
      alert(`User account has been ${action}d`);
    } catch (error) {
      console.error(`Error ${action}ing user account:`, error);
      alert(`Error ${action}ing user account`);
    }
  };
  
  const sortContent = (content, sortOption) => {
    const sorted = [...content];
    
    switch(sortOption) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'views-desc':
        return sorted.sort((a, b) => b.views - a.views);
      case 'unlocks-desc':
        return sorted.sort((a, b) => b.unlocks - a.unlocks);
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };
  
  const handleContentEdit = (content) => {
    setContentEditModal({ isOpen: true, content });
  };
  
  const saveContentChanges = async (contentData) => {
    try {
      // Simulate API call
      console.log('Saving content changes:', contentData);
      
      // Update content in the list
      const updatedContent = userContent.map(c => 
        c.id === contentData.id ? { ...c, ...contentData } : c
      );
      setUserContent(updatedContent);
      setContentEditModal({ isOpen: false, content: null });
      
      alert('Content updated successfully');
    } catch (error) {
      console.error('Error saving content changes:', error);
      alert('Error saving content changes');
    }
  };
  
  const deleteContent = async (contentId) => {
    try {
      // Simulate API call
      console.log('Deleting content:', contentId);
      
      // Remove content from the list
      const updatedContent = userContent.filter(c => c.id !== contentId);
      setUserContent(updatedContent);
      setContentEditModal({ isOpen: false, content: null });
      
      alert('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content');
    }
  };
  
  const sortedContent = sortContent(userContent, contentSortOption);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex w-full sm:w-auto">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUser()}
                placeholder="Search by username..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={searchUser}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
            
            {currentUser && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveChangesModal(true)}
                  disabled={!hasUnsavedChanges}
                  className={`flex items-center px-4 py-2 rounded ${
                    hasUnsavedChanges 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={discardChanges}
                  disabled={!hasUnsavedChanges}
                  className={`flex items-center px-4 py-2 rounded ${
                    hasUnsavedChanges 
                      ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Discard Changes
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* User Not Found */}
        {userNotFound && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            User not found. Please try a different username.
          </div>
        )}
        
        {/* User Data */}
        {currentUser && (
          <div className="bg-white rounded-lg shadow mb-6">
            {/* Tabs */}
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'profile', label: 'Profile' },
                  { id: 'account', label: 'Account' },
                  { id: 'transactions', label: 'Transactions' },
                  { id: 'content', label: 'Content' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        setShowUnsavedChangesModal(true);
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <img
                      src={currentUser.profilePic || '/images/default-profile.png'}
                      alt="Profile"
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h4 className="text-lg font-semibold">{currentUser.username}</h4>
                    <p className="text-sm text-gray-500">
                      ID: {currentUser.id} | User ID: {currentUser.user_id}
                    </p>
                  </div>
                  
                  <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={formData.firstName || ''}
                          onChange={(e) => handleFormChange('firstName', e.target.value)}
                          disabled={!isEditMode}
                          className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                            isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          disabled={!isEditMode}
                          className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                            isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={formData.phoneNumber || ''}
                          onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
                          disabled={!isEditMode}
                          className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                            isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                        <input
                          type="date"
                          value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleFormChange('birthDate', e.target.value)}
                          disabled={!isEditMode}
                          className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                            isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                        <input
                          type="text"
                          value={formData.timezone || ''}
                          onChange={(e) => handleFormChange('timezone', e.target.value)}
                          disabled={!isEditMode}
                          className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                            isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          value={formData.bio || ''}
                          onChange={(e) => handleFormChange('bio', e.target.value)}
                          disabled={!isEditMode}
                          rows="3"
                          className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                            isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Tier</label>
                    <select
                      value={formData.accountTier || '1'}
                      onChange={(e) => handleFormChange('accountTier', e.target.value)}
                      disabled={!isEditMode}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                      }`}
                    >
                      <option value="1">Basic (1)</option>
                      <option value="2">Premium (2)</option>
                      <option value="3">Pro (3)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <input
                      type="number"
                      value={formData.rating || ''}
                      onChange={(e) => handleFormChange('rating', e.target.value)}
                      disabled={!isEditMode}
                      step="0.1"
                      min="0"
                      max="5"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unlocks</label>
                    <input
                      type="number"
                      value={formData.unlocks || ''}
                      onChange={(e) => handleFormChange('unlocks', e.target.value)}
                      disabled={!isEditMode}
                      min="0"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subscriptions</label>
                    <input
                      type="number"
                      value={formData.subscriptions || ''}
                      onChange={(e) => handleFormChange('subscriptions', e.target.value)}
                      disabled={!isEditMode}
                      min="0"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                    <input
                      type="text"
                      value={formatDate(currentUser.created_at)}
                      disabled
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Payment</label>
                    <input
                      type="text"
                      value={formData.paidLast || ''}
                      onChange={(e) => handleFormChange('paidLast', e.target.value)}
                      disabled={!isEditMode}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Favorites</label>
                    <textarea
                      value={formData.Favorites || ''}
                      onChange={(e) => handleFormChange('Favorites', e.target.value)}
                      disabled={!isEditMode}
                      rows="3"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <textarea
                      value={formData.data || ''}
                      onChange={(e) => handleFormChange('data', e.target.value)}
                      disabled={!isEditMode}
                      rows="3"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
                        isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              )}
              
              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.transaction_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(tx.status)}`}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.sending_user}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.receiving_user}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(tx.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">User Content</h3>
                    <select
                      value={contentSortOption}
                      onChange={(e) => setContentSortOption(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="views-desc">Most Views</option>
                      <option value="unlocks-desc">Most Unlocks</option>
                      <option value="rating-desc">Highest Rating</option>
                    </select>
                  </div>
                  
                  {sortedContent.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">This user has no public content</p>
                    </div>
                  ) : (
                    <div>
                      {sortedContent.map((content) => (
                        <ContentCard
                          key={content.id}
                          content={content}
                          onEdit={handleContentEdit}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center px-4 py-2 rounded ${
                  isEditMode 
                    ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Pencil className="w-4 h-4 mr-2" />
                {isEditMode ? 'Cancel Editing' : 'Edit User'}
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetPasswordModal(true)}
                  className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Reset Password
                </button>
                <button
                  onClick={toggleUserAccount}
                  className={`flex items-center px-4 py-2 rounded ${
                    currentUser.status === 'active'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {currentUser.status === 'active' ? (
                    <>
                      <PersonX className="w-4 h-4 mr-2" />
                      Disable Account
                    </>
                  ) : (
                    <>
                      <PersonStanding className="w-4 h-4 mr-2" />
                      Enable Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <Modal isOpen={showResetPasswordModal} onClose={() => setShowResetPasswordModal(false)} title="Reset Password">
        <div className="space-y-4">
          <p>Are you sure you want to reset the password for <strong>{currentUser?.username}</strong>?</p>
          <p>A new password will be generated and sent to the user's email.</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowResetPasswordModal(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={resetPassword}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Reset Password
            </button>
          </div>
        </div>
      </Modal>
      
      <Modal isOpen={showSaveChangesModal} onClose={() => setShowSaveChangesModal(false)} title="Save Changes">
        <div className="space-y-4">
          <p>Are you sure you want to save these changes?</p>
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">Changes Preview:</h4>
            <div className="space-y-1 text-sm">
              {Object.keys(formData).filter(key => formData[key] !== originalFormData[key]).map(key => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span className="text-gray-600">{originalFormData[key]} → {formData[key]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowSaveChangesModal(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
      
      <Modal isOpen={showUnsavedChangesModal} onClose={() => setShowUnsavedChangesModal(false)} title="Unsaved Changes">
        <div className="space-y-4">
          <p>You have unsaved changes. What would you like to do?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowUnsavedChangesModal(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Keep Editing
            </button>
            <button
              onClick={() => {
                setShowUnsavedChangesModal(false);
                discardChanges();
                setActiveTab('profile'); // Reset to profile tab
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Discard Changes
            </button>
          </div>
        </div>
      </Modal>
      
      <ContentEditModal
        isOpen={contentEditModal.isOpen}
        onClose={() => setContentEditModal({ isOpen: false, content: null })}
        content={contentEditModal.content}
        onSave={saveContentChanges}
        onDelete={deleteContent}
      />
    </div>
  );
};

export default UserManagement;
// border-blue-500' : 'bg-gray-50'
//                           }`}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                         <input
//                           type="text"
//                           value={formData.lastName || ''}
//                           onChange={(e) => handleFormChange('lastName', e.target.value)}
//                           disabled={!isEditMode}
//                           className={`w-full border border-gray-300 rounded-md px-3 py-2 ${
//                             isEditMode ? 'focus:ring-2 focus:ring-blue-500 focus