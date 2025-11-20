import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, Sun, Moon, Upload, FileText, Download, Axe, Calculator } from 'lucide-react';
import { Piece, Settings, OptimizationResult } from './types';
import { optimizeCuts } from './services/optimizer';
import { Visualizer } from './components/Visualizer';

const App: React.FC = () => {

  const [darkMode, setDarkMode] = useState(false);
  

  const [settings, setSettings] = useState<Settings>({
    boardWidth: 2440,
    boardHeight: 1220,
    kerf: 3,
  });

  const [pieces, setPieces] = useState<Piece[]>([
    { id: '1', width: 300, height: 500, quantity: 5 },
    { id: '2', width: 400, height: 400, quantity: 8 },
    { id: '3', width: 400, height: 800, quantity: 2 },
    { id: '4', width: 200, height: 800, quantity: 2 },
  ]);

  // Results
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // -- Handlers --

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: Number(value) }));
  };

  const updatePiece = (id: string, field: keyof Piece, value: number) => {
    setPieces(pieces.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addPiece = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setPieces([...pieces, { id: newId, width: 0, height: 0, quantity: 1 }]);
  };

  const removePiece = (id: string) => {
    setPieces(pieces.filter(p => p.id !== id));
  };

  const handleOptimize = useCallback(() => {
    setIsOptimizing(true);

    setTimeout(() => {
      const res = optimizeCuts(pieces, settings);
      setResult(res);
      setIsOptimizing(false);
    }, 100);
  }, [pieces, settings]);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!result) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Placa ID,Pieza ID,Ancho,Alto,X,Y\n";
    result.boards.forEach(board => {
      board.placedPieces.forEach(p => {
        csvContent += `${board.id},${p.originalId},${p.w},${p.h},${p.x},${p.y}\n`;
      });
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "optimizacion_cortes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    handleOptimize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      
      {}
      <nav className={`sticky top-0 z-50 px-6 py-4 shadow-sm flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-2">
          <Axe className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold tracking-tight">CutWizard</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <span className="text-xs font-medium opacity-70 hidden sm:block">
            {darkMode ? 'Modo Oscuro' : 'Modo Claro'}
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {}
        <div className="lg:col-span-4 space-y-6 no-print">
          
          {}
          <div className={`rounded-xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b pb-2 dark:border-gray-700">
              Input de Datos
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium opacity-70">Placa Ancho (mm)</label>
                  <input
                    type="number"
                    name="boardWidth"
                    value={settings.boardWidth}
                    onChange={handleSettingChange}
                    className={`w-full p-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium opacity-70">Placa Alto (mm)</label>
                  <input
                    type="number"
                    name="boardHeight"
                    value={settings.boardHeight}
                    onChange={handleSettingChange}
                    className={`w-full p-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium opacity-70">Grosor de Sierra / Kerf (mm)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="kerf"
                    value={settings.kerf}
                    onChange={handleSettingChange}
                    className={`w-full p-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {}
          <div className={`rounded-xl shadow-sm border p-6 flex flex-col h-[500px] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b pb-2 dark:border-gray-700">
              Lista de Piezas
            </h2>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {}
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold opacity-60 mb-2 text-center">
                <div className="col-span-3">Ancho</div>
                <div className="col-span-3">Alto</div>
                <div className="col-span-3">Cant.</div>
                <div className="col-span-3">Acción</div>
              </div>

              {pieces.map((p) => (
                <div key={p.id} className={`grid grid-cols-12 gap-2 items-center p-2 rounded-md ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={p.width}
                      onChange={(e) => updatePiece(p.id, 'width', Number(e.target.value))}
                      className={`w-full p-1 text-center text-sm rounded bg-transparent border-b focus:border-blue-500 outline-none ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                      placeholder="W"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={p.height}
                      onChange={(e) => updatePiece(p.id, 'height', Number(e.target.value))}
                      className={`w-full p-1 text-center text-sm rounded bg-transparent border-b focus:border-blue-500 outline-none ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                      placeholder="H"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={p.quantity}
                      onChange={(e) => updatePiece(p.id, 'quantity', Number(e.target.value))}
                      className={`w-full p-1 text-center text-sm rounded bg-transparent border-b focus:border-blue-500 outline-none ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-span-3 flex justify-center">
                     <button 
                      onClick={() => removePiece(p.id)}
                      className="p-1.5 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t dark:border-gray-700 grid grid-cols-2 gap-3">
              <button 
                onClick={addPiece}
                className={`flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                <Plus className="w-4 h-4" /> Agregar
              </button>
              <button 
                className={`flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                <Upload className="w-4 h-4" /> CSV
              </button>
            </div>

            <div className="mt-4">
              <button 
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isOptimizing ? (
                    <>
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     Calculando...
                    </>
                ) : (
                    <>
                     <Calculator className="w-5 h-5" />
                     OPTIMIZAR CORTES
                    </>
                )}
              </button>
            </div>

          </div>
        </div>

        {}
        <div className="lg:col-span-8 space-y-6">
          
          {}
          <div className={`rounded-xl shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b dark:border-gray-700 pb-4">
                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estadísticas
                </h2>
                <div className="flex gap-2 no-print">
                   <button
                     onClick={handleExportPDF}
                     className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded transition-colors bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                   >
                     <FileText className="w-4 h-4" /> PDF
                   </button>
                   <button
                     onClick={handleExportCSV}
                     className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded transition-colors bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                   >
                     <Download className="w-4 h-4" /> CSV
                   </button>
                </div>
             </div>

             {result ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Aprovechamiento</p>
                    <p className="text-2xl font-bold text-green-500">{result.totalEfficiency.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Desperdicio Total</p>
                    <p className="text-2xl font-bold text-red-400">{result.totalWaste.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Placas Necesarias</p>
                    <p className="text-2xl font-bold text-blue-500">{result.totalBoards}</p>
                  </div>
               </div>
             ) : (
               <div className="text-center text-gray-400 py-4">Calcula para ver las estadísticas</div>
             )}
          </div>

          {}
          <div className={`rounded-xl shadow-sm border p-6 min-h-[500px] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
             <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">
               Visualización y Resultados
             </h2>
             
             {result && result.boards.length > 0 ? (
               <div className="space-y-8">
                 {result.boards.map((board) => (
                   <Visualizer key={board.id} board={board} kerf={settings.kerf} />
                 ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                 <Axe className="w-12 h-12 mb-2 opacity-50" />
                 <p>Ingresa las medidas y haz click en Optimizar</p>
               </div>
             )}
          </div>

        </div>

      </main>

      {}
      <div className="print-only hidden text-center p-4 text-sm text-gray-500">
        Reporte generado por CutWizard - {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default App;