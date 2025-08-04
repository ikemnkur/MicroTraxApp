// src/data/mockData.js

export const mockUser = {
  id: 1,
  name: 'John Doe',
  credits: 5000
};

export const mockAds = [
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