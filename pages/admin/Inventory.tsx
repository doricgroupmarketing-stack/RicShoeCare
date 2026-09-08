import React, { useState } from 'react';
import { Plus, Trash2, Edit2, RefreshCw, WifiOff, X, Save, Upload, Loader, Image as ImageIcon } from 'lucide-react';
import { useInventory } from '../../hooks/useInventory';
import { useNetwork } from '../../hooks/useNetwork';
import { Product } from '../../types';
import { contentService } from '../../services/contentService';
import { useToast } from '../../context/ToastContext';

const Inventory: React.FC = () => {
  const { items, loading, deleteItem, addItem, updateItem, refresh } = useInventory();
  const { isOnline } = useNetwork();
  const { showToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct({ ...product, gallery: product.gallery || [] });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      category: 'Polish',
      image: '',
      gallery: [],
      rating: 5,
      reviews: 0,
      features: []
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentProduct.name || !currentProduct.category) {
      showToast('Please fill in all required fields (Name, Category)', 'error');
      return;
    }

    // Default price to 0 if missing since we removed the input but DB might require it or logic expects it
    const productToSave = { ...currentProduct, price: 0 } as Product;
    
    try {
      if (productToSave.id) {
        await updateItem(productToSave);
      } else {
        await addItem(productToSave);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      // Toast handled in hook
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/webp') {
      showToast('Only PNG, JPG, or WebP files are allowed.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const url = await contentService.uploadMedia(file);
      setCurrentProduct(prev => ({ ...prev, image: url }));
      showToast('Image uploaded successfully', 'success');
    } catch (error: any) {
      showToast(`Upload failed: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/webp') {
           showToast(`Skipped ${file.name}: Invalid format`, 'info');
           continue;
        }
        const url = await contentService.uploadMedia(file);
        newUrls.push(url);
      }
      
      setCurrentProduct(prev => ({ 
        ...prev, 
        gallery: [...(prev.gallery || []), ...newUrls] 
      }));
      
      if (newUrls.length > 0) showToast(`${newUrls.length} images added to gallery`, 'success');
    } catch (error: any) {
      showToast(`Gallery upload failed: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setCurrentProduct(prev => ({
      ...prev,
      gallery: prev.gallery?.filter((_, index) => index !== indexToRemove) || []
    }));
  };

  const categories = ['Polish', 'Cream', 'Suede', 'Dye', 'Kits', 'Protection', 'Tools', 'Accessories', 'Restoration'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-8rem)] relative">
      {/* Network Banner */}
      {!isOnline && (
        <div className="bg-red-50 text-red-700 px-6 py-2 text-sm flex items-center gap-2 font-medium">
          <WifiOff size={14} /> You are currently offline. Changes may not be saved.
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          Product Inventory
          {loading && <RefreshCw size={16} className="animate-spin text-gray-400" />}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={refresh} 
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={openAddModal}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading && items.length === 0 ? (
           <div className="flex items-center justify-center h-full text-gray-400">Loading Inventory...</div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {product.image ? (
                         <img className="h-10 w-10 object-cover" src={product.image} alt="" />
                      ) : (
                         <div className="h-full w-full flex items-center justify-center text-gray-400">
                           <ImageIcon size={20} />
                         </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.features?.length || 0} features listed</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => openEditModal(product)} 
                    className="text-blue-600 hover:text-blue-900 mr-4 p-2 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)} 
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-xl text-gray-900">
                {currentProduct.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Image Upload Column */}
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Main Product Image</label>
                   <div className="border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group mb-4">
                     {currentProduct.image ? (
                        <>
                          <img src={currentProduct.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <p className="text-white font-medium flex items-center gap-2"><Upload size={18}/> Change Image</p>
                          </div>
                        </>
                     ) : (
                        <div className="text-center p-4">
                          <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-2">
                             <ImageIcon className="text-gray-400" size={24} />
                          </div>
                          <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                        </div>
                     )}
                     
                     <input 
                       type="file" 
                       accept="image/*"
                       onChange={handleImageUpload}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                       disabled={isUploading}
                     />
                     
                     {isUploading && (
                       <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                         <Loader className="animate-spin text-primary-600" size={32} />
                       </div>
                     )}
                   </div>

                   {/* Gallery Section */}
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Gallery Images</label>
                     <div className="grid grid-cols-4 gap-2 mb-2">
                        {currentProduct.gallery?.map((img, idx) => (
                           <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                 <X size={10} />
                              </button>
                           </div>
                        ))}
                        <label className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 aspect-square">
                           {isUploading ? <Loader size={16} className="animate-spin text-gray-400"/> : <Plus size={20} className="text-gray-400" />}
                           <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                        </label>
                     </div>
                     <p className="text-xs text-gray-500">Add multiple views of the product.</p>
                   </div>
                </div>

                {/* Fields Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                    <input 
                      type="text" 
                      value={currentProduct.name || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                      placeholder="e.g. Premium Polish"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                    <select 
                      value={currentProduct.category}
                      onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea 
                      rows={4}
                      value={currentProduct.description || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none" 
                      placeholder="Product details..."
                    />
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Key Features (One per line)</label>
                 <textarea 
                    rows={4}
                    value={currentProduct.features?.join('\n') || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, features: e.target.value.split('\n').filter(Boolean)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm bg-gray-50 mb-4"
                    placeholder="• Long lasting shine&#10;• Water resistant&#10;• Easy application"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Available Colors (One per line)</label>
                   <textarea 
                      rows={3}
                      value={currentProduct.colors?.join('\n') || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, colors: e.target.value.split('\n').filter(Boolean)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm bg-gray-50"
                      placeholder="Black&#10;Brown&#10;Tan"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Available Sizes (One per line)</label>
                   <textarea 
                      rows={3}
                      value={currentProduct.sizes?.join('\n') || ''}
                      onChange={(e) => setCurrentProduct({...currentProduct, sizes: e.target.value.split('\n').filter(Boolean)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm bg-gray-50"
                      placeholder="Small (15ml)&#10;Medium (40ml)&#10;Large (100ml)"
                   />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isUploading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
              >
                <Save size={18} /> Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;