import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, ArrowRight, X, Loader } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { Product } from '../types';
import SEOHead from '../components/SEOHead';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { items: products, loading } = useInventory();

  useEffect(() => {
    if (products.length === 0) return;

    if (categoryParam) {
      const filtered = products.filter(p => p.category.toLowerCase() === categoryParam.toLowerCase());
      setFilteredProducts(filtered);
    } else {
      // Default view (all or specific set if needed, currently showing all for simplicity in dynamic mode)
      setFilteredProducts(products);
    }
  }, [categoryParam, products]);

  const categories = ['All', 'Polish', 'Cream', 'Suede', 'Dye'];

  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <SEOHead 
        title={categoryParam ? `${categoryParam} - Shop` : "Shop"} 
        description="Browse our range of premium shoe care products including polish, creams, dyes, and cleaners."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Products` : 'Shop Premium Care Products'}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Professional-grade tools and formulas to maintain your collection at home.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, idx) => {
            const isActive = (cat === 'All' && !categoryParam) || (categoryParam?.toLowerCase() === cat.toLowerCase());
            return (
              <button 
                key={idx}
                onClick={() => handleCategoryClick(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader className="animate-spin text-primary-600" size={32} />
           </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link 
                to={`/product/${product.id}`} 
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ShoppingBag size={48} className="text-gray-300" />
                  )}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ShoppingBag size={20} className="text-primary-600" />
                  </div>
                  <div className="absolute top-4 left-4 bg-gray-900/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-end pt-4 border-t border-gray-50">
                    <span className="text-sm font-bold text-primary-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Details <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
            <button 
              onClick={() => setSearchParams({})}
              className="mt-4 text-primary-600 font-bold hover:underline"
            >
              View all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;