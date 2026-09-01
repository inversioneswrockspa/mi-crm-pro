import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Search, 
  Paperclip, 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  FileText 
} from 'lucide-react';
import { CatalogItem } from '../../types';
import { getSafeImageUrl, formatCLP, parseCLP, openPdfInNewTab } from '../../lib/utils';

interface CatalogModuleProps {
  catalogFilteredItems: CatalogItem[];
  catalogSearchTerm: string;
  setCatalogSearchTerm: (term: string) => void;
  handleClearCatalog: () => void;
  newCatalogItem: { 
    id: string; 
    name: string; 
    price: string; 
    desc: string; 
    pdfUrl: string;
    enBodega?: boolean;
    modalidad?: 'stock' | 'venta_calzada' | 'agotado';
    tiempoEntrega?: string;
    precioVentaFinal?: string;
  };
  setNewCatalogItem: React.Dispatch<React.SetStateAction<any>>;
  saveNewCatalogItem: () => void;
  handleUpdateCatalogItem: (id: string) => void;
  handleDeleteCatalogItem: (id: string) => void;
  addItemFromCatalog: (item: CatalogItem) => void;
  handleCatalogImageUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCatalogPdfUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  editingCatalogId: string | null;
  setEditingCatalogId: (id: string | null) => void;
  editCatalogData: Partial<CatalogItem>;
  setEditCatalogData: React.Dispatch<React.SetStateAction<Partial<CatalogItem>>>;
  getCatalogQuantity: (id: string) => number;
  handleCatalogQuantityChange: (id: string, qty: number) => void;
  setActiveTab: (tab: string) => void;
  setShowCatalogImporter?: (show: boolean) => void;
}

export const CatalogModule: React.FC<CatalogModuleProps> = ({
  catalogFilteredItems,
  catalogSearchTerm,
  setCatalogSearchTerm,
  handleClearCatalog,
  newCatalogItem,
  setNewCatalogItem,
  saveNewCatalogItem,
  handleUpdateCatalogItem,
  handleDeleteCatalogItem,
  addItemFromCatalog,
  handleCatalogImageUpload,
  handleCatalogPdfUpload,
  editingCatalogId,
  setEditingCatalogId,
  editCatalogData,
  setEditCatalogData,
  getCatalogQuantity,
  handleCatalogQuantityChange,
  setActiveTab,
  setShowCatalogImporter
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <Package className="text-indigo-600" size={20} />
            Catálogo de Soluciones
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Gestión de servicios y precios base.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text"
              placeholder="Buscar..."
              value={catalogSearchTerm}
              onChange={(e) => setCatalogSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button 
            onClick={handleClearCatalog}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 whitespace-nowrap"
          >
            Reset
          </button>
          {setShowCatalogImporter && (
            <button 
              onClick={() => setShowCatalogImporter(true)}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
            >
              <Upload size={12} /> Importar PDF / Excel
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">Añadir Nuevo Ítem</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input 
            type="text" 
            placeholder="ID (ej: cam-01)" 
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newCatalogItem.id}
            onChange={e => setNewCatalogItem({...newCatalogItem, id: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Nombre del Ítem" 
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
            value={newCatalogItem.name}
            onChange={e => setNewCatalogItem({...newCatalogItem, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Costo Neto Adquisición ($)" 
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
            value={newCatalogItem.price ? formatCLP(newCatalogItem.price) : ''}
            onChange={e => setNewCatalogItem({...newCatalogItem, price: parseCLP(e.target.value).toString()})}
          />

          {/* 4 nuevos campos */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2">
            <span className="text-xs font-bold text-slate-700">En Bodega</span>
            <button
              type="button"
              onClick={() => setNewCatalogItem((prev: any) => ({ ...prev, enBodega: !prev.enBodega }))}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                newCatalogItem.enBodega ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  newCatalogItem.enBodega ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <select
            value={newCatalogItem.modalidad || 'stock'}
            onChange={e => setNewCatalogItem({
              ...newCatalogItem,
              modalidad: e.target.value as any,
              tiempoEntrega: e.target.value !== 'venta_calzada' ? '' : (newCatalogItem.tiempoEntrega || '')
            })}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
          >
            <option value="stock">En Stock</option>
            <option value="venta_calzada">Venta Calzada</option>
            <option value="agotado">Agotado</option>
          </select>

          <input 
            type="text"
            placeholder="Tiempo de Entrega (ej: 3-5 días)"
            disabled={newCatalogItem.modalidad !== 'venta_calzada'}
            className={`bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${
              newCatalogItem.modalidad !== 'venta_calzada' ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
            }`}
            value={newCatalogItem.modalidad === 'venta_calzada' ? (newCatalogItem.tiempoEntrega || '') : ''}
            onChange={e => setNewCatalogItem({...newCatalogItem, tiempoEntrega: e.target.value})}
          />

          <input 
            type="text"
            placeholder="Precio Venta Final ($)"
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-emerald-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={newCatalogItem.precioVentaFinal ? formatCLP(newCatalogItem.precioVentaFinal) : ''}
            onChange={e => setNewCatalogItem({...newCatalogItem, precioVentaFinal: parseCLP(e.target.value).toString()})}
          />

          <div className="md:col-span-1">
            <input 
              type="file" 
              id="new-catalog-pdf-input"
              className="hidden" 
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 1024 * 1024) return alert("El PDF debe ser menor a 1MB");
                  const reader = new FileReader();
                  reader.onloadend = () => setNewCatalogItem((prev: any) => ({...prev, pdfUrl: reader.result as string}));
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label 
              htmlFor="new-catalog-pdf-input"
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg text-xs font-bold uppercase cursor-pointer transition-all ${newCatalogItem.pdfUrl ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600'}`}
            >
              <Paperclip size={14} />
              {newCatalogItem.pdfUrl ? 'PDF Cargado ✓' : 'Subir Ficha Técnica'}
            </label>
          </div>
          <textarea 
            placeholder="Descripción técnica para el cliente..." 
            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
            value={newCatalogItem.desc}
            onChange={e => setNewCatalogItem({...newCatalogItem, desc: e.target.value})}
          />
          <button 
            onClick={saveNewCatalogItem}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 md:col-span-1"
          >
            <Plus size={16} /> Añadir al Catálogo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left p-4 text-[10px] uppercase font-bold text-slate-400 rounded-tl-lg">Imagen</th>
              <th className="text-left p-4 text-[10px] uppercase font-bold text-slate-400">ID / Referencia</th>
              <th className="text-left p-4 text-[10px] uppercase font-bold text-slate-400">Descripción / Detalles</th>
              <th className="text-right p-4 text-[10px] uppercase font-bold text-slate-400">Precios (Costo / Venta)</th>
              <th className="text-center p-4 text-[10px] uppercase font-bold text-slate-400 rounded-tr-lg w-32">Acción</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {catalogFilteredItems.length === 0 ? (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="empty-catalog"
                >
                  <td colSpan={5} className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">No se encontraron productos</p>
                    <p className="text-slate-400 text-[10px] mt-1">Intenta con otro término o añade uno nuevo arriba.</p>
                  </td>
                </motion.tr>
              ) : catalogFilteredItems.map(item => {
                const isEditing = editingCatalogId === item.id;
                return (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={item.id} 
                  className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors group ${isEditing ? 'bg-indigo-50/30' : ''}`}
                >
                <td className="p-4 align-middle">
                  <div className="flex flex-col gap-2">
                    <div className="relative w-12 h-12">
                      <input 
                        type="file" 
                        id={`catalog-img-${item.id}`}
                        className="hidden" 
                        accept="image/*"
                        multiple
                        onChange={(e) => handleCatalogImageUpload(item.id, e)}
                      />
                      <label 
                        htmlFor={`catalog-img-${item.id}`}
                        className="w-12 h-12 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-50 transition-all group/img"
                      >
                        {(item.imageUrl || item.images?.[0]) ? (
                          <img src={getSafeImageUrl(item.imageUrl || item.images?.[0])} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-slate-300 group-hover/img:text-indigo-400 transition-colors" size={20} />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                          <Upload className="text-white" size={14} />
                        </div>
                      </label>
                    </div>
                    <div className="flex gap-1 overflow-x-auto max-w-[100px] scrollbar-hide">
                      {(item.images || (item.imageUrl ? [item.imageUrl] : [])).map((img, idx) => (
                        <div key={idx} className="relative w-6 h-6 rounded border border-slate-100 overflow-hidden flex-shrink-0 group/thumb">
                          <img src={getSafeImageUrl(img)} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => {
                              // Handled in parent context
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover/thumb:opacity-100 transition-all scale-75 hidden"
                          >
                            <X size={6} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs font-bold text-indigo-600 font-mono tracking-tight align-middle">
                  <div className="flex flex-col gap-2">
                    <span className="text-left">{item.id}</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        id={`catalog-pdf-${item.id}`}
                        className="hidden" 
                        accept="application/pdf"
                        onChange={(e) => handleCatalogPdfUpload(item.id, e)}
                      />
                      <label 
                        htmlFor={`catalog-pdf-${item.id}`}
                        className={`p-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border ${item.pdfUrl ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-100'}`}
                        title={item.pdfUrl ? "Cambiar Ficha Técnica" : "Subir Ficha Técnica (PDF)"}
                      >
                        <Paperclip size={12} />
                        <span className="text-[9px] font-black uppercase tracking-tighter">{item.pdfUrl ? 'PDF ✓' : 'Subir PDF'}</span>
                      </label>
                      {item.pdfUrl && (
                        <button 
                          onClick={() => openPdfInNewTab(item.pdfUrl, `Ficha_${item.name.replace(/\s+/g, '_')}.pdf`)}
                          className="p-1.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center"
                          title="Ver Ficha Técnica PDF"
                        >
                          <FileText size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs text-slate-600 align-middle max-w-md text-left">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input 
                        type="text"
                        value={editCatalogData.name ?? item.name}
                        onChange={e => setEditCatalogData(prev => ({...prev, name: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <textarea 
                        value={editCatalogData.description ?? item.description}
                        onChange={e => setEditCatalogData(prev => ({...prev, description: e.target.value}))}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-600 focus:ring-1 focus:ring-indigo-500 outline-none h-14"
                      />
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-2 py-1">
                          <span className="text-[10px] font-bold text-slate-600">En Bodega</span>
                          <button
                            type="button"
                            onClick={() => setEditCatalogData(prev => ({ ...prev, enBodega: !(prev.enBodega ?? item.enBodega ?? false) }))}
                            className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                              (editCatalogData.enBodega ?? item.enBodega ?? false) ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                          >
                            <div
                              className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                                (editCatalogData.enBodega ?? item.enBodega ?? false) ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <select
                          value={editCatalogData.modalidad ?? item.modalidad ?? 'stock'}
                          onChange={e => setEditCatalogData(prev => ({
                            ...prev,
                            modalidad: e.target.value as any,
                            tiempoEntrega: e.target.value !== 'venta_calzada' ? '' : (prev.tiempoEntrega ?? item.tiempoEntrega ?? '')
                          }))}
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold outline-none text-slate-800"
                        >
                          <option value="stock">En Stock</option>
                          <option value="venta_calzada">Venta Calzada</option>
                          <option value="agotado">Agotado</option>
                        </select>
                      </div>

                      {(editCatalogData.modalidad ?? item.modalidad) === 'venta_calzada' && (
                        <input 
                          type="text"
                          placeholder="Tiempo de Entrega (ej: 3-5 días)"
                          value={editCatalogData.tiempoEntrega ?? item.tiempoEntrega ?? ''}
                          onChange={e => setEditCatalogData(prev => ({ ...prev, tiempoEntrega: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none"
                        />
                      )}

                      <div className="flex items-center gap-2">
                        <input 
                          type="file" 
                          id={`edit-pdf-${item.id}`}
                          className="hidden" 
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 1024 * 1024) return alert("El PDF debe ser menor a 1MB");
                              const reader = new FileReader();
                              reader.onloadend = () => setEditCatalogData(prev => ({...prev, pdfUrl: reader.result as string}));
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label 
                          htmlFor={`edit-pdf-${item.id}`}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-1 border rounded-lg text-[10px] font-black uppercase cursor-pointer transition-all ${(editCatalogData.pdfUrl || item.pdfUrl) ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                        >
                          <Paperclip size={12} />
                          {(editCatalogData.pdfUrl || item.pdfUrl) ? 'Cambiar Ficha PDF' : 'Añadir Ficha PDF'}
                        </label>
                        {(editCatalogData.pdfUrl || item.pdfUrl) && (
                          <button 
                            onClick={() => setEditCatalogData(prev => ({...prev, pdfUrl: ''}))}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                            title="Eliminar Ficha"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="font-bold text-slate-800 mb-1">{item.name}</div>
                      <div className="line-clamp-2 text-slate-500 mb-2">{item.description}</div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${item.enBodega ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                          {item.enBodega ? 'En Bodega ✓' : 'No en Bodega'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          item.modalidad === 'venta_calzada' ? 'bg-amber-100 text-amber-800' :
                          item.modalidad === 'agotado' ? 'bg-rose-100 text-rose-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.modalidad === 'venta_calzada' ? 'Venta Calzada' : item.modalidad === 'agotado' ? 'Agotado' : 'En Stock'}
                        </span>
                        {item.modalidad === 'venta_calzada' && item.tiempoEntrega && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[9px] font-bold">
                            ⏱️ {item.tiempoEntrega}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </td>
                <td className="p-4 text-right">
                  {isEditing ? (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Costo:</span>
                        <input 
                          type="text"
                          value={editCatalogData.unitPrice !== undefined ? formatCLP(editCatalogData.unitPrice) : formatCLP(item.unitPrice)}
                          onChange={e => setEditCatalogData(prev => ({...prev, unitPrice: parseCLP(e.target.value)}))}
                          className="w-24 text-right bg-white border border-slate-200 rounded px-2 py-1 font-mono text-xs font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Venta:</span>
                        <input 
                          type="text"
                          value={formatCLP(editCatalogData.precioVentaFinal ?? item.precioVentaFinal ?? item.unitPrice ?? 0)}
                          onChange={e => setEditCatalogData(prev => ({...prev, precioVentaFinal: parseCLP(e.target.value)}))}
                          className="w-24 text-right bg-white border border-emerald-300 rounded px-2 py-1 font-mono text-xs font-bold text-emerald-700 focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        Costo: <span className="font-mono text-slate-700">${(item.unitPrice || 0).toLocaleString('es-CL')}</span>
                      </div>
                      <div className="font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded inline-block text-xs border border-emerald-200">
                        Venta: ${((item.precioVentaFinal || item.unitPrice || 0)).toLocaleString('es-CL')}
                      </div>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={() => handleUpdateCatalogItem(item.id)}
                          className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition shadow-sm"
                          title="Guardar Cambios"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingCatalogId(null);
                            setEditCatalogData({});
                          }}
                          className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition"
                          title="Cancelar"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            setEditingCatalogId(item.id);
                            setEditCatalogData({
                              name: item.name,
                              description: item.description,
                              unitPrice: item.unitPrice,
                              enBodega: item.enBodega ?? false,
                              modalidad: item.modalidad ?? 'stock',
                              tiempoEntrega: item.tiempoEntrega ?? '',
                              precioVentaFinal: item.precioVentaFinal ?? item.unitPrice ?? 0
                            });
                          }}
                          className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded hover:bg-slate-50 transition shadow-sm"
                          title="Editar Ítem"
                        >
                          <Edit3 size={14} />
                        </button>
                        <div className="h-6 w-px bg-slate-200 mx-1"></div>
                        <input 
                          type="number" 
                          min="1"
                          value={getCatalogQuantity(item.id)}
                          onChange={(e) => handleCatalogQuantityChange(item.id, Number(e.target.value))}
                          className="w-12 text-center border border-slate-200 rounded py-1 text-xs focus:ring-1 focus:ring-indigo-500 font-mono"
                        />
                        <button 
                          onClick={() => addItemFromCatalog(item)}
                          className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                          title="Añadir al Presupuesto"
                        >
                          <Plus size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCatalogItem(item.id)}
                          className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition"
                          title="Eliminar del Catálogo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
                </motion.tr>
              )})}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex flex-col items-center justify-center text-center bg-slate-50 p-6 rounded-xl border border-slate-100 border-dashed">
        <p className="text-[10px] uppercase text-slate-500 font-bold mb-4">Los ítems se pueden añadir fácilmente desde la vista de propuesta.</p>
        <button onClick={() => setActiveTab('proposal')} className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg active:scale-95 flex items-center gap-2">
          <FileText size={16} /> Ir a Propuesta Actual
        </button>
      </div>
    </div>
  );
};
