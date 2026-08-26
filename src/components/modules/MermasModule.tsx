import React from 'react';
import { motion } from 'motion/react';
import { Trash2, PlusCircle, History, AlertTriangle, Loader2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { formatCLP, parseCLP } from '../../lib/utils';

interface MermasModuleProps {
  shrinkages: any[];
  newShrinkage: any;
  setNewShrinkage: (s: any) => void;
  saveShrinkage: () => Promise<void>;
  isSavingShrinkage: boolean;
  deleteShrinkage: (id: string) => Promise<void>;
}

export const MermasModule: React.FC<MermasModuleProps> = ({
  shrinkages,
  newShrinkage,
  setNewShrinkage,
  saveShrinkage,
  isSavingShrinkage,
  deleteShrinkage
}) => {
  const totalShrinkageCost = shrinkages.reduce((acc, curr) => acc + (curr.unitCost * curr.quantity), 0);
  const shrinkageCount = shrinkages.length;

  return (
    <div className="space-y-5 px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <Trash2 className="text-rose-600" size={20} />
            Control de Mermas & Pérdidas
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Registro de stock dañado o no apto para venta.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-rose-900 p-5 rounded-2xl border border-rose-800 shadow-xl overflow-hidden relative group">
          <p className="text-[8px] font-black text-rose-300 uppercase tracking-widest mb-1">Costo Total Mermas</p>
          <h3 className="text-xl font-black text-white leading-none">${totalShrinkageCost.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-slate-600">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Registros</p>
          <h3 className="text-xl font-black leading-none">{shrinkageCount}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-slate-600">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Costo Promedio</p>
          <h3 className="text-xl font-black leading-none">${shrinkageCount > 0 ? (totalShrinkageCost / shrinkageCount).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit"
        >
          <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <PlusCircle size={16} className="text-rose-600" /> Nueva Merma
          </h2>
          <div className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Producto</label>
              <input 
                type="text" 
                value={newShrinkage.productName}
                onChange={e => setNewShrinkage({...newShrinkage, productName: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                placeholder="Nombre del producto..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Cant.</label>
                <input 
                  type="number" 
                  value={newShrinkage.quantity || ''}
                  onChange={e => setNewShrinkage({...newShrinkage, quantity: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Costo U.</label>
                <input 
                  type="text" 
                  value={newShrinkage.unitCost ? formatCLP(newShrinkage.unitCost) : ''}
                  onChange={e => setNewShrinkage({...newShrinkage, unitCost: parseCLP(e.target.value)})}
                  placeholder="Ej: $5.000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
            <button 
              onClick={saveShrinkage}
              disabled={isSavingShrinkage}
              className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isSavingShrinkage ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Registrar Merma"}
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[400px]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <History size={18} className="text-slate-400" /> Historial de Mermas
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {shrinkages.map(s => (
              <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-rose-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-rose-100 text-rose-600 shadow-sm border border-rose-200/50`}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{s.productName}</h4>
                      <span className="px-2 py-0.5 bg-slate-200 rounded text-[8px] font-black uppercase text-slate-500 tracking-widest">
                        {s.reason || 'MERMA'}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {s.quantity} unidad(es) • {s.date instanceof Timestamp ? s.date.toDate().toLocaleDateString() : (s.date?.toDate ? s.date.toDate().toLocaleDateString() : 'Reciente')}
                    </p>
                    {s.description && (
                      <p className="text-[10px] text-slate-500 italic mt-1.5 border-l-2 border-rose-200 pl-2 leading-relaxed">{s.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-rose-600 block">
                      -${(s.unitCost * s.quantity).toLocaleString()}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Perjuicio Económico</span>
                  </div>
                  <button 
                    onClick={() => deleteShrinkage(s.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {shrinkages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Trash2 size={48} className="opacity-10 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">No hay mermas registradas</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
