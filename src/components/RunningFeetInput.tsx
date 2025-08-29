import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Ruler } from 'lucide-react';
import { RunningFeet } from '../types';

interface RunningFeetInputProps {
  runningFeet: RunningFeet[];
  onAddRunningFeet: (runningFeet: Omit<RunningFeet, 'id'>) => void;
  onRemoveRunningFeet: (id: string) => void;
  onUpdateRunningFeet: (id: string, updates: Partial<RunningFeet>) => void;
}

export const RunningFeetInput: React.FC<RunningFeetInputProps> = ({
  runningFeet,
  onAddRunningFeet,
  onRemoveRunningFeet,
  onUpdateRunningFeet
}) => {
  const [length, setLength] = useState('');
  const [quantity, setQuantity] = useState('1');

  const handleAddRunningFeet = () => {
    const l = parseFloat(length);
    const q = parseInt(quantity) || 1;
    
    if (l > 0 && q > 0) {
      onAddRunningFeet({ length: l, quantity: q });
      setLength('');
      setQuantity('1');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddRunningFeet();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-700 text-lg">
          Running Feet
        </h4>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Length (ft)
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base"
              placeholder="1"
              min="1"
            />
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddRunningFeet}
          className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Running Feet
        </motion.button>
      </div>

      {runningFeet.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-600 border-b border-gray-200 pb-2">
            Added Running Feet ({runningFeet.length})
          </div>
          {runningFeet.map((rf, index) => (
            <motion.div
              key={rf.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 p-4 rounded-xl border border-green-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-700">
                    Running Feet {index + 1}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveRunningFeet(rf.id)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Length</label>
                  <input
                    type="number"
                    value={rf.length}
                    onChange={(e) => onUpdateRunningFeet(rf.id, { length: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Qty</label>
                  <input
                    type="number"
                    value={rf.quantity}
                    onChange={(e) => onUpdateRunningFeet(rf.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <span className="text-sm font-medium text-green-600 bg-white px-3 py-1 rounded-full">
                  {(rf.length * rf.quantity).toFixed(2)} sq ft
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};