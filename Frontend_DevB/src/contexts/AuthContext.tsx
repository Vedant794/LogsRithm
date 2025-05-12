
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  accessToken: string | null;
  ownerName: string | null;
  login: (token: string, owner: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  ownerName: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [ownerName, setOwnerName] = useState<string | null>(localStorage.getItem('ownerName'));
  const navigate = useNavigate();
  const location = useLocation();

  // Check for access token and owner name in URL params when on dashboard page
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      const params = new URLSearchParams(location.search);
      const token = params.get('accessToken');
      const owner = params.get('ownerName');

      if (token && owner) {
        login(token, owner);
        // Clear URL params to avoid exposing token
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location]);

  const login = (token: string, owner: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('ownerName', owner);
    setAccessToken(token);
    setOwnerName(owner);
    toast.success('Successfully authenticated with GitHub');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('ownerName');
    setAccessToken(null);
    setOwnerName(null);
    navigate('/');
    toast.info('Logged out successfully');
  };

  const value = {
    accessToken,
    ownerName,
    login,
    logout,
    isAuthenticated: !!accessToken && !!ownerName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
