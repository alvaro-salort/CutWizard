export interface Piece {
  id: string;
  width: number;
  height: number;
  quantity: number;
  color?: string;
  label?: string;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlacedPiece extends Rect {
  id: string;
  originalId: string;
  color: string;
  label: string;
}

export interface Board {
  id: number;
  width: number;
  height: number;
  placedPieces: PlacedPiece[];
  freeRects: Rect[]; 
  efficiency: number; 
  waste: number; 
}

export interface OptimizationResult {
  boards: Board[];
  totalBoards: number;
  totalEfficiency: number; 
  totalWaste: number;
  unplacedPieces: Piece[]; // Pieces that didn't fit anywhere (shouldn't happen)
}

export interface Settings {
  boardWidth: number;
  boardHeight: number;
  kerf: number;
}