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
  Chip,
  Divider,
  Avatar,
  Alert,
  Fab,
  Slider,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  CloudUpload as UploadIcon,
  Visibility as EyeIcon,
  FlashOn as ZapIcon,
  // Target as TargetIcon,
  EmojiEvents as AwardIcon,
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Lucide React icons  
import { Target, Zap, Award } from 'lucide-react';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

const GradientHeader = styled(Box)(({ theme, bgcolor }) => ({
  background: bgcolor || 'linear-gradient(135deg, #1976d2, #42a5f5)',
  color: 'white',
  padding: theme.spacing(2, 3),
  borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  margin: theme.spacing(-3, -3, 2, -3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const UploadZone = styled(Box)(({ theme, isDragOver, hasError }) => ({
  border: `2px dashed ${hasError ? theme.palette.error.main : isDragOver ? theme.palette.primary.main : theme.palette.grey[300]}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: hasError ? theme.palette.error.light : isDragOver ? theme.palette.primary.light : theme.palette.grey[50],
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light,
  },
}));

const FormatCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  backgroundColor: selected ? theme.palette.primary.light : 'white',
  transform: selected ? 'scale(1.02)' : 'scale(1)',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4],
  },
}));

const QuestionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
}));

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
    <Box sx={{ 
      minHeight: '100vh', 
        background: 'linear-gradient(135deg,rgb(210, 216, 247) 0%,rgb(174, 144, 206) 100%)',
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            mx: 'auto', 
            mb: 2,
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)'
          }}>
            <Target sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            color: 'transparent',
            mb: 1
          }}>
            {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Create engaging ads with interactive quizzes to boost user engagement and drive conversions
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* Basic Information */}
          <StyledPaper>
            <GradientHeader bgcolor="linear-gradient(135deg, #1976d2, #42a5f5)">
              <EyeIcon />
              <Typography variant="h6" component="h2">
                Basic Information
              </Typography>
            </GradientHeader>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ad Title *"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  placeholder="Enter an engaging ad title..."
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Destination Link *"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  error={!!errors.link}
                  helperText={errors.link}
                  placeholder="https://your-website.com"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
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
          </StyledPaper>

          {/* Format & Media */}
          <StyledPaper>
            <GradientHeader bgcolor="linear-gradient(135deg, #9c27b0, #ba68c8)">
              <UploadIcon />
              <Typography variant="h6" component="h2">
                Format & Media
              </Typography>
            </GradientHeader>
            
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Ad Format
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {formatOptions.map((option) => (
                <Grid item xs={6} sm={4} md={2} key={option.value}>
                  <FormatCard selected={formData.format === option.value}>
                    <CardContent 
                      sx={{ textAlign: 'center', p: 2, cursor: 'pointer' }}
                      onClick={() => handleInputChange('format', option.value)}
                    >
                      <Typography variant="h4" sx={{ mb: 1 }}>{option.icon}</Typography>
                      <Typography variant="body2" fontWeight="bold">{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">{option.description}</Typography>
                    </CardContent>
                  </FormatCard>
                </Grid>
              ))}
            </Grid>

            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Media Upload
            </Typography>
            <UploadZone
              onDrop={handleFileDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              isDragOver={dragOver}
              hasError={!!errors.mediaFile}
              component="label"
              display={'flex'}
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
              <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <div style={{ paddingLeft: '25%',margin: '10px', alignContent: 'center', textAlign: 'center' }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                {formData.mediaFile ? formData.mediaFile.name : 'Drag & drop your media file here'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                or click to browse files
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Max size: {formData.format === 'video' ? '2.5MB' : '2MB'}
              </Typography>
              </div>
              
            </UploadZone>
            {errors.mediaFile && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.mediaFile}
              </Alert>
            )}
          </StyledPaper>

          {/* Campaign Settings */}
          <StyledPaper>
            <GradientHeader bgcolor="linear-gradient(135deg, #4caf50, #81c784)">
              <ZapIcon />
              <Typography variant="h6" component="h2">
                Campaign Settings
              </Typography>
            </GradientHeader>
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Target sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1" fontWeight="bold">Budget (Credits)</Typography>
                </Box>
                <TextField
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
                  <AwardIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1" fontWeight="bold">Reward (Credits)</Typography>
                </Box>
                <TextField
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
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Display Frequency
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    variant="outlined"
                  >
                    {frequencyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography sx={{ fontSize: '1.2em' }}>{option.icon}</Typography>
                          <Box>
                            <Typography variant="body1">{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </StyledPaper>

          {/* Quiz Questions */}
          <StyledPaper>
            <GradientHeader bgcolor="linear-gradient(135deg, #ff9800, #ffb74d)">
              <HelpIcon />
              <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                Interactive Quiz Questions
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addQuizQuestion}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                Add Question
              </Button>
            </GradientHeader>

            <Stack spacing={3}>
              {formData.quiz.map((question, index) => (
                <QuestionCard key={index}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: 'primary.main',
                          width: 40,
                          height: 40,
                          fontSize: '1rem',
                          fontWeight: 'bold'
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
                          color="error"
                          sx={{ 
                            '&:hover': { 
                              bgcolor: 'error.light',
                              color: 'white'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Question"
                        value={question.question}
                        onChange={(e) => handleQuizChange(index, 'question', e.target.value)}
                        placeholder="Enter your question here..."
                        variant="outlined"
                      />

                      <FormControl fullWidth>
                        <InputLabel>Question Type</InputLabel>
                        <Select
                          value={question.type}
                          onChange={(e) => handleQuizChange(index, 'type', e.target.value)}
                          label="Question Type"
                        >
                          <MenuItem value="multiple">📝 Multiple Choice</MenuItem>
                          <MenuItem value="short">✏️ Short Answer</MenuItem>
                        </Select>
                      </FormControl>

                      {question.type === 'multiple' ? (
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
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
                                  bgcolor: 'grey.50',
                                  borderRadius: 1
                                }}>
                                  <FormControlLabel
                                    value={optionIndex}
                                    control={<Radio />}
                                    label=""
                                  />
                                  <TextField
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
                          <Alert severity="info" sx={{ mt: 2 }}>
                            Select the radio button next to the correct answer
                          </Alert>
                        </Box>
                      ) : (
                        <TextField
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
          </StyledPaper>

          {/* Submit Button */}
          <Box sx={{ position: 'sticky', bottom: 16, zIndex: 10 }}>
            <StyledPaper>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {editingAd ? 'Update Advertisement' : 'Create Advertisement'}
              </Button>
            </StyledPaper>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CreateAdPage;