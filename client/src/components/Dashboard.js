import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for charts
  const winRateData = [
    { month: 'Jan', winRate: 78, requests: 120 },
    { month: 'Feb', winRate: 82, requests: 135 },
    { month: 'Mar', winRate: 85, requests: 150 },
    { month: 'Apr', winRate: 88, requests: 165 },
    { month: 'May', winRate: 90, requests: 180 },
    { month: 'Jun', winRate: 87, requests: 175 }
  ];

  const confidenceData = [
    { range: '90-100%', count: 45 },
    { range: '80-89%', count: 78 },
    { range: '70-79%', count: 52 },
    { range: '60-69%', count: 23 },
    { range: '50-59%', count: 8 }
  ];

  const routePerformance = [
    { route: 'Shanghai-LA', winRate: 92, avgPrice: 2850 },
    { route: 'Hamburg-NY', winRate: 88, avgPrice: 3200 },
    { route: 'Singapore-Rotterdam', winRate: 85, avgPrice: 2950 },
    { route: 'Tokyo-Hamburg', winRate: 82, avgPrice: 3100 },
    { route: 'Dubai-LA', winRate: 78, avgPrice: 2750 }
  ];

  const COLORS = ['#1e40af', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">FreightIQ Dashboard</h1>
        <p className="dashboard-subtitle">AI-powered freight pricing insights and performance metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Requests</span>
            <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
              📊
            </div>
          </div>
          <div className="stat-value">{analytics?.totalRequests || 0}</div>
          <div className="stat-change positive">+12% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Win Rate</span>
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
              🎯
            </div>
          </div>
          <div className="stat-value">{analytics?.recentWinRate || 0}%</div>
          <div className="stat-change positive">+5% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Avg Confidence</span>
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              🎲
            </div>
          </div>
          <div className="stat-value">{analytics?.averageConfidence || 0}%</div>
          <div className="stat-change positive">+3% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Model Accuracy</span>
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#6366f1' }}>
              🤖
            </div>
          </div>
          <div className="stat-value">{analytics?.modelPerformance?.accuracy || 0}%</div>
          <div className="stat-change positive">+2% from last month</div>
        </div>
      </div>

      <div className="grid grid-2 gap-6">
        <div className="analytics-chart">
          <h3 className="chart-title">Win Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={winRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="winRate" stroke="#1e40af" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-chart">
          <h3 className="chart-title">Confidence Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, count }) => `${range}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {confidenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-chart">
        <h3 className="chart-title">Route Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={routePerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="route" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="winRate" fill="#1e40af" name="Win Rate (%)" />
            <Bar yAxisId="right" dataKey="avgPrice" fill="#10b981" name="Avg Price ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-3 gap-6">
        <div className="analytics-chart">
          <h3 className="chart-title">Model Performance</h3>
          <div className="grid grid-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics?.modelPerformance?.precision || 0}%</div>
              <div className="text-sm text-gray-500">Precision</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics?.modelPerformance?.recall || 0}%</div>
              <div className="text-sm text-gray-500">Recall</div>
            </div>
          </div>
        </div>

        <div className="analytics-chart">
          <h3 className="chart-title">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Recent Bookings</span>
              <span className="text-sm font-semibold">{analytics?.recentBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Recent Declines</span>
              <span className="text-sm font-semibold">{analytics?.recentDeclines || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Recent</span>
              <span className="text-sm font-semibold">{analytics?.totalRecentRequests || 0}</span>
            </div>
          </div>
        </div>

        <div className="analytics-chart">
          <h3 className="chart-title">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="text-sm font-semibold text-green-600">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ML Engine</span>
              <span className="text-sm font-semibold text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Data Sources</span>
              <span className="text-sm font-semibold text-green-600">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
