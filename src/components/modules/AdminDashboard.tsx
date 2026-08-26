import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { ShieldAlert, Users, TrendingUp, DollarSign, LogOut, ArrowRight, Activity, Zap, Trash2 } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  companyName: string;
  isPro: boolean;
  trialEndsAt: number;
}

export const AdminDashboard = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser] = useAuthState(auth);
  
  const impersonatedUserId = localStorage.getItem('impersonatedUserId');

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const q = query(collection(db, "users"));
        const snapshot = await getDocs(q);
        const usersList: UserData[] = [];
        snapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() } as UserData);
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (authUser?.email === 'iafacilchile@gmail.com') {
      fetchAllUsers();
    }
  }, [authUser]);

  const handleImpersonate = (userId: string) => {
    if (window.confirm("¿Seguro que deseas iniciar sesión en modo Soporte para este cliente? Todo lo que guardes se guardará en su cuenta.")) {
      localStorage.setItem('impersonatedUserId', userId);
      window.location.reload();
    }
  };

  const handleStopImpersonate = () => {
    localStorage.removeItem('impersonatedUserId');
    window.location.reload();
  };

  const handleTogglePro = async (userId: string, currentIsPro: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), { isPro: !currentIsPro });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isPro: !currentIsPro } : u));
      toast.success("Estado del Plan Pro actualizado correctamente.");
    } catch (e) {
      console.error("Error updating user plan:", e);
      toast.error("Error al actualizar el plan del usuario.");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el perfil de ${email}? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success("Usuario eliminado exitosamente.");
    } catch (e) {
      console.error("Error deleting user:", e);
      toast.error("Error al eliminar el usuario.");
    }
  };

  // Metrics calculation
  const totalUsers = users.length;
  const proUsers = users.filter(u => u.isPro).length;
  const freeUsers = totalUsers - proUsers;
  const MONTHLY_PRICE = 14990;
  const mrr = proUsers * MONTHLY_PRICE;

  if (isLoading) {
    return <div className="p-10 text-center text-slate-500 font-bold uppercase tracking-widest">Cargando Panel Maestro...</div>;
  }

  return (
    <div className="space-y-6 pb-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <ShieldAlert className="text-indigo-600" size={24} />
            Master Dashboard
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Control Total y Métricas del SaaS</p>
        </div>
        
        {impersonatedUserId && (
          <button 
            onClick={handleStopImpersonate}
            className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-rose-700 animate-pulse"
          >
            <LogOut size={16} />
            Salir del Modo Soporte
          </button>
        )}
      </div>

      {impersonatedUserId && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl mb-6">
          <h3 className="text-rose-800 font-black uppercase text-sm mb-2 flex items-center gap-2">
            <Activity size={18} /> MODO SOPORTE ACTIVO
          </h3>
          <p className="text-rose-600 text-xs font-bold">
            Actualmente estás operando como si fueras el cliente con ID: <span className="font-mono bg-white px-2 py-1 rounded border border-rose-100">{impersonatedUserId}</span>. 
            Cualquier PDF, cotización o producto que agregues en el sistema, se le guardará a este cliente.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
          <Users className="text-indigo-400 mb-4" size={24} />
          <h3 className="text-3xl font-black text-white leading-none">{totalUsers}</h3>
          <p className="text-[10px] font-bold text-indigo-400 mt-2 uppercase tracking-widest">Usuarios Totales</p>
        </div>

        <div className="bg-indigo-600 p-6 rounded-3xl border border-indigo-500 shadow-xl relative overflow-hidden">
          <TrendingUp className="text-indigo-200 mb-4" size={24} />
          <h3 className="text-3xl font-black text-white leading-none">{proUsers}</h3>
          <p className="text-[10px] font-bold text-indigo-200 mt-2 uppercase tracking-widest">Usuarios PRO</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <Zap className="text-amber-500 mb-4" size={24} />
          <h3 className="text-3xl font-black text-slate-800 leading-none">{freeUsers}</h3>
          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">En Modo Free / Trial</p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
          <DollarSign className="text-emerald-600 mb-4" size={24} />
          <h3 className="text-3xl font-black text-emerald-700 leading-none">${mrr.toLocaleString()}</h3>
          <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase tracking-widest">MRR Proyectado (CLP/Mes)</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Gestión de Clientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4 border-b border-slate-100">Cliente / Empresa</th>
                <th className="p-4 border-b border-slate-100">Email</th>
                <th className="p-4 border-b border-slate-100">Plan</th>
                <th className="p-4 border-b border-slate-100">Vencimiento Trial</th>
                <th className="p-4 border-b border-slate-100 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isImpersonatingThis = impersonatedUserId === u.id;
                return (
                  <tr key={u.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${isImpersonatingThis ? 'bg-indigo-50/50' : ''}`}>
                    <td className="p-4">
                      <div className="font-bold text-sm text-slate-900">{u.name || 'Sin Nombre'}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{u.companyName || 'Sin Empresa'}</div>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-600">{u.email}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {u.isPro ? (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-[10px] font-black uppercase tracking-widest">PRO</span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-widest">FREE</span>
                        )}
                        <button
                          onClick={() => handleTogglePro(u.id, !!u.isPro)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                          title={u.isPro ? "Desactivar PRO (Pasar a FREE)" : "Activar PRO"}
                        >
                          <Zap size={12} className={u.isPro ? "fill-indigo-600 text-indigo-600" : "text-slate-400"} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-500">
                      {u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {u.email !== 'iafacilchile@gmail.com' && (
                          <>
                            <button 
                              onClick={() => handleImpersonate(u.id)}
                              disabled={isImpersonatingThis}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors disabled:opacity-50"
                            >
                              {isImpersonatingThis ? 'ACTIVO' : 'SOPORTE'} <ArrowRight size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                              title="Eliminar usuario"
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-sm font-medium">
                    No hay clientes registrados aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
