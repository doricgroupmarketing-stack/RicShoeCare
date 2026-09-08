import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';
import { Product } from '../types';
import { useToast } from '../context/ToastContext';

export const useInventory = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchInventory = useCallback(async () => {
    try {
      const { data, error } = await inventoryService.getAll();
      
      if (error) {
        console.error('Inventory fetch error:', error);
      } else if (data) {
        setItems(data);
      }
    } catch (err) {
      console.error('Inventory fetch exception:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteItem = async (id: string) => {
    const { error } = await inventoryService.delete(id);
    if (error) {
      showToast('Failed to delete item', 'error');
    } else {
      showToast('Item deleted successfully', 'success');
      fetchInventory();
    }
  };

  const addItem = async (product: Product) => {
    const { error } = await inventoryService.save(product);
    if (error) {
      showToast('Failed to add item', 'error');
    } else {
      showToast('Item added successfully', 'success');
      fetchInventory();
    }
  };

  const updateItem = async (product: Product) => {
    const { error } = await inventoryService.save(product);
    if (error) {
      showToast('Failed to update item', 'error');
    } else {
      showToast('Item updated successfully', 'success');
      fetchInventory();
    }
  };

  useEffect(() => {
    fetchInventory();

    const handleUpdate = () => {
      fetchInventory();
    };

    window.addEventListener('inventory-updated', handleUpdate);
    return () => {
      window.removeEventListener('inventory-updated', handleUpdate);
    };
  }, [fetchInventory]);

  return {
    items,
    loading,
    refresh: fetchInventory,
    deleteItem,
    addItem,
    updateItem
  };
};
