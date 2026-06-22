/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to construct API options
  const getApiUrl = (path) => path;

  // Reusable helper to safely parse JSON response bodies
  const safeParseJson = async (res) => {
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return null;
    }
    try {
      return await res.json();
    } catch (err) {
      console.error('Failed to parse JSON response:', err);
      return null;
    }
  };

  // Check current user session on application load
  const checkUserSession = async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await safeParseJson(res);
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Session restoration failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      // TEMPORARY - REMOVE BEFORE REAL LAUNCH
      const savedDemoUser = localStorage.getItem('skip_auth_demo_user');
      if (savedDemoUser) {
        try {
          if (isMounted) {
            setUser(JSON.parse(savedDemoUser));
            setLoading(false);
          }
          return;
        } catch (err) {
          console.error('Failed to parse saved demo user:', err);
        }
      }

      try {
        const res = await fetch('/api/me');
        if (res.ok && isMounted) {
          const data = await safeParseJson(res);
          if (data?.user && isMounted) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    verify();
    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch(getApiUrl('/api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        throw new Error(data?.error || 'Login failed. Please check credentials.');
      }

      if (!data || !data.user) {
        throw new Error('Received invalid format from server.');
      }

      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Signup handler
  const signup = async (email, password) => {
    setError(null);
    try {
      const res = await fetch(getApiUrl('/api/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        throw new Error(data?.error || 'Signup failed.');
      }

      await login(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    setError(null);
    try {
      // TEMPORARY - REMOVE BEFORE REAL LAUNCH
      localStorage.removeItem('skip_auth_demo_user');

      const res = await fetch(getApiUrl('/api/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // We still clear session, but check response safety
      await safeParseJson(res);
      if (!res.ok) {
        throw new Error('Logout failed on server.');
      }
    } catch (err) {
      console.error('Server logout error:', err.message);
    } finally {
      // Always clear local auth state regardless of server response success
      setUser(null);
    }
  };

  // TEMPORARY - REMOVE BEFORE REAL LAUNCH
  const skipAuthLogin = () => {
    const dummyUser = {
      id: 9999,
      email: 'demo@test.com',
      name: 'Demo User',
      is_demo: true,
      createdAt: new Date().toISOString()
    };
    setUser(dummyUser);
    localStorage.setItem('skip_auth_demo_user', JSON.stringify(dummyUser));
    return dummyUser;
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
        checkUserSession,
        skipAuthLogin, // TEMPORARY - REMOVE BEFORE REAL LAUNCH
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
