import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.token = localStorage.getItem('token');
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth endpoints
  login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }

  register(email: string, password: string, firstName: string, lastName: string) {
    return this.client.post('/auth/register', { email, password, firstName, lastName });
  }

  getMe() {
    return this.client.get('/auth/me');
  }

  // Users endpoints
  getUsers(page = 1, limit = 20, role?: string) {
    return this.client.get('/users', { params: { page, limit, role } });
  }

  createUser(data: any) {
    return this.client.post('/users', data);
  }

  updateUser(id: string, data: any) {
    return this.client.patch(`/users/${id}`, data);
  }

  getUserStats(id: string) {
    return this.client.get(`/users/${id}/stats`);
  }

  // Projects endpoints
  getProjects(page = 1, limit = 20, status?: string) {
    return this.client.get('/projects', { params: { page, limit, status } });
  }

  createProject(data: any) {
    return this.client.post('/projects', data);
  }

  getProject(id: string) {
    return this.client.get(`/projects/${id}`);
  }

  updateProject(id: string, data: any) {
    return this.client.patch(`/projects/${id}`, data);
  }

  addProjectMember(projectId: string, userId: string, role: string) {
    return this.client.post(`/projects/${projectId}/members`, { userId, role });
  }

  removeProjectMember(projectId: string, memberId: string) {
    return this.client.delete(`/projects/${projectId}/members/${memberId}`);
  }

  // Tasks endpoints
  getTasks(page = 1, limit = 20, projectId?: string, status?: string) {
    return this.client.get('/tasks', { params: { page, limit, projectId, status } });
  }

  createTask(data: any) {
    return this.client.post('/tasks', data);
  }

  updateTask(id: string, data: any) {
    return this.client.patch(`/tasks/${id}`, data);
  }

  deleteTask(id: string) {
    return this.client.delete(`/tasks/${id}`);
  }

  // WorkLogs endpoints
  getWorkLogs(page = 1, limit = 20, filters?: any) {
    return this.client.get('/worklogs', { params: { page, limit, ...filters } });
  }

  createWorkLog(data: any) {
    return this.client.post('/worklogs', data);
  }

  getWorkLog(id: string) {
    return this.client.get(`/worklogs/${id}`);
  }

  updateWorkLog(id: string, data: any) {
    return this.client.patch(`/worklogs/${id}`, data);
  }

  deleteWorkLog(id: string) {
    return this.client.delete(`/worklogs/${id}`);
  }

  submitWorkLog(id: string) {
    return this.client.post(`/worklogs/${id}/submit`, {});
  }

  getMyWorkLogs(page = 1, limit = 20, startDate?: string, endDate?: string) {
    return this.client.get('/worklogs/my/list', { params: { page, limit, startDate, endDate } });
  }

  // Approvals endpoints
  getPendingApprovals(page = 1, limit = 20) {
    return this.client.get('/approvals', { params: { page, limit } });
  }

  approveWorkLog(id: string, comments?: string) {
    return this.client.post(`/approvals/${id}/approve`, { comments });
  }

  rejectWorkLog(id: string, comments?: string) {
    return this.client.post(`/approvals/${id}/reject`, { comments });
  }

  getApprovalsByUser(userId: string, status?: string, page = 1, limit = 20) {
    return this.client.get(`/approvals/user/${userId}`, { params: { status, page, limit } });
  }

  // Reports endpoints
  getAdvancedReport(filters: any) {
    return this.client.get('/reports/advanced', { params: filters });
  }

  getUserReport(userId: string, startDate?: string, endDate?: string) {
    return this.client.get(`/reports/user/${userId}`, { params: { startDate, endDate } });
  }

  getProjectReport(projectId: string, startDate?: string, endDate?: string) {
    return this.client.get(`/reports/project/${projectId}`, { params: { startDate, endDate } });
  }

  getDashboardStats() {
    return this.client.get('/reports/dashboard/stats');
  }
}

export default new ApiClient();
