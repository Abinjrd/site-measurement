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
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-700 text-lg">
          Doors & Windows
        </h4>
        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setType('door')}
              className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-medium ${
                type === 'door'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}
            >
              <DoorOpen className="w-4 h-4" />
              Door
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setType('window')}
              className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-medium ${
                type === 'window'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}
            >
              <Square className="w-4 h-4" />
              Window
            </motion.button>
          </div>
        </div>
        
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-base"
              placeholder="7"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-base"
              placeholder="3"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-base"
              placeholder="1"
              min="1"
            />
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddOpening}
          className="w-full bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add {type === 'door' ? 'Door' : 'Window'}
        </motion.button>
      </div>

      {openings.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-600 border-b border-gray-200 pb-2">
            Added Openings ({openings.length})
          </div>
          {openings.map((opening, index) => (
            <motion.div
              key={opening.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-orange-50 p-4 rounded-xl border border-orange-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {opening.type === 'door' ? (
                    <DoorOpen className="w-4 h-4 text-orange-600" />
                  ) : (
                    <Square className="w-4 h-4 text-orange-600" />
                  )}
                  <span className="font-medium text-gray-700">
                    {opening.type.charAt(0).toUpperCase() + opening.type.slice(1)} {index + 1}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveOpening(opening.id)}
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
                    value={opening.height}
                    onChange={(e) => onUpdateOpening(opening.id, { height: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-500"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Width</label>
                  <input
                    type="number"
                    value={opening.width}
                    onChange={(e) => onUpdateOpening(opening.id, { width: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-500"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Qty</label>
                  <input
                    type="number"
                    value={opening.quantity}
                    onChange={(e) => onUpdateOpening(opening.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-sm font-medium text-orange-600 bg-white px-3 py-1 rounded-full">
                  -{(opening.height * opening.width * opening.quantity).toFixed(2)} sq ft
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};