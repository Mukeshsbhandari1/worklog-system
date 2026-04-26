import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export const ApprovalsPage: React.FC = () => {
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [comments, setComments] = useState('');

  const { data: approvalsData, refetch } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => api.getPendingApprovals(),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.approveWorkLog(id, comments),
    onSuccess: () => {
      refetch();
      setSelectedApproval(null);
      setComments('');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.rejectWorkLog(id, comments),
    onSuccess: () => {
      refetch();
      setSelectedApproval(null);
      setComments('');
    },
  });

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
              Worklog Approvals
            </h1>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">User</th>
                      <th className="px-6 py-4 text-left font-medium">Project</th>
                      <th className="px-6 py-4 text-left font-medium">Date</th>
                      <th className="px-6 py-4 text-left font-medium">Hours</th>
                      <th className="px-6 py-4 text-left font-medium">Description</th>
                      <th className="px-6 py-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {approvalsData?.data?.map((approval: any) => (
                      <tr key={approval.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {approval.worklog.user.firstName} {approval.worklog.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{approval.worklog.user.email}</div>
                        </td>
                        <td className="px-6 py-4">{approval.worklog.project.name}</td>
                        <td className="px-6 py-4">{new Date(approval.worklog.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium">{approval.worklog.hours}h</td>
                        <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                          {approval.worklog.description}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedApproval(approval.id)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Review Modal */}
            {selectedApproval && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="card w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Review Worklog</h2>
                  <div className="space-y-4">
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Add comments (optional)"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setSelectedApproval(null)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(selectedApproval)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <XCircle size={20} />
                        Reject
                      </button>
                      <button
                        onClick={() => approveMutation.mutate(selectedApproval)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle size={20} />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
