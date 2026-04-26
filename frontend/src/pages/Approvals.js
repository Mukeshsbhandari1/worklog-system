import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
export const ApprovalsPage = () => {
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [comments, setComments] = useState('');
    const { data: approvalsData, refetch } = useQuery({
        queryKey: ['pending-approvals'],
        queryFn: () => api.getPendingApprovals(),
    });
    const approveMutation = useMutation({
        mutationFn: (id) => api.approveWorkLog(id, comments),
        onSuccess: () => {
            refetch();
            setSelectedApproval(null);
            setComments('');
        },
    });
    const rejectMutation = useMutation({
        mutationFn: (id) => api.rejectWorkLog(id, comments),
        onSuccess: () => {
            refetch();
            setSelectedApproval(null);
            setComments('');
        },
    });
    return (_jsxs("div", { className: "flex h-screen bg-gray-50 dark:bg-gray-950", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 overflow-auto p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8", children: "Worklog Approvals" }), _jsx("div", { className: "card", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-100 dark:bg-gray-800 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left font-medium", children: "User" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Project" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Date" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Hours" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Description" }), _jsx("th", { className: "px-6 py-4 text-left font-medium", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-800", children: approvalsData?.data?.map((approval) => (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsxs("div", { className: "font-medium", children: [approval.worklog.user.firstName, " ", approval.worklog.user.lastName] }), _jsx("div", { className: "text-sm text-gray-500", children: approval.worklog.user.email })] }), _jsx("td", { className: "px-6 py-4", children: approval.worklog.project.name }), _jsx("td", { className: "px-6 py-4", children: new Date(approval.worklog.date).toLocaleDateString() }), _jsxs("td", { className: "px-6 py-4 font-medium", children: [approval.worklog.hours, "h"] }), _jsx("td", { className: "px-6 py-4 max-w-xs truncate text-gray-600", children: approval.worklog.description }), _jsx("td", { className: "px-6 py-4", children: _jsx("button", { onClick: () => setSelectedApproval(approval.id), className: "text-blue-600 hover:underline text-sm", children: "Review" }) })] }, approval.id))) })] }) }) }), selectedApproval && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "card w-full max-w-md", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Review Worklog" }), _jsxs("div", { className: "space-y-4", children: [_jsx("textarea", { value: comments, onChange: (e) => setComments(e.target.value), placeholder: "Add comments (optional)", rows: 4, className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800" }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { onClick: () => setSelectedApproval(null), className: "btn-secondary", children: "Cancel" }), _jsxs("button", { onClick: () => rejectMutation.mutate(selectedApproval), className: "flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: [_jsx(XCircle, { size: 20 }), "Reject"] }), _jsxs("button", { onClick: () => approveMutation.mutate(selectedApproval), className: "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", children: [_jsx(CheckCircle, { size: 20 }), "Approve"] })] })] })] }) }))] }) })] })] }));
};
