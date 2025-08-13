import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdObject from '../pages/AdObject'; // Adjust path as needed
// import AdObject from '../components/AdObject'; // Adjust path as needed
import { fetchPreviewAd } from '../components/api';

const AdPreviewPage = ({ AdComponent, RewardModal }) => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewards, setRewards] = useState(0);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRewardButton, setShowRewardButton] = useState(false);

  const Ad_id = useParams().id || '-1';  // Changed from .username to .user

  // navigate(`/preview/pending-ad/?ad_uuid=${formData.ad_uuid}&title=${encodeURIComponent(formData.title)}&description=${encodeURIComponent(formData.description)}&link=${encodeURIComponent(formData.link)}&format=${formData.format}&budget=${formData.budget}&reward=${formData.reward}&frequency=${formData.frequency}&quiz=${encodeURIComponent(JSON.stringify(formData.quiz))}`);
  const adParams = new URLSearchParams({
    ad_uuid: ad?.ad_uuid,
    title: ad?.title,
    description: ad?.description,
    link: ad?.link,
    format: ad?.format,
    budget: ad?.budget,
    reward: ad?.reward,
    frequency: ad?.frequency,
    quiz: JSON.stringify(ad?.quiz)
  });

  const showRewardProbability = 1; // 30% chance to show reward button

  const handleAdComplete = () => {
    console.log('Ad completed');
  };

  const handleAdSkip = () => {
    console.log('Ad skipped');
  };

  const handleAdView = () => {
    console.log('Ad viewed');
  };

  const handleAdClick = () => {
    console.log('Ad clicked');
    goToAdWebSite(ad);
  };

  const handleRewardClaim = () => {
    console.log('Reward claimed');
  };

  const handleRewardClick = (ad) => {
    setShowRewardModal(true);
  };

  const handleRewardEarned = (amount) => {
    setRewards(prev => prev + amount);
    setShowRewardModal(false);
  };

  const goToAdWebSite = (ad) => {
    if (ad?.link) {
      window.open(ad.link, '_blank');
    }
  };



  // Simple RewardModal component if not provided
  const SimpleRewardModal = RewardModal || (({ ad, onClose, onReward }) => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h3>Congratulations!</h3>
        <p>You earned {ad?.reward || 5} credits!</p>
        <button onClick={() => {
          onReward(ad?.reward || 5);
          onClose();
        }}>
          Claim Reward
        </button>
        <button onClick={onClose} style={{ marginLeft: '12px' }}>
          Close
        </button>
      </div>
    </div>
  ));



  // Fetch advertisement data
  useEffect(() => {
    // alert('Fetching ad with ID: ' + Ad_id);
    const fetchAd = async () => {
      
      if (Ad_id === '-1') { // If no ad ID is provided, do not fetch
        setLoading(false);
        // Sample ad data
        // {
        //     "ad_uuid": "",
        //     "title": "Spanish Lessions",
        //     "description": "sdafgsadfsdadsfsdaf",
        //     "link": "https://www.lawlessspanish.com/grammar/pronouns/double-pronoun-order/",
        //     "format": "regular",
        //     "mediaFile": {},
        //     "budget": 2000,
        //     "reward": 5,
        //     "frequency": "moderate",
        //     "quiz": [
        //         {
        //             "question": "Word of the Day",
        //             "type": "short",
        //             "options": [
        //                 "",
        //                 "",
        //                 "",
        //                 ""
        //             ],
        //             "correct": 0,
        //             "answer": "hola amigo"
        //         }
        //     ]
        // }
        setAd(JSON.parse(localStorage.getItem('previewAdData')));
        // setAd(adParams);

        console.log('No ad ID provided, using adParams:', adParams.toString());
      } else {
        try {
          setLoading(true);
          setError(null);

          console.log('Fetching ads with ID:', Ad_id);
          const response = await fetchPreviewAd(Ad_id);

          console.log('Fetched Ads:', response);
          console.log('Fetched Ads Details:', response.ads[0]);

          if (!response.ads || response.ads.length === 0) {
            setAd(null);
            return;
          }

          const adData = response.ads[0]; // Get first ad
          setAd(adData);

          // Determine if reward button should be shown
          setShowRewardButton(Math.random() < showRewardProbability);

        } catch (err) {
          setError(err.message);
          console.error('Error fetching advertisement:', err);
        } finally {
          setLoading(false);
        }
      }

    };

    fetchAd();
  }, [Ad_id, showRewardProbability]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>⏳</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.8)',
            marginBottom: '16px'
          }}>
            Loading Ad Preview
          </h2>
          <p style={{
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: '16px',
            lineHeight: 1.6
          }}>
            Please wait while we fetch your advertisement data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>❌</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.8)',
            marginBottom: '16px'
          }}>
            Error Loading Ad
          </h2>
          <p style={{
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: '16px',
            lineHeight: 1.6
          }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>⚠️</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.8)',
            marginBottom: '16px'
          }}>
            No Ad Selected
          </h2>
          <p style={{
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: '16px',
            lineHeight: 1.6
          }}>
            No ad selected for preview. Please create an ad first to see how it will look to your audience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,rgb(210, 216, 247) 0%,rgb(187, 167, 208) 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              marginBottom: '12px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              color: 'white',
              fontSize: '30px'
            }}>
              👁️
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              Ad Preview
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#059669',
            padding: '12px 20px',
            borderRadius: '20px',
            border: '2px solid rgba(34, 197, 94, 0.2)',
            backdropFilter: 'blur(10px)',
            fontWeight: 600,
            fontSize: '16px'
          }}>
            <span style={{ fontSize: '20px' }}>🏆</span>
            <span>{rewards} Credits Earned</span>
          </div>
        </div>

        {/* Preview Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          marginBottom: '24px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>🎬</span>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              Live Preview
            </h2>
          </div>

          <div style={{ padding: '32px' }}>
            <div style={{
              border: '3px dashed rgba(102, 126, 234, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)',
              position: 'relative',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>

              {/* AdObject Component
              <AdObject
                onAdView={handleAdView}
                onAdClick={handleAdClick}
                onAdSkip={handleAdSkip}
                onRewardClaim={handleRewardClaim}
                RewardModal={SimpleRewardModal}
                showRewardProbability={0.3} // 30% chance to show reward button
                filters={{ format: 'banner' }} // Only show banner ads for this placement
                style={{
                  minHeight: '200px', // Ensure minimum height
                  borderRadius: 0 // Remove border radius to fit Paper container
                }}
                className="banner-ad"
              /> */}

              {/* Demo Ad Display */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                border: '2px solid rgba(0, 0, 0, 0.05)',
                width: '100%',
                maxWidth: '500px',
                textAlign: 'center',
                cursor: 'pointer'
              }} >
                {/* Todo: clicking on the ad and not on the buttonsshould open the ad's link in a new tab */}
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  {ad.format === 'video' ? '🎥' : ad.format === 'audio' ? '🎵' : '📄'}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: 'rgba(0, 0, 0, 0.8)'
                }}>
                  {ad.title}
                </h3>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  marginBottom: '20px',
                  lineHeight: 1.5
                }}>
                  {ad.description}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the ad click from triggering
                      handleRewardClick(ad);
                    }}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'white',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                    }}
                  >
                    🎁 Claim Reward
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the ad click from triggering
                      handleAdSkip();
                    }}
                    style={{
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
                    Skip
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the ad click from triggering
                      goToAdWebSite(ad);
                    }}
                    style={{
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
                    See
                  </button>
                </div>
              </div>

              {/* Preview Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#d97706',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: '2px solid rgba(245, 158, 11, 0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Preview Mode
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '16px 20px',
              background: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '12px',
              border: '2px solid rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>💡</span>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: 'rgba(0, 0, 0, 0.7)',
                fontWeight: 500
              }}>
                This is how your ad will appear to users. Interactive elements are fully functional in preview mode.
              </p>
            </div>
          </div>
        </div>

        {/* Ad Details */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            padding: '20px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>📊</span>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: 0
            }}>
              Advertisement Details
            </h2>
          </div>

          <div style={{ padding: '32px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                background: 'rgba(102, 126, 234, 0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '2px solid rgba(102, 126, 234, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'rgba(0, 0, 0, 0.8)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>⚙️</span>
                  Basic Information
                </h3>
                <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(0, 0, 0, 0.7)' }}>
                  <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Title:</strong>
                    <span>{ad.title}</span>
                  </p>
                  <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Format:</strong>
                    <span style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      textTransform: 'capitalize'
                    }}>
                      {ad.format}
                    </span>
                  </p>
                  <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Budget:</strong>
                    <span style={{ fontWeight: 600 }}>{ad.budget} credits</span>
                  </p>
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '2px solid rgba(16, 185, 129, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'rgba(0, 0, 0, 0.8)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🎁</span>
                  Rewards & Engagement
                </h3>
                <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(0, 0, 0, 0.7)' }}>
                  <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Reward:</strong>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      color: '#059669'
                    }}>
                      {ad.reward} credits
                    </span>
                  </p>
                  <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Frequency:</strong>
                    <span style={{ textTransform: 'capitalize' }}>{ad.frequency}</span>
                  </p>
                  <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Quiz Questions:</strong>
                    <span style={{ fontWeight: 600 }}>{ad.quiz?.length || 0}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quiz Preview */}
            {ad.quiz && ad.quiz.length > 0 && (
              <div style={{
                marginTop: '32px',
                background: 'rgba(245, 158, 11, 0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '2px solid rgba(245, 158, 11, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: 'rgba(0, 0, 0, 0.8)',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🧠</span>
                  Quiz Questions Preview
                </h3>
                <div style={{
                  display: 'grid',
                  gap: '16px'
                }}>
                  {ad.quiz.slice(0, 3).map((question, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        <div style={{
                          background: '#f59e0b',
                          color: 'white',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontWeight: 600,
                            margin: '0 0 8px 0',
                            color: 'rgba(0, 0, 0, 0.8)',
                            lineHeight: 1.4
                          }}>
                            {question.question}
                          </p>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '12px'
                          }}>
                            <span style={{
                              background: 'rgba(245, 158, 11, 0.1)',
                              color: '#d97706',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}>
                              {question.type}
                            </span>
                            {question.type === 'multiple' && (
                              <span style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                                {question.options?.filter(opt => opt.trim()).length || 0} options
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {ad.quiz.length > 3 && (
                    <div style={{
                      textAlign: 'center',
                      color: 'rgba(0, 0, 0, 0.5)',
                      fontSize: '14px',
                      fontStyle: 'italic',
                      padding: '12px'
                    }}>
                      ... and {ad.quiz.length - 3} more questions
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reward Modal */}
        {showRewardModal && RewardModal && (
          <RewardModal
            ad={ad}
            onClose={() => setShowRewardModal(false)}
            onReward={handleRewardEarned}
          />
        )}
      </div>
    </div>
  );
};

export default AdPreviewPage;