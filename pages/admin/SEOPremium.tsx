import React, { useState } from 'react';
import { Link2, Upload, CheckCircle } from 'lucide-react';

const SEOPremium: React.FC = () => {
  // Logic to rotate daily link based on date
  const today = new Date();
  const dayOfMonth = today.getDate();
  const sampleLinks = [
    'www.sonicrun.com', 'www.anoox.com', 'www.google.com/addurl', 'www.bing.com/webmaster',
    'www.yandex.com', 'www.directory.com', 'www.submitexpress.com'
  ];
  const dailyLink = sampleLinks[dayOfMonth % sampleLinks.length];

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Submission Tool */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
          <Link2 size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Daily SEO Submission</h3>
        <p className="text-gray-500 mb-8">Submit your website to this high-authority portal today to boost ranking.</p>
        
        <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200 mb-8">
          <p className="text-sm text-gray-500 mb-2">Today's Target URL:</p>
          <a href={`https://${dailyLink}`} target="_blank" rel="noreferrer" className="text-2xl font-bold text-primary-600 hover:underline break-all">
            {dailyLink}
          </a>
        </div>

        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all w-full">
          Mark as Submitted
        </button>
      </div>

      {/* KPI Verification */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h3 className="font-bold text-gray-900 mb-6">Submission Verification</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Screenshot Proof</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
              />
              <div className="flex flex-col items-center">
                <Upload className="text-gray-400 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-600">
                  {uploadedFile ? uploadedFile.name : 'Click to upload proof'}
                </span>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Bulk Link Import (Spreadsheet)</label>
             <div className="flex gap-2">
               <input type="file" className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary-700
                  hover:file:bg-primary-100
                "/>
             </div>
             <p className="text-xs text-gray-400 mt-2">Upload .csv or .xlsx with custom backlink targets.</p>
          </div>

          <div className="pt-6 border-t border-gray-100">
             <h4 className="font-bold text-sm text-gray-900 mb-4">Monthly Progress</h4>
             <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-[65%]"></div>
                </div>
                <span className="text-sm font-bold text-gray-600">65%</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOPremium;