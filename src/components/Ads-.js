// src/Ads.jsx - Alternative version with index imports
import React, { useState } from 'react';
import { Plus, Eye, TrendingUp, HelpCircle, Layout } from 'lucide-react';

// Import Components
import Header from './common/Header';
// import { 
//   CreateAdPage, 
//   AdPreviewPage, 
//   AdAnalyticsPage, 
//   ManageAdsPage, 
//   AdHelpPage 
// } from '../components/pages';

import CreateAdPage from '../pages/CreateAdPage';
import AdPreviewPage from '../pages/AdPreviewPage';
import AdAnalyticsPage from '../pages/AdAnalyticsPage';
import ManageAdsPage from '../pages/ManageAdsPage';
import AdHelpPage from '../pages/AdHelpPage';

// Import Mock Data
import { mockUser, mockAds as initialAds } from '../data/mockData';

const Ads = () => {
  const [currentPage, setCurrentPage] = useState('create');
  const [ads, setAds] = useState(initialAds);
  const [editingAd, setEditingAd] = useState(null);
  const [user, setUser] = useState(mockUser);

  // Navigation items
  const navigationItems = [
    { id: 'create', label: 'Create Ad', icon: Plus },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'manage', label: 'Manage Ads', icon: Layout },
    { id: 'help', label: 'Help', icon: HelpCircle }
  ];

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} />

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  // Clear editing state when navigating away from create
                  if (currentPage === 'create' && id !== 'create') {
                    setEditingAd(null);
                  }
                  setCurrentPage(id);
                }}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  currentPage === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {renderPage()}
      </main>
    </div>
  );
};

export default Ads;