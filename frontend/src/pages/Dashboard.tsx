import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Dashboard } from '../components/StatCard';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Activity, Zap } from 'lucide-react';
import ECharts from 'echarts-for-react';

export const DashboardPage: React.FC = () => {
  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
  });

  const stats = statsData?.data;

  // Chart data for 3D visualization
  const chartOption = {
    title: {
      text: 'Weekly Hours Distribution',
      left: 'center',
      textStyle: { color: '#333', fontSize: 16, fontWeight: 'bold' },
    },
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.9)' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: '#ddd' } },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#ddd' } },
    },
    series: [
      {
        name: 'Hours',
        type: 'bar',
        data: [8, 8, 7, 8, 9, 4, 2],
        itemStyle: {
          color: new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
        smooth: true,
      },
    ],
  };

  const pieOption = {
    title: {
      text: 'Project Distribution',
      left: 'center',
      textStyle: { color: '#333', fontSize: 14, fontWeight: 'bold' },
    },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Hours',
        type: 'pie',
        radius: ['30%', '70%'],
        data: [
          { value: 24, name: 'Website Redesign' },
          { value: 18, name: 'Mobile App' },
          { value: 8, name: 'Data Migration' },
        ],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
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
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                <Zap size={32} className="text-blue-600" />
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back! Here's your work summary.
              </p>
            </div>

            {/* Stats Cards */}
            <Dashboard stats={stats} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="card p-6">
                <ECharts option={chartOption} style={{ height: '300px' }} />
              </div>
              <div className="card p-6">
                <ECharts option={pieOption} style={{ height: '300px' }} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6 mt-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity size={24} />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {stats?.recentLogs?.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{log.project.name}</p>
                      <p className="text-sm text-gray-500">{log.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{log.hours}h</p>
                      <p className={`text-xs ${
                        log.status === 'APPROVED'
                          ? 'text-green-600'
                          : log.status === 'REJECTED'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}>
                        {log.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
