import React, { useState } from 'react';
import { Upload, X, FileText, Check, Loader2, AlertCircle, FileSpreadsheet, Sparkles } from 'lucide-react';
import { read, utils } from 'xlsx';
import { 
  extractProductsFromPdf, 
  extractProductsFromExcelLocal, 
  extractProductsFromExcelAI, 
  ExtractedProduct 
} from '../../lib/aiExtractor';

interface CatalogImporterProps {
  onClose: () => void;
  onSave: (products: ExtractedProduct[]) => void;
}

export const CatalogImporter: React.FC<CatalogImporterProps> = ({ onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedProducts, setExtractedProducts] = useState<ExtractedProduct[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'excel' | null>(null);
  const [rawExcelRows, setRawExcelRows] = useState<any[] | null>(null);
  const [importMethod, setImportMethod] = useState<'local' | 'ai' | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);
    setExtractedProducts([]);
    setRawExcelRows(null);
    setImportMethod(null);

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv') || 
                    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel' || file.type === 'text/csv';

    if (!isPdf && !isExcel) {
      setError('Por favor sube un archivo PDF, Excel (.xlsx, .xls) o CSV.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no debe pesar más de 10MB.');
      return;
    }

    setIsLoading(true);

    if (isPdf) {
      setFileType('pdf');
      setImportMethod('ai');
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64 = reader.result as string;
            const products = await extractProductsFromPdf(base64);
            setExtractedProducts(products);
          } catch (err: any) {
            setError(err.message || 'Error al extraer datos del PDF con IA.');
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Error al leer el archivo PDF.');
        setIsLoading(false);
      }
    } else {
      setFileType('excel');
      try {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const ab = evt.target?.result;
            if (!ab) throw new Error('No se pudo leer el contenido del archivo.');
            
            const wb = read(ab, { type: 'array' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const rawData = utils.sheet_to_json(ws);
            
            if (rawData.length === 0) {
              throw new Error('El archivo Excel parece estar vacío.');
            }
            
            setRawExcelRows(rawData);

            // Try local parsing first
            const localProducts = extractProductsFromExcelLocal(rawData);
            if (localProducts && localProducts.length > 0) {
              setExtractedProducts(localProducts);
              setImportMethod('local');
              setIsLoading(false);
            } else {
              // Could not auto-detect columns locally
              setImportMethod(null);
              setIsLoading(false);
              setError('No pudimos auto-detectar las columnas de Nombre y Precio en tu Excel. Puedes intentar la Extracción Inteligente con IA.');
            }
          } catch (err: any) {
            setError(err.message || 'Error al procesar el archivo Excel.');
            setIsLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        setError('Error al leer el archivo Excel.');
        setIsLoading(false);
      }
    }
  };

  const handleRunExcelAI = async () => {
    if (!rawExcelRows) return;
    setIsLoading(true);
    setError(null);
    try {
      const products = await extractProductsFromExcelAI(rawExcelRows);
      setExtractedProducts(products);
      setImportMethod('ai');
    } catch (err: any) {
      setError(err.message || 'Error al procesar el Excel con IA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (index: number, field: keyof ExtractedProduct, value: string | number) => {
    const updated = [...extractedProducts];
    updated[index] = { ...updated[index], [field]: value } as ExtractedProduct;
    setExtractedProducts(updated);
  };

  const removeProduct = (index: number) => {
    setExtractedProducts(extractedProducts.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Header con gradiente premium */}
        <div className="p-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Upload size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-black text-base uppercase tracking-wider">Importador de Catálogos</h2>
              <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest mt-0.5">Sube tus listas de precios de proveedores en formato PDF, Excel o CSV</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all relative z-10">
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {!extractedProducts.length && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white rounded-2xl p-10 flex flex-col items-center justify-center text-center max-w-xl transition-all shadow-sm w-full group">
                <div className="flex gap-3 mb-4">
                  <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:scale-105 transition-transform duration-300">
                    <FileText size={32} />
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform duration-300">
                    <FileSpreadsheet size={32} />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-2">Selecciona tu archivo de cotización</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-sm">
                  Carga un archivo <strong>PDF</strong> para extraer productos con IA, o una planilla <strong>Excel o CSV</strong> para importación directa e inteligente.
                </p>
                
                <input 
                  type="file" 
                  id="catalog-file-upload" 
                  accept="application/pdf, .xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                <label 
                  htmlFor="catalog-file-upload"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg active:scale-98"
                >
                  <Upload size={14} /> Seleccionar Archivo
                </label>
              </div>

              {/* Mensaje de error o fallback en Excel */}
              {error && rawExcelRows && (
                <div className="mt-6 bg-white border border-indigo-100 rounded-2xl p-5 max-w-xl w-full shadow-sm flex flex-col items-center text-center">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-full mb-3">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <h4 className="text-xs font-black uppercase text-indigo-900 tracking-wider mb-1">Detección de Columnas Fallida</h4>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    No pudimos emparejar las columnas automáticamente. ¡No te preocupes! Podemos usar la Inteligencia Artificial de Gemini para leer y ordenar tu Excel de forma inteligente.
                  </p>
                  <button
                    onClick={handleRunExcelAI}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md flex items-center gap-2"
                  >
                    <Sparkles size={14} /> Extraer con IA de Gemini
                  </button>
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative flex items-center justify-center mb-5">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <Sparkles size={20} className="absolute text-indigo-600 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Analizando Documento...</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xs text-center leading-relaxed">
                {fileType === 'pdf' 
                  ? 'La IA está leyendo y extrayendo los productos del archivo PDF.' 
                  : 'Procesando tu archivo Excel y ordenando sus registros.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100/80 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-sm">
                    <Check size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-emerald-800">¡Se encontraron {extractedProducts.length} productos!</span>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">
                      Método: {importMethod === 'local' ? 'Detección Local (Rápido)' : 'Extracción Inteligente (IA)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 font-mono text-[10px] rounded-lg font-bold truncate max-w-[200px]">
                    {fileName}
                  </span>
                  {fileType === 'excel' && importMethod === 'local' && (
                    <button
                      onClick={handleRunExcelAI}
                      className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                      title="Procesar con IA para una mejor categorización"
                    >
                      <Sparkles size={10} /> Usar IA
                    </button>
                  )}
                </div>
              </div>

              {/* Tabla de Productos Extraídos */}
              <div className="border border-slate-100 rounded-2xl bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="p-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-1/3">Nombre del Producto</th>
                        <th className="p-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Descripción</th>
                        <th className="p-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right w-36">Precio Neto</th>
                        <th className="p-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center w-16">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {extractedProducts.map((prod, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3">
                            <input 
                              type="text" 
                              value={prod.name} 
                              onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                              className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded px-2.5 py-1.5 text-sm font-bold text-slate-800 outline-none transition-all"
                            />
                          </td>
                          <td className="p-3">
                            <input 
                              type="text" 
                              value={prod.description} 
                              onChange={(e) => handleProductChange(idx, 'description', e.target.value)}
                              className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded px-2.5 py-1.5 text-xs text-slate-600 outline-none transition-all"
                            />
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-slate-400 font-bold text-sm">$</span>
                              <input 
                                type="number" 
                                value={prod.unitPrice} 
                                onChange={(e) => handleProductChange(idx, 'unitPrice', Number(e.target.value))}
                                className="w-24 text-right bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded px-2 py-1 text-sm font-mono font-bold text-slate-800 outline-none transition-all"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => removeProduct(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {error && (!rawExcelRows || fileType === 'pdf') && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
              <div>
                <span className="font-bold text-xs uppercase tracking-wider block mb-0.5">Error de Importación</span>
                <p className="text-xs leading-relaxed text-red-600">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer con controles */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            {!extractedProducts.length && !isLoading && fileType && (
              <button 
                onClick={() => {
                  setExtractedProducts([]);
                  setRawExcelRows(null);
                  setFileName(null);
                  setFileType(null);
                  setError(null);
                }}
                className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                Volver a Subir
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors shadow-sm active:scale-98"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onSave(extractedProducts)}
              disabled={extractedProducts.length === 0 || isLoading}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-md active:scale-98"
            >
              <Check size={16} /> Importar {extractedProducts.length > 0 ? `${extractedProducts.length} ` : ''}Productos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
