import { Piece, Board, PlacedPiece, Rect, OptimizationResult, Settings } from '../types';


const generateColor = (index: number) => {
  const colors = [
    '#fca5a5', // Red
    '#fde047', // Yellow
    '#86efac', // Green
    '#93c5fd', // Blue
    '#d8b4fe', // Purple
    '#fdba74', // Orange
    '#94a3b8', // Slate
    '#5eead4', // Teal
  ];
  return colors[index % colors.length];
};


const fits = (pieceW: number, pieceH: number, rect: Rect) => {
  return pieceW <= rect.w && pieceH <= rect.h;
};

export const optimizeCuts = (
  piecesInput: Piece[],
  settings: Settings
): OptimizationResult => {
  const { boardWidth, boardHeight, kerf } = settings;

  let allPieces: { w: number; h: number; id: string; originalId: string; color: string, label: string }[] = [];
  
  piecesInput.forEach((p, idx) => {
    if (p.width <= 0 || p.height <= 0 || p.quantity <= 0) return;

    for (let i = 0; i < p.quantity; i++) {
      allPieces.push({
        w: p.width,
        h: p.height,
        id: `${p.id}-${i}`,
        originalId: p.id,
        color: generateColor(idx),
        label: `${p.width}x${p.height}`
      });
    }
  });

  allPieces.sort((a, b) => (b.h * b.w) - (a.h * a.w));

  const boards: Board[] = [];
  const unplacedPieces: Piece[] = [];

  const createBoard = (id: number): Board => ({
    id,
    width: boardWidth,
    height: boardHeight,
    placedPieces: [],
    freeRects: [{ x: 0, y: 0, w: boardWidth, h: boardHeight }],
    efficiency: 0,
    waste: 100
  });

  boards.push(createBoard(1));

  for (const piece of allPieces) {
    let placed = false;

    for (const board of boards) {
      let bestRectIndex = -1;
      let minWaste = Number.MAX_VALUE;
      let bestRotated = false;

      for (let i = 0; i < board.freeRects.length; i++) {
        const rect = board.freeRects[i];
        
        if (fits(piece.w, piece.h, rect)) {
          const waste = (rect.w * rect.h) - (piece.w * piece.h);
          if (waste < minWaste) {
            minWaste = waste;
            bestRectIndex = i;
            bestRotated = false;
          }
        }

        if (piece.w !== piece.h) {
            if (fits(piece.h, piece.w, rect)) {
                const waste = (rect.w * rect.h) - (piece.h * piece.w);
                if (waste < minWaste) {
                    minWaste = waste;
                    bestRectIndex = i;
                    bestRotated = true;
                }
            }
        }
      }

      if (bestRectIndex !== -1) {
        const rect = board.freeRects[bestRectIndex];
        
        const placedW = bestRotated ? piece.h : piece.w;
        const placedH = bestRotated ? piece.w : piece.h;

        board.placedPieces.push({
          x: rect.x,
          y: rect.y,
          w: placedW,
          h: placedH,
          id: piece.id,
          originalId: piece.originalId,
          color: piece.color,
          label: piece.label
        });

        board.freeRects.splice(bestRectIndex, 1);

        const actualPlacedW = placedW + kerf;
        const actualPlacedH = placedH + kerf;

        const freeW = rect.w - actualPlacedW;
        const freeH = rect.h - actualPlacedH;

        let newRects: Rect[] = [];

        if (freeW < freeH) {
             if (rect.h - actualPlacedH > 0) {
                newRects.push({
                    x: rect.x,
                    y: rect.y + actualPlacedH,
                    w: rect.w,
                    h: rect.h - actualPlacedH
                 });
             }
             if (rect.w - actualPlacedW > 0) {
                 newRects.push({
                    x: rect.x + actualPlacedW,
                    y: rect.y,
                    w: rect.w - actualPlacedW,
                    h: actualPlacedH
                 });
             }
        } else {
            if (rect.w - actualPlacedW > 0) {
                newRects.push({
                    x: rect.x + actualPlacedW,
                    y: rect.y,
                    w: rect.w - actualPlacedW,
                    h: rect.h
                });
            }
            if (rect.h - actualPlacedH > 0) {
                newRects.push({
                    x: rect.x,
                    y: rect.y + actualPlacedH,
                    w: actualPlacedW, 
                    h: rect.h - actualPlacedH
                });
            }
        }
        
        newRects = newRects.filter(r => r.w > 0 && r.h > 0);
        board.freeRects.push(...newRects);

        placed = true;
        break; 
      }
    }

    if (!placed) {
      const fitsNormal = piece.w <= boardWidth && piece.h <= boardHeight;
      const fitsRotated = piece.h <= boardWidth && piece.w <= boardHeight;

      if (!fitsNormal && !fitsRotated) {
          unplacedPieces.push({
             id: piece.originalId,
             width: piece.w,
             height: piece.h,
             quantity: 1
          });
          continue; 
      }

      const newBoard = createBoard(boards.length + 1);
      boards.push(newBoard);
      
      let useRotated = false;
      if (fitsRotated && !fitsNormal) {
          useRotated = true;
      } 
      
      const placedW = useRotated ? piece.h : piece.w;
      const placedH = useRotated ? piece.w : piece.h;

       newBoard.placedPieces.push({
          x: 0,
          y: 0,
          w: placedW,
          h: placedH,
          id: piece.id,
          originalId: piece.originalId,
          color: piece.color,
          label: piece.label
        });
        
        const actualPlacedW = placedW + kerf;
        const actualPlacedH = placedH + kerf;
        
        newBoard.freeRects = []; 
        
        const freeW = boardWidth - actualPlacedW;
        const freeH = boardHeight - actualPlacedH;

        if (freeW < freeH) {
            if (boardHeight - actualPlacedH > 0)
                newBoard.freeRects.push({ x: 0, y: actualPlacedH, w: boardWidth, h: boardHeight - actualPlacedH });
            
            if (boardWidth - actualPlacedW > 0)
                newBoard.freeRects.push({ x: actualPlacedW, y: 0, w: boardWidth - actualPlacedW, h: actualPlacedH });
        } else {
             if (boardWidth - actualPlacedW > 0)
                newBoard.freeRects.push({ x: actualPlacedW, y: 0, w: boardWidth - actualPlacedW, h: boardHeight });
            
            if (boardHeight - actualPlacedH > 0)
                newBoard.freeRects.push({ x: 0, y: actualPlacedH, w: actualPlacedW, h: boardHeight - actualPlacedH });
        }
        
        newBoard.freeRects = newBoard.freeRects.filter(r => r.w > 0 && r.h > 0);
    }
  }

  let sumEfficiency = 0;
  boards.forEach(b => {
    const usedArea = b.placedPieces.reduce((acc, p) => acc + (p.w * p.h), 0);
    const totalArea = b.width * b.height;
    b.efficiency = (usedArea / totalArea) * 100;
    b.waste = 100 - b.efficiency;
    sumEfficiency += b.efficiency;
  });

  return {
    boards,
    totalBoards: boards.length,
    totalEfficiency: boards.length > 0 ? sumEfficiency / boards.length : 0,
    totalWaste: boards.length > 0 ? 100 - (sumEfficiency / boards.length) : 0,
    unplacedPieces
  };
};