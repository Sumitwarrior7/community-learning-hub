// components/CreditBalance.jsx
import { useEffect, useState } from 'react';
import API from '../services/api';

export const CreditBalance = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data } = await API.get('/api/credits/balance');
      setBalance(data.credits);
    };
    fetchBalance();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Credit Balance</h3>
      <div className="text-2xl font-bold text-primary-600">
        {balance} Points
      </div>
    </div>
  );
};
