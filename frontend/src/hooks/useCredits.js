// src/hooks/useCredits.js
import { useState } from 'react';
import { earnCredits, getCreditHistory } from '../services/creditService';

export const useCredits = () => {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);

  const earn = async (data) => {
    const response = await earnCredits(data);
    setBalance(prev => prev + response.amount);
    setHistory(prev => [response, ...prev]);
  };

  return { balance, history, earn };
};
