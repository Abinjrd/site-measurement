export interface Wall {
  id: string;
  height: number;
  width: number;
}

export interface Opening {
  id: string;
  height: number;
  width: number;
  type: 'door' | 'window';
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
  openings: Opening[];
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
  netArea: number;
}