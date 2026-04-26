import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Clock, FileText, Users, Settings, Calendar, CheckCircle, ChevronRight, } from 'lucide-react';
import { useAuthStore, useUIStore } from '../store';
const NAV_ITEMS = {
    all: [
        { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { label: 'Worklogs', href: '/worklogs', icon: Clock },
    ],
    TEAM_MEMBER: [
        { label: 'My Worklogs', href: '/worklogs', icon: FileText },
    ],
    PM: [
        { label: 'Approvals', href: '/approvals', icon: CheckCircle },
        { label: 'Reports', href: '/reports', icon: BarChart3 },
    ],
    ADMIN: [
        { label: 'Users', href: '/users', icon: Users },
        { label: 'Projects', href: '/projects', icon: Calendar },
        { label: 'Reports', href: '/reports', icon: BarChart3 },
        { label: 'Settings', href: '/settings', icon: Settings },
    ],
};
export const Sidebar = () => {
    const { user } = useAuthStore();
    const { sidebarOpen } = useUIStore();
    const location = useLocation();
    const allItems = [
        ...NAV_ITEMS.all,
        ...(NAV_ITEMS[user?.role] || []),
    ];
    const isActive = (href) => location.pathname.startsWith(href);
    if (!sidebarOpen)
        return null;
    return (_jsxs("aside", { className: "w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col h-[calc(100vh-80px)] overflow-y-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-blue-600", children: "WorkLog Pro" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Timesheet Management" })] }), _jsx("nav", { className: "space-y-1 flex-1", children: allItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (_jsxs(Link, { to: item.href, className: `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${active
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`, children: [_jsx(Icon, { size: 20 }), item.label, active && _jsx(ChevronRight, { size: 16, className: "ml-auto" })] }, item.href));
                }) }), _jsxs("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500", children: [_jsx("p", { children: "\u00A9 2026 WorkLog Pro" }), _jsx("p", { children: "v1.0.0" })] })] }));
};
