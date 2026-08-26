import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Search, 
  Calendar,
  AlertTriangle,
  Info,
  Clock,
  ChevronRight,
  X,
  FileText,
  ShoppingBag,
  Trash2,
  AlertCircle,
  Plus,
  Edit3,
  Save,
  PackagePlus,
  RotateCcw,
  Check,
  Maximize2,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area,
  Cell
} from 'recharts';
import { formatCLP, parseCLP } from '../../lib/utils';
import { Timestamp } from 'firebase/firestore';
import { CatalogItem } from '../../types';
import { calcularPrecioAutomatico } from '../../logic/taxLogic';

interface ImportBatchItem {
  product: string;
  quantity: number;
  unitCost: number;
  salePrice: number;
  currentInventory: number;
}

interface ImportBatch {
  id: string;
  name: string;
  date: any;
  items: ImportBatchItem[];
  totalInvestment: number;
  totalExpenses: number;
  ownerId: string;
  notes?: string;
}

interface Shrinkage {
  id: string;
  productName: string;
  quantity: number;
  unitCost: number;
  reason: 'malo' | 'devuelto' | 'vencido' | 'otro';
  date: any;
  ownerId: string;
  description?: string;
}

interface BudgetItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unitCost?: number;
}

interface QuoteItem {
  id: string;
  clientInfo: any;
  items: BudgetItem[];
  createdAt: any;
  status?: string;
  totalProposal?: number;
  signature?: string;
}

interface StockModuleProps {
  importBatches: ImportBatch[];
  shrinkages: Shrinkage[];
  previousQuotes: QuoteItem[];
  catalog: CatalogItem[];
  isConfirmedStatus: (status: any, signature: any) => boolean;
  onUpdateCatalogItem?: (item: CatalogItem) => void;
  onAddCatalogItem?: (item: CatalogItem) => void;
}

export const StockModule: React.FC<StockModuleProps> = ({
  importBatches = [],
  shrinkages = [],
  previousQuotes = [],
  catalog = [],
  isConfirmedStatus,
  onUpdateCatalogItem,
  onAddCatalogItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeModalTab, setActiveModalTab] = useState<'chart' | 'imports' | 'sales' | 'shrinkages'>('chart');
  const [filterType, setFilterType] = useState<'all' | 'in_stock' | 'critical' | 'stagnant' | 'healthy'>('in_stock');
  const [salesTimeframe, setSalesTimeframe] = useState<'daily' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string | null>(null);
  const [topRotationLimit, setTopRotationLimit] = useState<5 | 10 | 20>(10);
  const [selectedYearFilter, setSelectedYearFilter] = useState<number | 'all'>('all');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<number | 'all'>('all');
  const [periodSearchTerm, setPeriodSearchTerm] = useState<string>('');
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState<boolean>(false);
  const [rankingCriteria, setRankingCriteria] = useState<'qty' | 'amount'>('qty');
  const [periodSortCriteria, setPeriodSortCriteria] = useState<'qty' | 'amount'>('qty');

  // Años disponibles a partir de cotizaciones
  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    const currentY = new Date().getFullYear();
    yearsSet.add(currentY);
    yearsSet.add(currentY - 1);
    previousQuotes.forEach(quote => {
      if (!quote.createdAt) return;
      let d: Date | null = null;
      if (typeof quote.createdAt.toDate === 'function') d = quote.createdAt.toDate();
      else if (quote.createdAt.seconds) d = new Date(quote.createdAt.seconds * 1000);
      else d = new Date(quote.createdAt);

      if (d && !isNaN(d.getFullYear())) {
        yearsSet.add(d.getFullYear());
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [previousQuotes]);

  const monthOptions = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  // Modal para Ajustar Stock de un Producto Existente
  const [editingStockProduct, setEditingStockProduct] = useState<any | null>(null);
  const [editStockForm, setEditStockForm] = useState<{
    initialStock: number;
    unitCost: number;
  }>({ initialStock: 0, unitCost: 0 });

  // Modal para Crear Nuevo Producto y Stock
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState<{
    name: string;
    id: string;
    description: string;
    initialStock: number;
    unitCost: number;
  }>({
    name: '',
    id: '',
    description: '',
    initialStock: 0,
    unitCost: 0
  });

  const normalizeName = (name: string) => name ? name.trim().toLowerCase() : '';

  // 12 meses históricos para gráficos de estacionalidad
  const last12Months = useMemo(() => {
    const months = [];
    const d = new Date();
    for (let i = 11; i >= 0; i--) {
      const temp = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const y = temp.getFullYear();
      const m = String(temp.getMonth() + 1).padStart(2, '0');
      months.push(`${y}-${m}`);
    }
    return months;
  }, []);

  // Procesamiento principal del inventario consolidado
  const productData = useMemo(() => {
    const dictionary: { [normalized: string]: any } = {};

    const getOrCreate = (rawName: string) => {
      const norm = normalizeName(rawName);
      if (!norm) return null;
      if (!dictionary[norm]) {
        dictionary[norm] = {
          id: '',
          name: rawName.trim(),
          normalized: norm,
          description: '',
          initialStock: 0,
          totalImported: 0,
          totalSold: 0,
          totalShrinkage: 0,
          importsHistory: [],
          salesHistory: [],
          shrinkageHistory: [],
          monthlySales: {},
          latestSalePrice: 0,
          latestUnitCost: 0,
          createdAt: null
        };
      }
      return dictionary[norm];
    };

    // Helper para fechas
    const resolveDate = (raw: any): Date => {
      if (!raw) return new Date();
      if (typeof raw.toDate === 'function') return raw.toDate();
      if (raw.seconds) return new Date(raw.seconds * 1000);
      return new Date(raw);
    };

    // 1. Cargar Catálogo base (incluyendo Stock Inicial de Bodega y Costo Local)
    catalog.forEach(item => {
      const entry = getOrCreate(item.name);
      if (entry) {
        entry.id = item.id;
        entry.description = item.description || '';
        entry.latestSalePrice = item.unitPrice || 0;
        entry.initialStock = item.initialStock || 0;
        if (item.createdAt) {
          entry.createdAt = resolveDate(item.createdAt);
        }
        if (item.unitCost && item.unitCost > 0) {
          entry.latestUnitCost = item.unitCost;
        } else if (item.unitPrice && item.unitPrice > 0) {
          entry.latestUnitCost = item.unitPrice;
        }
      }
    });

    // 2. Cargar Importaciones
    importBatches.forEach(batch => {
      const batchDate = resolveDate(batch.date);
      const inv = batch.totalInvestment || 0;
      const exp = batch.totalExpenses || 0;
      const arancel = (batch as any).arancelAmount || ((batch as any).hasCertificateOfOrigin ? 0 : Math.round(inv * 0.06));
      const totalNeto = inv + exp + arancel;
      const qty = (batch as any).quantity || 1;
      const unitCostNeto = (batch as any).netUnitCost || (qty > 0 ? Math.round(totalNeto / qty) : 0);

      // A) Si el lote tiene ítems explícitos
      if (batch.items && batch.items.length > 0) {
        batch.items.forEach(item => {
          if (!item.product) return;
          let entry = getOrCreate(item.product);
          if (!entry) {
            const targetNorm = normalizeName(item.product);
            const foundKey = Object.keys(dictionary).find(k => k && (k.includes(targetNorm) || targetNorm.includes(k)));
            if (foundKey) entry = dictionary[foundKey];
          }

          if (entry) {
            entry.totalImported += item.quantity || qty;
            entry.importsHistory.push({
              date: batchDate,
              batchName: batch.name,
              qty: item.quantity || qty,
              unitCost: item.unitCost || unitCostNeto,
              salePrice: item.salePrice || entry.latestSalePrice || 0
            });
            if (item.salePrice > 0) entry.latestSalePrice = item.salePrice;
            if (item.unitCost > 0) entry.latestUnitCost = item.unitCost;
            else if (unitCostNeto > 0) entry.latestUnitCost = unitCostNeto;
          }
        });
      }

      // B) Vincular también por el nombre del lote principal
      const cleanBatchName = (batch.name || '').replace(/#\d+/g, '').replace(/importaci[oó]n/gi, '').trim();
      const normBatchName = normalizeName(cleanBatchName);

      if (normBatchName) {
        const matchingEntryKey = Object.keys(dictionary).find(k => {
          if (!k) return false;
          return k.includes(normBatchName) || normBatchName.includes(k) ||
            (k.includes('tow bar') && normBatchName.includes('tow bar')) ||
            (k.includes('remolque') && normBatchName.includes('remolque')) ||
            (k.includes('3-ton') && normBatchName.includes('3-ton'));
        });

        if (matchingEntryKey) {
          const entry = dictionary[matchingEntryKey];
          const alreadyAdded = entry.importsHistory.some((h: any) => h.batchName === batch.name);
          if (!alreadyAdded) {
            entry.totalImported += qty;
            entry.importsHistory.push({
              date: batchDate,
              batchName: batch.name,
              qty: qty,
              unitCost: unitCostNeto,
              salePrice: entry.latestSalePrice || 0
            });
            if (unitCostNeto > 0) entry.latestUnitCost = unitCostNeto;
          }
        }
      }
    });

    // 3. Cargar Ventas Aprobadas (Descuento automático de Stock por Ventas)
    previousQuotes.forEach(quote => {
      const isSold = isConfirmedStatus 
        ? isConfirmedStatus(quote.status, quote.signature) 
        : (quote.status === 'APPROVED' || quote.status === 'paid' || quote.status === 'approved');
      if (!isSold) return;

      const saleDate = resolveDate(quote.createdAt);
      const year = saleDate.getFullYear();
      const month = String(saleDate.getMonth() + 1).padStart(2, '0');
      const monthKey = `${year}-${month}`;
      const clientName = quote.clientInfo?.company || quote.clientInfo?.name || 'Cliente sin nombre';

      (quote.items || []).forEach(item => {
        const productName = item.description || item.name || '';
        const entry = getOrCreate(productName);
        if (entry) {
          const qty = item.quantity || 0;
          entry.totalSold += qty;
          entry.salesHistory.push({
            date: saleDate,
            clientName,
            qty,
            salePrice: item.unitPrice || 0
          });
          entry.monthlySales[monthKey] = (entry.monthlySales[monthKey] || 0) + qty;
          if (item.unitPrice > 0) entry.latestSalePrice = item.unitPrice;
        }
      });
    });

    // 4. Cargar Mermas
    shrinkages.forEach(s => {
      const sDate = resolveDate(s.date);
      const entry = getOrCreate(s.productName);
      if (entry) {
        entry.totalShrinkage += s.quantity || 0;
        entry.shrinkageHistory.push({
          date: sDate,
          qty: s.quantity,
          unitCost: s.unitCost || entry.latestUnitCost || 0,
          reason: s.reason,
          desc: s.description
        });
        if (s.unitCost > 0) entry.latestUnitCost = s.unitCost;
      }
    });

    // 5. Formatear y calcular métricas ponderadas & Stock Neto Real
    return Object.values(dictionary).map(entry => {
      entry.importsHistory.sort((a: any, b: any) => b.date.getTime() - a.date.getTime());
      entry.salesHistory.sort((a: any, b: any) => b.date.getTime() - a.date.getTime());
      entry.shrinkageHistory.sort((a: any, b: any) => b.date.getTime() - a.date.getTime());

      // Base total de unidades que entraron al inventario (Stock Inicial Bodega + Importaciones)
      const baseStockTotal = (entry.initialStock || 0) + entry.totalImported;

      // Stock Neto Actual Disponible (Considera lo vendido automáticamente y las mermas)
      const stock = baseStockTotal - entry.totalSold - entry.totalShrinkage;

      // Costo Promedio Ponderado (WAC)
      const totalImportCost = entry.importsHistory.reduce((acc: number, h: any) => acc + (h.qty * h.unitCost), 0);
      const totalImportQty = entry.importsHistory.reduce((acc: number, h: any) => acc + h.qty, 0);

      let wac = 0;
      if (totalImportQty > 0) {
        const initialCostTotal = (entry.initialStock || 0) * (entry.latestUnitCost || 0);
        const combinedQty = totalImportQty + (entry.initialStock || 0);
        wac = combinedQty > 0 ? (totalImportCost + initialCostTotal) / combinedQty : entry.latestUnitCost || 0;
      } else {
        wac = entry.latestUnitCost || 0;
      }

      // Tasa de Rotación (%)
      const rotationRate = baseStockTotal > 0 ? Math.round((entry.totalSold / baseStockTotal) * 100) : 0;

      // Mes de Mayor Venta (Estacionalidad)
      let peakMonth = '-';
      let peakQty = 0;
      Object.entries(entry.monthlySales).forEach(([m, q]: [string, any]) => {
        if (q > peakQty) {
          peakQty = q;
          peakMonth = m;
        }
      });

      // Formato para mes peak
      let peakMonthLabel = '-';
      if (peakMonth !== '-') {
        const [year, month] = peakMonth.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthName = date.toLocaleString('es-CL', { month: 'long' });
        peakMonthLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} (${peakQty} u.)`;
      }

      // Estancado: stock > 0, ingresado hace más de 90 días y sin ventas en los últimos 90 días
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
      const hasRecentSales = entry.salesHistory.some((s: any) => s.date.getTime() > threeMonthsAgo.getTime());
      
      // Fecha más antigua conocida (creación de producto o lote de importación más antiguo)
      let oldestDate: Date | null = entry.createdAt || null;
      if (entry.importsHistory.length > 0) {
        const oldestImport = entry.importsHistory[entry.importsHistory.length - 1].date;
        if (!oldestDate || oldestImport.getTime() < oldestDate.getTime()) {
          oldestDate = oldestImport;
        }
      }

      // Si no hay fecha registrada o fue creado hace menos de 90 días, NO es estancado (es nuevo/reciente)
      const isOlderThan90Days = oldestDate ? oldestDate.getTime() <= threeMonthsAgo.getTime() : false;
      const isStagnant = stock > 0 && isOlderThan90Days && !hasRecentSales;

      return {
        ...entry,
        baseStockTotal,
        wac,
        stock,
        rotationRate,
        peakMonthLabel,
        peakMonthKey: peakMonth,
        peakQty,
        isStagnant,
        hasRecentSales
      };
    });
  }, [catalog, importBatches, previousQuotes, shrinkages, isConfirmedStatus]);

  // KPIs del inventario general
  const kpis = useMemo(() => {
    let totalInvestment = 0;
    let totalUnits = 0;
    let totalPotentialSales = 0;
    let stagnantCount = 0;

    productData.forEach(p => {
      const stockVal = Math.max(0, p.stock);
      totalInvestment += stockVal * p.wac;
      totalUnits += stockVal;

      const precioVentaNetoEstimado = p.wac > 0 
        ? Math.round(calcularPrecioAutomatico(p.wac).precioFinal / 1.19)
        : (p.latestSalePrice || 0);

      totalPotentialSales += stockVal * precioVentaNetoEstimado;
      if (p.isStagnant) stagnantCount++;
    });

    const potentialMargin = totalPotentialSales - totalInvestment;

    return {
      totalInvestment,
      totalUnits,
      totalPotentialSales,
      potentialMargin,
      stagnantCount
    };
  }, [productData]);

  // Procesamiento dinámico de Estacionalidad Temporal de Ventas (Día, Mes, Trimestre, Año) con desglose por producto
  const salesAnalyticsData = useMemo(() => {
    const resolveDate = (raw: any): Date => {
      if (!raw) return new Date();
      if (typeof raw.toDate === 'function') return raw.toDate();
      if (raw.seconds) return new Date(raw.seconds * 1000);
      return new Date(raw);
    };

    const soldQuotes = previousQuotes.filter(quote => 
      isConfirmedStatus 
        ? isConfirmedStatus(quote.status, quote.signature) 
        : (quote.status === 'APPROVED' || quote.status === 'paid' || quote.status === 'approved')
    );

    const now = new Date();
    const periodKeys: { key: string; label: string; dateStart: Date; dateEnd: Date }[] = [];

    if (salesTimeframe === 'daily') {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        const monthName = d.toLocaleString('es-CL', { month: 'short' });
        const label = `${dd} ${monthName}`;
        periodKeys.push({ key, label, dateStart: new Date(yyyy, d.getMonth(), d.getDate(), 0, 0, 0), dateEnd: new Date(yyyy, d.getMonth(), d.getDate(), 23, 59, 59) });
      }
    } else if (salesTimeframe === 'monthly') {
      if (selectedYearFilter !== 'all') {
        const yyyy = Number(selectedYearFilter);
        for (let m = 0; m < 12; m++) {
          const temp = new Date(yyyy, m, 1);
          const mm = String(m + 1).padStart(2, '0');
          const key = `${yyyy}-${mm}`;
          const monthName = temp.toLocaleString('es-CL', { month: 'long' });
          const label = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} '${String(yyyy).substring(2)}`;
          periodKeys.push({ key, label, dateStart: new Date(yyyy, m, 1), dateEnd: new Date(yyyy, m + 1, 0, 23, 59, 59) });
        }
      } else {
        for (let i = 11; i >= 0; i--) {
          const temp = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const yyyy = temp.getFullYear();
          const mm = String(temp.getMonth() + 1).padStart(2, '0');
          const key = `${yyyy}-${mm}`;
          const monthName = temp.toLocaleString('es-CL', { month: 'short' });
          const label = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} '${String(yyyy).substring(2)}`;
          periodKeys.push({ key, label, dateStart: new Date(yyyy, temp.getMonth(), 1), dateEnd: new Date(yyyy, temp.getMonth() + 1, 0, 23, 59, 59) });
        }
      }
    } else if (salesTimeframe === 'quarterly') {
      const currentYear = selectedYearFilter !== 'all' ? Number(selectedYearFilter) : now.getFullYear();
      for (let q = 1; q <= 4; q++) {
        const key = `${currentYear}-Q${q}`;
        const label = `Q${q} '${String(currentYear).substring(2)}`;
        const startMonth = (q - 1) * 3;
        periodKeys.push({ key, label, dateStart: new Date(currentYear, startMonth, 1), dateEnd: new Date(currentYear, startMonth + 3, 0, 23, 59, 59) });
      }
    } else if (salesTimeframe === 'yearly') {
      const currentYear = now.getFullYear();
      for (let i = 4; i >= 0; i--) {
        const y = currentYear - i;
        const key = `${y}`;
        const label = `${y}`;
        periodKeys.push({ key, label, dateStart: new Date(y, 0, 1), dateEnd: new Date(y, 11, 31, 23, 59, 59) });
      }
    }

    const periodsMap: { 
      [key: string]: { 
        key: string; 
        label: string; 
        unidades: number; 
        totalAmount: number;
        itemsMap: { [productName: string]: { name: string; qty: number; total: number } } 
      } 
    } = {};

    periodKeys.forEach(p => {
      periodsMap[p.key] = {
        key: p.key,
        label: p.label,
        unidades: 0,
        totalAmount: 0,
        itemsMap: {}
      };
    });

    soldQuotes.forEach(quote => {
      const qDate = resolveDate(quote.createdAt);
      const qTime = qDate.getTime();

      const matchedPeriod = periodKeys.find(p => qTime >= p.dateStart.getTime() && qTime <= p.dateEnd.getTime());
      if (!matchedPeriod) return;

      const pObj = periodsMap[matchedPeriod.key];
      if (!pObj) return;

      (quote.items || []).forEach(item => {
        const prodName = (item.description || item.name || 'Producto sin nombre').trim();
        const qty = item.quantity || 0;
        const price = item.unitPrice || 0;
        const itemTotal = qty * price;

        pObj.unidades += qty;
        pObj.totalAmount += itemTotal;

        if (!pObj.itemsMap[prodName]) {
          pObj.itemsMap[prodName] = { name: prodName, qty: 0, total: 0 };
        }
        pObj.itemsMap[prodName].qty += qty;
        pObj.itemsMap[prodName].total += itemTotal;
      });
    });

    return periodKeys.map(p => {
      const pData = periodsMap[p.key];
      const productsList = Object.values(pData.itemsMap).sort((a, b) => b.qty - a.qty);
      return {
        key: p.key,
        period: p.label,
        unidades: pData.unidades,
        totalAmount: pData.totalAmount,
        products: productsList
      };
    });
  }, [previousQuotes, salesTimeframe, selectedYearFilter, isConfirmedStatus]);

  // Periodo seleccionado para ver desglose detallado
  const activePeriodDetail = useMemo(() => {
    if (selectedMonthFilter !== 'all') {
      const yearToUse = selectedYearFilter !== 'all' ? selectedYearFilter : new Date().getFullYear();
      const monthStr = String(selectedMonthFilter).padStart(2, '0');
      const targetKey = `${yearToUse}-${monthStr}`;
      const found = salesAnalyticsData.find(p => p.key === targetKey);
      if (found) return found;
    }
    if (!selectedPeriodKey) return salesAnalyticsData[salesAnalyticsData.length - 1] || null;
    return salesAnalyticsData.find(p => p.key === selectedPeriodKey) || salesAnalyticsData[salesAnalyticsData.length - 1] || null;
  }, [salesAnalyticsData, selectedPeriodKey, selectedMonthFilter, selectedYearFilter]);

  // Filtrado y orden de productos en el periodo activo
  const filteredPeriodProducts = useMemo(() => {
    if (!activePeriodDetail || !activePeriodDetail.products) return [];
    let list = [...activePeriodDetail.products];
    if (periodSearchTerm.trim()) {
      const term = periodSearchTerm.toLowerCase().trim();
      list = list.filter(p => p.name.toLowerCase().includes(term));
    }
    return list.sort((a, b) => periodSortCriteria === 'qty' ? b.qty - a.qty : b.total - a.total);
  }, [activePeriodDetail, periodSearchTerm, periodSortCriteria]);

  // Productos con Mayor Rotación (Top 5 / 10 / 20 por Unidades o por Ingresos CLP)
  const topRotationProducts = useMemo(() => {
    return [...productData]
      .filter(p => p.totalSold > 0)
      .map(p => {
        const totalAmountSold = p.salesHistory.reduce((sum: number, s: any) => sum + (s.qty * (s.salePrice || 0)), 0);
        return {
          name: p.name.length > 22 ? p.name.substring(0, 22) + '...' : p.name,
          fullName: p.name,
          unidades: p.totalSold,
          montoTotal: totalAmountSold,
          tasa: p.rotationRate
        };
      })
      .sort((a, b) => rankingCriteria === 'qty' ? b.unidades - a.unidades : b.montoTotal - a.montoTotal)
      .slice(0, topRotationLimit);
  }, [productData, topRotationLimit, rankingCriteria]);

  // Filtrado de la lista de productos
  const filteredProducts = useMemo(() => {
    return productData.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.normalized.includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (filterType === 'in_stock') return p.stock > 0;
      if (filterType === 'critical') {
        if (p.stock <= 0) return true;
        if (p.wac >= 100000) return p.stock <= 1;
        if (p.wac >= 10000) return p.stock <= 3;
        return p.stock <= 20;
      }
      if (filterType === 'stagnant') return p.isStagnant;
      if (filterType === 'healthy') {
        if (p.stock <= 0) return false;
        if (p.wac >= 100000) return p.stock > 1;
        if (p.wac >= 10000) return p.stock > 3;
        return p.stock > 20;
      }
      return true;
    }).sort((a, b) => b.totalSold - a.totalSold || b.rotationRate - a.rotationRate);
  }, [productData, searchTerm, filterType]);

  // Helper de Estado de Stock Inteligente basado en Costo Unitario
  const getStockBadgeInfo = (stock: number, wac: number) => {
    if (stock <= 0) {
      return { label: 'Agotado', class: 'bg-rose-50 text-rose-700 border-rose-100' };
    }
    if (wac >= 100000) {
      if (stock <= 1) return { label: 'Crítico (Bajo)', class: 'bg-amber-50 text-amber-700 border-amber-100' };
      if (stock >= 10) return { label: 'Alto Capital ($)', class: 'bg-indigo-50 text-indigo-700 border-indigo-100' };
      return { label: 'Óptimo', class: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    } else if (wac >= 10000) {
      if (stock <= 3) return { label: 'Crítico', class: 'bg-amber-50 text-amber-700 border-amber-100' };
      return { label: 'Saludable', class: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    } else {
      if (stock <= 20) return { label: 'Crítico (Insumo)', class: 'bg-amber-50 text-amber-700 border-amber-100' };
      return { label: 'Saludable', class: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    }
  };

  // Gráfico de estacionalidad mensual para el modal de detalle del producto
  const productMonthlyChartData = useMemo(() => {
    if (!selectedProduct) return [];
    return last12Months.map(monthKey => {
      const [year, month] = monthKey.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthName = date.toLocaleString('es-CL', { month: 'short' });
      const yearShort = year.substring(2);
      return {
        month: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} '${yearShort}`,
        unidades: selectedProduct.monthlySales[monthKey] || 0
      };
    });
  }, [selectedProduct, last12Months]);

  // Abrir modal de edición de stock de un producto
  const handleOpenEditStock = (prod: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingStockProduct(prod);
    setEditStockForm({
      initialStock: prod.initialStock || 0,
      unitCost: prod.wac || prod.latestUnitCost || 0
    });
  };

  // Guardar edición de stock
  const handleSaveStockEdit = () => {
    if (!editingStockProduct) return;

    const existingCatalogItem = catalog.find(item => 
      item.id === editingStockProduct.id || normalizeName(item.name) === editingStockProduct.normalized
    );

    const itemId = existingCatalogItem?.id || editingStockProduct.id || `PROD-${Date.now()}`;
    const costValue = Math.max(0, Number(editStockForm.unitCost) || 0);

    const updatedCatalogItem: CatalogItem = {
      id: itemId,
      name: editingStockProduct.name,
      description: editingStockProduct.description || existingCatalogItem?.description || '',
      unitPrice: costValue, // COSTO NETO DE ADQUISICIÓN / COMPRA AL PROVEEDOR
      unitCost: costValue,  // COSTO NETO DE ADQUISICIÓN AL PROVEEDOR
      initialStock: Math.max(0, Number(editStockForm.initialStock) || 0),
      imageUrl: existingCatalogItem?.imageUrl,
      images: existingCatalogItem?.images,
      pdfUrl: existingCatalogItem?.pdfUrl
    };

    if (onUpdateCatalogItem) {
      onUpdateCatalogItem(updatedCatalogItem);
    }

    setEditingStockProduct(null);
    if (selectedProduct && selectedProduct.normalized === editingStockProduct.normalized) {
      setSelectedProduct(null);
    }
  };

  // Guardar nuevo producto desde Stock
  const handleSaveNewProduct = () => {
    if (!newProductForm.name.trim()) return alert('Por favor ingresa un nombre para el producto');

    const generatedId = newProductForm.id.trim() || `PROD-${Date.now()}`;
    const costValue = Math.max(0, Number(newProductForm.unitCost) || 0);

    const newCatalogItem: CatalogItem = {
      id: generatedId,
      name: newProductForm.name.trim(),
      description: newProductForm.description.trim(),
      unitPrice: costValue, // COSTO NETO DE ADQUISICIÓN AL PROVEEDOR
      unitCost: costValue,  // COSTO NETO DE ADQUISICIÓN AL PROVEEDOR
      initialStock: Math.max(0, Number(newProductForm.initialStock) || 0)
    };

    if (onAddCatalogItem) {
      onAddCatalogItem(newCatalogItem);
    }

    setIsAddModalOpen(false);
    setNewProductForm({
      name: '',
      id: '',
      description: '',
      initialStock: 0,
      unitCost: 0
    });
  };

  return (
    <div className="space-y-6 px-4 pb-20 mt-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
            <Package className="text-indigo-600 animate-pulse" size={22} />
            Módulo de Stock, Bodega & Rotación
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
            Gestión de stock físico de bodega (proveedores locales), cálculo de WAC y deducción automática por ventas.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-indigo-100 hover:scale-[1.02]"
        >
          <PackagePlus size={16} />
          Registrar Producto y Stock
        </button>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-all"></div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Inversión en Stock (Activos)</p>
          <h3 className="text-xl font-black text-white leading-none">
            {formatCLP(kpis.totalInvestment)}
          </h3>
          <p className="text-[8px] font-bold text-indigo-400 mt-2 uppercase tracking-widest">
            {kpis.totalUnits.toLocaleString()} Unidades Disponibles
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor Venta Estimado</p>
          <h3 className="text-xl font-black text-slate-900 leading-none text-indigo-600">
            {formatCLP(kpis.totalPotentialSales)}
          </h3>
          <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
            Precio de Lista / Catálogo
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Margen Neto Proyectado</p>
          <h3 className="text-xl font-black text-emerald-600 leading-none">
            {formatCLP(kpis.potentialMargin)}
          </h3>
          <p className="text-[8px] font-bold text-emerald-500 mt-2 uppercase tracking-widest">
            Retorno: +{kpis.totalInvestment > 0 ? Math.round((kpis.potentialMargin / kpis.totalInvestment) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Unidades Disponibles</p>
          <h3 className="text-xl font-black text-slate-900 leading-none">
            {kpis.totalUnits.toLocaleString()} u.
          </h3>
          <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
            Disponibilidad Real en Almacén
          </p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-sm transition-all ${kpis.stagnantCount > 0 ? 'bg-rose-50 border-rose-100 text-rose-900' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[9px] font-black uppercase tracking-widest">Productos Estancados</p>
            {kpis.stagnantCount > 0 && <AlertTriangle size={14} className="text-rose-500 animate-bounce" />}
          </div>
          <h3 className="text-xl font-black leading-none">
            {kpis.stagnantCount}
          </h3>
          <p className={`text-[8px] font-bold mt-2 uppercase tracking-widest ${kpis.stagnantCount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
            {kpis.stagnantCount > 0 ? 'Requiere Liquidación' : 'Inventario en Rotación ✓'}
          </p>
        </div>
      </div>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SEASONALITY CHART & DRILLDOWN */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-600" />
                  Estacionalidad & Tendencia de Ventas
                </h4>
                <p className="text-[8px] font-bold uppercase text-slate-400 mt-1">Análisis por periodo con desglose detallado de ítems vendidos</p>
              </div>

              {/* Controles de Selección de Año, Mes y Vista */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <Calendar size={12} className="text-indigo-600 ml-1.5 shrink-0" />
                  <select 
                    value={selectedYearFilter}
                    onChange={(e) => {
                      const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                      setSelectedYearFilter(val);
                      setSalesTimeframe('monthly');
                      setSelectedPeriodKey(null);
                    }}
                    className="bg-white border-0 text-[9px] font-black text-slate-700 rounded-lg px-2 py-1 outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">Año: Todos</option>
                    {availableYears.map(y => (
                      <option key={y} value={y}>Año: {y}</option>
                    ))}
                  </select>

                  <select 
                    value={selectedMonthFilter}
                    onChange={(e) => {
                      const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                      setSelectedMonthFilter(val);
                      setSalesTimeframe('monthly');
                      if (val !== 'all') {
                        const yearToUse = selectedYearFilter !== 'all' ? selectedYearFilter : new Date().getFullYear();
                        const mStr = String(val).padStart(2, '0');
                        setSelectedPeriodKey(`${yearToUse}-${mStr}`);
                      }
                    }}
                    className="bg-white border-0 text-[9px] font-black text-slate-700 rounded-lg px-2 py-1 outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">Mes: Todos</option>
                    {monthOptions.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>

                  {(selectedYearFilter !== 'all' || selectedMonthFilter !== 'all') && (
                    <button 
                      onClick={() => {
                        setSelectedYearFilter('all');
                        setSelectedMonthFilter('all');
                        setSelectedPeriodKey(null);
                      }}
                      className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Limpiar filtros de fecha"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Timeframe Selector Buttons */}
                <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
                  <button 
                    onClick={() => { setSalesTimeframe('daily'); setSelectedPeriodKey(null); }}
                    className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${salesTimeframe === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Diario (30d)
                  </button>
                  <button 
                    onClick={() => { setSalesTimeframe('monthly'); setSelectedPeriodKey(null); }}
                    className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${salesTimeframe === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Mensual
                  </button>
                  <button 
                    onClick={() => { setSalesTimeframe('quarterly'); setSelectedPeriodKey(null); }}
                    className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${salesTimeframe === 'quarterly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Trimestral
                  </button>
                  <button 
                    onClick={() => { setSalesTimeframe('yearly'); setSelectedPeriodKey(null); }}
                    className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${salesTimeframe === 'yearly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Anual
                  </button>
                </div>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={salesAnalyticsData} 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  onClick={(e: any) => {
                    if (e && e.activePayload && e.activePayload.length) {
                      setSelectedPeriodKey(e.activePayload[0].payload.key);
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="colorUnidades" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="period" tick={{ fontSize: 8, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 8, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl text-white max-w-xs text-left">
                            <p className="text-[9px] font-black uppercase text-indigo-400 mb-1">{data.period}</p>
                            <div className="flex justify-between items-center gap-4 text-xs font-black mb-2">
                              <span>Total: {data.unidades} u.</span>
                              <span className="text-emerald-400">{formatCLP(data.totalAmount)}</span>
                            </div>
                            {data.products && data.products.length > 0 ? (
                              <div className="space-y-1 border-t border-slate-800 pt-1.5">
                                <p className="text-[7px] font-black uppercase text-slate-400">Productos Vendidos ({data.products.length}):</p>
                                {data.products.slice(0, 5).map((p: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-[8px] text-slate-300">
                                    <span className="truncate pr-2">• {p.name}</span>
                                    <span className="font-bold shrink-0">{p.qty} u.</span>
                                  </div>
                                ))}
                                {data.products.length > 5 && (
                                  <p className="text-[7px] text-indigo-300 font-bold italic mt-1 bg-indigo-950/60 p-1 rounded border border-indigo-800/50">
                                    💡 Haz clic en la gráfica para ver los {data.products.length} productos abajo
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-[7px] text-slate-500 italic border-t border-slate-800 pt-1">Sin ventas en este periodo</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="unidades" name="Unidades Vendidas" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorUnidades)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PERIOD DETAIL BREAKDOWN CARD */}
          {activePeriodDetail && (
            <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/80 p-4 rounded-2xl text-left space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1.5">
                    📍 Desglose de Ventas: {activePeriodDetail.period}
                  </span>
                  <p className="text-[9px] font-bold text-slate-500 mt-0.5">
                    Total: <strong className="text-slate-900">{activePeriodDetail.unidades} u.</strong> ({formatCLP(activePeriodDetail.totalAmount)}) • <span className="text-indigo-600">{activePeriodDetail.products.length} ítems en total</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Search input inside period breakdown */}
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Buscar ítem..."
                      value={periodSearchTerm}
                      onChange={(e) => setPeriodSearchTerm(e.target.value)}
                      className="pl-7 pr-5 py-1 bg-white border border-slate-200 rounded-xl text-[9px] focus:ring-2 focus:ring-indigo-500 outline-none w-36 font-bold"
                    />
                    {periodSearchTerm && (
                      <button onClick={() => setPeriodSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                        <X size={10} />
                      </button>
                    )}
                  </div>

                  {activePeriodDetail.products.length > 0 && (
                    <button 
                      onClick={() => setIsPeriodModalOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                    >
                      <Maximize2 size={12} /> Ver Todos los Ítems ({activePeriodDetail.products.length})
                    </button>
                  )}
                </div>
              </div>

              {filteredPeriodProducts && filteredPeriodProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {filteredPeriodProducts.map((item: any, idx: number) => {
                    const pct = activePeriodDetail.unidades > 0 ? Math.round((item.qty / activePeriodDetail.unidades) * 100) : 0;
                    return (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex flex-col justify-between shadow-2xs hover:border-indigo-200 transition-colors">
                        <span className="text-[9px] font-bold text-slate-900 truncate" title={item.name}>
                          {item.name}
                        </span>
                        <div className="flex justify-between items-end mt-1.5">
                          <span className="text-[8px] font-bold text-slate-400">
                            {pct}% del periodo
                          </span>
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {item.qty} u. ({formatCLP(item.total)})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[8px] text-slate-400 italic">
                  {periodSearchTerm ? 'No se encontraron productos que coincidan con la búsqueda.' : 'No se registraron ventas en este periodo.'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* TOP ROTATION PRODUCTS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Ranking de Productos</h4>
                  <p className="text-[8px] font-bold uppercase text-slate-400 mt-0.5">Top comercializados del catálogo</p>
                </div>

                {/* Limit selector */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                  <button 
                    onClick={() => setTopRotationLimit(5)}
                    className={`px-2 py-0.5 text-[8px] font-black rounded ${topRotationLimit === 5 ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'}`}
                  >
                    Top 5
                  </button>
                  <button 
                    onClick={() => setTopRotationLimit(10)}
                    className={`px-2 py-0.5 text-[8px] font-black rounded ${topRotationLimit === 10 ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'}`}
                  >
                    Top 10
                  </button>
                  <button 
                    onClick={() => setTopRotationLimit(20)}
                    className={`px-2 py-0.5 text-[8px] font-black rounded ${topRotationLimit === 20 ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'}`}
                  >
                    Top 20
                  </button>
                </div>
              </div>

              {/* Criterion Selector: Unidades vs Monto CLP */}
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                <button 
                  onClick={() => setRankingCriteria('qty')}
                  className={`flex-1 py-1 text-[8px] font-black uppercase rounded-lg transition-all ${rankingCriteria === 'qty' ? 'bg-white text-indigo-600 shadow-2xs border border-indigo-100' : 'text-slate-500'}`}
                >
                  Por Vol. (Unidades)
                </button>
                <button 
                  onClick={() => setRankingCriteria('amount')}
                  className={`flex-1 py-1 text-[8px] font-black uppercase rounded-lg transition-all ${rankingCriteria === 'amount' ? 'bg-white text-emerald-600 shadow-2xs border border-emerald-100' : 'text-slate-500'}`}
                >
                  Por Recaudación ($)
                </button>
              </div>
            </div>
            
            {topRotationProducts.length > 0 ? (
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {topRotationProducts.map((p, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-indigo-50/40 transition-all">
                    <div className="flex items-center gap-2 overflow-hidden pr-2">
                      <span className={`w-5 h-5 rounded-lg text-[8px] font-black flex items-center justify-center shrink-0 ${index === 0 ? 'bg-amber-400 text-slate-900' : index === 1 ? 'bg-slate-300 text-slate-900' : index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        #{index + 1}
                      </span>
                      <span className="text-[9px] font-bold text-slate-800 truncate" title={p.fullName}>
                        {p.fullName}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[9px] font-black block leading-tight ${rankingCriteria === 'amount' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {rankingCriteria === 'amount' ? formatCLP(p.montoTotal) : `${p.unidades} u.`}
                      </span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase">
                        {rankingCriteria === 'amount' ? `${p.unidades} u. vendidas` : `Rotación: ${p.tasa}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <TrendingUp size={32} className="opacity-20 mb-2" />
                <p className="text-[9px] font-black uppercase tracking-widest">Sin datos de venta</p>
                <p className="text-[8px] text-slate-400 mt-1 text-center">Registra o aprueba presupuestos para visualizar rotación.</p>
              </div>
            )}
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-2xl flex items-center gap-2.5 mt-4">
            <Info size={14} className="text-indigo-600 shrink-0" />
            <p className="text-[8px] text-indigo-900 font-bold uppercase leading-relaxed text-left">
              Estrategia comercial: Mantener stock asegurado en los ítems Top #{topRotationLimit}.
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED PRODUCTS LIST TABLE */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        {/* FILTERS AND SEARCH */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Desglose de Inventario Físico</h3>
            <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Control exclusivo de productos con stock físico en bodega. (El catálogo sin stock permanece activo en el Cotizador).</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text"
                placeholder="Buscar por producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            
            {/* Category Filter Badges */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto gap-0.5">
              <button 
                onClick={() => setFilterType('in_stock')}
                className={`flex-1 sm:flex-initial px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${filterType === 'in_stock' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-slate-600'}`}
              >
                En Bodega (&gt;0)
              </button>
              <button 
                onClick={() => setFilterType('critical')}
                className={`flex-1 sm:flex-initial px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${filterType === 'critical' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
              >
                Crítico
              </button>
              <button 
                onClick={() => setFilterType('stagnant')}
                className={`flex-1 sm:flex-initial px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${filterType === 'stagnant' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}
              >
                Estancados
              </button>
              <button 
                onClick={() => setFilterType('healthy')}
                className={`flex-1 sm:flex-initial px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${filterType === 'healthy' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
              >
                Óptimo
              </button>
              <button 
                onClick={() => setFilterType('all')}
                className={`flex-1 sm:flex-initial px-2.5 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${filterType === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
              >
                Ver Catálogo Completo
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 rounded-tl-xl">Nombre del Producto</th>
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 text-center">Stock Bodega</th>
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 text-center">Lotes (Importación)</th>
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 text-center">Vendido (Ventas)</th>
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 text-center">Mermas</th>
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 text-center">Stock Disponible</th>
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 text-right">Costo Neto (WAC)</th>
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 text-right">Valor en Stock</th>
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 text-center">Rotación</th>
                <th className="p-4 text-[9px] uppercase font-bold text-slate-400 text-center rounded-tr-xl w-36">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-20 text-center text-slate-400">
                    <Package size={36} className="mx-auto opacity-10 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No se encontraron productos en stock</p>
                    <p className="text-[8px] text-slate-400 mt-1">Usa el botón "+ Registrar Producto y Stock" para comenzar.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const badgeInfo = getStockBadgeInfo(p.stock, p.wac);

                  return (
                    <tr 
                      key={p.normalized}
                      onClick={() => setSelectedProduct(p)}
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 text-xs font-bold text-slate-900">
                        <div>
                          <p className="group-hover:text-indigo-600 transition-colors">{p.name}</p>
                          {p.isStagnant && (
                            <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-rose-50 border border-rose-100 text-[7px] text-rose-600 rounded font-black uppercase tracking-widest">
                              <Clock size={8} /> Estancado (&gt;90d)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-700 text-center">
                        <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px]">
                          {p.initialStock || 0} u.
                        </span>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-600 text-center">{p.totalImported} u.</td>
                      <td className="p-4 text-xs font-bold text-emerald-600 text-center">
                        {p.totalSold > 0 ? `-${p.totalSold}` : '0'} u.
                      </td>
                      <td className="p-4 text-xs font-bold text-rose-600 text-center">
                        {p.totalShrinkage > 0 ? `-${p.totalShrinkage}` : '0'} u.
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border ${badgeInfo.class}`}>
                          {p.stock} u. ({badgeInfo.label})
                        </span>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-600 text-right">
                        {formatCLP(p.wac)}
                      </td>
                      <td className="p-4 text-xs font-black text-slate-900 text-right">
                        {formatCLP(Math.max(0, p.stock) * p.wac)}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${p.rotationRate >= 60 ? 'bg-emerald-500' : p.rotationRate >= 20 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                              style={{ width: `${Math.min(100, p.rotationRate)}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] font-black text-slate-700">{p.rotationRate}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={(e) => handleOpenEditStock(p, e)}
                            className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-[8px] font-black uppercase transition-all flex items-center gap-1"
                            title="Editar stock disponible"
                          >
                            <Edit3 size={12} /> Stock
                          </button>
                          <button 
                            onClick={() => setSelectedProduct(p)}
                            className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-800 hover:text-white rounded-lg text-[8px] font-black uppercase transition-all"
                            title="Ver detalles"
                          >
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDICIÓN DE STOCK */}
      <AnimatePresence>
        {editingStockProduct && (() => {
          const costoActual = editStockForm.unitCost || 0;
          const calcAuto = calcularPrecioAutomatico(costoActual);
          const precioVentaNetoAuto = Math.round(calcAuto.precioFinal / 1.19);

          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl border border-slate-100 text-left"
              >
                <button 
                  onClick={() => setEditingStockProduct(null)} 
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                    <Edit3 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase">Ajustar Stock de Bodega</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{editingStockProduct.name}</p>
                  </div>
                </div>

                <div className="space-y-4 my-6">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">
                      Stock Inicial / Físico en Bodega (Unidades)
                    </label>
                    <input 
                      type="number"
                      min="0"
                      value={editStockForm.initialStock}
                      onChange={(e) => setEditStockForm({ ...editStockForm, initialStock: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Ej: 50"
                    />
                    <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase">
                      Ventas automáticas restadas: -{editingStockProduct.totalSold} u. | Stock disponible resultante: {Math.max(0, editStockForm.initialStock + editingStockProduct.totalImported - editingStockProduct.totalSold - editingStockProduct.totalShrinkage)} u.
                    </p>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">
                      Costo Neto de Compra / Adquisición (CLP por unidad) *
                    </label>
                    <input 
                      type="text"
                      value={editStockForm.unitCost ? formatCLP(editStockForm.unitCost) : ''}
                      onChange={(e) => setEditStockForm({ ...editStockForm, unitCost: parseCLP(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Ej: $15.000"
                    />
                    <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase">
                      ✓ Se guarda en el catálogo como tu costo neto de compra al proveedor (utilizado por el Cotizador y la IA).
                    </p>
                  </div>

                  {costoActual > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl space-y-1">
                      <span className="text-[8px] font-black uppercase text-emerald-600 block">Proyección con Auto-Margen IA ({calcAuto.margenAplicado}%):</span>
                      <div className="flex justify-between items-center text-xs font-bold text-emerald-900">
                        <span>Precio Venta Neto Sugerido:</span>
                        <span>{formatCLP(precioVentaNetoAuto)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black text-emerald-700">
                        <span>Precio Final c/IVA (19%):</span>
                        <span>{formatCLP(calcAuto.precioFinal)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setEditingStockProduct(null)} 
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveStockEdit} 
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> Guardar Ajuste
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* MODAL PARA CREAR NUEVO PRODUCTO CON STOCK */}
      <AnimatePresence>
        {isAddModalOpen && (() => {
          const costoNuevo = newProductForm.unitCost || 0;
          const calcAutoNew = calcularPrecioAutomatico(costoNuevo);
          const precioVentaNetoNew = Math.round(calcAutoNew.precioFinal / 1.19);

          return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-lg p-6 relative overflow-hidden shadow-2xl border border-slate-100 text-left"
              >
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                    <PackagePlus size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase">Registrar Producto y Stock Inicial</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Agrega un producto directamente a tu inventario de bodega</p>
                  </div>
                </div>

                <div className="space-y-3.5 my-5">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">
                      Nombre del Producto *
                    </label>
                    <input 
                      type="text"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Ej: Cámara IP Dome 4MP 100% Cobre"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">
                        Código / ID (Opcional)
                      </label>
                      <input 
                        type="text"
                        value={newProductForm.id}
                        onChange={(e) => setNewProductForm({ ...newProductForm, id: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Ej: CAM-04MP"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">
                        Stock Inicial Bodega (Unidades)
                      </label>
                      <input 
                        type="number"
                        min="0"
                        value={newProductForm.initialStock}
                        onChange={(e) => setNewProductForm({ ...newProductForm, initialStock: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Ej: 20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">
                      Costo Neto Compra / Adquisición (CLP por unidad) *
                    </label>
                    <input 
                      type="text"
                      value={newProductForm.unitCost ? formatCLP(newProductForm.unitCost) : ''}
                      onChange={(e) => setNewProductForm({ ...newProductForm, unitCost: parseCLP(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Ej: $18.000"
                    />
                    <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase">
                      ✓ Se guardará en el catálogo como costo neto base para que el Cotizador y la IA apliquen el auto-margen e IVA.
                    </p>
                  </div>

                  {costoNuevo > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl space-y-1">
                      <span className="text-[8px] font-black uppercase text-emerald-600 block">Proyección con Auto-Margen IA ({calcAutoNew.margenAplicado}%):</span>
                      <div className="flex justify-between items-center text-xs font-bold text-emerald-900">
                        <span>Precio Venta Neto Sugerido:</span>
                        <span>{formatCLP(precioVentaNetoNew)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black text-emerald-700">
                        <span>Precio Final c/IVA (19%):</span>
                        <span>{formatCLP(calcAutoNew.precioFinal)}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">
                      Descripción / Especificación Técnica (Opcional)
                    </label>
                    <textarea 
                      value={newProductForm.description}
                      onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Descripción técnica del producto..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setIsAddModalOpen(false)} 
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveNewProduct} 
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Registrar Producto
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-4xl p-6 relative overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              {/* Modal Header */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pr-10 text-left">
                <div>
                  <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-[8px] font-black text-indigo-600 rounded uppercase tracking-wider">
                    Ficha de Análisis de Producto
                  </span>
                  <h3 className="text-lg font-black text-slate-900 uppercase mt-1 tracking-tight">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                    Costo WAC: {formatCLP(selectedProduct.wac)} • Precio Catálogo: {formatCLP(selectedProduct.latestSalePrice)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center min-w-[70px]">
                    <span className="text-[7px] font-black uppercase text-slate-400 block mb-0.5">Stock Disponible</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${selectedProduct.stock <= 5 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {selectedProduct.stock} u.
                    </span>
                  </div>
                  
                  <button 
                    onClick={(e) => handleOpenEditStock(selectedProduct, e)}
                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border border-indigo-100"
                  >
                    <Edit3 size={12} /> Editar Stock
                  </button>
                </div>
              </div>

              {/* Modal Tabs Navigation */}
              <div className="flex border-b border-slate-100 mb-6 bg-slate-50 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveModalTab('chart')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeModalTab === 'chart' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <TrendingUp size={12} /> Estacionalidad
                </button>
                <button 
                  onClick={() => setActiveModalTab('imports')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeModalTab === 'imports' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <ShoppingBag size={12} /> Lotes Importados ({selectedProduct.importsHistory.length})
                </button>
                <button 
                  onClick={() => setActiveModalTab('sales')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeModalTab === 'sales' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <FileText size={12} /> Ventas Aprobadas ({selectedProduct.salesHistory.length})
                </button>
                <button 
                  onClick={() => setActiveModalTab('shrinkages')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeModalTab === 'shrinkages' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <Trash2 size={12} /> Mermas ({selectedProduct.shrinkageHistory.length})
                </button>
              </div>

              {/* Tab Content Box */}
              <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[450px] pr-2">
                <AnimatePresence mode="wait">
                  {activeModalTab === 'chart' && (
                    <motion.div 
                      key="tab-chart"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="text-left">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Volumen de Venta Mensual (Último Año)</h4>
                        <p className="text-[8px] font-bold text-slate-400 mt-0.5">Monitorea los picos estacionales de demanda y la velocidad de salida de este producto.</p>
                      </div>

                      {selectedProduct.totalSold > 0 ? (
                        <div className="h-64 w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productMonthlyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="month" tick={{ fontSize: 8, fontWeight: 700 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 8, fontWeight: 700 }} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '9px' }} />
                              <Bar dataKey="unidades" name="Unidades Vendidas" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed text-slate-400">
                          <TrendingUp size={36} className="opacity-10 mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Sin Ventas Registradas</p>
                          <p className="text-[8px] text-slate-400 mt-1">Este producto aún no tiene movimientos de venta aprobados en cotizaciones.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeModalTab === 'imports' && (
                    <motion.div 
                      key="tab-imports"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-[9px] uppercase font-bold text-slate-400">
                              <th className="p-3">Lote de Importación</th>
                              <th className="p-3">Fecha de Ingreso</th>
                              <th className="p-3 text-center">Cant. Importada</th>
                              <th className="p-3 text-right">Costo Unitario</th>
                              <th className="p-3 text-right">Precio Venta Lote</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProduct.importsHistory.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-400 text-xs font-bold uppercase">Sin ingresos registrados en importaciones</td>
                              </tr>
                            ) : (
                              selectedProduct.importsHistory.map((h: any, i: number) => (
                                <tr key={i} className="border-b border-slate-50 text-xs text-slate-600">
                                  <td className="p-3 font-bold text-slate-900">{h.batchName}</td>
                                  <td className="p-3">{h.date instanceof Timestamp ? h.date.toDate().toLocaleDateString() : (h.date?.toDate ? h.date.toDate().toLocaleDateString() : new Date(h.date).toLocaleDateString())}</td>
                                  <td className="p-3 text-center font-bold">{h.qty} u.</td>
                                  <td className="p-3 text-right text-rose-600 font-bold">{formatCLP(h.unitCost)}</td>
                                  <td className="p-3 text-right text-emerald-600 font-bold">{formatCLP(h.salePrice)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeModalTab === 'sales' && (
                    <motion.div 
                      key="tab-sales"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-[9px] uppercase font-bold text-slate-400">
                              <th className="p-3">Cliente / Proyecto</th>
                              <th className="p-3">Fecha de Venta</th>
                              <th className="p-3 text-center">Cant. Vendida</th>
                              <th className="p-3 text-right">Precio de Venta</th>
                              <th className="p-3 text-right">Total Neto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProduct.salesHistory.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-400 text-xs font-bold uppercase">Sin salidas por ventas aprobadas</td>
                              </tr>
                            ) : (
                              selectedProduct.salesHistory.map((h: any, i: number) => (
                                <tr key={i} className="border-b border-slate-50 text-xs text-slate-600">
                                  <td className="p-3 font-bold text-slate-900">{h.clientName}</td>
                                  <td className="p-3">{h.date instanceof Timestamp ? h.date.toDate().toLocaleDateString() : (h.date?.toDate ? h.date.toDate().toLocaleDateString() : new Date(h.date).toLocaleDateString())}</td>
                                  <td className="p-3 text-center font-bold text-emerald-600">+{h.qty} u.</td>
                                  <td className="p-3 text-right font-bold">{formatCLP(h.salePrice)}</td>
                                  <td className="p-3 text-right font-black text-slate-900">{formatCLP(h.qty * h.salePrice)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeModalTab === 'shrinkages' && (
                    <motion.div 
                      key="tab-shrinkages"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-[9px] uppercase font-bold text-slate-400">
                              <th className="p-3">Motivo Baja</th>
                              <th className="p-3">Fecha Merma</th>
                              <th className="p-3 text-center">Cant. Perdida</th>
                              <th className="p-3 text-right">Costo U. Baja</th>
                              <th className="p-3">Descripción / Observación</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProduct.shrinkageHistory.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-400 text-xs font-bold uppercase">Sin pérdidas registradas para este producto</td>
                              </tr>
                            ) : (
                              selectedProduct.shrinkageHistory.map((h: any, i: number) => (
                                <tr key={i} className="border-b border-slate-50 text-xs text-slate-600">
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-[8px] font-black uppercase text-rose-600 rounded">
                                      {h.reason === 'malo' ? 'Dañado' : h.reason === 'vencido' ? 'Vencido' : h.reason === 'devuelto' ? 'Devolución' : 'Otro'}
                                    </span>
                                  </td>
                                  <td className="p-3">{h.date instanceof Timestamp ? h.date.toDate().toLocaleDateString() : (h.date?.toDate ? h.date.toDate().toLocaleDateString() : new Date(h.date).toLocaleDateString())}</td>
                                  <td className="p-3 text-center font-bold text-rose-600">-{h.qty} u.</td>
                                  <td className="p-3 text-right font-bold">{formatCLP(h.unitCost)}</td>
                                  <td className="p-3 italic text-[10px] text-slate-500">{h.desc || 'Sin detalles'}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                  <AlertCircle size={12} className="text-slate-400" />
                  Stock Disponible = Stock Bodega + Importaciones - Ventas Aprobadas - Mermas.
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PERIOD FULL PRODUCTS MODAL */}
      <AnimatePresence>
        {isPeriodModalOpen && activePeriodDetail && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-3xl p-6 relative overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] text-left"
            >
              <button 
                onClick={() => setIsPeriodModalOpen(false)} 
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
              >
                <X size={16} />
              </button>

              <div className="mb-4">
                <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-[8px] font-black text-indigo-600 rounded-full uppercase tracking-wider">
                  Reporte Completo de Ítems Vendidos
                </span>
                <h3 className="text-base font-black text-slate-900 uppercase mt-1">
                  Desglose de Ventas: {activePeriodDetail.period}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                  Listado completo de todos los productos comercializados en este periodo
                </p>
              </div>

              {/* KPI Summary strip */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Total Unidades</span>
                  <span className="text-base font-black text-indigo-600">{activePeriodDetail.unidades} u.</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Monto Recaudado</span>
                  <span className="text-base font-black text-emerald-600">{formatCLP(activePeriodDetail.totalAmount)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Variedad de Productos</span>
                  <span className="text-base font-black text-slate-900">{activePeriodDetail.products.length} productos</span>
                </div>
              </div>

              {/* Modal Search */}
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar producto por nombre..."
                  value={periodSearchTerm}
                  onChange={(e) => setPeriodSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
              </div>

              {/* Products Table */}
              <div className="flex-1 overflow-y-auto pr-1">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[9px] font-bold text-slate-400 uppercase">
                      <th className="p-3">#</th>
                      <th className="p-3">Nombre del Producto</th>
                      <th className="p-3 text-center">Unidades Vendidas</th>
                      <th className="p-3 text-right">Precio Prom. Unitario</th>
                      <th className="p-3 text-right">Monto Total</th>
                      <th className="p-3 text-center">% Periodo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPeriodProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400 text-xs font-bold uppercase">
                          No se encontraron productos
                        </td>
                      </tr>
                    ) : (
                      filteredPeriodProducts.map((item: any, idx: number) => {
                        const avgPrice = item.qty > 0 ? Math.round(item.total / item.qty) : 0;
                        const pct = activePeriodDetail.unidades > 0 ? Math.round((item.qty / activePeriodDetail.unidades) * 100) : 0;
                        return (
                          <tr key={idx} className="border-b border-slate-50 text-xs hover:bg-slate-50/80 transition-colors">
                            <td className="p-3 font-bold text-slate-400">#{idx + 1}</td>
                            <td className="p-3 font-black text-slate-800">{item.name}</td>
                            <td className="p-3 text-center font-black text-indigo-600 bg-indigo-50/50 rounded-lg">{item.qty} u.</td>
                            <td className="p-3 text-right text-slate-600 font-bold">{formatCLP(avgPrice)}</td>
                            <td className="p-3 text-right font-black text-emerald-600">{formatCLP(item.total)}</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold">
                                {pct}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase">
                  Mostrando {filteredPeriodProducts.length} de {activePeriodDetail.products.length} productos
                </span>
                <button 
                  onClick={() => setIsPeriodModalOpen(false)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
