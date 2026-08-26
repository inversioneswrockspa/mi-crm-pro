import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Expense } from '../types';
import { formatCLP, parseCLP } from '../lib/utils';

interface ExpenseFormProps {
  onSave: (expense: Omit<Expense, 'id'>) => void;
  isSaving: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSave, isSaving }) => {
  const [expense, setExpense] = useState<Omit<Expense, 'id'>>({
    name: '',
    category: 'fijo',
    amount: 0,
    date: new Date(),
    ownerId: '', // Should be set by App
    description: ''
  });

  const handleSave = async () => {
    try {
      await onSave(expense);
      setExpense({
        name: '',
        category: 'fijo',
        amount: 0,
        date: new Date(),
        ownerId: '',
        description: ''
      });
    } catch (err) {
      // Error handled by parent
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
    >
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
          <PlusCircle size={18} className="text-indigo-600" /> Gestionar Gastos OpEx / Tax
        </h2>
        <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Concepto / Beneficiario</label>
              <input 
                type="text" 
                value={expense.name}
                onChange={e => setExpense({...expense, name: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ej: Nomina, Luz, IVA, Interés Banco..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Clasificación</label>
                  <select 
                    value={expense.category}
                    onChange={e => setExpense({...expense, category: e.target.value as any})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                  >
                    <optgroup label="Operativos (EBITDA)">
                      <option value="fijo">Gasto Fijo</option>
                      <option value="sueldo">Sueldo / Personal</option>
                      <option value="retiro">Retiro Personal / Dueño</option>
                      <option value="arriendo">Arriendo / Local</option>
                      <option value="variable">Gasto Variable</option>
                      <option value="mkt">Marketing / Ads</option>
                      <option value="personal">RRHH / Sueldos</option>
                      <option value="otro">Otros</option>
                    </optgroup>
                    <optgroup label="Bajo Línea (Neto)">
                      <option value="impuesto">Impuestos (IVA/Renta)</option>
                      <option value="interes">Intereses Financieros</option>
                      <option value="amortizacion">Amortización / Depre.</option>
                    </optgroup>
                  </select>
              </div>
              <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Monto Líquido ($)</label>
                  <input 
                    type="text" 
                    value={expense.amount ? formatCLP(expense.amount) : ''}
                    onChange={e => setExpense({...expense, amount: parseCLP(e.target.value)})}
                    placeholder="Ej: $15.000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Comentarios Internos</label>
              <textarea 
                value={expense.description || ''}
                onChange={e => setExpense({...expense, description: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"
              />
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Registrar en P&L Corporativo"}
            </button>
        </div>
    </motion.div>
  );
};
