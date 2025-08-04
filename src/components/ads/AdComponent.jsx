// src/components/ads/AdComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Award } from 'lucide-react';

const AdComponent = ({ ad, onComplete, onSkip, onReward }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const skipTimeRef = useRef(null);

  useEffect(() => {
    // Random skip time between 3-15 seconds
    const skipTime = Math.floor(Math.random() * 12) + 3;
    skipTimeRef.current = skipTime;
    
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, skipTime * 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) videoRef.current.play();
    if (audioRef.current) audioRef.current.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (videoRef.current) videoRef.current.pause();
    if (audioRef.current) audioRef.current.pause();
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsPlaying(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsPlaying(false);
    onSkip();
  };

  const handleRewardClaim = () => {
    onReward(ad);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderAdContent = () => {
    switch (ad.format) {
      case 'video':
        return (
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover rounded-lg"
              src={ad.mediaUrl}
              onEnded={handleComplete}
              muted={isMuted}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="bg-white text-black p-4 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </div>
          </div>
        );

      case 'banner':
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
            <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
            <p className="mb-4">{ad.description}</p>
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors"
            >
              Learn More
            </a>
          </div>
        );

      case 'popup':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
              <p className="mb-4">{ad.description}</p>
              <div className="flex gap-2">
                <a
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Visit
                </a>
                <button
                  onClick={handleComplete}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={ad.mediaUrl}
                alt={ad.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-bold">{ad.title}</h3>
                <p className="text-sm text-gray-600">{ad.description}</p>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={ad.audioUrl}
              onEnded={handleComplete}
            />
            <div className="flex items-center gap-4">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <span className="text-sm">{formatTime(currentTime)}</span>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-500 hover:text-gray-700"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
            <p className="mb-4">{ad.description}</p>
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Learn More
            </a>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {renderAdContent()}
      
      {/* Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {formatTime(currentTime)}
          </span>
          {canSkip && (
            <button
              onClick={handleSkip}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Skip Ad
            </button>
          )}
        </div>
        
        {isCompleted && (
          <button
            onClick={handleRewardClaim}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Award size={16} />
            Claim Reward
          </button>
        )}
      </div>
    </div>
  );
};

export default AdComponent;