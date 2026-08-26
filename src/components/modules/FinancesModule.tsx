import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, Banknote, RefreshCw, Target, BarChart4, ShieldCheck, ReceiptText, Trash2 } from 'lucide-react';
import { ExpenseForm } from '../ExpenseForm';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

interface FinancesModuleProps {
  financialMetrics: any;
  grossMarginValue: number;
  ebitda: number;
  netMargin: number;
  breakEvenPoint: number;
  totalIncome: number;
  expenses: any[];
  saveExpense: (expense: any) => Promise<void>;
  isSavingExpense: boolean;
  deleteExpense: (id: string) => Promise<void>;
}

export const FinancesModule: React.FC<FinancesModuleProps> = ({
  financialMetrics,
  grossMarginValue,
  ebitda,
  netMargin,
  breakEvenPoint,
  totalIncome,
  expenses,
  saveExpense,
  isSavingExpense,
  deleteExpense
}) => {
  const {
    totalOutflow,
    totalDirectCost,
    totalOpEx,
    taxExpenses,
    interestExpenses,
    amortizationExpenses,
    totalExpenses
  } = financialMetrics;

  const salesGap = breakEvenPoint - totalIncome;
  const isBreakedEven = totalIncome >= breakEvenPoint;

  return (
    <div className="space-y-5 px-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <CreditCard className="text-indigo-600" size={20} />
            Finanzas & P&L Corporativo
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Estado de resultados y salud financiera.</p>
        </div>
      </div>

      {/* Dashboard de Liquidez */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-emerald-600 p-4 rounded-2xl border border-emerald-500 shadow-md text-white">
          <p className="text-[7px] font-black uppercase tracking-widest mb-1 flex items-center gap-1 opacity-80">
            <Banknote size={10} /> Saldo Caja
          </p>
          <div className="text-lg font-black leading-none">
            ${Math.round(financialMetrics.cashBalance || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Por Cobrar</p>
          <div className="text-lg font-black text-slate-900 leading-none">
            ${Math.round(financialMetrics.accountsReceivable || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Por Pagar</p>
          <div className="text-lg font-black text-slate-900 leading-none">
            ${Math.round(financialMetrics.accountsPayable || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 shadow-sm text-indigo-600">
          <p className="text-[7px] font-black uppercase tracking-widest mb-1">Cap. Trabajo</p>
          <div className="text-lg font-black leading-none">
            ${Math.round(financialMetrics.liquidityPosition || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Sincronizador de Calce */}
      <div className="bg-amber-500/10 p-5 rounded-3xl border border-amber-500/20">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="p-3 bg-amber-500/20 text-amber-600 rounded-2xl">
            <RefreshCw size={20} />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Ajuste de Realidad</h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Sincroniza tu bolsillo con el sistema.</p>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 outline-none w-32 focus:ring-2 focus:ring-amber-400"
              placeholder="Monto Real"
              onChange={(e) => (window as any)._lastManualBalanceFinances = parseFloat(e.target.value)}
            />
            <button 
              onClick={async () => {
                const val = (window as any)._lastManualBalanceFinances;
                if (val === undefined || isNaN(val)) return alert("Ingresa tu saldo real");
                const diff = val - (financialMetrics.cashBalance || 0);
                if (Math.abs(diff) < 1) return alert("Ya está sincronizado");
                await addDoc(collection(db, "cashTransactions"), {
                  concept: `AJUSTE DE CAJA (FINANZAS)`,
                  type: diff > 0 ? 'in' : 'out',
                  amount: Math.abs(diff),
                  date: serverTimestamp(),
                  ownerId: auth.currentUser?.uid
                });
                alert("Caja sincronizada.");
              }}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ventas Brutas</p>
          <h3 className="text-xl font-black text-white leading-none">${totalIncome.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-indigo-600">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Margen Bruto</p>
          <h3 className="text-xl font-black leading-none">${grossMarginValue.toLocaleString()}</h3>
        </div>

        <div className={`p-6 rounded-3xl border shadow-xl ${ebitda >= 0 ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-100' : 'bg-rose-600 text-white border-rose-500 shadow-rose-100'}`}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">EBITDA</p>
          <h3 className="text-xl font-black leading-none">${ebitda.toLocaleString()}</h3>
        </div>

        <div className={`p-6 rounded-3xl border shadow-xl ${netMargin >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-50' : 'bg-rose-50 border-rose-100 text-rose-600 shadow-rose-50'}`}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Neto Final</p>
          <h3 className="text-xl font-black leading-none">${netMargin.toLocaleString()}</h3>
        </div>
      </div>

      {/* Analisis Saas Metrics & Break-even */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${isBreakedEven ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            <Target size={24} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Punto de Equilibrio</p>
            <h4 className="text-xl font-black text-slate-900 leading-none">${breakEvenPoint.toLocaleString(undefined, {maximumFractionDigits: 0})}</h4>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">
              {isBreakedEven ? '¡En zona de Ganancia!' : `Faltan $${Math.max(0, salesGap).toLocaleString(undefined, {maximumFractionDigits: 0})} para ser rentable`}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-indigo-100 text-indigo-600">
            <BarChart4 size={24} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Costo Operativo + Mermas</p>
            <h4 className="text-xl font-black text-slate-900 leading-none">${totalOutflow.toLocaleString()}</h4>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">OpEx + Pérdidas de Stock</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-slate-900 text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Eficiencia de Capital</p>
            <h4 className="text-xl font-black text-slate-900 leading-none">
              {totalIncome > 0 ? (totalIncome / totalOutflow).toFixed(2) : '0.00'}x
            </h4>
            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Venta por cada $1 de gasto total</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Gasto Corporativo */}
        <ExpenseForm onSave={saveExpense} isSaving={isSavingExpense} />


        {/* Historial y Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6 overflow-hidden"
        >
          {/* P&L Structure (Table) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ReceiptText size={18} className="text-emerald-500" /> Estructura de Resultados (P&L)
            </h2>
            <div className="space-y-2 min-w-[300px]">
              <div className="flex justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-100 italic">
                <span className="text-xs text-slate-600 font-bold uppercase tracking-tight">Ingresos Totales (Sales)</span>
                <span className="text-xs text-slate-900 font-black">${totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-100">
                <span className="text-xs text-slate-400 px-6 uppercase tracking-tight">- Costos Directos (COGS)</span>
                <span className="text-xs text-rose-500 font-bold">-${totalDirectCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-4 bg-slate-50 rounded-2xl mt-4 border border-slate-100">
                <span className="text-xs text-slate-900 font-black uppercase tracking-tight">UTILIDAD BRUTA</span>
                <span className="text-xs text-indigo-600 font-black">${grossMarginValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-100">
                <span className="text-xs text-slate-400 px-6 uppercase tracking-tight">- Gastos Operativos (OpEx)</span>
                <span className="text-xs text-rose-500 font-bold">-${totalOpEx.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-4 bg-slate-900 text-white rounded-2xl mt-4 shadow-lg shadow-slate-200">
                <span className="text-xs font-black tracking-widest uppercase">EBITDA</span>
                <span className="text-xs font-black">${ebitda.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-100">
                <span className="text-xs text-slate-400 px-6 uppercase tracking-tight">- Impuestos (Tax)</span>
                <span className="text-xs text-rose-400 font-bold">-${taxExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-100">
                <span className="text-xs text-slate-400 px-6 uppercase tracking-tight">- Intereses (Interest)</span>
                <span className="text-xs text-rose-400 font-bold">-${interestExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-100">
                <span className="text-xs text-slate-400 px-6 uppercase tracking-tight">- Amortizaciones (DA)</span>
                <span className="text-xs text-rose-400 font-bold">-${amortizationExpenses.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between p-5 rounded-3xl mt-6 border-2 shadow-xl ${netMargin >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                <span className="text-sm font-black uppercase tracking-widest">UTILIDAD NETA (FINAL)</span>
                <span className="text-sm font-black">${netMargin.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Historial Rapido */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ultimos Egresos Registrados</h3>
              <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase border border-indigo-100">Total: ${totalExpenses.toLocaleString()}</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              {expenses.slice(0, 15).map(exp => (
                <div key={exp.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-300 hover:bg-white transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl shadow-sm border ${
                      ['impuesto', 'interes', 'amortizacion'].includes(exp.category) ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-white text-slate-600 border-slate-100'
                    }`}>
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase leading-none">{exp.name}</h4>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1 block opacity-60">{exp.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-rose-600">-${exp.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => deleteExpense(exp.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                   <p className="text-[10px] font-black uppercase tracking-widest">Sin gastos registrados</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
