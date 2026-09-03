import { Piece, Settings } from '../types';

const STORAGE_KEYS = {
  PIECES: 'cutwizard_pieces_v2',
  SETTINGS: 'cutwizard_settings_v2',
  THEME: 'cutwizard_theme_v2',
};

export const DEFAULT_SETTINGS: Settings = {
  boardWidth: 2440,
  boardHeight: 1220,
  kerf: 3,
  trimMargin: 10,
};

export const DEFAULT_PIECES: Piece[] = [
  { id: '1', name: 'Lateral Izquierdo', width: 600, height: 750, quantity: 2, canRotate: false },
  { id: '2', name: 'Puerta Principal', width: 450, height: 750, quantity: 2, canRotate: false },
  { id: '3', name: 'Tapa Superior', width: 900, height: 600, quantity: 1, canRotate: true },
  { id: '4', name: 'Estantes Interiores', width: 864, height: 550, quantity: 3, canRotate: true },
  { id: '5', name: 'Frente Cajón', width: 860, height: 180, quantity: 2, canRotate: false },
];

export const loadStoredSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      boardWidth: Number(parsed.boardWidth) || DEFAULT_SETTINGS.boardWidth,
      boardHeight: Number(parsed.boardHeight) || DEFAULT_SETTINGS.boardHeight,
      kerf: Number(parsed.kerf) ?? DEFAULT_SETTINGS.kerf,
      trimMargin: Number(parsed.trimMargin) ?? DEFAULT_SETTINGS.trimMargin,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignorar si hay problemas de cuota o modo incógnito
  }
};

export const loadStoredPieces = (): Piece[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PIECES);
    if (!raw) return DEFAULT_PIECES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PIECES;
    return parsed.map((p, idx) => ({
      id: p.id || String(idx + 1),
      name: p.name || `Pieza ${idx + 1}`,
      width: Number(p.width) || 0,
      height: Number(p.height) || 0,
      quantity: Math.max(1, Number(p.quantity) || 1),
      canRotate: p.canRotate !== false,
      color: p.color,
    }));
  } catch {
    return DEFAULT_PIECES;
  }
};

export const saveStoredPieces = (pieces: Piece[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PIECES, JSON.stringify(pieces));
  } catch {
    // Ignorar si storage falla
  }
};

export const loadStoredDarkMode = (): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME);
    if (raw !== null) {
      return raw === 'dark';
    }
    // Detectar preferencia del sistema operativo si no está seteado
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export const saveStoredDarkMode = (isDark: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  } catch {
    // Ignorar
  }
};
