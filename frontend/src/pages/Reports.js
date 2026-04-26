import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { BarChart3, Filter, Download } from 'lucide-react';
import ECharts from 'echarts-for-react';
export const ReportsPage = () => {
    const [filters, setFilters] = useState({
        projectIds: [],
        userIds: [],
        startDate: '',
        endDate: '',
        billableOnly: false,
    });
    const { data: reportsData } = useQuery({
        queryKey: ['advanced-report', filters],
        queryFn: () => api.getAdvancedReport(filters),
    });
    const { data: projectsData } = useQuery({
        queryKey: ['projects'],
        queryFn: () => api.getProjects(1, 100),
    });
    const { data: usersData } = useQuery({
        queryKey: ['users'],
        queryFn: () => api.getUsers(1, 100),
    });
    // 3D Bar Chart - Hours by User
    const userChartOption = {
        title: { text: 'Hours by User', left: 'center' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['Billable', 'Non-Billable'], bottom: 0 },
        grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
        xAxis: {
            type: 'category',
            data: reportsData?.data?.byUser?.map((u) => u.userName.split(' ')[0]),
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: 'Billable',
                type: 'bar',
                data: reportsData?.data?.byUser?.map((u) => u.billableHours),
                itemStyle: { color: '#10b981' },
            },
            {
                name: 'Non-Billable',
                type: 'bar',
                data: reportsData?.data?.byUser?.map((u) => u.nonBillableHours),
                itemStyle: { color: '#f59e0b' },
            },
        ],
    };
    // 3D Pie Chart - Project Distribution
    const projectChartOption = {
        title: { text: 'Hours by Project', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [
            {
                type: 'pie',
                radius: ['25%', '75%'],
                data: reportsData?.data?.byProject?.map((p) => ({
                    value: p.totalHours,
                    name: p.projectName,
                })),
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                emphasis: {
                    itemStyle: { shadowBlur: 10 },
                },
            },
        ],
    };
    // Line Chart - Hours Trend
    const trendOption = {
        title: { text: 'Hours Trend', left: 'center' },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
        yAxis: { type: 'value' },
        series: [
            {
                name: 'Total Hours',
                type: 'line',
                data: [32, 38, 35, 42],
                smooth: true,
                areaStyle: {
                    color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
                        { offset: 1, color: 'rgba(59, 130, 246, 0)' },
                    ]),
                },
                lineStyle: { color: '#3b82f6', width: 3 },
                itemStyle: { color: '#3b82f6' },
            },
        ],
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50 dark:bg-gray-950", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 overflow-auto p-8", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2", children: [_jsx(BarChart3, { size: 32, className: "text-blue-600" }), "Advanced Reports"] }), _jsxs("button", { className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: [_jsx(Download, { size: 20 }), "Export"] })] }), _jsxs("div", { className: "card p-6 mb-8", children: [_jsxs("h2", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [_jsx(Filter, { size: 24 }), "Filters"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Projects" }), _jsx("select", { multiple: true, value: filters.projectIds, onChange: (e) => setFilters({
                                                                ...filters,
                                                                projectIds: Array.from(e.target.selectedOptions, (o) => o.value),
                                                            }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800", children: projectsData?.data?.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Users" }), _jsx("select", { multiple: true, value: filters.userIds, onChange: (e) => setFilters({
                                                                ...filters,
                                                                userIds: Array.from(e.target.selectedOptions, (o) => o.value),
                                                            }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800", children: usersData?.data?.map((u) => (_jsxs("option", { value: u.id, children: [u.firstName, " ", u.lastName] }, u.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Start Date" }), _jsx("input", { type: "date", value: filters.startDate, onChange: (e) => setFilters({ ...filters, startDate: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "End Date" }), _jsx("input", { type: "date", value: filters.endDate, onChange: (e) => setFilters({ ...filters, endDate: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] })] }), _jsx("div", { className: "mt-4 flex items-end gap-2", children: _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: filters.billableOnly, onChange: (e) => setFilters({ ...filters, billableOnly: e.target.checked }) }), _jsx("span", { className: "text-sm font-medium", children: "Billable Hours Only" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "card p-6 text-center", children: [_jsx("div", { className: "text-3xl font-bold text-blue-600", children: reportsData?.data?.summary?.totalHours?.toFixed(1) || 0 }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-2", children: "Total Hours" })] }), _jsxs("div", { className: "card p-6 text-center", children: [_jsx("div", { className: "text-3xl font-bold text-green-600", children: reportsData?.data?.summary?.billableHours?.toFixed(1) || 0 }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-2", children: "Billable Hours" })] }), _jsxs("div", { className: "card p-6 text-center", children: [_jsx("div", { className: "text-3xl font-bold text-orange-600", children: reportsData?.data?.summary?.nonBillableHours?.toFixed(1) || 0 }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-2", children: "Non-Billable" })] }), _jsxs("div", { className: "card p-6 text-center", children: [_jsx("div", { className: "text-3xl font-bold text-purple-600", children: reportsData?.data?.summary?.logCount || 0 }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-2", children: "Log Entries" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8", children: [_jsx("div", { className: "card p-6", children: _jsx(ECharts, { option: userChartOption, style: { height: '400px' } }) }), _jsx("div", { className: "card p-6", children: _jsx(ECharts, { option: projectChartOption, style: { height: '400px' } }) })] }), _jsx("div", { className: "card p-6 mb-8", children: _jsx(ECharts, { option: trendOption, style: { height: '350px' } }) }), _jsxs("div", { className: "card", children: [_jsx("div", { className: "p-6 border-b border-gray-200 dark:border-gray-800", children: _jsx("h2", { className: "text-lg font-bold", children: "Detailed Breakdown" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-100 dark:bg-gray-800 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Date" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "User" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Project" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Hours" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Billable" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Description" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800", children: reportsData?.data?.logs?.slice(0, 10).map((log) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx("td", { className: "px-6 py-4 text-sm", children: new Date(log.date).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4", children: [log.user.firstName, " ", log.user.lastName] }), _jsx("td", { className: "px-6 py-4", children: log.project.name }), _jsxs("td", { className: "px-6 py-4 font-medium", children: [log.hours, "h"] }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: log.billable ? 'text-green-600' : 'text-gray-600', children: log.billable ? 'Yes' : 'No' }) }), _jsx("td", { className: "px-6 py-4 max-w-xs truncate text-gray-600", children: log.description })] }, log.id))) })] }) })] })] }) })] })] }));
};
