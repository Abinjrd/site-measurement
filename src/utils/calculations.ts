import { Room, CalculationSummary } from '../types';

export const calculateRoomArea = (room: Room): CalculationSummary => {
  const totalWallArea = room.walls.reduce((sum, wall) => {
    return sum + (wall.height * wall.width);
  }, 0);

  const totalOpeningsArea = room.openings.reduce((sum, opening) => {
    return sum + (opening.height * opening.width);
  }, 0);

  const ceilingArea = room.ceiling?.includeCeiling 
    ? (room.ceiling.length * room.ceiling.width) 
    : 0;

  const netArea = Math.max(0, totalWallArea - totalOpeningsArea + ceilingArea);

  return {
    totalWallArea,
    totalOpeningsArea,
    ceilingArea,
    netArea
  };
};

export const calculateProjectTotal = (rooms: Room[]): number => {
  return rooms.reduce((total, room) => {
    const { netArea } = calculateRoomArea(room);
    return total + netArea;
  }, 0);
};

export const formatArea = (area: number): string => {
  return area.toFixed(2);
};