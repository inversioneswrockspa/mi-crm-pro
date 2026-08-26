import React, { useState, useMemo } from 'react';
import { ReceiptText, Plus, Loader2, History, Search, Pencil, Trash2, Upload, Sparkles, ShoppingBag, Zap } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { formatCLP, parseCLP } from '../../lib/utils';

interface PurchasesModuleProps {
  purchases: any[];
  purchaseSearchTerm: string;
  setPurchaseSearchTerm: (term: string) => void;
  newPurchase: any;
  setNewPurchase: (p: any) => void;
  savePurchase: () => Promise<void>;
  isSavingPurchase: boolean;
  editPurchase: (p: any) => void;
  editingPurchaseId: string | null;
  deletePurchase: (id: string) => Promise<void>;
  togglePurchasePaid?: (id: string, currentStatus: boolean) => Promise<void>;
  isAiUploadingPurchase: boolean;
  handlePurchaseFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Import props
  importBatches: any[];
  importRawText: string;
  setImportRawText: (text: string) => void;
  processImportWithAI: () => Promise<void>;
  isAiImporting: boolean;
  newImport: any;
  setNewImport: (imp: any) => void;
  saveImport: () => Promise<void>;
  isSavingImport: boolean;
  deleteImport: (id: string) => Promise<void>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loadHistoricalFromImages: () => Promise<void>;
  isSeeding: boolean;
}

export const PurchasesModule: React.FC<PurchasesModuleProps> = ({
  purchases,
  purchaseSearchTerm,
  setPurchaseSearchTerm,
  newPurchase,
  setNewPurchase,
  savePurchase,
  isSavingPurchase,
  editPurchase,
  editingPurchaseId,
  deletePurchase,
  togglePurchasePaid,
  isAiUploadingPurchase,
  handlePurchaseFileUpload,
  importBatches,
  importRawText,
  setImportRawText,
  processImportWithAI,
  isAiImporting,
  newImport,
  setNewImport,
  saveImport,
  isSavingImport,
  deleteImport,
  handleFileUpload,
  loadHistoricalFromImages,
  isSeeding
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'facturas' | 'importaciones'>('facturas');

  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => 
      (p.provider || '').toLowerCase().includes((purchaseSearchTerm || '').toLowerCase()) ||
      (p.documentNumber || '').toLowerCase().includes((purchaseSearchTerm || '').toLowerCase())
    );
  }, [purchases, purchaseSearchTerm]);

  return (
    <div className="space-y-4 px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <ReceiptText className="text-indigo-600" size={20} />
            Compras
          </h2>
          <div className="bg-slate-200 rounded-xl p-1 shadow-inner border border-slate-300 flex">
            <button
              onClick={() => setActiveSubTab('facturas')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === 'facturas'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ReceiptText size={12} />
              Facturas
            </button>
            <button
              onClick={() => setActiveSubTab('importaciones')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === 'importaciones'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShoppingBag size={12} />
              Importaciones
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'facturas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 h-fit">
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
              <h3 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-600" /> Carga Rápida con IA
              </h3>
              <p className="text-[9px] text-indigo-700 font-medium mb-3">Sube tu factura, boleta (PDF/Imagen) o Excel del SII para auto-rellenar el formulario.</p>
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all cursor-pointer shadow-sm active:scale-95 text-center">
                {isAiUploadingPurchase ? (
                  <>
                    <Loader2 className="animate-spin" size={12} /> Procesando...
                  </>
                ) : (
                  <>
                    <Upload size={12} /> Subir Factura / Excel (IA)
                  </>
                )}
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".xlsx,.xls,.csv,.pdf,image/*" 
                  onChange={handlePurchaseFileUpload}
                  disabled={isAiUploadingPurchase}
                />
              </label>
            </div>

            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Plus size={16} className="text-indigo-600" /> {editingPurchaseId ? 'Editar Compra' : 'Nueva Compra'}
            </h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="purchase-provider" className="text-[8px] font-black uppercase text-slate-400 ml-1">Proveedor / Comercio</label>
                <input 
                  id="purchase-provider"
                  name="purchase-provider"
                  type="text" 
                  value={newPurchase.provider}
                  onChange={e => setNewPurchase({...newPurchase, provider: e.target.value})}
                  placeholder="Ej: Sodimac, PC Factory..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="purchase-amount" className="text-[8px] font-black uppercase text-slate-400 ml-1">Monto Neto ($)</label>
                  <input 
                    id="purchase-amount"
                    name="purchase-amount"
                    type="text" 
                    placeholder="Ej: $15.000"
                    value={newPurchase.netAmount ? formatCLP(newPurchase.netAmount) : ''}
                    onChange={e => {
                      setNewPurchase({...newPurchase, netAmount: parseCLP(e.target.value)});
                    }}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="purchase-category" className="text-[8px] font-black uppercase text-slate-400 ml-1">Categoría</label>
                  <select 
                    id="purchase-category"
                    name="purchase-category"
                    value={newPurchase.category}
                    onChange={e => setNewPurchase({...newPurchase, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="insumos">Insumos</option>
                    <option value="herramientas">Herramientas</option>
                    <option value="publicidad">Publicidad</option>
                    <option value="servicios">Servicios</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="purchase-method" className="text-[8px] font-black uppercase text-slate-400 ml-1">Método de Pago</label>
                  <select 
                    id="purchase-method"
                    name="purchase-method"
                    value={newPurchase.paymentMethod || 'transferencia'}
                    onChange={e => setNewPurchase({...newPurchase, paymentMethod: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="transferencia">Transferencia</option>
                    <option value="efectivo">Efectivo (Caja)</option>
                    <option value="tarjeta">Tarjeta Débito/Crédito</option>
                    <option value="credito">Línea de Crédito</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
                <div className="space-y-1 flex flex-col justify-end pb-1.5 pl-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={newPurchase.isPaid !== false}
                      onChange={e => setNewPurchase({...newPurchase, isPaid: e.target.checked})}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-200"
                    />
                    <span className="text-[10px] font-black uppercase text-slate-700">¿Pagado?</span>
                  </label>
                </div>
              </div>
              <button 
                onClick={savePurchase}
                disabled={isSavingPurchase}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isSavingPurchase ? <Loader2 className="animate-spin mx-auto" size={16} /> : (editingPurchaseId ? "Actualizar Compra" : "Registrar Compra")}
              </button>
              {editingPurchaseId && (
                <button 
                  onClick={() => editPurchase(null)}
                  className="w-full py-2 text-[9px] font-black uppercase text-slate-400 hover:text-slate-600"
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <History size={16} className="text-slate-400" /> Registro de Compras
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                <input 
                  id="purchase-search"
                  name="purchase-search"
                  type="text"
                  placeholder="Buscar por proveedor o documento..."
                  value={purchaseSearchTerm}
                  onChange={e => setPurchaseSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-indigo-500 w-64 shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 whitespace-nowrap">Detalle</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 whitespace-nowrap">Documento</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 whitespace-nowrap text-right">Montos</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 whitespace-nowrap text-right">IVA</th>
                    <th className="p-4 text-[9px] font-black uppercase text-slate-400 whitespace-nowrap text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPurchases.map(purchase => (
                    <tr key={purchase.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-900 uppercase">{purchase.provider}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[8px] text-slate-400 uppercase font-bold">{purchase.category}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <button
                              type="button"
                              onClick={async () => {
                                if (togglePurchasePaid) {
                                  await togglePurchasePaid(purchase.id, purchase.isPaid);
                                }
                              }}
                              title={purchase.isPaid ? "Hacer clic para marcar como Pendiente" : "Hacer clic para marcar como Pagado"}
                              className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded cursor-pointer hover:scale-105 transition-all ${purchase.isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-emerald-100 hover:text-emerald-700'}`}
                            >
                              {purchase.isPaid ? 'Pagado ✓' : 'Pendiente ⚡'}
                            </button>
                            <span className="text-[7px] font-bold text-slate-400 uppercase bg-slate-100 px-1 py-0.5 rounded border border-slate-200">
                              {purchase.paymentMethod || 's/n'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-700">Ref: {purchase.documentNumber || 'S/N'}</span>
                          <span className="text-[8px] text-slate-400 uppercase font-bold">
                            {purchase.date instanceof Timestamp ? purchase.date.toDate().toLocaleDateString() : (purchase.date?.toDate ? purchase.date.toDate().toLocaleDateString() : 'Reciente')}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-900">${Number(purchase.totalAmount || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase">Neto: ${Number(purchase.netAmount || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="inline-block text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                          ${Number(purchase.ivaAmount || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => editPurchase(purchase)}
                            className={`p-2 ${editingPurchaseId === purchase.id ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-indigo-600 hover:bg-indigo-50'} transition-all rounded-xl`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => deletePurchase(purchase.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-xl"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPurchases.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-slate-400">
                        <ReceiptText size={40} className="mx-auto opacity-10 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No hay compras que coincidan</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'importaciones' && (
        <div className="space-y-5">
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
            <div className="flex-1 bg-indigo-50 p-4 rounded-3xl border border-indigo-100 shadow-sm">
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
                  className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-2xl text-sm outline-none h-24"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={processImportWithAI}
                    disabled={isAiImporting || !importRawText.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50"
                  >
                    {isAiImporting ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={14} /> Procesar Texto</>}
                  </button>
                  
                  <label className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all cursor-pointer">
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

            <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-center items-center text-center max-w-xs">
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
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-indigo-600" /> Nueva Importación
              </h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nombre del Lote</label>
                  <input 
                    type="text" 
                    value={newImport.name}
                    onChange={e => setNewImport({...newImport, name: e.target.value})}
                    placeholder="Ej: AliExpress Feb - Electrónica"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Inversión Mercadería ($)</label>
                    <input 
                      type="number" 
                      value={newImport.totalInvestment || ''}
                      onChange={e => setNewImport({...newImport, totalInvestment: Number(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Gastos de Envío/Aduana ($)</label>
                    <input 
                      type="number" 
                      value={newImport.totalExpenses || ''}
                      onChange={e => setNewImport({...newImport, totalExpenses: Number(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Notas / Detalles</label>
                  <textarea 
                    value={newImport.notes}
                    onChange={e => setNewImport({...newImport, notes: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {importBatches.map(batch => (
                  <div key={batch.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all group relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">{batch.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                          {batch.date instanceof Timestamp ? batch.date.toDate().toLocaleDateString() : 'Pendiente'}
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
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Inversión Insumos</p>
                        <p className="text-sm font-black text-slate-900">${batch.totalInvestment?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Costos Logísticos</p>
                        <p className="text-sm font-black text-rose-600">${batch.totalExpenses?.toLocaleString()}</p>
                      </div>
                    </div>
                    {batch.notes && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[9px] text-slate-500 italic border-l-2 border-indigo-400">
                        {batch.notes}
                      </div>
                    )}
                  </div>
                ))}
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
      )}
    </div>
  );
};
