// components/PremiumContent.jsx
import { useState } from 'react';
import API from '../services/api';

export const PremiumContent = ({ contentId, price }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    try {
      await API.post('/api/credits/spend', { 
        amount: price,
        contentId 
      });
      setIsUnlocked(true);
    } catch (err) {
      setError('Failed to unlock content. Check your credit balance.');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border">
      {!isUnlocked ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Premium Content</span>
            <span className="text-primary-600">{price} Credits</span>
          </div>
          <button
            onClick={handleUnlock}
            className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors"
          >
            Unlock Content
          </button>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </>
      ) : (
        <div className="text-green-600">Content Unlocked!</div>
      )}
    </div>
  );
};
