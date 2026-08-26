import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Banknote, 
  PlusCircle, 
  MinusCircle, 
  CreditCard, 
  History, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  Trash2, 
  Award, 
  Percent, 
  DollarSign, 
  Package, 
  ReceiptText, 
  ArrowUpDown, 
  Sparkles, 
  ShieldCheck, 
  ShoppingBag,
  Filter
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { formatCLP } from '../../lib/utils';

import { calcularPrecioAutomatico } from '../../logic/taxLogic';

interface CashFlowModuleProps {
  cashTransactions: any[];
  cashSearchTerm: string;
  setCashSearchTerm: (term: string) => void;
  newCashTransaction: any;
  setNewCashTransaction: (t: any) => void;
  saveCashTransaction: () => Promise<void>;
  isSavingCash: boolean;
  deleteCashTransaction?: (id: string) => Promise<void>;

  // Nuevas props integradas para análisis de margen por producto
  catalog?: any[];
  previousQuotes?: any[];
  purchaseRecords?: any[];
  importBatches?: any[];
  isConfirmedStatus?: (status: any, signature: any) => boolean;
}

// Componente para celda editable sin tirones ni saltos de cursor al escribir
const EditableCurrencyCell: React.FC<{
  initialValue: number;
  onSave: (val: number) => void;
  onEditingChange?: (isEditing: boolean) => void;
  inputClassName?: string;
  title?: string;
}> = ({ initialValue, onSave, onEditingChange, inputClassName = '', title }) => {
  const [valStr, setValStr] = React.useState<string>(() => (initialValue ? initialValue.toLocaleString('es-CL') : '0'));
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      setValStr(initialValue ? initialValue.toLocaleString('es-CL') : '0');
    }
  }, [initialValue, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setValStr('0');
      onSave(0);
      return;
    }
    const num = parseInt(raw, 10) || 0;
    setValStr(num.toLocaleString('es-CL'));
    onSave(num);
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <span className="text-slate-400 font-bold text-xs">$</span>
      <input
        type="text"
        className={inputClassName}
        value={valStr}
        onFocus={() => {
          setIsFocused(true);
          onEditingChange?.(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          onEditingChange?.(false);
          const raw = valStr.replace(/\D/g, '');
          const num = parseInt(raw, 10) || 0;
          setValStr(num ? num.toLocaleString('es-CL') : '0');
          onSave(num);
        }}
        onChange={handleChange}
        title={title}
      />
    </div>
  );
};

export const CashFlowModule: React.FC<CashFlowModuleProps> = ({
  cashTransactions,
  cashSearchTerm,
  setCashSearchTerm,
  newCashTransaction,
  setNewCashTransaction,
  saveCashTransaction,
  isSavingCash,
  deleteCashTransaction,
  catalog = [],
  previousQuotes = [],
  purchaseRecords = [],
  importBatches = [],
  isConfirmedStatus
}) => {
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState<'margin_pct_desc' | 'margin_amt_desc' | 'total_profit_desc' | 'units_sold_desc'>('margin_pct_desc');
  const [showCashPurchaseModal, setShowCashPurchaseModal] = useState(false);
  const [showPlatformSaleModal, setShowPlatformSaleModal] = useState(false);
  const [isEditingAnyCell, setIsEditingAnyCell] = useState(false);
  const sortedKeysRef = React.useRef<string[]>([]);
  
  const [platformSaleForm, setPlatformSaleForm] = useState({
    platform: 'Mercado Libre',
    productName: '',
    salePrice: 49990,
    commission: 6499,
    shippingCost: 3250,
    unitCost: 29904,
    hasBoleta: true
  });
  
  // Estado persistente para controlar si cada producto es Afecto a IVA (Boleta/Factura) o Venta Cash Directa (Sin Boleta)
  const [taxOverrides, setTaxOverrides] = useState<{ [normalizedName: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('productTaxOverrides');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [globalTaxFilter, setGlobalTaxFilter] = useState<'custom' | 'all_iva' | 'all_cash'>(() => {
    try {
      const saved = localStorage.getItem('globalTaxFilter');
      return (saved as any) || 'custom';
    } catch (e) {
      return 'custom';
    }
  });

  // Estados persistentes para edición de Precio Venta PVP y Costo Adquisición Neto por producto
  const [customSalePrices, setCustomSalePrices] = useState<{ [normalizedName: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('productCustomSalePrices');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [customUnitCosts, setCustomUnitCosts] = useState<{ [normalizedName: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('productCustomUnitCosts');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [customPlatformExpenses, setCustomPlatformExpenses] = useState<{ [normalizedName: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('productCustomPlatformExpenses');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const updateProductSalePrice = (normalizedName: string, price: number) => {
    setCustomSalePrices(prev => {
      const next = { ...prev, [normalizedName]: price };
      try {
        localStorage.setItem('productCustomSalePrices', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const updateProductUnitCost = (normalizedName: string, cost: number) => {
    setCustomUnitCosts(prev => {
      const next = { ...prev, [normalizedName]: cost };
      try {
        localStorage.setItem('productCustomUnitCosts', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const updateProductPlatformExpense = (normalizedName: string, expense: number) => {
    setCustomPlatformExpenses(prev => {
      const next = { ...prev, [normalizedName]: expense };
      try {
        localStorage.setItem('productCustomPlatformExpenses', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const [cashPurchaseForm, setCashPurchaseForm] = useState({
    productName: '',
    supplier: '',
    netCost: 0,
    hasIva: true,
    quantity: 1
  });

  const toggleProductTax = (normalizedName: string, value: boolean) => {
    setTaxOverrides(prev => {
      const next = { ...prev, [normalizedName]: value };
      try {
        localStorage.setItem('productTaxOverrides', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setGlobalTaxFilter('custom');
    try {
      localStorage.setItem('globalTaxFilter', 'custom');
    } catch (e) {}
  };

  const handleSetGlobalTaxFilter = (mode: 'custom' | 'all_iva' | 'all_cash') => {
    setGlobalTaxFilter(mode);
    try {
      localStorage.setItem('globalTaxFilter', mode);
    } catch (e) {}
  };

  const filteredCashTransactions = useMemo(() => {
    return cashTransactions.filter(t => 
      (t.concept || '').toLowerCase().includes((cashSearchTerm || '').toLowerCase())
    );
  }, [cashTransactions, cashSearchTerm]);

  const totalIn = useMemo(() => cashTransactions.filter(t => t.type === 'in').reduce((acc, curr) => acc + curr.amount, 0), [cashTransactions]);
  const totalOut = useMemo(() => cashTransactions.filter(t => t.type === 'out').reduce((acc, curr) => acc + curr.amount, 0), [cashTransactions]);
  const netCash = totalIn - totalOut;

  // CONSOLIDADO Y CÁLCULO DE MÁRGENES DE PRODUCTOS (DE MAYOR A MENOR)
  const productMarginsData = useMemo(() => {
    const map: { [normalized: string]: any } = {};

    const getOrCreate = (rawName: string) => {
      const norm = rawName ? rawName.trim().toLowerCase() : '';
      if (!norm) return null;
      if (!map[norm]) {
        map[norm] = {
          name: rawName.trim(),
          normalized: norm,
          salePrice: 0,
          unitCost: 0,
          unitsSold: 0,
          totalRevenue: 0,
          sources: {
            catalog: false,
            purchasesCount: 0
          }
        };
      }
      return map[norm];
    };

    // 1. Cargar datos desde el Catálogo (El valor de catálogo es el COSTO NETO DE ADQUISICIÓN DEL PROVEEDOR)
    catalog.forEach(item => {
      const entry = getOrCreate(item.name);
      if (entry) {
        entry.sources.catalog = true;
        const costoProveedor = item.unitCost || item.unitPrice || 0;
        if (costoProveedor > 0) {
          entry.unitCost = costoProveedor;
        }
      }
    });

    // 2. Cargar compras registradas en Compras (Facturas & Compras en Efectivo/Cash)
    purchaseRecords.forEach(p => {
      if (p.description || p.category === 'mercaderia' || p.category === 'insumos') {
        const prodName = p.description || p.provider || 'Mercadería';
        const entry = getOrCreate(prodName);
        if (entry) {
          entry.sources.purchasesCount += 1;
          if (p.netAmount && p.netAmount > 0 && entry.unitCost === 0) {
            entry.unitCost = p.netAmount;
          }
        }
      }
    });

    // 3. Cargar compras desde Lotes de Importaciones
    importBatches.forEach(b => {
      (b.items || []).forEach((item: any) => {
        const entry = getOrCreate(item.product);
        if (entry) {
          if (item.salePrice > 0) entry.salePrice = item.salePrice;
          if (item.unitCost > 0) entry.unitCost = item.unitCost;
        }
      });
    });

    // 4. Cargar ventas confirmadas
    previousQuotes.forEach(quote => {
      const isSold = isConfirmedStatus 
        ? isConfirmedStatus(quote.status, quote.signature)
        : (quote.status === 'APPROVED' || quote.status === 'paid' || quote.status === 'approved');

      if (!isSold) return;

      (quote.items || []).forEach((item: any) => {
        const prodName = item.description || item.name || '';
        const entry = getOrCreate(prodName);
        if (entry) {
          const qty = item.quantity || 0;
          const price = item.unitPrice || 0;
          entry.unitsSold += qty;
          entry.totalRevenue += (qty * price);

          if (price > 0 && entry.salePrice === 0) {
            entry.salePrice = price;
          }
          if (item.unitCost && item.unitCost > 0 && entry.unitCost === 0) {
            entry.unitCost = item.unitCost;
          }
        }
      });
    });

    // 5. Calcular Márgenes y Formatear
    const list = Object.values(map).map(entry => {
      const norm = entry.normalized;

      // Costo Neto de Adquisición (Prioriza edición del usuario, luego Catálogo / Compras / Importaciones)
      const unitCostNeto = customUnitCosts[norm] !== undefined ? customUnitCosts[norm] : (entry.unitCost || 0);

      // Precio Venta PVP Neto (Prioriza edición del usuario, luego Cotizaciones / Catálogo / PVP Sugerido)
      let salePriceNeto = customSalePrices[norm] !== undefined ? customSalePrices[norm] : (entry.salePrice || 0);

      // Evaluar si es Afecto a IVA según selección del usuario (Sí / No)
      const isAfectoIva = globalTaxFilter === 'all_cash' 
        ? false 
        : (globalTaxFilter === 'all_iva' ? true : (taxOverrides[norm] !== false));

      // Si aún no se registra precio de venta en cotización ni edición manual, calcular PVP Sugerido de Venta
      if (customSalePrices[norm] === undefined && (salePriceNeto === 0 || salePriceNeto === unitCostNeto) && unitCostNeto > 0) {
        const auto = calcularPrecioAutomatico(unitCostNeto);
        salePriceNeto = Math.round(auto.precioFinal / 1.19);
      }

      // Gastos o Comisiones de Plataforma (Mercado Libre, Falabella, etc.)
      const platformExpenseBruto = customPlatformExpenses[norm] || 0;
      const platformExpenseNeto = isAfectoIva ? Math.round(platformExpenseBruto / 1.19) : platformExpenseBruto;

      // Si es Afecto a IVA, el Precio PVP ingresado es el precio final Bruto (con IVA).
      // Por ende, la Venta Neta real es PVP / 1.19
      const netSalePrice = isAfectoIva ? Math.round(salePriceNeto / 1.19) : salePriceNeto;
      const ivaSaleAmount = isAfectoIva ? (salePriceNeto - netSalePrice) : 0;
      const ivaCostAmount = isAfectoIva ? Math.round(unitCostNeto * 0.19) : 0;
      const totalCostWithIva = isAfectoIva ? Math.round(unitCostNeto * 1.19) : unitCostNeto;

      // El Margen Neto ($) es la diferencia entre Venta Neta, Costo Neto y Gastos Netos de Plataforma
      const marginAmount = netSalePrice - unitCostNeto - platformExpenseNeto;

      // Margen % = (Margen $ / Venta Neta) * 100
      const marginPercent = netSalePrice > 0 ? (marginAmount / netSalePrice) * 100 : 0;

      // Total Ganancia Acumulada ($)
      const totalProfit = marginAmount * entry.unitsSold;

      // Estado de Margen
      let marginStatus: { label: string; bg: string; text: string; border: string } = {
        label: 'Sin Definir',
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200'
      };

      if (marginPercent >= 45) {
        marginStatus = { label: 'Excelente (≥45%)', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      } else if (marginPercent >= 30) {
        marginStatus = { label: 'Alto (30-44%)', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
      } else if (marginPercent >= 15) {
        marginStatus = { label: 'Moderado (15-29%)', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      } else if (marginPercent > 0) {
        marginStatus = { label: 'Bajo (<15%)', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
      } else if (salePriceNeto > 0 && unitCostNeto > 0 && marginAmount <= 0) {
        marginStatus = { label: 'Pérdida / Sin Margen', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
      }

      return {
        ...entry,
        isAfectoIva,
        salePriceNeto,
        unitCostNeto,
        platformExpenseBruto,
        platformExpenseNeto,
        ivaSaleAmount,
        ivaCostAmount,
        totalCostWithIva,
        marginAmount,
        marginPercent,
        totalProfit,
        marginStatus
      };
    });

    // Filtrar por término de búsqueda
    const filtered = list.filter(p => p.name.toLowerCase().includes(productSearchTerm.toLowerCase()));

    // Si el usuario está editando activamente una celda, MANTENER el orden actual congelado para que las filas NO salten mientras escribe
    if (isEditingAnyCell && sortedKeysRef.current.length > 0) {
      const orderMap = new Map(sortedKeysRef.current.map((key, idx) => [key, idx]));
      return [...filtered].sort((a, b) => {
        const indexA = orderMap.has(a.normalized) ? orderMap.get(a.normalized)! : 9999;
        const indexB = orderMap.has(b.normalized) ? orderMap.get(b.normalized)! : 9999;
        return indexA - indexB;
      });
    }

    // Ordenar de MAYOR a MENOR según el criterio seleccionado cuando NO está editando
    const sorted = [...filtered].sort((a, b) => {
      if (sortCriteria === 'margin_pct_desc') return b.marginPercent - a.marginPercent;
      if (sortCriteria === 'margin_amt_desc') return b.marginAmount - a.marginAmount;
      if (sortCriteria === 'total_profit_desc') return b.totalProfit - a.totalProfit;
      if (sortCriteria === 'units_sold_desc') return b.unitsSold - a.unitsSold;
      return b.marginPercent - a.marginPercent;
    });

    sortedKeysRef.current = sorted.map(p => p.normalized);
    return sorted;
  }, [catalog, purchaseRecords, importBatches, previousQuotes, isConfirmedStatus, productSearchTerm, sortCriteria, taxOverrides, globalTaxFilter, customSalePrices, customUnitCosts, isEditingAnyCell]);

  // KPIs de Márgenes
  const marginKpis = useMemo(() => {
    if (productMarginsData.length === 0) {
      return {
        topPctProduct: null,
        topProfitProduct: null,
        avgMarginPercent: 0,
        totalProfitAll: 0,
        totalIvaSaleAll: 0,
        totalIvaCostAll: 0,
        ivaProductsCount: 0,
        cashProductsCount: 0,
        totalProducts: 0
      };
    }

    const topPct = [...productMarginsData].sort((a, b) => b.marginPercent - a.marginPercent)[0] || null;
    const topProfit = [...productMarginsData].sort((a, b) => b.totalProfit - a.totalProfit)[0] || null;

    const validMargins = productMarginsData.filter(p => p.salePriceNeto > 0 && p.unitCostNeto > 0);
    const avgPct = validMargins.length > 0 
      ? validMargins.reduce((sum, p) => sum + p.marginPercent, 0) / validMargins.length 
      : 0;

    const totalProfitAll = productMarginsData.reduce((sum, p) => sum + p.totalProfit, 0);
    const totalIvaSaleAll = productMarginsData.reduce((sum, p) => sum + (p.isAfectoIva ? p.ivaSaleAmount * (p.unitsSold || 1) : 0), 0);
    const totalIvaCostAll = productMarginsData.reduce((sum, p) => sum + (p.isAfectoIva ? p.ivaCostAmount * (p.unitsSold || 1) : 0), 0);
    const ivaProductsCount = productMarginsData.filter(p => p.isAfectoIva).length;
    const cashProductsCount = productMarginsData.filter(p => !p.isAfectoIva).length;

    return {
      topPctProduct: topPct,
      topProfitProduct: topProfit,
      avgMarginPercent: Math.round(avgPct),
      totalProfitAll,
      totalIvaSaleAll,
      totalIvaCostAll,
      ivaProductsCount,
      cashProductsCount,
      totalProducts: productMarginsData.length
    };
  }, [productMarginsData]);

  // Manejador de Registro de Compra al Cash (Efectivo)
  const handleSaveCashPurchase = async () => {
    if (!cashPurchaseForm.productName.trim()) {
      alert('Ingresa el nombre del producto o mercadería adquirida al cash');
      return;
    }
    if (cashPurchaseForm.netCost <= 0) {
      alert('Ingresa un costo válido para la compra');
      return;
    }

    const netAmount = cashPurchaseForm.netCost * cashPurchaseForm.quantity;
    const ivaAmount = cashPurchaseForm.hasIva ? Math.round(netAmount * 0.19) : 0;
    const totalAmount = netAmount + ivaAmount;

    // 1. Guardar como Movimiento de Caja de Salida (Egreso)
    setNewCashTransaction({
      concept: `COMPRA CASH: ${cashPurchaseForm.productName} (${cashPurchaseForm.quantity}u. ${cashPurchaseForm.supplier ? 'a ' + cashPurchaseForm.supplier : ''})`,
      type: 'out',
      amount: totalAmount
    });

    await saveCashTransaction();

    setShowCashPurchaseModal(false);
    setCashPurchaseForm({
      productName: '',
      supplier: '',
      netCost: 0,
      hasIva: true,
      quantity: 1
    });
  };

  const handleSavePlatformSale = async () => {
    if (!platformSaleForm.productName.trim()) {
      alert('Ingresa el nombre del producto vendido');
      return;
    }
    if (platformSaleForm.salePrice <= 0) {
      alert('Ingresa un precio de venta válido');
      return;
    }

    // Líquido percibido en cuenta = Venta - Comisión - Envío
    const netDeposit = platformSaleForm.salePrice - platformSaleForm.commission - platformSaleForm.shippingCost;

    // 1. Guardar como Movimiento de Caja de Entrada (Ingreso Líquido)
    setNewCashTransaction({
      concept: `VENTA [${platformSaleForm.platform}]: ${platformSaleForm.productName} (Líquido Percibido)`,
      type: 'in',
      amount: netDeposit
    });

    await saveCashTransaction();

    // 2. Actualizar o guardar en precios/costos/comisiones personalizados para el ranking
    const norm = platformSaleForm.productName.trim().toLowerCase();
    updateProductSalePrice(norm, platformSaleForm.salePrice);
    if (platformSaleForm.unitCost > 0) {
      updateProductUnitCost(norm, platformSaleForm.unitCost);
    }
    const totalPlatformExpense = platformSaleForm.commission + platformSaleForm.shippingCost;
    updateProductPlatformExpense(norm, totalPlatformExpense);
    toggleProductTax(norm, platformSaleForm.hasBoleta);

    setShowPlatformSaleModal(false);
    setPlatformSaleForm({
      platform: 'Mercado Libre',
      productName: '',
      salePrice: 0,
      commission: 0,
      shippingCost: 0,
      unitCost: 0,
      hasBoleta: true
    });
  };

  return (
    <div className="space-y-6 px-4 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <Banknote className="text-indigo-600" size={20} />
            Control de Caja & Análisis de Márgenes
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
            Gestión de efectivo en caja, compras cash y ranking de margen por producto (de mayor a menor).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPlatformSaleModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-emerald-100 active:scale-95"
          >
            <CreditCard size={16} />
            Registrar Venta Plataforma / Marketplace
          </button>

          <button
            onClick={() => setShowCashPurchaseModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-rose-100 active:scale-95"
          >
            <ShoppingBag size={16} />
            Registrar Compra al Cash
          </button>
        </div>
      </div>

      {/* TARJETAS RESUMEN DE CAJA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Banknote size={60} />
          </div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Efectivo Disponible en Caja</p>
          <h3 className="text-2xl font-black text-white leading-none">${netCash.toLocaleString()}</h3>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${netCash > 0 ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Estado de Ventanilla</span>
          </div>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm text-emerald-600">
          <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Ingresos Totales Caja</p>
          <h3 className="text-xl font-black leading-none">${totalIn.toLocaleString()}</h3>
          <div className="mt-3 pt-3 border-t border-emerald-200/50 flex items-center gap-2">
            <PlusCircle size={10} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Entradas de Efectivo</span>
          </div>
        </div>
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 shadow-sm text-rose-600">
          <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Egresos Totales (Compras Cash & Gastos)</p>
          <h3 className="text-xl font-black leading-none">${totalOut.toLocaleString()}</h3>
          <div className="mt-3 pt-3 border-t border-rose-200/50 flex items-center gap-2">
            <MinusCircle size={10} />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Salidas de Efectivo</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN PRINCIPAL: RANKING DE PRODUCTOS POR MAYOR MARGEN (DE MAYOR A MENOR) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black uppercase tracking-widest text-slate-900 flex items-center gap-2.5">
              <Award className="text-amber-500 animate-bounce" size={22} />
              Ranking de Productos por Mayor Margen (Mayor a Menor)
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
              Relación directa entre Precio Venta, Costo de Adquisición (Compras / Cash) e IVA para identificar los productos más rentables.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={productSearchTerm}
                onChange={e => setProductSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              <Filter size={14} className="text-slate-400 ml-2" />
              <select
                value={sortCriteria}
                onChange={e => setSortCriteria(e.target.value as any)}
                className="bg-transparent text-[10px] font-black uppercase tracking-wider text-slate-700 outline-none py-1 pr-2 cursor-pointer"
              >
                <option value="margin_pct_desc">Margen % (Mayor a Menor)</option>
                <option value="margin_amt_desc">Margen $ Unit. (Mayor a Menor)</option>
                <option value="total_profit_desc">Ganancia Total $ (Mayor a Menor)</option>
                <option value="units_sold_desc">Unidades Vendidas</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[8px] font-black uppercase">
              <span className="text-slate-400 ml-1 mr-1">Régimen IVA:</span>
              <button
                onClick={() => handleSetGlobalTaxFilter('all_iva')}
                className={`px-2 py-1 rounded-lg transition-all ${globalTaxFilter === 'all_iva' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Todos Boleta (Sí)
              </button>
              <button
                onClick={() => handleSetGlobalTaxFilter('all_cash')}
                className={`px-2 py-1 rounded-lg transition-all ${globalTaxFilter === 'all_cash' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Todos Cash (No)
              </button>
            </div>
          </div>
        </div>

        {/* METRICAS HIGHLIGHT DE MARGEN ALINEADAS AL RÉGIMEN IVA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <Award size={50} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">Producto Estrella (% Margen)</p>
            <h4 className="text-base font-black truncate">{marginKpis.topPctProduct ? marginKpis.topPctProduct.name : 'N/A'}</h4>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">{marginKpis.topPctProduct ? `${marginKpis.topPctProduct.marginPercent.toFixed(1)}%` : '0%'}</span>
              <span className="text-[9px] font-bold opacity-80">
                (${marginKpis.topPctProduct ? marginKpis.topPctProduct.marginAmount.toLocaleString() : '0'} unitario)
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <DollarSign size={50} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-1">Mayor Ganancia Acumulada ($)</p>
            <h4 className="text-base font-black truncate">{marginKpis.topProfitProduct ? marginKpis.topProfitProduct.name : 'N/A'}</h4>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black">${marginKpis.topProfitProduct ? marginKpis.topProfitProduct.totalProfit.toLocaleString() : '0'}</span>
              <span className="text-[9px] font-bold opacity-80">
                ({marginKpis.topProfitProduct ? marginKpis.topProfitProduct.unitsSold : 0} u. vendidas)
              </span>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <Percent size={50} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Margen Promedio Comercial</p>
            <h4 className="text-2xl font-black text-emerald-400">{marginKpis.avgMarginPercent}%</h4>
            <p className="text-[8px] font-bold text-slate-400 uppercase mt-2">
              Basado en {marginKpis.totalProducts} productos registrados
            </p>
          </div>

          <div className="bg-indigo-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <ReceiptText size={50} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300 mb-1">Ganancia Neta Alineada ($)</p>
            <h4 className="text-2xl font-black text-white">${marginKpis.totalProfitAll.toLocaleString()}</h4>
            <div className="mt-2 pt-2 border-t border-indigo-800/80 flex items-center justify-between text-[8px] font-bold text-indigo-200 uppercase">
              <span>IVA Venta Débito: ${marginKpis.totalIvaSaleAll.toLocaleString()}</span>
              <span>({marginKpis.ivaProductsCount} Boleta / {marginKpis.cashProductsCount} Cash)</span>
            </div>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS Y MÁRGENES */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400">#</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400">Producto / Ítem</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400 text-center">¿Afecto a IVA?</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400 text-right">Precio Venta (PVP)</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400 text-right">Costo Adquisición (Neto)</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400 text-right">Comisión / Gastos ($)</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400 text-right">IVA Venta (19%)</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400 text-right">Margen Unit. ($)</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400 text-center">% Margen</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400 text-right">Ganancia Total ($)</th>
                <th className="p-3.5 text-[9px] font-black uppercase text-slate-400 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productMarginsData.map((prod, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-3.5 font-black text-xs text-slate-400">
                    {idx === 0 ? <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">🥇</span> : 
                     idx === 1 ? <span className="p-1.5 bg-slate-200 text-slate-700 rounded-lg">🥈</span> : 
                     idx === 2 ? <span className="p-1.5 bg-amber-50 text-amber-800 rounded-lg">🥉</span> : 
                     `#${idx + 1}`}
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900 uppercase">{prod.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">
                          {prod.unitsSold > 0 ? `${prod.unitsSold} u. vendidas` : 'Sin ventas aún'}
                        </span>
                        {prod.sources.catalog && (
                          <span className="text-[7px] font-black uppercase bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded">Catálogo</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => toggleProductTax(prod.normalized, !prod.isAfectoIva)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 mx-auto border shadow-sm active:scale-95 ${
                        prod.isAfectoIva 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                      title={prod.isAfectoIva ? "Hacer clic para cambiar a Venta Cash Directa (Sin Boleta)" : "Hacer clic para cambiar a Afecto a IVA (Boleta/Factura)"}
                    >
                      {prod.isAfectoIva ? '✓ Sí (Boleta)' : '⚡ No (Cash Directo)'}
                    </button>
                  </td>
                  <td className="p-3.5 text-right font-black text-xs text-slate-900">
                    <EditableCurrencyCell
                      initialValue={prod.salePriceNeto}
                      onSave={(val) => updateProductSalePrice(prod.normalized, val)}
                      onEditingChange={setIsEditingAnyCell}
                      inputClassName="w-24 text-right bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 rounded-lg px-2 py-1 text-xs font-black text-slate-900 outline-none transition-all shadow-inner hover:border-indigo-300 cursor-text"
                      title="Haz clic para editar el Precio de Venta (PVP)"
                    />
                  </td>
                  <td className="p-3.5 text-right font-bold text-xs text-slate-700">
                    <EditableCurrencyCell
                      initialValue={prod.unitCostNeto}
                      onSave={(val) => updateProductUnitCost(prod.normalized, val)}
                      onEditingChange={setIsEditingAnyCell}
                      inputClassName="w-24 text-right bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none transition-all shadow-inner hover:border-indigo-300 cursor-text"
                      title="Haz clic para editar el Costo Neto de Adquisición"
                    />
                  </td>
                  <td className="p-3.5 text-right font-bold text-xs text-rose-600">
                    <EditableCurrencyCell
                      initialValue={prod.platformExpenseBruto}
                      onSave={(val) => updateProductPlatformExpense(prod.normalized, val)}
                      onEditingChange={setIsEditingAnyCell}
                      inputClassName="w-24 text-right bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-200 rounded-lg px-2 py-1 text-xs font-bold text-rose-600 outline-none transition-all shadow-inner hover:border-rose-300 cursor-text"
                      title="Haz clic para editar la Comisión o Gastos de Plataforma (Mercado Libre, Falabella, etc.)"
                    />
                  </td>
                  <td className="p-3.5 text-right font-medium text-[10px] text-slate-400">
                    ${prod.ivaSaleAmount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right font-black text-xs text-emerald-600">
                    +${prod.marginAmount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block text-xs font-black px-2.5 py-1 rounded-full ${prod.marginPercent >= 30 ? 'bg-emerald-100 text-emerald-700' : prod.marginPercent > 0 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                      {prod.marginPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-black text-xs text-indigo-600">
                    ${prod.totalProfit.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${prod.marginStatus.bg} ${prod.marginStatus.text} ${prod.marginStatus.border}`}>
                      {prod.marginStatus.label}
                    </span>
                  </td>
                </tr>
              ))}

              {productMarginsData.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <Package size={36} className="mx-auto opacity-20 mb-3" />
                    <p className="text-xs font-black uppercase tracking-widest">No hay productos registrados para calcular márgenes</p>
                    <p className="text-[10px] text-slate-400 mt-1">Registra productos en Catálogo o Compras para habilitar la tabla de ranking.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULARIO Y REGISTRO DE CAJA + DIARIO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit"
        >
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-indigo-600" /> Registrar Movimiento
            </div>
            <button 
              onClick={() => setNewCashTransaction({
                concept: 'SALDO INICIAL / AJUSTE DE CAJA',
                type: 'in',
                amount: 0
              })}
              className="px-2 py-1 bg-amber-100 text-amber-700 text-[8px] font-black rounded-lg hover:bg-amber-200 transition-colors"
            >
              SALDO INICIAL
            </button>
          </h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Concepto</label>
              <input 
                type="text" 
                value={newCashTransaction.concept}
                onChange={e => setNewCashTransaction({...newCashTransaction, concept: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ej: Venta menor, Pago proveedor..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Tipo</label>
                <div className="flex bg-slate-100 rounded-xl p-1">
                  <button 
                    onClick={() => setNewCashTransaction({...newCashTransaction, type: 'in'})}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${newCashTransaction.type === 'in' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500'}`}
                  >
                    Ingreso
                  </button>
                  <button 
                    onClick={() => setNewCashTransaction({...newCashTransaction, type: 'out'})}
                    className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${newCashTransaction.type === 'out' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500'}`}
                  >
                    Egreso
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Monto ($)</label>
                <input 
                  type="number" 
                  value={newCashTransaction.amount || ''}
                  onChange={e => setNewCashTransaction({...newCashTransaction, amount: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <button 
              onClick={saveCashTransaction}
              disabled={isSavingCash}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isSavingCash ? <Loader2 className="animate-spin mx-auto" size={16} /> : ((newCashTransaction as any).id ? "Actualizar Movimiento" : "Vincular a Caja")}
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[400px]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <History size={16} className="text-slate-400" /> Diario de Movimientos de Caja
            </h2>
            <div className="relative flex-1 max-w-xs group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              <input 
                type="text"
                placeholder="Buscar en diario..."
                value={cashSearchTerm}
                onChange={e => setCashSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredCashTransactions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Sin movimientos encontrados</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredCashTransactions.map(t => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    key={t.id} 
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${t.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {t.type === 'in' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 uppercase">{t.concept}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-0.5">
                          {t.date instanceof Timestamp ? t.date.toDate().toLocaleDateString() : (t.date?.toDate ? t.date.toDate().toLocaleDateString() : 'Reciente')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black ${t.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.type === 'in' ? '+' : '-'}${t.amount.toLocaleString()}
                      </span>
                      <button 
                        onClick={() => {
                          if (window.confirm("¿Estás seguro de que deseas eliminar este movimiento de caja?")) {
                            deleteCashTransaction?.(t.id);
                          }
                        }}
                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Eliminar movimiento"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>

      {/* MODAL REGISTRO RÁPIDO COMPRA AL CASH */}
      {showCashPurchaseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="text-rose-600" size={18} />
                Registrar Compra al Cash (Efectivo)
              </h3>
              <button 
                onClick={() => setShowCashPurchaseModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-medium">
              Al guardar, se descontará automáticamente del saldo en caja como egreso y actualizará la adquisición del producto.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Producto / Mercadería</label>
                <input 
                  type="text"
                  placeholder="Ej: Cable HDMI 2m, Cámara de Seguridad..."
                  value={cashPurchaseForm.productName}
                  onChange={e => setCashPurchaseForm({...cashPurchaseForm, productName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Proveedor / Comercio (Opcional)</label>
                <input 
                  type="text"
                  placeholder="Ej: Distribuidora Central, Meiggs..."
                  value={cashPurchaseForm.supplier}
                  onChange={e => setCashPurchaseForm({...cashPurchaseForm, supplier: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Costo Unit. Neto ($)</label>
                  <input 
                    type="number"
                    value={cashPurchaseForm.netCost || ''}
                    onChange={e => setCashPurchaseForm({...cashPurchaseForm, netCost: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Cantidad</label>
                  <input 
                    type="number"
                    min="1"
                    value={cashPurchaseForm.quantity}
                    onChange={e => setCashPurchaseForm({...cashPurchaseForm, quantity: Math.max(1, Number(e.target.value))})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-600">¿Incluye IVA (19%)?</span>
                  <input 
                    type="checkbox"
                    checked={cashPurchaseForm.hasIva}
                    onChange={e => setCashPurchaseForm({...cashPurchaseForm, hasIva: e.target.checked})}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-200 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex justify-between text-xs font-black">
                  <span className="text-slate-500 uppercase text-[9px]">Total a Descontar de Caja:</span>
                  <span className="text-rose-600">
                    ${Math.round(
                      (cashPurchaseForm.netCost * cashPurchaseForm.quantity) * (cashPurchaseForm.hasIva ? 1.19 : 1)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSaveCashPurchase}
                className="w-full py-3.5 bg-rose-600 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                Confirmar Compra Cash & Descontar de Caja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR VENTA POR PLATAFORMA / MARKETPLACE */}
      {showPlatformSaleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 relative">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                <CreditCard className="text-emerald-600" size={18} />
                Registrar Venta Plataforma / Marketplace
              </h3>
              <button 
                onClick={() => setShowPlatformSaleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Plataforma / Canal de Venta</label>
                <select
                  value={platformSaleForm.platform}
                  onChange={e => setPlatformSaleForm({...platformSaleForm, platform: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Mercado Libre">Mercado Libre</option>
                  <option value="Falabella">Falabella Marketplace</option>
                  <option value="Paris">Paris Marketplace</option>
                  <option value="Ripley">Ripley Marketplace</option>
                  <option value="Shopify / Web">Shopify / Sitio Web</option>
                  <option value="Venta Directa">Venta Directa</option>
                  <option value="Otro Marketplace">Otro Marketplace</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Producto / Ítem Vendido</label>
                <input 
                  type="text"
                  placeholder="Ej: Cable De Red Utp Cat6 305m..."
                  value={platformSaleForm.productName}
                  onChange={e => setPlatformSaleForm({...platformSaleForm, productName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Precio Venta Cliente ($)</label>
                  <input 
                    type="number"
                    placeholder="49990"
                    value={platformSaleForm.salePrice || ''}
                    onChange={e => setPlatformSaleForm({...platformSaleForm, salePrice: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Comisión Plataforma ($)</label>
                  <input 
                    type="number"
                    placeholder="6499"
                    value={platformSaleForm.commission || ''}
                    onChange={e => setPlatformSaleForm({...platformSaleForm, commission: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-rose-600 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Costo de Envío ($)</label>
                  <input 
                    type="number"
                    placeholder="3250"
                    value={platformSaleForm.shippingCost || ''}
                    onChange={e => setPlatformSaleForm({...platformSaleForm, shippingCost: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-rose-600 outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Costo Neto Proveedor ($)</label>
                  <input 
                    type="number"
                    placeholder="29904"
                    value={platformSaleForm.unitCost || ''}
                    onChange={e => setPlatformSaleForm({...platformSaleForm, unitCost: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-700">¿Venta con Boleta / Factura (Afecto a IVA)?</span>
                <input 
                  type="checkbox"
                  checked={platformSaleForm.hasBoleta}
                  onChange={e => setPlatformSaleForm({...platformSaleForm, hasBoleta: e.target.checked})}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-200 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-slate-400 uppercase text-[9px]">Líquido a Recibir en Banco:</span>
                  <span className="text-emerald-400 text-sm">
                    ${(
                      platformSaleForm.salePrice - platformSaleForm.commission - platformSaleForm.shippingCost
                    ).toLocaleString()}
                  </span>
                </div>

                {platformSaleForm.hasBoleta ? (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400">
                      <span>Venta Neta (Sin IVA 19%):</span>
                      <span>${Math.round(platformSaleForm.salePrice / 1.19).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-slate-400">
                      <span>Gastos Netos Plataforma:</span>
                      <span>-${(Math.round(platformSaleForm.commission / 1.19) + Math.round(platformSaleForm.shippingCost / 1.19)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black text-white pt-1">
                      <span className="text-emerald-300 uppercase text-[9px]">Ganancia Neta Real (Con Ajuste IVA):</span>
                      <span className="text-emerald-400">
                        +${(
                          Math.round(platformSaleForm.salePrice / 1.19) - 
                          platformSaleForm.unitCost - 
                          Math.round(platformSaleForm.commission / 1.19) - 
                          Math.round(platformSaleForm.shippingCost / 1.19)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-black">
                    <span className="text-emerald-300 uppercase text-[9px]">Ganancia Neta Percibida (Cash 100%):</span>
                    <span className="text-emerald-400">
                      +${(
                        (platformSaleForm.salePrice - platformSaleForm.commission - platformSaleForm.shippingCost) - platformSaleForm.unitCost
                      ).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleSavePlatformSale}
                className="w-full py-3.5 bg-emerald-600 hover:bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                Confirmar & Ingresar Líquido a Caja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
