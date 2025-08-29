import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Wall } from '../types';

interface CeilingInputProps {
  ceilings: Wall[];
  onAddCeiling: (ceiling: Omit<Wall, 'id'>) => void;
  onRemoveCeiling: (id: string) => void;
  onUpdateCeiling: (id: string, updates: Partial<Wall>) => void;
}

export const CeilingInput: React.FC<CeilingInputProps> = ({
  ceilings,
  onAddCeiling,
  onRemoveCeiling,
  onUpdateCeiling
}) => {
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleAddCeiling = () => {
    const h = parseFloat(height);
    const w = parseFloat(width);
    const q = parseInt(quantity) || 1;
    
    if (h > 0 && w > 0 && q > 0) {
      onAddCeiling({ height: h, width: w, quantity: q });
      setHeight('');
      setWidth('');
      setQuantity('1');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCeiling();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-700 text-lg">
          Ceilings
        </h4>
        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Length (ft)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base"
              placeholder="12"
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Width (ft)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base"
              placeholder="10"
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Qty
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base"
              placeholder="1"
              min="1"
            />
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddCeiling}
          className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Ceiling
        </motion.button>
      </div>

      {ceilings.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-600 border-b border-gray-200 pb-2">
            Added Ceilings ({ceilings.length})
          </div>
          {ceilings.map((ceiling, index) => (
            <motion.div
              key={ceiling.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-purple-50 p-4 rounded-xl border border-purple-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Ceiling {index + 1}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveCeiling(ceiling.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Length</label>
                  <input
                    type="number"
                    value={ceiling.height}
                    onChange={(e) => onUpdateCeiling(ceiling.id, { height: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Width</label>
                  <input
                    type="number"
                    value={ceiling.width}
                    onChange={(e) => onUpdateCeiling(ceiling.id, { width: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Qty</label>
                  <input
                    type="number"
                    value={ceiling.quantity}
                    onChange={(e) => onUpdateCeiling(ceiling.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-sm font-medium text-purple-600 bg-white px-3 py-1 rounded-full">
                  {(ceiling.height * ceiling.width * ceiling.quantity).toFixed(2)} sq ft
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};