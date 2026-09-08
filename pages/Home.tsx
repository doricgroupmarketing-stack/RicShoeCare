import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, ShieldCheck, Clock, Zap, ShoppingBag, Package, Factory, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { wholesaleData } from '../data/wholesale';
import SmartLogisticsTool from '../components/SmartLogisticsTool';
import SEOHead from '../components/SEOHead';
import { analyticsService } from '../services/analyticsService';
import { usePageContent } from '../hooks/usePageContent';
import { useInventory } from '../hooks/useInventory';

const Home: React.FC = () => {
  // Realtime Data Hooks
  const { content, loading: contentLoading } = usePageContent('home', {
    slug: 'home',
    title: 'Home',
    hero_title: 'MORE THAN JUST A SHINE',
    hero_subtitle: 'More than just a shine details',
    hero_image: '', // Removed default heavy image
    seo_title: 'RIC Shoe Care - Premium Restoration & Wholesale',
    seo_desc: 'Premium AI-powered shoe cleaning and restoration service. Shop specialized shoe polish, creams, and dyes.',
    cta_text: 'Scan Your Shoe',
    images: {
      about_section_1: '',
      about_section_2: '',
      about_section_3: '',
      about_section_4: ''
    }
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!contentLoading) {
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [contentLoading]);

  const { items: products } = useInventory();

  // Select specific products for the featured section
  const featuredProductIds = ['prod-1', 'prod-7', 'prod-8', 'prod-9'];
  const featuredProducts = products.length > 0 
    ? products.filter(p => featuredProductIds.includes(p.id))
    : []; 
  // Limit to 4 for the grid
  const displayProducts = featuredProducts.slice(0, 4);

  // Wholesale Data State
  const [activeTab, setActiveTab] = useState('Polish');

  const slideshowImages = [
    content.images?.about_section_1,
    content.images?.about_section_2,
    content.images?.about_section_3,
    content.images?.about_section_4
  ].filter(Boolean) as string[];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slideshowImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const scrollToWholesale = () => {
    analyticsService.trackAction('click_wholesaler_button');
    const element = document.getElementById('wholesale');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScanClick = () => {
    analyticsService.trackAction('click_scan_shoe');
  };

  const isVideo = (url: string) => url?.toLowerCase().endsWith('.mp4') || url?.toLowerCase().endsWith('.webm');

  const highlightKeywords = (text: string) => {
    if (!text) return text;
    const keywords = [
      'RIC',
      'paste shoe polish',
      'shoe creams',
      'leather dyes',
      'suede cleaners'
    ];
    
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      if (keywords.some(k => k.toLowerCase() === part.toLowerCase())) {
        return <span key={i} className="font-semibold" style={{ color: '#635b4b' }}>{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead 
        title={content.title} 
        description={content.seo_desc}
      />
      {/* Hero Section */}
      <section className={`relative w-full min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden fouc-hidden ${isReady ? 'fouc-ready' : ''}`}>
        {/* Background */}
        <div className="absolute inset-0 z-0">
           {content.hero_image && isVideo(content.hero_image) ? (
             <video 
               src={content.hero_image}
               autoPlay 
               muted 
               loop 
               playsInline
               className="w-full h-full object-cover"
             />
           ) : content.hero_image ? (
             <img 
               src={content.hero_image} 
               alt="Shoe Care Background" 
               className="w-full h-full object-cover"
             />
           ) : (
             <div className="w-full h-full bg-gray-300" />
           )}
        </div>
        
        {/* Content Box (Top Left Floating) */}
        <div className="absolute inset-0 z-10 w-full flex items-start justify-start pt-24 sm:pt-28 px-4 sm:px-8 md:px-16 lg:px-20">
          <div className="bg-[#1A4B9C]/50 backdrop-blur-md p-6 md:p-8 max-w-lg w-full shadow-2xl rounded-2xl border border-white/20">
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2 uppercase">
              {content.hero_title}
            </h1>
            <p className="text-sm md:text-base text-white/90 mb-4 leading-snug font-medium">
              {content.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link onClick={handleScanClick} to="/ai-analysis" className="inline-flex justify-center items-center px-5 py-2 bg-white text-[#e85d22] hover:bg-gray-100 font-bold transition-colors text-sm rounded">
                Scan Your Shoe <span className="ml-2 font-bold">&gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-gray-50 overflow-hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="relative mb-12 lg:mb-0 order-2 lg:order-1">
              <div className="absolute inset-0 bg-white rounded-3xl transform -rotate-2 scale-105 z-0 border border-gray-200"></div>
              {slideshowImages.length > 0 ? (
                <div className="relative z-10 rounded-3xl shadow-xl w-full h-[500px] overflow-hidden">
                  {slideshowImages.map((img, index) => (
                    <img 
                      key={index}
                      src={img} 
                      alt={`Shoe Care Production ${index + 1}`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ))}
                  {slideshowImages.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                      {slideshowImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            index === currentSlide ? 'bg-white' : 'bg-white/50'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                 <div className="relative z-10 rounded-3xl shadow-xl w-full h-[500px] bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 font-medium">Image Placeholder</span>
                 </div>
              )}
              <div className="absolute -bottom-6 -right-6 z-20 bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                    <Factory size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{content.text_content?.about_badge_title || 'Manufacturer'}</p>
                    <p className="text-lg font-bold text-gray-900">{content.text_content?.about_badge_subtitle || 'Direct Source'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-bold text-sm mb-6">
                <Star size={14} fill="currentColor" /> {content.text_content?.about_badge || 'Established 2003'}
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                {content.text_content?.about_heading_1 || 'Decades of'} <br/><span className="text-primary-600">{content.text_content?.about_heading_2 || 'Manufacturing Excellence'}</span>
              </h2>
              
              <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
                <p>
                  {content.text_content?.about_p1 || 'With over 20 years of experience in the leather care and shoe care industry, Doric Industries Limited has established itself as a leading manufacturer of premium shoe care products.'}
                </p>
                <p>
                  {highlightKeywords(content.text_content?.about_p2 || 'We specialize in the formulation and production of a wide range of shoe care products, including paste shoe polish, shoe creams, leather dyes and suede cleaners all under the Brand Name RIC.')}
                </p>
                <p>
                  {content.text_content?.about_p3 || 'From our founding, we have been dedicated to crafting high-quality products that keep your shoes and leather goods looking like new, using modern production lines and skilled professionals.'}
                </p>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm mt-4">
                  <p className="text-sm font-medium text-gray-800">
                    {content.text_content?.about_callout || 'We proudly serve a broad client base, including major retailers, distributors, footwear manufacturers, and private-label brands, both locally and internationally.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Our Products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {displayProducts.map((product) => (
              <Link 
                to={`/product/${product.id}`} 
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ShoppingBag size={48} className="text-gray-300" />
                  )}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ShoppingBag size={20} className="text-primary-600" />
                  </div>
                  <div className="absolute top-4 left-4 bg-gray-900/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-3 flex items-center justify-end">
                    <span className="text-sm font-medium text-primary-600 group-hover:underline flex items-center gap-1">
                      Details <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-[1075px] mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/A8Ln7CTsA7k" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>



    </div>
  );
};

export default Home;