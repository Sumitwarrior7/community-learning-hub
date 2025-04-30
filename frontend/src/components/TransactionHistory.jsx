// components/TransactionHistory.jsx
import { useState, useEffect } from 'react';
import API from '../services/api';

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const { data } = await API.get('/api/credits/history');
      setTransactions(data);
    };
    loadHistory();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <div className="space-y-2">
        {transactions.map(transaction => (
          <div key={transaction._id} className="flex justify-between items-center p-2 border-b">
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`font-mono ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {transaction.amount > 0 ? '+' : ''}{transaction.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
