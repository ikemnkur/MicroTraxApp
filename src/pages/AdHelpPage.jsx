import React, { useState } from 'react';

const AdHelpPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const API_BASE_URL = process.env.REACT_APP_API_SERVER_URL + "/api" || 'http://localhost:5001/api';
  const navigate = useNavigate();

  const sections = {
    overview: {
      title: 'Overview',
      icon: '📋',
      content: (
        <div style={{ lineHeight: 1.8 }}>
          <p style={{ fontSize: '16px', marginBottom: '24px', color: 'rgba(0, 0, 0, 0.7)' }}>
            Welcome to the Ad System! This platform allows you to create, manage, and monetize advertisements with an innovative reward-based engagement model.
          </p>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>✨</span>
            Key Features:
          </h3>
          <ul style={{ 
            paddingLeft: '20px', 
            fontSize: '15px',
            color: 'rgba(0, 0, 0, 0.7)',
            lineHeight: 2
          }}>
            <li style={{ marginBottom: '8px' }}>📱 Multiple ad formats (regular, banner, popup, video, audio)</li>
            <li style={{ marginBottom: '8px' }}>🎁 Attention-based reward system with quiz questions</li>
            <li style={{ marginBottom: '8px' }}>⚙️ Flexible budget and frequency controls</li>
            <li style={{ marginBottom: '8px' }}>📊 Real-time analytics and insights</li>
            <li style={{ marginBottom: '8px' }}>⏭️ Skipable ads with minimum view time</li>
          </ul>
        </div>
      )
    },
    creating: {
      title: 'Creating Ads',
      icon: '🎨',
      content: (
        <div style={{ lineHeight: 1.8 }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📝</span>
            Step-by-Step Guide:
          </h3>
          <ol style={{ 
            paddingLeft: '20px', 
            fontSize: '15px',
            color: 'rgba(0, 0, 0, 0.7)',
            lineHeight: 2
          }}>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>Basic Information:</strong> Enter your ad title, description, and destination link
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>Format Selection:</strong> Choose from regular, banner, popup, video, or audio formats
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>Media Upload:</strong> Upload your media files (images, videos, audio) within size limits
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>Budget & Rewards:</strong> Set your campaign budget (2000-20000 credits) and reward amount (0-100 credits)
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>Quiz Questions:</strong> Create attention-check questions to ensure engagement
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>Frequency:</strong> Choose how often your ad should be displayed
            </li>
          </ol>
          <div style={{
            background: 'rgba(59, 130, 246, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid rgba(59, 130, 246, 0.1)',
            marginTop: '24px'
          }}>
            <h4 style={{ 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📏</span>
              File Size Limits:
            </h4>
            <ul style={{ 
              paddingLeft: '20px', 
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.7)',
              lineHeight: 1.8
            }}>
              <li>📸 Images & GIFs: 2MB maximum</li>
              <li>🎥 Video files: 2.5MB maximum</li>
              <li>🎵 Audio files: 2MB maximum</li>
            </ul>
          </div>
        </div>
      )
    },
    rewards: {
      title: 'Reward System',
      icon: '🎁',
      content: (
        <div style={{ lineHeight: 1.8 }}>
          <p style={{ fontSize: '16px', marginBottom: '24px', color: 'rgba(0, 0, 0, 0.7)' }}>
            Our reward system encourages genuine engagement by requiring users to prove they paid attention to your ad.
          </p>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚡</span>
            How It Works:
          </h3>
          <ol style={{ 
            paddingLeft: '20px', 
            fontSize: '15px',
            color: 'rgba(0, 0, 0, 0.7)',
            lineHeight: 2
          }}>
            <li style={{ marginBottom: '12px' }}>👁️ Users watch your ad (minimum 3-15 seconds before skip option appears)</li>
            <li style={{ marginBottom: '12px' }}>✅ After completing the ad, users can claim a reward</li>
            <li style={{ marginBottom: '12px' }}>❓ A random quiz question appears with a 20-second timer</li>
            <li style={{ marginBottom: '12px' }}>🏆 Correct answers earn the specified reward amount</li>
            <li style={{ marginBottom: '12px' }}>⏰ Reward modal closes automatically after 5 seconds</li>
          </ol>
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid rgba(16, 185, 129, 0.1)',
            marginTop: '24px'
          }}>
            <h4 style={{ 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>❓</span>
              Question Types:
            </h4>
            <ul style={{ 
              paddingLeft: '20px', 
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.7)',
              lineHeight: 1.8
            }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>📝 Multiple Choice:</strong> 4 options with one correct answer
              </li>
              <li>
                <strong>✏️ Short Answer:</strong> Text input with flexible matching
              </li>
            </ul>
          </div>
        </div>
      )
    },
    analytics: {
      title: 'Analytics',
      icon: '📊',
      content: (
        <div style={{ lineHeight: 1.8 }}>
          <p style={{ fontSize: '16px', marginBottom: '24px', color: 'rgba(0, 0, 0, 0.7)' }}>
            Track your ad performance with comprehensive analytics and insights.
          </p>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📈</span>
            Key Metrics:
          </h3>
          <ul style={{ 
            paddingLeft: '20px', 
            fontSize: '15px',
            color: 'rgba(0, 0, 0, 0.7)',
            lineHeight: 2
          }}>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>👁️ Views:</strong> Total number of times your ad was displayed
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>✅ Completions:</strong> Number of users who watched the entire ad
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>📊 Completion Rate:</strong> Percentage of views that resulted in complete watches
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>💰 Cost per View:</strong> Average credits spent per ad view
            </li>
            <li style={{ marginBottom: '12px' }}>
              <strong style={{ color: 'rgba(0, 0, 0, 0.8)' }}>📉 Budget Utilization:</strong> Percentage of total budget used
            </li>
          </ul>
          <div style={{
            background: 'rgba(139, 92, 246, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid rgba(139, 92, 246, 0.1)',
            marginTop: '24px'
          }}>
            <h4 style={{ 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>💳</span>
              Cost Structure:
            </h4>
            <p style={{ 
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.7)',
              margin: 0,
              lineHeight: 1.6
            }}>
              You are charged credits each time your ad is displayed. The exact cost depends on your ad format and frequency settings.
            </p>
          </div>
        </div>
      )
    },
    formats: {
      title: 'Ad Formats',
      icon: '🎨',
      content: (
        <div style={{ lineHeight: 1.8 }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            color: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎯</span>
            Available Formats:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              borderLeft: '4px solid #3b82f6',
              paddingLeft: '20px',
              background: 'rgba(59, 130, 246, 0.05)',
              padding: '16px 20px',
              borderRadius: '0 12px 12px 0'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📄</span>
                Regular
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)' }}>
                Standard display ad with text and optional image
              </p>
            </div>
            <div style={{
              borderLeft: '4px solid #10b981',
              paddingLeft: '20px',
              background: 'rgba(16, 185, 129, 0.05)',
              padding: '16px 20px',
              borderRadius: '0 12px 12px 0'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🏷️</span>
                Banner
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)' }}>
                Horizontal banner ad with gradient background
              </p>
            </div>
            <div style={{
              borderLeft: '4px solid #8b5cf6',
              paddingLeft: '20px',
              background: 'rgba(139, 92, 246, 0.05)',
              padding: '16px 20px',
              borderRadius: '0 12px 12px 0'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⬆️</span>
                Popup
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)' }}>
                Modal overlay that appears over content
              </p>
            </div>
            <div style={{
              borderLeft: '4px solid #ef4444',
              paddingLeft: '20px',
              background: 'rgba(239, 68, 68, 0.05)',
              padding: '16px 20px',
              borderRadius: '0 12px 12px 0'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🎥</span>
                Video
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)' }}>
                Full video playback with controls
              </p>
            </div>
            <div style={{
              borderLeft: '4px solid #f59e0b',
              paddingLeft: '20px',
              background: 'rgba(245, 158, 11, 0.05)',
              padding: '16px 20px',
              borderRadius: '0 12px 12px 0'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '8px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🎵</span>
                Audio
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)' }}>
                Audio playback with album art and controls
              </p>
            </div>
          </div>
        </div>
      )
    },
    faq: {
      title: 'Frequently Asked Questions',
      icon: '❓',
      content: (
        <div style={{ lineHeight: 1.8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>💰</span>
                How much does it cost to run an ad?
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)', lineHeight: 1.6 }}>
                The cost depends on your ad format and frequency settings. You set a budget between 2,000 and 20,000 credits, and the system deducts credits for each view.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>✏️</span>
                Can I edit an ad after it's live?
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)', lineHeight: 1.6 }}>
                Yes! You can edit your ads at any time through the Manage Ads page. Changes take effect immediately.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⏭️</span>
                How long before users can skip my ad?
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)', lineHeight: 1.6 }}>
                Skip time is randomly set between 3-15 seconds for each view to ensure fair engagement.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>📉</span>
                What happens if I run out of budget?
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)', lineHeight: 1.6 }}>
                Your ad will automatically pause when the budget is exhausted. You can add more credits or create a new campaign.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ 
                fontWeight: 'bold', 
                marginBottom: '12px',
                color: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>✅</span>
                How are quiz answers validated?
              </h4>
              <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)', lineHeight: 1.6 }}>
                Multiple choice questions check for exact matches. Short answer questions use flexible matching that checks if the user's answer contains the correct answer or vice versa.
              </p>
            </div>
          </div>
        </div>
      )
    }
  };

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
            ❓
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
            Help & Documentation
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '1.25rem',
            maxWidth: '600px', 
            margin: '0 auto',
            fontWeight: 400,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Everything you need to know about creating and managing ads
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '300px 1fr',
          gap: '24px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Navigation Sidebar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '32px 24px',
            height: 'fit-content',
            position: 'sticky',
            top: '24px'
          }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: 'bold', 
              marginBottom: '24px',
              color: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📑</span>
              Contents
            </h2>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: activeSection === key ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    color: activeSection === key ? '#667eea' : 'rgba(0, 0, 0, 0.7)'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== key) {
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== key) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>{sections[activeSection].icon}</span>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                margin: 0
              }}>
                {sections[activeSection].title}
              </h2>
            </div>
            
            <div style={{ padding: '32px' }}>
              {sections[activeSection].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdHelpPage;