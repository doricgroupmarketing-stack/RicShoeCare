export interface PageContent {
  id?: string;
  slug: string;
  title: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  seo_title: string;
  seo_desc: string;
  cta_text?: string;
  images?: Record<string, string>;
  text_content?: Record<string, string>;
}

export interface SiteSettings {
  brand_name: string;
  contact_email: string;
  logo_url: string;
  favicon_url: string;
  social_links: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}

/**
 * Compresses an image file to be under a specific size limit (default 500KB).
 * Also resizes extremely large images to a max dimension of 1920px for web optimization.
 */
const compressImage = async (file: File, maxSizeKB = 500): Promise<File> => {
  if (!file.type.startsWith('image/') || file.size <= maxSizeKB * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = (e) => reject(e);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      const MAX_DIMENSION = 1920;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            if (blob.size <= maxSizeKB * 1024 || quality <= 0.5) {
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          'image/jpeg',
          quality
        );
      };

      tryCompress();
    };

    reader.readAsDataURL(file);
  });
};

export const contentService = {
  /**
   * Fetch page content by slug
   */
  async getPage(slug: string): Promise<PageContent | null> {
    try {
      const res = await fetch(`/api/pages/${encodeURIComponent(slug.toLowerCase())}`);
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Content service error:', e);
      return null;
    }
  },

  /**
   * Save or update page content
   */
  async savePage(content: PageContent) {
    const payload = { ...content, slug: content.slug.toLowerCase() };
    if (!payload.id) delete payload.id;

    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Failed to save page: ${res.statusText}`);
    }

    const data = await res.json();
    window.dispatchEvent(new CustomEvent('content-updated', { detail: { slug: payload.slug, data } }));
    return data;
  },

  /**
   * Fetch site settings
   */
  async getSettings(): Promise<SiteSettings | null> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      return {
        brand_name: data.brand_name || 'RIC Shoe Care',
        contact_email: data.contact_email || 'doricindustries@gmail.com',
        logo_url: data.logo_url || '',
        favicon_url: data.favicon_url || '',
        social_links: data.social_links || { instagram: '', facebook: '', tiktok: '' }
      };
    } catch (e) {
      console.error('Content service error:', e);
      return null;
    }
  },

  /**
   * Save site settings
   */
  async saveSettings(settings: SiteSettings) {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'config',
        brand_name: settings.brand_name,
        contact_email: settings.contact_email,
        logo_url: settings.logo_url,
        favicon_url: settings.favicon_url,
        social_links: settings.social_links
      })
    });

    if (!res.ok) {
      throw new Error(`Failed to save settings: ${res.statusText}`);
    }

    const updated = await res.json();
    window.dispatchEvent(new CustomEvent('settings-updated', { detail: updated }));
    return updated;
  },

  /**
   * Upload media file to local backend storage with auto-compression
   */
  async uploadMedia(file: File): Promise<string> {
    const compressedFile = await compressImage(file, 500);
    const fileExt = compressedFile.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const res = await fetch(`/api/media/upload?filename=${encodeURIComponent(fileName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': compressedFile.type || 'application/octet-stream'
      },
      body: compressedFile
    });

    if (!res.ok) {
      throw new Error(`Failed to upload media: ${res.statusText}`);
    }

    const data = await res.json();
    return data.url;
  }
};
