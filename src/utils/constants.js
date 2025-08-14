// src/utils/constants.js

export const AD_FORMATS = {
  REGULAR: 'regular',
  BANNER: 'banner',
  POPUP: 'popup',
  MODAL: 'modal',
  VIDEO: 'video',
  AUDIO: 'audio'
};

export const AD_FREQUENCY = {
  LOW: 'low',
  LIGHT: 'light',
  MODERATE: 'moderate',
  HIGH: 'high',
  AGGRESSIVE: 'aggressive'
};

export const BUDGET_LIMITS = {
  MIN: 2000,
  MAX: 20000
};

export const REWARD_LIMITS = {
  MIN: 0,
  MAX: 100
};

export const FILE_SIZE_LIMITS = {
  IMAGE: 2 * 1024 * 1024, // 2MB
  VIDEO: 2.5 * 1024 * 1024, // 2.5MB
  AUDIO: 2 * 1024 * 1024 // 2MB
};

export const SKIP_TIME_RANGE = {
  MIN: 3, // seconds
  MAX: 15 // seconds
};

export const QUIZ_TIME_LIMIT = 20; // seconds

export const REWARD_MODAL_CLOSE_DELAY = 5000; // milliseconds