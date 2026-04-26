import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Timer } from '../components/Timer';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { Clock, Plus } from 'lucide-react';
export const WorklogsPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        projectId: '',
        taskId: '',
        date: new Date().toISOString().split('T')[0],
        hours: 0,
        description: '',
        billable: true,
        tags: '',
    });
    const [timerHours, setTimerHours] = useState(0);
    const { data: projectsData } = useQuery({
        queryKey: ['projects'],
        queryFn: () => api.getProjects(),
    });
    const { data: tasksData } = useQuery({
        queryKey: ['tasks', formData.projectId],
        queryFn: () => api.getTasks(1, 100, formData.projectId),
        enabled: !!formData.projectId,
    });
    const { data: worklogsData } = useQuery({
        queryKey: ['my-worklogs'],
        queryFn: () => api.getMyWorkLogs(),
    });
    const createMutation = useMutation({
        mutationFn: (data) => api.createWorkLog(data),
        onSuccess: () => {
            setShowForm(false);
            setFormData({
                projectId: '',
                taskId: '',
                date: new Date().toISOString().split('T')[0],
                hours: 0,
                description: '',
                billable: true,
                tags: '',
            });
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate({
            ...formData,
            hours: formData.hours || timerHours,
            tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
        });
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50 dark:bg-gray-950", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 overflow-auto p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2", children: [_jsx(Clock, { size: 32, className: "text-blue-600" }), "Worklogs"] }), _jsxs("button", { onClick: () => setShowForm(!showForm), className: "btn-primary flex items-center gap-2", children: [_jsx(Plus, { size: 20 }), "New Worklog"] })] }), showForm && (_jsxs("div", { className: "card p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Create Worklog Entry" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Project" }), _jsxs("select", { value: formData.projectId, onChange: (e) => setFormData({ ...formData, projectId: e.target.value }), required: true, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800", children: [_jsx("option", { value: "", children: "Select Project" }), projectsData?.data?.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Task (Optional)" }), _jsxs("select", { value: formData.taskId, onChange: (e) => setFormData({ ...formData, taskId: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800", disabled: !formData.projectId, children: [_jsx("option", { value: "", children: "Select Task" }), tasksData?.data?.map((t) => (_jsx("option", { value: t.id, children: t.title }, t.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Date" }), _jsx("input", { type: "date", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }), required: true, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Hours" }), _jsx("input", { type: "number", value: formData.hours || timerHours.toFixed(2), onChange: (e) => setFormData({ ...formData, hours: parseFloat(e.target.value) }), step: "0.5", min: "0", max: "24", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] })] }), _jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center", children: [_jsx("p", { className: "text-sm font-medium mb-4 text-gray-600", children: "Or use the timer:" }), _jsx(Timer, { onTimeChange: setTimerHours, initialHours: timerHours })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), required: true, rows: 4, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: formData.billable, onChange: (e) => setFormData({ ...formData, billable: e.target.checked }) }), _jsx("span", { children: "Billable" })] }), _jsx("input", { type: "text", placeholder: "Tags (comma-separated)", value: formData.tags, onChange: (e) => setFormData({ ...formData, tags: e.target.value }), className: "flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { type: "button", onClick: () => setShowForm(false), className: "btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-primary", children: "Save Worklog" })] })] })] })), _jsx("div", { className: "card", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Date" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Project" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Task" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Hours" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Description" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800", children: worklogsData?.data?.map((log) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx("td", { className: "px-6 py-4", children: new Date(log.date).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4", children: log.project.name }), _jsx("td", { className: "px-6 py-4", children: log.task?.title || '-' }), _jsxs("td", { className: "px-6 py-4 font-medium", children: [log.hours, "h"] }), _jsx("td", { className: "px-6 py-4 max-w-xs truncate text-gray-600", children: log.description }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-sm font-medium ${log.status === 'APPROVED'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : log.status === 'REJECTED'
                                                                            ? 'bg-red-100 text-red-700'
                                                                            : log.status === 'SUBMITTED'
                                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                                : 'bg-gray-100 text-gray-700'}`, children: log.status }) })] }, log.id))) })] }) }) })] }) })] })] }));
};
