import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle2, Box as BoxIcon, Plus, Trash2 } from 'lucide-react';
import { wholesaleData } from '../data/wholesale';
import Container3D from './Container3D';

interface SmartLogisticsToolProps {
  initialCategory?: string;
  className?: string;
}

export interface LoadedItem {
  id: string;
  category: string;
  size: string;
  quantity: number;
  cartons: number;
  volume: number;
  color: { top: string; left: string; right: string; hex: string };
}

const CATEGORY_COLORS: Record<string, { top: string; left: string; right: string; hex: string }> = {
  'Polish': { top: '#d946ef', left: '#c026d3', right: '#a21caf', hex: '#d946ef' }, // Fuchsia
  'Cream': { top: '#60a5fa', left: '#3b82f6', right: '#2563eb', hex: '#3b82f6' }, // Blue
  'Suede': { top: '#34d399', left: '#10b981', right: '#059669', hex: '#10b981' }, // Emerald
  'Dye': { top: '#fbbf24', left: '#f59e0b', right: '#d97706', hex: '#f59e0b' }, // Amber
};

const SmartLogisticsTool: React.FC<SmartLogisticsToolProps> = ({ initialCategory, className = '' }) => {
  const [calcCategory, setCalcCategory] = useState('Polish');
  const [calcSize, setCalcSize] = useState('');
  const [calcQuantity, setCalcQuantity] = useState<number | ''>('');
  const [containerType, setContainerType] = useState<'20ft' | '40ft'>('20ft');
  
  const [loadedItems, setLoadedItems] = useState<LoadedItem[]>([]);

  useEffect(() => {
    if (initialCategory && Object.keys(wholesaleData).includes(initialCategory)) {
      setCalcCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleAddItem = () => {
    if (!calcSize || !calcQuantity || typeof calcQuantity !== 'number') return;
    
    // @ts-ignore
    const categoryData = wholesaleData[calcCategory];
    if (!categoryData) return;

    // @ts-ignore
    const spec = categoryData.specs.find(s => s.size === calcSize);
    if (!spec) return;

    const cartons = Math.ceil(calcQuantity / spec.unitsPerCarton);
    const dimMatch = spec.dimensions.match(/(\d+)cm x (\d+)cm x (\d+)cm/);
    let volume = 0;
    if (dimMatch) {
      const l = parseInt(dimMatch[1]) / 100;
      const w = parseInt(dimMatch[2]) / 100;
      const h = parseInt(dimMatch[3]) / 100;
      volume = l * w * h * cartons;
    }

    const newItem: LoadedItem = {
      id: Math.random().toString(36).substr(2, 9),
      category: calcCategory,
      size: calcSize,
      quantity: calcQuantity,
      cartons,
      volume,
      color: CATEGORY_COLORS[calcCategory] || CATEGORY_COLORS['Polish']
    };

    setLoadedItems([...loadedItems, newItem]);
    setCalcQuantity(''); // Reset quantity after adding
  };

  const handleRemoveItem = (id: string) => {
    setLoadedItems(loadedItems.filter(item => item.id !== id));
  };

  const totalVolume = loadedItems.reduce((sum, item) => sum + item.volume, 0);
  const totalCartons = loadedItems.reduce((sum, item) => sum + item.cartons, 0);

  return (
    <div className={`bg-gray-900 rounded-2xl p-6 text-white flex flex-col shadow-2xl relative overflow-hidden ${className}`}>
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-10 -translate-y-10">
        <Calculator size={140} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-500 p-2 rounded-lg text-white">
            <Calculator size={20} />
          </div>
          <h3 className="text-xl font-bold">Smart Logistics Tool</h3>
        </div>
        
        <p className="text-gray-400 text-sm mb-6">
          Calculate shipping requirements instantly. Add multiple products to see cumulative container loading.
        </p>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Product</label>
              <select 
                value={calcCategory}
                onChange={(e) => {
                  setCalcCategory(e.target.value);
                  setCalcSize('');
                }}
                className="w-full bg-gray-800 border-gray-700 rounded-lg text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {Object.keys(wholesaleData).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Size</label>
              <select 
                value={calcSize}
                onChange={(e) => setCalcSize(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 rounded-lg text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">Select...</option>
                {/* @ts-ignore */}
                {wholesaleData[calcCategory] && wholesaleData[calcCategory].specs.map((s, i) => (
                  <option key={i} value={s.size}>{s.size}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quantity (Units)</label>
              <input 
                type="number" 
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(parseInt(e.target.value) || '')}
                placeholder="e.g. 5000"
                className="w-full bg-gray-800 border-gray-700 rounded-lg text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <button 
              onClick={handleAddItem}
              disabled={!calcSize || !calcQuantity}
              className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors h-[38px]"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Container Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setContainerType('20ft')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                  containerType === '20ft' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                20ft Container
              </button>
              <button
                onClick={() => setContainerType('40ft')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                  containerType === '40ft' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                40ft Container
              </button>
            </div>
          </div>
        </div>

        {loadedItems.length > 0 ? (
          <div className="space-y-4">
            {/* Loaded Items List */}
            <div className="bg-gray-800 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
              {loadedItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-gray-900 p-2 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color.hex }}></div>
                    <div>
                      <span className="font-bold text-gray-200">{item.category}</span>
                      <span className="text-gray-500 ml-2 text-xs">{item.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-gray-300 font-medium">{item.quantity} units</div>
                      <div className="text-gray-500 text-xs">{item.cartons} cartons</div>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary-600/20 border border-primary-500/30 rounded-xl p-4 animate-fade-in-up">
              <h4 className="flex items-center gap-2 font-bold text-primary-400 mb-3 text-sm">
                <CheckCircle2 size={16} /> Cumulative Requirements
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">{totalCartons}</div>
                  <div className="text-xs text-gray-400">Total Cartons</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{totalVolume.toFixed(2)} m³</div>
                  <div className="text-xs text-gray-400">Total Volume</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 animate-fade-in-up">
              <h4 className="flex items-center gap-2 font-bold text-gray-300 mb-3 text-sm">
                <BoxIcon size={16} /> 3D Loading Preview
              </h4>
              <Container3D 
                items={loadedItems} 
                containerType={containerType} 
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-500 text-sm border border-gray-700 border-dashed">
            <BoxIcon size={32} className="mx-auto mb-2 opacity-50" />
            Add products above to visualize container loading.
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartLogisticsTool;