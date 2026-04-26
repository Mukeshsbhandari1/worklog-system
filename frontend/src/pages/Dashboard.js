import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Dashboard } from '../components/StatCard';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Activity, Zap } from 'lucide-react';
import ECharts from 'echarts-for-react';
export const DashboardPage = () => {
    const { data: statsData } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => api.getDashboardStats(),
    });
    const stats = statsData?.data;
    // Chart data for 3D visualization
    const chartOption = {
        title: {
            text: 'Weekly Hours Distribution',
            left: 'center',
            textStyle: { color: '#333', fontSize: 16, fontWeight: 'bold' },
        },
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.9)' },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLine: { lineStyle: { color: '#ddd' } },
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#ddd' } },
        },
        series: [
            {
                name: 'Hours',
                type: 'bar',
                data: [8, 8, 7, 8, 9, 4, 2],
                itemStyle: {
                    color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.5, color: '#188df0' },
                        { offset: 1, color: '#188df0' },
                    ]),
                },
                smooth: true,
            },
        ],
    };
    const pieOption = {
        title: {
            text: 'Project Distribution',
            left: 'center',
            textStyle: { color: '#333', fontSize: 14, fontWeight: 'bold' },
        },
        tooltip: { trigger: 'item' },
        series: [
            {
                name: 'Hours',
                type: 'pie',
                radius: ['30%', '70%'],
                data: [
                    { value: 24, name: 'Website Redesign' },
                    { value: 18, name: 'Mobile App' },
                    { value: 8, name: 'Data Migration' },
                ],
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: { show: false },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50 dark:bg-gray-950", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 overflow-auto p-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2", children: [_jsx(Zap, { size: 32, className: "text-blue-600" }), "Dashboard"] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: "Welcome back! Here's your work summary." })] }), _jsx(Dashboard, { stats: stats }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8", children: [_jsx("div", { className: "card p-6", children: _jsx(ECharts, { option: chartOption, style: { height: '300px' } }) }), _jsx("div", { className: "card p-6", children: _jsx(ECharts, { option: pieOption, style: { height: '300px' } }) })] }), _jsxs("div", { className: "card p-6 mt-8", children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [_jsx(Activity, { size: 24 }), "Recent Activity"] }), _jsx("div", { className: "space-y-3", children: stats?.recentLogs?.map((log) => (_jsxs("div", { className: "flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-0", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: log.project.name }), _jsx("p", { className: "text-sm text-gray-500", children: log.description })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium", children: [log.hours, "h"] }), _jsx("p", { className: `text-xs ${log.status === 'APPROVED'
                                                                    ? 'text-green-600'
                                                                    : log.status === 'REJECTED'
                                                                        ? 'text-red-600'
                                                                        : 'text-yellow-600'}`, children: log.status })] })] }, log.id))) })] })] }) })] })] }));
};
