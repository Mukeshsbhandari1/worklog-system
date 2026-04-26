import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
class ApiClient {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.token = localStorage.getItem('token');
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.client.interceptors.request.use((config) => {
            if (this.token) {
                config.headers.Authorization = `Bearer ${this.token}`;
            }
            return config;
        });
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        });
    }
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }
    // Auth endpoints
    login(email, password) {
        return this.client.post('/auth/login', { email, password });
    }
    register(email, password, firstName, lastName) {
        return this.client.post('/auth/register', { email, password, firstName, lastName });
    }
    getMe() {
        return this.client.get('/auth/me');
    }
    // Users endpoints
    getUsers(page = 1, limit = 20, role) {
        return this.client.get('/users', { params: { page, limit, role } });
    }
    createUser(data) {
        return this.client.post('/users', data);
    }
    updateUser(id, data) {
        return this.client.patch(`/users/${id}`, data);
    }
    getUserStats(id) {
        return this.client.get(`/users/${id}/stats`);
    }
    // Projects endpoints
    getProjects(page = 1, limit = 20, status) {
        return this.client.get('/projects', { params: { page, limit, status } });
    }
    createProject(data) {
        return this.client.post('/projects', data);
    }
    getProject(id) {
        return this.client.get(`/projects/${id}`);
    }
    updateProject(id, data) {
        return this.client.patch(`/projects/${id}`, data);
    }
    addProjectMember(projectId, userId, role) {
        return this.client.post(`/projects/${projectId}/members`, { userId, role });
    }
    removeProjectMember(projectId, memberId) {
        return this.client.delete(`/projects/${projectId}/members/${memberId}`);
    }
    // Tasks endpoints
    getTasks(page = 1, limit = 20, projectId, status) {
        return this.client.get('/tasks', { params: { page, limit, projectId, status } });
    }
    createTask(data) {
        return this.client.post('/tasks', data);
    }
    updateTask(id, data) {
        return this.client.patch(`/tasks/${id}`, data);
    }
    deleteTask(id) {
        return this.client.delete(`/tasks/${id}`);
    }
    // WorkLogs endpoints
    getWorkLogs(page = 1, limit = 20, filters) {
        return this.client.get('/worklogs', { params: { page, limit, ...filters } });
    }
    createWorkLog(data) {
        return this.client.post('/worklogs', data);
    }
    getWorkLog(id) {
        return this.client.get(`/worklogs/${id}`);
    }
    updateWorkLog(id, data) {
        return this.client.patch(`/worklogs/${id}`, data);
    }
    deleteWorkLog(id) {
        return this.client.delete(`/worklogs/${id}`);
    }
    submitWorkLog(id) {
        return this.client.post(`/worklogs/${id}/submit`, {});
    }
    getMyWorkLogs(page = 1, limit = 20, startDate, endDate) {
        return this.client.get('/worklogs/my/list', { params: { page, limit, startDate, endDate } });
    }
    // Approvals endpoints
    getPendingApprovals(page = 1, limit = 20) {
        return this.client.get('/approvals', { params: { page, limit } });
    }
    approveWorkLog(id, comments) {
        return this.client.post(`/approvals/${id}/approve`, { comments });
    }
    rejectWorkLog(id, comments) {
        return this.client.post(`/approvals/${id}/reject`, { comments });
    }
    getApprovalsByUser(userId, status, page = 1, limit = 20) {
        return this.client.get(`/approvals/user/${userId}`, { params: { status, page, limit } });
    }
    // Reports endpoints
    getAdvancedReport(filters) {
        return this.client.get('/reports/advanced', { params: filters });
    }
    getUserReport(userId, startDate, endDate) {
        return this.client.get(`/reports/user/${userId}`, { params: { startDate, endDate } });
    }
    getProjectReport(projectId, startDate, endDate) {
        return this.client.get(`/reports/project/${projectId}`, { params: { startDate, endDate } });
    }
    getDashboardStats() {
        return this.client.get('/reports/dashboard/stats');
    }
}
export default new ApiClient();
