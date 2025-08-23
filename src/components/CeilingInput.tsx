import React from 'react';
import { motion } from 'framer-motion';
import { Square } from 'lucide-react';

interface CeilingInputProps {
  ceiling?: {
    length: number;
    width: number;
    includeCeiling: boolean;
  };
  onUpdateCeiling: (ceiling: { length: number; width: number; includeCeiling: boolean }) => void;
}

export const CeilingInput: React.FC<CeilingInputProps> = ({
  ceiling,
  onUpdateCeiling
}) => {
  const handleToggleCeiling = () => {
    const newCeiling = {
      length: ceiling?.length || 0,
      width: ceiling?.width || 0,
      includeCeiling: !ceiling?.includeCeiling
    };
    onUpdateCeiling(newCeiling);
  };

  const handleUpdateDimension = (field: 'length' | 'width', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newCeiling = {
      length: ceiling?.length || 0,
      width: ceiling?.width || 0,
      includeCeiling: ceiling?.includeCeiling || false,
      [field]: numValue
    };
    onUpdateCeiling(newCeiling);
  };

  const ceilingArea = ceiling?.includeCeiling ? (ceiling.length * ceiling.width) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Ceiling
        </h4>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleCeiling}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            ceiling?.includeCeiling
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {ceiling?.includeCeiling ? 'Included' : 'Include Ceiling'}
        </motion.button>
      </div>

      {ceiling?.includeCeiling && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Length (ft)
              </label>
              <input
                type="number"
                value={ceiling.length || ''}
                onChange={(e) => handleUpdateDimension('length', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="12"
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
                value={ceiling.width || ''}
                onChange={(e) => handleUpdateDimension('width', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="10"
                step="0.1"
                min="0"
              />
            </div>
          </div>

          {ceilingArea > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-purple-50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">
                  Ceiling: {ceiling.length}' × {ceiling.width}'
                </span>
              </div>
              <span className="text-sm text-gray-800 font-medium">
                = {ceilingArea.toFixed(2)} sq ft
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};