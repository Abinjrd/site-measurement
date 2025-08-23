import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import { Room, Wall, Opening } from '../types';
import { WallInput } from './WallInput';
import { OpeningInput } from './OpeningInput';
import { CeilingInput } from './CeilingInput';
import { calculateRoomArea, formatArea } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';

interface RoomCardProps {
  room: Room;
  onUpdateRoom: (id: string, updates: Partial<Room>) => void;
  onRemoveRoom: (id: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onUpdateRoom,
  onRemoveRoom
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(room.name);

  const summary = calculateRoomArea(room);

  const handleAddWall = (wallData: Omit<Wall, 'id'>) => {
    const newWall: Wall = { ...wallData, id: uuidv4() };
    onUpdateRoom(room.id, { walls: [...room.walls, newWall] });
  };

  const handleRemoveWall = (wallId: string) => {
    onUpdateRoom(room.id, { walls: room.walls.filter(w => w.id !== wallId) });
  };

  const handleUpdateWall = (wallId: string, updates: Partial<Wall>) => {
    onUpdateRoom(room.id, {
      walls: room.walls.map(w => w.id === wallId ? { ...w, ...updates } : w)
    });
  };

  const handleAddOpening = (openingData: Omit<Opening, 'id'>) => {
    const newOpening: Opening = { ...openingData, id: uuidv4() };
    onUpdateRoom(room.id, { openings: [...room.openings, newOpening] });
  };

  const handleRemoveOpening = (openingId: string) => {
    onUpdateRoom(room.id, { openings: room.openings.filter(o => o.id !== openingId) });
  };

  const handleUpdateOpening = (openingId: string, updates: Partial<Opening>) => {
    onUpdateRoom(room.id, {
      openings: room.openings.map(o => o.id === openingId ? { ...o, ...updates } : o)
    });
  };

  const handleUpdateCeiling = (ceiling: { length: number; width: number; includeCeiling: boolean }) => {
    onUpdateRoom(room.id, { ceiling });
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdateRoom(room.id, { name: editedName.trim() });
    } else {
      setEditedName(room.name);
    }
    setIsEditingName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setEditedName(room.name);
      setIsEditingName(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 bg-transparent focus:outline-none"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSaveName}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setEditedName(room.name);
                  setIsEditingName(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditingName(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemoveRoom(room.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>

      {/* All measurements with equal importance */}
      <div className="space-y-6 mb-6">
        <CeilingInput
          ceiling={room.ceiling}
          onUpdateCeiling={handleUpdateCeiling}
        />

        <WallInput
          walls={room.walls}
          onAddWall={handleAddWall}
          onRemoveWall={handleRemoveWall}
          onUpdateWall={handleUpdateWall}
        />
        <OpeningInput
          openings={room.openings}
          onAddOpening={handleAddOpening}
          onRemoveOpening={handleRemoveOpening}
          onUpdateOpening={handleUpdateOpening}
        />
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
        <h5 className="font-semibold text-gray-700 mb-3">Room Summary</h5>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Wall Area:</span>
            <div className="font-bold text-blue-600">{formatArea(summary.totalWallArea)} sq ft</div>
          </div>
          <div>
            <span className="text-gray-600">Openings Area:</span>
            <div className="font-bold text-amber-600">{formatArea(summary.totalOpeningsArea)} sq ft</div>
          </div>
          <div>
            <span className="text-gray-600">Ceiling Area:</span>
            <div className="font-bold text-purple-600">{formatArea(summary.ceilingArea)} sq ft</div>
          </div>
          <div>
            <span className="text-gray-600">Net Area:</span>
            <div className="font-bold text-green-600 text-lg">{formatArea(summary.netArea)} sq ft</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};