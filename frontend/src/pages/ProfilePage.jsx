import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSavedFeeds, getTransactionHistory } from '../services/userService';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [savedContent, setSavedContent] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [savedRes, transRes] = await Promise.all([
        getSavedFeeds(),
        getTransactionHistory(),
      ]);
      setSavedContent(savedRes);
      setTransactions(transRes);
    };
    if (user) loadData();
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
        {/* Profile header (avatar removed) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <span className="inline-block mt-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              {user?.credits} Credits
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          {['Saved Content', 'Transaction History'].map((label, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-3 -mb-px font-semibold ${
                activeTab === idx
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === 0 && (
          <ul className="space-y-4">
            {savedContent.map((item) => (
              <li
                key={item._id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {item.contentType === 'reddit' && (
                    <img src="/reddit.png" alt="Reddit" className="w-full h-full object-cover" />
                  )}
                  {item.contentType === 'linkedin' && (
                    <img src="/linkedin.png" alt="LinkedIn" className="w-full h-full object-cover" />
                  )}
                  {item.contentType === 'twitter' && (
                    <img src="/x.png" alt="X (Twitter)" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <a
                    href={item.metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                  >
                    {item.metadata.title}
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase mt-1">{item.contentType}</p>
                </div>
                <a
                  href={item.metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 1 && (
          <div className="space-y-4">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow transition"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{t.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`font-mono ${
                    t.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {t.amount > 0 ? '+' : ''}
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
