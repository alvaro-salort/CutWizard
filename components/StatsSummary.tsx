import React from 'react';
import { FileText, Download, TrendingUp, AlertTriangle, Layers, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import { OptimizationResult } from '../types';
import { exportOptimizationCSV } from '../services/csvHelper';

interface StatsSummaryProps {
  result: OptimizationResult | null;
  darkMode: boolean;
  onExportPDF: () => void;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ result, darkMode, onExportPDF }) => {
  if (!result || result.boards.length === 0) {
    return (
      <div
        className={`rounded-2xl shadow-sm border p-6 text-center transition-colors duration-200 ${
          darkMode ? 'bg-gray-800/80 border-gray-700/80 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
        }`}
      >
        <p className="text-sm">Configura tus piezas y presiona <strong>Optimizar Cortes</strong> para ver las estadísticas.</p>
      </div>
    );
  }

  const usefulOffcutsTotal = result.boards.reduce((acc, b) => acc + (b.usefulOffcutsCount || 0), 0);

  return (
    <div
      className={`rounded-2xl shadow-sm border p-5 transition-colors duration-200 ${
        darkMode ? 'bg-gray-800/80 border-gray-700/80 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      {/* Barra superior de título y exportaciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Métricas de Rendimiento
          </h2>
        </div>

        <div className="flex items-center gap-2 no-print self-end sm:self-auto">
          <button
            onClick={onExportPDF}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 active:scale-95 shadow-sm"
            title="Imprimir o Guardar como PDF"
          >
            <FileText className="w-3.5 h-3.5 text-red-500" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            onClick={() => exportOptimizationCSV(result)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 active:scale-95 shadow-sm"
            title="Exportar reporte de cortes en formato CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>CSV Planos</span>
          </button>
        </div>
      </div>

      {/* Grid de Métricas 3x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {/* Aprovechamiento */}
        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-green-950/20 border-green-800/60' : 'bg-green-50/70 border-green-200'}`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-green-700 dark:text-green-300 mb-2">
            <TrendingUp className="w-4 h-4 flex-shrink-0" />
            <span>Aprovechamiento</span>
          </div>
          <div className="text-3xl font-extrabold text-green-700 dark:text-green-400">
            {result.totalEfficiency.toFixed(1)}%
          </div>
        </div>

        {/* Desperdicio */}
        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-amber-950/20 border-amber-800/60' : 'bg-amber-50/70 border-amber-200'}`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Desperdicio Total</span>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {result.totalWaste.toFixed(1)}%
          </div>
        </div>

        {/* Tableros */}
        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-blue-950/20 border-blue-800/60' : 'bg-blue-50/70 border-blue-200'}`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span>Tableros</span>
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {result.totalBoards}
          </div>
        </div>

        {/* Piezas Colocadas */}
        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-gray-750/50 border-gray-700' : 'bg-gray-50/80 border-gray-200'}`}>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span>Piezas Cortadas</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
            {result.totalPartsCount}
          </div>
        </div>

        {/* Metros de Corte */}
        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-gray-750/50 border-gray-700' : 'bg-gray-50/80 border-gray-200'}`}>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
            <Ruler className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span>Corte Lineal</span>
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
            {result.totalLinearCuts} <span className="text-sm font-semibold">m</span>
          </div>
        </div>

        {/* Retazos Útiles */}
        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-gray-750/50 border-gray-700' : 'bg-gray-50/80 border-gray-200'}`}>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
            <Sparkles className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <span>Retazos Útiles</span>
          </div>
          <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
            {usefulOffcutsTotal} <span className="text-sm font-semibold">piezas</span>
          </div>
        </div>
      </div>

      {/* Alerta de piezas no colocadas si las hubiera */}
      {result.unplacedPieces.length > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Atención:</strong> {result.unplacedPieces.length} pieza(s) superan las dimensiones útiles de la placa y no pudieron ser colocadas.
          </span>
        </div>
      )}
    </div>
  );
};
