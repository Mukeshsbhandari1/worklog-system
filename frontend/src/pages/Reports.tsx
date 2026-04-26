import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { BarChart3, Filter, Download } from 'lucide-react';
import ECharts from 'echarts-for-react';

export const ReportsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    projectIds: [] as string[],
    userIds: [] as string[],
    startDate: '',
    endDate: '',
    billableOnly: false,
  });

  const { data: reportsData } = useQuery({
    queryKey: ['advanced-report', filters],
    queryFn: () => api.getAdvancedReport(filters),
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.getProjects(1, 100),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(1, 100),
  });

  // 3D Bar Chart - Hours by User
  const userChartOption = {
    title: { text: 'Hours by User', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Billable', 'Non-Billable'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: reportsData?.data?.byUser?.map((u: any) => u.userName.split(' ')[0]),
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Billable',
        type: 'bar',
        data: reportsData?.data?.byUser?.map((u: any) => u.billableHours),
        itemStyle: { color: '#10b981' },
      },
      {
        name: 'Non-Billable',
        type: 'bar',
        data: reportsData?.data?.byUser?.map((u: any) => u.nonBillableHours),
        itemStyle: { color: '#f59e0b' },
      },
    ],
  };

  // 3D Pie Chart - Project Distribution
  const projectChartOption = {
    title: { text: 'Hours by Project', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['25%', '75%'],
        data: reportsData?.data?.byProject?.map((p: any) => ({
          value: p.totalHours,
          name: p.projectName,
        })),
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: { shadowBlur: 10 },
        },
      },
    ],
  };

  // Line Chart - Hours Trend
  const trendOption = {
    title: { text: 'Hours Trend', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Total Hours',
        type: 'line',
        data: [32, 38, 35, 42],
        smooth: true,
        areaStyle: {
          color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ]),
        },
        lineStyle: { color: '#3b82f6', width: 3 },
        itemStyle: { color: '#3b82f6' },
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                <BarChart3 size={32} className="text-blue-600" />
                Advanced Reports
              </h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download size={20} />
                Export
              </button>
            </div>

            {/* Filter Panel */}
            <div className="card p-6 mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter size={24} />
                Filters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Projects</label>
                  <select
                    multiple
                    value={filters.projectIds}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        projectIds: Array.from(e.target.selectedOptions, (o) => o.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                  >
                    {projectsData?.data?.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Users</label>
                  <select
                    multiple
                    value={filters.userIds}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        userIds: Array.from(e.target.selectedOptions, (o) => o.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                  >
                    {usersData?.data?.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.firstName} {u.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.billableOnly}
                    onChange={(e) => setFilters({ ...filters, billableOnly: e.target.checked })}
                  />
                  <span className="text-sm font-medium">Billable Hours Only</span>
                </label>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {reportsData?.data?.summary?.totalHours?.toFixed(1) || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Hours</p>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {reportsData?.data?.summary?.billableHours?.toFixed(1) || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Billable Hours</p>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {reportsData?.data?.summary?.nonBillableHours?.toFixed(1) || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Non-Billable</p>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {reportsData?.data?.summary?.logCount || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Log Entries</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="card p-6">
                <ECharts option={userChartOption} style={{ height: '400px' }} />
              </div>
              <div className="card p-6">
                <ECharts option={projectChartOption} style={{ height: '400px' }} />
              </div>
            </div>

            <div className="card p-6 mb-8">
              <ECharts option={trendOption} style={{ height: '350px' }} />
            </div>

            {/* Detailed Table */}
            <div className="card">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-bold">Detailed Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Date</th>
                      <th className="px-6 py-4 text-left font-medium">User</th>
                      <th className="px-6 py-4 text-left font-medium">Project</th>
                      <th className="px-6 py-4 text-left font-medium">Hours</th>
                      <th className="px-6 py-4 text-left font-medium">Billable</th>
                      <th className="px-6 py-4 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {reportsData?.data?.logs?.slice(0, 10).map((log: any) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 text-sm">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{log.user.firstName} {log.user.lastName}</td>
                        <td className="px-6 py-4">{log.project.name}</td>
                        <td className="px-6 py-4 font-medium">{log.hours}h</td>
                        <td className="px-6 py-4">
                          <span className={log.billable ? 'text-green-600' : 'text-gray-600'}>
                            {log.billable ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                          {log.description}
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
