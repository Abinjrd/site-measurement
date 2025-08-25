import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import { Room, Wall, Opening } from '../types';
import { RunningFeet } from '../types';
import { WallInput } from './WallInput';
import { OpeningInput } from './OpeningInput';
import { RunningFeetInput } from './RunningFeetInput';
import { CeilingInput } from './CeilingInput';
import { calculateRoomArea, formatArea } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';

interface RoomCardProps {
  room: Room;
  defaultWallHeight: number | null;
  onUpdateRoom: (id: string, updates: Partial<Room>) => void;
  onRemoveRoom: (id: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  defaultWallHeight,
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

  const handleAddCeiling = (ceilingData: Omit<Wall, 'id'>) => {
    const newCeiling: Wall = { ...ceilingData, id: uuidv4() };
    onUpdateRoom(room.id, { ceilings: [...room.ceilings, newCeiling] });
  };

  const handleRemoveCeiling = (ceilingId: string) => {
    onUpdateRoom(room.id, { ceilings: room.ceilings.filter(c => c.id !== ceilingId) });
  };

  const handleUpdateCeiling = (ceilingId: string, updates: Partial<Wall>) => {
    onUpdateRoom(room.id, {
      ceilings: room.ceilings.map(c => c.id === ceilingId ? { ...c, ...updates } : c)
    });
  };

  const handleAddRunningFeet = (runningFeetData: Omit<RunningFeet, 'id'>) => {
    const newRunningFeet: RunningFeet = { ...runningFeetData, id: uuidv4() };
    onUpdateRoom(room.id, { runningFeet: [...room.runningFeet, newRunningFeet] });
  };

  const handleRemoveRunningFeet = (runningFeetId: string) => {
    onUpdateRoom(room.id, { runningFeet: room.runningFeet.filter(rf => rf.id !== runningFeetId) });
  };

  const handleUpdateRunningFeet = (runningFeetId: string, updates: Partial<RunningFeet>) => {
    onUpdateRoom(room.id, {
      runningFeet: room.runningFeet.map(rf => rf.id === runningFeetId ? { ...rf, ...updates } : rf)
    });
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
      className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg sm:text-xl font-bold text-gray-800 border-b-2 border-blue-500 bg-transparent focus:outline-none min-w-0 flex-1"
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
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{room.name}</h3>
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
      <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
        <CeilingInput
          ceilings={room.ceilings}
          onAddCeiling={handleAddCeiling}
          onRemoveCeiling={handleRemoveCeiling}
          onUpdateCeiling={handleUpdateCeiling}
        />

        <WallInput
          walls={room.walls}
          defaultHeight={defaultWallHeight}
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
        
        <RunningFeetInput
          runningFeet={room.runningFeet}
          onAddRunningFeet={handleAddRunningFeet}
          onRemoveRunningFeet={handleRemoveRunningFeet}
          onUpdateRunningFeet={handleUpdateRunningFeet}
        />
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
        <h5 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">Room Summary</h5>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-gray-600">Total Wall Area:</span>
            <div className="font-bold text-blue-600 text-sm sm:text-base">{formatArea(summary.totalWallArea)} sq ft</div>
          </div>
          <div>
            <span className="text-gray-600">Openings Area:</span>
            <div className="font-bold text-amber-600 text-sm sm:text-base">{formatArea(summary.totalOpeningsArea)} sq ft</div>
          </div>
          <div>
            <span className="text-gray-600">Ceiling Area:</span>
            <div className="font-bold text-purple-600 text-sm sm:text-base">{formatArea(summary.ceilingArea)} sq ft</div>
          </div>
          <div>
            <span className="text-gray-600">Running Feet:</span>
            <div className="font-bold text-green-600 text-sm sm:text-base">{formatArea(summary.runningFeetArea)} sq ft</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 col-span-2 sm:col-span-4">
          <div>
            <span className="text-gray-600 text-xs sm:text-sm">Net Total Area:</span>
            <div className="font-bold text-gray-800 text-base sm:text-lg">{formatArea(summary.netArea)} sq ft</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};