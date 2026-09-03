import React from 'react';
import { Axe, Sun, Moon, Sparkles } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header
      className={`sticky top-0 z-50 px-4 sm:px-8 py-3.5 border-b backdrop-blur-md transition-colors duration-200 no-print ${
        darkMode ? 'bg-gray-900/90 border-gray-800 text-gray-100' : 'bg-white/90 border-gray-200 text-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-xl shadow-md shadow-blue-500/20">
            <Axe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                CutWizard
              </h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Multi-Pass
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Optimizador 2D de Cortes para Carpintería y Melamina
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            aria-label="Cambiar tema"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:scale-105 active:scale-95 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Modo Oscuro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
