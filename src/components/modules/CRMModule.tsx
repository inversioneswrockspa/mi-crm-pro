import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Plus, Loader2, Save, Pencil, Trash2, Briefcase, Clock, Send, Sparkles, MessageSquare, Copy, Check, Share2, Zap, ShoppingBag } from 'lucide-react';
import { calcularPrecioAutomatico } from '../../logic/taxLogic';
import { formatCLP } from '../../lib/utils';

interface CRMModuleProps {
  clients: any[];
  clientSearchTerm: string;
  setClientSearchTerm: (term: string) => void;
  newClient: any;
  setNewClient: (c: any) => void;
  saveClient: () => Promise<void>;
  isSavingClient: boolean;
  editingClientId: string | null;
  startEditClient: (c: any) => void;
  deleteClient: (e: any, id: string) => Promise<void>;
  isFetchingClients: boolean;
  previousQuotes: any[];
  isConfirmedStatus: (status: string, signature: any) => boolean;
  crmRawText?: string;
  setCrmRawText?: (text: string) => void;
  processCrmTextWithAI?: () => Promise<void>;
  isCrmAiImporting?: boolean;
  catalog?: any[];
}

export const CRMModule: React.FC<CRMModuleProps> = ({
  clients,
  clientSearchTerm,
  setClientSearchTerm,
  newClient,
  setNewClient,
  saveClient,
  isSavingClient,
  editingClientId,
  startEditClient,
  deleteClient,
  isFetchingClients,
  previousQuotes,
  isConfirmedStatus,
  crmRawText = '',
  setCrmRawText,
  processCrmTextWithAI,
  isCrmAiImporting = false,
  catalog = []
}) => {
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');
  const [quickClientName, setQuickClientName] = useState<string>('');
  const [quickPhone, setQuickPhone] = useState<string>('');
  const [quickQty, setQuickQty] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customPriceInput, setCustomPriceInput] = useState<string>('');
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<'full_1d' | 'local_3d' | 'import_7d' | 'bodega'>('full_1d');

  const selectedItem = useMemo(() => {
    if (!selectedCatalogId && catalog.length > 0) return catalog[0];
    return catalog.find(i => i.id === selectedCatalogId) || catalog[0] || null;
  }, [catalog, selectedCatalogId]);

  const deliveryText = useMemo(() => {
    switch (selectedDeliveryType) {
      case 'bodega': return 'para HOY';
      case 'full_1d': return 'para mañana';
      case 'local_3d': return 'en 2 a 3 días hábiles';
      case 'import_7d': return 'en 5 a 7 días hábiles (a pedido)';
      default: return 'para mañana';
    }
  }, [selectedDeliveryType]);

  const itemCalculation = useMemo(() => {
    if (!selectedItem) return null;
    const costoNeto = Math.max(0, selectedItem.unitCost || selectedItem.unitPrice || 0);
    const autoCalc = calcularPrecioAutomatico(costoNeto);
    
    // Si el usuario ingresó un precio de venta personalizado para FB Marketplace
    const customPriceNum = customPriceInput ? Number(customPriceInput.replace(/\D/g, '')) : 0;
    const precioNetoBase = customPriceNum > 0 ? customPriceNum : Math.round(autoCalc.precioFinal / 1.19);
    
    const qty = Math.max(1, quickQty);
    const netoTotal = Math.round(precioNetoBase * qty);
    const ivaTotal = Math.round(netoTotal * 0.19);
    const brutoTotal = netoTotal + ivaTotal;
    const margenReal = costoNeto > 0 ? Math.round(((precioNetoBase - costoNeto) / costoNeto) * 100) : 0;
    
    return {
      costoNeto,
      margenAplicado: customPriceNum > 0 ? margenReal : autoCalc.margenAplicado,
      precioNetoUnidad: precioNetoBase,
      precioBrutoUnidad: Math.round(precioNetoBase * 1.19),
      netoTotal,
      ivaTotal,
      brutoTotal
    };
  }, [selectedItem, quickQty, customPriceInput]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendWhatsAppQuick = () => {
    if (!selectedItem || !itemCalculation) return;
    const clientNameStr = quickClientName.trim() || 'Estimado(a) Cliente';
    const msg = `¡Hola ${clientNameStr}! Te comparto la cotización solicitada:

📦 *Producto:* ${selectedItem.name}
🔢 *Cantidad:* ${quickQty} unidad(es)
💵 *Valor Neto:* ${formatCLP(itemCalculation.netoTotal)}
📄 *IVA (19%):* ${formatCLP(itemCalculation.ivaTotal)}
💰 *TOTAL BRUTO:* ${formatCLP(itemCalculation.brutoTotal)} (Factura de Compra)

✅ *Garantía:* 1 año oficial.
🚚 *Despacho:* A todo Chile.

Quedamos atentos a tus datos para emitir la Factura y reservar tu unidad.`;

    const cleanPhone = quickPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone 
      ? `https://wa.me/${cleanPhone.startsWith('56') ? cleanPhone : '56' + cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;

    window.open(url, '_blank');
  };

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      (c.name || '').toLowerCase().includes((clientSearchTerm || '').toLowerCase()) ||
      (c.rut || '').toLowerCase().includes((clientSearchTerm || '').toLowerCase()) ||
      (c.company || '').toLowerCase().includes((clientSearchTerm || '').toLowerCase())
    );
  }, [clients, clientSearchTerm]);

  return (
    <div className="space-y-4 px-4 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
              <Users className="text-indigo-600" size={20} />
              Gestión de Clientes & CRM
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Base de prospectos y cartera activa.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-indigo-50 px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[80px] border border-indigo-100">
              <span className="text-[7px] font-black text-indigo-400 uppercase tracking-tighter">Clientes</span>
              <span className="text-sm font-black text-indigo-700 leading-none">{clients.length}</span>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[80px] border border-emerald-100">
              <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">Pipeline</span>
              <span className="text-sm font-black text-emerald-700 leading-none">
                {previousQuotes.filter(q => {
                  const s = (q.status || '').toLowerCase();
                  return (s === 'sent' || s === 'enviado' || s === 'pending') && !isConfirmedStatus(q.status, q.signature);
                }).length}
              </span>
            </div>
          </div>
        </div>

        {/* CRM Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar cliente por nombre, RUT o empresa..."
              value={clientSearchTerm}
              onChange={(e) => setClientSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
            />
          </div>
          <button 
            onClick={() => {
              const addClientSection = document.getElementById('add-client-form');
              addClientSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            <Plus size={16} /> Nuevo Cliente
          </button>
        </div>

        {/* Add Client Form */}
        <div id="add-client-form" className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8 shadow-inner">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              {editingClientId ? 'Actualizar Expediente' : 'Registrar Nuevo Cliente'}
            </h3>
          </div>

          {!editingClientId && setCrmRawText && processCrmTextWithAI && (
            <div className="mb-5 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/60 space-y-2.5 text-left">
              <h4 className="text-[9px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-600 animate-pulse" /> Importador Mágico con IA (Google Maps / WhatsApp)
              </h4>
              <p className="text-[8px] text-indigo-600 font-bold uppercase tracking-tight leading-normal">
                Copia y pega toda la información del negocio técnica desde Google Maps, firma de email o chats aquí:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <textarea 
                  rows={2}
                  value={crmRawText}
                  onChange={e => setCrmRawText(e.target.value)}
                  placeholder="Ej: ClimaViña SpA, +56987654321, Av. Libertad 123, contacto@climavina.cl..."
                  className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-lg text-xs outline-none resize-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                <button 
                  onClick={processCrmTextWithAI}
                  disabled={isCrmAiImporting || !crmRawText.trim()}
                  className="sm:w-44 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  {isCrmAiImporting ? <Loader2 size={12} className="animate-spin" /> : <><Sparkles size={12} /> Autocompletar con IA</>}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nombre Completo</label>
              <input 
                type="text" 
                value={newClient.name || ''}
                onChange={e => setNewClient({...newClient, name: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">RUT / Identificación</label>
              <input 
                type="text" 
                value={newClient.rut || ''}
                onChange={e => setNewClient({...newClient, rut: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Empresa / Razón Social</label>
              <input 
                type="text" 
                value={newClient.company || ''}
                onChange={e => setNewClient({...newClient, company: e.target.value})}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Teléfono</label>
              <input 
                type="tel" 
                value={newClient.phone || ''}
                onChange={e => setNewClient({...newClient, phone: e.target.value})}
                placeholder="+56 9 ..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={newClient.email || ''}
                onChange={e => setNewClient({...newClient, email: e.target.value})}
                placeholder="correo@ejemplo.com"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Dirección / Ubicación</label>
              <input 
                type="text" 
                value={newClient.address || ''}
                onChange={e => setNewClient({...newClient, address: e.target.value})}
                placeholder="Calle, Ciudad"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
            </div>
            <div className="space-y-1 text-left md:col-span-2 lg:col-span-3">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Notas de Terreno / Requerimientos</label>
              <textarea 
                rows={2}
                value={newClient.terrainNotes || ''}
                onChange={e => setNewClient({...newClient, terrainNotes: e.target.value})}
                placeholder="Detalles de la visita, requerimientos técnicos específicos..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-bold"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={saveClient}
              disabled={isSavingClient || !newClient.name || !newClient.rut}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isSavingClient ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {editingClientId ? 'Actualizar Ficha' : 'Guardar en CRM'}
            </button>
          </div>
        </div>

        {/* Clients List */}
        <div className="space-y-5">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Users size={14} /> Cartera de Clientes Activos
          </h3>
          {isFetchingClients ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-indigo-400" size={32} />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Base de Datos...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 text-slate-400 text-xs italic">
              {clientSearchTerm ? 'No se encontraron clientes que coincidan con la búsqueda.' : 'No tienes clientes registrados todavía.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredClients.map(client => (
                <motion.div 
                  key={client.id}
                  layout
                  className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 hover:shadow-lg transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{client.name}</h4>
                      <p className="text-[10px] text-indigo-600 font-mono font-bold">{client.rut}</p>
                    </div>
                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEditClient(client)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Editar Cliente"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={(e) => deleteClient(e, client.id)}
                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Eliminar Cliente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 border-t border-slate-50 pt-4 relative z-10">
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={14} className="text-slate-400" />
                      </div>
                      <span className="font-bold uppercase text-[9px] tracking-tight">{client.company || 'Sin Sociedad Declarada'}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                          <Clock size={14} className="text-slate-400" />
                        </div>
                        <span className="font-mono text-[10px]">{client.phone}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                          <Send size={14} className="text-slate-400" />
                        </div>
                        <span className="text-[10px] truncate">{client.email}</span>
                      </div>
                    )}
                  </div>
                  {/* Decorator */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50/50 transition-colors pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
