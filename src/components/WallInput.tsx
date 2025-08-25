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

  const handleAddWall = () => {
    const h = parseFloat(height);
    const w = parseFloat(width);
    const q = parseInt(quantity) || 1;
    
    if (h > 0 && w > 0 && q > 0) {
      onAddWall({ height: h, width: w, quantity: q });
      setHeight(defaultHeight?.toString() || '');
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
      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        Walls
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Height (ft)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={defaultHeight?.toString() || "8"}
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Width (ft)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="12"
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="1"
            min="1"
          />
        </div>
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddWall}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Wall
          </motion.button>
        </div>
      </div>

      {walls.length > 0 && (
        <div className="space-y-2">
          {walls.map((wall, index) => (
            <motion.div
              key={wall.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Wall {index + 1}:
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={wall.height}
                    onChange={(e) => onUpdateWall(wall.id, { height: parseFloat(e.target.value) || 0 })}
                    className="w-14 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500">×</span>
                  <input
                    type="number"
                    value={wall.width}
                    onChange={(e) => onUpdateWall(wall.id, { width: parseFloat(e.target.value) || 0 })}
                    className="w-14 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500">×</span>
                  <input
                    type="number"
                    value={wall.quantity}
                    onChange={(e) => onUpdateWall(wall.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-12 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                    min="1"
                  />
                  <span className="text-xs text-gray-500">qty</span>
                </div>
                <span className="text-sm text-gray-800 font-medium">
                  = {(wall.height * wall.width * wall.quantity).toFixed(2)} sq ft
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveWall(wall.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
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