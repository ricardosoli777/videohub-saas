import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Video, User, Settings, LogOut, Shield } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">VideoHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-gray-300">
              <div className="bg-white/10 p-2 rounded-full">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                <Settings className="h-4 w-4 text-gray-300" />
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}