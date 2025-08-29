import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Wall } from '../types';

interface WallInputProps {
  walls: Wall[];
  defaultHeight: number | null;
  onAddWall: (wall: Omit<Wall, 'id'>) => void;
  onRemoveWall: (id: string) => void;
  onUpdateWall: (id: string, updates: Partial<Wall>) => void;
}

export const WallInput: React.FC<WallInputProps> = ({
  walls,
  defaultHeight,
  onAddWall,
  onRemoveWall,
  onUpdateWall
}) => {
  const [height, setHeight] = useState(defaultHeight?.toString() || '');
  const [width, setWidth] = useState('');
  const [quantity, setQuantity] = useState('1');

  // Update height when defaultHeight changes
  React.useEffect(() => {
    if (defaultHeight !== null) {
      setHeight(defaultHeight.toString());
    }
  }, [defaultHeight]);

  const handleAddWall = () => {
    const h = parseFloat(height);
    const w = parseFloat(width);
    const q = parseInt(quantity) || 1;
    
    if (h > 0 && w > 0 && q > 0) {
      onAddWall({ height: h, width: w, quantity: q });
      setHeight(defaultHeight?.toString() || h.toString());
      setWidth('');
      setQuantity('1');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddWall();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-700 text-lg">
          Walls
        </h4>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      </div>
      
      {/* Mobile-optimized input grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Height (ft)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              placeholder={defaultHeight?.toString() || "8"}
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              placeholder="12"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              placeholder="1"
              min="1"
            />
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddWall}
          className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Wall
        </motion.button>
      </div>

      {walls.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-600 border-b border-gray-200 pb-2">
            Added Walls ({walls.length})
          </div>
          {walls.map((wall, index) => (
            <motion.div
              key={wall.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 p-4 rounded-xl border border-blue-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">Wall {index + 1}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveWall(wall.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Height</label>
                  <input
                    type="number"
                    value={wall.height}
                    onChange={(e) => onUpdateWall(wall.id, { height: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Width</label>
                  <input
                    type="number"
                    value={wall.width}
                    onChange={(e) => onUpdateWall(wall.id, { width: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Qty</label>
                  <input
                    type="number"
                    value={wall.quantity}
                    onChange={(e) => onUpdateWall(wall.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-sm font-medium text-blue-600 bg-white px-3 py-1 rounded-full">
                  {(wall.height * wall.width * wall.quantity).toFixed(2)} sq ft
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};