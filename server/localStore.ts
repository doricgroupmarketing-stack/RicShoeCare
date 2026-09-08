import fs from 'fs';
import path from 'path';

export interface ProductRecord {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  gallery: string[];
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  sizes: string[];
  colors: string[];
  created_at: string;
  updated_at: string;
}

export interface PageRecord {
  id: string;
  slug: string;
  title: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  seo_title: string;
  seo_desc: string;
  cta_text?: string;
  images: Record<string, string>;
  text_content: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingsRecord {
  id: string;
  brand_name: string;
  contact_email: string;
  logo_url: string;
  favicon_url: string;
  social_links: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEventRecord {
  id: string;
  event_type: string;
  page_path?: string;
  event_name?: string;
  metadata?: any;
  created_at: string;
}

interface LocalDatabase {
  products: ProductRecord[];
  pages: PageRecord[];
  site_settings: SiteSettingsRecord;
  analytics_events: AnalyticsEventRecord[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'local_db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'data', 'uploads');

const defaultDb: LocalDatabase = {
  products: [
    {
      id: 'prod-1',
      name: 'Ric Shoe Polish',
      price: 18.00,
      description: `Restore and protect your leather footwear with our high-quality shoe polish. Enriched with a blend of natural waxes, RIC Shoe Polish is designed to deliver a long-lasting shine and preserve leather integrity!\n\nRIC Shoe Polish is available in four (4) classic colors to suit your specific tastes:\n• Black\n• Dark Tan\n• Mid Brown\n• Toney Red\n\nWe also offer RIC Shoe Polish in three (3) sizes to suit each and every consumer:\n• Small (15ml / 12gms)\n• Medium (40ml / 32gms)\n• Large (100ml / 80gms)`,
      image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
      gallery: [],
      category: 'Polish',
      rating: 4.9,
      reviews: 128,
      features: [
        'Contains natural carnauba wax',
        'Water-resistant protection',
        'Restores color depth',
        'Available in 4 Classic Colors'
      ],
      sizes: ['Small (15ml)', 'Medium (40ml)', 'Large (100ml)'],
      colors: ['Black', 'Dark Tan', 'Mid Brown', 'Toney Red'],
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    },
    {
      id: 'prod-7',
      name: 'Luxury Shoe Cream',
      price: 24.00,
      description: `Nourish and revitalize your leather shoes and articles with our rich shoe cream. It is formulated to soften and deliver a long–lasting shine.\n\nRIC Shoe Cream is available in five (5) vibrant shades to match your footwear perfectly:\n• Black\n• Tan\n• Dark Tan\n• Neutral\n• Calf white\n\nWe offer RIC Shoe Creams in two (2) convenient sizes to suit each and every consumer:\n• Small (50ml)\n• Large (100ml)`,
      image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600',
      gallery: [],
      category: 'Cream',
      rating: 4.8,
      reviews: 95,
      features: [
        'High pigment concentration',
        'Softens leather',
        'Long-lasting shine',
        'Available in 5 Vibrant Shades'
      ],
      sizes: ['Small (50ml)', 'Large (100ml)'],
      colors: ['Black', 'Tan', 'Dark Tan', 'Neutral', 'Calf white'],
      created_at: '2023-01-02T00:00:00.000Z',
      updated_at: '2023-01-02T00:00:00.000Z'
    },
    {
      id: 'prod-8',
      name: 'Suede Renovator Spray',
      price: 20.00,
      description: `Gently clean, nourish and revitalize your suede items with our restorative RIC Suede Cleaner. It is specially formulated to refresh and restore their natural color for a renewed appearance.\n\nRIC Suede Cleaner is available in six (6) dynamic colors, ensuring all your suede items are well catered to:\n• Black\n• Brown\n• Dark Brown\n• Neutral\n• Kashmire\n\nWe offer RIC Suede Cleaner in two (2) sizes to suit your needs:\n• Standard (200ml)\n• Large (400ml)`,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
      gallery: [],
      category: 'Suede',
      rating: 4.7,
      reviews: 156,
      features: [
        'Restores color',
        'Conditions suede',
        'Includes waterproofing agents',
        'Available in 6 Dynamic Colors'
      ],
      sizes: ['Standard (200ml)', 'Large (400ml)'],
      colors: ['Black', 'Brown', 'Dark Brown', 'Neutral', 'Kashmire'],
      created_at: '2023-01-03T00:00:00.000Z',
      updated_at: '2023-01-03T00:00:00.000Z'
    },
    {
      id: 'prod-9',
      name: 'Professional Leather Dye',
      price: 28.00,
      description: `Achieve deep and uniform color restoration or a bold new look with our penetrating leather dye.\n\nRIC Leather Dye is available in (2) essential colors for versatile applications:\n• Black\n• Brown\n\nWe offer RIC Leather Dye in three (3) sizes to suit your specific needs:\n• Small (15ml)\n• Medium (40ml)\n• Large (100ml)`,
      image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=600',
      gallery: [],
      category: 'Dye',
      rating: 4.6,
      reviews: 42,
      features: [
        'Penetrating formula',
        'Permanent color',
        'Deep color restoration',
        'Available in 2 Essential Colors'
      ],
      sizes: ['Small (15ml)', 'Medium (40ml)', 'Large (100ml)'],
      colors: ['Black', 'Brown'],
      created_at: '2023-01-04T00:00:00.000Z',
      updated_at: '2023-01-04T00:00:00.000Z'
    },
    {
      id: 'prod-10',
      name: 'Liquid Shoe Polish',
      price: 15.00,
      description: 'Quick and easy shine with our premium Liquid Shoe Polish. Perfect for on-the-go touch-ups and daily maintenance.',
      image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=600',
      gallery: [],
      category: 'Liquid',
      rating: 4.8,
      reviews: 112,
      features: [
        'Instant shine',
        'Easy applicator sponge',
        'Nourishes leather',
        'No buffing required'
      ],
      sizes: ['75ml'],
      colors: ['Black', 'Neutral'],
      created_at: '2023-01-05T00:00:00.000Z',
      updated_at: '2023-01-05T00:00:00.000Z'
    }
  ],
  pages: [
    {
      id: 'page-home',
      slug: 'home',
      title: 'Home',
      hero_title: 'MORE THAN JUST A SHINE',
      hero_subtitle: 'More than just a shine details',
      hero_image: '',
      seo_title: 'RIC Shoe Care - Premium Restoration & Wholesale',
      seo_desc: 'Premium AI-powered shoe cleaning and restoration service. Shop specialized shoe polish, creams, and dyes.',
      cta_text: 'Scan Your Shoe',
      images: {
        about_section_1: '',
        about_section_2: '',
        about_section_3: '',
        about_section_4: ''
      },
      text_content: {},
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    },
    {
      id: 'page-about',
      slug: 'about',
      title: 'About Us',
      hero_title: 'Crafting Excellence in Shoe Care',
      hero_subtitle: 'With over two decades of expertise, we bring you the finest formulations for your footwear.',
      hero_image: '',
      seo_title: 'About RIC Shoe Care',
      seo_desc: 'Learn about RIC Shoe Care, established in 2003.',
      cta_text: '',
      images: {
        story_image: ''
      },
      text_content: {},
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    }
  ],
  site_settings: {
    id: 'config',
    brand_name: 'RIC Shoe Care',
    contact_email: 'doricindustries@gmail.com',
    logo_url: '',
    favicon_url: '',
    social_links: {
      instagram: 'https://instagram.com/ricshoecare',
      facebook: 'https://facebook.com/ricshoecare',
      tiktok: 'https://tiktok.com/@ricshoecare'
    },
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z'
  },
  analytics_events: []
};

class LocalStore {
  private db: LocalDatabase;

  constructor() {
    this.ensureDirs();
    this.db = this.load();
  }

  private ensureDirs() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  private load(): LocalDatabase {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : defaultDb.products,
          pages: Array.isArray(parsed.pages) && parsed.pages.length > 0 ? parsed.pages : defaultDb.pages,
          site_settings: parsed.site_settings || defaultDb.site_settings,
          analytics_events: Array.isArray(parsed.analytics_events) ? parsed.analytics_events : []
        };
      }
    } catch (e) {
      console.error('Failed to read local DB, using defaults:', e);
    }
    this.saveToDisk(defaultDb);
    return JSON.parse(JSON.stringify(defaultDb));
  }

  private saveToDisk(data: LocalDatabase) {
    try {
      this.ensureDirs();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write local DB:', e);
    }
  }

  private persist() {
    this.saveToDisk(this.db);
  }

  // Products
  getProducts(query: Record<string, string | undefined>): ProductRecord[] {
    let result = [...this.db.products];

    if (query.id) {
      const idVal = query.id.replace(/^eq\./, '');
      result = result.filter(p => p.id === idVal);
    }
    if (query.category) {
      const catVal = query.category.replace(/^eq\./, '');
      result = result.filter(p => p.category.toLowerCase() === catVal.toLowerCase());
    }

    if (query.order) {
      if (query.order.includes('created_at.desc')) {
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (query.order.includes('created_at.asc')) {
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
    }

    return result;
  }

  saveProduct(item: any): ProductRecord {
    const id = item.id || `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const existingIndex = this.db.products.findIndex(p => p.id === id);

    const record: ProductRecord = {
      id,
      name: item.name || 'Untitled Product',
      price: Number(item.price) || 0,
      description: item.description || '',
      image_url: item.image_url || item.image || '',
      gallery: Array.isArray(item.gallery) ? item.gallery : [],
      category: item.category || 'Uncategorized',
      rating: Number(item.rating) || 5.0,
      reviews: Number(item.reviews) || 0,
      features: Array.isArray(item.features) ? item.features : [],
      sizes: Array.isArray(item.sizes) ? item.sizes : [],
      colors: Array.isArray(item.colors) ? item.colors : [],
      created_at: existingIndex >= 0 ? this.db.products[existingIndex].created_at : now,
      updated_at: now
    };

    if (existingIndex >= 0) {
      this.db.products[existingIndex] = record;
    } else {
      this.db.products.unshift(record);
    }

    this.persist();
    return record;
  }

  deleteProduct(id: string): boolean {
    const cleanId = id.replace(/^eq\./, '');
    const beforeLen = this.db.products.length;
    this.db.products = this.db.products.filter(p => p.id !== cleanId);
    const deleted = this.db.products.length !== beforeLen;
    if (deleted) this.persist();
    return deleted;
  }

  // Site Settings
  getSiteSettings(): SiteSettingsRecord {
    return this.db.site_settings;
  }

  saveSiteSettings(settings: Partial<SiteSettingsRecord>): SiteSettingsRecord {
    this.db.site_settings = {
      ...this.db.site_settings,
      ...settings,
      id: 'config',
      updated_at: new Date().toISOString()
    };
    this.persist();
    return this.db.site_settings;
  }

  // Pages
  getPage(slug: string): PageRecord | null {
    const cleanSlug = slug.replace(/^eq\./, '').toLowerCase();
    return this.db.pages.find(p => p.slug.toLowerCase() === cleanSlug) || null;
  }

  savePage(pageData: any): PageRecord {
    const slug = (pageData.slug || 'home').toLowerCase();
    const now = new Date().toISOString();
    const existingIndex = this.db.pages.findIndex(p => p.slug.toLowerCase() === slug);

    const record: PageRecord = {
      id: pageData.id || (existingIndex >= 0 ? this.db.pages[existingIndex].id : `page-${slug}`),
      slug,
      title: pageData.title || slug,
      hero_title: pageData.hero_title || '',
      hero_subtitle: pageData.hero_subtitle || '',
      hero_image: pageData.hero_image || '',
      seo_title: pageData.seo_title || '',
      seo_desc: pageData.seo_desc || '',
      cta_text: pageData.cta_text || '',
      images: pageData.images || {},
      text_content: pageData.text_content || {},
      created_at: existingIndex >= 0 ? this.db.pages[existingIndex].created_at : now,
      updated_at: now
    };

    if (existingIndex >= 0) {
      this.db.pages[existingIndex] = record;
    } else {
      this.db.pages.push(record);
    }

    this.persist();
    return record;
  }

  // Analytics
  addAnalyticsEvent(event: any): AnalyticsEventRecord {
    const record: AnalyticsEventRecord = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      event_type: event.event_type || 'page_view',
      page_path: event.page_path || '',
      event_name: event.event_name || '',
      metadata: event.metadata || {},
      created_at: new Date().toISOString()
    };
    this.db.analytics_events.push(record);
    // Keep max 1000 events in local db
    if (this.db.analytics_events.length > 1000) {
      this.db.analytics_events = this.db.analytics_events.slice(-1000);
    }
    this.persist();
    return record;
  }

  getAnalyticsEvents(filter: Record<string, string | undefined>): AnalyticsEventRecord[] {
    let result = [...this.db.analytics_events];

    if (filter.event_type) {
      const val = filter.event_type.replace(/^eq\./, '');
      result = result.filter(e => e.event_type === val);
    }

    if (filter.event_name) {
      if (filter.event_name.startsWith('ilike.')) {
        const pattern = filter.event_name.replace(/^ilike\./, '').replace(/%/g, '.*').replace(/_/g, '.');
        const regex = new RegExp(`^${pattern}$`, 'i');
        result = result.filter(e => e.event_name && regex.test(e.event_name));
      } else {
        const val = filter.event_name.replace(/^eq\./, '');
        result = result.filter(e => e.event_name === val);
      }
    }

    return result;
  }

  // Media Storage
  saveMedia(filename: string, buffer: Buffer): string {
    this.ensureDirs();
    const filePath = path.join(UPLOADS_DIR, path.basename(filename));
    fs.writeFileSync(filePath, buffer);
    return `/api/media/${path.basename(filename)}`;
  }

  getMedia(filename: string): { buffer: Buffer; contentType: string } | null {
    const filePath = path.join(UPLOADS_DIR, path.basename(filename));
    if (!fs.existsSync(filePath)) return null;

    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const types: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    return { buffer, contentType: types[ext] || 'application/octet-stream' };
  }
}

export const localStore = new LocalStore();
