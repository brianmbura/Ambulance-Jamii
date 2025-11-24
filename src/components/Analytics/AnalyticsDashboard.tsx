import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Clock, Truck, Building2, Download, Calendar, Activity, Users, AlertTriangle } from 'lucide-react';
import { mockAnalytics } from '../../utils/mockData';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('response_time');
  
  const data = mockAnalytics;
  
  const responseTimeData = data.responseTime.dates.map((date, index) => ({
    name: date,
    time: data.responseTime.trend[index],
    target: 10
  }));

  const emergencyTypeData = Object.entries(data.emergenciesHandled.byType).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value / data.emergenciesHandled.total) * 100)
  }));

  const monthlyData = [
    { month: 'Jan', emergencies: 120, responseTime: 8.2, successRate: 97.5 },
    { month: 'Feb', emergencies: 134, responseTime: 7.8, successRate: 98.1 },
    { month: 'Mar', emergencies: 145, responseTime: 8.5, successRate: 97.8 },
    { month: 'Apr', emergencies: 156, responseTime: 8.1, successRate: 98.5 },
    { month: 'May', emergencies: 142, responseTime: 7.9, successRate: 98.2 },
    { month: 'Jun', emergencies: 158, responseTime: 8.3, successRate: 98.7 }
  ];

  const hospitalLoadData = [
    { name: 'Mon', load: 65, capacity: 100 },
    { name: 'Tue', load: 70, capacity: 100 },
    { name: 'Wed', load: 75, capacity: 100 },
    { name: 'Thu', load: 82, capacity: 100 },
    { name: 'Fri', load: 78, capacity: 100 },
    { name: 'Sat', load: 85, capacity: 100 },
    { name: 'Sun', load: 78, capacity: 100 }
  ];

  const COLORS = ['#DC2626', '#2563EB', '#059669', '#F59E0B', '#7C3AED', '#EC4899'];

  const kpiCards = [
    {
      title: 'Average Response Time',
      value: `${data.responseTime.average}m`,
      change: '-2.1%',
      trend: 'down',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Emergencies Handled',
      value: data.emergenciesHandled.total.toString(),
      change: '+8.3%',
      trend: 'up',
      icon: Truck,
      color: 'red'
    },
    {
      title: 'Hospital Load',
      value: `${data.hospitalLoad.current}%`,
      change: '+5.2%',
      trend: 'up',
      icon: Building2,
      color: 'yellow'
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      change: '+1.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
            <span>Ambulance Jamii</span>
            <span className="text-blue-600">Analytics Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive insights and performance analytics for emergency medical services</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  <p className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change} from last period
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${
                  kpi.color === 'blue' ? 'bg-blue-100' :
                  kpi.color === 'red' ? 'bg-red-100' :
                  kpi.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <Icon className={`h-8 w-8 ${
                    kpi.color === 'blue' ? 'text-blue-600' :
                    kpi.color === 'red' ? 'text-red-600' :
                    kpi.color === 'yellow' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Response Time Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Response Time Analysis</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              <span>Real-time data</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'time' ? `${value} min` : `${value} min`,
                  name === 'time' ? 'Response Time' : 'Target'
                ]}
                labelStyle={{ color: '#333' }}
              />
              <Line type="monotone" dataKey="time" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="target" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Emergency Types Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Emergency Types Distribution</h3>
            <div className="text-sm text-gray-500">Total: {data.emergenciesHandled.total}</div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={emergencyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {emergencyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} cases`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Performance Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Monthly Performance Trends</h3>
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="emergencies">Emergency Volume</option>
              <option value="responseTime">Response Time</option>
              <option value="successRate">Success Rate</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey={selectedMetric === 'emergencies' ? 'emergencies' : selectedMetric === 'responseTime' ? 'responseTime' : 'successRate'}
                stroke="#2563EB" 
                fill="#2563EB" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hospital Load Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Hospital System Load</h3>
            <div className="text-sm text-gray-500">Weekly trend</div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={hospitalLoadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip formatter={(value) => [`${value}%`, 'Hospital Load']} />
              <Bar dataKey="load" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacity" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Detailed Performance Metrics</h3>
          <div className="flex items-center space-x-2">
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
              Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Metric</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Current Value</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Target</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Trend</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Average Response Time</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600 font-medium">8.5 minutes</td>
                <td className="py-4 px-4 text-gray-600">≤ 10 minutes</td>
                <td className="py-4 px-4">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    -2.1%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Excellent</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Success Rate</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600 font-medium">98.5%</td>
                <td className="py-4 px-4 text-gray-600">≥ 95%</td>
                <td className="py-4 px-4">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +1.2%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Excellent</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Hospital Occupancy</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600 font-medium">78%</td>
                <td className="py-4 px-4 text-gray-600">≤ 85%</td>
                <td className="py-4 px-4">
                  <span className="text-yellow-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +5.2%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Monitor</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Fleet Utilization</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600 font-medium">85%</td>
                <td className="py-4 px-4 text-gray-600">80-90%</td>
                <td className="py-4 px-4">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +3.1%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Optimal</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Patient Satisfaction</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600 font-medium">4.8/5.0</td>
                <td className="py-4 px-4 text-gray-600">≥ 4.5</td>
                <td className="py-4 px-4">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +0.3
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Excellent</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Geographic Distribution</h3>
          <div className="space-y-4">
            {[
              { area: 'Nairobi CBD', requests: 45, percentage: 28.8 },
              { area: 'Westlands', requests: 32, percentage: 20.5 },
              { area: 'Eastlands', requests: 28, percentage: 17.9 },
              { area: 'Karen', requests: 24, percentage: 15.4 },
              { area: 'Other Areas', requests: 27, percentage: 17.4 }
            ].map((area, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{area.area}</p>
                  <p className="text-sm text-gray-600">{area.requests} requests</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{area.percentage}%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${area.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Peak Hours Analysis</h3>
          <div className="space-y-4">
            {[
              { time: '08:00 - 10:00', requests: 18, level: 'High' },
              { time: '12:00 - 14:00', requests: 22, level: 'Peak' },
              { time: '16:00 - 18:00', requests: 25, level: 'Peak' },
              { time: '20:00 - 22:00', requests: 15, level: 'Medium' },
              { time: '00:00 - 06:00', requests: 8, level: 'Low' }
            ].map((period, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{period.time}</p>
                  <p className="text-sm text-gray-600">{period.requests} avg requests</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  period.level === 'Peak' ? 'bg-red-100 text-red-800' :
                  period.level === 'High' ? 'bg-orange-100 text-orange-800' :
                  period.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {period.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">System Health</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">All Systems Operational</span>
              </div>
              <p className="text-sm text-green-700">99.9% uptime this month</p>
            </div>

            <div className="space-y-3">
              {[
                { component: 'GPS Tracking', status: 'Online', uptime: '99.9%' },
                { component: 'Communication', status: 'Online', uptime: '99.8%' },
                { component: 'Database', status: 'Online', uptime: '100%' },
                { component: 'Payment System', status: 'Online', uptime: '99.7%' }
              ].map((system, index) => (
                <div key={index} className="flex items-center justify-between p-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{system.component}</span>
                  </div>
                  <span className="text-xs text-gray-500">{system.uptime}</span>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              View System Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;