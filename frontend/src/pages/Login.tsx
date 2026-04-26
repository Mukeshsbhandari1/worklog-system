import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store';
import { LogIn, Mail, Lock, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.login(data.email, data.password),
    onSuccess: (response) => {
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      api.setToken(token);
      navigate('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) =>
      api.register(data.email, data.password, data.firstName, data.lastName),
    onSuccess: (response) => {
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      api.setToken(token);
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({ email: formData.email, password: formData.password });
    } else {
      registerMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-600 rounded-lg mb-4">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">WorkLog Pro</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Professional Timesheet Management
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded font-medium transition-colors ${
                isLogin
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded font-medium transition-colors ${
                !isLogin
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg">
                    <User size={20} className="text-gray-400" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="John"
                      className="flex-1 bg-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg">
                    <User size={20} className="text-gray-400" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Doe"
                      className="flex-1 bg-transparent outline-none"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg">
                <Mail size={20} className="text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg">
                <Lock size={20} className="text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending || registerMutation.isPending}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
              <p className="font-medium mb-2">Demo Credentials:</p>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>Admin:</strong> admin@worklog.pro / Admin@123
                </li>
                <li>
                  <strong>PM:</strong> pm1@worklog.pro / PM@123
                </li>
                <li>
                  <strong>Dev:</strong> dev1@worklog.pro / Dev@123
                </li>
              </ul>
            </div>
          )}

          {/* Microsoft Entra ID SSO Section (Future) */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 text-center mb-3">Or continue with</p>
            <button
              type="button"
              className="w-full py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Sign in with Microsoft
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Microsoft Entra ID integration available in production
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>© 2026 WorkLog Pro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
