// src/components/ContentPlayer.jsx
import { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { useContentViewCredits } from '../hooks/useContentViewCredits';
import PremiumContent from './PremiumContent';

export default function ContentPlayer() {
  const { contentId } = useParams();
  const playerRef = useRef(null);
  
  // Track viewing time for credits
  useContentViewCredits(contentId);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
        <ReactPlayer
          ref={playerRef}
          url={`/api/content/${contentId}/stream`}
          width="100%"
          height="calc(100vh - 200px)"
          controls
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true
              }
            }
          }}
        />
      </div>
      
      <div className="mt-6">
        <PremiumContent contentId={contentId} price={50} />
      </div>
    </div>
  );
}
