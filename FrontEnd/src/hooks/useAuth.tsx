'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'individual' | 'therapy_client' | 'therapist';
  isEmailVerified: boolean;
  isPremium: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'individual' | 'therapy_client' | 'therapist';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL}/api`;
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const safeJson = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await safeJson(response);
      if (response.ok && userData) {
        setUser(userData);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await safeJson(response);
    if (!response.ok || !data) {
      throw new Error(data?.message || 'Login failed');
    }

    localStorage.setItem('authToken', data.token);
    setUser(data.user);
  };

  const register = async (userData: RegisterData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await safeJson(response);
    if (!response.ok || !data) {
      throw new Error(data?.message || 'Registration failed');
    }

    localStorage.setItem('authToken', data.token);
    setUser(data.user);
  };

  const logout = async () => {
        const token = localStorage.getItem('authToken');
        const sessionId = localStorage.getItem('sessionId');
        const isViewingPastSession = localStorage.getItem('isViewingPastSession') === 'true';
        console.log('Logging out user:', user?.email, 'Session ID:', sessionId , 'Is Viewing Past Session:', isViewingPastSession);

        // Try saving last session on the server before clearing local data
        if (token && sessionId) {
            try {
                await fetch(`${API_BASE}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ sessionId , isViewingPastSession }),
                });
                // We don't need to parse response here - best-effort only
            } catch (err) {
                console.error('Failed to save last session on logout:', err);
                // proceed anyway - don't block logout if saving fails
            }
        }
        localStorage.clear();
        setUser(null);
        navigate('/auth');
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isPremium: user?.isPremium ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
