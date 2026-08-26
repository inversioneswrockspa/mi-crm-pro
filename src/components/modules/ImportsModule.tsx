import React from 'react';
import { ShoppingBag, Zap, Sparkles, Loader2, Upload, History, Trash2, CheckCircle2, Truck, Box } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { formatCLP, parseCLP } from '../../lib/utils';

interface ImportsModuleProps {
  importBatches: any[];
  importRawText: string;
  setImportRawText: (text: string) => void;
  processImportWithAI: () => Promise<void>;
  isAiImporting: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loadHistoricalFromImages: () => Promise<void>;
  isSeeding: boolean;
  newImport: any;
  setNewImport: (imp: any) => void;
  saveImport: () => Promise<void>;
  isSavingImport: boolean;
  deleteImport: (id: string) => Promise<void>;
}

export const ImportsModule: React.FC<ImportsModuleProps> = ({
  importBatches,
  importRawText,
  setImportRawText,
  processImportWithAI,
  isAiImporting,
  handleFileUpload,
  loadHistoricalFromImages,
  isSeeding,
  newImport,
  setNewImport,
  saveImport,
  isSavingImport,
  deleteImport
}) => {
  // Calculations for live summary box
  const investment = newImport.totalInvestment || 0;
  const quantity = newImport.quantity || 1;
  const hasCertOfOrigin = newImport.hasCertificateOfOrigin || false;
  const hasIvaF29 = newImport.hasIvaF29 !== false; // Default true

  // Tariff 6% Ad-Valorem if NO certificate of origin
  const arancelAmount = hasCertOfOrigin ? 0 : Math.round(investment * 0.06);
  // IVA 19% F29 (Credit fiscal)
  const ivaAmount = hasIvaF29 ? Math.round(investment * 0.19) : 0;
  
  // Logistics costs total = Entered logistics expenses + calculated arancel
  const totalLogistics = (newImport.totalExpenses || 0) + arancelAmount;
  const netTotalLote = investment + totalLogistics;
  const netUnitCost = quantity > 0 ? Math.round(netTotalLote / quantity) : 0;

  return (
    <div className="space-y-5 px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <ShoppingBag className="text-indigo-600" size={20} />
            Gestión de Importaciones
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Lotes de mercadería y logística internacional alineados con Catálogo y Finanzas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Inversión Total</p>
          <h3 className="text-xl font-black text-white leading-none">
            ${importBatches.reduce((acc, b) => acc + (b.totalInvestment || 0), 0).toLocaleString()}
          </h3>
          <p className="text-[8px] font-bold text-indigo-400 mt-2 uppercase tracking-widest">{importBatches.length} Lotes</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ventas Est. (Stock)</p>
          <h3 className="text-xl font-black text-slate-900 leading-none text-emerald-600">
            ${importBatches.reduce((acc, b) => acc + ((b.items || []).reduce((s: number, i: any) => s + ((i.salePrice || 0) * ((i.quantity || 0) - (i.currentInventory || 0))), 0) || 0), 0).toLocaleString()}
          </h3>
          <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-widest tracking-tighter opacity-60">Basado en Saldo</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 bg-indigo-50 p-6 rounded-3xl border border-indigo-100 shadow-sm">
          <h2 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap size={18} className="text-indigo-600" /> Importador Inteligente (IA)
          </h2>
          <div className="space-y-4">
            <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-tight">
              Copia y pega el texto de tu Excel aquí.
            </p>
            <textarea 
              value={importRawText}
              onChange={e => setImportRawText(e.target.value)}
              placeholder="Pega aquí los datos..."
              className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-2xl text-sm outline-none h-24 focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button 
                onClick={processImportWithAI}
                disabled={isAiImporting || !importRawText.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 active:scale-95 shadow-md"
              >
                {isAiImporting ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={14} /> Procesar Texto</>}
              </button>
              
              <label className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all cursor-pointer shadow-sm active:scale-95">
                <Upload size={14} />
                {isAiImporting ? "Procesando..." : "Subir Archivo"}
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".xlsx,.xls,.csv,.pdf,image/*" 
                  onChange={handleFileUpload}
                  disabled={isAiImporting}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-center items-center text-center max-w-xs">
          <History size={32} className="text-emerald-600 mb-3" />
          <h3 className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-2">Cargar Datos de Imágenes</h3>
          <p className="text-[10px] text-emerald-700 font-medium mb-4 leading-relaxed">
            Extraje los datos de tus capturas para que no los subas a mano. ¡Haz click aquí para cargarlos!
          </p>
          <button 
            onClick={loadHistoricalFromImages}
            disabled={isSeeding}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSeeding ? <Loader2 className="animate-spin mx-auto" size={14} /> : "Vincular con Database"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-indigo-600" /> Nueva Importación
          </h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nombre del Lote / Producto</label>
              <input 
                type="text" 
                value={newImport.name || ''}
                onChange={e => setNewImport({...newImport, name: e.target.value})}
                placeholder="Ej: 50 Barras de Remolque 3 Ton - Alibaba"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Cantidad</label>
                <input 
                  type="number" 
                  min="1"
                  value={newImport.quantity || 1}
                  onChange={e => setNewImport({...newImport, quantity: Math.max(1, parseInt(e.target.value) || 1)})}
                  placeholder="50"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Estado del Lote</label>
                <select
                  value={newImport.status || 'en_transito'}
                  onChange={e => setNewImport({...newImport, status: e.target.value})}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="en_transito">🚚 En Tránsito (Por llegar)</option>
                  <option value="en_bodega">📦 En Bodega (Stock disponible)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Inversión Mercadería ($)</label>
                <input 
                  type="text" 
                  value={newImport.totalInvestment ? formatCLP(newImport.totalInvestment) : ''}
                  onChange={e => setNewImport({...newImport, totalInvestment: parseCLP(e.target.value)})}
                  placeholder="Ej: $1.090.241"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Gastos de Envío/Flete ($)</label>
                <input 
                  type="text" 
                  value={newImport.totalExpenses ? formatCLP(newImport.totalExpenses) : ''}
                  onChange={e => setNewImport({...newImport, totalExpenses: parseCLP(e.target.value)})}
                  placeholder="Ej: $605.440"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Checkbox para Certificado de Origen (6% Arancel) */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={hasCertOfOrigin}
                  onChange={e => setNewImport({...newImport, hasCertificateOfOrigin: e.target.checked})}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-[10px] font-black uppercase text-slate-700">¿Tiene Certificado de Origen (TLC)?</span>
              </label>
              {!hasCertOfOrigin && (
                <div className="text-[9px] font-bold text-amber-600 bg-amber-50 p-2 rounded-xl border border-amber-100 flex items-center justify-between">
                  <span>+6% Arancel Aduana Chile (Ad-Valorem):</span>
                  <span className="font-black">${arancelAmount.toLocaleString()} CLP</span>
                </div>
              )}
            </div>

            {/* Checkbox para IVA 19% Crédito Fiscal */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={hasIvaF29}
                  onChange={e => setNewImport({...newImport, hasIvaF29: e.target.checked})}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="text-[10px] font-black uppercase text-slate-700">Calcular IVA 19% (Crédito Fiscal F29)</span>
              </label>
              {hasIvaF29 && (
                <div className="text-[9px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <span>IVA a recuperar en F29 (SII):</span>
                  <span className="font-black">${ivaAmount.toLocaleString()} CLP</span>
                </div>
              )}
            </div>

            {/* Resumen en vivo de costos netos */}
            <div className="p-3.5 bg-indigo-900 text-white rounded-2xl space-y-1.5 shadow-md">
              <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300">Costo Neto Proyectado</p>
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-bold text-indigo-200">Costo Neto Total Lote:</span>
                <span className="text-sm font-black text-white">${netTotalLote.toLocaleString()} CLP</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-indigo-800/80 pt-1.5 mt-1">
                <span className="text-[10px] font-black text-emerald-400">Costo Neto por Unidad ({quantity} unid.):</span>
                <span className="text-base font-black text-emerald-400">${netUnitCost.toLocaleString()} CLP/u</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Notas / Detalles</label>
              <textarea 
                value={newImport.notes || ''}
                onChange={e => setNewImport({...newImport, notes: e.target.value})}
                placeholder="Detalles del envío, proveedor, código de seguimiento..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"
              />
            </div>

            <button 
              onClick={saveImport}
              disabled={isSavingImport}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isSavingImport ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Registrar Lote de Importación"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <History size={18} className="text-slate-400" /> Historial de Lotes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
            {importBatches.map(batch => {
              const qty = batch.quantity || 1;
              const inv = batch.totalInvestment || 0;
              const exp = batch.totalExpenses || 0;
              const arancel = batch.arancelAmount || (batch.hasCertificateOfOrigin ? 0 : Math.round(inv * 0.06));
              const totalNeto = inv + exp + arancel;
              const unitCostNeto = batch.netUnitCost || (qty > 0 ? Math.round(totalNeto / qty) : 0);
              const isBodega = batch.status === 'en_bodega';

              return (
                <div key={batch.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all group relative">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                          isBodega ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {isBodega ? '📦 En Bodega' : '🚚 En Tránsito'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[8px] font-black">
                          {qty} unid.
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">{batch.name}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">
                        {batch.date instanceof Timestamp ? batch.date.toDate().toLocaleDateString() : (batch.date?.toDate ? batch.date.toDate().toLocaleDateString() : 'Reciente')}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImport(batch.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-3">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Inversión Insumos</p>
                      <p className="text-xs font-black text-slate-900">${inv.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Costos Logísticos</p>
                      <p className="text-xs font-black text-rose-600">${(exp + arancel).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-dashed border-slate-100 flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-500">Costo Neto Unitario:</span>
                    <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      ${unitCostNeto.toLocaleString()} CLP c/u
                    </span>
                  </div>

                  {batch.notes && (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-[9px] text-slate-500 italic border-l-2 border-indigo-400">
                      {batch.notes}
                    </div>
                  )}
                </div>
              );
            })}
            {importBatches.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <ShoppingBag size={32} className="mx-auto opacity-10 mb-4" />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Sin importaciones registradas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
