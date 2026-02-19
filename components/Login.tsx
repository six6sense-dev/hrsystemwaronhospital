import React, { useState } from 'react';
import { Lock, User, ArrowRight, Activity, AlertCircle } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API delay
    setTimeout(() => {
      // Basic mock authentication logic
      const user = MOCK_USERS.find(u => u.username === username);
      
      // Simple mock password check: password must equal username
      if (user && password === username) { 
        onLogin(user);
      } else {
        setError('Username atau password salah');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="bg-orange-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          
          <div className="relative z-10 flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner">
              <Activity className="text-white w-10 h-10" />
            </div>
          </div>
          <h1 className="relative z-10 text-2xl font-bold text-white tracking-wide">WARON HOSPITAL</h1>
          <p className="relative z-10 text-orange-100 text-sm mt-1">Human Resource Management System</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-zinc-800 mb-6 text-center">Login Portal</h2>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg text-zinc-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 rounded-lg text-zinc-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Masuk ke Sistem <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-zinc-400">
            <p>Demo Credentials:</p>
            <div className="flex justify-center gap-4 mt-2">
                <div className="text-left">
                    <p className="font-semibold text-zinc-600">Admin</p>
                    <p>User: <strong>admin</strong></p>
                    <p>Pass: <strong>admin</strong></p>
                </div>
                <div className="w-px bg-zinc-200"></div>
                <div className="text-left">
                    <p className="font-semibold text-zinc-600">Staff</p>
                    <p>User: <strong>staff</strong></p>
                    <p>Pass: <strong>staff</strong></p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;