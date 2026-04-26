import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store';
import { LogIn, Mail, Lock, User } from 'lucide-react';
export const LoginPage = () => {
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
        mutationFn: (data) => api.login(data.email, data.password),
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
        mutationFn: (data) => api.register(data.email, data.password, data.firstName, data.lastName),
        onSuccess: (response) => {
            const { token, user } = response.data;
            setToken(token);
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            api.setToken(token);
            navigate('/dashboard');
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            loginMutation.mutate({ email: formData.email, password: formData.password });
        }
        else {
            registerMutation.mutate(formData);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-block p-3 bg-blue-600 rounded-lg mb-4", children: _jsx(LogIn, { size: 32, className: "text-white" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-50", children: "WorkLog Pro" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: "Professional Timesheet Management" })] }), _jsxs("div", { className: "card p-8", children: [_jsxs("div", { className: "flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1", children: [_jsx("button", { onClick: () => setIsLogin(true), className: `flex-1 py-2 rounded font-medium transition-colors ${isLogin
                                        ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400'}`, children: "Sign In" }), _jsx("button", { onClick: () => setIsLogin(false), className: `flex-1 py-2 rounded font-medium transition-colors ${!isLogin
                                        ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400'}`, children: "Sign Up" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [!isLogin && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "First Name" }), _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg", children: [_jsx(User, { size: 20, className: "text-gray-400" }), _jsx("input", { type: "text", value: formData.firstName, onChange: (e) => setFormData({ ...formData, firstName: e.target.value }), placeholder: "John", className: "flex-1 bg-transparent outline-none", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Last Name" }), _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg", children: [_jsx(User, { size: 20, className: "text-gray-400" }), _jsx("input", { type: "text", value: formData.lastName, onChange: (e) => setFormData({ ...formData, lastName: e.target.value }), placeholder: "Doe", className: "flex-1 bg-transparent outline-none", required: true })] })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Email" }), _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg", children: [_jsx(Mail, { size: 20, className: "text-gray-400" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "you@example.com", className: "flex-1 bg-transparent outline-none", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Password" }), _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg", children: [_jsx(Lock, { size: 20, className: "text-gray-400" }), _jsx("input", { type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "flex-1 bg-transparent outline-none", required: true })] })] }), _jsx("button", { type: "submit", disabled: loginMutation.isPending || registerMutation.isPending, className: "w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50", children: isLogin ? 'Sign In' : 'Create Account' })] }), isLogin && (_jsxs("div", { className: "mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm", children: [_jsx("p", { className: "font-medium mb-2", children: "Demo Credentials:" }), _jsxs("ul", { className: "space-y-1 text-gray-700 dark:text-gray-300", children: [_jsxs("li", { children: [_jsx("strong", { children: "Admin:" }), " admin@worklog.pro / Admin@123"] }), _jsxs("li", { children: [_jsx("strong", { children: "PM:" }), " pm1@worklog.pro / PM@123"] }), _jsxs("li", { children: [_jsx("strong", { children: "Dev:" }), " dev1@worklog.pro / Dev@123"] })] })] })), _jsxs("div", { className: "mt-6 pt-6 border-t border-gray-200 dark:border-gray-800", children: [_jsx("p", { className: "text-xs text-gray-500 text-center mb-3", children: "Or continue with" }), _jsx("button", { type: "button", className: "w-full py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors", children: "Sign in with Microsoft" }), _jsx("p", { className: "text-xs text-gray-500 text-center mt-2", children: "Microsoft Entra ID integration available in production" })] })] }), _jsx("div", { className: "text-center mt-6 text-sm text-gray-600 dark:text-gray-400", children: _jsx("p", { children: "\u00A9 2026 WorkLog Pro. All rights reserved." }) })] }) }));
};
