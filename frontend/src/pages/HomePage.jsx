// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import FeedCard from '../components/feed/FeedCard';
import { useAuth } from '../context/AuthContext';
import { getAggregatedFeed } from '../services/userService';

export default function HomePage() {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = async () => {
    try {
      const data = await getAggregatedFeed();
      console.log("naiyo naiyo :", data[0])
      setFeed(data);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading feed...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Credits: {user?.credits}</h2>
        </div>
        <div className="space-y-4">
          {feed.map(item => (
            <FeedCard key={item.id} item={item} onUpdate={loadFeed}/>
          ))}
        </div>
      </div>
    </div>
  );
}
