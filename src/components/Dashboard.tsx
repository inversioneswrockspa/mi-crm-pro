import React, { useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowDownToLine, 
  Target, 
  Banknote, 
  BarChart4, 
  RefreshCw,
  FileText,
  CheckCircle2,
  CreditCard,
  Pencil,
  Trash2,
  ShieldAlert,
  LogIn
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  BarChart,
  Bar
} from 'recharts';

interface DashboardProps {
  user: any;
  financialMetrics: any;
  previousQuotes: any[];
  dashboardChartData: any;
  dashboardFilteredQuotes: any[];
  dashboardFilter: string;
  setDashboardFilter: (filter: any) => void;
  isConfirmedStatus: (status: any, signature: any) => boolean;
  loadQuote: (id: string) => void;
  markAsWon: (id: string, name: string, total: number) => Promise<void>;
  markAsPaid: (id: string) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  handleLogin: () => void;
  syncCash: (val: number) => Promise<void>;
  importBatches: any[];
  shrinkages: any[];
  expenses?: any[];
  purchaseRecords?: any[];
  cashTransactions?: any[];
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  financialMetrics,
  previousQuotes,
  dashboardChartData,
  dashboardFilteredQuotes,
  dashboardFilter,
  setDashboardFilter,
  isConfirmedStatus,
  loadQuote,
  markAsWon,
  markAsPaid,
  deleteQuote,
  handleLogin,
  syncCash,
  importBatches = [],
  shrinkages = [],
  expenses = [],
  purchaseRecords = [],
  cashTransactions = []
}) => {
  const [chartTimeframe, setChartTimeframe] = React.useState<'daily'|'monthly'|'quarterly'|'semester'|'yearly'>('monthly');

  const getTimeKey = (dateObj: Date): string => {
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    if (chartTimeframe === 'daily') return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (chartTimeframe === 'monthly') return `${y}-${String(m).padStart(2,'0')}`;
    if (chartTimeframe === 'quarterly') return `${y}-Q${Math.ceil(m/3)}`;
    if (chartTimeframe === 'semester') return `${y}-S${Math.ceil(m/6)}`;
    return `${y}`;
  };

  const resolveDate = (raw: any): Date => {
    if (!raw) return new Date();
    if (typeof raw.toDate === 'function') return raw.toDate();
    if (raw.seconds) return new Date(raw.seconds * 1000);
    return new Date(raw);
  };

  const timeSeriesData = React.useMemo(() => {
    const incomeMap: {[key:string]:number} = {};
    const expenseMap: {[key:string]:number} = {};
    const allKeys = new Set<string>();

    // Ingresos: cotizaciones aprobadas/pagadas
    previousQuotes
      .filter(q => isConfirmedStatus(q.status, q.signature))
      .forEach(q => {
        const key = getTimeKey(resolveDate(q.createdAt));
        allKeys.add(key);
        incomeMap[key] = (incomeMap[key] || 0) + (q.totalProposal || 0);
      });

    // Salidas: gastos operativos
    expenses.forEach(e => {
      const key = getTimeKey(resolveDate(e.date || e.createdAt));
      allKeys.add(key);
      expenseMap[key] = (expenseMap[key] || 0) + (e.amount || 0);
    });

    // Salidas: compras/facturas
    purchaseRecords.forEach(p => {
      const key = getTimeKey(resolveDate(p.date || p.createdAt));
      allKeys.add(key);
      expenseMap[key] = (expenseMap[key] || 0) + (p.totalAmount || p.netAmount || 0);
    });

    // Salidas: egresos de caja
    cashTransactions.filter(t => t.type === 'out').forEach(t => {
      const key = getTimeKey(resolveDate(t.date || t.createdAt));
      allKeys.add(key);
      expenseMap[key] = (expenseMap[key] || 0) + (t.amount || 0);
    });

    return Array.from(allKeys)
      .sort((a, b) => a.localeCompare(b))
      .map(key => ({
        timeKey: key,
        ingresos: Math.round(incomeMap[key] || 0),
        salidas: Math.round(expenseMap[key] || 0),
        utilidad: Math.round((incomeMap[key] || 0) - (expenseMap[key] || 0))
      }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousQuotes, expenses, purchaseRecords, cashTransactions, chartTimeframe, isConfirmedStatus]);

  // Métricas del periodo actual (último bloque de datos)
  const currentPeriodMetrics = React.useMemo(() => {
    if (timeSeriesData.length === 0) return { ingresos: 0, salidas: 0, utilidad: 0, label: '-' };
    const last = timeSeriesData[timeSeriesData.length - 1];
    const prev = timeSeriesData.length > 1 ? timeSeriesData[timeSeriesData.length - 2] : null;
    return {
      ingresos: last.ingresos,
      salidas: last.salidas,
      utilidad: last.utilidad,
      label: last.timeKey,
      prevIngresos: prev?.ingresos ?? null,
      prevSalidas: prev?.salidas ?? null,
      prevUtilidad: prev?.utilidad ?? null,
    };
  }, [timeSeriesData]);

  const fmt = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
  const pctChange = (curr: number, prev: number | null) => {
    if (prev === null || prev === 0) return null;
    return Math.round(((curr - prev) / Math.abs(prev)) * 100);
  };

  const topClients = React.useMemo(() => {
    const clientMap: {[key:string]: number} = {};
    previousQuotes
      .filter(q => isConfirmedStatus(q.status, q.signature))
      .forEach(q => {
        const name = q.clientInfo?.company || q.clientName || 'Sin Nombre';
        clientMap[name] = (clientMap[name] || 0) + (q.totalProposal || 0);
      });
    return Object.entries(clientMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, total]) => ({ name, total }));
  }, [previousQuotes, isConfirmedStatus]);

  const topProducts = React.useMemo(() => {
    const productMap: {[key:string]: number} = {};
    previousQuotes
      .filter(q => isConfirmedStatus(q.status, q.signature))
      .forEach(q => {
        (q.items || []).forEach((item: any) => {
          const name = item.description || 'Producto sin nombre';
          const qty = Number(item.quantity) || 1;
          const price = Number(item.unitPrice) || 0;
          productMap[name] = (productMap[name] || 0) + (qty * price);
        });
      });
    return Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, total]) => ({ name, total }));
  }, [previousQuotes, isConfirmedStatus]);

  const salesByDayOfWeek = React.useMemo(() => {
    const totals = [0, 0, 0, 0, 0, 0, 0];
    previousQuotes
      .filter(q => isConfirmedStatus(q.status, q.signature))
      .forEach(q => {
        const dateObj = resolveDate(q.createdAt);
        totals[dateObj.getDay()] += (q.totalProposal || 0);
      });
    return [
      { name: 'Lun', total: totals[1] },
      { name: 'Mar', total: totals[2] },
      { name: 'Mié', total: totals[3] },
      { name: 'Jue', total: totals[4] },
      { name: 'Vie', total: totals[5] },
      { name: 'Sáb', total: totals[6] },
      { name: 'Dom', total: totals[0] },
    ];
  }, [previousQuotes, isConfirmedStatus]);

  useEffect(() => {
    //
  }, [financialMetrics]);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-6">
          <LogIn size={40} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Acceso Privado al Dashboard</h2>
        <p className="text-slate-500 text-sm mb-8 max-w-md text-center leading-relaxed">
          Para ver tus analíticas, historial de cotizaciones y herramientas de crecimiento "Solopreneur", necesitas iniciar sesión.
        </p>
        <button 
          onClick={handleLogin}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95 flex items-center gap-2"
        >
          <LogIn size={18} /> Iniciar Sesión con Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* INGRESOS LÍQUIDOS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${financialMetrics.totalIncome > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          <div className="flex flex-col gap-1 mb-2 pl-2">
              <div className="flex justify-between items-center">
                <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Ingresos Totales (Líquidos)</p>
                <div className={`px-1.5 py-0.5 rounded-full text-[6px] font-black uppercase ${financialMetrics.totalIncome > 2000000 ? 'bg-emerald-100 text-emerald-700' : financialMetrics.totalIncome > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  {financialMetrics.totalIncome > 2000000 ? 'ÓPTIMO' : financialMetrics.totalIncome > 0 ? 'REGULAR' : 'SIN DATOS'}
                </div>
              </div>
              <h3 className="text-base font-black text-slate-900 leading-none mt-0.5">
                ${(financialMetrics.totalIncome || 0).toLocaleString()}
              </h3>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Caja + Ventas</span>
            </div>
            {financialMetrics.cashIncome > 0 && (
              <span className="text-[7px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                +${(financialMetrics.cashIncome || 0).toLocaleString()}
              </span>
            )}
          </div>
        </motion.div>

        {/* INVERSIÓN TOTAL (COSTOS) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="flex flex-col gap-1 mb-2">
              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Egresos & Inversión</p>
              <h3 className="text-base font-black text-rose-600 leading-none mt-0.5">
                ${(financialMetrics.totalOutflow || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={10} className="text-slate-400" />
              <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Total Gastos</span>
            </div>
            {financialMetrics.cashExpenses > 0 && (
              <span className="text-[7px] font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded">
                -${(financialMetrics.cashExpenses || 0).toLocaleString()} Caja
              </span>
            )}
          </div>
        </motion.div>

        {/* MARGEN REAL (CONFIRMADO) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm ring-1 ring-indigo-50 relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${financialMetrics.ebitda > 0 ? 'bg-emerald-500' : financialMetrics.ebitda < 0 ? 'bg-rose-500' : 'bg-slate-300'}`} />
          <div className="flex flex-col gap-1 mb-2 pl-2">
              <div className="flex justify-between items-center">
                <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Utilidad Real (Margen)</p>
                <div className={`w-2 h-2 rounded-full ${financialMetrics.ebitda > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : financialMetrics.ebitda < 0 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-slate-300'}`} />
              </div>
              <h3 className={`text-base font-black leading-none mt-0.5 ${financialMetrics.ebitda < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                ${(financialMetrics.ebitda || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[7px] font-black uppercase tracking-widest">
            <span className="text-slate-400">Ventas</span>
            <span className="text-indigo-600 font-bold uppercase">Neto</span>
          </div>
        </motion.div>

        {/* IVA DIFERENCIA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className={`p-3 rounded-xl border shadow-lg ${financialMetrics.ivaDiferencia > 0 ? 'bg-rose-50 border-rose-100 text-rose-900' : 'bg-emerald-900 border-emerald-800 text-white'}`}
        >
          <div className="flex flex-col gap-1 mb-2">
              <p className={`text-[7px] font-black uppercase tracking-widest ${financialMetrics.ivaDiferencia > 0 ? 'text-rose-600' : 'text-emerald-300'}`}>
                {financialMetrics.ivaDiferencia > 0 ? 'IVA a Pagar Estimado' : 'Remanente de IVA'}
              </p>
              <h3 className="text-base font-black leading-none mt-0.5">
                ${Math.round(Math.abs(financialMetrics.ivaDiferencia)).toLocaleString()}
              </h3>
          </div>
          <div className={`pt-2 border-t flex justify-between items-center text-[7px] font-black uppercase tracking-widest ${financialMetrics.ivaDiferencia > 0 ? 'border-rose-100 text-rose-600' : 'border-emerald-800 text-emerald-300'}`}>
            <span>Neto Fiscal</span>
            <span className="font-black">{financialMetrics.ivaDiferencia > 0 ? 'POR PAGAR' : 'A FAVOR'}</span>
          </div>
        </motion.div>
      </div>

      {/* ADICIONAL METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
         {/* IVA DEBITO */}
         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-indigo-900 p-3 rounded-lg border border-indigo-800 shadow-lg"
        >
          <div className="flex flex-col gap-1 mb-2">
              <p className="text-[7px] font-black uppercase tracking-widest text-indigo-300">Total IVA Recaudado (Ventas)</p>
              <h3 className="text-base font-black text-white leading-none mt-0.5">
                ${(financialMetrics.ivaDebito || 0).toLocaleString()}
              </h3>
          </div>
          <div className="pt-2 border-t border-indigo-800 flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-indigo-400">
            <span className="flex items-center gap-1">
               <ShieldCheck size={10} className="text-indigo-300" /> Débito
            </span>
            <span className="text-indigo-300 font-black">OK</span>
          </div>
        </motion.div>

        {/* TOTAL PROPUESTAS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="flex flex-col gap-1 mb-2">
              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Total Propuestas</p>
              <h3 className="text-base font-black text-slate-900 leading-none mt-0.5">
                {previousQuotes.length}
              </h3>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[7px] font-bold uppercase tracking-widest">
            <span className="text-slate-400">Ratio Cierre</span>
            <span className="text-indigo-600">
              {previousQuotes.length > 0 
                ? Math.round((previousQuotes.filter(q => isConfirmedStatus(q.status, q.signature)).length / previousQuotes.length) * 100)
                : 0}%
            </span>
          </div>
        </motion.div>

        {/* COMPRAS E IMPORTACIONES */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="flex flex-col gap-1 mb-2">
              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Logística e Importaciones</p>
              <h3 className="text-base font-black text-slate-900 leading-none mt-0.5">
                {importBatches.length} Lotes
              </h3>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[7px] font-bold uppercase tracking-widest">
            <span className="text-slate-400">Inversión Int.</span>
            <span className="text-emerald-600 font-black">
              ${importBatches.reduce((acc, b) => acc + (b.totalInvestment || 0), 0).toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* MERMAS Y PERDIDAS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="flex flex-col gap-1 mb-2">
              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Mermas y Descartes</p>
              <h3 className="text-base font-black text-rose-600 leading-none mt-0.5">
                ${(shrinkages || []).reduce((acc, b) => acc + ((b.unitCost || 0) * (b.quantity || 0)), 0).toLocaleString()}
              </h3>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[7px] font-bold uppercase tracking-widest">
            <span className="text-slate-400">Registros Activos</span>
            <span className="text-rose-400 font-black">{(shrinkages || []).length}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-lg text-white"
        >
          <div className="flex flex-col gap-1 mb-2">
              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Retención Total</p>
              <h3 className="text-base font-black text-white leading-none mt-0.5">
                ${previousQuotes
                  .reduce((acc, curr) => acc + (curr.retencion || 0), 0)
                  .toLocaleString()}
              </h3>
          </div>
          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[7px] font-bold uppercase tracking-widest">
            <span className="text-slate-400">Garantía</span>
            <span className="text-white font-mono text-[8px]">RSRV</span>
          </div>
        </motion.div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Historial Financiero</h3>
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {[
                { id: 'daily', label: 'DÍA' },
                { id: 'monthly', label: 'MES' },
                { id: 'quarterly', label: 'TRIM' },
                { id: 'semester', label: 'SEM' },
                { id: 'yearly', label: 'AÑO' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setChartTimeframe(opt.id as any)}
                  className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-md transition-all ${chartTimeframe === opt.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Métricas del periodo actual */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: '↑ Ingresos', value: currentPeriodMetrics.ingresos, prev: currentPeriodMetrics.prevIngresos, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: '↓ Salidas', value: currentPeriodMetrics.salidas, prev: currentPeriodMetrics.prevSalidas, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: '= Utilidad', value: currentPeriodMetrics.utilidad, prev: currentPeriodMetrics.prevUtilidad, color: currentPeriodMetrics.utilidad >= 0 ? 'text-emerald-600' : 'text-rose-600', bg: currentPeriodMetrics.utilidad >= 0 ? 'bg-emerald-50' : 'bg-rose-50' },
            ].map(m => {
              const chg = pctChange(m.value, m.prev);
              return (
                <div key={m.label} className={`${m.bg} rounded-xl p-2 text-center`}>
                  <p className="text-[7px] font-black uppercase text-slate-400 tracking-wider">{m.label}</p>
                  <p className={`text-[10px] font-black ${m.color} leading-tight mt-0.5`}>{fmt(m.value)}</p>
                  {chg !== null && (
                    <p className={`text-[7px] font-bold mt-0.5 ${chg >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {chg >= 0 ? '▲' : '▼'} {Math.abs(chg)}% vs ant.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUtilidad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="timeKey"
                  stroke="#94a3b8"
                  fontSize={8}
                  fontWeight={900}
                  tickFormatter={(val) => {
                    if (!val) return '';
                    const parts = val.split('-');
                    if (chartTimeframe === 'daily') return `${parts[2]}/${parts[1]}`;
                    if (chartTimeframe === 'monthly' || chartTimeframe === 'quarterly' || chartTimeframe === 'semester') return parts[1] || val;
                    return val;
                  }}
                />
                <YAxis hide />
                <RechartsTooltip
                  formatter={(value: any, name: string) => [fmt(Number(value)), name === 'ingresos' ? 'Ingresos' : name === 'salidas' ? 'Salidas' : 'Utilidad']}
                  contentStyle={{ fontSize: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" dot={false} />
                <Area type="monotone" dataKey="salidas" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorSalidas)" dot={false} />
                <Area type="monotone" dataKey="utilidad" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUtilidad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda */}
          <div className="flex gap-4 justify-center mt-2">
            {[['#6366f1','Ingresos'],['#f43f5e','Salidas'],['#10b981','Utilidad']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1">
                <span className="inline-block w-3 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                <span className="text-[8px] font-black uppercase text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-3">Pipeline Operativo</h3>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <Pie
                  data={dashboardChartData.states}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#f43f5e" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f1f5f9" />
                </Pie>
                <Legend iconSize={10} wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* COMPARATIVA MARGEN vs COSTO - FULL WIDTH */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-slate-900 p-5 md:p-7 rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
          <Target size={200} className="text-white" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-tight mb-1 leading-none">Salud Financiera</h3>
              <p className="text-slate-500 text-[7px] font-black uppercase tracking-widest leading-none">Relación de Inversión vs Utilidad Bruta</p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Estado:</span>
               <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Optimizado</span>
            </div>
          </div>
          
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart
                data={[
                  { 
                    name: 'Consolidado', 
                    Ingresos: financialMetrics.totalIncome, 
                    Costos: financialMetrics.totalDirectCost + financialMetrics.totalOpEx + financialMetrics.cashExpenses, 
                    Utilidad: financialMetrics.ebitda 
                  }
                ]}
                layout="vertical"
              >
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px', padding: '6px' }} 
                  itemStyle={{ fontSize: '8px', fontWeight: '900', textTransform: 'uppercase' }}
                  labelStyle={{ display: 'none' }}
                />
                <Bar dataKey="Ingresos" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={20} />
                <Bar dataKey="Costos" fill="#f43f5e" radius={[0, 6, 6, 0]} barSize={20} />
                <Bar dataKey="Utilidad" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 mb-4">
             <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Caja Real</p>
                <div className="text-base font-black text-emerald-400 leading-none">
                  ${Math.round(financialMetrics.cashBalance).toLocaleString()}
                </div>
             </div>
             <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Por Cobrar</p>
                <div className="text-base font-black text-indigo-300 leading-none">${Math.round(financialMetrics.accountsReceivable).toLocaleString()}</div>
             </div>
             <div className="bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Por Pagar</p>
                <div className="text-base font-black text-rose-300 leading-none">${Math.round(financialMetrics.accountsPayable).toLocaleString()}</div>
             </div>
             <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">Liquidez</p>
                <div className="text-base font-black text-amber-300 leading-none">${Math.round(financialMetrics.liquidityPosition).toLocaleString()}</div>
             </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 bg-slate-900 p-6 rounded-2xl shadow-xl mt-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group relative">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Pto. Equilibrio</p>
                <div className={`text-lg font-black leading-none ${financialMetrics.totalIncome >= financialMetrics.breakEvenPoint ? 'text-emerald-400' : 'text-amber-400'}`}>
                  ${Math.round(financialMetrics.breakEvenPoint).toLocaleString()}
                </div>
             </div>
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Utilidad EBITDA</p>
                <div className="text-lg font-black text-indigo-400 leading-none">${Math.round(financialMetrics.ebitda).toLocaleString()}</div>
             </div>
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Costos Directos</p>
                <div className="text-lg font-black text-rose-400 leading-none">${Math.round(financialMetrics.totalDirectCost).toLocaleString()}</div>
             </div>
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group relative">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Ganancia Neta (Accounting)</p>
                <div className="text-lg font-black text-white leading-none">${Math.round(financialMetrics.netMargin).toLocaleString()}</div>
             </div>
          </div>

          {/* Sincronizador de Calce */}
          <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10 mt-6 mb-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 bg-amber-500/20 text-amber-400 rounded-3xl">
                <RefreshCw size={32} />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Sincronizador de Calce (Realidad vs Sistema)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    Ingresa lo que tienes físicamente hoy para que el sistema se ajuste automáticamente.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-indigo-500/30 min-w-[200px]">
                    <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Ingresa Monto en Mano</p>
                    <input 
                      type="number" 
                      placeholder="Ej: 1035000"
                      className="bg-transparent text-xl font-black text-white outline-none w-full"
                      onChange={(e) => {
                        (window as any)._lastManualBalance = parseFloat(e.target.value) || 0;
                      }}
                    />
                  </div>
                  
                  <button 
                    onClick={async () => {
                      const val = (window as any)._lastManualBalance;
                      if (val === undefined) return alert("Ingresa tu saldo real");
                      await syncCash(val);
                      alert("¡Caja sincronizada!");
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 self-center"
                  >
                    Sincronizar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      {/* Sección de Ayuda Financiera */}
      <div className="bg-indigo-500/5 p-6 rounded-3xl border border-indigo-500/10">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-3xl">
            <ShieldAlert size={32} />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">¿Por qué mi "Bolsillo" no coincide con mi "Caja"?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              La <b>Ganancia Neta</b> calcula lo que "deberías" tener. El <b>Saldo en Mano</b> es la realidad física.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[9px] text-slate-500">
                <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Cuentas por Cobrar</p>
                Facturas vendidas que aún no te pagan.
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[9px] text-slate-500">
                <p className="text-[10px] font-bold text-rose-300 uppercase mb-1">Cuentas por Pagar</p>
                Compras facturadas no pagadas aún.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RANKINGS Y MAPA DE CALOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-6">
        
        {/* TOP CLIENTES */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-4">🏆 Top Clientes</h3>
          <div className="space-y-3">
            {topClients.map((client, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-bold text-slate-700 uppercase">{i + 1}. {client.name}</span>
                  <span className="text-[10px] font-black text-indigo-600">${client.total.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-1.5 rounded-full" 
                    style={{ width: `${topClients[0]?.total ? (client.total / topClients[0].total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {topClients.length === 0 && <p className="text-[10px] text-slate-400 italic">No hay datos suficientes</p>}
          </div>
        </motion.div>

        {/* TOP PRODUCTOS */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-4">🔥 Productos Estrella</h3>
          <div className="space-y-3">
            {topProducts.map((prod, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-bold text-slate-700 uppercase truncate max-w-[140px]">{i + 1}. {prod.name}</span>
                  <span className="text-[10px] font-black text-emerald-600">${prod.total.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${topProducts[0]?.total ? (prod.total / topProducts[0].total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-[10px] text-slate-400 italic">No hay datos suficientes</p>}
          </div>
        </motion.div>

        {/* MAPA DE CALOR VENTAS */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-white uppercase tracking-tight">📅 Días más rentables</h3>
            {(() => {
              const bestDay = salesByDayOfWeek.reduce((best, day) => day.total > best.total ? day : best, salesByDayOfWeek[0]);
              return bestDay && bestDay.total > 0 ? (
                <span className="text-[8px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-400 px-2 py-1 rounded-lg border border-amber-400/30">
                  🏆 {bestDay.name}
                </span>
              ) : null;
            })()}
          </div>
          <div className="flex-1 flex items-end justify-between gap-1.5 h-36">
            {salesByDayOfWeek.map((day, i) => {
              const maxDay = Math.max(...salesByDayOfWeek.map(d => d.total));
              const height = maxDay > 0 ? (day.total / maxDay) * 100 : 0;
              const isBest = height === 100 && day.total > 0;
              const sortedDays = [...salesByDayOfWeek].sort((a, b) => b.total - a.total);
              const rank = sortedDays.findIndex(d => d.name === day.name) + 1;
              const rankLabel = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
              // Level indicators
              const level = height >= 80 ? 'Alto' : height >= 40 ? 'Medio' : height > 0 ? 'Bajo' : '';
              const levelColor = height >= 80 ? 'text-emerald-400' : height >= 40 ? 'text-amber-400' : 'text-slate-500';
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1 group">
                  {/* Amount label */}
                  <div className="text-center mb-0.5">
                    {day.total > 0 ? (
                      <span className={`text-[7px] font-black ${isBest ? 'text-amber-400' : 'text-slate-300'}`}>
                        ${day.total >= 1000000 
                          ? `${(day.total / 1000000).toFixed(1)}M` 
                          : day.total >= 1000 
                            ? `${Math.round(day.total / 1000)}K` 
                            : day.total.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[7px] text-slate-600">-</span>
                    )}
                  </div>
                  {/* Rank medal */}
                  {rankLabel && day.total > 0 && (
                    <span className="text-[8px] leading-none">{rankLabel}</span>
                  )}
                  {/* Bar */}
                  <div className="w-full flex justify-center relative h-full items-end">
                    <div 
                      className={`w-full max-w-[22px] rounded-t-md transition-all duration-500 ${
                        isBest 
                          ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-lg shadow-amber-500/30' 
                          : height > 0 
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-300' 
                            : 'bg-slate-800'
                      }`}
                      style={{ height: `${Math.max(height, 4)}%` }}
                    ></div>
                  </div>
                  {/* Day name */}
                  <span className={`text-[7px] font-black uppercase ${isBest ? 'text-amber-400' : 'text-slate-400'}`}>{day.name}</span>
                  {/* Level */}
                  {level && (
                    <span className={`text-[6px] font-black uppercase tracking-wider ${levelColor}`}>{level}</span>
                  )}
                </div>
              )
            })}
          </div>
          {/* Summary footer */}
          {(() => {
            const totalWeek = salesByDayOfWeek.reduce((acc, d) => acc + d.total, 0);
            const activeDays = salesByDayOfWeek.filter(d => d.total > 0).length;
            return totalWeek > 0 ? (
              <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between items-center">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                  {activeDays} día{activeDays !== 1 ? 's' : ''} con ventas
                </span>
                <span className="text-[8px] font-black text-indigo-400 uppercase tracking-wider">
                  Total: ${totalWeek.toLocaleString()}
                </span>
              </div>
            ) : null;
          })()}
        </motion.div>
      </div>

      {/* RECENT ACTIVITY */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-[8px] font-black uppercase tracking-widest text-slate-900">Historial Reciente</h2>
          <div className="flex gap-1">
             {(['all', 'draft', 'sent', 'approved', 'paid'] as const).map(f => (
                <button 
                  key={f}
                  onClick={() => setDashboardFilter(f)}
                  className={`px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter transition-all ${
                    dashboardFilter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'
                  }`}
                >
                  {f}
                </button>
             ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {dashboardFilteredQuotes.map(quote => (
            <div key={quote.id} className="p-3 hover:bg-slate-50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${
                  quote.status?.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                  (quote.status?.toLowerCase() === 'approved' || quote.status?.toLowerCase() === 'confirmed' || !!quote.signature) ? 'bg-indigo-50 text-indigo-600' :
                  (quote.status?.toLowerCase() === 'sent' || quote.status?.toLowerCase() === 'enviado' || quote.status?.toLowerCase() === 'pending') ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  <FileText size={14} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-900 uppercase">{quote.clientName || 'Cliente'}</div>
                  <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                     {new Date(quote.createdAt).toLocaleDateString()} • {quote.quoteRefId || quote.id.substring(0, 8)}
                     {quote.signature && <span className="text-emerald-600 font-black">✓ FIRMADO</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-900 font-mono">${quote.totalProposal?.toLocaleString()}</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Líquido</div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   {!isConfirmedStatus(quote.status, quote.signature) && (
                    <button 
                      onClick={() => markAsWon(quote.id, quote.clientName, quote.totalProposal)}
                      className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"
                    ><CheckCircle2 size={12} /></button>
                  )}
                  {quote.status?.toLowerCase() !== 'paid' && (isConfirmedStatus(quote.status, quote.signature)) && (
                    <button 
                      onClick={() => markAsPaid(quote.id)}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"
                    ><CreditCard size={12} /></button>
                  )}
                   <button onClick={() => loadQuote(quote.id)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Pencil size={12} /></button>
                   <button onClick={() => deleteQuote(quote.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
          {dashboardFilteredQuotes.length === 0 && (
            <div className="py-20 text-center text-slate-400 italic text-sm">
              No hay actividad registrada.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
