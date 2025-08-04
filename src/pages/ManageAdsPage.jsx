import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageAdsPage = ({ ads = [], onEditAd, onDeleteAd, onToggleAdStatus, onDuplicateAd }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_SERVER_URL + "/api" || 'http://localhost:5001/api';


  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && ad.active) ||
                         (filterStatus === 'inactive' && !ad.active);
    const matchesFormat = filterFormat === 'all' || ad.format === filterFormat;
    
    return matchesSearch && matchesStatus && matchesFormat;
  });

  const handleDelete = (adId) => {
    onDeleteAd(adId);
    setShowDeleteConfirm(null);
  };

  const formatOptions = [
    { value: 'all', label: 'All Formats' },
    { value: 'regular', label: 'Regular' },
    { value: 'banner', label: 'Banner' },
    { value: 'popup', label: 'Popup' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
       background: 'linear-gradient(135deg,rgb(210, 216, 247) 0%,rgb(187, 167, 208) 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 16px', 
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            color: 'white',
            fontSize: '40px'
          }}>
            ⚙️
          </div>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '8px',
            textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            Manage Advertisements
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '1.25rem',
            maxWidth: '600px', 
            margin: '0 auto',
            fontWeight: 400,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Monitor and control your advertising campaigns
          </p>
        </div>

        {/* Search and Filters */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(0, 0, 0, 0.4)',
                fontSize: '20px'
              }}>
                🔍
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ads..."
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '2px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '2px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                fontWeight: 600
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '2px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                fontWeight: 600
              }}
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              justifyContent: 'center',
              color: 'rgba(0, 0, 0, 0.5)',
              fontSize: '14px',
              fontWeight: 600
            }}>
              <span style={{ fontSize: '20px' }}>📊</span>
              {filteredAds.length} of {ads.length} ads
            </div>
          </div>
        </div>

        {/* Ads Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '24px'
        }}>
          {filteredAds.map((ad) => (
            <div 
              key={ad.id} 
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                border: '2px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
            >
              {/* Ad Preview */}
              <div style={{ 
                height: '200px', 
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {ad.format === 'video' && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    color: 'rgba(0, 0, 0, 0.4)'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>▶️</div>
                    <div style={{ fontSize: '14px' }}>Video Ad</div>
                  </div>
                )}
                {ad.format === 'image' && ad.mediaUrl && (
                  <img 
                    src={ad.mediaUrl} 
                    alt={ad.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {(ad.format === 'banner' || ad.format === 'regular' || !ad.mediaUrl) && (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      marginBottom: '8px',
                      color: 'rgba(0, 0, 0, 0.8)'
                    }}>
                      {ad.title}
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: 'rgba(0, 0, 0, 0.6)',
                      margin: 0
                    }}>
                      {ad.description?.substring(0, 60)}...
                    </p>
                  </div>
                )}
                
                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: ad.active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: ad.active ? '#059669' : '#dc2626',
                    border: `2px solid ${ad.active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  }}>
                    {ad.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Ad Info */}
              <div style={{ padding: '24px' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  color: 'rgba(0, 0, 0, 0.8)'
                }}>
                  {ad.title}
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '8px', 
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <strong>Format:</strong> {ad.format}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <strong>Budget:</strong> {ad.budget}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <strong>Spent:</strong> {ad.spent}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.6)' }}>
                    <strong>Views:</strong> {ad.views}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    <span>Budget Usage</span>
                    <span>{((ad.spent / ad.budget) * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(ad.spent / ad.budget) * 100}%`,
                      backgroundColor: '#667eea',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onToggleAdStatus(ad.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      border: '2px solid rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'rgba(0, 0, 0, 0.7)',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>{ad.active ? '⏸️' : '▶️'}</span>
                    {ad.active ? 'Pause' : 'Resume'}
                  </button>
                  
                  <button
                    onClick={() => onEditAd(ad)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'white',
                      backgroundColor: '#667eea',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#5a67d8';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#667eea';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                  >
                    <span>✏️</span>
                    Edit
                  </button>
                  
                  <button
                    onClick={() => onDuplicateAd(ad)}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'rgba(0, 0, 0, 0.5)',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '16px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                      e.target.style.color = '#667eea';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                      e.target.style.color = 'rgba(0, 0, 0, 0.5)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    title="Duplicate"
                  >
                    📋
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(ad.id)}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'rgba(239, 68, 68, 0.7)',
                      backgroundColor: 'rgba(239, 68, 68, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '16px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      e.target.style.color = '#dc2626';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                      e.target.style.color = 'rgba(239, 68, 68, 0.7)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAds.length === 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            padding: '64px 24px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👁️</div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              color: 'rgba(0, 0, 0, 0.6)', 
              marginBottom: '16px',
              fontWeight: 600
            }}>
              No ads found matching your criteria
            </h3>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterFormat('all');
              }}
              style={{
                padding: '12px 24px',
                border: '2px solid #667eea',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#667eea',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '400px',
              width: '90%',
              padding: '32px'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: 'rgba(0, 0, 0, 0.8)'
              }}>
                Confirm Delete
              </h3>
              <p style={{ 
                color: 'rgba(0, 0, 0, 0.6)', 
                marginBottom: '24px',
                lineHeight: 1.5
              }}>
                Are you sure you want to delete this ad? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    border: '2px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'rgba(0, 0, 0, 0.7)',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'white',
                    backgroundColor: '#dc2626',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#b91c1c';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(220, 38, 38, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#dc2626';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAdsPage;