import React from 'react';
import { Sliders, Layers } from 'lucide-react';
import { Settings, BoardPreset } from '../types';

interface SettingsPanelProps {
  settings: Settings;
  onChange: (newSettings: Settings) => void;
  darkMode: boolean;
}

export const BOARD_PRESETS: BoardPreset[] = [
  { id: 'melamina-std-1', name: 'Melamina Estándar', width: 2750, height: 1830, description: '2750 × 1830 mm' },
  { id: 'mdf-std', name: 'Placa Comercial', width: 2600, height: 1830, description: '2600 × 1830 mm' },
  { id: 'madera-std', name: 'Fenólico / Terciado', width: 2440, height: 1220, description: '2440 × 1220 mm (8×4 ft)' },
  { id: 'mediana', name: 'Placa Compacta', width: 2140, height: 1600, description: '2140 × 1600 mm' },
  { id: 'cuadrada', name: 'Placa Cuadrada', width: 1830, height: 1830, description: '1830 × 1830 mm' },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange, darkMode }) => {
  const handleInputChange = (field: keyof Settings, value: number) => {
    onChange({
      ...settings,
      [field]: Math.max(0, value),
    });
  };

  const handleApplyPreset = (preset: BoardPreset) => {
    onChange({
      ...settings,
      boardWidth: preset.width,
      boardHeight: preset.height,
    });
  };

  return (
    <div
      className={`rounded-2xl shadow-sm border p-5 transition-colors duration-200 ${darkMode ? 'bg-gray-800/80 border-gray-700/80 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
        }`}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Parámetros del Tablero
          </h2>
        </div>
      </div>

      {/* Selector de Presets de Placas */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          Presets Comerciales:
        </label>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {BOARD_PRESETS.map((preset) => {
            const isSelected = settings.boardWidth === preset.width && settings.boardHeight === preset.height;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-1.5 text-left rounded-lg text-xs font-medium transition-all border ${isSelected
                    ? 'border-blue-500 bg-blue-50/80 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-400 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-750 text-gray-600 dark:text-gray-300'
                  }`}
              >
                <div className="font-semibold truncate">{preset.name}</div>
                <div className="text-[10px] opacity-75">{preset.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs de Medidas */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-1">
              Ancho Placa (mm)
            </label>
            <input
              type="number"
              min="100"
              step="1"
              value={settings.boardWidth || ''}
              onChange={(e) => handleInputChange('boardWidth', Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700/60 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-1">
              Alto Placa (mm)
            </label>
            <input
              type="number"
              min="100"
              step="1"
              value={settings.boardHeight || ''}
              onChange={(e) => handleInputChange('boardHeight', Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700/60 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-1">
              Kerf / Sierra (mm)
            </label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={settings.kerf}
              onChange={(e) => handleInputChange('kerf', Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700/60 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">Espesor de la sierra</span>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block mb-1">
              Refilado / Borde (mm)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={settings.trimMargin}
              onChange={(e) => handleInputChange('trimMargin', Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700/60 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
            />
            <span className="text-[10px] text-gray-400 mt-0.5 block">Margen perimetral a descartar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
