export interface Wall {
  id: string;
  height: number;
  width: number;
  quantity: number;
}

export interface Opening {
  id: string;
  height: number;
  width: number;
  type: 'door' | 'window';
  quantity: number;
}

export interface RunningFeet {
  id: string;
  length: number;
  quantity: number;
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  openings: Opening[];
  runningFeet: RunningFeet[];
  ceiling?: {
    length: number;
    width: number;
    includeCeiling: boolean;
  };
}

export interface CalculationSummary {
  totalWallArea: number;
  totalOpeningsArea: number;
  ceilingArea: number;
  runningFeetArea: number;
  netArea: number;
}