// src/components/ads/RewardModal.jsx
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

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

export default RewardModal;