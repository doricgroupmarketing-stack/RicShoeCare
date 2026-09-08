import { useState, useEffect, useCallback } from 'react';
import { contentService, SiteSettings } from '../services/contentService';

const defaultSettings: SiteSettings = {
  brand_name: 'RIC Shoe Care',
  contact_email: 'doricindustries@gmail.com',
  logo_url: '',
  favicon_url: '',
  social_links: {
    instagram: 'https://instagram.com/ricshoecare',
    facebook: 'https://facebook.com/ricshoecare',
    tiktok: 'https://tiktok.com/@ricshoecare'
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await contentService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
      window.dispatchEvent(new Event('settings-loaded'));
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
      } else {
        fetchSettings();
      }
    };

    window.addEventListener('settings-updated', handleUpdate);
    return () => {
      window.removeEventListener('settings-updated', handleUpdate);
    };
  }, [fetchSettings]);

  return { settings, loading };
};
