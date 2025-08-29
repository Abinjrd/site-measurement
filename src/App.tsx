import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Home, Ruler, FileText, User, Menu } from 'lucide-react';
import { Room, ProjectDetails } from './types';
import { RoomCard } from './components/RoomCard';
import { ProjectSummary } from './components/ProjectSummary';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [defaultWallHeight, setDefaultWallHeight] = useState<number | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    projectName: '',
    clientName: '',
    clientAddress: '',
    contractorName: '',
    contractorPhone: ''
  });

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: uuidv4(),
      name: `Room ${rooms.length + 1}`,
      walls: [],
      openings: [],
      runningFeet: [],
      ceilings: []
    };
    setRooms([...rooms, newRoom]);
  };

  const handleUpdateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, ...updates } : room
    ));
    
    // Auto-set default wall height from first wall added
    if (updates.walls && updates.walls.length > 0 && defaultWallHeight === null) {
      const firstWall = updates.walls[0];
      if (firstWall && firstWall.height > 0) {
        setDefaultWallHeight(firstWall.height);
      }
    }
  };

  const handleRemoveRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Ruler className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Wall Calculator
                </h1>
                <p className="text-xs text-gray-500">
                  Surface area calculator
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSummary(true)}
              className="p-2 bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProjectDetails(true)}
            className="flex-1 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 shadow-sm font-medium"
          >
            <User className="w-4 h-4" />
            Project Info
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddRoom}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Room
          </motion.button>
        </div>
      </div>

      {/* Default Wall Height Indicator */}
      {defaultWallHeight !== null && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
          <div className="text-center">
            <span className="text-sm text-blue-700">
              Default wall height: <strong>{defaultWallHeight} ft</strong>
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 py-4">
        <AnimatePresence>
          {rooms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mt-8"
            >
              <div className="p-4 bg-gray-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Home className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Rooms Added
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Start by adding your first room to begin calculating wall surface areas for your project
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddRoom}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Add Your First Room
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onUpdateRoom={handleUpdateRoom}
                  defaultWallHeight={defaultWallHeight}
                  onRemoveRoom={handleRemoveRoom}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Summary Overlay */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowSummary(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Project Summary</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSummary(false)}
                    className="p-2 bg-gray-100 rounded-lg"
                  >
                    <Menu className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
                <ProjectSummary rooms={rooms} projectDetails={projectDetails} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={showProjectDetails}
        onClose={() => setShowProjectDetails(false)}
        projectDetails={projectDetails}
        onUpdateProjectDetails={setProjectDetails}
      />
    </div>
  );
}

export default App;