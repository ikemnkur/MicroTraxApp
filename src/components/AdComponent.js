import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Eye, TrendingUp, HelpCircle, Plus, Edit, Save, X, Timer, Award, DollarSign, Target, Users } from 'lucide-react';

// Mock data and utilities
const mockUser = {
  id: 1,
  name: 'John Doe',
  credits: 5000
};

const mockAds = [
  {
    id: 1,
    title: 'Amazing Product Launch',
    description: 'Check out our new revolutionary product that will change your life!',
    link: 'https://example.com/product',
    format: 'video',
    mediaUrl: '/api/placeholder/640/360',
    budget: 5000,
    spent: 2500,
    frequency: 'moderate',
    reward: 50,
    views: 1250,
    completions: 875,
    quiz: [
      {
        question: 'What is the main benefit of this product?',
        type: 'multiple',
        options: ['Time saving', 'Cost effective', 'Revolutionary', 'Easy to use'],
        correct: 0
      },
      {
        question: 'What color was prominently featured?',
        type: 'multiple',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correct: 1
      },
      {
        question: 'What was the main call to action?',
        type: 'short',
        answer: 'try now'
      }
    ],
    active: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Test AI Product Launch',
    description: 'Check out our new beta product that will change your AI Art!',
    link: 'https://example.com/product/ai',
    format: 'image',
    mediaUrl: '/api/placeholder/640/360',
    budget: 500,
    spent: 250,
    frequency: 'low',
    reward: 5,
    views: 50,
    completions: 40,
    quiz: [
      {
        question: 'What is the main benefit of this product?',
        type: 'multiple',
        options: ['Time saving', 'Cost effective', 'Revolutionary', 'Easy to use'],
        correct: 0
      },
      {
        question: 'What color was prominently featured?',
        type: 'multiple',
        options: ['Red', 'Blue', 'Green', 'Yellow'],
        correct: 1
      },
      {
        question: 'What was the main call to action?',
        type: 'short',
        answer: 'try now'
      }
    ],
    active: true,
    createdAt: '2024-01-16'
  }
];

// Ad Component
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

// Reward Modal Component
const RewardModal = ({ ad, onClose, onReward }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (ad && ad.quiz && ad.quiz.length > 0) {
      const randomQuestion = ad.quiz[Math.floor(Math.random() * ad.quiz.length)];
      setCurrentQuestion(randomQuestion);
    }
  }, [ad]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmit();
    }
  }, [timeLeft, showResult]);

  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        onClose();
        if (isCorrect) {
          onReward(ad.reward);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showResult, isCorrect, onClose, onReward, ad.reward]);

  const handleSubmit = () => {
    if (!currentQuestion) return;

    let correct = false;
    
    if (currentQuestion.type === 'multiple') {
      correct = selectedOption === currentQuestion.correct;
    } else {
      const userAnswerLower = userAnswer.toLowerCase().trim();
      const correctAnswerLower = currentQuestion.answer.toLowerCase().trim();
      correct = userAnswerLower.includes(correctAnswerLower) || correctAnswerLower.includes(userAnswerLower);
    }

    setIsCorrect(correct);
    setShowResult(true);
  };

  if (!currentQuestion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Attention Check</h3>
          <div className="flex items-center gap-2">
            <Timer size={16} />
            <span className="text-sm">{timeLeft}s</span>
          </div>
        </div>

        {!showResult ? (
          <div>
            <p className="mb-4">{currentQuestion.question}</p>
            
            {currentQuestion.type === 'multiple' ? (
              <div className="space-y-2 mb-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    className={`w-full p-3 text-left rounded border ${
                      selectedOption === index
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <button
              onClick={handleSubmit}
              disabled={currentQuestion.type === 'multiple' ? selectedOption === null : !userAnswer.trim()}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className={`text-6xl mb-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? '✓' : '✗'}
            </div>
            <h4 className="text-lg font-bold mb-2">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {isCorrect 
                ? `You earned ${ad.reward} credits!` 
                : 'Better luck next time!'}
            </p>
            <div className="text-xs text-gray-500">
              Closing in 5 seconds...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Create Ad Page
const CreateAdPage = ({ onSave, editingAd = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    format: 'regular',
    mediaFile: null,
    budget: 2000,
    reward: 0,
    frequency: 'moderate',
    quiz: [
      { question: '', type: 'multiple', options: ['', '', '', ''], correct: 0, answer: '' }
    ]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAd) {
      setFormData({
        title: editingAd.title || '',
        description: editingAd.description || '',
        link: editingAd.link || '',
        format: editingAd.format || 'regular',
        mediaFile: null,
        budget: editingAd.budget || 2000,
        reward: editingAd.reward || 0,
        frequency: editingAd.frequency || 'moderate',
        quiz: editingAd.quiz || [
          { question: '', type: 'multiple', options: ['', '', '', ''], correct: 0, answer: '' }
        ]
      });
    }
  }, [editingAd]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuizChange = (index, field, value) => {
    const newQuiz = [...formData.quiz];
    newQuiz[index] = { ...newQuiz[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      quiz: newQuiz
    }));
  };

  const handleQuizOptionChange = (quizIndex, optionIndex, value) => {
    const newQuiz = [...formData.quiz];
    newQuiz[quizIndex].options[optionIndex] = value;
    setFormData(prev => ({
      ...prev,
      quiz: newQuiz
    }));
  };

  const addQuizQuestion = () => {
    setFormData(prev => ({
      ...prev,
      quiz: [
        ...prev.quiz,
        { question: '', type: 'multiple', options: ['', '', '', ''], correct: 0, answer: '' }
      ]
    }));
  };

  const removeQuizQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      quiz: prev.quiz.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = formData.format === 'video' ? 2.5 * 1024 * 1024 : 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          mediaFile: `File size must be less than ${formData.format === 'video' ? '2.5MB' : '2MB'}`
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        mediaFile: file
      }));
      setErrors(prev => ({
        ...prev,
        mediaFile: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.link.trim()) newErrors.link = 'Link is required';
    if (formData.budget < 2000 || formData.budget > 20000) {
      newErrors.budget = 'Budget must be between 2000 and 20000 credits';
    }
    if (formData.reward < 0 || formData.reward > 100) {
      newErrors.reward = 'Reward must be between 0 and 100 credits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editingAd ? 'Edit Ad' : 'Create New Ad'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter ad title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Link *</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.link ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com"
              />
              {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows="3"
              placeholder="Describe your ad"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Format & Media */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Format & Media</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Format</label>
              <select
                value={formData.format}
                onChange={(e) => handleInputChange('format', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="regular">Regular</option>
                <option value="banner">Banner</option>
                <option value="popup">Popup</option>
                <option value="modal">Modal</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Media Upload</label>
              <input
                type="file"
                onChange={handleFileUpload}
                accept={
                  formData.format === 'video' ? 'video/*' :
                  formData.format === 'audio' ? 'audio/*,image/*' : 
                  'image/*'
                }
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.mediaFile && <p className="text-red-500 text-sm mt-1">{errors.mediaFile}</p>}
            </div>
          </div>
        </div>

        {/* Campaign Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Campaign Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Budget (Credits)</label>
              <input
                type="number"
                min="2000"
                max="20000"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.budget ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reward (Credits)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.reward}
                onChange={(e) => handleInputChange('reward', parseInt(e.target.value))}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.reward ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.reward && <p className="text-red-500 text-sm mt-1">{errors.reward}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => handleInputChange('frequency', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quiz Questions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Quiz Questions</h2>
            <button
              type="button"
              onClick={addQuizQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Question
            </button>
          </div>

          {formData.quiz.map((question, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Question {index + 1}</h3>
                {formData.quiz.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuizQuestion(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuizChange(index, 'question', e.target.value)}
                  placeholder="Enter your question"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={question.type}
                  onChange={(e) => handleQuizChange(index, 'type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="multiple">Multiple Choice</option>
                  <option value="short">Short Answer</option>
                </select>

                {question.type === 'multiple' ? (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          checked={question.correct === optionIndex}
                          onChange={() => handleQuizChange(index, 'correct', optionIndex)}
                          className="text-blue-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleQuizOptionChange(index, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={question.answer}
                    onChange={(e) => handleQuizChange(index, 'answer', e.target.value)}
                    placeholder="Correct answer"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            {editingAd ? 'Update Ad' : 'Create Ad'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Preview Page
const PreviewPage = ({ ad }) => {
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewards, setRewards] = useState(0);

  const handleAdComplete = () => {
    console.log('Ad completed');
  };

  const handleAdSkip = () => {
    console.log('Ad skipped');
  };

  const handleRewardClick = (ad) => {
    setShowRewardModal(true);
  };

  const handleRewardEarned = (amount) => {
    setRewards(prev => prev + amount);
    setShowRewardModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ad Preview</h1>
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded">
          <Award size={16} />
          <span>{rewards} Credits Earned</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <AdComponent
            ad={ad}
            onComplete={handleAdComplete}
            onSkip={handleAdSkip}
            onReward={handleRewardClick}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Ad Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Title:</strong> {ad.title}</p>
            <p><strong>Format:</strong> {ad.format}</p>
            <p><strong>Budget:</strong> {ad.budget} credits</p>
          </div>
          <div>
            <p><strong>Reward:</strong> {ad.reward} credits</p>
            <p><strong>Frequency:</strong> {ad.frequency}</p>
            <p><strong>Quiz Questions:</strong> {ad.quiz.length}</p>
          </div>
        </div>
      </div>

      {showRewardModal && (
        <RewardModal
          ad={ad}
          onClose={() => setShowRewardModal(false)}
          onReward={handleRewardEarned}
        />
      )}
    </div>
  );
};

// Analytics Page
const AnalyticsPage = ({ ads }) => {
  const [selectedAd, setSelectedAd] = useState(null);

  const totalSpent = ads.reduce((sum, ad) => sum + ad.spent, 0);
  const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
  const totalCompletions = ads.reduce((sum, ad) => sum + ad.completions, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold">{totalSpent}</p>
            </div>
            <DollarSign className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold">{totalViews}</p>
            </div>
            <Eye className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completions</p>
              <p className="text-2xl font-bold">{totalCompletions}</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Ads</p>
              <p className="text-2xl font-bold">{ads.filter(ad => ad.active).length}</p>
            </div>
            <Target className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Ads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Your Ads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completions
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{ad.title}</div>
                    <div className="text-sm text-gray-500">{ad.description.substring(0, 50)}...</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="capitalize">{ad.format}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {ad.budget} credits
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ad.spent} credits</div>
                    <div className="text-xs text-gray-500">
                      {((ad.spent / ad.budget) * 100).toFixed(1)}% used
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {ad.views}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ad.completions}</div>
                    <div className="text-xs text-gray-500">
                      {ad.views > 0 ? ((ad.completions / ad.views) * 100).toFixed(1) : 0}% rate
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ad.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ad.active ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedAd(ad)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedAd.title}</h3>
              <button
                onClick={() => setSelectedAd(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p><strong>Format:</strong> {selectedAd.format}</p>
                <p><strong>Budget:</strong> {selectedAd.budget} credits</p>
                <p><strong>Spent:</strong> {selectedAd.spent} credits</p>
                <p><strong>Remaining:</strong> {selectedAd.budget - selectedAd.spent} credits</p>
              </div>
              <div className="space-y-2">
                <p><strong>Views:</strong> {selectedAd.views}</p>
                <p><strong>Completions:</strong> {selectedAd.completions}</p>
                <p><strong>Completion Rate:</strong> {selectedAd.views > 0 ? ((selectedAd.completions / selectedAd.views) * 100).toFixed(1) : 0}%</p>
                <p><strong>Cost per View:</strong> {selectedAd.views > 0 ? (selectedAd.spent / selectedAd.views).toFixed(2) : 0} credits</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Quiz Questions ({selectedAd.quiz.length})</h4>
              {selectedAd.quiz.map((question, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded mb-2">
                  <p className="font-medium">{index + 1}. {question.question}</p>
                  <p className="text-sm text-gray-600">Type: {question.type}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedAd(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Help Page
const HelpPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Overview',
      content: (
        <div className="space-y-4">
          <p>Welcome to the Ad System! This platform allows you to create, manage, and monetize advertisements with an innovative reward-based engagement model.</p>
          <h3 className="text-lg font-semibold">Key Features:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Multiple ad formats (regular, banner, popup, video, audio)</li>
            <li>Attention-based reward system with quiz questions</li>
            <li>Flexible budget and frequency controls</li>
            <li>Real-time analytics and insights</li>
            <li>Skipable ads with minimum view time</li>
          </ul>
        </div>
      )
    },
    creating: {
      title: 'Creating Ads',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Step-by-Step Guide:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Basic Information:</strong> Enter your ad title, description, and destination link</li>
            <li><strong>Format Selection:</strong> Choose from regular, banner, popup, video, or audio formats</li>
            <li><strong>Media Upload:</strong> Upload your media files (images, videos, audio) within size limits</li>
            <li><strong>Budget & Rewards:</strong> Set your campaign budget (2000-20000 credits) and reward amount (0-100 credits)</li>
            <li><strong>Quiz Questions:</strong> Create attention-check questions to ensure engagement</li>
            <li><strong>Frequency:</strong> Choose how often your ad should be displayed</li>
          </ol>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold">File Size Limits:</h4>
            <ul className="list-disc list-inside mt-2">
              <li>Images & GIFs: 2MB maximum</li>
              <li>Video files: 2.5MB maximum</li>
              <li>Audio files: 2MB maximum</li>
            </ul>
          </div>
        </div>
      )
    },
    rewards: {
      title: 'Reward System',
      content: (
        <div className="space-y-4">
          <p>Our reward system encourages genuine engagement by requiring users to prove they paid attention to your ad.</p>
          <h3 className="text-lg font-semibold">How It Works:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Users watch your ad (minimum 3-15 seconds before skip option appears)</li>
            <li>After completing the ad, users can claim a reward</li>
            <li>A random quiz question appears with a 20-second timer</li>
            <li>Correct answers earn the specified reward amount</li>
            <li>Reward modal closes automatically after 5 seconds</li>
          </ol>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold">Question Types:</h4>
            <ul className="list-disc list-inside mt-2">
              <li><strong>Multiple Choice:</strong> 4 options with one correct answer</li>
              <li><strong>Short Answer:</strong> Text input with flexible matching</li>
            </ul>
          </div>
        </div>
      )
    },
    analytics: {
      title: 'Analytics',
      content: (
        <div className="space-y-4">
          <p>Track your ad performance with comprehensive analytics and insights.</p>
          <h3 className="text-lg font-semibold">Key Metrics:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Views:</strong> Total number of times your ad was displayed</li>
            <li><strong>Completions:</strong> Number of users who watched the entire ad</li>
            <li><strong>Completion Rate:</strong> Percentage of views that resulted in complete watches</li>
            <li><strong>Cost per View:</strong> Average credits spent per ad view</li>
            <li><strong>Budget Utilization:</strong> Percentage of total budget used</li>
          </ul>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold">Cost Structure:</h4>
            <p>You are charged credits each time your ad is displayed. The exact cost depends on your ad format and frequency settings.</p>
          </div>
        </div>
      )
    },
    formats: {
      title: 'Ad Formats',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Formats:</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Regular</h4>
              <p>Standard display ad with text and optional image</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">Banner</h4>
              <p>Horizontal banner ad with gradient background</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold">Popup</h4>
              <p>Modal overlay that appears over content</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold">Video</h4>
              <p>Full video playback with controls</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold">Audio</h4>
              <p>Audio playback with album art and controls</p>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <HelpCircle size={28} />
        Help & Documentation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Contents</h2>
          <nav className="space-y-2">
            {Object.entries(sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  activeSection === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">{sections[activeSection].title}</h2>
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const AdSystemApp = () => {
  const [currentPage, setCurrentPage] = useState('create');
  const [ads, setAds] = useState(mockAds);
  const [editingAd, setEditingAd] = useState(null);

  const handleSaveAd = (adData) => {
    if (editingAd) {
      setAds(prev => prev.map(ad => 
        ad.id === editingAd.id 
          ? { ...ad, ...adData, id: editingAd.id }
          : ad
      ));
      setEditingAd(null);
    } else {
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
    setCurrentPage('analytics');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'create':
        return <CreateAdPage onSave={handleSaveAd} editingAd={editingAd} />;
      case 'preview':
        return <PreviewPage ad={ads[0]} />;
      case 'analytics':
        return <AnalyticsPage ads={ads} />;
      case 'help':
        return <HelpPage />;
      default:
        return <CreateAdPage onSave={handleSaveAd} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Ad System</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded">
                <Users size={16} />
                <span>{mockUser.name}</span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded">
                <DollarSign size={16} />
                <span>{mockUser.credits} Credits</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'create', label: 'Create Ad', icon: Plus },
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'help', label: 'Help', icon: HelpCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
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

export default AdSystemApp;