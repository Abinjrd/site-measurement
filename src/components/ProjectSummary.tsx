import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, Download, X } from 'lucide-react';
import { Room } from '../types';
import { calculateRoomArea, calculateProjectTotal, formatArea } from '../utils/calculations';
import { exportToPDF, exportToCSV } from '../utils/export';
import { ProjectDetails } from '../types';

interface ProjectSummaryProps {
  rooms: Room[];
  projectDetails: ProjectDetails;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ rooms, projectDetails }) => {
  const projectTotal = calculateProjectTotal(rooms);

  const handleExportPDF = () => {
    exportToPDF(rooms, projectDetails);
  };

  const handleExportCSV = () => {
    exportToCSV(rooms, projectDetails);
  };

  if (rooms.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Calculator className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">Add rooms to see project summary</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Project Total Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
        <div className="text-center">
          <div className="text-sm opacity-90 mb-1">Total Project Area</div>
          <div className="text-3xl font-bold mb-1">{formatArea(projectTotal)} sq ft</div>
          <div className="text-sm opacity-75">{rooms.length} room{rooms.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportPDF}
          className="bg-red-600 text-white py-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
        >
          <FileText className="w-5 h-5" />
          Export PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportCSV}
          className="bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </motion.button>
      </div>

      {/* Room Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Room Breakdown</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {rooms.map((room) => {
            const summary = calculateRoomArea(room);
            return (
              <div key={room.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{room.name}</h4>
                  <div className="text-lg font-bold text-blue-600">
                    {formatArea(summary.netArea)} sq ft
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Walls:</span>
                      <span className="text-blue-600 font-medium">{formatArea(summary.totalWallArea)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ceilings:</span>
                      <span className="text-purple-600 font-medium">{formatArea(summary.ceilingArea)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Openings:</span>
                      <span className="text-red-600 font-medium">-{formatArea(summary.totalOpeningsArea)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Running Feet:</span>
                      <span className="text-green-600 font-medium">{formatArea(summary.runningFeetArea)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};