import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { Users as UsersIcon, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
export const UsersPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'TEAM_MEMBER',
    });
    const { data: usersData, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: () => api.getUsers(),
    });
    const createMutation = useMutation({
        mutationFn: (data) => api.createUser(data),
        onSuccess: () => {
            refetch();
            setShowForm(false);
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                role: 'TEAM_MEMBER',
            });
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50 dark:bg-gray-950", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 overflow-auto p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2", children: [_jsx(UsersIcon, { size: 32, className: "text-blue-600" }), "User Management"] }), _jsxs("button", { onClick: () => setShowForm(!showForm), className: "btn-primary flex items-center gap-2", children: [_jsx(Plus, { size: 20 }), "Add User"] })] }), showForm && (_jsxs("div", { className: "card p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Create New User" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "First Name" }), _jsx("input", { type: "text", value: formData.firstName, onChange: (e) => setFormData({ ...formData, firstName: e.target.value }), required: true, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Last Name" }), _jsx("input", { type: "text", value: formData.lastName, onChange: (e) => setFormData({ ...formData, lastName: e.target.value }), required: true, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Email" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Password" }), _jsx("input", { type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), required: true, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Role" }), _jsxs("select", { value: formData.role, onChange: (e) => setFormData({ ...formData, role: e.target.value }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800", children: [_jsx("option", { value: "ADMIN", children: "Admin" }), _jsx("option", { value: "PM", children: "Project Manager" }), _jsx("option", { value: "TEAM_MEMBER", children: "Team Member" })] })] })] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { type: "button", onClick: () => setShowForm(false), className: "btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-primary", children: "Create User" })] })] })] })), _jsx("div", { className: "card", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-100 dark:bg-gray-800 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Name" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Email" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Role" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800", children: usersData?.data?.map((user) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsxs("td", { className: "px-6 py-4 font-medium", children: [user.firstName, " ", user.lastName] }), _jsx("td", { className: "px-6 py-4", children: user.email }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-sm font-medium ${user.role === 'ADMIN'
                                                                        ? 'bg-red-100 text-red-700'
                                                                        : user.role === 'PM'
                                                                            ? 'bg-blue-100 text-blue-700'
                                                                            : 'bg-green-100 text-green-700'}`, children: user.role }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-sm ${user.isActive
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-gray-100 text-gray-700'}`, children: user.isActive ? 'Active' : 'Inactive' }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("button", { className: "text-red-600 hover:text-red-700", children: _jsx(Trash2, { size: 18 }) }) })] }, user.id))) })] }) }) })] }) })] })] }));
};
