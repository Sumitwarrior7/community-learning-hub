// hooks/useContentViewCredits.js
import { useEffect } from 'react';
import API from '../services/api';

export const useContentViewCredits = (contentId) => {
  useEffect(() => {
    let timer;
    const handleEarnCredits = async () => {
      try {
        await API.post('/api/credits/earn', {
          activityType: 'content_view',
          contentId
        });
      } catch (error) {
        console.error('Credit earning failed:', error);
      }
    };

    // Start tracking after 30 seconds of continuous viewing
    timer = setTimeout(handleEarnCredits, 30000);

    return () => clearTimeout(timer);
  }, [contentId]);
};
  
  // hooks/useFeedInteraction.js
  export const useFeedInteraction = () => {
    const earnCredits = async (contentId, action) => {
      try {
        await API.post('/api/credits/earn', {
          activityType: 'feed_engagement',
          contentId,
          description: `${action} on content`
        });
      } catch (error) {
        console.error('Credit earning failed:', error);
      }
    };
  
    return { earnCredits };
  };
  