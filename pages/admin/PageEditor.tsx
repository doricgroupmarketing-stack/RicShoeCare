import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Upload, Eye, Loader } from 'lucide-react';
import { contentService, PageContent } from '../../services/contentService';
import { useToast } from '../../context/ToastContext';

// Configuration for dynamic image fields per page
const pageImageConfig: Record<string, { key: string, label: string }[]> = {
  'home': [
    { key: 'about_section_1', label: 'Slideshow Image 1' },
    { key: 'about_section_2', label: 'Slideshow Image 2' },
    { key: 'about_section_3', label: 'Slideshow Image 3' },
    { key: 'about_section_4', label: 'Slideshow Image 4' }
  ],
  'about': [
    { key: 'story_image', label: 'Main Story Image' }
  ],
  // Add other page specific images here if needed
};

// Configuration for dynamic text fields per page
const pageTextConfig: Record<string, { key: string, label: string, type: 'text' | 'textarea', defaultValue: string }[]> = {
  'home': [
    { key: 'about_badge', label: 'About Section Badge', type: 'text', defaultValue: 'Established 2003' },
    { key: 'about_heading_1', label: 'About Heading Line 1', type: 'text', defaultValue: 'Decades of' },
    { key: 'about_heading_2', label: 'About Heading Line 2 (Highlighted)', type: 'text', defaultValue: 'Manufacturing Excellence' },
    { key: 'about_p1', label: 'About Paragraph 1', type: 'textarea', defaultValue: 'With over 20 years of experience in the leather care and shoe care industry, Doric Industries Limited has established itself as a leading manufacturer of premium shoe care products.' },
    { key: 'about_p2', label: 'About Paragraph 2', type: 'textarea', defaultValue: 'We specialize in the formulation and production of a wide range of shoe care products, including paste shoe polish, shoe creams, leather dyes and suede cleaners all under the Brand Name RIC.' },
    { key: 'about_p3', label: 'About Paragraph 3', type: 'textarea', defaultValue: 'From our founding, we have been dedicated to crafting high-quality products that keep your shoes and leather goods looking like new, using modern production lines and skilled professionals.' },
    { key: 'about_callout', label: 'About Callout Box', type: 'textarea', defaultValue: 'We proudly serve a broad client base, including major retailers, distributors, footwear manufacturers, and private-label brands, both locally and internationally.' },
    { key: 'about_link', label: 'About Link Text', type: 'text', defaultValue: 'Read Our Story' },
    { key: 'about_badge_title', label: 'Image Badge Title', type: 'text', defaultValue: 'Manufacturer' },
    { key: 'about_badge_subtitle', label: 'Image Badge Subtitle', type: 'text', defaultValue: 'Direct Source' }
  ]
};

const PageEditor: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('Home');
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<PageContent>({
    slug: 'home',
    title: 'Home',
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    seo_title: '',
    seo_desc: '',
    cta_text: '',
    images: {}
  });

  const pages = ['Home', 'Services', 'Shop', 'About', 'Contact', 'AI Analysis'];

  // Fetch page data on mount or selection change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const slug = selectedPage.toLowerCase().replace(' ', '-');
      const data = await contentService.getPage(slug);
      
      if (data) {
        setFormData(data);
      } else {
        // Defaults if no data found in DB
        setFormData({
          slug,
          title: selectedPage,
          hero_title: 'Welcome to RIC Shoe Care',
          hero_subtitle: 'The best AI-powered restoration service.',
          hero_image: 'https://images.unsplash.com/photo-1607522370275-f14bc3d5d248?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=75',
          seo_title: `RIC Shoe Care - ${selectedPage}`,
          seo_desc: 'Premium shoe care services.',
          cta_text: 'Get Started',
          images: {},
          text_content: {}
        });
      }
      setLoading(false);
    };

    loadData();
  }, [selectedPage]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await contentService.savePage(formData);
      showToast('Page updated successfully on live website!', 'success');
    } catch (error: any) {
      showToast(`Error saving page: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const publicUrl = await contentService.uploadMedia(file);
      setFormData(prev => ({ ...prev, hero_image: publicUrl }));
      showToast('Hero media uploaded successfully', 'success');
    } catch (error: any) {
      showToast(`Upload failed: ${error.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSectionImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const publicUrl = await contentService.uploadMedia(file);
      setFormData(prev => ({ 
        ...prev, 
        images: {
          ...(prev.images || {}),
          [key]: publicUrl
        }
      }));
      showToast('Image uploaded successfully', 'success');
    } catch (error: any) {
      showToast(`Upload failed: ${error.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSectionTextChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      text_content: {
        ...(prev.text_content || {}),
        [key]: value
      }
    }));
  };

  const isVideo = (url: string) => url?.toLowerCase().includes('.mp4') || url?.toLowerCase().includes('.webm');
  
  const currentSlug = selectedPage.toLowerCase().replace(' ', '-');
  const additionalImages = pageImageConfig[currentSlug] || [];
  const additionalTexts = pageTextConfig[currentSlug] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
      {/* Page List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1 flex flex-col">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-700 bg-gray-50">
          Website Pages
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => setSelectedPage(page)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedPage === page 
                  ? 'bg-primary-50 text-primary-700 border border-primary-100' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-3 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">Editing: {selectedPage}</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Eye size={16} /> Preview
            </button>
            <button 
              onClick={handleSave}
              disabled={loading || uploading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
            </button>
          </div>
        </div>

        {loading && !formData.hero_title ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader className="animate-spin text-primary-600" size={32} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Hero Section */}
            <section className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Hero Section</h4>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
                  <input 
                    type="text" 
                    value={formData.hero_title || ''}
                    onChange={(e) => setFormData({...formData, hero_title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
                  <textarea 
                    rows={3}
                    value={formData.hero_subtitle || ''}
                    onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Media (Image/Video)</label>
                  
                  {formData.hero_image && (
                    <div className="mb-4 rounded-xl overflow-hidden h-48 bg-gray-100 border border-gray-200 relative">
                      {isVideo(formData.hero_image) ? (
                        <video src={formData.hero_image} className="w-full h-full object-cover" controls />
                      ) : (
                        <img src={formData.hero_image} alt="Hero" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        Current Media
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer bg-gray-50 relative">
                    <input 
                      type="file" 
                      accept="image/*,video/mp4,video/webm"
                      onChange={handleHeroUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                      {uploading ? <Loader className="animate-spin text-primary-500" size={24} /> : <Upload className="text-gray-400" size={24} />}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {uploading ? 'Uploading to Live Server...' : 'Click to upload new media'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP or MP4</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                  <input 
                    type="text" 
                    value={formData.cta_text || ''}
                    onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                  />
                </div>
              </div>
            </section>

            {/* Additional Texts Section */}
            {additionalTexts.length > 0 && (
              <section className="space-y-4 pt-4">
                <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Page Content</h4>
                <div className="grid grid-cols-1 gap-6">
                  {additionalTexts.map((textConfig) => (
                    <div key={textConfig.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{textConfig.label}</label>
                      {textConfig.type === 'textarea' ? (
                        <textarea
                          rows={4}
                          value={formData.text_content?.[textConfig.key] ?? textConfig.defaultValue}
                          onChange={(e) => handleSectionTextChange(textConfig.key, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData.text_content?.[textConfig.key] ?? textConfig.defaultValue}
                          onChange={(e) => handleSectionTextChange(textConfig.key, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Additional Images Section */}
            {additionalImages.length > 0 && (
              <section className="space-y-4 pt-4">
                <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Page Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {additionalImages.map((imgConfig) => (
                    <div key={imgConfig.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{imgConfig.label}</label>
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        {formData.images?.[imgConfig.key] && (
                          <div className="mb-3 rounded-lg overflow-hidden h-40 bg-gray-200">
                             <img src={formData.images[imgConfig.key]} alt={imgConfig.label} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm transition-colors flex items-center gap-2 justify-center">
                          {uploading ? <Loader className="animate-spin" size={16}/> : <Upload size={16} />}
                          Upload Image
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleSectionImageUpload(imgConfig.key, e)} />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SEO Settings */}
            <section className="space-y-4 pt-4">
              <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">SEO Settings (Yoast Style)</h4>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                 <div className="mb-4">
                   <p className="text-sm font-medium text-gray-500 mb-1">Google Preview</p>
                   <div className="bg-white p-3 rounded border border-gray-200 shadow-sm max-w-xl">
                      <div className="text-sm text-gray-800 mb-0.5 flex items-center gap-1">
                         <span className="w-6 h-6 bg-gray-200 rounded-full"></span>
                         ricshoecare.com › {formData.slug}
                      </div>
                      <div className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                        {formData.seo_title || formData.title}
                      </div>
                      <div className="text-sm text-gray-600 leading-snug mt-1">
                        {formData.seo_desc || 'No description set.'}
                      </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                      <input 
                        type="text" 
                        value={formData.seo_title || ''}
                        onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <textarea 
                        rows={3}
                        value={formData.seo_desc || ''}
                        onChange={(e) => setFormData({...formData, seo_desc: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                      ></textarea>
                    </div>
                 </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageEditor;