import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Timer } from '../components/Timer';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { Clock, Plus } from 'lucide-react';

export const WorklogsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    taskId: '',
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    description: '',
    billable: true,
    tags: '' as any,
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
    mutationFn: (data: any) => api.createWorkLog(data),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      hours: formData.hours || timerHours,
      tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : [],
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                <Clock size={32} className="text-blue-600" />
                Worklogs
              </h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                New Worklog
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="card p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Create Worklog Entry</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Project</label>
                      <select
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                      >
                        <option value="">Select Project</option>
                        {projectsData?.data?.map((p: any) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Task (Optional)</label>
                      <select
                        value={formData.taskId}
                        onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                        disabled={!formData.projectId}
                      >
                        <option value="">Select Task</option>
                        {tasksData?.data?.map((t: any) => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Hours</label>
                      <input
                        type="number"
                        value={formData.hours || timerHours.toFixed(2)}
                        onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
                        step="0.5"
                        min="0"
                        max="24"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  {/* Timer Widget */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                    <p className="text-sm font-medium mb-4 text-gray-600">Or use the timer:</p>
                    <Timer onTimeChange={setTimerHours} initialHours={timerHours} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.billable}
                        onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                      />
                      <span>Billable</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Tags (comma-separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save Worklog
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Worklogs List */}
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Date</th>
                      <th className="px-6 py-4 text-left font-medium">Project</th>
                      <th className="px-6 py-4 text-left font-medium">Task</th>
                      <th className="px-6 py-4 text-left font-medium">Hours</th>
                      <th className="px-6 py-4 text-left font-medium">Description</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {worklogsData?.data?.map((log: any) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">{new Date(log.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{log.project.name}</td>
                        <td className="px-6 py-4">{log.task?.title || '-'}</td>
                        <td className="px-6 py-4 font-medium">{log.hours}h</td>
                        <td className="px-6 py-4 max-w-xs truncate text-gray-600">{log.description}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              log.status === 'APPROVED'
                                ? 'bg-green-100 text-green-700'
                                : log.status === 'REJECTED'
                                ? 'bg-red-100 text-red-700'
                                : log.status === 'SUBMITTED'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
