import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial do usuário
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulação de autenticação
    // Em produção, isso seria substituído pela integração com Supabase
    
    // Credenciais admin configuráveis via variáveis de ambiente
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      const adminUser: User = {
        id: '1',
        email: adminEmail,
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
    } else if (email === 'user@example.com' && password === 'user123') {
      const memberUser: User = {
        id: '2',
        email: 'user@example.com',
        role: 'member',
        created_at: new Date().toISOString(),
      };
      setUser(memberUser);
      localStorage.setItem('user', JSON.stringify(memberUser));
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const register = async (email: string, password: string) => {
    // Simulação de registro
    const newUser: User = {
      id: Date.now().toString(),
      email,
      role: 'member',
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}