import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

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

  // Mock detailed analytics data
  const priceAccuracyData = [
    { day: '1', actual: 2850, predicted: 2820, accuracy: 98.9 },
    { day: '2', actual: 3200, predicted: 3150, accuracy: 98.4 },
    { day: '3', actual: 2950, predicted: 2980, accuracy: 99.0 },
    { day: '4', actual: 3100, predicted: 3050, accuracy: 98.4 },
    { day: '5', actual: 2750, predicted: 2780, accuracy: 98.9 },
    { day: '6', actual: 3300, predicted: 3250, accuracy: 98.5 },
    { day: '7', actual: 2900, predicted: 2920, accuracy: 99.3 }
  ];

  const marketTrendsData = [
    { week: 'Week 1', congestion: 0.3, fuelPrice: 450, shanghaiIndex: 1200 },
    { week: 'Week 2', congestion: 0.4, fuelPrice: 465, shanghaiIndex: 1250 },
    { week: 'Week 3', congestion: 0.5, fuelPrice: 480, shanghaiIndex: 1300 },
    { week: 'Week 4', congestion: 0.6, fuelPrice: 495, shanghaiIndex: 1350 },
    { week: 'Week 5', congestion: 0.4, fuelPrice: 485, shanghaiIndex: 1320 },
    { week: 'Week 6', congestion: 0.3, fuelPrice: 470, shanghaiIndex: 1280 }
  ];

  const competitorAnalysis = [
    { competitor: 'Competitor A', avgPrice: 2850, winRate: 75 },
    { competitor: 'Competitor B', avgPrice: 2950, winRate: 80 },
    { competitor: 'FreightIQ', avgPrice: 2820, winRate: 88 },
    { competitor: 'Competitor C', avgPrice: 3000, winRate: 70 },
    { competitor: 'Competitor D', avgPrice: 2900, winRate: 78 }
  ];

  const routeAnalysis = [
    { route: 'Shanghai-LA', volume: 120, avgPrice: 2850, margin: 15.2 },
    { route: 'Hamburg-NY', volume: 95, avgPrice: 3200, margin: 18.5 },
    { route: 'Singapore-Rotterdam', volume: 80, avgPrice: 2950, margin: 16.8 },
    { route: 'Tokyo-Hamburg', volume: 65, avgPrice: 3100, margin: 17.2 },
    { route: 'Dubai-LA', volume: 45, avgPrice: 2750, margin: 14.8 }
  ];

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
        <h1 className="dashboard-title">Advanced Analytics</h1>
        <p className="dashboard-subtitle">Deep insights into FreightIQ performance and market dynamics</p>
        
        <div className="flex justify-center gap-4 mt-4">
          <button 
            className={`btn ${timeRange === '7d' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
          <button 
            className={`btn ${timeRange === '30d' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </button>
          <button 
            className={`btn ${timeRange === '90d' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </button>
        </div>
      </div>

      <div className="grid grid-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Price Accuracy</span>
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
              🎯
            </div>
          </div>
          <div className="stat-value">98.7%</div>
          <div className="stat-change positive">+1.2% from last period</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Margin Improvement</span>
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              📈
            </div>
          </div>
          <div className="stat-value">+12%</div>
          <div className="stat-change positive">vs industry average</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Quote Speed</span>
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#6366f1' }}>
              ⚡
            </div>
          </div>
          <div className="stat-value">0.3s</div>
          <div className="stat-change positive">Avg response time</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Market Share</span>
            <div className="stat-icon" style={{ backgroundColor: '#fce7f3', color: '#ec4899' }}>
              🏆
            </div>
          </div>
          <div className="stat-value">23%</div>
          <div className="stat-change positive">+3% from last quarter</div>
        </div>
      </div>

      <div className="grid grid-2 gap-6 mb-8">
        <div className="analytics-chart">
          <h3 className="chart-title">Price Prediction Accuracy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceAccuracyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="accuracy" stroke="#1e40af" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-chart">
          <h3 className="chart-title">Market Trends Impact</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marketTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="congestion" stroke="#ef4444" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="fuelPrice" stroke="#f59e0b" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="shanghaiIndex" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2 gap-6 mb-8">
        <div className="analytics-chart">
          <h3 className="chart-title">Competitive Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={competitorAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="competitor" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="winRate" fill="#1e40af" name="Win Rate (%)" />
              <Bar yAxisId="right" dataKey="avgPrice" fill="#10b981" name="Avg Price ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-chart">
          <h3 className="chart-title">Route Performance Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routeAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Volume" />
              <Bar yAxisId="right" dataKey="margin" fill="#f59e0b" name="Margin (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-chart">
        <h3 className="chart-title">Model Performance Metrics</h3>
        <div className="grid grid-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">98.7%</div>
            <div className="text-sm text-gray-600 mb-1">Prediction Accuracy</div>
            <div className="text-xs text-green-600">+1.2% improvement</div>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">0.3s</div>
            <div className="text-sm text-gray-600 mb-1">Average Response Time</div>
            <div className="text-xs text-green-600">50% faster than competitors</div>
          </div>
          
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">16.8%</div>
            <div className="text-sm text-gray-600 mb-1">Average Margin</div>
            <div className="text-xs text-green-600">+3.2% vs industry</div>
          </div>
        </div>
      </div>

      <div className="analytics-chart">
        <h3 className="chart-title">Key Insights & Recommendations</h3>
        <div className="grid grid-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🎯 High Performance Routes</h4>
              <p className="text-sm text-green-700">
                Shanghai-LA and Hamburg-NY routes show consistently high win rates (90%+) 
                with optimal margin performance. Consider expanding capacity on these lanes.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📊 Market Opportunity</h4>
              <p className="text-sm text-blue-700">
                Singapore-Rotterdam route shows 15% lower competition. 
                Opportunity to increase market share with competitive pricing.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Risk Factors</h4>
              <p className="text-sm text-yellow-700">
                Fuel price volatility and port congestion levels are trending upward. 
                Monitor these factors closely for pricing adjustments.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">🚀 Optimization Potential</h4>
              <p className="text-sm text-purple-700">
                ML model shows 98.7% accuracy with room for improvement in 
                hazardous cargo and oversized freight predictions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
