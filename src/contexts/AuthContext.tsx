import React, { createContext, useContext, useState } from 'react';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('https://plumeriaretreatback-production.up.railway.app/admin/users');
      const users = await response.json();

      const matchedUser = users.find((u: any) => u.email === email);
      console.log(
        'Matched user:', matchedUser, 'for email:', email, 'with password:', password
      )
      if (!matchedUser) {
        setIsLoading(false);
        return false;
      }

      const isPasswordMatch = await bcrypt.compare(password, matchedUser.password);
      console.log('Password match:', isPasswordMatch, 'for user:', matchedUser.email);
      if (!isPasswordMatch) {
        setIsLoading(false);
        return false;
      }

      const authUser: User = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
      };

      setUser(authUser);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
