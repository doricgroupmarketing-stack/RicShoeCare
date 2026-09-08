import React from 'react';
import { ExternalLink } from 'lucide-react';

const AIStudio: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-8rem)] flex flex-col">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Creative Designer AI</h3>
        <a 
          href="https://creativedesignerai-270387620092.us-west1.run.app" 
          target="_blank" 
          rel="noreferrer"
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          Open in New Tab <ExternalLink size={14} />
        </a>
      </div>
      <iframe 
        src="https://creativedesignerai-270387620092.us-west1.run.app" 
        className="w-full h-full border-0"
        title="AI Design Studio"
      />
    </div>
  );
};

export default AIStudio;