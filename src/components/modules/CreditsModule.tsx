import React from 'react';
import { motion } from 'motion/react';
import { Layout, PlusCircle, Loader2 } from 'lucide-react';
import { formatCLP, parseCLP } from '../../lib/utils';

interface CreditsModuleProps {
  creditLines: any[];
  newCredit: any;
  setNewCredit: (c: any) => void;
  saveCredit: () => Promise<void>;
  isSavingCredit: boolean;
  editingCreditId: string | null;
  startEditCredit: (c: any) => void;
  deleteCredit: (id: string) => Promise<void>;
}

export const CreditsModule: React.FC<CreditsModuleProps> = ({
  creditLines,
  newCredit,
  setNewCredit,
  saveCredit,
  isSavingCredit,
  editingCreditId,
  startEditCredit,
  deleteCredit
}) => {
  const totalCreditLimit = creditLines.reduce((acc, curr) => acc + curr.totalLimit, 0);
  const totalUsedCredit = creditLines.reduce((acc, curr) => acc + curr.usedAmount, 0);
  const availableLeverage = totalCreditLimit - totalUsedCredit;
  const leveragePercentage = totalCreditLimit > 0 ? (totalUsedCredit / totalCreditLimit) * 100 : 0;

  return (
    <div className="space-y-5 px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <Layout className="text-indigo-600" size={20} />
            Líneas de Crédito & Apalancamiento
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Monitoreo de capacidad financiera y deuda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Cupo Total</p>
          <h3 className="text-xl font-black text-white leading-none">${totalCreditLimit.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-rose-600">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Deuda Activa</p>
          <h3 className="text-xl font-black leading-none">${totalUsedCredit.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-emerald-600 lg:col-span-2">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacidad Disponible</p>
          <div className="flex items-end justify-between gap-3">
            <h3 className="text-2xl font-black leading-none">${availableLeverage.toLocaleString()}</h3>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden mb-1 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, 100 - leveragePercentage)}%` }}
                className="h-full bg-emerald-500 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          id="credit-form-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <PlusCircle size={16} className={editingCreditId ? "text-amber-500" : "text-indigo-600"} /> 
              {editingCreditId ? "Editar Cupo" : "Nuevo Cupo"}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Entidad Financiera</label>
              <input 
                type="text" 
                value={newCredit.institution}
                onChange={e => setNewCredit({...newCredit, institution: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ej: Banco de Chile..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Cupo Máximo</label>
                <input 
                  type="text" 
                  value={newCredit.totalLimit ? formatCLP(newCredit.totalLimit) : ''}
                  onChange={e => setNewCredit({...newCredit, totalLimit: parseCLP(e.target.value)})}
                  placeholder="Ej: $10.000.000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Deuda Actual</label>
                <input 
                  type="text" 
                  value={newCredit.usedAmount ? formatCLP(newCredit.usedAmount) : ''}
                  onChange={e => setNewCredit({...newCredit, usedAmount: parseCLP(e.target.value)})}
                  placeholder="Ej: $2.500.000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-rose-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Día Corte</label>
                <input 
                  type="number" 
                  min="1" max="31"
                  value={newCredit.cutoffDay}
                  onChange={e => setNewCredit({...newCredit, cutoffDay: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Día Pago</label>
                <input 
                  type="number" 
                  min="1" max="31"
                  value={newCredit.paymentDay}
                  onChange={e => setNewCredit({...newCredit, paymentDay: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <button 
              onClick={saveCredit}
              disabled={isSavingCredit}
              className={`w-full py-4 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-2 ${editingCreditId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-100' : 'bg-slate-900 hover:bg-indigo-600 shadow-slate-100'}`}
            >
              {isSavingCredit ? <Loader2 className="animate-spin mx-auto" size={16} /> : (editingCreditId ? "Actualizar Registro" : "Vincular a Financiero")}
            </button>
            {editingCreditId && (
              <button 
                onClick={() => startEditCredit(null)}
                className="w-full py-2 text-[9px] font-black uppercase text-slate-400 hover:text-slate-600"
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]"
        >
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Layout size={18} className="text-amber-500" /> Monitoreo de Casas Comerciales
          </h2>
          
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {creditLines.map(credit => (
              <div key={credit.id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-200 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100 font-black text-lg">
                      {credit.institution.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">{credit.institution}</h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Cupo: ${credit.totalLimit.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 leading-none">${(credit.totalLimit - credit.usedAmount).toLocaleString()}</span>
                    <p className="text-[9px] font-black uppercase text-emerald-500 mt-1">Disponible</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1 leading-none tracking-tighter">Día de Corte</p>
                    <span className="text-[10px] font-black text-slate-700">{credit.cutoffDay} de cada mes</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1 leading-none tracking-tighter">Día de Pago</p>
                    <span className="text-[10px] font-black text-indigo-600">{credit.paymentDay} de cada mes</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1 leading-none tracking-tighter">Uso de Línea</p>
                    <span className="text-[10px] font-black text-rose-500">{((credit.usedAmount / credit.totalLimit) * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${credit.usedAmount > credit.totalLimit * 0.8 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Salud Crediticia</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEditCredit(credit)}
                      className="p-1.5 px-3 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xs"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => deleteCredit(credit.id)}
                      className="p-1.5 px-3 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-xs"
                    >
                      Desvincular
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {creditLines.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <Layout size={48} className="opacity-20 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Sin líneas de crédito</p>
                <p className="text-[9px] text-slate-300 mt-2">Agrega tus tarjetas y créditos para ver tu capacidad de apalancamiento</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
