import React from 'react';
import { Check } from 'lucide-react';
import { Service } from '../types';
import SEOHead from '../components/SEOHead';

const servicesData: Service[] = [
  {
    id: '1',
    title: 'Standard Clean',
    description: 'Perfect for regular maintenance. Removes surface dirt and dust from uppers and midsoles.',
    price: '$30',
    image: '',
    features: ['Upper cleaning', 'Midsole wipe down', 'Laces cleaning', 'Deodorizing']
  },
  {
    id: '2',
    title: 'Deep Clean',
    description: 'Our most popular package. Intensive cleaning for set-in stains, deep dirt, and muddy soles.',
    price: '$45',
    image: '',
    features: ['Deep stain removal', 'Undersole scrubbing', 'Insole cleaning', 'Water & Stain Repellent']
  },
  {
    id: '3',
    title: 'Suede Revival',
    description: 'Specialized care for delicate suede and nubuck materials. Resets the nap and removes texture damage.',
    price: '$55',
    image: '',
    features: ['Dry suede cleaning', 'Nap resetting', 'Oil stain extraction', 'Color enhancement']
  },
  {
    id: '4',
    title: 'Sole De-Oxidation',
    description: 'Remove the yellowing from your icy or rubber soles using UV light technology.',
    price: '$40',
    image: '',
    features: ['Ice Sole Sauce treatment', 'UV Light session', 'Deep scrub', 'Protective coating']
  }
];

const Services: React.FC = () => {
  return (
    <div className="pt-20 pb-24 bg-gray-50 min-h-screen">
      <SEOHead 
        title="Services" 
        description="Professional shoe cleaning and restoration services. From deep cleaning to suede revival and sole restoration."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Choose the perfect care package for your collection. From quick touch-ups to full restorations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">
              <div className="h-48 overflow-hidden relative group bg-gray-100 flex items-center justify-center">
                {service.image && (
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 mb-6 flex-1">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
                  Select Package
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gray-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
           <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Not sure what you need?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Use our AI Diagnosis tool to scan your shoes. We'll analyze the condition and recommend the exact service you need.
            </p>
            <a href="/#/ai-analysis" className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-500 transition-colors">
              Try AI Diagnosis
            </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Services;