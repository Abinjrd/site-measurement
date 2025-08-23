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
      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Running Feet
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Length (ft)
          </label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="10"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="1"
            min="1"
          />
        </div>
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddRunningFeet}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Running Feet
          </motion.button>
        </div>
      </div>

      {runningFeet.length > 0 && (
        <div className="space-y-2">
          {runningFeet.map((rf, index) => (
            <motion.div
              key={rf.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Running Feet {index + 1}:
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={rf.length}
                    onChange={(e) => onUpdateRunningFeet(rf.id, { length: parseFloat(e.target.value) || 0 })}
                    className="w-14 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-green-500"
                    step="0.1"
                    min="0"
                  />
                  <span className="text-xs text-gray-500">×</span>
                  <input
                    type="number"
                    value={rf.quantity}
                    onChange={(e) => onUpdateRunningFeet(rf.id, { quantity: parseInt(e.target.value) || 1 })}
                    className="w-12 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-green-500"
                    min="1"
                  />
                  <span className="text-xs text-gray-500">qty</span>
                </div>
                <span className="text-sm text-gray-800 font-medium">
                  = {(rf.length * rf.quantity).toFixed(2)} sq ft
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemoveRunningFeet(rf.id)}
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