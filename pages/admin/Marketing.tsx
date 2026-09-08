import React from 'react';
import { Calendar, Share2, BarChart2 } from 'lucide-react';

const Marketing: React.FC = () => {
  const schedule = [
    { day: 'Monday', type: 'Industry Motivational', topic: 'Start the week with fresh kicks', status: 'Scheduled' },
    { day: 'Tuesday', type: 'Product Reel', topic: 'Showcase Polish application', status: 'Draft' },
    { day: 'Wednesday', type: 'Product Images', topic: 'Suede cleaner highlights', status: 'Pending' },
    { day: 'Thursday', type: 'Product + Model', topic: 'Lifestyle shoot downtown', status: 'Pending' },
    { day: 'Friday', type: 'Happy Customer', topic: 'Repost user #freshkicks', status: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-primary-600" /> Weekly Strategy Generator
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {schedule.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col h-full">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{item.day}</div>
              <div className="font-bold text-gray-900 mb-1">{item.type}</div>
              <p className="text-sm text-gray-500 mb-4 flex-1">{item.topic}</p>
              <div className="mt-auto flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.status === 'Scheduled' ? 'bg-green-100 text-green-700' :
                  item.status === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {item.status}
                </span>
                <button className="text-primary-600 hover:text-primary-700 text-xs font-bold">Generate</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-blue-600" /> Engagement Report
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Instagram Reach</span>
              <span className="font-bold text-gray-900">12.5k <span className="text-green-500 text-xs">↑ 5%</span></span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Facebook Clicks</span>
              <span className="font-bold text-gray-900">3.2k <span className="text-green-500 text-xs">↑ 12%</span></span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">TikTok Views</span>
              <span className="font-bold text-gray-900">45k <span className="text-red-500 text-xs">↓ 2%</span></span>
            </div>
          </div>
        </div>

        {/* Integration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Share2 size={20} className="text-purple-600" /> Connected Accounts
          </h3>
          <div className="space-y-4">
            {['Instagram', 'Facebook', 'TikTok'].map(platform => (
              <div key={platform} className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{platform}</span>
                <button className="text-sm text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">Connected</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;