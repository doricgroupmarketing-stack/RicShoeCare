import React from 'react';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Lock, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { useSettings } from '../hooks/useSettings';

const Footer: React.FC = () => {
  const { settings } = useSettings();

  const trackSocial = (platform: string) => {
    analyticsService.trackAction(`social_click_${platform.toLowerCase()}`);
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">{settings.brand_name || 'RIC Shoe Care'}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium shoe restoration and cleaning services powered by advanced AI technology. We bring your favorite kicks back to life.
            </p>
            <div className="flex space-x-4 pt-2">
              {settings.social_links.instagram && (
                <a href={settings.social_links.instagram} target="_blank" rel="noreferrer" onClick={() => trackSocial('Instagram')} className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
              )}
              {settings.social_links.facebook && (
                <a href={settings.social_links.facebook} target="_blank" rel="noreferrer" onClick={() => trackSocial('Facebook')} className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
              )}
              {settings.social_links.tiktok && (
                <a href={settings.social_links.tiktok} target="_blank" rel="noreferrer" onClick={() => trackSocial('TikTok')} className="text-gray-400 hover:text-white transition-colors">
                  <Video size={20} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/shop?category=Polish" className="hover:text-primary-400 transition-colors">Polish</Link></li>
              <li><Link to="/shop?category=Cream" className="hover:text-primary-400 transition-colors">Cream</Link></li>
              <li><Link to="/shop?category=Suede" className="hover:text-primary-400 transition-colors">Suede</Link></li>
              <li><Link to="/shop?category=Dye" className="hover:text-primary-400 transition-colors">Dye</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-primary-500 shrink-0" />
                <span>Doric Industrial Park,<br />Along Nairobi-Namanga Road,<br />Behind NITA<br />P.O. Box 58097 - 00200, Nairobi</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary-500 shrink-0" />
                <span>+254 732 746 630</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary-500 shrink-0" />
                <span className="break-all">{settings.contact_email || 'doricindustries@gmail.com'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>&copy; {new Date().getFullYear()} {settings.brand_name || 'RIC Shoe Care'}. All rights reserved.</p>
            <Link to="/admin/login" className="flex items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors text-xs">
              <Lock size={12} /> Admin Login
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mt-4 md:mt-0">
             <div className="flex space-x-6">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;