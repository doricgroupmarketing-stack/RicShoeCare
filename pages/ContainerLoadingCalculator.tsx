import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Box } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { wholesaleData } from '../data/wholesale';
import SmartLogisticsTool from '../components/SmartLogisticsTool';

const ContainerLoadingCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Polish');

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <SEOHead 
        title="Container Loading Calculator | RIC Shoe Polish"
        description="Calculate container loading for your RIC Shoe Polish orders."
      />
      
      <section id="wholesale" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Wholesale Information</h2>
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Packaging & Logistics
            </h3>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Detailed specifications for bulk orders and our smart calculator tool.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Tabbed Table */}
            <div className="lg:col-span-2 space-y-6">
               {/* Tab Navigation */}
               <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
                {Object.keys(wholesaleData).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-6 py-3 rounded-t-lg font-bold text-sm transition-all relative ${
                      activeTab === key 
                        ? 'bg-gray-900 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Dynamic Content */}
              <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
                {/* @ts-ignore */}
                {wholesaleData[activeTab] && (
                  <div className="animate-fade-in">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                       {/* @ts-ignore */}
                      <h3 className="font-bold text-lg text-gray-900">{wholesaleData[activeTab].title} Details</h3>
                      <Package className="text-gray-400" size={20}/>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                          <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Size / Weight
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Carton Configuration
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Dimensions (LxWxH)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {/* @ts-ignore */}
                          {wholesaleData[activeTab].specs.map((spec, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-5 whitespace-nowrap text-base font-bold text-primary-700">
                                {spec.size}
                              </td>
                              <td className="px-6 py-5 text-sm text-gray-600">
                                <div className="font-semibold text-gray-900 mb-1">{spec.packing}</div>
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                  <Box size={12} /> Total: {spec.unitsPerCarton} units
                                </div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-mono bg-gray-50/50">
                                {spec.dimensions}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Calculator Tool */}
            <div className="lg:col-span-1 h-full">
               <SmartLogisticsTool className="h-full" />
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/contact" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 text-lg group">
              <Package className="mr-2 group-hover:rotate-12 transition-transform" size={24} /> Request Official Wholesale Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContainerLoadingCalculator;
