import { Product } from '../types';
import { products as defaultProducts } from '../data/products';

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}

class InventoryService {
  /**
   * Fetch all products from the backend API or fallback.
   */
  async getAll(): Promise<ServiceResponse<Product[]>> {
    try {
      const res = await fetch('/api/products?order=created_at.desc');
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      }

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        return { data: defaultProducts, error: null };
      }

      // Map backend columns to Product interface
      const mappedData: Product[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        description: item.description || '',
        image: item.image_url || item.image || '',
        gallery: Array.isArray(item.gallery) ? item.gallery : [],
        category: item.category || 'Uncategorized',
        rating: Number(item.rating) || 5.0,
        reviews: Number(item.reviews) || 0,
        features: typeof item.features === 'string' 
          ? JSON.parse(item.features) 
          : (Array.isArray(item.features) ? item.features : []),
        sizes: typeof item.sizes === 'string'
          ? JSON.parse(item.sizes)
          : (Array.isArray(item.sizes) ? item.sizes : []),
        colors: typeof item.colors === 'string'
          ? JSON.parse(item.colors)
          : (Array.isArray(item.colors) ? item.colors : [])
      }));

      return { data: mappedData, error: null };
    } catch (error: any) {
      console.warn('Notice fetching inventory, using default catalog:', error.message || error);
      return { data: defaultProducts, error: null };
    }
  }

  /**
   * Delete a product by ID.
   */
  async delete(id: string): Promise<ServiceResponse<string>> {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete product');

      window.dispatchEvent(new CustomEvent('inventory-updated'));
      return { data: id, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Add or Update a product.
   */
  async save(product: Product): Promise<ServiceResponse<Product>> {
    try {
      const dbProduct: any = {
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image,
        gallery: product.gallery || [],
        category: product.category,
        features: product.features,
        sizes: product.sizes,
        colors: product.colors,
        rating: product.rating,
        reviews: product.reviews,
        updated_at: new Date().toISOString()
      };

      if (product.id) {
        dbProduct.id = product.id;
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbProduct)
      });

      if (!res.ok) throw new Error('Failed to save product');

      const data = await res.json();

      const savedProduct: Product = {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        description: data.description,
        image: data.image_url || data.image,
        gallery: data.gallery,
        category: data.category,
        rating: data.rating,
        reviews: data.reviews,
        features: data.features,
        sizes: data.sizes,
        colors: data.colors
      };

      window.dispatchEvent(new CustomEvent('inventory-updated'));
      return { data: savedProduct, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}

export const inventoryService = new InventoryService();
