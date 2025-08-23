import React from 'react';
import { motion } from 'framer-motion';
import { Square, Ruler } from 'lucide-react';

interface CeilingInputProps {
  ceiling?: {
    length: number;
    width: number;
    includeCeiling: boolean;
    runningFeet: number;
  };
  onUpdateCeiling: (ceiling: { length: number; width: number; includeCeiling: boolean; runningFeet: number }) => void;
}

export const CeilingInput: React.FC<CeilingInputProps> = ({
  ceiling,
  onUpdateCeiling
}) => {
  const handleToggleCeiling = () => {
    const newCeiling = {
      length: ceiling?.length || 0,
      width: ceiling?.width || 0,
      runningFeet: ceiling?.runningFeet || 0,
      includeCeiling: !ceiling?.includeCeiling
    };
    onUpdateCeiling(newCeiling);
  };

  const handleUpdateDimension = (field: 'length' | 'width' | 'runningFeet', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newCeiling = {
      length: ceiling?.length || 0,
      width: ceiling?.width || 0,
      runningFeet: ceiling?.runningFeet || 0,
      includeCeiling: ceiling?.includeCeiling || false,
      [field]: numValue
    };
    onUpdateCeiling(newCeiling);
  };

  const ceilingArea = ceiling?.includeCeiling ? (ceiling.length * ceiling.width) : 0;
  const runningFeetArea = ceiling?.runningFeet || 0;
  const totalCeilingArea = ceilingArea + runningFeetArea;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-purple-800 flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Square className="w-5 h-5 text-white" />
          </div>
          Ceiling Measurements (Priority)
        </h4>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleCeiling}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            ceiling?.includeCeiling
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {ceiling?.includeCeiling ? 'Ceiling Included' : 'Include Ceiling'}
        </motion.button>
      </div>

      <div className="space-y-4">
        {/* Always show ceiling inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              Length (ft)
            </label>
            <input
              type="number"
              value={ceiling?.length || ''}
              onChange={(e) => handleUpdateDimension('length', e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg"
              placeholder="12"
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              Width (ft)
            </label>
            <input
              type="number"
              value={ceiling?.width || ''}
              onChange={(e) => handleUpdateDimension('width', e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg"
              placeholder="10"
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              Running Feet
            </label>
            <input
              type="number"
              value={ceiling?.runningFeet || ''}
              onChange={(e) => handleUpdateDimension('runningFeet', e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg"
              placeholder="0"
              step="0.1"
              min="0"
            />
          </div>
        </div>

        {/* Area calculations */}
        <div className="space-y-3">
          {ceilingArea > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-purple-100 p-4 rounded-lg border border-purple-200"
            >
              <div className="flex items-center gap-3">
                <Square className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">
                  Ceiling Area: {ceiling?.length}' × {ceiling?.width}'
                </span>
              </div>
              <span className="text-lg font-bold text-purple-800">
                {formatArea(ceilingArea)} sq ft
              </span>
            </motion.div>
          )}

          {runningFeetArea > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-indigo-100 p-4 rounded-lg border border-indigo-200"
            >
              <div className="flex items-center gap-3">
                <Ruler className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-indigo-800">
                  Running Feet Measurement
                </span>
              </div>
              <span className="text-lg font-bold text-indigo-800">
                {formatArea(runningFeetArea)} sq ft
              </span>
            </motion.div>
          )}

          {totalCeilingArea > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-lg text-white shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-1 bg-white bg-opacity-20 rounded">
                  <Square className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">
                  Total Ceiling Contribution
                </span>
              </div>
              <span className="text-2xl font-bold">
                {formatArea(totalCeilingArea)} sq ft
              </span>
            </motion.div>
          )}
        </div>

        <div className="text-sm text-purple-700 bg-purple-50 p-3 rounded-lg border border-purple-200">
          <p className="font-medium mb-1">💡 Ceiling Calculation Notes:</p>
          <ul className="space-y-1 text-xs">
            <li>• Ceiling area = Length × Width (square footage)</li>
            <li>• Running feet = Linear measurement (added directly to total)</li>
            <li>• Both measurements are included in the final area calculation</li>
            <li>• Toggle "Include Ceiling" to add/remove from project total</li>
          </ul>
        </div>
      </div>
    </div>
  );
};