import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, DoorOpen, Square } from 'lucide-react';
import { Opening } from '../types';

interface OpeningInputProps {
  openings: Opening[];
  onAddOpening: (opening: Omit<Opening, 'id'>) => void;
  onRemoveOpening: (id: string) => void;
  onUpdateOpening: (id: string, updates: Partial<Opening>) => void;
}

export const OpeningInput: React.FC<OpeningInputProps> = ({
  openings,
  onAddOpening,
  onRemoveOpening,
  onUpdateOpening
}) => {
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [type, setType] = useState<'door' | 'window'>('door');

  const handleAddOpening = () => {
    const h = parseFloat(height);
    const w = parseFloat(width);
    const q = parseInt(quantity) || 1;
    
    if (h > 0 && w > 0 && q > 0) {
      onAddOpening({ height: h, width: w, type, quantity: q });
      setHeight('');
      setWidth('');
      setQuantity('1');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddOpening();
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
        Doors & Windows
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'door' | 'window')}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="door">Door</option>
            <option value="window">Window</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Height (ft)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            placeholder="7"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            placeholder="3"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            placeholder="1"
            min="1"
          />
        </div>
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddOpening}
            className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Opening
          </motion.button>
        </div>
      </div>

      {openings.length > 0 && (
        <div className="space-y-2">
          {openings.map((opening, index) => (
            <motion.div
              key={opening.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {opening.type === 'door' ? (
                    <DoorOpen className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Square className="w-4 h-4 text-amber-600" />
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {opening.type.charAt(0).toUpperCase() + opening.type.slice(1)} {index + 1}:
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={opening.height}
                    onChange={(e) => onUpdateOpening(opening.id, { height: parseFloat(e.target.value) || 0 })}
                    className="w-14 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-amber-500"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500">×</span>
                  <input
                    type="number"
                    value={opening.width}
                    onChange={(e) => onUpdateOpening(opening.id, { width: parseFloat(e.target.value) || 0 })}
                    className="w-14 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-amber-500"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500">×</span>
                  <input
                    type="number"
                    value={opening.quantity}
                    onChange={(e) => onUpdateOpening(opening.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-12 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-amber-500"
                    min="1"
                  />
                  <span className="text-xs text-gray-500">qty</span>
                </div>
                <span className="text-sm text-gray-800 font-medium">
                  = {(opening.height * opening.width * opening.quantity).toFixed(2)} sq ft
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveOpening(opening.id)}
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