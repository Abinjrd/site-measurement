import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit3, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(true);

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
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Room Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg font-bold text-gray-800 border-b-2 border-blue-500 bg-transparent focus:outline-none flex-1 min-w-0"
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSaveName}
                  className="p-2 text-green-600 hover:text-green-700"
                >
                  <Check className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setEditedName(room.name);
                    setIsEditingName(false);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 truncate">{room.name}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditingName(true)}
                  className="p-1 text-gray-400 hover:text-gray-600"
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
            className="p-2 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Room Summary */}
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Net Area
            </div>
            <div className="text-xl font-bold text-blue-600">
              {formatArea(summary.netArea)} sq ft
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-gray-500 py-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Details
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
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

              {/* Detailed Breakdown */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h5 className="font-semibold text-gray-700 mb-3">Calculation Breakdown</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wall Area:</span>
                    <span className="font-medium text-blue-600">{formatArea(summary.totalWallArea)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Openings (subtract):</span>
                    <span className="font-medium text-red-600">-{formatArea(summary.totalOpeningsArea)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ceiling Area:</span>
                    <span className="font-medium text-purple-600">{formatArea(summary.ceilingArea)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Running Feet:</span>
                    <span className="font-medium text-green-600">{formatArea(summary.runningFeetArea)} sq ft</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Net Total:</span>
                      <span className="font-bold text-lg text-blue-600">{formatArea(summary.netArea)} sq ft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};