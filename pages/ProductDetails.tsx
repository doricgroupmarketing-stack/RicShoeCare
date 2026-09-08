import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, Truck, Box, Loader, Palette, Ruler } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { Product } from '../types';
import SmartLogisticsTool from '../components/SmartLogisticsTool';
import SEOHead from '../components/SEOHead';

const getColorHex = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('black')) return '#000000';
  if (n.includes('dark tan')) return '#8B4513'; // SaddleBrown
  if (n.includes('mid brown')) return '#6F4E37'; // Coffee
  if (n.includes('toney red')) return '#9E2A2B'; // Deep Red/Brown
  if (n.includes('dark brown')) return '#3E2723'; // Dark Bean
  if (n.includes('brown')) return '#5D4037'; // Brown
  if (n.includes('tan')) return '#D2B48C'; // Tan
  if (n.includes('neutral')) return '#F5F5F5'; // WhiteSmoke
  if (n.includes('calf white') || n.includes('white')) return '#FFFFFF';
  if (n.includes('kashmire')) return '#E3DAC9'; // Bone/Cream
  if (n.includes('navy')) return '#000080'; // Navy
  if (n.includes('burgundy')) return '#800020'; // Burgundy
  if (n.includes('grey') || n.includes('gray')) return '#808080';
  return '#e5e5e5';
};

const InteractiveDescription = ({ 
  description, 
  onOptionSelect,
  hasColors = false,
  hasSizes = false
}: { 
  description: string, 
  onOptionSelect: (type: string, value: string) => void,
  hasColors?: boolean,
  hasSizes?: boolean
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sections = description.split(/\n\s*\n/);
  const intro = sections[0];
  const specs = sections.slice(1);

  const handleSelect = (type: 'color' | 'size', value: string) => {
    if (type === 'color') setSelectedColor(value);
    if (type === 'size') setSelectedSize(value);
    onOptionSelect(type, value);
  };

  const parseSizeItem = (item: string) => {
    const match = item.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      return { name: match[1], detail: match[2] };
    }
    return { name: item, detail: '' };
  };

  const hasSpecs = specs.some(s => s.includes('•'));

  return (
    <div className="space-y-8 mb-8">
      <p className="text-gray-600 text-lg leading-relaxed">{intro}</p>

      {hasSpecs && (
        <div className="space-y-8 mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          {specs.map((section, idx) => {
            if (section.includes('•')) {
              const lines = section.split('\n');
              const rawTitle = lines[0];
              const items = lines.slice(1).map(l => l.replace(/^•\s*/, '').trim());
              
              const isColorSection = rawTitle.toLowerCase().includes('color') || rawTitle.toLowerCase().includes('shade');
              const isSizeSection = rawTitle.toLowerCase().includes('size');
              
              let title = rawTitle;
              let SectionIcon = null;

              if (isColorSection) {
                title = "Select Color";
                SectionIcon = Palette;
              } else if (isSizeSection) {
                title = "Select Size";
                SectionIcon = Ruler;
              }

              const shouldRenderInteractive = (isColorSection && !hasColors) || (isSizeSection && !hasSizes);

              return (
                <div key={idx} className="animate-fade-in">
                  <p className="text-gray-700 font-medium mb-4">{rawTitle}</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                  
                  {shouldRenderInteractive && (
                    <>
                      <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                        {SectionIcon && <SectionIcon size={18} className="text-primary-600" />}
                        {title}
                        {isColorSection && selectedColor && (
                          <span className="text-gray-500 normal-case ml-1">- {selectedColor}</span>
                        )}
                        {isSizeSection && selectedSize && (
                          <span className="text-gray-500 normal-case ml-1">- {parseSizeItem(selectedSize).name}</span>
                        )}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {items.map((item, i) => {
                          if (isColorSection) {
                            const isSelected = selectedColor === item;
                            return (
                              <button
                                key={i}
                                onClick={() => handleSelect('color', item)}
                                title={item}
                                className={`group relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 cursor-pointer ${
                                  isSelected 
                                    ? 'border-primary-600 ring-2 ring-primary-100 shadow-md scale-110' 
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm hover:scale-105'
                                }`}
                                style={{ backgroundColor: getColorHex(item) }}
                              >
                                {isSelected && (
                                  <Check 
                                    size={16} 
                                    className={`${item.toLowerCase().includes('white') || item.toLowerCase().includes('neutral') || item.toLowerCase().includes('tan') || item.toLowerCase().includes('kashmire') ? 'text-gray-900' : 'text-white'}`} 
                                  />
                                )}
                                <span className="sr-only">{item}</span>
                              </button>
                            );
                          } else {
                            const isSelected = selectedSize === item;
                            const { name, detail } = parseSizeItem(item);
                            return (
                              <button
                                key={i}
                                onClick={() => handleSelect('size', item)}
                                className={`px-5 py-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1 min-w-[110px] cursor-pointer ${
                                  isSelected
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg transform scale-105'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md'
                                }`}
                              >
                                <span className="font-bold text-sm">{name}</span>
                                {detail && <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{detail}</span>}
                              </button>
                            );
                          }
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            } else {
              return <p key={idx} className="text-gray-700 font-medium">{section}</p>;
            }
          })}
        </div>
      )}
    </div>
  );
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items: products, loading } = useInventory();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<{color?: string, size?: string}>({});

  useEffect(() => {
    if (loading) return;
    window.scrollTo(0, 0);
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImage(found.image);
      setSelectedOptions({});
    } else {
      // If items loaded but product not found, redirect
      if (products.length > 0) navigate('/shop');
    }
  }, [id, products, loading, navigate]);

  const getRelatedProducts = () => {
    if (!product) return [];
    
    let related = products.filter(p => p.category === product.category && p.id !== product.id);
    if (related.length < 4) {
      const others = products.filter(p => p.category !== product.category && p.id !== product.id);
      related = [...related, ...others];
    }
    return related.slice(0, 4);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <Loader className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (!product) return null;

  const relatedProducts = getRelatedProducts();
  const galleryImages = [product.image, ...(product.gallery || [])].filter(Boolean);
  // Ensure we have at least 4 items for layout consistency or just show what we have
  const displayThumbnails = galleryImages.length > 0 ? galleryImages : [product.image];

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description.substring(0, 160),
    "brand": {
      "@type": "Brand",
      "name": "RIC"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEOHead 
        title={product.name} 
        description={product.description}
        schema={productSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <nav className="flex mb-8 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 relative group flex items-center justify-center">
              {activeImage ? (
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <ShoppingBag size={64} className="text-gray-300" />
              )}
            </div>
            {displayThumbnails.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {displayThumbnails.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-lg overflow-hidden border ${activeImage === img ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'} cursor-pointer hover:border-primary-300 transition-colors flex items-center justify-center bg-gray-50`}
                  >
                    {img ? (
                      <img 
                        src={img} 
                        alt={`Thumbnail ${i + 1}`} 
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity" 
                      />
                    ) : (
                      <ShoppingBag size={20} className="text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wide">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">{product.name}</h1>
            
            <InteractiveDescription 
              description={product.description} 
              onOptionSelect={(type, value) => setSelectedOptions(prev => ({...prev, [type]: value}))}
              hasColors={product.colors && product.colors.length > 0}
              hasSizes={product.sizes && product.sizes.length > 0}
            />

            {/* Explicitly render colors if they exist in the product data */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette size={18} className="text-primary-600" />
                  Select Color
                  {selectedOptions.color && <span className="text-gray-500 normal-case ml-1 text-sm">- {selectedOptions.color}</span>}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, idx) => {
                    const isSelected = selectedOptions.color === color;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedOptions(prev => ({...prev, color}))}
                        title={color}
                        className={`group relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'border-primary-600 ring-2 ring-primary-100 shadow-md scale-110' 
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm hover:scale-105'
                        }`}
                        style={{ backgroundColor: getColorHex(color) }}
                      >
                        {isSelected && (
                          <Check 
                            size={16} 
                            className={`${color.toLowerCase().includes('white') || color.toLowerCase().includes('neutral') || color.toLowerCase().includes('tan') || color.toLowerCase().includes('kashmire') ? 'text-gray-900' : 'text-white'}`} 
                          />
                        )}
                        <span className="sr-only">{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Explicitly render sizes if they exist in the product data */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Ruler size={18} className="text-primary-600" />
                  Select Size
                  {selectedOptions.size && <span className="text-gray-500 normal-case ml-1 text-sm">- {selectedOptions.size}</span>}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size, idx) => {
                    const isSelected = selectedOptions.size === size;
                    // Try to parse size like "Small (15ml)"
                    const match = size.match(/^(.*?)\s*\((.*?)\)$/);
                    const name = match ? match[1] : size;
                    const detail = match ? match[2] : '';
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedOptions(prev => ({...prev, size}))}
                        className={`px-5 py-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1 min-w-[110px] cursor-pointer ${
                          isSelected
                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg transform scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md'
                        }`}
                      >
                        <span className="font-bold text-sm">{name}</span>
                        {detail && <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{detail}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <Check size={20} className="text-primary-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mb-24 bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
             <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs mb-2">
                  <Box size={14} /> Wholesale Available
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Ordering in Bulk?</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Plan your logistics efficiently with our smart calculator. Get instant estimates on carton counts and volume for shipping.
                </p>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500 pt-2">
                   <div className="flex items-center gap-2"><Check size={16} className="text-primary-600"/> Factory Direct</div>
                   <div className="flex items-center gap-2"><Check size={16} className="text-primary-600"/> Global Shipping</div>
                </div>
                <div className="pt-4">
                  <Link to="/contact" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 hover:underline">
                    Contact Sales for Pricing <Truck size={16} className="ml-2" />
                  </Link>
                </div>
             </div>
             <div className="w-full lg:w-[400px]">
                <SmartLogisticsTool initialCategory={product.category} />
             </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((rp) => (
              <Link 
                to={`/product/${rp.id}`} 
                key={rp.id}
                className="group block"
              >
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 border border-gray-100 relative">
                  <img 
                    src={rp.image} 
                    alt={rp.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingBag size={16} className="text-primary-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{rp.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate">{rp.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;