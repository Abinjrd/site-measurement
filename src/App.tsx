import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Home, Ruler, FileText, User } from 'lucide-react';
import { Room, ProjectDetails } from './types';
import { RoomCard } from './components/RoomCard';
import { ProjectSummary } from './components/ProjectSummary';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [defaultWallHeight, setDefaultWallHeight] = useState<number | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 px-2"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Ruler className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 text-center">
              Wall Surface Area Calculator
            </h1>
          </div>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Calculate net surface area including walls and ceilings for gypsum board and wallpaper installations. 
            Add rooms, walls, doors, windows, and ceilings to get precise measurements.
          </p>
        </motion.div>

        {/* Add Room Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 px-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProjectDetails(true)}
            className="bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-3 shadow-lg font-semibold text-sm sm:text-base"
          >
            <User className="w-5 h-5" />
            Project Details
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddRoom}
            className="bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 shadow-lg font-semibold text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            Add New Room
          </motion.button>
        </motion.div>

        {/* Show default wall height if set */}
        {defaultWallHeight !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-6 px-4"
          >
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center gap-2 max-w-full">
              <span className="text-xs sm:text-sm text-blue-700 text-center">
                Default wall height set to: <strong>{defaultWallHeight} ft</strong>
              </span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8 px-2 sm:px-0">
          {/* Rooms Section */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <AnimatePresence>
              {rooms.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-6 sm:p-12 rounded-xl shadow-lg border border-gray-100 text-center"
                >
                  <Home className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                    No Rooms Added Yet
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-6">
                    Start by adding your first room to begin calculating wall surface areas
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddRoom}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Add Your First Room
                  </motion.button>
                </motion.div>
              ) : (
                rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onUpdateRoom={handleUpdateRoom}
                  defaultWallHeight={defaultWallHeight}
                    onRemoveRoom={handleRemoveRoom}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Summary Section */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <ProjectSummary rooms={rooms} projectDetails={projectDetails} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 px-4"
        >
          <p className="text-gray-500 text-xs sm:text-sm">
            Professional tool for gypsum board and wallpaper contractors
          </p>
        </motion.footer>

        {/* Project Details Modal */}
        <ProjectDetailsModal
          isOpen={showProjectDetails}
          onClose={() => setShowProjectDetails(false)}
          projectDetails={projectDetails}
          onUpdateProjectDetails={setProjectDetails}
        />
      </div>
    </div>
  );
}

export default App;