import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { Calendar, Plus } from 'lucide-react';
import { useState } from 'react';
export const ProjectsPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        client: '',
        budget: '',
        startDate: '',
        endDate: '',
    });
    const { data: projectsData, refetch } = useQuery({
        queryKey: ['projects'],
        queryFn: () => api.getProjects(1, 100),
    });
    const createMutation = useMutation({
        mutationFn: (data) => api.createProject(data),
        onSuccess: () => {
            refetch();
            setShowForm(false);
            setFormData({
                name: '',
                description: '',
                client: '',
                budget: '',
                startDate: '',
                endDate: '',
            });
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate({
            ...formData,
            budget: formData.budget ? parseFloat(formData.budget) : undefined,
        });
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50 dark:bg-gray-950", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 overflow-auto p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2", children: [_jsx(Calendar, { size: 32, className: "text-blue-600" }), "Projects"] }), _jsxs("button", { onClick: () => setShowForm(!showForm), className: "btn-primary flex items-center gap-2", children: [_jsx(Plus, { size: 20 }), "New Project"] })] }), showForm && (_jsxs("div", { className: "card p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Create Project" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Project Name" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Client" }), _jsx("input", { type: "text", value: formData.client, onChange: (e) => setFormData({ ...formData, client: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Start Date" }), _jsx("input", { type: "date", value: formData.startDate, onChange: (e) => setFormData({ ...formData, startDate: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "End Date" }), _jsx("input", { type: "date", value: formData.endDate, onChange: (e) => setFormData({ ...formData, endDate: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Budget" }), _jsx("input", { type: "number", value: formData.budget, onChange: (e) => setFormData({ ...formData, budget: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), rows: 3, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { type: "button", onClick: () => setShowForm(false), className: "btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-primary", children: "Create Project" })] })] })] })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: projectsData?.data?.map((project) => (_jsxs("div", { className: "card p-6", children: [_jsx("h3", { className: "text-lg font-bold mb-2", children: project.name }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm mb-4", children: project.description }), _jsxs("div", { className: "space-y-2 text-sm", children: [project.client && (_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Client:" }), " ", project.client] })), project.budget && (_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Budget:" }), " $", project.budget.toLocaleString()] })), _jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Status:" }), ' ', _jsx("span", { className: "inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs", children: project.status })] }), _jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Members:" }), " ", project.projectMembers.length] })] })] }, project.id))) })] }) })] })] }));
};
