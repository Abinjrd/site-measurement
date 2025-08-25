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
      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        Ceilings
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Length (ft)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
            placeholder="12"
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Width (ft)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
            placeholder="10"
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
            placeholder="1"
            min="1"
          />
        </div>
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddCeiling}
            className="w-full bg-purple-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Ceiling</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </div>

      {ceilings.length > 0 && (
        <div className="space-y-2">
          {ceilings.map((ceiling, index) => (
            <motion.div
              key={ceiling.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 rounded-lg gap-2 sm:gap-0"
            >
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
                  Ceiling {index + 1}:
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  <input
                    type="number"
                    value={ceiling.height}
                    onChange={(e) => onUpdateCeiling(ceiling.id, { height: parseFloat(e.target.value) || 0 })}
                    className="w-12 sm:w-14 px-1 sm:px-2 py-1 text-xs sm:text-sm border border-gray-200 rounded focus:ring-1 focus:ring-purple-500"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500 hidden sm:inline">×</span>
                  <input
                    type="number"
                    value={ceiling.width}
                    onChange={(e) => onUpdateCeiling(ceiling.id, { width: parseFloat(e.target.value) || 0 })}
                    className="w-12 sm:w-14 px-1 sm:px-2 py-1 text-xs sm:text-sm border border-gray-200 rounded focus:ring-1 focus:ring-purple-500"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500 hidden sm:inline">×</span>
                  <input
                    type="number"
                    value={ceiling.quantity}
                    onChange={(e) => onUpdateCeiling(ceiling.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-10 sm:w-12 px-1 sm:px-2 py-1 text-xs sm:text-sm border border-gray-200 rounded focus:ring-1 focus:ring-purple-500"
                    min="1"
                  />
                  <span className="text-xs text-gray-500 hidden sm:inline">qty</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-800 font-medium whitespace-nowrap">
                  = {(ceiling.height * ceiling.width * ceiling.quantity).toFixed(2)} sq ft
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveCeiling(ceiling.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 sm:p-0 self-end sm:self-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};