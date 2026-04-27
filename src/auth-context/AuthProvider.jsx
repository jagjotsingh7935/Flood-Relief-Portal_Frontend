import { createContext, useContext, useState, useEffect } from 'react';
import api from '../API.JSX';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenaccess, setTokenAccess] = useState();
  const [userok, setUserok] = useState(localStorage.getItem('userok') || '');
  
 


  useEffect(() => {
    localStorage.setItem('userok', userok);
}, [userok]);
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('access');
        if (token) {
          await api.post('/api/token/verify/', { token });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Login credentials:',credentials);
      const response = await api.post('/api/token/', credentials);
      console.log('Login response:', response.data)
      setUserok(credentials.username)
      console.log(userok);
      
      
      const { access, refresh } = response.data;
      setIsAuthenticated(true);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('userok', credentials.username);
      setTokenAccess(access);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
  
      setIsAuthenticated(false);
      setUser(null);

      localStorage.clear();
      
     
      
      
  
  };

  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/refresh-token', {
        refreshToken: { refresh: localStorage.getItem('refresh') },
      });
      console.log(response.data);

      const newAccessToken = response.data.accessToken;
      localStorage.setItem('access', newAccessToken);
      setTokenAccess(newAccessToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshAccessToken, isLoading, tokenaccess,userok }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
