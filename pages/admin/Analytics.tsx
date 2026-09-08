import React, { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Search,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

const Analytics: React.FC = () => {
  const [stats, setStats] = useState({ totalViews: 0, socialClicks: 0, scans: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const data = await analyticsService.getDashboardStats();
      setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Page Views</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalViews.toLocaleString()}
              </h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <Eye size={20} />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <span className="text-gray-400 font-normal">Live Tracking Active</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Social Engagement</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.socialClicks.toLocaleString()}
              </h3>
            </div>
            <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <span>Clicks on Social Links</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">AI Scans</p>
              <h3 className="text-3xl font-bold text-gray-900">
                 {loading ? '...' : stats.scans.toLocaleString()}
              </h3>
            </div>
            <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <span>'Scan Your Shoe' Clicks</span>
          </div>
        </div>
      </div>

      {/* SEO Ranking Table (Mock for now as this requires external API) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Search size={18} className="text-gray-500" /> Top Keyword Rankings
          </h3>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Sample Data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic Vol</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">shoe cleaning service nairobi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">=</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.4k</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">premium shoe polish</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">▲ 2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5.1k</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">sneaker restoration</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">▼ 1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1.8k</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Traffic Graph Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6">Traffic Trends (Monthly)</h3>
        <div className="h-64 flex items-end justify-between gap-2">
           {[35, 45, 30, 60, 75, 50, 65, 80, 70, 90, 85, 95].map((h, i) => (
             <div key={i} className="w-full bg-primary-100 rounded-t-sm relative group">
               <div className="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
               <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none">
                 {h * 10} Visits
               </div>
             </div>
           ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-400">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;