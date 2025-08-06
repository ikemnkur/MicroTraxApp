import React, { useState } from 'react';


import CreateAdPage from '../pages/CreateAdPage';
import AdPreviewPage from '../pages/AdPreviewPage';
import AdAnalyticsPage from '../pages/AdAnalyticsPage';
import ManageAdsPage from '../pages/ManageAdsPage';
import AdHelpPage from '../pages/AdHelpPage';


// Mock data for demonstration
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  credits: 15000,
  profileImage: null
};



const mockAds = [
  {
    id: 1,
    title: 'Summer Sale Campaign',
    description: 'Get 50% off on all summer items. Limited time offer!',
    format: 'banner',
    budget: 5000,
    spent: 1250,
    views: 2340,
    completions: 1876,
    reward: 25,
    frequency: 'moderate',
    active: true,
    createdAt: '2024-01-15',
    quiz: [
      {
        question: 'What discount is offered in this ad?',
        type: 'multiple',
        options: ['30%', '40%', '50%', '60%'],
        correct: 2,
        answer: ''
      }
    ]
  },
  {
    id: 2,
    title: 'New Product Launch',
    description: 'Introducing our revolutionary new product line.',
    format: 'video',
    budget: 10000,
    spent: 3420,
    views: 5670,
    completions: 4536,
    reward: 50,
    frequency: 'high',
    active: true,
    createdAt: '2024-01-10',
    quiz: [
      {
        question: 'What type of product is being launched?',
        type: 'short',
        options: [],
        correct: 0,
        answer: 'revolutionary'
      }
    ]
  }
];

const API_BASE_URL = process.env.REACT_APP_API_SERVER_URL + "/api" || 'http://localhost:5001/api';

const Ads = () => {
  const [currentPage, setCurrentPage] = useState('create');
  const [ads, setAds] = useState(mockAds);
  const [editingAd, setEditingAd] = useState(null);
  const [user, setUser] = useState(mockUser);

  // Navigation items
  const navigationItems = [
    { id: 'create', label: 'Create Ad', icon: '➕' },
    { id: 'preview', label: 'Preview', icon: '👁️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'manage', label: 'Manage Ads', icon: '⚙️' },
    { id: 'help', label: 'Help', icon: '❓' }
  ];


  const fetchAdvertiserProfile = async () => {
    const response = await fetch(`${API_BASE_URL}/ads/advertiser/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data);
    } else {
      console.error('Failed to fetch advertiser profile:', data);
    }
  }

// // Get user's ads
// app.get('/ad', authenticateToken, async (req, res) => {
//   try {
//     const ads = await executeQuery(
//       `SELECT a.*, 
//        COUNT(DISTINCT ai_view.id) as views,
//        COUNT(DISTINCT ai_completion.id) as completions,
//        COALESCE(SUM(ai_reward.credits_earned), 0) as total_rewards_paid
//        FROM ads a
//        LEFT JOIN ad_interactions ai_view ON a.id = ai_view.ad_id AND ai_view.interaction_type = 'view'
//        LEFT JOIN ad_interactions ai_completion ON a.id = ai_completion.ad_id AND ai_completion.interaction_type = 'completion'
//        LEFT JOIN ad_interactions ai_reward ON a.id = ai_reward.ad_id AND ai_reward.interaction_type = 'reward_claimed'
//        WHERE a.user_id = ?
//        GROUP BY a.id
//        ORDER BY a.created_at DESC`,
//       [req.user.user_id]
//     );

//     res.json({ ads });
//   } catch (error) {
//     console.error('Get ads error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

  // Fetch ads from the server
  const fetchAds = async () => {
    const response = await fetch(`${API_BASE_URL}/ads`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      setAds(data.ads);
    } else {
      console.error('Failed to fetch ads:', data);
    }
  };

  // reload ui to display the ads
  useEffect(() => {
    fetchAds();
    fetchAdvertiserProfile();
  }, [user.token]);

  // Handle saving an ad (create or update)
  const handleSaveAd = (adData) => {
    if (editingAd) {
      // Update existing ad
      setAds(prev => prev.map(ad =>
        ad.id === editingAd.id
          ? { ...ad, ...adData, id: editingAd.id }
          : ad
      ));
      setEditingAd(null);
    } else {
      // Create new ad
      const newAd = {
        ...adData,
        id: Date.now(),
        views: 0,
        completions: 0,
        spent: 0,
        active: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAds(prev => [...prev, newAd]);
    }
    // Navigate to analytics after saving
    setCurrentPage('analytics');
  };

  // Handle editing an ad
  const handleEditAd = (ad) => {
    setEditingAd(ad);
    setCurrentPage('create');
  };

  // Handle deleting an ad
  const handleDeleteAd = (adId) => {
    setAds(prev => prev.filter(ad => ad.id !== adId));
  };

  // Handle toggling ad status
  const handleToggleAdStatus = (adId) => {
    setAds(prev => prev.map(ad =>
      ad.id === adId
        ? { ...ad, active: !ad.active }
        : ad
    ));
  };

  // Handle duplicating an ad
  const handleDuplicateAd = (ad) => {
    const duplicatedAd = {
      ...ad,
      id: Date.now(),
      title: `${ad.title} (Copy)`,
      views: 0,
      completions: 0,
      spent: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAds(prev => [...prev, duplicatedAd]);
  };

  // Update user credits
  const updateUserCredits = (amount) => {
    setUser(prev => ({
      ...prev,
      credits: prev.credits + amount
    }));
  };

  // Get the most recent ad for preview
  const getPreviewAd = () => {
    return ads.length > 0 ? ads[ads.length - 1] : null;
  };




  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'create':
        return (
          <CreateAdPage
            onSave={handleSaveAd}
            editingAd={editingAd}
          />
        );
      case 'preview':
        return (
          <AdPreviewPage
            ad={getPreviewAd()}
          />
        );
      case 'analytics':
        return (
          <AdAnalyticsPage
            ads={ads}
            onEditAd={handleEditAd}
          />
        );
      case 'manage':
        return (
          <ManageAdsPage
            ads={ads}
            onEditAd={handleEditAd}
            onDeleteAd={handleDeleteAd}
            onToggleAdStatus={handleToggleAdStatus}
            onDuplicateAd={handleDuplicateAd}
          />
        );
      case 'help':
        return <AdHelpPage />;
      default:
        return (
          <CreateAdPage
            onSave={handleSaveAd}
            editingAd={editingAd}
          />
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '16px 0'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                📢
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Ad Management System
                </h1>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(0, 0, 0, 0.6)'
                }}>
                  Create, manage, and optimize your advertising campaigns
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '2px solid rgba(16, 185, 129, 0.2)',
                fontWeight: 600
              }}>
                <span style={{ fontSize: '16px' }}>💰</span>
                <span>{user.credits.toLocaleString()} Credits</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px'
                }}>
                  👤
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'rgba(0, 0, 0, 0.8)'
                  }}>
                    {user.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(0, 0, 0, 0.5)'
                  }}>
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {navigationItems.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => {
                  // Clear editing state when navigating away from create
                  if (currentPage === 'create' && id !== 'create') {
                    setEditingAd(null);
                  }
                  setCurrentPage(id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 20px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderBottom: currentPage === id ? '3px solid #667eea' : '3px solid transparent',
                  color: currentPage === id ? '#667eea' : 'rgba(0, 0, 0, 0.6)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== id) {
                    e.target.style.color = 'rgba(0, 0, 0, 0.8)';
                    e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== id) {
                    e.target.style.color = 'rgba(0, 0, 0, 0.6)';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {renderPage()}
        </div>
      </main>

      {/* Replace the demo components above with your actual components */}
      {/* 
      Uncomment and replace the demo functions above with:
      
      case 'create':
        return (
          <CreateAdPage 
            onSave={handleSaveAd} 
            editingAd={editingAd} 
          />
        );
      case 'preview':
        return (
          <AdPreviewPage 
            ad={getPreviewAd()} 
          />
        );
      case 'analytics':
        return (
          <AdAnalyticsPage 
            ads={ads} 
            onEditAd={handleEditAd}
          />
        );
      case 'manage':
        return (
          <ManageAdsPage
            ads={ads}
            onEditAd={handleEditAd}
            onDeleteAd={handleDeleteAd}
            onToggleAdStatus={handleToggleAdStatus}
            onDuplicateAd={handleDuplicateAd}
          />
        );
      case 'help':
        return <AdHelpPage />;
      */}
    </div>
  );
};

export default Ads;