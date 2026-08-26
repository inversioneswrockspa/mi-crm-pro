import React from 'react';
import { getTaxBreakdown } from '../logic/taxLogic';

export const FinancialSummary = ({ totalAprobado, esBoleta = false, esEfectivo = false, totalCostos = 0, totalUtilidad = 0, isAdmin = false }: { totalAprobado: number, esBoleta?: boolean, esEfectivo?: boolean, totalCostos?: number, totalUtilidad?: number, isAdmin?: boolean }) => {
  const { neto, iva, retencion, total } = getTaxBreakdown(totalAprobado, esBoleta, esEfectivo);
  
  return (
    <div className={`grid grid-cols-1 ${isAdmin ? (esEfectivo ? 'md:grid-cols-3' : 'md:grid-cols-4') : (esEfectivo ? 'md:grid-cols-2' : 'md:grid-cols-3')} gap-4 p-4`}>
      {/* Tarjeta de Utilidad Real - Solo Admin */}
      {isAdmin && (
        <div className="bg-white border-l-4 border-indigo-500 shadow-sm rounded-lg p-5">
          <p className="text-sm text-gray-500 font-medium uppercase">Utilidad Real (Neto)</p>
          <p className={`text-2xl font-bold ${totalUtilidad < 0 ? 'text-red-500' : 'text-indigo-600'}`}>
            ${Math.round(totalUtilidad).toLocaleString('es-CL')}
          </p>
          <p className="text-xs text-indigo-400 mt-1">Margen libre de impuestos y costos</p>
        </div>
      )}

      {/* Tarjeta de Inversión / Costos - Solo Admin */}
      {isAdmin && (
        <div className="bg-white border-l-4 border-amber-500 shadow-sm rounded-lg p-5">
          <p className="text-sm text-gray-500 font-medium uppercase">Costos de Operación / Equipos</p>
          <p className="text-2xl font-bold text-amber-600">${Math.round(totalCostos).toLocaleString('es-CL')}</p>
          <p className="text-xs text-amber-400 mt-1">Gasto total en insumos y servicios</p>
        </div>
      )}

      {/* Tarjeta de Reserva de Impuesto - Ocultar en Efectivo */}
      {!esEfectivo && (
        <div className="bg-white border-l-4 border-red-500 shadow-sm rounded-lg p-5">
          <p className="text-sm text-gray-500 font-medium uppercase">{esBoleta ? 'Provisión Retención (13.75%)' : 'Provisión IVA (19%)'}</p>
          <p className="text-2xl font-bold text-red-600">${Math.round(esBoleta ? retencion : iva).toLocaleString('es-CL')}</p>
          <p className="text-xs text-gray-400 mt-1">{esBoleta ? 'Monto para Boleta de Honorarios' : 'Monto para Declaración F29 (SII)'}</p>
        </div>
      )}

      {/* Tarjeta de Caja Total */}
      <div className="bg-gray-800 shadow-sm rounded-lg p-5 text-white">
        <p className="text-sm text-gray-300 font-medium uppercase">Caja Total Bruta</p>
        <p className="text-2xl font-bold">${Math.round(total).toLocaleString('es-CL')}</p>
      </div>
    </div>
  );
};
