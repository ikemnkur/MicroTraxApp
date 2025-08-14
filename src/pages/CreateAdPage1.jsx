import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Avatar,
  Stack,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Visibility as EyeIcon,
  Settings as ZapIcon,
  GpsFixed as TargetIcon,
  EmojiEvents as AwardIcon,
  Help as HelpIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Modern styled components with Tailwind-like aesthetics
const ModernContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  }
}));

const StyledCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  border: 'none',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.35)',
  }
}));

const GradientHeader = styled(Box)(({ bgcolor }) => ({
  background: bgcolor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '24px 32px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '20px',
  fontWeight: 600,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
}));

const ModernTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(102, 126, 234, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    color: 'rgba(0, 0, 0, 0.7)',
  }
}));

const UploadZone = styled(Box)(({ theme, isDragOver, hasError }) => ({
  border: `3px dashed ${hasError ? '#ef4444' : isDragOver ? '#667eea' : 'rgba(0, 0, 0, 0.2)'}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: hasError ? 'rgba(239, 68, 68, 0.05)' : isDragOver ? 'rgba(102, 126, 234, 0.05)' : 'rgba(0, 0, 0, 0.02)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    transform: 'translateY(-2px)',
  },
}));

const FormatCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: theme.spacing(2),
  border: selected ? '3px solid #667eea' : '3px solid transparent',
  backgroundColor: selected ? 'rgba(102, 126, 234, 0.1)' : 'white',
  transform: selected ? 'scale(1.05)' : 'scale(1)',
  boxShadow: selected 
    ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
  border: '2px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  }
}));

const ModernButton = styled(Button)(({ theme, variant: buttonVariant }) => ({
  borderRadius: theme.spacing(1.5),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '16px',
  padding: theme.spacing(1.5, 3),
  boxShadow: buttonVariant === 'contained' 
    ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    : 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: buttonVariant === 'contained' 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  }
}));

const CreateAdPage = ({ onSave, editingAd = null }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
    <ModernContainer>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Modern Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <TargetIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2,
              textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              maxWidth: 600, 
              mx: 'auto',
              fontWeight: 400,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            Create engaging ads with interactive quizzes to boost user engagement and drive conversions
          </Typography>
        </Box>

        <Stack spacing={4}>
          {/* Basic Information */}
          <StyledCard>
            <GradientHeader bgcolor="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)">
              <EyeIcon />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Basic Information
              </Typography>
            </GradientHeader>
            
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Ad Title *"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    error={!!errors.title}
                    helperText={errors.title}
                    placeholder="Enter an engaging ad title..."
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <ModernTextField
                    fullWidth
                    label="Destination Link *"
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    error={!!errors.link}
                    helperText={errors.link}
                    placeholder="https://your-website.com"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ModernTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description *"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                    placeholder="Describe your advertisement in detail. What makes it special?"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </StyledCard>

          {/* Format & Media */}
          <StyledCard>
            <GradientHeader bgcolor="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)">
              <UploadIcon />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Format & Media
              </Typography>
            </GradientHeader>
            
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'rgba(0, 0, 0, 0.8)' }}>
                Ad Format
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {formatOptions.map((option) => (
                  <Grid item xs={6} sm={4} md={2} key={option.value}>
                    <FormatCard selected={formData.format === option.value}>
                      <CardContent 
                        sx={{ textAlign: 'center', p: 3, cursor: 'pointer' }}
                        onClick={() => handleInputChange('format', option.value)}
                      >
                        <Typography variant="h4" sx={{ mb: 1 }}>{option.icon}</Typography>
                        <Typography variant="body1" fontWeight="bold" sx={{ mb: 0.5 }}>
                          {option.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </CardContent>
                    </FormatCard>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'rgba(0, 0, 0, 0.8)' }}>
                Media Upload
              </Typography>
              <UploadZone
                onDrop={handleFileDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                isDragOver={dragOver}
                hasError={!!errors.mediaFile}
                component="label"
              >
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                  accept={
                    formData.format === 'video' ? 'video/*' :
                    formData.format === 'audio' ? 'audio/*,image/*' : 
                    'image/*'
                  }
                />
                <UploadIcon sx={{ fontSize: 56, color: 'rgba(0, 0, 0, 0.4)', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {formData.mediaFile ? formData.mediaFile.name : 'Drag & drop your media file here'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  or click to browse files
                </Typography>
                <Chip 
                  label={`Max size: ${formData.format === 'video' ? '2.5MB' : '2MB'}`}
                  size="small"
                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
                />
              </UploadZone>
              {errors.mediaFile && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {errors.mediaFile}
                </Alert>
              )}
            </Box>
          </StyledCard>

          {/* Campaign Settings */}
          <StyledCard>
            <GradientHeader bgcolor="linear-gradient(135deg, #10b981 0%, #059669 100%)">
              <ZapIcon />
              <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                Campaign Settings
              </Typography>
            </GradientHeader>
            
            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TargetIcon sx={{ mr: 1, color: '#10b981' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Budget (Credits)</Typography>
                  </Box>
                  <ModernTextField
                    fullWidth
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                    error={!!errors.budget}
                    helperText={errors.budget || 'Range: 2,000 - 20,000 credits'}
                    inputProps={{ min: 2000, max: 20000, step: 100 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AwardIcon sx={{ mr: 1, color: '#10b981' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Reward (Credits)</Typography>
                  </Box>
                  <ModernTextField
                    fullWidth
                    type="number"
                    value={formData.reward}
                    onChange={(e) => handleInputChange('reward', parseInt(e.target.value))}
                    error={!!errors.reward}
                    helperText={errors.reward || 'Credits per user interaction'}
                    inputProps={{ min: 0, max: 100 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Display Frequency
                  </Typography>
                  <Stack spacing={2}>
                    {frequencyOptions.map((option) => (
                      <Box
                        key={option.value}
                        onClick={() => handleInputChange('frequency', option.value)}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: formData.frequency === option.value ? '3px solid #10b981' : '3px solid transparent',
                          backgroundColor: formData.frequency === option.value ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0, 0, 0, 0.02)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(16, 185, 129, 0.05)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography sx={{ fontSize: '1.5em' }}>{option.icon}</Typography>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </StyledCard>

          {/* Quiz Questions */}
          <StyledCard>
            <GradientHeader bgcolor="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
              <HelpIcon />
              <Typography variant="h6" component="h2" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Interactive Quiz Questions
              </Typography>
              <ModernButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addQuizQuestion}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {isMobile ? 'Add' : 'Add Question'}
              </ModernButton>
            </GradientHeader>

            <Box sx={{ p: 4 }}>
              <Stack spacing={3}>
                {formData.quiz.map((question, index) => (
                  <QuestionCard key={index}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: '#f59e0b',
                            width: 48,
                            height: 48,
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                          }}>
                            {index + 1}
                          </Avatar>
                          <Typography variant="h6" fontWeight="bold">
                            Question {index + 1}
                          </Typography>
                        </Box>
                        {formData.quiz.length > 1 && (
                          <IconButton
                            onClick={() => removeQuizQuestion(index)}
                            sx={{ 
                              color: '#ef4444',
                              '&:hover': { 
                                bgcolor: '#ef4444',
                                color: 'white',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        )}
                      </Box>

                      <Stack spacing={3}>
                        <ModernTextField
                          fullWidth
                          label="Question"
                          value={question.question}
                          onChange={(e) => handleQuizChange(index, 'question', e.target.value)}
                          placeholder="Enter your question here..."
                          variant="outlined"
                        />

                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600 }}>Question Type</InputLabel>
                          <Select
                            value={question.type}
                            onChange={(e) => handleQuizChange(index, 'type', e.target.value)}
                            label="Question Type"
                            sx={{ 
                              borderRadius: 1.5,
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderWidth: '2px',
                              }
                            }}
                          >
                            <MenuItem value="multiple">📝 Multiple Choice</MenuItem>
                            <MenuItem value="short">✏️ Short Answer</MenuItem>
                          </Select>
                        </FormControl>

                        {question.type === 'multiple' ? (
                          <Box>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                              Answer Options:
                            </Typography>
                            <RadioGroup
                              value={question.correct}
                              onChange={(e) => handleQuizChange(index, 'correct', parseInt(e.target.value))}
                            >
                              <Stack spacing={2}>
                                {question.options.map((option, optionIndex) => (
                                  <Box key={optionIndex} sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 2,
                                    p: 2,
                                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                                    borderRadius: 2,
                                    border: '2px solid rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                      bgcolor: 'rgba(245, 158, 11, 0.05)',
                                      borderColor: 'rgba(245, 158, 11, 0.3)'
                                    }
                                  }}>
                                    <FormControlLabel
                                      value={optionIndex}
                                      control={<Radio sx={{ color: '#f59e0b' }} />}
                                      label=""
                                    />
                                    <ModernTextField
                                      fullWidth
                                      value={option}
                                      onChange={(e) => handleQuizOptionChange(index, optionIndex, e.target.value)}
                                      placeholder={`Option ${optionIndex + 1}`}
                                      variant="outlined"
                                      size="small"
                                    />
                                  </Box>
                                ))}
                              </Stack>
                            </RadioGroup>
                            <Alert 
                              severity="info" 
                              sx={{ 
                                mt: 2, 
                                borderRadius: 2,
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.2)'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <HelpIcon sx={{ fontSize: 18 }} />
                                Select the radio button next to the correct answer
                              </Box>
                            </Alert>
                          </Box>
                        ) : (
                          <ModernTextField
                            fullWidth
                            label="Correct Answer"
                            value={question.answer}
                            onChange={(e) => handleQuizChange(index, 'answer', e.target.value)}
                            placeholder="Enter the correct answer..."
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </CardContent>
                  </QuestionCard>
                ))}
              </Stack>
            </Box>
          </StyledCard>

          {/* Submit Button */}
          <Box sx={{ position: 'sticky', bottom: 16, zIndex: 10 }}>
            <StyledCard>
              <Box sx={{ p: 3 }}>
                <ModernButton
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  sx={{
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  {editingAd ? 'Update Advertisement' : 'Create Advertisement'}
                </ModernButton>
              </Box>
            </StyledCard>
          </Box>
        </Stack>
      </Box>
    </ModernContainer>
  );
};

export default CreateAdPage;