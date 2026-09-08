import React from 'react';
import { ShieldCheck, Users, Heart, Factory, Globe, Award } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { usePageContent } from '../hooks/usePageContent';

const About: React.FC = () => {
  const { content, loading: contentLoading } = usePageContent('about', {
    slug: 'about',
    title: 'About Us',
    hero_title: 'Crafting Excellence in Shoe Care',
    hero_subtitle: 'With over two decades of expertise, we bring you the finest formulations for your footwear.',
    hero_image: '', // Removed default heavy image
    seo_title: 'About RIC Shoe Care',
    seo_desc: 'Learn about RIC Shoe Care, established in 2003.',
    cta_text: '',
    images: {
      story_image: '' // Removed default heavy image
    }
  });

  const [isReady, React_useState] = React.useState(false);

  React.useEffect(() => {
    if (!contentLoading) {
      const timer = setTimeout(() => React_useState(true), 50);
      return () => clearTimeout(timer);
    }
  }, [contentLoading]);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEOHead 
        title={content.title} 
        description={content.seo_desc}
      />
      {/* Hero / Header */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 fouc-hidden ${isReady ? 'fouc-ready' : ''}`}>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Crafting Excellence in <span className="text-primary-600">Shoe Care</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            {content.hero_subtitle}
          </p>
        </div>
      </div>

      {/* Main Content Section - Split Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-100 rounded-3xl transform rotate-3 scale-105 z-0"></div>
            {content.images?.story_image && (
              <img 
                src={content.images.story_image} 
                alt="Premium Shoe Care Products" 
                className="relative z-10 rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                loading="lazy"
              />
            )}
            <div className="absolute -bottom-6 -right-6 z-20 bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Established</p>
                  <p className="text-lg font-bold text-gray-900">20+ Years</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Legacy</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                With over 20 years of experience in the leather care and shoe care industry, <span className="font-semibold text-gray-900">Doric Industries Limited</span> has established itself as a leading manufacturer of premium shoe care products.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Factory className="text-primary-600" size={24} />
                Specialized Manufacturing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We specialize in the formulation and production of a wide range of shoe care products, including paste shoe polish, shoe creams, leather dyes, and suede cleaners all under the Brand Name <span className="font-bold text-primary-600">RIC</span> — all available in various sizes and colors to meet the diverse needs of the market.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Content Section - Full Width Background */}
      <div className="bg-gray-900 text-white py-24 mb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
          <Globe size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-bold mb-6">Dedicated to Quality</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                From our founding, we have been dedicated to crafting high-quality products that keep your shoes and leather goods looking like new.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                To achieve this, our manufacturing facility is equipped with modern production lines and staffed by a team of skilled professionals who ensure every batch meets our rigorous standards.
              </p>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-6">Global Reach</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                We proudly serve a broad client base, including major retailers, distributors, footwear manufacturers, and private-label brands, both locally and internationally.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-3xl font-bold text-primary-500 mb-1">20+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-3xl font-bold text-primary-500 mb-1">Global</div>
                  <div className="text-sm text-gray-400">Distribution Network</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Why Partner With Us</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Formulations</h3>
            <p className="text-gray-600">
              Our products are crafted with high-quality ingredients to ensure superior protection and restoration for all leather types.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6">
              <Factory size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Manufacturing</h3>
            <p className="text-gray-600">
              Equipped with state-of-the-art production lines, we maintain consistency and capacity for large-scale distribution.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Globe size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Service</h3>
            <p className="text-gray-600">
              Serving retailers and manufacturers worldwide with reliable supply chains and private-label solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;