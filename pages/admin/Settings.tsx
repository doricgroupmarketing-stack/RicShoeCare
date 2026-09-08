import React, { useState, useEffect } from 'react';
import { Save, Globe, Image as ImageIcon, Trash2, Instagram, Facebook, Upload, Loader, Video, HardDrive, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { contentService } from '../../services/contentService';

const Settings: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  
  // Settings State
  const [brandName, setBrandName] = useState('RIC Shoe Care');
  const [contactEmail, setContactEmail] = useState('doricindustries@gmail.com');
  const [logo, setLogo] = useState<string>('');
  const [favicon, setFavicon] = useState<string>('');

  // Social Media State
  const [socials, setSocials] = useState({
    instagram: 'https://instagram.com/ricshoecare',
    facebook: 'https://facebook.com/ricshoecare',
    tiktok: 'https://tiktok.com/@ricshoecare'
  });

  // Fetch settings on load
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      const data = await contentService.getSettings();
      if (data) {
        setBrandName(data.brand_name);
        setContactEmail(data.contact_email);
        setLogo(data.logo_url || '');
        setFavicon(data.favicon_url || '');
        setSocials(data.social_links);
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  const validatePng = (file: File) => {
    if (file.type !== 'image/png') {
      showToast('Only PNG files are allowed.', 'error');
      return false;
    }
    return true;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validatePng(file)) {
      try {
        setUploadingLogo(true);
        const url = await contentService.uploadMedia(file);
        setLogo(url);
        showToast('Logo uploaded successfully', 'success');
      } catch (e: any) {
        console.error("Upload Error:", e);
        showToast('Failed to upload logo: ' + (e.message || 'Unknown error'), 'error');
      } finally {
        setUploadingLogo(false);
      }
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validatePng(file)) {
      try {
        setUploadingFavicon(true);
        const url = await contentService.uploadMedia(file);
        setFavicon(url);
        showToast('Favicon uploaded successfully', 'success');
      } catch (e: any) {
        console.error("Upload Error:", e);
        showToast('Failed to upload favicon: ' + (e.message || 'Unknown error'), 'error');
      } finally {
        setUploadingFavicon(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await contentService.saveSettings({
        brand_name: brandName,
        contact_email: contactEmail,
        logo_url: logo,
        favicon_url: favicon,
        social_links: socials
      });
      showToast('Settings saved successfully', 'success');
    } catch (e: any) {
      console.error("Save Error:", e);
      showToast('Failed to save settings: ' + (e.message || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Store Settings</h2>
        <button 
          onClick={handleSave}
          disabled={loading || uploadingLogo || uploadingFavicon}
          className="bg-primary-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors font-medium shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
        </button>
      </div>

      {/* Brand Identity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
           <Globe size={20} className="text-primary-600" /> Brand Identity
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
              <input 
                type="text" 
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input 
                type="email" 
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logos & Assets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
           <ImageIcon size={20} className="text-purple-600" /> Logos & Assets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo Upload */}
          <div className="space-y-4">
             <label className="block text-sm font-medium text-gray-700">Brand Logo (PNG Only)</label>
             <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 min-h-[200px] relative">
               {logo ? (
                 <div className="relative group w-full h-full flex justify-center items-center">
                   <img src={logo} alt="Brand Logo" className="max-h-32 object-contain" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <button 
                        onClick={() => setLogo('')}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                   </div>
                 </div>
               ) : (
                 <div className="text-center">
                   <ImageIcon className="mx-auto text-gray-300 mb-2" size={40} />
                   <p className="text-sm text-gray-500 mb-4">No logo uploaded</p>
                 </div>
               )}
               
               {!logo && (
                 <div className="mt-4">
                   <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm transition-colors flex items-center gap-2">
                     {uploadingLogo ? <Loader className="animate-spin" size={16}/> : <Upload size={16} />}
                     Upload Logo
                     <input type="file" className="hidden" accept="image/png" onChange={handleLogoUpload} />
                   </label>
                 </div>
               )}
             </div>
          </div>

          {/* Favicon Upload */}
          <div className="space-y-4">
             <label className="block text-sm font-medium text-gray-700">Website Favicon (PNG Only)</label>
             <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 min-h-[200px]">
               {favicon ? (
                 <div className="relative group w-full h-full flex justify-center items-center">
                   <img src={favicon} alt="Favicon" className="w-16 h-16 object-contain" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <button 
                        onClick={() => setFavicon('')}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                   </div>
                 </div>
               ) : (
                 <div className="text-center">
                   <Globe className="mx-auto text-gray-300 mb-2" size={40} />
                   <p className="text-sm text-gray-500 mb-4">No favicon uploaded</p>
                 </div>
               )}

               {!favicon && (
                 <div className="mt-4">
                   <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm transition-colors flex items-center gap-2">
                     {uploadingFavicon ? <Loader className="animate-spin" size={16}/> : <Upload size={16} />}
                     Upload Favicon
                     <input type="file" className="hidden" accept="image/png" onChange={handleFaviconUpload} />
                   </label>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
           <Instagram size={20} className="text-pink-600" /> Social Media Links
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Instagram size={18} />
              </div>
              <input 
                type="url" 
                value={socials.instagram}
                onChange={(e) => setSocials({...socials, instagram: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Facebook size={18} />
              </div>
              <input 
                type="url" 
                value={socials.facebook}
                onChange={(e) => setSocials({...socials, facebook: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Video size={18} />
              </div>
              <input 
                type="url" 
                value={socials.tiktok}
                onChange={(e) => setSocials({...socials, tiktok: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
                placeholder="https://tiktok.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Storage Architecture */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-gray-900 flex items-center gap-2">
             <HardDrive size={20} className="text-emerald-600" /> Database & Storage Engine
           </h3>
           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
             <CheckCircle2 size={13} /> Active & Operational
           </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          All store data, catalog inventory, custom page configurations, analytics, and uploaded media assets are persisted directly using the built-in, server-side local storage engine.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Database Engine</div>
            <div className="text-sm font-medium text-gray-800">Persistent Local JSON Store (<code className="text-xs bg-gray-200 px-1 py-0.5 rounded">data/local_db.json</code>)</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Media Storage</div>
            <div className="text-sm font-medium text-gray-800">Local Filesystem Storage (<code className="text-xs bg-gray-200 px-1 py-0.5 rounded">data/uploads/</code>)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
