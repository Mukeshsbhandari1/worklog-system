import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useAuthStore, useUIStore } from '../store';
import { useNavigate } from 'react-router-dom';
export const Header = () => {
    const { user, logout } = useAuthStore();
    const { toggleSidebar, toggleDarkMode, darkMode } = useUIStore();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (_jsxs("header", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between", children: [_jsx("button", { onClick: toggleSidebar, className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mr-4", children: _jsx(Menu, { size: 20 }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: toggleDarkMode, className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg", children: darkMode ? _jsx(Sun, { size: 20 }) : _jsx(Moon, { size: 20 }) }), _jsxs("div", { className: "flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800", children: [_jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium text-sm", children: [user?.firstName, " ", user?.lastName] }), _jsx("p", { className: "text-xs text-gray-500 uppercase", children: user?.role })] }), _jsx("button", { onClick: handleLogout, className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg", children: _jsx(LogOut, { size: 20 }) })] })] })] }));
};
