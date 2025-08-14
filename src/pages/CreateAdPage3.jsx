import React, { useState, useEffect } from 'react';
import { Plus, X, Save, Upload, Eye, Zap, Target, Award, HelpCircle } from 'lucide-react';

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
  const [dragOver, setDragOver] = useState(false);

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

  const formatOptions = [
    { value: 'regular', label: 'Regular', icon: '📄', description: 'Standard ad format' },
    { value: 'banner', label: 'Banner', icon: '🏷️', description: 'Wide banner display' },
    { value: 'popup', label: 'Popup', icon: '⬆️', description: 'Popup overlay' },
    { value: 'modal', label: 'Modal', icon: '🖼️', description: 'Modal dialog' },
    { value: 'video', label: 'Video', icon: '🎥', description: 'Video content' },
    { value: 'audio', label: 'Audio', icon: '🎵', description: 'Audio content' }
  ];

  const frequencyOptions = [
    { value: 'low', label: 'Low', icon: '🐌', description: 'Shown rarely' },
    { value: 'light', label: 'Light', icon: '🚶', description: 'Shown occasionally' },
    { value: 'moderate', label: 'Moderate', icon: '🚀', description: 'Balanced frequency' },
    { value: 'high', label: 'High', icon: '⚡', description: 'Shown frequently' },
    { value: 'aggressive', label: 'Aggressive', icon: '🔥', description: 'Maximum exposure' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
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
    processFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
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

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create engaging ads with interactive quizzes to boost user engagement and drive conversions
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <Eye className="w-5 h-5" />
                Basic Information
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ad Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                      errors.title 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Enter an engaging ad title..."
                  />
                  {errors.title && (
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Destination Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                      errors.link 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="https://your-website.com"
                  />
                  {errors.link && (
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {errors.link}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none ${
                    errors.description 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                  }`}
                  rows="4"
                  placeholder="Describe your advertisement in detail. What makes it special?"
                />
                {errors.description && (
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Format & Media */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <Upload className="w-5 h-5" />
                Format & Media
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Ad Format</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formatOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('format', option.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        formData.format === option.value
                          ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-100'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Media Upload</label>
                <div
                  onDrop={handleFileDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragOver
                      ? 'border-purple-400 bg-purple-50'
                      : errors.mediaFile
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {formData.mediaFile ? formData.mediaFile.name : 'Drag & drop your media file here'}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or <label className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium">
                      browse files
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept={
                          formData.format === 'video' ? 'video/*' :
                          formData.format === 'audio' ? 'audio/*,image/*' : 
                          'image/*'
                        }
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-400">
                    Max size: {formData.format === 'video' ? '2.5MB' : '2MB'}
                  </p>
                </div>
                {errors.mediaFile && (
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <X className="w-4 h-4" />
                    {errors.mediaFile}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Campaign Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <Zap className="w-5 h-5" />
                Campaign Settings
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Budget (Credits)
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="20000"
                    step="100"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 ${
                      errors.budget 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-green-500'
                    }`}
                  />
                  {errors.budget && (
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {errors.budget}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">Range: 2,000 - 20,000 credits</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Reward (Credits)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.reward}
                    onChange={(e) => handleInputChange('reward', parseInt(e.target.value))}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 ${
                      errors.reward 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-gray-200 hover:border-gray-300 focus:border-green-500'
                    }`}
                  />
                  {errors.reward && (
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {errors.reward}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">Credits per user interaction</p>
                </div>

                <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700">Display Frequency</label>
                  <div className="grid grid-cols-1 gap-2">
                    {frequencyOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleInputChange('frequency', option.value)}
                        className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                          formData.frequency === option.value
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-100'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{option.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Questions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <HelpCircle className="w-5 h-5" />
                Interactive Quiz Questions
              </h2>
              <button
                type="button"
                onClick={addQuizQuestion}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Question</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {formData.quiz.map((question, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Question {index + 1}
                      </h3>
                    </div>
                    {formData.quiz.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuizQuestion(index)}
                        className="w-8 h-8 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all duration-200 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuizChange(index, 'question', e.target.value)}
                      placeholder="Enter your question here..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200"
                    />

                    <select
                      value={question.type}
                      onChange={(e) => handleQuizChange(index, 'type', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200"
                    >
                      <option value="multiple">📝 Multiple Choice</option>
                      <option value="short">✏️ Short Answer</option>
                    </select>

                    {question.type === 'multiple' ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Answer Options:</p>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <input
                              type="radio"
                              name={`correct-${index}`}
                              checked={question.correct === optionIndex}
                              onChange={() => handleQuizChange(index, 'correct', optionIndex)}
                              className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleQuizOptionChange(index, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200"
                            />
                          </div>
                        ))}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-700 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4" />
                            Select the radio button next to the correct answer
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Correct Answer:</label>
                        <input
                          type="text"
                          value={question.answer}
                          onChange={(e) => handleQuizChange(index, 'answer', e.target.value)}
                          placeholder="Enter the correct answer..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-4 sm:static">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Save className="w-5 h-5" />
                {editingAd ? 'Update Advertisement' : 'Create Advertisement'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdPage;