import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, setAuthToken, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Initialize auth: rehydrate token and fetch user profile
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setAuthToken(token);
        const profile = await getCurrentUser();
        setUser(profile);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // login handler
  const handleLogin = async ({ email, password }) => {
    try {
      setLoading(true);
      setError('');
      const res = await loginUser({ email, password });
      const { token, _id, name, email: userEmail, role, credits } = res;

      // store and set auth
      localStorage.setItem('token', token);
      setAuthToken(token);

      const userObj = { _id, name, email: userEmail, role, credits }
      setUser(userObj);
      return userObj;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.map(e => e.msg).join(', ') ||
        err.message ||
        'Login failed';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // register handler
  const handleRegister = async ({ name, email, password }) => {
    try {
      setLoading(true);
      setError('');
      const res = await registerUser({ name, email, password });
      const { token, _id, name: userName, email: userEmail, role, credits } = res;

      // store and set auth
      localStorage.setItem('token', token);
      setAuthToken(token);

      const userObj = { _id, name: userName, email: userEmail, role, credits }
      setUser(userObj);
      return userObj;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.map(e => e.msg).join(', ') ||
        err.message ||
        'Registration failed';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
