import React, { useState, useEffect, useMemo } from 'react';
import { Users, UserPlus, DollarSign, Award, Package, Search, Trash2, ShoppingBag, Pencil, UserX, UserCheck, X, Check, CreditCard, Calendar, CheckCircle2 } from 'lucide-react';
import { Promoter, CommissionRecord } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { removeUndefined, handleFirestoreError, OperationType } from '../lib/utils';

interface PromotersModuleProps {
  previousQuotes?: any[];
  promoters?: Promoter[];
  onPromotersChange?: (promoters: Promoter[]) => void;
  onRegisterCashOutflow?: (amount: number, concept: string) => void;
}

export const DEFAULT_PROMOTERS: Promoter[] = [
  { id: 'prom-1', name: 'Juan Pérez', code: 'JUAN10', role: 'promoter', status: 'active', totalEarned: 0, totalPaid: 0, createdAt: new Date().toISOString() },
  { id: 'prom-2', name: 'Pedro Soto', code: 'PEDRO10', role: 'both', status: 'active', totalEarned: 0, totalPaid: 0, createdAt: new Date().toISOString() },
  { id: 'prom-3', name: 'Diego Muñoz', code: 'DIEGO10', role: 'promoter', status: 'active', totalEarned: 0, totalPaid: 0, createdAt: new Date().toISOString() },
];

export const PromotersModule: React.FC<PromotersModuleProps> = ({ 
  previousQuotes = [],
  promoters: propsPromoters,
  onPromotersChange,
  onRegisterCashOutflow
}) => {
  const [user] = useAuthState(auth);
  const [firestorePromoters, setFirestorePromoters] = useState<Promoter[]>([]);

  // Sincronizar promotores desde Firestore filtrando estrictamente por ownerId
  useEffect(() => {
    if (!user) return;
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;

    const q = query(
      collection(db, "promoters"),
      where("ownerId", "==", effectiveUid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Promoter));

      // Migración automática inicial si el usuario tiene datos previos en localStorage
      if (fetched.length === 0) {
        const saved = localStorage.getItem('mi_crm_promoters');
        if (saved) {
          try {
            const localData: Promoter[] = JSON.parse(saved);
            if (localData && localData.length > 0) {
              localData.forEach(async (p) => {
                await setDoc(doc(db, "promoters", p.id), removeUndefined({
                  ...p,
                  ownerId: effectiveUid
                }));
              });
              localStorage.removeItem('mi_crm_promoters');
            }
          } catch (e) {
            console.error("Error migrando promotores desde localStorage a Firestore:", e);
          }
        }
      }

      setFirestorePromoters(fetched);
      if (onPromotersChange) {
        onPromotersChange(fetched);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "promoters");
    });

    return () => unsubscribe();
  }, [user]);

  const promoters = propsPromoters || (user ? firestorePromoters : []);

  const [newPromoter, setNewPromoter] = useState({ name: '', phone: '', code: '' });
  const [editingPromoter, setEditingPromoter] = useState<Promoter | null>(null);
  const [payoutModalPromoter, setPayoutModalPromoter] = useState<Promoter | null>(null);
  const [payoutInputAmount, setPayoutInputAmount] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Registro de comisiones liquidadas por cotización
  const [paidQuoteCommissions, setPaidQuoteCommissions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('mi_crm_paid_quote_commissions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('mi_crm_paid_quote_commissions', JSON.stringify(paidQuoteCommissions));
  }, [paidQuoteCommissions]);

  // Construir registros de venta e historial de comisiones a partir de cotizaciones
  const quoteCommissions: CommissionRecord[] = useMemo(() => {
    const records: CommissionRecord[] = [];
    previousQuotes.forEach((quote: any) => {
      const clientInfo = quote.clientInfo || {};
      const items = quote.items || [];
      
      const productsSummary = items.map((i: any) => {
        const desc = i.description || 'Producto';
        const qty = i.quantity || 1;
        const price = i.unitPrice || 0;
        return `${desc} (x${qty} @ $${price.toLocaleString()})`;
      }).join(' • ') || 'Productos varios';

      const saleTotal = quote.totalAmount || quote.totalProposal || 0;

      if (clientInfo.promoterId || clientInfo.closerId) {
        const isSame = clientInfo.promoterId && clientInfo.closerId && clientInfo.promoterId === clientInfo.closerId;
        const rateP = clientInfo.promoterCommissionRate || 5;
        const rateC = clientInfo.closerCommissionRate || 5;

        const promoterAmt = clientInfo.promoterId ? Math.round(saleTotal * (rateP / 100)) : 0;
        const closerAmt = clientInfo.closerId ? (isSame ? 0 : Math.round(saleTotal * (rateC / 100))) : 0;

        const formatDate = (val: any): string => {
          if (!val) return new Date().toLocaleDateString();
          if (typeof val === 'string') return val;
          if (val?.toDate && typeof val.toDate === 'function') return val.toDate().toLocaleDateString();
          if (val?.seconds) return new Date(val.seconds * 1000).toLocaleDateString();
          if (val instanceof Date) return val.toLocaleDateString();
          return new Date().toLocaleDateString();
        };

        const qId = quote.id || `comm-${Math.random()}`;

        records.push({
          id: qId,
          quoteId: qId,
          clientName: clientInfo.company || clientInfo.name || 'Cliente',
          date: formatDate(quote.date || quote.createdAt),
          promoterId: clientInfo.promoterId,
          promoterName: clientInfo.promoterName || 'Promotor',
          closerId: clientInfo.closerId,
          closerName: clientInfo.closerName || 'Vendedor',
          totalSaleAmount: saleTotal,
          productsSummary,
          promoterAmount: isSame ? Math.round(saleTotal * 0.10) : promoterAmt,
          closerAmount: isSame ? 0 : closerAmt,
          promoterPaid: !!paidQuoteCommissions[qId],
          closerPaid: !!paidQuoteCommissions[qId]
        });
      }
    });
    return records;
  }, [previousQuotes, paidQuoteCommissions]);

  // Cálculo dinámico de total ganado por promotor basado en cotizaciones reales
  const promotersWithStats = useMemo(() => {
    return promoters.map(p => {
      let earned = 0;
      quoteCommissions.forEach(rec => {
        if (rec.promoterId === p.id) {
          earned += rec.promoterAmount;
        }
        if (rec.closerId === p.id) {
          earned += rec.closerAmount;
        }
      });
      return {
        ...p,
        totalEarned: earned
      };
    });
  }, [promoters, quoteCommissions]);

  const handleAddPromoter = async () => {
    if (!newPromoter.name.trim()) return;
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user?.uid || auth.currentUser?.uid;
    const promoterId = `prom-${Date.now()}`;
    const promoter: Promoter = {
      id: promoterId,
      name: newPromoter.name.trim(),
      phone: newPromoter.phone.trim(),
      code: newPromoter.code.trim().toUpperCase() || newPromoter.name.trim().split(' ')[0].toUpperCase() + '10',
      role: 'promoter',
      status: 'active',
      totalEarned: 0,
      totalPaid: 0,
      createdAt: new Date().toISOString(),
      ownerId: effectiveUid
    };

    if (effectiveUid) {
      await setDoc(doc(db, "promoters", promoterId), removeUndefined(promoter));
    }

    setNewPromoter({ name: '', phone: '', code: '' });
    setShowAddModal(false);
  };

  const handleSaveEditPromoter = async () => {
    if (!editingPromoter || !editingPromoter.name.trim()) return;
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user?.uid || auth.currentUser?.uid;
    if (effectiveUid) {
      await setDoc(doc(db, "promoters", editingPromoter.id), removeUndefined({
        ...editingPromoter,
        ownerId: effectiveUid
      }), { merge: true });
    }
    setEditingPromoter(null);
  };

  const togglePromoterStatus = async (id: string) => {
    const target = promoters.find(p => p.id === id);
    if (!target) return;
    const nextStatus = target.status === 'inactive' ? 'active' : 'inactive';
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user?.uid || auth.currentUser?.uid;
    if (effectiveUid) {
      await setDoc(doc(db, "promoters", id), { status: nextStatus }, { merge: true });
    }
  };

  const handleDeletePromoter = async (id: string) => {
    if (window.confirm("¿Seguro que deseas eliminar este promotor? Sus registros se conservarán en el historial.")) {
      const effectiveUid = localStorage.getItem('impersonatedUserId') || user?.uid || auth.currentUser?.uid;
      if (effectiveUid) {
        await deleteDoc(doc(db, "promoters", id));
      }
    }
  };

  const openPayoutModal = (promoter: Promoter) => {
    const pending = Math.max(0, promoter.totalEarned - promoter.totalPaid);
    setPayoutModalPromoter(promoter);
    setPayoutInputAmount(pending > 0 ? pending : 0);
  };

  const handleExecutePayout = async () => {
    if (!payoutModalPromoter || payoutInputAmount <= 0) return;
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user?.uid || auth.currentUser?.uid;
    const newPaidTotal = (payoutModalPromoter.totalPaid || 0) + payoutInputAmount;

    if (effectiveUid) {
      await setDoc(doc(db, "promoters", payoutModalPromoter.id), {
        totalPaid: newPaidTotal
      }, { merge: true });
    }

    if (onRegisterCashOutflow) {
      onRegisterCashOutflow(payoutInputAmount, `PAGO COMISIÓN: ${payoutModalPromoter.name.toUpperCase()} (${payoutModalPromoter.code})`);
    }
    setPayoutModalPromoter(null);
    setPayoutInputAmount(0);
    alert(`¡Pago de comisión de $${payoutInputAmount.toLocaleString()} a ${payoutModalPromoter.name} registrado con éxito y deducido del Flujo de Caja!`);
  };

  const markQuoteCommissionPaid = (quoteId: string, amount: number = 0, clientName: string = '') => {
    setPaidQuoteCommissions(prev => ({
      ...prev,
      [quoteId]: true
    }));
    if (onRegisterCashOutflow && amount > 0) {
      onRegisterCashOutflow(amount, `PAGO COMISIÓN CLIENTE ${clientName.toUpperCase()}`);
    }
  };

  const filteredPromoters = promotersWithStats.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCommissionsEarned = promotersWithStats.reduce((acc, p) => acc + p.totalEarned, 0);
  const totalCommissionsPaid = promotersWithStats.reduce((acc, p) => acc + p.totalPaid, 0);
  const totalPendingPayout = Math.max(0, totalCommissionsEarned - totalCommissionsPaid);

  return (
    <div className="space-y-6 font-sans">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <Users size={16} /> Red Comercial & Comisiones Solopreneur
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Comisiones y Promotores (5% / 10%)</h2>
            <p className="text-slate-300 text-xs mt-1 max-w-xl">
              Atribución de comisiones automática con detalle exacto de productos vendidos y liquidación directa en 1 clic.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 active:scale-95"
          >
            <UserPlus size={16} /> + Registrar Amigo Promotor
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Comisiones Ganadas</span>
            <span className="text-2xl font-black font-mono text-emerald-400 leading-tight mt-1 block">
              ${totalCommissionsEarned.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Comisiones Pagadas (Liquidadas)</span>
            <span className="text-2xl font-black font-mono text-indigo-300 leading-tight mt-1 block">
              ${totalCommissionsPaid.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Saldo Pendiente por Pagar</span>
            <span className="text-2xl font-black font-mono text-amber-400 leading-tight mt-1 block">
              ${totalPendingPayout.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Promoters List Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Award size={18} className="text-indigo-600" /> Promotores Registrados ({filteredPromoters.length})
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Las ganancias de cada amigo se calculan automáticamente al cerrar cotizaciones en el Cotizador.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o código..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPromoters.map(promoter => {
            const pending = Math.max(0, promoter.totalEarned - promoter.totalPaid);
            const isActive = promoter.status !== 'inactive';
            return (
              <div 
                key={promoter.id} 
                className={`border rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 ${
                  isActive 
                    ? 'bg-slate-50/80 border-slate-200 hover:border-indigo-300 hover:shadow-md' 
                    : 'bg-slate-100/60 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-sm leading-tight">{promoter.name}</h4>
                        {!isActive && (
                          <span className="text-[8px] font-black uppercase bg-slate-300 text-slate-600 px-1.5 py-0.5 rounded">Inactivo</span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block border border-indigo-100">
                        Código: {promoter.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingPromoter(promoter)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                        title="Editar Promotor"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => togglePromoterStatus(promoter.id)}
                        className="text-slate-400 hover:text-amber-600 transition-colors p-1"
                        title={isActive ? "Desactivar Promotor" : "Activar Promotor"}
                      >
                        {isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button
                        onClick={() => handleDeletePromoter(promoter.id)}
                        className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                        title="Eliminar Promotor"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {promoter.phone && (
                    <p className="text-[10px] text-slate-500 font-medium">WhatsApp: {promoter.phone}</p>
                  )}
                </div>

                {/* Earnings Breakdown Card */}
                <div className="space-y-2 pt-3 border-t border-slate-200/60 bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Total Ganado:</span>
                    <span className="font-mono font-bold text-slate-900">${promoter.totalEarned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Total Pagado:</span>
                    <span className="font-mono text-emerald-600 font-bold">${promoter.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black text-slate-900 pt-1.5 border-t border-slate-100">
                    <span>Saldo Pendiente:</span>
                    <span className="font-mono text-amber-600 font-black">${pending.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payout Button */}
                <button
                  onClick={() => openPayoutModal(promoter)}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 ${
                    pending > 0 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <DollarSign size={14} /> 
                  {pending > 0 ? `Pagar Comisión ($${pending.toLocaleString()})` : 'Registrar Pago de Comisión'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registro Detallado de Productos Vendidos por Promotor */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ShoppingBag size={18} className="text-indigo-600" /> Registro Detallado de Productos Vendidos
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              A continuación ves exactamente qué producto(s) vendió o publicó cada promotor y el desglose de su comisión.
            </p>
          </div>
        </div>

        {quoteCommissions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs italic">
            No hay cotizaciones asignadas a promotores aún. Al crear una cotización, selecciona qué amigo publicó el producto para atribuir la comisión automáticamente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold uppercase text-[9px] tracking-wider border-b border-slate-200">
                  <th className="p-3.5 rounded-l-xl">Fecha / Cliente</th>
                  <th className="p-3.5 min-w-[280px]">Productos Vendidos (Con Detalle de Precios)</th>
                  <th className="p-3.5">Publicador (5%)</th>
                  <th className="p-3.5">Cerrador (5%)</th>
                  <th className="p-3.5 text-right">Monto Venta</th>
                  <th className="p-3.5 text-right">Comisión Total</th>
                  <th className="p-3.5 text-center rounded-r-xl">Estado / Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {quoteCommissions.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-semibold text-slate-800">
                      <div className="font-bold text-slate-900">{rec.clientName}</div>
                      <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Calendar size={10} /> {rec.date}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-start gap-2 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100 text-indigo-900 font-medium text-[11px] leading-relaxed">
                        <Package size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                        <div>{rec.productsSummary}</div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {rec.promoterName ? (
                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-bold text-[10px] inline-block border border-indigo-100">
                          {rec.promoterName} <br />
                          <strong className="font-mono text-indigo-900">${rec.promoterAmount.toLocaleString()}</strong>
                        </span>
                      ) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="p-3.5">
                      {rec.closerName ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-bold text-[10px] inline-block border border-emerald-100">
                          {rec.closerName} <br />
                          <strong className="font-mono text-emerald-900">${rec.closerAmount.toLocaleString()}</strong>
                        </span>
                      ) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-800">
                      ${rec.totalSaleAmount.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-emerald-600 text-sm">
                      ${(rec.promoterAmount + rec.closerAmount).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      {rec.promoterPaid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-black text-[9px] uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          <CheckCircle2 size={12} /> Pagada
                        </span>
                      ) : (
                        <button
                          onClick={() => markQuoteCommissionPaid(rec.id, rec.promoterAmount + rec.closerAmount, rec.clientName)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shadow-xs active:scale-95"
                        >
                          Marcar Pagada
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Modal */}
      {payoutModalPromoter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <CreditCard size={20} className="text-emerald-600" /> Pagar Comisión
              </h3>
              <button onClick={() => setPayoutModalPromoter(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-700">Promotor: {payoutModalPromoter.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">Código: {payoutModalPromoter.code}</p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-xs font-black">
                  <span>Saldo Pendiente:</span>
                  <span className="font-mono text-amber-600">
                    ${Math.max(0, payoutModalPromoter.totalEarned - payoutModalPromoter.totalPaid).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">Monto a Liquidar / Pagar ($)</label>
                <input
                  type="number"
                  value={payoutInputAmount || ''}
                  onChange={e => setPayoutInputAmount(Number(e.target.value) || 0)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setPayoutModalPromoter(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecutePayout}
                disabled={payoutInputAmount <= 0}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check size={14} /> Confirmar Pago de Comisión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Promoter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Registrar Amigo Promotor</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Nombre Completo</label>
                <input
                  type="text"
                  value={newPromoter.name}
                  onChange={e => setNewPromoter({ ...newPromoter, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">WhatsApp de Contacto</label>
                <input
                  type="tel"
                  value={newPromoter.phone}
                  onChange={e => setNewPromoter({ ...newPromoter, phone: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="+56 9 XXXX XXXX"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Código de Referido (Opcional)</label>
                <input
                  type="text"
                  value={newPromoter.code}
                  onChange={e => setNewPromoter({ ...newPromoter, code: e.target.value.toUpperCase() })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Ej: JUAN10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPromoter}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-700 shadow-md"
              >
                Guardar Promotor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Promoter Modal */}
      {editingPromoter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Editar Promotor</h3>
              <button onClick={() => setEditingPromoter(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Nombre Completo</label>
                <input
                  type="text"
                  value={editingPromoter.name}
                  onChange={e => setEditingPromoter({ ...editingPromoter, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">WhatsApp de Contacto</label>
                <input
                  type="tel"
                  value={editingPromoter.phone || ''}
                  onChange={e => setEditingPromoter({ ...editingPromoter, phone: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Código de Referido</label>
                <input
                  type="text"
                  value={editingPromoter.code}
                  onChange={e => setEditingPromoter({ ...editingPromoter, code: e.target.value.toUpperCase() })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Estado de Actividad</label>
                <select
                  value={editingPromoter.status || 'active'}
                  onChange={e => setEditingPromoter({ ...editingPromoter, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="active">Activo (Aparece en Cotizador)</option>
                  <option value="inactive">Inactivo (Ocultar de Cotizador)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setEditingPromoter(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditPromoter}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-700 shadow-md flex items-center gap-1.5"
              >
                <Check size={14} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
