import React from 'react';
import { TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
  trend,
}) => {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="text-gray-500 dark:text-gray-400">{icon}</div>
        {trend && (
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{value}</p>
    </div>
  );
};

export const Dashboard: React.FC<any> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Today's Hours"
        value={stats?.todayHours?.toFixed(2) || '0.00'}
        icon={<Clock size={24} />}
        change={`${stats?.todayHours > 8 ? '+' : ''}${stats?.todayHours - 8}`}
        trend={stats?.todayHours >= 8 ? 'up' : 'down'}
      />
      <StatCard
        label="This Week"
        value={stats?.weekHours?.toFixed(2) || '0.00'}
        icon={<TrendingUp size={24} />}
        change="+5.2h"
        trend="up"
      />
      <StatCard
        label="Pending Approvals"
        value={stats?.pendingApprovals || 0}
        icon={<AlertCircle size={24} />}
      />
      <StatCard
        label="Project Allocation"
        value="85%"
        icon={<Users size={24} />}
        change="+12%"
        trend="up"
      />
    </div>
  );
};
