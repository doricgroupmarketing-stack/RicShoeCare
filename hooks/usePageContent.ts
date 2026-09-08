import { useState, useEffect, useCallback } from 'react';
import { contentService, PageContent } from '../services/contentService';

export const usePageContent = (slug: string, initialData?: PageContent) => {
  const [content, setContent] = useState<PageContent>(initialData || {
    slug,
    title: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    seo_title: '',
    seo_desc: '',
    cta_text: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contentService.getPage(slug);
      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error(`Error fetching page ${slug}:`, error);
    } finally {
      setLoading(false);
      window.dispatchEvent(new Event('content-loaded'));
    }
  }, [slug]);

  useEffect(() => {
    fetchContent();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.slug) {
        if (customEvent.detail.slug.toLowerCase() === slug.toLowerCase()) {
          setContent(customEvent.detail.data);
        }
      } else {
        fetchContent();
      }
    };

    window.addEventListener('content-updated', handleUpdate);
    return () => {
      window.removeEventListener('content-updated', handleUpdate);
    };
  }, [slug, fetchContent]);

  return { content, loading };
};
