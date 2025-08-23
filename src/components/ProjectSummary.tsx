import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, Download } from 'lucide-react';
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
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
        <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Add rooms to see project summary</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Calculator className="w-6 h-6 text-blue-600" />
          Project Summary
        </h2>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </div>
      </div>

      <div className="space-y-4">
        {rooms.map((room) => {
          const summary = calculateRoomArea(room);
          return (
            <div
              key={room.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-semibold text-gray-800">{room.name}</h4>
                <div className="text-sm text-gray-600 flex gap-4 mt-1">
                  <span>Walls: {room.walls.length}</span>
                  <span>Openings: {room.openings.length}</span>
                  <span>Running Feet: {room.runningFeet.length}</span>
                  <span>Ceilings: {room.ceilings.length}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {formatArea(summary.netArea)} sq ft
                </div>
                <div className="text-xs text-gray-500">
                  Walls: {formatArea(summary.totalWallArea)} - Openings: {formatArea(summary.totalOpeningsArea)} + Ceiling: {formatArea(summary.ceilingArea)} + Running Feet: {formatArea(summary.runningFeetArea)}
                </div>
              </div>
            </div>
          );
        })}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Total Project Area</h3>
              <p className="text-sm text-gray-600">{rooms.length} room{rooms.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {formatArea(projectTotal)} sq ft
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};