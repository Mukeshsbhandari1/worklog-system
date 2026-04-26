export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'PM' | 'TEAM_MEMBER';
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  client?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  projectMembers: any[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLog {
  id: string;
  userId: string;
  projectId: string;
  taskId?: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
  tags: string[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  timerData?: any;
  createdAt: string;
  updatedAt: string;
  user?: User;
  project?: Project;
  task?: Task;
  approval?: any;
}

export interface Approval {
  id: string;
  worklogId: string;
  reviewedById: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  worklog?: WorkLog;
  reviewedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
