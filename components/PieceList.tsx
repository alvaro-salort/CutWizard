import React, { useRef } from 'react';
import { Plus, Trash2, Copy, Upload, Download, RotateCw, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { Piece } from '../types';
import { parsePiecesCSV, exportPiecesListCSV } from '../services/csvHelper';
import { DEFAULT_PIECES } from '../services/storage';

interface PieceListProps {
  pieces: Piece[];
  onChange: (pieces: Piece[]) => void;
  darkMode: boolean;
  hoveredPieceId: string | null;
  onHoverPiece: (id: string | null) => void;
}

export const PieceList: React.FC<PieceListProps> = ({
  pieces,
  onChange,
  darkMode,
  hoveredPieceId,
  onHoverPiece,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (id: string, field: keyof Piece, value: any) => {
    onChange(
      pieces.map((p) => {
        if (p.id !== id) return p;
        return { ...p, [field]: value };
      })
    );
  };

  const addPiece = () => {
    const newId = `piece-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    onChange([
      ...pieces,
      {
        id: newId,
        name: `Pieza #${pieces.length + 1}`,
        width: 400,
        height: 600,
        quantity: 1,
        canRotate: true,
      },
    ]);
  };

  const duplicatePiece = (id: string) => {
    const item = pieces.find((p) => p.id === id);
    if (!item) return;
    const newId = `piece-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    onChange([
      ...pieces,
      {
        ...item,
        id: newId,
        name: `${item.name || 'Pieza'} (copia)`,
      },
    ]);
  };

  const removePiece = (id: string) => {
    onChange(pieces.filter((p) => p.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('¿Deseas vaciar la lista de piezas?')) {
      onChange([]);
    }
  };

  const loadExample = () => {
    onChange(DEFAULT_PIECES);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parsePiecesCSV(content);
        if (parsed.length > 0) {
          onChange(parsed);
        } else {
          alert('No se pudieron detectar piezas válidas en el archivo CSV. Asegúrate de incluir columnas con Ancho y Alto.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`rounded-2xl shadow-sm border p-5 flex flex-col transition-colors duration-200 ${
        darkMode ? 'bg-gray-800/80 border-gray-700/80 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      {/* Header y Acciones de Archivo */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Lista de Despiece ({pieces.length} filas)
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.txt"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Importar lista desde un archivo CSV"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-gray-700 dark:text-gray-300"
          >
            <Upload className="w-3.5 h-3.5 text-blue-500" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={() => exportPiecesListCSV(pieces)}
            title="Descargar lista actual en CSV"
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors text-gray-700 dark:text-gray-300"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
          </button>
        </div>
      </div>

      {/* Cabecera de la Tabla */}
      <div className="grid grid-cols-12 gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2 py-1.5 mb-1">
        <div className="col-span-4">Nombre / Etiqueta</div>
        <div className="col-span-2 text-center">Ancho</div>
        <div className="col-span-2 text-center">Alto</div>
        <div className="col-span-1 text-center">Cant.</div>
        <div className="col-span-1 text-center" title="Respetar Veta / Rotación">Veta</div>
        <div className="col-span-2 text-right pr-2">Acciones</div>
      </div>

      {/* Filas de Piezas con Scroll */}
      <div className="overflow-y-auto max-h-[380px] space-y-1.5 pr-1 custom-scrollbar">
        {pieces.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
            <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2 opacity-60" />
            <p className="text-xs text-gray-500 dark:text-gray-400">No hay piezas en la lista.</p>
            <button
              onClick={loadExample}
              className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Cargar piezas de ejemplo
            </button>
          </div>
        ) : (
          pieces.map((p, idx) => {
            const isHovered = hoveredPieceId === p.id;
            return (
              <div
                key={p.id}
                onMouseEnter={() => onHoverPiece(p.id)}
                onMouseLeave={() => onHoverPiece(null)}
                className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-all border ${
                  isHovered
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-900/30 ring-1 ring-blue-500'
                    : darkMode
                    ? 'bg-gray-750/70 border-gray-700/60 hover:bg-gray-700/80'
                    : 'bg-gray-50/80 border-gray-200/80 hover:bg-gray-100/90'
                }`}
              >
                {/* Nombre */}
                <div className="col-span-4">
                  <input
                    type="text"
                    value={p.name || ''}
                    placeholder={`Pieza #${idx + 1}`}
                    onChange={(e) => updateField(p.id, 'name', e.target.value)}
                    className="w-full text-xs font-medium px-2 py-1 rounded bg-transparent border-0 border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 focus:bg-white/10 outline-none transition-colors"
                  />
                </div>

                {/* Ancho */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={p.width || ''}
                    onChange={(e) => updateField(p.id, 'width', Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs font-bold text-center px-1 py-1 rounded bg-transparent border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="W"
                  />
                </div>

                {/* Alto */}
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={p.height || ''}
                    onChange={(e) => updateField(p.id, 'height', Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs font-bold text-center px-1 py-1 rounded bg-transparent border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="H"
                  />
                </div>

                {/* Cantidad */}
                <div className="col-span-1">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={p.quantity || ''}
                    onChange={(e) => updateField(p.id, 'quantity', Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs font-bold text-center px-0.5 py-1 rounded bg-transparent border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Veta / Control de Rotación */}
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => updateField(p.id, 'canRotate', !p.canRotate)}
                    title={
                      p.canRotate
                        ? 'Rotación Libre: La pieza puede girar 90º para optimizar espacio'
                        : 'Veta Fija (Bloqueada): Respeta la orientación de la veta de la madera/melamina'
                    }
                    className={`p-1.5 rounded-lg text-xs transition-all ${
                      p.canRotate
                        ? 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'text-amber-600 bg-amber-100 dark:bg-amber-900/60 dark:text-amber-300 ring-1 ring-amber-400/50'
                    }`}
                  >
                    {p.canRotate ? <RotateCw className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Acciones */}
                <div className="col-span-2 flex justify-end items-center gap-1">
                  <button
                    type="button"
                    onClick={() => duplicatePiece(p.id)}
                    title="Duplicar pieza"
                    className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePiece(p.id)}
                    title="Eliminar pieza"
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Botonera Inferior */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={addPiece}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar Pieza
        </button>

        {pieces.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            title="Vaciar lista"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
};
