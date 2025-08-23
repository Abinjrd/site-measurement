import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Home, Ruler } from 'lucide-react';
import { Room } from './types';
import { RoomCard } from './components/RoomCard';
import { ProjectSummary } from './components/ProjectSummary';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: uuidv4(),
      name: `Room ${rooms.length + 1}`,
      walls: [],
      openings: [],
      ceiling: {
        length: 0,
        width: 0,
        includeCeiling: false,
        runningFeet: 0
      }
    };
    setRooms([...rooms, newRoom]);
  };

  const handleUpdateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, ...updates } : room
    ));
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
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Ruler className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Wall Surface Area Calculator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate net surface area including walls and ceilings for gypsum board and wallpaper installations. 
            Add rooms, walls, doors, windows, and ceilings to get precise measurements.
          </p>
        </motion.div>

        {/* Add Room Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddRoom}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-3 shadow-lg font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add New Room
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Rooms Section */}
          <div className="xl:col-span-2 space-y-6">
            <AnimatePresence>
              {rooms.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center"
                >
                  <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Rooms Added Yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start by adding your first room to begin calculating wall surface areas
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddRoom}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                    onRemoveRoom={handleRemoveRoom}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Summary Section */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <ProjectSummary rooms={rooms} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 pt-8 border-t border-gray-200"
        >
          <p className="text-gray-500 text-sm">
            Professional tool for gypsum board and wallpaper contractors
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;