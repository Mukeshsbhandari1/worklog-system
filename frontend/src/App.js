import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useAuthStore } from './store';
import { useEffect } from 'react';
// Pages
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { WorklogsPage } from './pages/Worklogs';
import { ApprovalsPage } from './pages/Approvals';
import { ReportsPage } from './pages/Reports';
import { UsersPage } from './pages/Users';
import { ProjectsPage } from './pages/Projects';
import './styles/index.css';
const queryClient = new QueryClient();
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login" });
};
export default function App() {
    const { load } = useAuthStore();
    useEffect(() => {
        load();
    }, [load]);
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/worklogs", element: _jsx(ProtectedRoute, { children: _jsx(WorklogsPage, {}) }) }), _jsx(Route, { path: "/approvals", element: _jsx(ProtectedRoute, { children: _jsx(ApprovalsPage, {}) }) }), _jsx(Route, { path: "/reports", element: _jsx(ProtectedRoute, { children: _jsx(ReportsPage, {}) }) }), _jsx(Route, { path: "/users", element: _jsx(ProtectedRoute, { children: _jsx(UsersPage, {}) }) }), _jsx(Route, { path: "/projects", element: _jsx(ProtectedRoute, { children: _jsx(ProjectsPage, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard" }) })] }) }) }));
}
