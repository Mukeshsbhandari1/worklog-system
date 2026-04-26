import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';
export const StatCard = ({ label, value, change, icon, trend, }) => {
    return (_jsxs("div", { className: "card p-6 flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("div", { className: "text-gray-500 dark:text-gray-400", children: icon }), trend && (_jsx("span", { className: `text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`, children: change }))] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: label }), _jsx("p", { className: "text-3xl font-bold text-gray-900 dark:text-gray-50", children: value })] }));
};
export const Dashboard = ({ stats }) => {
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(StatCard, { label: "Today's Hours", value: stats?.todayHours?.toFixed(2) || '0.00', icon: _jsx(Clock, { size: 24 }), change: `${stats?.todayHours > 8 ? '+' : ''}${stats?.todayHours - 8}`, trend: stats?.todayHours >= 8 ? 'up' : 'down' }), _jsx(StatCard, { label: "This Week", value: stats?.weekHours?.toFixed(2) || '0.00', icon: _jsx(TrendingUp, { size: 24 }), change: "+5.2h", trend: "up" }), _jsx(StatCard, { label: "Pending Approvals", value: stats?.pendingApprovals || 0, icon: _jsx(AlertCircle, { size: 24 }) }), _jsx(StatCard, { label: "Project Allocation", value: "85%", icon: _jsx(Users, { size: 24 }), change: "+12%", trend: "up" })] }));
};
