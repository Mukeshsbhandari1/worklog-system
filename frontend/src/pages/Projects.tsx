import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { Calendar, Plus } from 'lucide-react';
import { useState } from 'react';

export const ProjectsPage: React.FC = () => {
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
    mutationFn: (data: any) => api.createProject(data),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
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
                <Calendar size={32} className="text-blue-600" />
                Projects
              </h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                New Project
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="card p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Create Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Client</label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget</label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Create Project
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsData?.data?.map((project: any) => (
                <div key={project.id} className="card p-6">
                  <h3 className="text-lg font-bold mb-2">{project.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{project.description}</p>
                  <div className="space-y-2 text-sm">
                    {project.client && (
                      <p>
                        <span className="font-medium">Client:</span> {project.client}
                      </p>
                    )}
                    {project.budget && (
                      <p>
                        <span className="font-medium">Budget:</span> ${project.budget.toLocaleString()}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                        {project.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Members:</span> {project.projectMembers.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
