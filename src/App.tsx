/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Toaster, toast } from 'sonner';
import React, { useState, useMemo, useEffect, useRef, MouseEvent, ChangeEvent, useDeferredValue, lazy, Suspense } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { read, utils } from 'xlsx';
import { 
  Plus, 
  PlusCircle,
  Pencil,
  Edit3,
  Check,
  X,
  ArrowDownToLine,
  ShieldAlert,
  Trash2, 
  TrendingUp,
  FileText, 
  Send, 
  Copy,
  Download, 
  Sparkles, 
  User, 
  Users,
  Briefcase, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Printer,
  ChevronRight,
  Loader2,
  Save,
  LogIn,
  LogOut,
  Share2,
  Eye,
  History,
  ReceiptText,
  Calculator,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PenTool,
  PenLine,
  Settings,
  ShieldCheck,
  Zap,
  Package,
  BarChart4,
  Target,
  MessageSquare,
  LayoutDashboard,
  Image as ImageIcon,
  Upload, 
  Paperclip,
  FileDown,
  AlertTriangle,
  Search,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Layout,
  Banknote,
  MinusCircle,
  TrendingDown,
  Bot,
  RefreshCw,
  Lock,
  Crown,
  Activity,
  Award
} from 'lucide-react';
import { AdminDashboard } from './components/modules/AdminDashboard';
import { PromotersModule, DEFAULT_PROMOTERS } from './components/PromotersModule';
import { SpeechModal } from './components/SpeechModal';


const ProUpgradeModal = ({ onClose, onUpgrade, userEmail }: { onClose: () => void, onUpgrade: () => void, userEmail: string }) => {
  const MERCADO_PAGO_LINK = "https://mpago.la/2KxV5Gz"; // REEMPLAZAR CON TU LINK DE PAGO REAL DE MERCADO PAGO CHILE
  const ADMIN_WHATSAPP = "56991834960"; // REEMPLAZAR CON TU NÚMERO DE WHATSAPP REAL (Ej: 56912345678)
  
  const handlePay = () => {
    window.location.href = MERCADO_PAGO_LINK;
  };

  const handleConfirmWhatsApp = () => {
    const text = encodeURIComponent(`¡Hola! Quiero activar mi suscripción Premium de MI CRM PRO. ¿Me podrías enviar los datos de transferencia para proceder? Mi correo registrado es: ${userEmail}. ¡Gracias!`);
    window.location.href = `https://wa.me/${ADMIN_WHATSAPP}?text=${text}`;
  };

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative overflow-hidden shadow-2xl border border-slate-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
          <X size={16} />
        </button>
        
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-sm border border-indigo-200">
          <Crown size={32} className="text-indigo-600 fill-indigo-200" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight relative z-10">Mejora al Plan Pro</h2>
        <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed relative z-10">
          Obtén cotizaciones y clientes ilimitados, catálogo avanzado, importación con IA y control financiero completo (EBITDA, Caja, IVA).
        </p>

        <div className="bg-indigo-50/50 rounded-2xl p-4 mb-6 border border-indigo-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Suscripción Mensual</span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase rounded">Chile</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">$14.990</span>
            <span className="text-slate-500 text-xs font-medium">/ mes</span>
          </div>
        </div>
        
        <div className="space-y-3 relative z-10">
          <button 
            onClick={handlePay}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-200 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <CreditCard size={18} /> Pagar con Mercado Pago
          </button>
          
          <button 
            onClick={handleConfirmWhatsApp}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-100 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} /> Transferencia Bancaria / WhatsApp
          </button>

          <p className="text-[10px] text-slate-400 text-center font-medium mt-4">
            Al coordinar por WhatsApp, el administrador te enviará los datos y activará tu cuenta de inmediato.
          </p>

          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pagos 100% Seguros</span>
            <div className="flex items-center justify-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] font-black italic tracking-wider text-[#1A1F71] bg-white px-1.5 py-0.5 rounded border border-slate-100">VISA</span>
              <div className="flex -space-x-1.5 items-center bg-white px-1 py-1 rounded border border-slate-100">
                <div className="w-3 h-3 rounded-full bg-[#EB001B]" />
                <div className="w-3 h-3 rounded-full bg-[#F79E1B]" />
              </div>
              <span className="text-[9px] font-black tracking-tighter text-white bg-[#E21F26] px-1.5 py-0.5 rounded">webpay</span>
              <span className="text-[9px] font-black tracking-tighter text-[#009EE3] bg-white px-1.5 py-0.5 rounded border border-slate-100">mercado pago</span>
            </div>
          </div>

          {isLocalhost && (
            <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
              <button 
                onClick={() => {
                  onUpgrade();
                  onClose();
                }}
                className="text-xs text-indigo-500 hover:underline font-bold"
              >
                [Desarrollo] Simular Activación Instantánea (Gratis)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { auth, db } from './lib/firebase';
import { ExpenseForm } from './components/ExpenseForm';
import { useProfile } from './contexts/ProfileContext';
import { useCatalog, DEFAULT_CATALOG } from './contexts/CatalogContext';
import { useQuote } from './contexts/QuoteContext';
import { BudgetItem, ClientInfo, QuoteStatus, QuoteItem, Expense, CashTransaction, CreditLine, CatalogItem, ClientAccount, Shrinkage, PurchaseRecord, ImportBatch } from './types';
import { removeUndefined, getSafeImageUrl, openPdfInNewTab, handleFirestoreError, OperationType, generateContentWithRetry, formatCLP, parseCLP } from './lib/utils';
import { getTaxBreakdown, calcularPrecioAutomatico } from './logic/taxLogic';
import jsPDF from 'jspdf';

const GraficosVentas = lazy(() => import('./components/GraficosVentas'));
import Dashboard from './components/Dashboard';
const ProductGallery = lazy(() => import('./components/ProductGallery').then(m => ({ default: m.ProductGallery })));
const FinancialSummary = lazy(() => import('./components/FinancialSummary').then(m => ({ default: m.FinancialSummary })));

const CatalogModule = lazy(() => import('./components/modules/CatalogModule').then(m => ({ default: m.CatalogModule })));
const CashFlowModule = lazy(() => import('./components/modules/CashFlowModule').then(m => ({ default: m.CashFlowModule })));
const CRMModule = lazy(() => import('./components/modules/CRMModule').then(m => ({ default: m.CRMModule })));
const FinancesModule = lazy(() => import('./components/modules/FinancesModule').then(m => ({ default: m.FinancesModule })));
const ImportsModule = lazy(() => import('./components/modules/ImportsModule').then(m => ({ default: m.ImportsModule })));
const PurchasesModule = lazy(() => import('./components/modules/PurchasesModule').then(m => ({ default: m.PurchasesModule })));
const CreditsModule = lazy(() => import('./components/modules/CreditsModule').then(m => ({ default: m.CreditsModule })));
const MermasModule = lazy(() => import('./components/modules/MermasModule').then(m => ({ default: m.MermasModule })));
const StockModule = lazy(() => import('./components/modules/StockModule').then(m => ({ default: m.StockModule })));
import { CatalogImporter } from './components/modules/CatalogImporter';
import { LandingPage } from './components/LandingPage';

import html2canvas from 'html2canvas';
import SignatureCanvas from 'react-signature-canvas';
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  serverTimestamp, 
  Timestamp,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  increment,
  updateDoc
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';








export default function App() {
  // Authentication
  const [user, loadingAuth] = useAuthState(auth);
  
  const isMaster = useMemo(() => {
    return user?.email === 'iafacilchile@gmail.com';
  }, [user]);
  const { userProfile, setUserProfile, isSavingProfile, showProfileSettings, setShowProfileSettings, saveProfile, upgradeToPro } = useProfile();
  const { catalog, catalogFilteredItems, catalogSearchTerm, setCatalogSearchTerm, catalogEstrellas, setCatalog, resetCatalog } = useCatalog();
  const [showCatalogImporter, setShowCatalogImporter] = useState(false);

  const handleSaveImportedProducts = async (extractedProducts: any[]) => {
    const newItems = extractedProducts.map((p, idx) => {
      return {
        id: `import-item-${Date.now()}-${idx}`,
        name: p.name,
        description: p.description,
        unitPrice: p.unitPrice,
        images: [],
        pdfUrl: ''
      };
    });

    setCatalog(prev => [...newItems, ...prev]);
    setShowCatalogImporter(false);

    if (user) {
      const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
      try {
        for (const item of newItems) {
          const dataToSave = {
            id: item.id,
            name: String(item.name || 'Producto').substring(0, 199),
            description: item.description || '',
            unitPrice: Number(item.unitPrice) || 0,
            images: [],
            pdfUrl: '',
            ownerId: effectiveUid,
            createdAt: serverTimestamp()
          };
          await setDoc(doc(db, "catalog", item.id), dataToSave);
        }
        toast.success(`${newItems.length} productos importados correctamente`);
      } catch (e) {
        console.error("Error saving imported products:", e);
        toast.error("Error al guardar en la base de datos");
      }
    }
  };
  const { 
    items, setItems, 
    clientInfo, setClientInfo, 
    status, setStatus, 
    total, setTotal, 
    discount, setDiscount, 
    isSavingQuote, saveQuote, 
    loadQuote: loadQuoteFromContext, isLoadingQuote, setIsLoadingQuote
  } = useQuote();
  const [hasQuoteInUrl, setHasQuoteInUrl] = useState(false);
  const [loadedSenderInfo, setLoadedSenderInfo] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isQuoteNotFound, setIsQuoteNotFound] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [previousQuotes, setPreviousQuotes] = useState<QuoteItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'dashboard'>('editor');
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'draft' | 'sent' | 'sent_unconfirmed' | 'approved' | 'paid'>('all');
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  // status removed from local state, now using QuoteContext
  const [quoteOwnerId, setQuoteOwnerId] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [unidadesDisponibles, setUnidadesDisponibles] = useState<number | undefined>(undefined);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const sigPad = useRef<SignatureCanvas | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [newCatalogItem, setNewCatalogItem] = useState<{
    id: string;
    name: string;
    price: string;
    desc: string;
    pdfUrl: string;
    enBodega: boolean;
    modalidad: 'stock' | 'venta_calzada' | 'agotado';
    tiempoEntrega: string;
    precioVentaFinal: string;
  }>({
    id: '',
    name: '',
    price: '',
    desc: '',
    pdfUrl: '',
    enBodega: false,
    modalidad: 'stock',
    tiempoEntrega: '',
    precioVentaFinal: ''
  });
  const [showCatalogPicker, setShowCatalogPicker] = useState(false);
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
  const [editCatalogData, setEditCatalogData] = useState<Partial<CatalogItem>>({});

  const [activeTab, setActiveTabOriginal] = useState<'proposal' | 'dashboard' | 'catalog' | 'crm' | 'finances' | 'credits' | 'cashflow' | 'mermas' | 'purchases' | 'admin' | 'stock'>(() => {
    const saved = localStorage.getItem('activeTab');
    const validTabs = ['proposal', 'dashboard', 'catalog', 'crm', 'finances', 'credits', 'cashflow', 'mermas', 'purchases', 'admin', 'stock'];
    // Migrate old 'imports' tab to 'purchases'
    if (saved === 'imports') return 'purchases';
    return (saved && validTabs.includes(saved)) ? (saved as any) : 'dashboard';
  });

  const [showProModal, setShowProModal] = useState(false);

  useEffect(() => {
    if (user && localStorage.getItem('pendingUpgrade') === 'true') {
      setShowProModal(true);
      localStorage.removeItem('pendingUpgrade');
    }
  }, [user]);

  const hasPremiumAccess = useMemo(() => {
    if (isMaster) return true;
    if (userProfile.isPro) return true;
    if (userProfile.trialEndsAt && Date.now() < userProfile.trialEndsAt) return true;
    return false;
  }, [isMaster, userProfile.isPro, userProfile.trialEndsAt]);

  const setActiveTab = (tab: any) => {
    const lockedTabs = ['finances', 'credits', 'cashflow', 'mermas', 'purchases', 'stock'];
    if (lockedTabs.includes(tab) && !hasPremiumAccess) {
      setShowProModal(true);
      return;
    }
    localStorage.setItem('activeTab', tab);
    setActiveTabOriginal(tab);
  };
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [purchaseRecords, setPurchaseRecords] = useState<PurchaseRecord[]>([]);
  const [creditLines, setCreditLines] = useState<CreditLine[]>([]);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([]);
  const [shrinkages, setShrinkages] = useState<Shrinkage[]>([]);
  const [importBatches, setImportBatches] = useState<ImportBatch[]>([]);
  const [isSavingExpense, setIsSavingExpense] = useState(false);
  const [isSavingCredit, setIsSavingCredit] = useState(false);
  const [isSavingCash, setIsSavingCash] = useState(false);
  const [isSavingShrinkage, setIsSavingShrinkage] = useState(false);
  const [isSavingImport, setIsSavingImport] = useState(false);
  const [isSavingPurchase, setIsSavingPurchase] = useState(false);
  const [editingPurchaseId, setEditingPurchaseId] = useState<string | null>(null);
  const [purchaseSearchTerm, setPurchaseSearchTerm] = useState('');
  const deferredPurchaseSearchTerm = useDeferredValue(purchaseSearchTerm);
  
  const [newPurchase, setNewPurchase] = useState<{
    provider: string;
    documentNumber: string;
    netAmount: number;
    ivaAmount: number;
    totalAmount: number;
    category: 'mercaderia' | 'insumos' | 'servicios' | 'activos' | 'otros';
    description: string;
    isPaid: boolean;
    paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta' | 'credito' | 'cheque';
  }>({
    provider: '',
    documentNumber: '',
    netAmount: 0,
    ivaAmount: 0,
    totalAmount: 0,
    category: 'mercaderia',
    description: '',
    isPaid: true,
    paymentMethod: 'transferencia'
  });
  const [cashSearchTerm, setCashSearchTerm] = useState('');
  const deferredCashSearchTerm = useDeferredValue(cashSearchTerm);
  
  const [newCashTransaction, setNewCashTransaction] = useState({
    concept: '',
    type: 'in' as 'in' | 'out',
    amount: 0
  });

  const [newCredit, setNewCredit] = useState({
    institution: '',
    totalLimit: 0,
    usedAmount: 0,
    cutoffDay: 1,
    paymentDay: 10
  });
  const [activeAbonoCreditId, setActiveAbonoCreditId] = useState<string | null>(null);
  const [abonoAmount, setAbonoAmount] = useState<number>(0);
  const [newShrinkage, setNewShrinkage] = useState({
    productName: '',
    quantity: 1,
    unitCost: 0,
    reason: 'malo' as const,
    description: ''
  });

  const [newImport, setNewImport] = useState({
    name: '',
    totalInvestment: 0,
    totalExpenses: 0,
    notes: '',
    items: [] as any[]
  });

  const [importRawText, setImportRawText] = useState('');
  const [isAiImporting, setIsAiImporting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [isAiUploadingPurchase, setIsAiUploadingPurchase] = useState(false);

  const handleImportSII = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    setIsSaving(true);

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const text = evt.target?.result as string;
          const lines = text.split('\n');
          let importCount = 0;
          let duplicateCount = 0;

          const effectiveUid = localStorage.getItem('impersonatedUserId') || user?.uid;
          if (!effectiveUid) {
            alert('Usuario no autenticado');
            setIsSaving(false);
            return;
          }

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const cols = line.split(';');
            if (cols.length < 10) continue;
            
            const folio = cols[0];
            const total = parseInt(cols[4], 10);
            const dateStr = cols[9];
            
            if (isNaN(total)) continue;

            const conceptStr = `Boleta SII Nro Folio: ${folio}`;

            const isDuplicate = previousQuotes.some(q => q.clientName === conceptStr);
            if (isDuplicate) {
              duplicateCount++;
              continue;
            }

            const parts = dateStr.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10);
              const year = parseInt(parts[2], 10);
              const txDate = new Date(year, month - 1, day, 12, 0, 0);

              const subtotalNeto = Math.round(total / 1.19);
              const iva = total - subtotalNeto;

              await addDoc(collection(db, "presupuestos"), {
                clientName: conceptStr,
                clientInfo: {
                  name: "Boleta SII",
                  company: "Venta Menor SII",
                  email: "",
                  phone: "",
                  date: new Date().toISOString(),
                  requirements: "Importación desde Reporte de Ventas SII"
                },
                status: 'paid',
                totalBruto: total,
                totalProposal: total,
                subtotalNeto: subtotalNeto,
                iva: iva,
                quoteRefId: `SII-${folio}`,
                createdAt: Timestamp.fromDate(txDate),
                updatedAt: Timestamp.fromDate(txDate),
                items: [{
                  id: `sii-item-${folio}`,
                  name: "Ventas Varias SII",
                  description: `Resumen de ventas boleta folio ${folio}`,
                  quantity: 1,
                  unitPrice: subtotalNeto,
                  discount: 0,
                  margin: 0
                }],
                ownerId: effectiveUid
              });
              importCount++;
            }
          }

          if (importCount > 0) {
            await fetchQuoteHistory(); // Refrescar UI automáticamente
          }

          alert(`Importación completada: ${importCount} ingresos agregados. Se omitieron ${duplicateCount} boletas duplicadas.`);
        } catch (err) {
          console.error("Error parseando CSV SII:", err);
          alert("Error al procesar el archivo CSV.");
        } finally {
          setIsSaving(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.error(err);
      alert("Error leyendo el archivo.");
      setIsSaving(false);
    }
  };

  const handlePurchaseFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset target value
    e.target.value = '';

    setIsAiUploadingPurchase(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert("Falta configurar la API Key de Gemini en las variables de entorno.");
        setIsAiUploadingPurchase(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });

      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const ab = evt.target?.result;
            const wb = read(ab, { type: 'array' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = utils.sheet_to_json(ws);
            
            const response = await generateContentWithRetry(ai, {
              contents: `Eres un asistente experto en contabilidad chilena. Tu tarea es extraer de este extracto de Excel la información de una compra o gasto nacional para rellenar un formulario.
              
              EXTRACTO DE DATOS (JSON):
              ${JSON.stringify(data.slice(0, 100))}
              
              REGLAS DE EXTRACCIÓN:
              1. Identifica el Proveedor o Comercio (ej. "Sodimac", "PC Factory", "Copec"). Si es un listado de múltiples facturas del SII, escoge el emisor de la primera factura relevante o resume.
              2. Identifica el Monto Neto total (netAmount) de la compra (valor numérico sin decimales). Si el archivo del SII muestra Netos, súmalos.
              3. Identifica el Número de Factura o Folio como "documentNumber" (si existe).
              4. Clasifica el gasto en una de estas categorías: "insumos", "herramientas", "publicidad", "servicios", "otros".
              5. Responde ÚNICAMENTE con el objeto JSON: { provider, netAmount, documentNumber, category }. No uses markdown, explicaciones ni textos adicionales.`,
              config: {
                responseMimeType: "application/json",
                temperature: 0.1,
              }
            });

            const result = JSON.parse(response.text);
            const net = Number(result.netAmount) || 0;
            const iva = Math.round(net * 0.19);
            const total = net + iva;

            setNewPurchase(prev => ({
              ...prev,
              provider: result.provider || 'Proveedor desde Excel',
              netAmount: net,
              ivaAmount: iva,
              totalAmount: total,
              documentNumber: result.documentNumber || '',
              category: (['insumos', 'herramientas', 'publicidad', 'servicios', 'otros'].includes(result.category) ? result.category : 'insumos') as any
            }));
            alert("Excel/CSV procesado. Se han cargado los datos en el formulario (IVA del 19% calculado automáticamente).");
          } catch (err) {
            console.error(err);
            alert("Error al parsear el Excel con IA.");
          } finally {
            setIsAiUploadingPurchase(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const base64Data = (evt.target?.result as string).split(',')[1];
            
            const response = await generateContentWithRetry(ai, {
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        data: base64Data,
                        mimeType: file.type
                      }
                    },
                    { text: `Analiza esta boleta o factura de compra chilena.
                    Identifica:
                    - El nombre del Proveedor o Emisor ("provider")
                    - El monto neto ("netAmount") de la compra (si solo sale el total, calcula el neto dividiendo el total por 1.19 y redondeando)
                    - El número de folio o documento ("documentNumber")
                    - Clasifica la compra en una de estas categorías ("category"): "insumos", "herramientas", "publicidad", "servicios", "otros".
                    
                    Responde ÚNICAMENTE con el objeto JSON: { provider, netAmount, documentNumber, category } sin explicaciones.` }
                  ]
                }
              ],
              config: {
                responseMimeType: "application/json",
                temperature: 0.1,
              }
            });

            const result = JSON.parse(response.text);
            const net = Number(result.netAmount) || 0;
            const iva = Math.round(net * 0.19);
            const total = net + iva;

            setNewPurchase(prev => ({
              ...prev,
              provider: result.provider || 'Proveedor desde Documento',
              netAmount: net,
              ivaAmount: iva,
              totalAmount: total,
              documentNumber: result.documentNumber || '',
              category: (['insumos', 'herramientas', 'publicidad', 'servicios', 'otros'].includes(result.category) ? result.category : 'insumos') as any
            }));
            alert("Documento procesado. Se han cargado los datos en el formulario (IVA del 19% calculado automáticamente).");
          } catch (err) {
            console.error(err);
            alert("Error al analizar el documento con IA.");
          } finally {
            setIsAiUploadingPurchase(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("Formato de archivo no soportado.");
        setIsAiUploadingPurchase(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error procesando el archivo.");
      setIsAiUploadingPurchase(false);
    }
  };
  
  const [crmRawText, setCrmRawText] = useState('');
  const [isCrmAiImporting, setIsCrmAiImporting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset target value to allow uploading the same file or re-triggering the event
    e.target.value = '';

    setIsAiImporting(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert("Falta configurar la API Key de Gemini en las variables de entorno (VITE_GEMINI_API_KEY).");
        setIsAiImporting(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });

      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          const ab = evt.target?.result;
          const wb = read(ab, { type: 'array' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = utils.sheet_to_json(ws);
          
          const response = await generateContentWithRetry(ai, {
            contents: `Eres un asistente experto en contabilidad y control financiero de empresas en Chile. Tu tarea es extraer y estructurar los datos del siguiente extracto de archivo Excel o CSV (que puede provenir del SII - Servicio de Impuestos Internos de Chile) y devolverlos en formato JSON válido.
            
            EXTRACTO DE DATOS (JSON):
            ${JSON.stringify(data.slice(0, 100))}
            
            REGLAS DE INTERPRETACIÓN PARA EL SII DE CHILE Y EXCEL GENERAL:
            1. Si el extracto es un listado de Facturas/Compras del SII (columnas como RUT Emisor, Razón Social, Folio, Monto Neto, IVA, Total):
               - "name": Genera un nombre descriptivo (ej. "Registro Compras SII - [Fecha o Mes]").
               - "totalInvestment": Suma total de los montos netos de las facturas.
               - "totalExpenses": Suma total de los montos de IVA u otros cargos logísticos si los hay.
               - "notes": Un resumen del lote (ej. "Lote con X facturas procesadas desde el Registro del SII").
               - "items": Un arreglo de cada factura procesada, donde:
                 * "product": "[Razón Social] - Folio [Folio]"
                 * "quantity": 1
                 * "unitCost": Monto Neto de esa factura.
                 * "salePrice": Monto Total de esa factura.
            
            2. Si el extracto es un detalle de productos/insumos importados o comprados (columnas como Cantidad, Descripción, Precio Unitario, Total):
               - "name": Genera un nombre descriptivo basado en los artículos.
               - "totalInvestment": La suma total de (cantidad * costo_unitario).
               - "totalExpenses": Gastos de flete, aduana o IVA indicados.
               - "items": Arreglo de objetos: { product, quantity, unitCost, salePrice }. Si no hay precio de venta (salePrice), calcúlalo sumándole un margen estimado del 30% al costo unitario.
            
            3. No inventes números. Si un valor no está claro o no existe, usa 0.
            4. Responde ÚNICAMENTE con el objeto JSON estructurado con las llaves: { name, totalInvestment, totalExpenses, notes, items }, sin textos explicativos ni markdown extras (debe ser JSON parseable directamente).`,
            config: {
              responseMimeType: "application/json",
              temperature: 0.1,
            }
          });

          const result = JSON.parse(response.text);
          setNewImport({
            name: result.name || file.name,
            totalInvestment: result.totalInvestment || 0,
            totalExpenses: result.totalExpenses || 0,
            notes: result.notes || '',
            items: result.items || []
          });
          alert("Archivo Excel/CSV procesado y datos cargados exitosamente.");
          setIsAiImporting(false);
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (evt) => {
          const base64Data = (evt.target?.result as string).split(',')[1];
          
          try {
            const result = await generateContentWithRetry(ai, {
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        data: base64Data,
                        mimeType: file.type
                      }
                    },
                    { text: "Analiza este documento de importación. Identifica: el nombre del lote, la inversión total en productos, los gastos operativos (envío/aduana), y el listado de cada artículo con cantidad, costo unitario y precio de venta. Responde SOLO con el objeto JSON { name, totalInvestment, totalExpenses, notes, items: [] }." }
                  ]
                }
              ],
              config: {
                responseMimeType: "application/json",
                temperature: 0.1,
              }
            });

            const text = result.text;
            const data = JSON.parse(text);
            
            setNewImport({
              name: data.name || 'Importación desde Archivo',
              totalInvestment: data.totalInvestment || 0,
              totalExpenses: data.totalExpenses || 0,
              notes: data.notes || '',
              items: data.items || []
            });
            alert("Archivo procesado con éxito.");
          } catch (err) {
            console.error(err);
            alert("Error al analizar el contenido con IA. Prueba con un archivo más legible.");
          } finally {
            setIsAiImporting(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("Formato no soportado.");
        setIsAiImporting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error procesando el archivo.");
      setIsAiImporting(false);
    }
  };

  const loadHistoricalFromImages = async () => {
    if (!user) return;
    setIsSeeding(true);
    try {
      const historicalBatches = [
        { id: 'hist-aliexpress-jan26', name: 'Importación AliExpress (Enero 2026)', totalInvestment: 689375, totalExpenses: 131061, notes: 'Lote de TVBoxes TANIX y Relojes Invicta.' },
        { id: 'hist-amazon-jan26', name: 'Importación Amazon (Enero 2026)', totalInvestment: 102291, totalExpenses: 34097, notes: 'Relojes Invicta y Pendrives.' },
        { id: 'hist-feria-jan26', name: 'Operación Feria / Local', totalInvestment: 230500, totalExpenses: 0, notes: 'Zapatillas Nike y Ropa Feria.' },
        { id: 'hist-veg-feb26', name: 'Lote Vegetales (Febrero 2026)', totalInvestment: 88000, totalExpenses: 14900, notes: 'Choclos (1000u), Zapallo y Morrones.' }
      ];

      const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
      for (const batch of historicalBatches) {
        const { id, ...data } = batch;
        await setDoc(doc(db, "importaciones", id), {
          ...data,
          ownerId: effectiveUid,
          date: serverTimestamp(),
          items: []
        }, { merge: true });
      }
      alert("Datos vinculados correctamente. No se generarán duplicados si presionas de nuevo.");
    } catch (err) {
      console.error(err);
      alert("Error al cargar datos históricos.");
    } finally {
      setIsSeeding(false);
    }
  };
  
  // Expenses Listener
  useEffect(() => {
    // Only subscribe if user is present and active tab requires expenses
    const relevantTabs = ['dashboard', 'finances', 'purchases'];
    if (!user || !relevantTabs.includes(activeTab)) {
      return;
    }

    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;

    const q = query(
      collection(db, "expenses"),
      where("ownerId", "==", effectiveUid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedExpenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      setExpenses(fetchedExpenses);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "expenses");
    });

    return () => unsubscribe();
  }, [user, activeTab]);

  // Credit Lines Listener
  useEffect(() => {
    // Only subscribe if user is present and active tab requires creditLines
    const relevantTabs = ['dashboard', 'credits', 'finances'];
    if (!user || !relevantTabs.includes(activeTab)) {
      return;
    }

    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;

    const q = query(
      collection(db, "creditLines"),
      where("ownerId", "==", effectiveUid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CreditLine[];
      setCreditLines(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "creditLines");
    });

    return () => unsubscribe();
  }, [user, activeTab]);

  // Cash Transactions Listener
  useEffect(() => {
    // Only subscribe if user is present and active tab requires cashTransactions
    const relevantTabs = ['dashboard', 'cashflow', 'finances'];
    if (!user || !relevantTabs.includes(activeTab)) {
      return;
    }

    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;

    const q = query(
      collection(db, "cashTransactions"),
      where("ownerId", "==", effectiveUid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CashTransaction[];
      setCashTransactions(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "cashTransactions");
    });

    return () => unsubscribe();
  }, [user, activeTab]);

  const filteredCashTransactions = useMemo(() => {
    return cashTransactions.filter(t => 
      (t.concept || '').toLowerCase().includes((deferredCashSearchTerm || '').toLowerCase())
    );
  }, [cashTransactions, deferredCashSearchTerm]);
  
  // Shrinkages (Mermas) Listener
  useEffect(() => {
    // Only subscribe if user is present and active tab requires shrinkages
    const relevantTabs = ['dashboard', 'mermas'];
    if (!user || !relevantTabs.includes(activeTab)) {
      return;
    }

    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;

    const q = query(
      collection(db, "mermas"),
      where("ownerId", "==", effectiveUid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Shrinkage[];
      setShrinkages(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "mermas");
    });

    return () => unsubscribe();
  }, [user, activeTab]);

  // Import Batches Listener
  useEffect(() => {
    // Only subscribe if user is present and active tab requires importBatches
    const relevantTabs = ['dashboard', 'purchases', 'stock', 'catalog', 'finances'];
    if (!user || !relevantTabs.includes(activeTab)) {
      return;
    }

    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;

    const q = query(
      collection(db, "importaciones"),
      where("ownerId", "==", effectiveUid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ImportBatch[];
      setImportBatches(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "importaciones");
    });

    return () => unsubscribe();
  }, [user, activeTab]);

  // Purchases Listener
  useEffect(() => {
    // Only subscribe if user is present and active tab requires purchases
    const relevantTabs = ['dashboard', 'purchases', 'finances'];
    if (!user || !relevantTabs.includes(activeTab)) {
      return;
    }

    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;

    const q = query(
      collection(db, "purchases"),
      where("ownerId", "==", effectiveUid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PurchaseRecord[];
      setPurchaseRecords(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "purchases");
    });

    return () => unsubscribe();
  }, [user, activeTab]);


  const filteredPurchases = useMemo(() => {
    if (!deferredPurchaseSearchTerm) return purchaseRecords;
    const term = deferredPurchaseSearchTerm.toLowerCase();
    return purchaseRecords.filter(p => 
      (p.provider || '').toLowerCase().includes(term) || 
      (p.documentNumber || '').toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term)
    );
  }, [purchaseRecords, deferredPurchaseSearchTerm]);

  const [clients, setClients] = useState<ClientAccount[]>([]);
  const [isFetchingClients, setIsFetchingClients] = useState(false);
  const [isSavingClient, setIsSavingClient] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editingCreditId, setEditingCreditId] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    rut: '',
    phone: '',
    email: '',
    address: '',
    terrainNotes: ''
  });
  const [profile, setProfile] = useState<'security'>('security');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const deferredClientSearchTerm = useDeferredValue(clientSearchTerm);
  const [showUpselling, setShowUpselling] = useState(false);

  const filteredClients = useMemo(() => {
    if (!deferredClientSearchTerm) return clients;
    const term = deferredClientSearchTerm.toLowerCase();
    return clients.filter(c => 
      (c.name || '').toLowerCase().includes(term) || 
      (c.rut && c.rut.toLowerCase().includes(term)) ||
      (c.company && c.company.toLowerCase().includes(term))
    );
  }, [clients, deferredClientSearchTerm]);

  const appMode = 'security';
  const [showClientPreview, setShowClientPreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [hasBeenSaved, setHasBeenSaved] = useState(false);

  // Initialize Gemini AI
  const getAiClient = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  };

  // states removed, now using QuoteContext
  const [margin, setMargin] = useState<number>(20);
  const [quoteRefId, setQuoteRefId] = useState(() => Math.random().toString(36).toUpperCase().substr(2, 6));

  // Load quote from URL if present

  // Load quote from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('quoteId')?.toUpperCase(); // Asegurar mayúsculas
    if (id) {
      setHasQuoteInUrl(true);
      const isPreview = params.get('preview') === 'true';
      if (isPreview) setShowClientPreview(true);
      
      console.log("Intentando cargar presupuesto:", id);
      loadQuote(id);
      
      // Atomic increment for views - separate from main load to not block
      const updateViews = async () => {
        try {
          const docRef = doc(db, "presupuestos", id);
          // Usar updateDoc en lugar de setDoc para invitados para ser más "limpios"
          // y no intentar crear documentos si no existen (lo cual requiere permisos de create)
          await updateDoc(docRef, removeUndefined({ 
            vistas: increment(1),
            updatedAt: serverTimestamp() // Ayuda a mantener consistencia
          }));
        } catch (e) {
          console.warn("No se pudo incrementar contador de visitas (normal para documentos nuevos o permisos limitados):", e);
        }
      };
      
      // Ejecutar una vez cargado el usuario
      if (auth.currentUser) updateViews();
    } else {
      resetToDefault();
    }
  }, [user]);

  // Clean up if needed, but not with hardcoded IDs permanently in code.
  // The cleanup was requested to be removed.
  useEffect(() => {
    // Cleanup logic can be added here if needed to run based on queries, not hardcoded strings.
  }, [user]);

  // Handle redirect login explicitly for mobile browsers
  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect login error:", error);
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchQuoteHistory();
    } else {
      setPreviousQuotes([]);
    }
  }, [user]);

  const resetToDefault = () => {
    setItems([]);
    setClientInfo({
      name: '',
      company: '',
      email: '',
      phone: '',
      date: new Date().toISOString().split('T')[0],
      requirements: '',
      customerRequirements: '',
      projectConditions: ''
    });
    setQuoteRefId(Math.random().toString(36).toUpperCase().substr(2, 6));
    setStatus('sent');
    setQuoteOwnerId(auth.currentUser?.uid || null);
    setDiscount(0);
    setUnidadesDisponibles(undefined);
    setHasBeenSaved(false);
    // Clear URL
    const url = window.location.origin + window.location.pathname;
    window.history.pushState({ path: url }, '', url);
  };
  
  const [fiscalMode, setFiscalMode] = useState<'iva' | 'efectivo'>('iva');
  const [costIsGross, setCostIsGross] = useState(false);

  const fetchQuoteHistory = async () => {
    if (!auth.currentUser) return;
    setIsFetchingHistory(true);
    setPreviousQuotes([]); // Evitar duplicados visuales antes de cargar
    try {
      const effectiveUid = localStorage.getItem('impersonatedUserId') || auth.currentUser.uid;
      const q = query(
        collection(db, "presupuestos"), 
        where("ownerId", "==", effectiveUid),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      const uniqueQuotesMap = new Map();
      const seenClientNames = new Set();
      const duplicatesToDelete: string[] = [];
      const currentCompanyDocs: any[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const refId = data.id || doc.id;
        
        // Simplemente agregamos todos los presupuestos que pertenezcan al usuario
        // Usamos el ID del documento como llave para evitar colisiones accidentales
        uniqueQuotesMap.set(doc.id, {
          id: doc.id,
          clientInfo: data.clientInfo,
          items: data.items,
          quoteRefId: data.id || doc.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date()),
          status: data.status || 'draft',
          totalProposal: data.totalProposal || data.totalBruto || 0,
          clientName: data.clientName || data.clientInfo?.company || 'Cliente',
          totalBruto: Math.round(data.totalBruto || 0),
          totalCost: Math.round(data.totalCost || 0),
          totalMargin: Math.round(data.totalMargin || 0),
          taxType: data.taxType || data.fiscalMode || 'iva',
          iva: data.iva || 0,
          profile: data.profile || 'security',
          retencion: data.retencion || 0,
          signature: data.signature || null,
          discount: Math.round(data.discount || 0),
          visto: data.visto || false,
          fechaVista: data.fechaVista || null,
          vistas: data.vistas || 0
        });
      });
      
      setPreviousQuotes(Array.from(uniqueQuotesMap.values()) as QuoteItem[]);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "presupuestos");
    } finally {
      setIsFetchingHistory(false);
    }
  };

// Line 917 to 935: removed duplicated calcularPrecioAutomatico

  const loadQuote = async (id: string) => {
    if (!id) return;
    setIsLoadingQuote(true);
    setHasBeenSaved(true); 
    try {
      const docRef = doc(db, "presupuestos", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsQuoteNotFound(false);
        setItems(data.items || []);

        const rawDate = data.clientInfo?.date || data.date;
        const safeDateString = typeof rawDate === 'string' ? rawDate : 
          (rawDate?.toDate && typeof rawDate.toDate === 'function' ? rawDate.toDate().toLocaleDateString() : 
          (rawDate?.seconds ? new Date(rawDate.seconds * 1000).toLocaleDateString() : 
          (rawDate instanceof Date ? rawDate.toLocaleDateString() : new Date().toLocaleDateString())));

        setClientInfo({
          ...data.clientInfo,
          date: safeDateString,
          requirements: data.requirements || data.clientInfo?.requirements || '',
          customerRequirements: data.clientInfo?.customerRequirements || '',
          projectConditions: data.clientInfo?.projectConditions || data.requirements || data.clientInfo?.requirements || ''
        });
        setQuoteRefId(id);
        setStatus(data.status || 'sent');
        setQuoteOwnerId(data.ownerId || null);
        setFiscalMode(data.fiscalMode || 'iva');
        
        // Utilizar la función importada de taxLogic
        const finalProfile = data.profile || 'standard';
        setProfile(finalProfile);
        setSignature(data.signature || null);
        setDiscount(data.discount || 0);
        setAiAnalysis(data.aiAnalysis || null);
        setUnidadesDisponibles(data.unidadesDisponibles);
        setLoadedSenderInfo(data.senderInfo || null);

        // Tracking: Mark as viewed if opened by someone other than owner
        if (!data.visto && data.ownerId && data.ownerId !== auth.currentUser?.uid) {
           updateDoc(docRef, {
             visto: true,
             fechaVista: serverTimestamp()
           }).catch(e => console.warn("No se pudo marcar como visto:", e));
        }
      } else {
        console.error("Documento no encontrado ID:", id);
        setIsQuoteNotFound(true);
      }
    } catch (error) {
      console.error("Error al cargar presupuesto:", error);
      toast.error("Hubo un problema al conectar con el servidor. Por favor intenta recargar la página.");
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const saveQuoteToFirebase = async (silent = false): Promise<boolean> => {
    if (!user) {
      if (isLoggingIn) return false;
      try {
        setIsLoggingIn(true);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        setIsLoggingIn(false);
        return false;
      } catch (err: any) {
        setIsLoggingIn(false);
        if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
          return false;
        }
        console.error("Login failed:", err);
        alert("Para compartir, primero debes iniciar sesión.");
        return false;
      }
    }

    // Check freemium limits
    const isNewQuote = !previousQuotes.some(q => q.id === quoteRefId || q.quoteRefId === quoteRefId);
    if (isNewQuote && !hasPremiumAccess && previousQuotes.length >= 10) {
      setShowProModal(true);
      toast.error("Límite de cotizaciones alcanzado (máx 10 cotizaciones en Plan Gratuito). ¡Mejora a Pro para cotizar sin límites!");
      return false;
    }

    setIsSaving(true);
    setSaveStatus('saving');
    try {
      const sanitizedItems = items.map(item => ({
        ...item,
        imageUrl: item.imageUrl || null
      }));

      let finalProjectConditions = clientInfo.projectConditions || clientInfo.requirements || '';
      
      const docData = {
        id: quoteRefId || '',
        items: sanitizedItems,
        clientInfo: {
          ...clientInfo,
          customerRequirements: clientInfo.customerRequirements || '',
          projectConditions: finalProjectConditions
        },
        senderInfo: userProfile, // Guardar la info de quien envía
        requirements: finalProjectConditions,
        ownerId: localStorage.getItem('impersonatedUserId') || user?.uid || auth.currentUser?.uid || '',
        updatedAt: serverTimestamp(),
        createdAt: hasQuoteInUrl ? undefined : serverTimestamp(),
        status: status,
        totalProposal: totalProposal,
        iva: iva || 0,
        clientName: clientInfo.company || clientInfo.name || 'Cliente sin nombre',
        totalBruto: totalProposal,
        totalCost: totalCost || 0,
        totalMargin: totalMargin || 0,
        fiscalMode: fiscalMode || 'iva',
        taxType: fiscalMode,
        retencion: 0,
        profile: profile || 'security',
        signature: signature || null,
        discount: discount || 0,
        aiAnalysis: aiAnalysis || null,
        unidadesDisponibles: unidadesDisponibles || null 
      };

      // Optimization message for user
      if (isOptimizing) {
        throw new Error("Optimizando imagen para envío rápido... por favor espera un segundo y vuelve a intentar.");
      }

      const docRef = doc(db, "presupuestos", quoteRefId);
      await setDoc(docRef, removeUndefined(docData), { merge: true });
      
      setHasBeenSaved(true);
      setSaveStatus('saved');
      fetchQuoteHistory();
      
      const newUrl = `${window.location.origin}${window.location.pathname}?quoteId=${quoteRefId}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
      
      if (!silent) {
        alert("¡Presupuesto guardado exitosamente!");
      }
      return true;
    } catch (error) {
      setSaveStatus('error');
      const errMessage = error instanceof Error ? error.message : String(error);
      alert("Hubo un error al guardar: " + errMessage);
      console.error("Save error:", error);
      return false;
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const copyShareLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?quoteId=${quoteRefId}`;
    
    if (isOwner) {
      try {
        await saveQuoteToFirebase(true);
      } catch (e) {
        console.error("Error saving before copy", e);
      }
    }

    try {
      // Intentar copiar al portapapeles
      await navigator.clipboard.writeText(url);
      alert("¡Enlace copiado! Ya puedes enviarlo.");
    } catch (err) {
      console.error("Clipboard failed:", err);
      // Abrir el modal de compartir como fallback seguro
      setShowShareModal(true);
    }
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error signing in:", error);
      alert("Error al iniciar sesión: " + error.code + " - " + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('impersonatedUserId');
    signOut(auth);
    setPreviousQuotes([]);
    setClients([]);
    setShowHistory(false);
  };

  const fetchClients = async () => {
    if (!auth.currentUser) return;
    setIsFetchingClients(true);
    const effectiveUid = localStorage.getItem('impersonatedUserId') || auth.currentUser.uid;
    const impersonated = !!localStorage.getItem('impersonatedUserId');
    try {
      let q;
      if (isMaster && !impersonated) {
        // Master users can see all clients only if they are not impersonating anyone
        q = query(
          collection(db, "clientes"),
          orderBy("createdAt", "desc")
        );
      } else {
        q = query(
          collection(db, "clientes"),
          where("ownerId", "==", effectiveUid),
          orderBy("createdAt", "desc")
        );
      }
      const querySnapshot = await getDocs(q);
      const clientsData: ClientAccount[] = [];
      querySnapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...(doc.data() as any) } as ClientAccount);
      });
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsFetchingClients(false);
    }
  };

  const saveClient = async () => {
    if (!auth.currentUser || !newClient.name || !newClient.rut) return;
    
    // Check freemium limits
    if (!editingClientId && !hasPremiumAccess && clients.length >= 10) {
      setShowProModal(true);
      toast.error("Límite de clientes alcanzado (máx 10 clientes en Plan Gratuito). ¡Mejora a Pro para registrar más clientes!");
      return;
    }

    setIsSavingClient(true);
    try {
      const clientId = editingClientId || `client-${Date.now()}`;
      const effectiveUid = localStorage.getItem('impersonatedUserId') || auth.currentUser.uid;
      const clientData = {
        ...newClient,
        id: clientId,
        ownerId: effectiveUid,
        updatedAt: serverTimestamp(),
        createdAt: editingClientId ? (clients.find(c => c.id === editingClientId)?.createdAt || serverTimestamp()) : serverTimestamp()
      };
      await setDoc(doc(db, "clientes", clientId), removeUndefined(clientData), { merge: true });
      setNewClient({
        name: '',
        company: '',
        rut: '',
        phone: '',
        email: '',
        address: '',
        terrainNotes: ''
      });
      setEditingClientId(null);
      fetchClients();
      alert(editingClientId ? "Información de cliente actualizada." : "Cliente guardado exitosamente.");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "clientes");
    } finally {
      setIsSavingClient(false);
    }
  };

  const startEditClient = (client: any) => {
    setEditingClientId(client.id);
    setNewClient({
      name: client.name || '',
      company: client.company || '',
      rut: client.rut || '',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      terrainNotes: client.terrainNotes || ''
    });
    const addClientSection = document.getElementById('add-client-form');
    addClientSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const deleteClient = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Iniciando eliminación de cliente:", id);
    if (!id) {
      alert("Error: El cliente no tiene un ID válido.");
      return;
    }

    try {
      await deleteDoc(doc(db, "clientes", id));
      setClients(prev => prev.filter(c => c.id !== id));
      alert("Cliente eliminado con éxito.");
      console.log("Cliente eliminado satisfactoriamente de Firestore.");
    } catch (error) {
      console.error("Error crítico al eliminar cliente:", error);
      alert("No se pudo eliminar el cliente. Revisa tus permisos.");
      try {
        handleFirestoreError(error, OperationType.DELETE, `clientes/${id}`);
      } catch (e) {
        // Error already logged
      }
    }
  };

  const saveExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!user || !expenseData.name || expenseData.amount <= 0) return;
    setIsSavingExpense(true);
    try {
      const expenseId = `expense-${Date.now()}`;
      const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
      const docData = {
        ...expenseData,
        ownerId: effectiveUid,
        date: serverTimestamp()
      };
      await setDoc(doc(db, "expenses", expenseId), removeUndefined(docData));
      alert("Gasto registrado exitosamente.");
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, "expenses");
    } finally {
      setIsSavingExpense(false);
    }
  };

  const savePurchase = async () => {
    if (!user || !newPurchase.provider || newPurchase.netAmount <= 0) return;
    setIsSavingPurchase(true);
    try {
      const purchaseId = editingPurchaseId || `purchase-${Date.now()}`;
      const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
      const net = newPurchase.netAmount || 0;
      const iva = Math.round(net * 0.19);
      const total = net + iva;
      const existingPurchase = editingPurchaseId ? purchaseRecords.find(p => p.id === editingPurchaseId) : null;
      const purchaseData = {
        ...newPurchase,
        id: purchaseId,
        ownerId: effectiveUid,
        date: existingPurchase?.date || serverTimestamp(),
        updatedAt: serverTimestamp(),
        netAmount: net,
        ivaAmount: iva,
        totalAmount: total,
        documentNumber: newPurchase.documentNumber || `REQ-${Date.now()}`
      };
      await setDoc(doc(db, "purchases", purchaseId), removeUndefined(purchaseData), { merge: true });

      // Auto-sincronizar compra en efectivo con la Caja si es pagada en efectivo
      if (newPurchase.isPaid !== false && newPurchase.paymentMethod === 'efectivo') {
        const cashTransactionId = `cash-purchase-${purchaseId}`;
        await setDoc(doc(db, "cashTransactions", cashTransactionId), {
          id: cashTransactionId,
          concept: `COMPRA EFECTIVO: ${newPurchase.provider.toUpperCase()}`,
          type: 'out',
          amount: total,
          date: serverTimestamp(),
          ownerId: effectiveUid
        }, { merge: true });
      }

      setNewPurchase({
        provider: '',
        documentNumber: '',
        netAmount: 0,
        ivaAmount: 0,
        totalAmount: 0,
        category: 'insumos' as const,
        description: '',
        isPaid: true,
        paymentMethod: 'transferencia' as const
      });
      setEditingPurchaseId(null);
      alert(editingPurchaseId ? "Compra actualizada exitosamente." : "Compra registrada exitosamente.");
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, "purchases");
    } finally {
      setIsSavingPurchase(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.DELETE, `expenses/${id}`);
    }
  };

  const startEditCredit = (credit: any) => {
    setEditingCreditId(credit.id);
    setNewCredit({
      institution: credit.institution,
      totalLimit: credit.totalLimit,
      usedAmount: credit.usedAmount,
      cutoffDay: credit.cutoffDay,
      paymentDay: credit.paymentDay
    });
    // Scroll to form (assuming it has an id or we can use a ref, but usually scrolling to the top of the section is enough)
    const section = document.getElementById('credit-form-section');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveCredit = async () => {
    if (!user || !newCredit.institution || newCredit.totalLimit <= 0) return;
    setIsSavingCredit(true);
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
    try {
      const creditId = editingCreditId || `credit-${Date.now()}`;
      await setDoc(doc(db, "creditLines", creditId), removeUndefined({
        ...newCredit,
        id: creditId,
        ownerId: effectiveUid,
        updatedAt: serverTimestamp()
      }), { merge: true });
      
      setNewCredit({
        institution: '',
        totalLimit: 0,
        usedAmount: 0,
        cutoffDay: 1,
        paymentDay: 10
      });
      setEditingCreditId(null);
      alert(editingCreditId ? "Línea de crédito actualizada." : "Línea de crédito registrada.");
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, "creditLines");
    } finally {
      setIsSavingCredit(false);
    }
  };

  const handleRegisterAbono = async (credit: any) => {
    if (!user || abonoAmount <= 0) return;
    if (abonoAmount > credit.usedAmount) {
      alert("El monto de abono no puede superar la deuda actual.");
      return;
    }
    
    setIsSavingCredit(true);
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
    try {
      const newUsedAmount = Math.max(0, credit.usedAmount - abonoAmount);
      await setDoc(doc(db, "creditLines", credit.id), {
        usedAmount: newUsedAmount,
        updatedAt: serverTimestamp()
      }, { merge: true });

      const transactionId = `cash-${Date.now()}`;
      await setDoc(doc(db, "cashTransactions", transactionId), {
        id: transactionId,
        concept: `PAGO CRÉDITO: ${credit.institution.toUpperCase()}`,
        type: 'out',
        amount: abonoAmount,
        date: serverTimestamp(),
        ownerId: effectiveUid
      });

      setActiveAbonoCreditId(null);
      setAbonoAmount(0);
      alert(`Abono de $${abonoAmount.toLocaleString()} registrado y restado de la caja.`);
    } catch (err) {
      console.error(err);
      alert("Error al registrar el abono.");
    } finally {
      setIsSavingCredit(false);
    }
  };

  const deleteCredit = async (id: string) => {
    try {
      await deleteDoc(doc(db, "creditLines", id));
      alert("Línea de crédito eliminada.");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la línea de crédito.");
    }
  };

  const addPurchase = async () => {
    if (!user) return;
    setIsSavingPurchase(true);
    try {
      const net = newPurchase.netAmount || 0;
      const iva = Math.round(net * 0.19);
      const total = net + iva;
      const purchaseDataToSave = {
        ...newPurchase,
        netAmount: net,
        ivaAmount: iva,
        totalAmount: total
      };

      if (editingPurchaseId) {
        await updateDoc(doc(db, "purchases", editingPurchaseId), removeUndefined({
          ...purchaseDataToSave,
          updatedAt: serverTimestamp()
        }));
        setEditingPurchaseId(null);
      } else {
        const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
        const docRef = doc(collection(db, "purchases"));
        await setDoc(docRef, removeUndefined({
          ...purchaseDataToSave,
          ownerId: effectiveUid,
          date: serverTimestamp()
        }));
      }
      
      setNewPurchase({
        provider: '',
        documentNumber: '',
        netAmount: 0,
        ivaAmount: 0,
        totalAmount: 0,
        category: 'mercaderia',
        description: '',
        isPaid: true,
        paymentMethod: 'transferencia'
      });
      console.log("Purchase operation completed successfully");
    } catch (err) {
      console.error("Error saving purchase:", err);
      handleFirestoreError(err, editingPurchaseId ? OperationType.UPDATE : OperationType.CREATE, "purchases");
    } finally {
      setIsSavingPurchase(false);
    }
  };

  const editPurchase = (purchase: PurchaseRecord | null) => {
    if (!purchase) {
      setEditingPurchaseId(null);
      setNewPurchase({
        provider: '',
        documentNumber: '',
        netAmount: 0,
        ivaAmount: 0,
        totalAmount: 0,
        category: 'insumos' as any,
        description: '',
        isPaid: true,
        paymentMethod: 'transferencia' as const
      });
      return;
    }
    setEditingPurchaseId(purchase.id);
    setNewPurchase({
      provider: purchase.provider || '',
      documentNumber: purchase.documentNumber || '',
      netAmount: purchase.netAmount || 0,
      ivaAmount: purchase.ivaAmount || 0,
      totalAmount: purchase.totalAmount || 0,
      category: (purchase.category as any) || 'insumos',
      description: purchase.description || '',
      isPaid: purchase.isPaid ?? true,
      paymentMethod: (purchase.paymentMethod as any) || 'transferencia'
    });
  };

  const deletePurchase = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro de compra?")) return;
    try {
      await deleteDoc(doc(db, "purchases", id));
      if (editingPurchaseId === id) {
        setEditingPurchaseId(null);
        setNewPurchase({
          provider: '',
          documentNumber: '',
          netAmount: 0,
          ivaAmount: 0,
          totalAmount: 0,
          category: 'mercaderia',
          description: '',
          isPaid: true,
          paymentMethod: 'transferencia'
        });
      }
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.DELETE, "purchases");
    }
  };

  const togglePurchasePaid = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "purchases", id), {
        isPaid: !currentStatus,
        updatedAt: serverTimestamp()
      });
      toast.success(!currentStatus ? "Compra marcada como Pagada ✓" : "Compra marcada como Pendiente");
    } catch (err) {
      console.error("Error toggling purchase status:", err);
      handleFirestoreError(err, OperationType.UPDATE, `purchases/${id}`);
    }
  };

  const saveShrinkage = async () => {
    if (!user || !newShrinkage.productName || newShrinkage.quantity <= 0) return;
    setIsSavingShrinkage(true);
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
    try {
      const shrinkageId = `merma-${Date.now()}`;
      await setDoc(doc(db, "mermas", shrinkageId), removeUndefined({
        ...newShrinkage,
        ownerId: effectiveUid,
        date: serverTimestamp()
      }));
      setNewShrinkage({
        productName: '',
        quantity: 1,
        unitCost: 0,
        reason: 'malo',
        description: ''
      });
      alert("Registro de merma/devolución guardado.");
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, "mermas");
    } finally {
      setIsSavingShrinkage(false);
    }
  };

  const deleteShrinkage = async (id: string) => {
    try {
      await deleteDoc(doc(db, "mermas", id));
    } catch (err) {
      console.error(err);
    }
  };

  const saveImport = async () => {
    if (!user || !newImport.name || newImport.totalInvestment < 0) return;
    setIsSavingImport(true);
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
    try {
      const importId = `import-${Date.now()}`;
      
      const inv = newImport.totalInvestment || 0;
      const qty = newImport.quantity || 1;
      const hasCert = newImport.hasCertificateOfOrigin || false;
      const hasIva = newImport.hasIvaF29 !== false;
      const arancel = hasCert ? 0 : Math.round(inv * 0.06);
      const iva = hasIva ? Math.round(inv * 0.19) : 0;
      const totalLogistics = (newImport.totalExpenses || 0) + arancel;
      const netTotalLote = inv + totalLogistics;
      const netUnitCost = Math.round(netTotalLote / qty);
      const status = newImport.status || 'en_transito';

      const batchData = {
        ...newImport,
        quantity: qty,
        hasCertificateOfOrigin: hasCert,
        hasIvaF29: hasIva,
        arancelAmount: arancel,
        ivaAmount: iva,
        netUnitCost: netUnitCost,
        status: status,
        ownerId: effectiveUid,
        date: serverTimestamp()
      };

      await setDoc(doc(db, "importaciones", importId), removeUndefined(batchData));

      // Auto-sync product in catalog
      const slugId = newImport.name.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const existingInCatalog = catalog.find(c => c.id === slugId);
      
      const catalogItemData = {
        id: slugId,
        name: newImport.name,
        description: `Lote de Importación: ${newImport.name} (${qty} unid. ${status === 'en_bodega' ? 'en bodega' : 'en tránsito'})`,
        unitPrice: existingInCatalog?.unitPrice || Math.round(netUnitCost * 2.5),
        unitCost: netUnitCost,
        initialStock: qty,
        deliveryType: status === 'en_bodega' ? 'bodega' : 'import_7d',
        ownerId: effectiveUid,
        createdAt: serverTimestamp(),
        images: existingInCatalog?.images || []
      };

      await setDoc(doc(db, "catalog", slugId), removeUndefined(catalogItemData), { merge: true });

      setNewImport({
        name: '',
        totalInvestment: 0,
        totalExpenses: 0,
        quantity: 1,
        hasCertificateOfOrigin: false,
        hasIvaF29: true,
        status: 'en_transito',
        notes: '',
        items: []
      });
      alert("Importación registrada correctamente. Producto sincronizado con Catálogo, Stock y Finanzas.");
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, "importaciones");
    } finally {
      setIsSavingImport(false);
    }
  };

  const deleteImport = async (id: string) => {
    try {
      await deleteDoc(doc(db, "importaciones", id));
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.DELETE, "importaciones/" + id);
    }
  };

  const processImportWithAI = async () => {
    if (!importRawText.trim()) return;
    setIsAiImporting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await generateContentWithRetry(ai, {
        contents: `Eres un experto en extracción de datos comerciales. Analiza el siguiente texto y conviértelo en el formato JSON especificado.
        
        TEXTO A ANALIZAR:
        ${importRawText}
        
        INSTRUCCIONES DE FORMATO:
        Devuelve un objeto JSON con:
        - "name": Nombre del lote.
        - "totalInvestment": Monto total pagado por los productos.
        - "totalExpenses": Gastos de importación/envío.
        - "notes": Resumen breve.
        - "items": Arreglo de { product, quantity, unitCost, salePrice }.
        
        REGLA DE ORO: Si no hay información suficiente para un campo numérico, usa 0. Responde SOLO con el JSON.`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });

      const result = JSON.parse(response.text);
      setNewImport({
        name: result.name || '',
        totalInvestment: result.totalInvestment || 0,
        totalExpenses: result.totalExpenses || 0,
        notes: result.notes || '',
        items: result.items || []
      });
      setImportRawText('');
      alert("Análisis completado. Por favor revisa los datos cargados en el formulario y dale a 'Registrar'.");
    } catch (err) {
      console.error(err);
      alert("Error al procesar con IA. Intenta pegar el texto más claro.");
    } finally {
      setIsAiImporting(false);
    }
  };

  const processCrmTextWithAI = async () => {
    if (!crmRawText.trim()) return;
    setIsCrmAiImporting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await generateContentWithRetry(ai, {
        contents: `Eres un extractor de datos comerciales experto. Analiza el siguiente texto (que puede ser información copiada de Google Maps, una firma de correo, un mensaje de WhatsApp o texto libre) y extrae la información de contacto para guardarla en una base de datos CRM.
        
        TEXTO A ANALIZAR:
        ${crmRawText}
        
        INSTRUCCIONES DE FORMATO:
        Devuelve un objeto JSON con las siguientes claves:
        - "name": Nombre completo del contacto/persona responsable (si no lo hay en el texto, pon un nombre genérico o el nombre de la empresa).
        - "company": Nombre de la empresa o negocio.
        - "rut": RUT o identificación fiscal del cliente en Chile. Si no aparece, genera/infiere un RUT chileno de ejemplo válido con su dígito verificador (por ejemplo, entre 10.000.000 y 25.000.000, ej: "76.452.918-K" o similar), ya que el campo RUT es estrictamente obligatorio en el CRM.
        - "phone": Número de teléfono o celular (con formato chileno ej: "+56 9 ...").
        - "email": Correo electrónico.
        - "address": Dirección completa.
        - "terrainNotes": Notas breves del terreno o especialidad del negocio que identifiques en el texto.
        
        REGLA DE ORO: Responde SOLO con el objeto JSON estructurado. No incluyas explicaciones ni bloques de código markdown.`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });

      const result = JSON.parse(response.text);
      setNewClient({
        name: result.name || result.company || 'Contacto Nuevo',
        company: result.company || '',
        rut: result.rut || '76.123.456-K', // Safe Chilean RUT fallback
        phone: result.phone || '',
        email: result.email || '',
        address: result.address || '',
        terrainNotes: result.terrainNotes || ''
      });
      setCrmRawText('');
      alert("¡Importación exitosa! Revisa los datos en el formulario de abajo y haz clic en 'Guardar en CRM'.");
    } catch (err) {
      console.error("Error al importar con IA:", err);
      alert("Error al procesar con IA. Intenta pegar el texto más claro.");
    } finally {
      setIsCrmAiImporting(false);
    }
  };

  const saveCashTransaction = async () => {
    if (!user || !newCashTransaction.concept || newCashTransaction.amount <= 0) return;
    setIsSavingCash(true);
    const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
    try {
      const transactionId = (newCashTransaction as any).id || `cash-${Date.now()}`;
      await setDoc(doc(db, "cashTransactions", transactionId), removeUndefined({
        ...newCashTransaction,
        ownerId: effectiveUid,
        date: (newCashTransaction as any).date || serverTimestamp()
      }), { merge: true });
      
      setNewCashTransaction({
        concept: '',
        type: 'in',
        amount: 0
      });
      alert((newCashTransaction as any).id ? "Movimiento actualizado" : "Movimiento registrado");
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, "cashTransactions");
    } finally {
      setIsSavingCash(false);
    }
  };

  const deleteCashTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cashTransactions", id));
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.DELETE, "cashTransactions/" + id);
    }
  };

  const startEditCashTransaction = (t: CashTransaction) => {
    setNewCashTransaction({
      concept: t.concept,
      type: t.type,
      amount: t.amount,
      ...t
    } as any);
    // Scroll to form or show message
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  useEffect(() => {
    if (user && activeTab === 'crm') {
      fetchClients();
    }
  }, [user, activeTab]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [strategicAdvice, setStrategicAdvice] = useState<string | null>(null);
  const [isStrategicLoading, setIsStrategicLoading] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showSpeechModal, setShowSpeechModal] = useState(false);
  const [promoters, setPromoters] = useState(() => {
    const saved = localStorage.getItem('mi_crm_promoters');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_PROMOTERS;
  });
  const printRef = useRef<HTMLDivElement>(null);

  const [marginMultiplier, setMarginMultiplier] = useState(1);
  const [itemMargin, setItemMargin] = useState<number>(0);
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0,
    costPrice: 0,
    imageUrl: '',
    images: [] as string[],
    techSpecs: '',
    pdfUrl: ''
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUsingMargin, setIsUsingMargin] = useState(true);

  const combinedTechSpecs = useMemo(() => {
    const specsList: string[] = [];
    items.forEach(item => {
      if (item.techSpecs && item.techSpecs.trim()) {
        specsList.push(`• ${item.description}:\n${item.techSpecs.trim()}`);
      } else {
        const catMatch = catalog.find(c => (c.name || '').trim().toLowerCase() === (item.description || '').trim().toLowerCase());
        if (catMatch && catMatch.techSpecs && catMatch.techSpecs.trim()) {
          specsList.push(`• ${item.description}:\n${catMatch.techSpecs.trim()}`);
        }
      }
    });
    return specsList.join('\n\n');
  }, [items, catalog]);

  const rawSum = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  }, [items]);

  // Cálculos financieros inteligentes según perfil
  const { totalProposal, netoAfecto, iva, subtotalNeto, totalCost, totalMargin } = useMemo(() => {
    let sumBaseFactura = 0; // Si es seguridad, es neto.
    let sumBaseEfectivo = 0;
    let sumCostsNeto = 0;

    items.forEach(item => {
      const itemBase = item.quantity * item.unitPrice;
      const itemCost = item.quantity * (item.unitCost || 0);
      const mode = item.taxType || (fiscalMode === 'iva' ? 'factura' : 'efectivo');

      sumCostsNeto += itemCost;

      if (mode === 'factura') {
        sumBaseFactura += itemBase;
      } else {
        sumBaseEfectivo += itemBase;
      }
    });

    // 1. Cálculos por grupo
    let totalFacturaBruto = 0;
    let baseFacturaNeto = 0;

    // En seguridad, el unitPrice es neto
    baseFacturaNeto = sumBaseFactura;
    totalFacturaBruto = Math.round(baseFacturaNeto * 1.19);

    const ivaFactura = totalFacturaBruto - baseFacturaNeto;
    const totalEfectivo = sumBaseEfectivo;

    // 2. Totales Finales
    const calculatedTotalProposal = totalFacturaBruto + totalEfectivo;
    const finalTotal = Math.round(calculatedTotalProposal - discount);
    
    // Proporcionalidad del descuento
    const discountFactor = calculatedTotalProposal > 0 ? (finalTotal / calculatedTotalProposal) : 1;
    
    const finalIVA = Math.round(ivaFactura * discountFactor);
    const finalNetoTotal = baseFacturaNeto + sumBaseEfectivo;
    
    // El neto "Afecto" (Liquido real que recibe el usuario)
    const finalNetoAfecto = finalTotal - finalIVA;

    return {
      totalProposal: finalTotal,
      netoAfecto: finalNetoAfecto,
      iva: finalIVA,
      subtotalNeto: finalNetoTotal,
      totalCost: sumCostsNeto,
      totalMargin: Math.max(0, finalNetoAfecto - sumCostsNeto)
    };
  }, [items, fiscalMode, discount, profile]);


  const isOwner = useMemo(() => {
    if (loadingAuth) return false; 
    
    const urlParams = new URLSearchParams(window.location.search);
    const hasQuoteIdInUrl = urlParams.has('quoteId');
    
    // Si hay un ID en la URL, comparamos con el dueño registrado.
    if (hasQuoteIdInUrl) {
      if (!user) return false;
      if (!quoteOwnerId) return false; 
      const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
      return effectiveUid === quoteOwnerId;
    }

    // Si no hay ID en la URL, el usuario actual es dueño de lo que está creando
    // PERO si es un invitado sin login, tiene acceso limitado
    return !!user;
  }, [user, quoteOwnerId, loadingAuth]);

  // UI for Not Found
  if (isQuoteNotFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full"
        >
          <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Presupuesto No Encontrado</h1>
          <p className="text-slate-500 text-sm mb-8">
            El presupuesto <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{quoteRefId}</span> no existe o no pudo ser cargado.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                window.history.pushState({}, '', window.location.pathname);
                window.location.reload();
              }}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              IR AL INICIO
            </button>
            <p className="text-[10px] text-slate-400 font-medium">Si eres el dueño del presupuesto, asegúrate de haberlo guardado antes de compartir el enlace.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  useEffect(() => {
    // Solo actuamos si ya terminó de cargar el auth y el presupuesto
    if (!loadingAuth && hasQuoteInUrl && quoteOwnerId) {
      if (!user || user.uid !== quoteOwnerId) {
        setShowClientPreview(true);
      }
    }
  }, [user, quoteOwnerId, loadingAuth, hasQuoteInUrl]);

  useEffect(() => {
    if (showShareModal && isOwner) {
      saveQuoteToFirebase(true);
    }
  }, [showShareModal, isOwner]);

  const updateStatus = async (newStatus: QuoteStatus) => {
    if (!isOwner || !user) {
      console.warn("Unauthorized status update attempt");
      return;
    }
    setStatus(newStatus);
    
    setIsSaving(true);
    try {
      const docRef = doc(db, "presupuestos", quoteRefId);
      await setDoc(docRef, removeUndefined({ 
        status: newStatus,
        updatedAt: serverTimestamp()
      }), { merge: true });
      fetchQuoteHistory();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `presupuestos/${quoteRefId}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuote = async (id: string, e?: MouseEvent) => {
    if (e && 'stopPropagation' in e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    console.log("Iniciando eliminación de:", id);
    if (!id) {
      console.error("No se proporcionó ID para borrar");
      return;
    }

    try {
      await deleteDoc(doc(db, "presupuestos", id));
      setPreviousQuotes(prev => prev.filter(q => q.id !== id));
      
      if (id === quoteRefId) {
        resetToDefault();
      }
      console.log("Eliminado con éxito:", id);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsOptimizing(true);
      const filePromises = Array.from(files).map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const compressed = await compressImage(reader.result as string);
            resolve(compressed);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(compressedImages => {
        setNewItem(prev => ({ 
          ...prev, 
          images: [...compressedImages, ...prev.images].slice(0, 3), // Prepend new images and limit to 3
          imageUrl: compressedImages[0] 
        }));
        setIsOptimizing(false);
      });
    }
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setNewItem(prev => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()].slice(0, 5),
        imageUrl: prev.images.length === 0 ? imageUrlInput.trim() : prev.imageUrl
      }));
      setImageUrlInput('');
    }
  };

  const addImageUrlToItem = (id: string, url: string) => {
    if (url.trim()) {
      setItems(prev => prev.map(item => {
        if (item.id === id) {
          const currentImages = item.images || (item.imageUrl ? [item.imageUrl] : []);
          const newImages = [url.trim(), ...currentImages].slice(0, 5); // Prepend new URL
          return { ...item, images: newImages, imageUrl: newImages[0] };
        }
        return item;
      }));
      if (quoteRefId) {
        setTimeout(() => saveQuoteToFirebase(), 500);
      }
    }
  };

  const handleUpdateItemImage = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsOptimizing(true);
      const filePromises = Array.from(files).map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const compressed = await compressImage(reader.result as string);
            resolve(compressed);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(compressedImages => {
        setItems(prev => prev.map(item => {
          if (item.id === id) {
            const existingImages = item.images || (item.imageUrl ? [item.imageUrl] : []);
            const newImages = [...compressedImages, ...existingImages].slice(0, 3); // Prepend new images
            return { 
              ...item, 
              images: newImages, 
              imageUrl: newImages[0] 
            };
          }
          return item;
        }));
        setIsOptimizing(false);
        if (quoteRefId) {
          setTimeout(() => saveQuoteToFirebase(), 500);
        }
      });
    }
  };

  const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        // JPEG 0.5 is very efficient and automatically strips metadata (EXIF)
        const compressed = canvas.toDataURL('image/jpeg', 0.5); 
        resolve(compressed);
      };
    });
  };

  const addItem = () => {
    if (!newItem.description || newItem.quantity <= 0) return;
    
    // Apply margin if active
    let finalUnitPrice = newItem.unitPrice || 0;
    
    // Calculate basic Neto Cost first
    const baseCostInput = newItem.costPrice || 0;
    const costNetoValue = costIsGross ? baseCostInput / 1.19 : baseCostInput;
    
    const isEfectivo = fiscalMode === 'efectivo';
    
    if (isUsingMargin && baseCostInput > 0) {
      const marginFactor = 1 + (itemMargin / 100);
      
      if (isEfectivo) {
        // En Efectivo, el precio es final tal cual (sin sumar IVA)
        // Pero el MARGEN se calcula sobre el COSTO BRUTO (porque el IVA pagado en la compra es un costo real si la venta no es declarada)
        finalUnitPrice = Math.round((costNetoValue * 1.19) * marginFactor);
      } else {
        // En Seguridad (Precios Netos), el unitPrice guardado es el Neto
        finalUnitPrice = Math.round(costNetoValue * marginFactor);
      }
    } else if (!newItem.unitPrice && baseCostInput > 0) {
      // Si no hay margen, el unitPrice se basa en el costo
      if (isEfectivo) {
        finalUnitPrice = Math.round(costNetoValue);
      } else {
        finalUnitPrice = Math.round(costNetoValue);
      }
    }

    // Auto-match pdfUrl y techSpecs desde el catálogo si están presentes
    const catMatch = catalog.find(c => (c.name || '').trim().toLowerCase() === (newItem.description || '').trim().toLowerCase());

    const item: BudgetItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: newItem.description,
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: finalUnitPrice,
      unitCost: costNetoValue,
      discount: 0,
      margin: itemMargin,
      imageUrl: newItem.imageUrl,
      images: newItem.images && newItem.images.length > 0 ? newItem.images : (newItem.imageUrl ? [newItem.imageUrl] : []),
      techSpecs: newItem.techSpecs || (catMatch?.techSpecs || ''),
      pdfUrl: newItem.pdfUrl || (catMatch?.pdfUrl || '')
    };
    setItems(prev => [...prev, item]);
    setNewItem({ description: '', quantity: 1, unitPrice: 0, costPrice: 0, imageUrl: '', images: [], techSpecs: '', pdfUrl: '' } as any);
    setAiAnalysis(null); 
  };

  const handleItemPdfUpload = (itemId: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert("Por favor sube un archivo PDF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo PDF es demasiado grande (máx 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const pdfData = reader.result as string;
      setItems(prev => prev.map(it => it.id === itemId ? { ...it, pdfUrl: pdfData } : it));
      if (quoteRefId) {
        setTimeout(() => saveQuoteToFirebase(), 500);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(i => i.id !== id));
    setAiAnalysis(null);
  };

  const [catalogQuantities, setCatalogQuantities] = useState<{[id: string]: number}>({});

  const getCatalogQuantity = (id: string) => catalogQuantities[id] || 1;

  const handleCatalogQuantityChange = (id: string, qty: number) => {
    if (qty < 1) qty = 1;
    setCatalogQuantities(prev => ({ ...prev, [id]: qty }));
  };

  const addItemFromCatalog = (catItem: CatalogItem) => {
    const itemCost = catItem.unitCost || catItem.unitPrice || 0;
    setNewItem({
      description: catItem.name,
      quantity: 1,
      unitPrice: catItem.unitPrice,
      costPrice: itemCost,
      imageUrl: catItem.imageUrl || (catItem.images?.[0] || ''),
      images: catItem.images || (catItem.imageUrl ? [catItem.imageUrl] : []),
      techSpecs: catItem.techSpecs || '',
      pdfUrl: catItem.pdfUrl || ''
    });
    setIsUsingMargin(true);
    setImageUrlInput(catItem.imageUrl || '');
    setAiAnalysis(null);
    
    // Scroll to the item form
    setTimeout(() => {
      document.getElementById('item-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCatalogImageUpload = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsOptimizing(true);
      const filePromises = Array.from(files).map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const compressed = await compressImage(reader.result as string);
            resolve(compressed);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(compressedImages => {
        setCatalog(prev => prev.map(item => {
          if (item.id === id) {
            const existingImages = item.images || (item.imageUrl ? [item.imageUrl] : []);
            const newImages = [...compressedImages, ...existingImages].slice(0, 3);
            const updatedItem = { 
              ...item, 
              images: newImages, 
              imageUrl: newImages[0] 
            };

            // Sync with Firestore if logged in
            if (user) {
              setDoc(doc(db, "catalog", id), removeUndefined({
                images: updatedItem.images,
                imageUrl: updatedItem.imageUrl,
                updatedAt: serverTimestamp(),
                ownerId: localStorage.getItem('impersonatedUserId') || user.uid,
                name: updatedItem.name,
                unitPrice: updatedItem.unitPrice
              }), { merge: true }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `catalog/${id}`));
            }

            return updatedItem;
          }
          return item;
        }));
        setIsOptimizing(false);
      });
    }
  };

  const handleCatalogPdfUpload = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Por favor sube un archivo PDF");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande (máx 5MB)");
        return;
      }

      setIsOptimizing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const pdfData = reader.result as string;
        setCatalog(prev => prev.map(item => {
          if (item.id === id) {
            const updatedItem = { ...item, pdfUrl: pdfData };
            
            if (user) {
              setDoc(doc(db, "catalog", id), removeUndefined({
                pdfUrl: pdfData,
                updatedAt: serverTimestamp(),
                ownerId: localStorage.getItem('impersonatedUserId') || user.uid,
                name: updatedItem.name,
                unitPrice: updatedItem.unitPrice
              }), { merge: true }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `catalog/${id}`));
            }
            return updatedItem;
          }
          return item;
        }));
        setIsOptimizing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateCatalogItem = async (id: string) => {
    const item = catalog.find(it => it.id === id);
    if (!item) return;

    const finalPriceNum = editCatalogData.precioVentaFinal !== undefined
      ? (typeof editCatalogData.precioVentaFinal === 'number' ? Math.floor(editCatalogData.precioVentaFinal) : parseCLP(editCatalogData.precioVentaFinal))
      : (item.precioVentaFinal ?? 0);

    if (finalPriceNum <= 0) {
      alert("El Precio Venta Final debe ser mayor a 0");
      return;
    }

    const updatedItem: CatalogItem = {
      ...item,
      ...editCatalogData,
      enBodega: editCatalogData.enBodega !== undefined ? Boolean(editCatalogData.enBodega) : (item.enBodega ?? false),
      modalidad: editCatalogData.modalidad ?? item.modalidad ?? 'stock',
      tiempoEntrega: (editCatalogData.modalidad ?? item.modalidad) === 'venta_calzada'
        ? (editCatalogData.tiempoEntrega ?? item.tiempoEntrega ?? '')
        : '',
      precioVentaFinal: finalPriceNum
    };
    
    // Update local state (optimistic)
    setCatalog(prev => prev.map(it => it.id === id ? updatedItem : it));
    setEditingCatalogId(null);
    setEditCatalogData({});

    if (user) {
      try {
        await setDoc(doc(db, "catalog", id), removeUndefined({
          ...updatedItem,
          enBodega: updatedItem.enBodega,
          modalidad: updatedItem.modalidad,
          tiempoEntrega: updatedItem.tiempoEntrega,
          precioVentaFinal: updatedItem.precioVentaFinal,
          ownerId: localStorage.getItem('impersonatedUserId') || user.uid,
          updatedAt: serverTimestamp()
        }), { merge: true });
      } catch (e) {
        console.error("Error updating catalog item:", e);
        handleFirestoreError(e, OperationType.UPDATE, `catalog/${id}`);
      }
    }
  };

  const handleUpdateCatalogItemFromStock = async (updatedItem: CatalogItem) => {
    setCatalog(prev => {
      const norm = (s: string) => s ? s.trim().toLowerCase() : '';
      const exists = prev.some(it => it.id === updatedItem.id || norm(it.name) === norm(updatedItem.name));
      if (exists) {
        return prev.map(it => (it.id === updatedItem.id || norm(it.name) === norm(updatedItem.name)) ? { ...it, ...updatedItem } : it);
      }
      return [updatedItem, ...prev];
    });

    if (user) {
      try {
        await setDoc(doc(db, "catalog", updatedItem.id), removeUndefined({
          ...updatedItem,
          ownerId: localStorage.getItem('impersonatedUserId') || user.uid,
          updatedAt: serverTimestamp()
        }), { merge: true });
        toast?.success?.(`Stock de "${updatedItem.name}" actualizado ✓`);
      } catch (e) {
        console.error("Error updating catalog item stock:", e);
        handleFirestoreError(e, OperationType.UPDATE, `catalog/${updatedItem.id}`);
      }
    } else {
      toast?.success?.(`Stock de "${updatedItem.name}" actualizado ✓`);
    }
  };

  const handleAddCatalogItemFromStock = async (newItem: CatalogItem) => {
    setCatalog(prev => [newItem, ...prev]);
    if (user) {
      try {
        await setDoc(doc(db, "catalog", newItem.id), removeUndefined({
          ...newItem,
          ownerId: localStorage.getItem('impersonatedUserId') || user.uid,
          createdAt: serverTimestamp()
        }));
        toast?.success?.(`Producto "${newItem.name}" y stock registrados ✓`);
      } catch (e) {
        console.error("Error adding catalog item from stock:", e);
        handleFirestoreError(e, OperationType.CREATE, `catalog/${newItem.id}`);
      }
    } else {
      toast?.success?.(`Producto "${newItem.name}" y stock registrados ✓`);
    }
  };

  const handleDeleteCatalogItem = async (id: string) => {
    setCatalog(prev => prev.filter(item => item.id !== id));
    if (user) {
      try {
        await deleteDoc(doc(db, "catalog", id));
        toast?.success?.("Producto eliminado");
      } catch (e: any) {
        console.error("Error deleting from Firestore:", e);
        toast?.error?.("No se pudo eliminar: " + e.message);
      }
    }
  };

  const handleClearCatalog = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar TODOS los productos de tu catálogo?")) {
      if (user) {
        try {
          const promises = catalog.map(item => deleteDoc(doc(db, "catalog", item.id)));
          await Promise.all(promises);
          toast?.success?.("Catálogo vaciado exitosamente");
        } catch (e) {
          console.error("Error clearing catalog:", e);
        }
      }
      resetCatalog();
    }
  };

  const updateItemQuantity = (id: string, newQuantity: number) => {
    const qty = isNaN(newQuantity) ? 0 : newQuantity;
    setItems(items.map(item => item.id === id ? { ...item, quantity: qty } : item));
    setAiAnalysis(null);
  };

  const updateItemCost = (id: string, newCost: number) => {
    const cost = isNaN(newCost) ? 0 : Math.round(newCost);
    setItems(items.map(item => {
      if (item.id === id) {
        let finalPrice = item.unitPrice;
        if (isUsingMargin) {
          const factor = 1 + (item.margin / 100);
          finalPrice = Math.round(cost * factor);
        }
        return { ...item, unitCost: cost, unitPrice: finalPrice };
      }
      return item;
    }));
    setAiAnalysis(null);
  };

  const updateItemMargin = (id: string, newMargin: number) => {
    const margin = isNaN(newMargin) ? 0 : newMargin;
    setItems(items.map(item => {
      if (item.id === id) {
        let finalPrice = item.unitPrice;
        if (isUsingMargin) {
          const factor = 1 + (margin / 100);
          finalPrice = Math.round((item.unitCost || 0) * factor);
        }
        return { ...item, margin, unitPrice: finalPrice };
      }
      return item;
    }));
    setAiAnalysis(null);
  };

  const updateItemPrice = (id: string, newPrice: number) => {
    const price = isNaN(newPrice) ? 0 : Math.round(newPrice);
    setItems(items.map(item => item.id === id ? { ...item, unitPrice: price } : item));
    setAiAnalysis(null);
  };


  const clearSignature = () => {
    sigPad.current?.clear();
    setSignature(null);
  };

  const markAsPaid = async (quoteId: string) => {
    try {
      const docRef = doc(db, "presupuestos", quoteId);
      await setDoc(docRef, removeUndefined({ 
        status: 'PAID', 
        updatedAt: serverTimestamp() 
      }), { merge: true });
      
      if (auth.currentUser) fetchQuoteHistory();
      return true;
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, `presupuestos/${quoteId}/status`);
      return false;
    }
  };

  const markAsWon = async (quoteId: string, clientName?: string, totalAmount?: number) => {
    try {
      const docRef = doc(db, "presupuestos", quoteId);
      await setDoc(docRef, removeUndefined({ 
        status: 'APPROVED', 
        updatedAt: serverTimestamp() 
      }), { merge: true });
      
      const amt = totalAmount || 0;
      const cName = clientName || 'Cliente';
      const message = `¡Negocio Cerrado! 🚀 El cliente ${cName} ha firmado la cotización por un valor bruto de $${amt.toLocaleString()}.`;
      console.log("NOTIFICACIÓN ENVIADA (SIMULACIÓN):", message);
      console.log(`Simulación de Venta: El cliente ${cName} ha firmado el presupuesto por $${amt.toLocaleString()}.`);
      
      if (auth.currentUser) fetchQuoteHistory();
      return true;
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, `presupuestos/${quoteId}/status`);
      return false;
    }
  };

  const saveSignature = async () => {
    if (sigPad.current) {
      if (sigPad.current.isEmpty()) {
        alert("Por favor firma antes de guardar.");
        return;
      }
      
      let signatureDataUrl = '';
      try {
        signatureDataUrl = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      } catch (err) {
        console.warn("getTrimmedCanvas failed, using raw canvas", err);
        signatureDataUrl = sigPad.current.getCanvas().toDataURL('image/png');
      }
      setSignature(signatureDataUrl);
      setShowSignaturePad(false);

      if (quoteRefId) {
        setIsSaving(true);
        try {
          // Guardar la firma específicamente primero
          await setDoc(doc(db, "presupuestos", quoteRefId), removeUndefined({ signature: signatureDataUrl }), { merge: true });
          
          const success = await markAsWon(quoteRefId, clientInfo.name, totalProposal);
          if (success) {
            setStatus('APPROVED');
            alert("¡Propuesta firmada y aprobada correctamente! Su ejecutivo será notificado.");
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `presupuestos/${quoteRefId}/signature`);
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  const acceptOrder = async () => {
    if (quoteRefId) {
      setIsSaving(true);
      try {
        const success = await markAsWon(quoteRefId, clientInfo.name, totalProposal);
        if (success) {
          setStatus('APPROVED');
          alert("¡Pedido aceptado correctamente! Estamos procesando tu solicitud.");
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `presupuestos/${quoteRefId}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const analyzeBudgetWithAi = async () => {
    const genAI = getAiClient();
    if (!genAI) {
      alert("El servicio de IA no está configurado (API Key faltante).");
      return;
    }

    setIsAnalyzing(true);
    try {
      const itemsText = items.map(i => `${i.quantity}x ${i.description} (@ $${i.unitPrice})`).join('\n');
      
      const rolePrompt = profile === 'security' 
        ? "Eres un estratega comercial experto en presupuestos técnicos y análisis de valor."
        : "Eres un curador de presupuestos de lujo para Luxury Accessories.";

      const specificInstructions = profile === 'security'
        ? "1. Evaluación de la robustez del presupuesto (¿está completo?).\n2. 3 beneficios clave de esta propuesta que justifican el presupuesto.\n3. Una recomendación para cerrar la venta hoy."
        : "1. Evaluación de la armonía del presupuesto.\n2. 3 razones por las que esta inversión es excepcional.\n3. Recomendación para el cierre comercial.";

      const response = await generateContentWithRetry(genAI, {
        contents: `${rolePrompt} 
        Analiza el siguiente presupuesto para un cliente y proporciona:
        ${specificInstructions}
        
        IMPORTANTE: PROHIBIDO MENCIONAR COSTOS INTERNOS, MÁRGENES DE GANANCIA O UTILIDADES. ENFÓCATE SOLO EN EL VALOR PARA EL CLIENTE Y PRECIOS FINALES.
        
        Presupuesto:
        ${itemsText}
        
        TOTAL: $${Math.round(totalProposal)}
        
        Escribe en un tono ${profile === 'security' ? 'profesional, persuasivo y ejecutivo' : 'elegante, sofisticado y cálido'}. No uses markdown complejo, solo texto claro y emojis sutiles. Máximo 150 palabras.`
      });

      setAiAnalysis(response.text || "No se pudo generar el análisis.");
    } catch (error) {
      console.error("AI Analysis error:", error);
      setAiAnalysis("Error al conectar con el analista virtual.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAiParse = async () => {
    if (!rawInput.trim()) return;
    setIsAiLoading(true);
    const genAI = getAiClient();
    if (!genAI) {
      alert("El servicio de IA no está disponible. Verifica tu API Key.");
      setIsAiLoading(false);
      return;
    }

    try {
      const response = await generateContentWithRetry(genAI, {
        contents: `Actúa como un asistente experto en ventas técnicas para un Solopreneur. 
        Entrada del usuario: "${rawInput}"
        
        TABLA DE MÁRGENES (USO INTERNO): 
        - Si detectas costos técnicos brutos sin margen, aplícales un 20% de utilidad antes de incluirlos en el unitPrice.
        
        REGLAS DE SALIDA:
        1. Genera un JSON estrictamente con este formato:
        {
          "items": [{ 
            "description": string, 
            "quantity": number, 
            "unitPrice": number (PRECIO FINAL VENTA)
          }],
          "clientInfo": { "name": string, "company": string, "email": string, "requirements": string (Resumen técnico profesional sin mencionar márgenes) },
          "suggestedNiche": string (Identifica el nicho específico, ej: Seguridad Rural, CCTV Solar, etc),
          "packagingStrategy": string (Cómo vender esto como un pack irresistible)
        }
        2. NUNCA DEVOLVER MARGENES NI COSTOS NETOS. SOLO PRECIO DE VENTA FINAL.
        
        No incluyas markdown ni explicaciones, solo el objeto JSON.`
      });
      
      const cleanText = response.text?.replace(/```json|```/g, '').trim() || "";
      const data = JSON.parse(cleanText);

      if (data.items) {
        setItems(prev => [...prev, ...data.items.map((i: any) => ({ 
          description: i.description,
          quantity: i.quantity || 1,
          unitPrice: i.unitPrice || 0,
          id: crypto.randomUUID(),
          name: i.description,
          discount: 0,
          margin: margin
        }))]);
      }
      if (data.clientInfo) {
        setClientInfo(prev => ({
          ...prev,
          name: data.clientInfo.name || prev.name,
          company: data.clientInfo.company || prev.company,
          requirements: prev.requirements ? prev.requirements + "\n\n" + data.clientInfo.requirements : data.clientInfo.requirements
        }));
      }
      
      setRawInput('');
      setShowAiInput(false);
    } catch (error) {
      console.error("AI Error:", error);
      alert("Error analizando requerimientos.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateStrategicAdvice = async (type: 'niche' | 'packaging' | 'sales') => {
    setIsStrategicLoading(true);
    const genAI = getAiClient();
    if (!genAI) {
      alert("Configura tu API Key en los ajustes.");
      setIsStrategicLoading(false);
      return;
    }

    try {
      const context = JSON.stringify({
        currentProposal: { items, clientInfo },
        history: previousQuotes.map(q => ({ client: q.clientInfo.company, total: q.items.reduce((a, b) => a + (b.quantity * b.unitPrice), 0) }))
      });

      const roleContext = "Eres un asesor de negocios experto en seguridad electrónica y servicios B2B.";

      const prompts = {
        niche: "Analiza mi historial y propuesta actual para definir mi nicho de mercado ideal y cómo posicionarme mejor como especialista en seguridad.",
        packaging: "Sugiere cómo estructurar mis presupuestos en paquetes (Bundles) atractivos que incluyan equipos y puesta en marcha para aumentar la rentabilidad.",
        sales: "Dame una estrategia de cierre de ventas específica para propuestas técnicas y guiones de seguimiento ejecutivo."
      };

      const response = await generateContentWithRetry(genAI, {
        contents: `${roleContext} ${prompts[type]}. Contexto de mi negocio: ${context}`
      });
      setStrategicAdvice(response.text || "No se pudo generar el consejo.");
    } catch (error) {
      console.error("Strategic AI error:", error);
    } finally {
      setIsStrategicLoading(false);
    }
  };

  const isConfirmedStatus = (status: string | undefined, signature: string | null | undefined) => {
    const s = (status || '').toLowerCase();
    return s === 'paid' || s === 'approved' || s === 'confirmed' || s === 'confirmado' || s === 'aprobado' || s === 'pagado' || !!signature;
  };

  const financialMetrics = useMemo(() => {
    const confirmedQuotes = previousQuotes.filter(q => isConfirmedStatus(q.status, q.signature));
    const quotesIncome = confirmedQuotes.reduce((acc, curr) => acc + (curr.totalProposal || 0), 0);
    
    const importSales = importBatches.reduce((acc, batch) => {
      const batchSales = (batch.items || []).reduce((sAcc, item) => sAcc + ((item.salePrice || 0) * ((item.quantity || 0) - (item.currentInventory || 0))), 0) || 0;
      return acc + batchSales;
    }, 0);

    const paidQuotesIncome = previousQuotes
      .filter(q => {
        const s = (q.status || '').toLowerCase();
        return s === 'paid' || s === 'pagado';
      })
      .reduce((acc, curr) => acc + (curr.totalProposal || 0), 0);

    const cashIncome = cashTransactions.filter(t => t.type === 'in').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const cashExpenses = cashTransactions.filter(t => t.type === 'out').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    
    // Gastos operativos totales (Expenses collection)
    const operationalExpensesTotal = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    
    // Compras con factura pagadas (excluyendo efectivo para no duplicar con Caja)
    const paidPurchasesTotal = purchaseRecords
      .filter(p => p.isPaid && p.paymentMethod !== 'efectivo')
      .reduce((acc, p) => acc + (p.totalAmount || 0), 0);

    // El saldo real es: Ventas Pagadas + Importaciones + Ingresos de Caja - Egresos de Caja - Gastos - Compras Pagadas
    const cashBalance = paidQuotesIncome + importSales + cashIncome - cashExpenses - operationalExpensesTotal - paidPurchasesTotal;

    const cashBreakdown = {
      income: paidQuotesIncome + importSales + cashIncome,
      expenses: cashExpenses + operationalExpensesTotal + paidPurchasesTotal
    };

    const totalIncome = quotesIncome + importSales + cashIncome;
    
    // Costos Directos (COGS)
    const quotesDirectCost = confirmedQuotes.reduce((acc, curr) => {
      if (curr.totalCost !== undefined) return acc + (curr.totalCost || 0);
      return acc + ((curr.totalProposal || 0) * 0.70); 
    }, 0);

    const importInvestment = importBatches.reduce((acc, b) => acc + (b.totalInvestment || 0), 0);
    const purchaseDirectCost = purchaseRecords.filter(p => p.category === 'mercaderia').reduce((acc, p) => acc + (p.netAmount || 0), 0);
    
    const totalDirectCost = quotesDirectCost + importInvestment + purchaseDirectCost;
    const grossMarginValue = totalIncome - totalDirectCost;
    const grossMarginPercent = totalIncome > 0 ? (grossMarginValue / totalIncome) * 100 : 0;

    const opExCategories = ['fijo', 'variable', 'mkt', 'personal', 'otro'];
    const opExExpenses = expenses.filter(e => opExCategories.includes(e.category));
    const purchaseOpEx = purchaseRecords.filter(p => p.category !== 'mercaderia').reduce((acc, p) => acc + (p.netAmount || 0), 0);
    
    const totalOpEx = opExExpenses.reduce((acc, curr) => acc + (curr.amount || 0), 0) + purchaseOpEx;

    // EBITDA
    const ebitda = grossMarginValue - totalOpEx - cashExpenses;
    const ebitdaMargin = totalIncome > 0 ? (ebitda / totalIncome) * 100 : 0;

    const taxExpenses = expenses.filter(e => e.category === 'impuesto').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const interestExpenses = expenses.filter(e => e.category === 'interes').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const amortizationExpenses = expenses.filter(e => e.category === 'amortizacion').reduce((acc, curr) => acc + (curr.amount || 0), 0);
    
    const totalExpenses = (expenses || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalShrinkageCost = (shrinkages || []).reduce((acc, curr) => acc + ((curr.unitCost || 0) * (curr.quantity || 0)), 0);
    
    const ivaDebito = (confirmedQuotes || []).reduce((acc, curr) => acc + (curr.iva || 0), 0);
    const ivaCredito = (purchaseRecords || []).reduce((acc, curr) => acc + (curr.ivaAmount || 0), 0);
    const ivaDiferencia = ivaDebito - ivaCredito;

    const accountsReceivable = (confirmedQuotes || []).filter(q => (q.status || '').toLowerCase() !== 'paid' && (q.status || '').toLowerCase() !== 'pagado').reduce((acc, curr) => acc + (curr.totalProposal || 0), 0);
    const accountsPayable = (purchaseRecords || []).filter(p => !p.isPaid).reduce((acc, p) => acc + (p.totalAmount || 0), 0);
    const liquidityPosition = cashBalance + accountsReceivable - accountsPayable;

    const totalOutflow = totalExpenses + totalShrinkageCost + cashExpenses + (purchaseRecords || []).filter(p => p.paymentMethod !== 'efectivo').reduce((acc, p) => acc + (p.totalAmount || 0), 0);
    const netMargin = totalIncome - totalOutflow;
    const netMarginPercent = totalIncome > 0 ? (netMargin / totalIncome) * 100 : 0;

    const breakEvenPoint = grossMarginPercent > 0 ? totalOutflow / (grossMarginPercent / 100) : 0;
    
    return {
      totalIncome,
      grossMarginValue,
      grossMarginPercent,
      ebitda,
      ebitdaMargin,
      netMargin,
      netMarginPercent,
      breakEvenPoint,
      totalDirectCost,
      totalOutflow,
      cashIncome,
      cashExpenses,
      totalOpEx,
      taxExpenses,
      interestExpenses,
      amortizationExpenses,
      totalExpenses,
      ivaDebito,
      ivaCredito,
      ivaDiferencia,
      cashBalance,
      cashBreakdown,
      accountsReceivable,
      accountsPayable,
      liquidityPosition
    };
  }, [previousQuotes, importBatches, cashTransactions, expenses, shrinkages, purchaseRecords]);

  const financialMetricsRef = useRef(financialMetrics);
  useEffect(() => {
    financialMetricsRef.current = financialMetrics;
  }, [financialMetrics]);

  const handlePrint = () => {
    window.print();
  };


  // --- MEMOIZED DASHBOARD DATA ---
  const dashboardChartData = useMemo(() => {
    if (activeTab !== 'dashboard' && viewMode !== 'dashboard') return { monthly: [], states: [] };

    // 1. Monthly Data
    const months: {[key: string]: number} = {};
    previousQuotes
      .filter(q => isConfirmedStatus(q.status, q.signature))
      .forEach(q => {
        const date = q.createdAt instanceof Timestamp ? q.createdAt.toDate() : (q.createdAt ? new Date((q.createdAt as any).seconds * 1000) : new Date());
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months[key] = (months[key] || 0) + (q.totalProposal || 0);
      });
    
    const monthly = Object.entries(months)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => ({
        month: key,
        monto: value
      }));

    // 2. State Distribution
    const stats = {
      'Enviadas': previousQuotes.filter(q => (q.status === 'sent' || q.status === 'enviado') && !isConfirmedStatus(q.status, q.signature)).length,
      'Vencidas': previousQuotes.filter(q => q.status === 'expired').length,
      'Ganadas': previousQuotes.filter(q => isConfirmedStatus(q.status, q.signature)).length,
      'Borrador': previousQuotes.filter(q => !q.status || q.status === 'draft').length
    };
    const states = Object.entries(stats).map(([name, value]) => ({ name, value }));

    return { monthly, states };
  }, [previousQuotes, activeTab, viewMode]);

  const dashboardFilteredQuotes = useMemo(() => {
    return previousQuotes
      .filter(q => {
        const s = (q.status || '').toLowerCase();
        if (dashboardFilter === 'all') return true;
        if (dashboardFilter === 'sent_unconfirmed') {
          return (s === 'sent' || s === 'enviado' || s === 'pending') && !q.signature;
        }
        if (dashboardFilter === 'approved') {
          return s === 'approved' || s === 'confirmed' || !!q.signature;
        }
        if (dashboardFilter === 'sent') {
          return s === 'sent' || s === 'enviado' || s === 'pending';
        }
        return s === dashboardFilter;
      })
      .slice(0, 10);
  }, [previousQuotes, dashboardFilter]);

  const renderMainContent = () => {
    if (showClientPreview) return null;
    if (viewMode === 'dashboard' || activeTab === 'dashboard') {
      return (
        <Suspense fallback={<div className="p-8"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>}>
        <Dashboard 
          user={user}
          financialMetrics={financialMetrics}
          previousQuotes={previousQuotes}
          dashboardChartData={dashboardChartData}
          dashboardFilteredQuotes={dashboardFilteredQuotes}
          dashboardFilter={dashboardFilter}
          setDashboardFilter={setDashboardFilter}
          isConfirmedStatus={isConfirmedStatus}
          loadQuote={loadQuote}
          markAsWon={async (id, name, total) => {
            await markAsWon(id, name, total);
          }}
          markAsPaid={async (id) => {
            await markAsPaid(id);
          }}
          deleteQuote={async (id) => {
            try {
              await deleteDoc(doc(db, "presupuestos", id));
              setPreviousQuotes(prev => prev.filter(q => q.id !== id));
            } catch (e) {
              console.error("Error deleting quote:", e);
            }
          }}
          handleLogin={handleLogin}
          syncCash={async (val) => {
            if (typeof val !== 'number') return;
            const metrics = financialMetricsRef.current;
            const diff = val - (metrics?.cashBalance || 0);
            await addDoc(collection(db, "cashTransactions"), {
              concept: `AJUSTE DE CAJA`,
              type: diff > 0 ? 'in' : 'out',
              amount: Math.abs(diff),
              date: serverTimestamp(),
              ownerId: auth.currentUser?.uid
            });
          }}
          importBatches={importBatches}
          shrinkages={shrinkages}
          expenses={expenses}
          purchaseRecords={purchaseRecords}
          cashTransactions={cashTransactions}
        />
        </Suspense>
      );
    }

    if (isOwner && activeTab === 'catalog') {
      return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
            <div>
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                <Package className="text-indigo-600" size={20} />
                Catálogo de Soluciones
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Gestión de servicios y precios base.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text"
                  placeholder="Buscar..."
                  value={catalogSearchTerm}
                  onChange={(e) => setCatalogSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <button 
                onClick={handleClearCatalog}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 whitespace-nowrap"
              >
                Reset
              </button>
              <button 
                onClick={() => setShowCatalogImporter(true)}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <Upload size={12} /> Importar PDF / Excel
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">Añadir Nuevo Ítem</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input 
                type="text" 
                placeholder="ID (ej: cam-01)" 
                className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newCatalogItem.id}
                onChange={e => setNewCatalogItem({...newCatalogItem, id: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Nombre del Ítem" 
                className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
                value={newCatalogItem.name}
                onChange={e => setNewCatalogItem({...newCatalogItem, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Costo Neto Adquisición ($)" 
                className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                value={newCatalogItem.price ? formatCLP(newCatalogItem.price) : ''}
                onChange={e => setNewCatalogItem({...newCatalogItem, price: parseCLP(e.target.value).toString()})}
              />

              {/* 4 nuevos campos */}
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2">
                <span className="text-xs font-bold text-slate-700">En Bodega</span>
                <button
                  type="button"
                  onClick={() => setNewCatalogItem(prev => ({ ...prev, enBodega: !prev.enBodega }))}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    newCatalogItem.enBodega ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      newCatalogItem.enBodega ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <select
                value={newCatalogItem.modalidad}
                onChange={e => setNewCatalogItem({
                  ...newCatalogItem,
                  modalidad: e.target.value as any,
                  tiempoEntrega: e.target.value !== 'venta_calzada' ? '' : newCatalogItem.tiempoEntrega
                })}
                className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              >
                <option value="stock">En Stock</option>
                <option value="venta_calzada">Venta Calzada</option>
                <option value="agotado">Agotado</option>
              </select>

              <input 
                type="text"
                placeholder="Tiempo de Entrega (ej: 3-5 días)"
                disabled={newCatalogItem.modalidad !== 'venta_calzada'}
                className={`bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${
                  newCatalogItem.modalidad !== 'venta_calzada' ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
                }`}
                value={newCatalogItem.modalidad === 'venta_calzada' ? newCatalogItem.tiempoEntrega : ''}
                onChange={e => setNewCatalogItem({...newCatalogItem, tiempoEntrega: e.target.value})}
              />

              <input 
                type="text"
                placeholder="Precio Venta Final ($)"
                className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-emerald-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newCatalogItem.precioVentaFinal ? formatCLP(newCatalogItem.precioVentaFinal) : ''}
                onChange={e => setNewCatalogItem({...newCatalogItem, precioVentaFinal: parseCLP(e.target.value).toString()})}
              />

              <div className="md:col-span-1">
                <input 
                  type="file" 
                  id="new-catalog-pdf"
                  className="hidden" 
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 1024 * 1024) return alert("El PDF debe ser menor a 1MB");
                      const reader = new FileReader();
                      reader.onloadend = () => setNewCatalogItem(prev => ({...prev, pdfUrl: reader.result as string}));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label 
                  htmlFor="new-catalog-pdf"
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg text-xs font-bold uppercase cursor-pointer transition-all ${newCatalogItem.pdfUrl ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600'}`}
                >
                  <Paperclip size={14} />
                  {newCatalogItem.pdfUrl ? 'PDF Cargado ✓' : 'Subir Ficha Técnica'}
                </label>
              </div>
              <textarea 
                placeholder="Descripción técnica para el cliente..." 
                className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
                value={newCatalogItem.desc}
                onChange={e => setNewCatalogItem({...newCatalogItem, desc: e.target.value})}
              />
              <button 
                onClick={async () => {
                  const { id, name, price, desc, pdfUrl, enBodega, modalidad, tiempoEntrega, precioVentaFinal } = newCatalogItem;
                  if (!id || !name || !price) {
                    alert("Por favor completa ID, Nombre y Costo Neto");
                    return;
                  }
                  const finalPriceNum = parseCLP(precioVentaFinal) || Number(precioVentaFinal) || 0;
                  if (finalPriceNum <= 0) {
                    alert("El Precio Venta Final debe ser mayor a 0");
                    return;
                  }

                  // Check freemium limits
                  if (!hasPremiumAccess && catalog.length >= 10) {
                    setShowProModal(true);
                    toast.error("Límite de catálogo alcanzado (máx 10 productos en Plan Gratuito). ¡Mejora a Pro para agregar más productos!");
                    return;
                  }
                  const item: CatalogItem = { 
                    id: id.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''), 
                    name, 
                    description: desc, 
                    unitPrice: parseCLP(price) || Number(price) || 0, 
                    images: [],
                    pdfUrl,
                    enBodega: Boolean(enBodega),
                    modalidad: modalidad || 'stock',
                    tiempoEntrega: modalidad === 'venta_calzada' ? (tiempoEntrega || '') : '',
                    precioVentaFinal: finalPriceNum
                  };
                  setCatalog(prev => [item, ...prev]);
                  setNewCatalogItem({
                    id: '',
                    name: '',
                    price: '',
                    desc: '',
                    pdfUrl: '',
                    enBodega: false,
                    modalidad: 'stock',
                    tiempoEntrega: '',
                    precioVentaFinal: ''
                  });
                  
                  if (user) {
                    try {
                      const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
                      const cleanItem = removeUndefined(item);
                      const dataToSave = {
                        ...cleanItem,
                        enBodega: item.enBodega,
                        modalidad: item.modalidad,
                        tiempoEntrega: item.tiempoEntrega,
                        precioVentaFinal: item.precioVentaFinal,
                        ownerId: effectiveUid,
                        createdAt: serverTimestamp()
                      };
                      console.log("Saving catalog item to Firestore:", dataToSave);
                      await setDoc(doc(db, "catalog", item.id), dataToSave);
                    } catch (e) {
                      handleFirestoreError(e, OperationType.CREATE, `catalog/${item.id}`);
                    }
                  }
                }}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 md:col-span-1"
              >
                <Plus size={16} /> Añadir al Catálogo
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left p-4 text-[10px] uppercase font-bold text-slate-400 rounded-tl-lg">Imagen</th>
                  <th className="text-left p-4 text-[10px] uppercase font-bold text-slate-400">ID / Referencia</th>
                  <th className="text-left p-4 text-[10px] uppercase font-bold text-slate-400">Descripción / Detalles</th>
                  <th className="text-right p-4 text-[10px] uppercase font-bold text-slate-400">Precios (Costo / Venta)</th>
                  <th className="text-center p-4 text-[10px] uppercase font-bold text-slate-400 rounded-tr-lg w-32">Acción</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {catalogFilteredItems.length === 0 ? (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key="empty-catalog"
                    >
                      <td colSpan={5} className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package size={32} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">No se encontraron productos</p>
                        <p className="text-slate-400 text-[10px] mt-1">Intenta con otro término o añade uno nuevo arriba.</p>
                      </td>
                    </motion.tr>
                  ) : catalogFilteredItems.map(item => {
                    const isEditing = editingCatalogId === item.id;
                    return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      key={item.id} 
                      className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors group ${isEditing ? 'bg-indigo-50/30' : ''}`}
                    >
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-2">
                        <div className="relative w-12 h-12">
                          <input 
                            type="file" 
                            id={`catalog-img-${item.id}`}
                            className="hidden" 
                            accept="image/*"
                            multiple
                            onChange={(e) => handleCatalogImageUpload(item.id, e)}
                          />
                          <label 
                            htmlFor={`catalog-img-${item.id}`}
                            className="w-12 h-12 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-50 transition-all group/img"
                          >
                            {(item.imageUrl || item.images?.[0]) ? (
                              <img src={getSafeImageUrl(item.imageUrl || item.images?.[0])} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="text-slate-300 group-hover/img:text-indigo-400 transition-colors" size={20} />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                              <Upload className="text-white" size={14} />
                            </div>
                          </label>
                        </div>
                        <div className="flex gap-1 overflow-x-auto max-w-[100px] scrollbar-hide">
                          {(item.images || (item.imageUrl ? [item.imageUrl] : [])).map((img, idx) => (
                            <div key={idx} className="relative w-6 h-6 rounded border border-slate-100 overflow-hidden flex-shrink-0 group/thumb">
                              <img src={getSafeImageUrl(img)} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => {
                                  const currentImages = item.images || (item.imageUrl ? [item.imageUrl] : []);
                                  const filtered = currentImages.filter((_, i) => i !== idx);
                                  setCatalog(prev => prev.map(it => it.id === item.id ? { ...it, images: filtered, imageUrl: filtered[0] || '' } : it));
                                }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover/thumb:opacity-100 transition-all scale-75"
                              >
                                <X size={6} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-indigo-600 font-mono tracking-tight align-middle">
                      <div className="flex flex-col gap-2">
                        <span>{item.id}</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="file" 
                            id={`catalog-pdf-${item.id}`}
                            className="hidden" 
                            accept="application/pdf"
                            onChange={(e) => handleCatalogPdfUpload(item.id, e)}
                          />
                          <label 
                            htmlFor={`catalog-pdf-${item.id}`}
                            className={`p-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border ${item.pdfUrl ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-100'}`}
                            title={item.pdfUrl ? "Cambiar Ficha Técnica" : "Subir Ficha Técnica (PDF)"}
                          >
                            <Paperclip size={12} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">{item.pdfUrl ? 'PDF ✓' : 'Subir PDF'}</span>
                          </label>
                          {item.pdfUrl && (
                            <a 
                              href={item.pdfUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-1.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center"
                              title="Ver Ficha Técnica"
                            >
                              <FileText size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-600 align-middle max-w-md">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input 
                            type="text"
                            value={editCatalogData.name ?? item.name}
                            onChange={e => setEditCatalogData(prev => ({...prev, name: e.target.value}))}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                          />
                          <textarea 
                            value={editCatalogData.description ?? item.description}
                            onChange={e => setEditCatalogData(prev => ({...prev, description: e.target.value}))}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-600 focus:ring-1 focus:ring-indigo-500 outline-none h-14"
                          />
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-2 py-1">
                              <span className="text-[10px] font-bold text-slate-600">En Bodega</span>
                              <button
                                type="button"
                                onClick={() => setEditCatalogData(prev => ({ ...prev, enBodega: !(prev.enBodega ?? item.enBodega ?? false) }))}
                                className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                                  (editCatalogData.enBodega ?? item.enBodega ?? false) ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                              >
                                <div
                                  className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                                    (editCatalogData.enBodega ?? item.enBodega ?? false) ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>

                            <select
                              value={editCatalogData.modalidad ?? item.modalidad ?? 'stock'}
                              onChange={e => setEditCatalogData(prev => ({
                                ...prev,
                                modalidad: e.target.value as any,
                                tiempoEntrega: e.target.value !== 'venta_calzada' ? '' : (prev.tiempoEntrega ?? item.tiempoEntrega ?? '')
                              }))}
                              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold outline-none text-slate-800"
                            >
                              <option value="stock">En Stock</option>
                              <option value="venta_calzada">Venta Calzada</option>
                              <option value="agotado">Agotado</option>
                            </select>
                          </div>

                          {(editCatalogData.modalidad ?? item.modalidad) === 'venta_calzada' && (
                            <input 
                              type="text"
                              placeholder="Tiempo de Entrega (ej: 3-5 días)"
                              value={editCatalogData.tiempoEntrega ?? item.tiempoEntrega ?? ''}
                              onChange={e => setEditCatalogData(prev => ({ ...prev, tiempoEntrega: e.target.value }))}
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none"
                            />
                          )}

                          <div className="flex items-center gap-2">
                            <input 
                              type="file" 
                              id={`edit-pdf-${item.id}`}
                              className="hidden" 
                              accept="application/pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 1024 * 1024) return alert("El PDF debe ser menor a 1MB");
                                  const reader = new FileReader();
                                  reader.onloadend = () => setEditCatalogData(prev => ({...prev, pdfUrl: reader.result as string}));
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label 
                              htmlFor={`edit-pdf-${item.id}`}
                              className={`flex-1 flex items-center justify-center gap-2 px-3 py-1 border rounded-lg text-[10px] font-black uppercase cursor-pointer transition-all ${(editCatalogData.pdfUrl || item.pdfUrl) ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                            >
                              <Paperclip size={12} />
                              {(editCatalogData.pdfUrl || item.pdfUrl) ? 'Cambiar Ficha PDF' : 'Añadir Ficha PDF'}
                            </label>
                            {(editCatalogData.pdfUrl || item.pdfUrl) && (
                              <button 
                                onClick={() => setEditCatalogData(prev => ({...prev, pdfUrl: ''}))}
                                className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                title="Eliminar Ficha"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-bold text-slate-800 mb-1">{item.name}</div>
                          <div className="line-clamp-2 text-slate-500 mb-2">{item.description}</div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${item.enBodega ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                              {item.enBodega ? 'En Bodega ✓' : 'No en Bodega'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              item.modalidad === 'venta_calzada' ? 'bg-amber-100 text-amber-800' :
                              item.modalidad === 'agotado' ? 'bg-rose-100 text-rose-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {item.modalidad === 'venta_calzada' ? 'Venta Calzada' : item.modalidad === 'agotado' ? 'Agotado' : 'En Stock'}
                            </span>
                            {item.modalidad === 'venta_calzada' && item.tiempoEntrega && (
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[9px] font-bold">
                                ⏱️ {item.tiempoEntrega}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {isEditing ? (
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Costo:</span>
                            <input 
                              type="text"
                              value={editCatalogData.unitPrice !== undefined ? formatCLP(editCatalogData.unitPrice) : formatCLP(item.unitPrice)}
                              onChange={e => setEditCatalogData(prev => ({...prev, unitPrice: parseCLP(e.target.value)}))}
                              className="w-24 text-right bg-white border border-slate-200 rounded px-2 py-1 font-mono text-xs font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Venta:</span>
                            <input 
                              type="text"
                              value={formatCLP(editCatalogData.precioVentaFinal ?? item.precioVentaFinal ?? item.unitPrice ?? 0)}
                              onChange={e => setEditCatalogData(prev => ({...prev, precioVentaFinal: parseCLP(e.target.value)}))}
                              className="w-24 text-right bg-white border border-emerald-300 rounded px-2 py-1 font-mono text-xs font-bold text-emerald-700 focus:ring-1 focus:ring-emerald-500 outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">
                            Costo: <span className="font-mono text-slate-700">${(item.unitPrice || 0).toLocaleString('es-CL')}</span>
                          </div>
                          <div className="font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded inline-block text-xs border border-emerald-200">
                            Venta: ${((item.precioVentaFinal || item.unitPrice || 0)).toLocaleString('es-CL')}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button 
                              onClick={() => handleUpdateCatalogItem(item.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition shadow-sm"
                              title="Guardar Cambios"
                            >
                              <Check size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingCatalogId(null);
                                setEditCatalogData({});
                              }}
                              className="p-1.5 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 transition"
                              title="Cancelar"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setEditingCatalogId(item.id);
                                setEditCatalogData({
                                  name: item.name,
                                  description: item.description,
                                  unitPrice: item.unitPrice,
                                  enBodega: item.enBodega ?? false,
                                  modalidad: item.modalidad ?? 'stock',
                                  tiempoEntrega: item.tiempoEntrega ?? '',
                                  precioVentaFinal: item.precioVentaFinal ?? item.unitPrice ?? 0
                                });
                              }}
                              className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded hover:bg-slate-50 transition shadow-sm"
                              title="Editar Ítem"
                            >
                              <Edit3 size={14} />
                            </button>
                            <div className="h-6 w-px bg-slate-200 mx-1"></div>
                            <input 
                              type="number" 
                              min="1"
                              value={getCatalogQuantity(item.id)}
                              onChange={(e) => handleCatalogQuantityChange(item.id, Number(e.target.value))}
                              className="w-12 text-center border border-slate-200 rounded py-1 text-xs focus:ring-1 focus:ring-indigo-500 font-mono"
                            />
                            <button 
                              onClick={() => addItemFromCatalog(item)}
                              className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                              title="Añadir al Presupuesto"
                            >
                              <Plus size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCatalogItem(item.id)}
                              className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100 transition"
                              title="Eliminar del Catálogo"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    </motion.tr>
                  )})}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center text-center bg-slate-50 p-6 rounded-xl border border-slate-100 border-dashed">
            <p className="text-[10px] uppercase text-slate-500 font-bold mb-4">Los ítems se pueden añadir fácilmente desde la vista de propuesta.</p>
            <button onClick={() => setActiveTab('proposal')} className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg active:scale-95 flex items-center gap-2">
              <FileText size={16} /> Ir a Propuesta Actual
            </button>
          </div>
          {showCatalogImporter && (
            <CatalogImporter 
              onClose={() => setShowCatalogImporter(false)} 
              onSave={handleSaveImportedProducts} 
            />
          )}
        </div>
      );
    }

    if (isOwner && activeTab === 'crm') {
      return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Cargando Módulo CRM & Cotizaciones...</div>}>
          <CRMModule 
            clients={clients}
            clientSearchTerm={clientSearchTerm}
            setClientSearchTerm={setClientSearchTerm}
            newClient={newClient}
            setNewClient={setNewClient}
            saveClient={saveClient}
            isSavingClient={isSavingClient}
            editingClientId={editingClientId}
            startEditClient={startEditClient}
            deleteClient={deleteClient}
            isFetchingClients={isFetchingClients}
            previousQuotes={previousQuotes}
            isConfirmedStatus={isConfirmedStatus}
            crmRawText={crmRawText}
            setCrmRawText={setCrmRawText}
            processCrmTextWithAI={processCrmTextWithAI}
            isCrmAiImporting={isCrmAiImporting}
            catalog={catalog}
          />
        </Suspense>
      );
    }

    if (isOwner && activeTab === 'finances') {
      const { 
        totalIncome, 
        grossMarginValue, 
        grossMarginPercent, 
        ebitda, 
        ebitdaMargin, 
        netMargin, 
        netMarginPercent, 
        breakEvenPoint,
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
        <div className="space-y-5">
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
             <div className="bg-emerald-600 p-3.5 rounded-2xl border border-emerald-500 shadow-md text-white">
                <p className="text-[7px] font-black uppercase tracking-widest mb-1 flex items-center gap-1 opacity-80">
                  <Banknote size={10} /> Saldo Caja
                </p>
                <div className="text-lg font-black leading-none">
                  ${Math.round(financialMetrics.cashBalance).toLocaleString()}
                </div>
             </div>
             <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Por Cobrar</p>
                <div className="text-lg font-black text-slate-900 leading-none">
                  ${Math.round(financialMetrics.accountsReceivable).toLocaleString()}
                </div>
             </div>
             <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Por Pagar</p>
                <div className="text-lg font-black text-slate-900 leading-none">
                  ${Math.round(financialMetrics.accountsPayable).toLocaleString()}
                </div>
             </div>
             <div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-100 shadow-sm text-indigo-600">
                <p className="text-[7px] font-black uppercase tracking-widest mb-1">Cap. Trabajo</p>
                <div className="text-lg font-black leading-none">
                  ${Math.round(financialMetrics.liquidityPosition).toLocaleString()}
                </div>
             </div>
          </div>

          {/* Sincronizador de Calce */}
          <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="p-2 bg-amber-500/20 text-amber-600 rounded-xl">
                <RefreshCw size={20} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Ajuste de Realidad</h4>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Sincroniza tu bolsillo con el sistema.</p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-black text-slate-900 outline-none w-28"
                  placeholder="Monto Real"
                  onChange={(e) => (window as any)._lastManualBalanceFinances = parseFloat(e.target.value)}
                />
                <button 
                  onClick={async () => {
                    const val = (window as any)._lastManualBalanceFinances;
                    if (val === undefined) return alert("Ingresa tu saldo real");
                    const diff = val - financialMetrics.cashBalance;
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
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Ejecutivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ventas Brutas</p>
                <h3 className="text-xl font-black text-white leading-none">${totalIncome.toLocaleString()}</h3>
             </div>

             <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-indigo-600">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Margen Bruto</p>
                <h3 className="text-xl font-black leading-none">${grossMarginValue.toLocaleString()}</h3>
             </div>

             <div className={`p-5 rounded-2xl border shadow-xl ${ebitda >= 0 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-rose-600 text-white border-rose-500'}`}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">EBITDA</p>
                <h3 className="text-xl font-black leading-none">${ebitda.toLocaleString()}</h3>
             </div>

             <div className={`p-5 rounded-2xl border shadow-xl ${netMargin >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Neto Final</p>
                <h3 className="text-xl font-black leading-none">${netMargin.toLocaleString()}</h3>
             </div>
          </div>

          {/* Analisis Saas Metrics & Break-even */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${isBreakedEven ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                   <Target size={24} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Punto de Equilibrio</p>
                   <h4 className="text-xl font-black text-slate-900 leading-none">${breakEvenPoint.toLocaleString(undefined, {maximumFractionDigits: 0})}</h4>
                   <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">
                     {isBreakedEven ? '¡En zona de Ganancia!' : `Faltan $${salesGap.toLocaleString(undefined, {maximumFractionDigits: 0})} para ser rentable`}
                   </p>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                <div className="p-4 rounded-2xl bg-indigo-100 text-indigo-600">
                   <BarChart4 size={24} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Costo Operativo + Mermas</p>
                   <h4 className="text-xl font-black text-slate-900 leading-none">${totalOutflow.toLocaleString()}</h4>
                   <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">OpEx + Pérdidas de Stock</p>
                </div>
             </div>

             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
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
               className="lg:col-span-2 space-y-6"
             >
                {/* P&L Structure (Table) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                   <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <ReceiptText size={18} className="text-emerald-500" /> Estructura de Resultados (P&L)
                   </h2>
                   <div className="space-y-2">
                      <div className="flex justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100 italic">
                         <span className="text-xs text-slate-600 font-bold">Ingresos Totales (Sales)</span>
                         <span className="text-xs text-slate-900 font-black">${totalIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100">
                         <span className="text-xs text-slate-400 px-4">- Costos Directos (COGS)</span>
                         <span className="text-xs text-rose-500 font-bold">-${totalDirectCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 bg-slate-50 rounded-lg mt-2">
                         <span className="text-xs text-slate-900 font-black">UTILIDAD BRUTA</span>
                         <span className="text-xs text-indigo-600 font-bold">${grossMarginValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100">
                         <span className="text-xs text-slate-400 px-4">- Gastos Operativos (OpEx)</span>
                         <span className="text-xs text-rose-500 font-bold">-${totalOpEx.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-indigo-600 text-white rounded-xl mt-2 shadow-md">
                         <span className="text-xs font-black tracking-widest">EBITDA</span>
                         <span className="text-xs font-black">${ebitda.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100">
                         <span className="text-xs text-slate-400 px-4">- Impuestos (Tax)</span>
                         <span className="text-xs text-rose-400">-${taxExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100">
                         <span className="text-xs text-slate-400 px-4">- Intereses (Interest)</span>
                         <span className="text-xs text-rose-400">-${interestExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-100">
                         <span className="text-xs text-slate-400 px-4">- Amortizaciones (DA)</span>
                         <span className="text-xs text-rose-400">-${amortizationExpenses.toLocaleString()}</span>
                      </div>
                      <div className={`flex justify-between p-4 rounded-2xl mt-4 border-2 ${netMargin >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                         <span className="text-sm font-black uppercase tracking-tighter">UTILIDAD NETA (FINAL)</span>
                         <span className="text-sm font-black">${netMargin.toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                {/* Historial Rapido */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ultimos Egresos Registrados</h3>
                      <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">Total: ${totalExpenses.toLocaleString()}</span>
                   </div>
                   <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {expenses.slice(0, 10).map(exp => (
                         <div key={exp.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-all group">
                            <div className="flex items-center gap-3">
                               <div className={`p-1.5 rounded-lg ${
                                  ['impuesto', 'interes', 'amortizacion'].includes(exp.category) ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'
                               }`}>
                                  <CreditCard size={14} />
                               </div>
                               <div>
                                  <h4 className="text-xs font-bold text-slate-800 leading-tight">{exp.name}</h4>
                                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{exp.category}</span>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <span className="text-xs font-black text-rose-600">-${exp.amount.toLocaleString()}</span>
                               <button 
                                 onClick={() => deleteExpense(exp.id)}
                                 className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg transition-all"
                               >
                                  <Trash2 size={12} />
                               </button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      );
    }

    if (isOwner && activeTab === 'cashflow') {
      return (
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin text-indigo-600 mb-2" size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Cargando Control de Caja & Márgenes...</span>
          </div>
        }>
          <CashFlowModule 
            cashTransactions={cashTransactions}
            cashSearchTerm={cashSearchTerm}
            setCashSearchTerm={setCashSearchTerm}
            newCashTransaction={newCashTransaction}
            setNewCashTransaction={setNewCashTransaction}
            saveCashTransaction={saveCashTransaction}
            isSavingCash={isSavingCash}
            deleteCashTransaction={deleteCashTransaction}
            catalog={catalog}
            previousQuotes={previousQuotes}
            purchaseRecords={purchaseRecords}
            importBatches={importBatches}
            isConfirmedStatus={isConfirmedStatus}
          />
        </Suspense>
      );
    }

    if (isOwner && activeTab === 'admin' && user?.email === 'iafacilchile@gmail.com') {
      return <AdminDashboard />;
    }

    if (isOwner && activeTab === 'purchases') {
      return (
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin text-indigo-600 mb-2" size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest">Cargando Módulo...</span>
          </div>
        }>
          <PurchasesModule 
            purchases={purchaseRecords}
            purchaseSearchTerm={purchaseSearchTerm}
            setPurchaseSearchTerm={setPurchaseSearchTerm}
            newPurchase={newPurchase}
            setNewPurchase={setNewPurchase}
            savePurchase={savePurchase}
            isSavingPurchase={isSavingPurchase}
            editPurchase={editPurchase}
            editingPurchaseId={editingPurchaseId}
            deletePurchase={deletePurchase}
            togglePurchasePaid={togglePurchasePaid}
            isAiUploadingPurchase={isAiUploadingPurchase}
            handlePurchaseFileUpload={handlePurchaseFileUpload}
            importBatches={importBatches}
            importRawText={importRawText}
            setImportRawText={setImportRawText}
            processImportWithAI={processImportWithAI}
            isAiImporting={isAiImporting}
            newImport={newImport}
            setNewImport={setNewImport}
            saveImport={saveImport}
            isSavingImport={isSavingImport}
            deleteImport={deleteImport}
            handleFileUpload={handleFileUpload}
            loadHistoricalFromImages={loadHistoricalFromImages}
            isSeeding={isSeeding}
          />
        </Suspense>
      );
    }

    if (isOwner && activeTab === 'credits') {
      const totalCreditLimit = creditLines.reduce((acc, curr) => acc + curr.totalLimit, 0);
      const totalUsedCredit = creditLines.reduce((acc, curr) => acc + curr.usedAmount, 0);
      const availableLeverage = totalCreditLimit - totalUsedCredit;
      const leveragePercentage = totalCreditLimit > 0 ? (totalUsedCredit / totalCreditLimit) * 100 : 0;

      return (
        <div className="space-y-5">
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
             <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Cupo Total</p>
                <h3 className="text-lg font-black text-white leading-none">${totalCreditLimit.toLocaleString()}</h3>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-rose-600">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Deuda Activa</p>
                <h3 className="text-lg font-black leading-none">${totalUsedCredit.toLocaleString()}</h3>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-emerald-600 lg:col-span-2">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacidad Disponible</p>
                <div className="flex items-end justify-between gap-3">
                   <h3 className="text-xl font-black leading-none">${availableLeverage.toLocaleString()}</h3>
                   <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${100 - leveragePercentage}%` }}
                       className="h-full bg-emerald-500"
                     />
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
             <motion.div 
               id="credit-form-section"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
             >
                <div className="flex justify-between items-center mb-4">
                   <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <PlusCircle size={16} className={editingCreditId ? "text-amber-500" : "text-indigo-600"} /> 
                     {editingCreditId ? "Editar Cupo" : "Nuevo Cupo"}
                   </h2>
                </div>
                <div className="space-y-3">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Entidad Financiera</label>
                      <input 
                        type="text" 
                        value={newCredit.institution}
                        onChange={e => setNewCredit({...newCredit, institution: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Ej: Banco de Chile..."
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                         <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Cupo Máximo</label>
                         <input 
                           type="number" 
                           value={newCredit.totalLimit || ''}
                           onChange={e => setNewCredit({...newCredit, totalLimit: Number(e.target.value)})}
                           className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Deuda Actual</label>
                         <input 
                           type="number" 
                           value={newCredit.usedAmount || ''}
                           onChange={e => setNewCredit({...newCredit, usedAmount: Number(e.target.value)})}
                           className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-rose-600"
                         />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                         <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Día Corte</label>
                         <input 
                           type="number" 
                           min="1" max="31"
                           value={newCredit.cutoffDay}
                           onChange={e => setNewCredit({...newCredit, cutoffDay: Number(e.target.value)})}
                           className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Día Pago</label>
                         <input 
                           type="number" 
                           min="1" max="31"
                           value={newCredit.paymentDay}
                           onChange={e => setNewCredit({...newCredit, paymentDay: Number(e.target.value)})}
                           className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                         />
                      </div>
                   </div>
                   <button 
                     onClick={saveCredit}
                     disabled={isSavingCredit}
                     className={`w-full py-3 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 mt-2 ${editingCreditId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-indigo-600'}`}
                   >
                      {isSavingCredit ? <Loader2 className="animate-spin mx-auto" size={16} /> : (editingCreditId ? "Actualizar" : "Vincular")}
                   </button>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
             >
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Layout size={18} className="text-amber-500" /> Monitoreo de Casas Comerciales
                </h2>
                
                <div className="flex-1 overflow-y-auto space-y-4 max-h-[600px] pr-2">
                   {creditLines.map(credit => (
                      <div key={credit.id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-200 transition-all group">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-slate-100 font-black text-lg">
                                  {credit.institution.charAt(0)}
                               </div>
                               <div>
                                  <h4 className="text-base font-black text-slate-900">{credit.institution}</h4>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cupo: ${credit.totalLimit.toLocaleString()}</span>
                               </div>
                            </div>
                            <div className="text-right">
                               <span className="text-sm font-black text-slate-900 leading-none">${(credit.totalLimit - credit.usedAmount).toLocaleString()}</span>
                               <p className="text-[9px] font-black uppercase text-emerald-500 mt-1">Disponible</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-white p-3 rounded-2xl border border-slate-100">
                               <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Día de Corte</p>
                               <span className="text-xs font-black text-slate-700">{credit.cutoffDay} de cada mes</span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-slate-100">
                               <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Día de Pago</p>
                               <span className="text-xs font-black text-indigo-600">{credit.paymentDay} de cada mes</span>
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-slate-100">
                               <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Uso de Línea</p>
                               <span className="text-xs font-black text-rose-500">{((credit.usedAmount / credit.totalLimit) * 100).toFixed(0)}%</span>
                            </div>
                         </div>

                         <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                            <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${credit.usedAmount > credit.totalLimit * 0.8 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                               <span className="text-[9px] font-black text-slate-400 uppercase">Salud Crediticia</span>
                            </div>
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => {
                                   setActiveAbonoCreditId(credit.id);
                                   setAbonoAmount(0);
                                 }}
                                 className="p-1.5 px-3 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                               >
                                  Abonar
                               </button>
                               <button 
                                 onClick={() => startEditCredit(credit)}
                                 className="p-1.5 px-3 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                               >
                                  Editar
                               </button>
                               <button 
                                 onClick={() => deleteCredit(credit.id)}
                                 className="p-1.5 px-3 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                               >
                                  Desvincular
                               </button>
                            </div>
                         </div>
                         {activeAbonoCreditId === credit.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="mt-4 pt-4 border-t border-slate-200/50 space-y-3"
                            >
                              <div className="flex gap-3 items-end">
                                <div className="flex-1 space-y-1">
                                  <label className="text-[8px] font-black uppercase text-slate-400">Monto del Abono ($)</label>
                                  <input 
                                    type="number"
                                    placeholder="Ej: 50000"
                                    value={abonoAmount || ''}
                                    onChange={e => setAbonoAmount(Number(e.target.value))}
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                </div>
                                <button 
                                  onClick={() => handleRegisterAbono(credit)}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                                >
                                  Confirmar Pago
                                </button>
                                <button 
                                  onClick={() => {
                                    setActiveAbonoCreditId(null);
                                    setAbonoAmount(0);
                                  }}
                                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </motion.div>
                          )}
                      </div>
                   ))}
                   {creditLines.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 mt-20">
                         <Layout size={48} className="opacity-20 mb-4" />
                         <p className="text-[10px] font-black uppercase tracking-widest">Sin líneas de crédito configuradas</p>
                         <p className="text-[9px] text-slate-400 mt-2">Agrega tus tarjetas y créditos para ver tu capacidad de apalancamiento</p>
                      </div>
                   )}
                </div>
             </motion.div>
          </div>
        </div>
      );
    }

    if (isOwner && activeTab === 'mermas') {
      const totalShrinkageCost = shrinkages.reduce((acc, curr) => acc + (curr.unitCost * curr.quantity), 0);
      const shrinkageCount = shrinkages.length;

      return (
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 flex items-center gap-3">
                <Trash2 className="text-rose-600" size={20} />
                Control de Mermas & Pérdidas
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Registro de stock dañado o no apto para venta.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             <div className="bg-rose-900 p-4 rounded-2xl border border-rose-800 shadow-xl overflow-hidden relative group">
                <p className="text-[8px] font-black text-rose-300 uppercase tracking-widest mb-1">Costo Total Mermas</p>
                <h3 className="text-lg font-black text-white leading-none">${totalShrinkageCost.toLocaleString()}</h3>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-slate-600">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Registros</p>
                <h3 className="text-lg font-black leading-none">{shrinkageCount}</h3>
             </div>
             <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-slate-600">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Costo Promedio</p>
                <h3 className="text-lg font-black leading-none">${shrinkageCount > 0 ? (totalShrinkageCost / shrinkageCount).toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</h3>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
             >
                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <PlusCircle size={16} className="text-rose-600" /> Nueva Merma
                </h2>
                <div className="space-y-3">
                   <div className="space-y-1 text-left">
                      <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Producto</label>
                      <input 
                        type="text" 
                        value={newShrinkage.productName}
                        onChange={e => setNewShrinkage({...newShrinkage, productName: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1 text-left">
                          <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Cant.</label>
                          <input 
                            type="number" 
                            value={newShrinkage.quantity || ''}
                            onChange={e => setNewShrinkage({...newShrinkage, quantity: Number(e.target.value)})}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-black outline-none"
                          />
                       </div>
                       <div className="space-y-1 text-left">
                          <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Costo U.</label>
                          <input 
                            type="number" 
                            value={newShrinkage.unitCost || ''}
                            onChange={e => setNewShrinkage({...newShrinkage, unitCost: Number(e.target.value)})}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-black outline-none"
                          />
                       </div>
                    </div>
                   <button 
                     onClick={saveShrinkage}
                     disabled={isSavingShrinkage}
                     className="w-full py-2.5 bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all font-mono"
                   >
                      Registrar
                   </button>
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col"
             >
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <History size={18} className="text-slate-400" /> Historial de Mermas
                   </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 max-h-[600px] pr-2">
                   {shrinkages.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-rose-200 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl bg-rose-100 text-rose-600`}>
                               <AlertTriangle size={16} />
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-black text-slate-800">{s.productName}</h4>
                                  <span className="px-2 py-0.5 bg-slate-200 rounded text-[8px] font-black uppercase text-slate-500">
                                     {s.reason}
                                  </span>
                               </div>
                               <p className="text-[9px] font-bold text-slate-400 uppercase">
                                 {s.quantity} unidad(es) • {s.date instanceof Timestamp ? s.date.toDate().toLocaleDateString() : 'Fecha pendiente'}
                               </p>
                               {s.description && (
                                 <p className="text-[10px] text-slate-500 italic mt-1">{s.description}</p>
                               )}
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="text-right">
                               <span className="text-sm font-black text-rose-600 block">
                                  -${(s.unitCost * s.quantity).toLocaleString()}
                               </span>
                               <span className="text-[8px] font-bold text-slate-400 uppercase">Perjuicio Económico</span>
                            </div>
                            <button 
                              onClick={() => deleteShrinkage(s.id)}
                              className="p-1.5 text-slate-300 hover:text-rose-500 transition-opacity opacity-0 group-hover:opacity-100"
                            >
                               <Trash2 size={14} />
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
    }

    if (isOwner && activeTab === 'stock') {
      return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Cargando Módulo de Stock...</div>}>
          <StockModule 
            importBatches={importBatches}
            shrinkages={shrinkages}
            previousQuotes={previousQuotes}
            catalog={catalog}
            isConfirmedStatus={isConfirmedStatus}
            onUpdateCatalogItem={handleUpdateCatalogItemFromStock}
            onAddCatalogItem={handleAddCatalogItemFromStock}
          />
        </Suspense>
      );
    }




    if (isOwner && activeTab === 'promoters') {
      return (
        <PromotersModule 
          previousQuotes={previousQuotes}
          promoters={promoters}
          onPromotersChange={setPromoters}
          onRegisterCashOutflow={async (amount, concept) => {
            if (amount <= 0 || !user) return;
            const effectiveUid = localStorage.getItem('impersonatedUserId') || user.uid;
            try {
              const transactionId = `cash-${Date.now()}`;
              await setDoc(doc(db, "cashTransactions", transactionId), removeUndefined({
                id: transactionId,
                concept: concept || 'PAGO COMISIÓN PROMOTOR',
                type: 'out',
                amount: amount,
                ownerId: effectiveUid,
                date: serverTimestamp()
              }));
              toast.success(`$${amount.toLocaleString()} registrado como Egreso en Flujo de Caja.`);
            } catch (err) {
              console.error("Error saving cash outflow:", err);
            }
          }}
        />
      );
    }

    // DEFAULT: Return null to allow the main return statement to handle the proposal editor
    return null;
  };



  const downloadPDF = async () => {
    setIsExporting(true);
    try {
      // Trigger native browser print dialog configured for vector A4 PDF export
      window.print();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Para obtener el PDF Oficial sin recortes, presiona Ctrl+P (o Cmd+P) y selecciona 'Guardar como PDF'.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="animate-spin text-indigo-600" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Iniciando Ecosistema...</p>
      </div>
    );
  }

  // Si no hay usuario y no estamos viendo una cotización específica (por link), mostrar Landing Page
  if (!user && !hasQuoteInUrl) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-2 flex flex-col relative">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 12mm 14mm 12mm;
          }
          * {
            box-sizing: border-box !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: optimizeLegibility !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-break { page-break-after: always !important; break-after: page !important; }
          .print-break:last-child, .print-break:last-of-type { page-break-after: avoid !important; break-after: avoid !important; }
          .print-avoid-break, tr, tbody, table, img, .print-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          h1, h2, h3, h4 {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .shadow-sm, .shadow-md, .shadow-xl { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        }
        .signature-canvas { cursor: crosshair; }
      `}</style>
      <AnimatePresence>
        {isLoadingQuote && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center flex-col gap-4"
          >
            <Loader2 size={48} className="animate-spin text-indigo-600" />
            <p className="text-sm font-bold text-slate-600 animate-pulse uppercase tracking-widest">Sincronizando con la Nube...</p>
          </motion.div>
        )}
        {isOptimizing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/40 backdrop-blur-sm z-[100] flex items-center justify-center flex-col gap-4"
          >
            <Loader2 size={32} className="animate-spin text-indigo-600" />
            <p className="text-xs font-bold text-slate-700 uppercase tracking-widest bg-white p-4 rounded-xl shadow-2xl border border-indigo-100">
              Optimizando imagen para envío rápido...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Settings Modal */}
      <AnimatePresence>
        {showProfileSettings && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileSettings(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black tracking-tight leading-none mb-1">MI PERFIL PROFESIONAL</h2>
                  <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest">Configura tu sello e información de contacto para tus presupuestos</p>
                </div>
                <button 
                  onClick={() => setShowProfileSettings(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-indigo-600" /> Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={userProfile.name}
                        onChange={e => setUserProfile({...userProfile, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Cargo / Rol</label>
                      <input 
                        type="text" 
                        value={userProfile.role}
                        onChange={e => setUserProfile({...userProfile, role: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Público</label>
                      <input 
                        type="email" 
                        value={userProfile.email}
                        onChange={e => setUserProfile({...userProfile, email: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">WhatsApp de Contacto</label>
                      <input 
                        type="tel" 
                        placeholder="+56 9 ..."
                        value={userProfile.phone}
                        onChange={e => setUserProfile({...userProfile, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={14} className="text-indigo-600" /> Información de Empresa / Marca
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nombre de la Empresa</label>
                      <input 
                        type="text" 
                        value={userProfile.companyName}
                        onChange={e => setUserProfile({...userProfile, companyName: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">RUT / Identificación Fiscal</label>
                      <input 
                        type="text" 
                        value={userProfile.companyRut}
                        onChange={e => setUserProfile({...userProfile, companyRut: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Subtítulo / Especialidad</label>
                      <input 
                        type="text" 
                        value={userProfile.companySubtitle}
                        onChange={e => setUserProfile({...userProfile, companySubtitle: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Dirección o Ubicación</label>
                      <input 
                        type="text" 
                        value={userProfile.companyAddress}
                        onChange={e => setUserProfile({...userProfile, companyAddress: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Datos de Pago / Transferencia</label>
                       <textarea 
                         rows={3}
                         value={(userProfile as any).paymentInfo}
                         onChange={e => setUserProfile({...userProfile, paymentInfo: e.target.value})}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                         placeholder="Ej: Banco Estado, Cuenta Rut, 12.345.678-9, etc."
                       />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Logo de la Empresa (Opcional)</label>
                      <div className="flex gap-4 items-center">
                        {(userProfile as any).companyLogo && (
                          <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex-shrink-0 flex items-center justify-center">
                            <img src={(userProfile as any).companyLogo} className="max-w-full max-h-full object-contain" alt="Logo" />
                          </div>
                        )}
                        <label className="flex-1 cursor-pointer group">
                          <div className="w-full px-4 py-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                            <ImageIcon size={14} /> {(userProfile as any).companyLogo ? 'Cambiar Logo' : 'Subir Logo PNG/JPG'}
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 500 * 1024) return alert("El logo debe ser menor a 500KB");
                                const reader = new FileReader();
                                reader.onloadend = () => setUserProfile({...userProfile, companyLogo: reader.result as string});
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        {(userProfile as any).companyLogo && (
                          <button 
                            onClick={() => setUserProfile({...userProfile, companyLogo: ''})}
                            className="p-3 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowProfileSettings(false)}
                  className="px-6 py-3 bg-white text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 border border-slate-200"
                >
                  Cancelar
                </button>
                <button 
                  onClick={saveProfile}
                  className="px-10 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100 flex items-center gap-2"
                >
                  {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Guardar Perfil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Quote Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Share2 size={18} /> Compartir Presupuesto
                </h3>
                <button onClick={() => setShowShareModal(false)} className="hover:bg-white/10 p-1 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enlace Directo para el Cliente</p>
                  <div className="flex gap-2 p-1.5 bg-slate-50 border-2 border-slate-100 rounded-2xl items-center shadow-inner group focus-within:border-indigo-100 transition-all">
                    <input 
                      type="text" 
                      readOnly 
                      value={`${window.location.origin}${window.location.pathname}?quoteId=${quoteRefId}`}
                      className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-slate-600 px-3 truncate"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button 
                      onClick={async () => {
                        const url = `${window.location.origin}${window.location.pathname}?quoteId=${quoteRefId}`;
                        try {
                          await navigator.clipboard.writeText(url);
                          alert("¡Copiado!");
                        } catch (err) {
                          console.error("Clipboard failed", err);
                          window.prompt("Copia este enlace:", url);
                        }
                      }}
                      className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium italic">
                    * Envía este enlace directamente a tu cliente por cualquier medio (WhatsApp, Email, etc). No necesita registrarse para verlo.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      const shareLink = `${window.location.origin}${window.location.pathname}?quoteId=${quoteRefId}`;
                      const msg = `Estimados, adjunto la propuesta técnica: ${shareLink}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-100 active:scale-95"
                  >
                    <MessageSquare size={16} /> Enviar por WhatsApp
                  </button>
                  <button 
                    onClick={() => {
                      const shareLink = `${window.location.origin}${window.location.pathname}?quoteId=${quoteRefId}`;
                      const subject = encodeURIComponent("Propuesta Comercial - IA FACILCHILE");
                      const body = encodeURIComponent(`Hola,\n\nPuedes revisar la propuesta comercial aquí: ${shareLink}\n\nQuedamos atentos.`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-100 active:scale-95"
                  >
                    <Send size={16} /> Enviar por Email
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signature Modal */}
              <AnimatePresence>
                {showSignaturePad && (
                  <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowSignaturePad(false)}
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-slate-200"
                    >
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2 uppercase text-xs tracking-widest">
                          <PenTool size={18} className="text-indigo-600" />
                          Firma Digital del Documento
                        </h3>
                        <button onClick={() => setShowSignaturePad(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
                      </div>
                      <div className="p-8">
                        <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 overflow-hidden mb-4">
                          <SignatureCanvas 
                            ref={sigPad}
                            penColor="#0f172a"
                            canvasProps={{
                              className: 'signature-canvas w-full h-48',
                              width: 500,
                              height: 200
                            }}
                          />
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={clearSignature}
                            className="flex-1 py-3 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors"
                          >
                            Limpiar
                          </button>
                          <button 
                            onClick={saveSignature}
                            className="flex-3 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                          >
                            Confirmar Firma
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Modal de Complementos */}

      <div ref={printRef} className="contenedor-principal mx-auto w-full flex flex-grow flex-col bg-white p-4 rounded-2xl">
        {localStorage.getItem('impersonatedUserId') && (
          <div className="w-full bg-rose-600 text-white p-3 text-center text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 mb-3 rounded-xl shadow-lg animate-pulse">
            <Activity size={16} /> MODO SOPORTE ACTIVO (ID: {localStorage.getItem('impersonatedUserId')}) - Todos los cambios afectarán a este cliente.
          </div>
        )}
        {/* Header Section - Hidden on print */}
        <header className="w-full flex flex-col md:flex-row justify-between items-center mb-3 gap-3 print:hidden relative z-[50]">
          <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg text-white bg-slate-900">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900 uppercase">
                {isOwner ? userProfile.companyName : (loadedSenderInfo?.companyName || "PRESUPUESTO")}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <Settings size={10} />
                  Config: {quoteRefId}
                </div>
                {isOwner ? (
                  <>
                    <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl mr-2">
                        <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
                            <Banknote size={14} />
                        </div>
                        <div>
                            <p className="text-[7px] font-black text-emerald-600 uppercase tracking-widest leading-none">Caja en Mano</p>
                            <button 
                              onClick={() => {
                                setActiveTab('finances');
                                setViewMode('editor');
                              }}
                              className="text-[11px] font-black text-slate-900 leading-none mt-0.5 hover:underline decoration-emerald-500 decoration-2 underline-offset-2"
                            >
                                ${Math.round(financialMetrics.cashBalance).toLocaleString()}
                            </button>
                        </div>
                    </div>
                    <div className="flex overflow-x-auto max-w-full no-scrollbar whitespace-nowrap bg-slate-200 rounded-xl p-1 shadow-inner border border-slate-300 gap-1 items-center">
                      <button 
                        onClick={() => {
                          setActiveTab('proposal');
                          setViewMode('editor');
                          setShowClientPreview(false);
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${viewMode === 'editor' && activeTab === 'proposal' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <PlusCircle size={10} /> Cotizador
                      </button>
                      {profile === 'security' && (
                        <button 
                          onClick={() => {
                            setActiveTab('proposal');
                            setViewMode('editor');
                            setShowClientPreview(false);
                            // Scroll to tech section
                            setTimeout(() => {
                              document.getElementById('tech-annex-section')?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${viewMode === 'editor' && activeTab === 'proposal' && !showClientPreview ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          <FileText size={10} /> Ficha
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setViewMode('dashboard');
                          setActiveTab('proposal');
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${viewMode === 'dashboard' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <LayoutDashboard size={10} /> Dashboard
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab('catalog');
                          setViewMode('editor');
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'catalog' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <ShieldAlert size={10} /> Catálogo
                      </button>
                      <button 
                        onClick={() => setActiveTab('crm')}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'crm' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <Users size={10} /> CRM
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab('promoters');
                          setViewMode('editor');
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'promoters' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <Award size={10} /> Comisiones
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab('finances');
                          setViewMode('editor');
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'finances' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <CreditCard size={10} /> Finanzas
                        {!hasPremiumAccess && <Lock size={8} className="ml-auto opacity-50" />}
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab('credits');
                          setViewMode('editor');
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'credits' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <Layout size={10} /> Créditos
                        {!hasPremiumAccess && <Lock size={8} className="ml-auto opacity-50" />}
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab('cashflow');
                          setViewMode('editor');
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'cashflow' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <Banknote size={10} /> Caja
                        {!hasPremiumAccess && <Lock size={8} className="ml-auto opacity-50" />}
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab('purchases');
                          setViewMode('editor');
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'purchases' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <ReceiptText size={10} /> Compras
                        {!hasPremiumAccess && <Lock size={8} className="ml-auto opacity-50" />}
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab('mermas');
                          setViewMode('editor');
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'mermas' ? 'bg-white text-rose-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <Trash2 size={10} /> Mermas
                        {!hasPremiumAccess && <Lock size={8} className="ml-auto opacity-50" />}
                      </button>
                      <button 
                        onClick={() => {
                          setActiveTab('stock');
                          setViewMode('editor');
                        }}
                        className={`shrink-0 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'stock' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <Package size={10} /> Stock
                        {!hasPremiumAccess && <Lock size={8} className="ml-auto opacity-50" />}
                      </button>

                      {user?.email === 'iafacilchile@gmail.com' && (
                        <button 
                          onClick={() => {
                            setActiveTab('admin');
                            setViewMode('editor');
                            setShowClientPreview(false);
                          }}
                          className={`shrink-0 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'admin' ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-500' : 'bg-slate-900 text-amber-400 hover:bg-slate-800'} ml-3 shadow-lg`}
                        >
                          <ShieldAlert size={10} /> Master Panel
                        </button>
                      )}
                    </div>
                    <div className="flex bg-slate-200 rounded-xl p-1 shadow-inner border border-slate-300">
                      <div className="px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg bg-white text-teal-600 shadow-md flex items-center gap-1.5">
                        <ShieldCheck size={10} /> SEGURIDAD
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                    status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    status === 'sent' ? 'bg-blue-100 text-blue-700' :
                    status === 'rejected' ? 'bg-red-100 text-red-700' :
                    status === 'paid' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {status === 'draft' ? 'Estado: Borrador' :
                     status === 'sent' ? 'Estado: Enviado' :
                     status === 'approved' ? 'Estado: Aprobado' :
                     status === 'rejected' ? 'Estado: Rechazado' : 'Estado: Pagado'}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            {isOwner && activeTab === 'proposal' && (
              <div className="flex items-center gap-2.5 bg-slate-100/50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                <button 
                  onClick={() => setShowClientPreview(!showClientPreview)}
                  className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors ${showClientPreview ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Eye size={10} /> {showClientPreview ? "Editor" : "Cliente"}
                </button>
                {!showClientPreview && (
                  <>
                    <span className="w-px h-3 bg-slate-200"></span>
                    <button 
                      onClick={() => setShowProfileSettings(true)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-[9px] font-black uppercase tracking-widest"
                    >
                      Perfil
                    </button>
                    <span className="w-px h-3 bg-slate-200"></span>
                    <button 
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-[9px] font-black uppercase tracking-widest"
                    >
                      Archivos
                    </button>
                    <span className="w-px h-3 bg-slate-200"></span>
                    <button 
                      onClick={resetToDefault}
                      className="text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 text-[9px] font-black uppercase tracking-widest"
                    >
                      Nuevo
                    </button>
                    <span className="w-px h-3 bg-slate-200"></span>
                    <label className="cursor-pointer text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 text-[9px] font-black uppercase tracking-widest">
                      <Upload size={10} /> SII
                      <input type="file" accept=".csv" className="hidden" onChange={handleImportSII} />
                    </label>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 text-white items-center flex-wrap justify-end">
          {isOwner && (
            <div className="flex gap-1.5 order-2 md:order-1">
              <button 
                onClick={() => saveQuoteToFirebase(false)}
                disabled={isSaving}
                className="px-3 py-1.5 bg-indigo-600 border border-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-200/50 disabled:opacity-50 active:scale-95 text-white"
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />} 
                Guardar
              </button>

                <button 
                  onClick={async () => {
                    await saveQuoteToFirebase(true);
                    const shareLink = `${window.location.origin}${window.location.pathname}?quoteId=${quoteRefId}`;
                    const msg = `Estimados, adjunto la propuesta técnica: ${shareLink}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 border border-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200/50 active:scale-95 text-white"
                >
                <MessageSquare size={14} /> WhatsApp
              </button>

              {/* Botones de Acción Post-Guardado (Solo después de guardar si no estaban ya) */}
              {hasBeenSaved && !isSaving && (
                <>
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={async () => {
                      const success = await saveQuoteToFirebase(true);
                      if (!success) return;
                      const shareLink = `${window.location.origin}${window.location.pathname}?quoteId=${quoteRefId}`;
                      const subject = encodeURIComponent("Propuesta Comercial - IA FACILCHILE");
                      const body = encodeURIComponent(`Hola,\n\nPuedes revisar la propuesta comercial aquí: ${shareLink}\n\nQuedamos atentos.`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    className="px-3 py-1.5 bg-blue-600 border border-blue-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md active:scale-95 text-white"
                  >
                    <Send size={14} /> Email
                  </motion.button>
                </>
              )}
            </div>
          )}
          
          {isOwner && (
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin);
                toast.success('¡Enlace de la aplicación copiado al portapapeles!');
              }}
              className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 order-2 md:order-1"
              title="Copiar link público del CRM"
            >
              <Share2 size={14} /> Compartir App
            </button>
          )}
          
          {(isOwner) && (
            <button 
              onClick={async () => {
                if (isSaving) return;
                const success = await saveQuoteToFirebase(true);
                if (success) setShowShareModal(true);
              } }
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm active:scale-95 order-3 md:order-2 ${
                isSaving ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-white border border-slate-200 text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <Share2 size={14} /> Enlace
            </button>
          )}

          <button 
            onClick={downloadPDF}
            disabled={isExporting}
            className="px-4 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-white order-1 md:order-3"
            title="Descargar/Imprimir PDF Oficial sin recortes para Licitaciones y Organismos del Estado"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
            PDF Oficial / Licitaciones
          </button>
          
          <button 
            onClick={() => setShowSpeechModal(true)}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm active:scale-95 order-3"
            title="Speeches de Venta Rápidos (1-Clic Copy)"
          >
            <MessageSquare size={14} /> Speeches
          </button>
          
          <div className="hidden md:block w-px h-6 bg-slate-200 mx-1 order-4"></div>
          
          {user ? (
            <button 
              onClick={handleLogout}
              className="px-1.5 py-1.5 text-slate-400 hover:text-slate-600 transition-colors order-5"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          ) : isOwner ? (
            <button 
              onClick={handleLogin}
              className="px-1.5 py-1.5 text-slate-400 hover:text-indigo-600 transition-colors order-5"
              title="Iniciar Sesión"
            >
              <LogIn size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 order-5" title="Propuesta Comercial Autorizada (Solo Lectura)">
              <ShieldCheck size={12} className="text-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">Propuesta Digital</span>
            </div>
          )}
        </div>
      </header>
        {/* Main Content Area */}
        <main className="w-full flex-grow print:hidden">
          {renderMainContent() || (
            <>
              
            <div className="w-full flex flex-col lg:flex-row gap-3">
            {/* Main Content Grid (Original Proposal View) */}
            <div className="flex-grow space-y-2">
              {/* AI Assistant Section - ONLY FOR OWNER AND NOT IN PREVIEW */}
              {isOwner && !showClientPreview && (
                <section className="bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setShowAiInput(!showAiInput)}
                    className="w-full px-5 py-3 flex items-center justify-between text-indigo-700 font-bold text-xs uppercase tracking-widest"
                  >
                    <span className="flex items-center gap-2">
                      Asistente de Cotización Rápida (Exclusivo Dueño)
                    </span>
                    {showAiInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <AnimatePresence>
                    {showAiInput && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5 overflow-hidden"
                      >
                        <p className="text-[11px] text-indigo-600 mb-3 italic leading-relaxed">
                          Ingresa los equipos o servicios a cotizar. La IA calculará los márgenes, sugerirá precios de venta y organizará los ítems en el presupuesto automáticamente.
                        </p>
                        <textarea 
                          value={rawInput}
                          onChange={e => setRawInput(e.target.value)}
                          className="w-full h-32 p-4 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all mb-3 font-sans shadow-inner"
                          placeholder="Ej: Kit de alarma inalámbrica (1 kit), 3 sensores de movimiento, 1 sirena exterior y mano de obra de configuración..."
                        />
                        <div className="flex justify-end">
                          <button 
                            onClick={handleAiParse}
                            disabled={isAiLoading || !rawInput.trim()}
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md active:scale-95"
                          >
                            {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {isAiLoading ? "Calculando Presupuesto..." : "Generar Cotización"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              )}


          {aiAnalysis && isOwner && !showClientPreview && (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-xl p-6 shadow-xl relative overflow-hidden mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 flex items-center gap-2">
                    <Zap size={12} /> Análisis de Propuesta (Privado)
                  </h3>
                  <button onClick={() => setAiAnalysis(null)} className="text-white/50 hover:text-white transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <p className="text-sm leading-relaxed text-indigo-50 font-medium">
                    {aiAnalysis}
                  </p>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      Auditoría Comercial Finalizada
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest">
                      <ShieldCheck size={12} /> Exclusivo Solopreneur
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Banner de Estado (Solo Dueño viendo vía Link) */}
          {isOwner && hasQuoteInUrl && (
            <div className={`mb-6 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border-2 transition-all duration-500 ${showClientPreview ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl text-white shadow-lg ${showClientPreview ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}>
                  {showClientPreview ? <ShieldCheck size={24} /> : <Eye size={24} />}
                </div>
                <div>
                  <p className={`text-sm font-black uppercase tracking-tight ${showClientPreview ? 'text-emerald-900' : 'text-amber-900'}`}>
                    {showClientPreview ? 'VISTA PROFESIONAL ACTIVADA' : 'ESTÁS EN MODO EDITOR'}
                  </p>
                  <p className={`text-xs font-medium ${showClientPreview ? 'text-emerald-700/80' : 'text-amber-700/80'}`}>
                    {showClientPreview 
                      ? 'Esto es exactamente lo que ve tu cliente al abrir este enlace.' 
                      : 'Cualquier otra persona que use este link verá la vista profesional automáticamente.'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setShowClientPreview(!showClientPreview)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                    showClientPreview 
                    ? 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 hover:shadow-emerald-100' 
                    : 'bg-amber-600 text-white hover:bg-amber-700 hover:shadow-amber-100'
                  }`}
                >
                  {showClientPreview ? '← VOLVER A EDITAR' : 'PROBAR VISTA CLIENTE'}
                </button>
                {!showClientPreview && (
                  <button 
                    onClick={async () => {
                      if (isSaving) return;
                      const success = await saveQuoteToFirebase(true);
                      if (success) setShowShareModal(true);
                    } }
                    className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                      isSaving 
                      ? 'bg-slate-100 text-slate-400 cursor-wait' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-100'
                    }`}
                  >
                    {isSaving ? (
                      <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
                    ) : (
                      <Share2 size={16} />
                    )}
                    {isSaving ? 'GUARDANDO...' : 'COMPARTIR'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Configuration Form - REINTEGRATED SECTION */}
          {isOwner && !showClientPreview && (
            <section className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <Settings size={60} className="rotate-12" />
              </div>
              
              <div id="item-form-anchor" className="mb-2 relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-0.5">
                      Gestión de Propuesta
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-black text-slate-800 tracking-tight">
                        Configurar Solución
                      </p>
                      <button 
                        onClick={() => setShowCatalogPicker(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100"
                      >
                        <Search size={14} /> Importar Catálogo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                  <div className="flex gap-6 items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1.5">Tipo de Cotización</span>
                      <div className="inline-flex rounded-xl shadow-sm bg-slate-200 p-0.5">
                        <button 
                          onClick={() => setFiscalMode('iva')}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${fiscalMode === 'iva' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Empresa (+IVA)
                        </button>
                        <button 
                          onClick={() => setFiscalMode('efectivo')}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${fiscalMode === 'efectivo' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          Neto / Sin Factura
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Costos con IVA</span>
                        <span className="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">Precios de entrada</span>
                      </div>
                      <button 
                        onClick={() => setCostIsGross(!costIsGross)}
                        className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${costIsGross ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${costIsGross ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 bg-indigo-50/50 p-2.5 px-4 rounded-2xl border border-indigo-100/50">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Optimización de Márgenes</span>
                        <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-tighter">Algoritmo Activo</span>
                      </div>
                      <button 
                        onClick={() => setIsUsingMargin(!isUsingMargin)}
                        className={`w-10 h-5 rounded-full relative transition-all duration-300 shadow-inner ${isUsingMargin ? 'bg-green-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${isUsingMargin ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 relative z-10">
                <div className="lg:col-span-5">
                  <div className="relative">
                    <span className="absolute -top-2 left-4 px-1 bg-white text-[8px] font-black uppercase text-slate-400 tracking-widest z-10">Ítem / Producto</span>
                    <input 
                      type="text" 
                      value={newItem.description}
                      onChange={e => setNewItem({...newItem, description: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder-slate-300 bg-slate-50/20 font-bold text-slate-700"
                      placeholder="Ej: Cámara Hikvision, Servicio de Instalación..."
                    />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="relative">
                    <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-black uppercase text-slate-400 tracking-widest z-10">Cant</span>
                    <input 
                      type="number" 
                      value={newItem.quantity || ''}
                      onChange={e => setNewItem({...newItem, quantity: e.target.value === '' ? 0 : Number(e.target.value)})}
                      className="w-full h-11 px-2 border border-slate-200 rounded-xl text-sm text-center outline-none bg-slate-50/20 font-bold"
                    />
                  </div>
                </div>

                {isUsingMargin ? (
                  <div className="lg:col-span-6 grid grid-cols-4 gap-2">
                    <div className="relative">
                      <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-black uppercase text-indigo-500 tracking-widest z-10">
                        {costIsGross ? 'Bruto' : 'Neto'}
                      </span>
                      <div className="flex">
                        <input 
                          type="text" 
                          value={newItem.costPrice || ''}
                          onChange={e => {
                            const cost = Number(e.target.value.replace(/\D/g, ''));
                            setNewItem({...newItem, costPrice: cost});
                          }}
                          className="w-full h-11 px-2 border border-indigo-100 bg-indigo-50/20 rounded-l-xl text-sm font-mono text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-400"
                          placeholder="Costo"
                        />
                        <button 
                          onClick={() => {
                            const costNeto = costIsGross ? (newItem.costPrice || 0) / 1.19 : (newItem.costPrice || 0);
                            if (costNeto > 0) {
                              const auto = calcularPrecioAutomatico(costNeto);
                              setItemMargin(auto.margenAplicado);
                            }
                          }}
                          className="px-2 bg-indigo-600 text-white rounded-r-xl hover:bg-indigo-700 transition-colors"
                          title="Auto-Margen"
                        >
                          <Zap size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-black uppercase text-emerald-500 tracking-widest z-10">Mg %</span>
                      <input 
                        type="number" 
                        value={itemMargin}
                        onChange={e => setItemMargin(Number(e.target.value))}
                        className="w-full h-11 px-2 border border-emerald-100 bg-emerald-50/20 rounded-xl text-sm font-mono text-emerald-600 outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-black uppercase text-emerald-600 tracking-widest z-10">Venta</span>
                      <div className="w-full h-11 px-2 flex flex-col justify-center border border-emerald-100 bg-emerald-50/20 rounded-xl text-emerald-600 overflow-hidden">
                        <span className="text-[10px] font-black font-mono leading-none">
                          ${Math.round(
                            (costIsGross ? (newItem.costPrice || 0) / 1.19 : (newItem.costPrice || 0)) * 
                            (fiscalMode === 'efectivo' ? 1 : 1) * 
                            (1 + (itemMargin / 100))
                          ).toLocaleString()}
                        </span>
                        <span className="text-[7px] uppercase font-bold text-emerald-400/80 leading-tight">
                          {fiscalMode === 'efectivo' ? 'Final' : '+ IVA'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={addItem}
                      className="h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all font-black uppercase text-[10px] tracking-widest"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <div className="lg:col-span-6 grid grid-cols-3 gap-2">
                    <div className="relative">
                      <span className="absolute -top-2 left-3 px-1 bg-white text-[8px] font-black uppercase text-indigo-500 tracking-widest z-10">P. Unitario</span>
                      <input 
                        type="text" 
                        value={newItem.unitPrice || ''}
                        onChange={e => setNewItem({...newItem, unitPrice: Number(e.target.value.replace(/\D/g, ''))})}
                        className="w-full h-11 px-3 border border-indigo-100 bg-indigo-50/20 rounded-xl text-sm font-mono text-indigo-600 font-bold outline-none"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-black uppercase text-indigo-600 tracking-widest z-10">Total</span>
                      <div className="w-full h-11 px-2 flex flex-col justify-center border border-indigo-100 bg-indigo-50/20 rounded-xl text-indigo-600 overflow-hidden">
                        <span className="text-[10px] font-black font-mono">
                          ${Math.round(
                            (newItem.unitPrice || 0) * (newItem.quantity || 1) * (fiscalMode === 'efectivo' ? 1 : 1.19)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={addItem}
                      className="h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all font-black uppercase text-[10px] tracking-widest"
                    >
                      OK
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Más Vendidos</span>
                </div>
                <div className="flex gap-3">
                  {catalogEstrellas.map((catItem) => (
                    <button 
                      key={catItem.id}
                      onClick={() => addItemFromCatalog(catItem)}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all hover:border-indigo-400 hover:text-indigo-600 flex-shrink-0 shadow-sm active:scale-95"
                    >
                      + {catItem.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Items Area */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
                <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-900 text-white rounded-lg">
                      <ShoppingCart size={16} />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">Cuerpo del Presupuesto</h3>
                  </div>
                  {isOwner && !showClientPreview && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowCatalogPicker(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                      >
                        <Search size={14} /> Catálogo
                      </button>
                    </div>
                  )}
                </div>
                
                <div className={`space-y-2 ${(!isOwner || showClientPreview) ? 'p-0' : 'p-0'}`}>
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <div className="px-4 py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-center text-slate-400 text-xs italic">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <Layout size={24} />
                    </div>
                    {isOwner ? "Sin items. Utiliza el formulario o el asistente de IA para comenzar." : "Esta propuesta no contiene items todavía."}
                  </div>
                ) : (
                  items.map((item) => {
                    const effectivePdfUrl = item.pdfUrl || catalog.find(c => (c.name || '').trim().toLowerCase() === (item.description || '').trim().toLowerCase())?.pdfUrl;
                    return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mb-3"
                    >
                      {(!isOwner || showClientPreview) ? (
                        /* VISTA CLIENTE / PREVIEW */
                        <div className={`flex flex-col md:grid md:grid-cols-12 p-4 md:p-5 md:items-center hover:bg-slate-50 transition-colors group gap-4 md:gap-0 border-b border-slate-50 last:border-0 bg-white`}>
                          <div className="md:col-span-6">
                            <div className="flex flex-col gap-1 text-left">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-slate-800 leading-tight text-xs md:text-sm">
                                  {item.description}
                                </p>
                                {effectivePdfUrl && (
                                  <button 
                                    onClick={() => openPdfInNewTab(effectivePdfUrl, `Ficha_${item.description.replace(/\s+/g, '_')}.pdf`)}
                                    className="p-1 px-2 bg-indigo-50 text-indigo-600 rounded-lg flex items-center gap-1.5 hover:bg-indigo-100 transition-colors shadow-sm border border-indigo-100" 
                                    title="Ver Ficha Técnica PDF"
                                  >
                                    <FileDown size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">Ficha Técnica PDF</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex md:contents justify-between items-center text-xs md:text-sm">
                            <span className="md:hidden text-slate-400 font-bold uppercase text-[9px]">Cantidad</span>
                            <div className="md:col-span-1 text-center font-mono text-slate-600 font-bold text-xs">
                              {String(item.quantity).padStart(2, '0')}
                            </div>
                          </div>
                          <div className="flex md:contents justify-between items-center text-[11px] md:text-sm">
                            <span className="md:hidden text-slate-400 font-bold uppercase text-[9px]">Precio Unit.</span>
                            <div className="md:col-span-2 text-right text-left md:text-right">
                              <div className="font-mono text-slate-600 font-bold">${item.unitPrice.toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="flex md:contents justify-between items-center">
                            <span className="md:hidden text-slate-400 font-bold uppercase text-[9px]">Total</span>
                            <div className="md:col-span-3 text-right">
                              <span className="font-black text-xs text-slate-900 font-mono tracking-tighter">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                         /* VISTA EDITOR SIMPLIFICADA (Enfoque en Ventas y Cotizaciones) */
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:border-blue-200 transition-all group/card">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">Ítem de Cotización</label>
                          
                          <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
                            
                            {/* 1. PRODUCTO */}
                            <div className="flex-[3] flex flex-col gap-1">
                              <div className="flex items-center gap-2 mb-1">
                                {effectivePdfUrl ? (
                                  <div className="flex items-center gap-1.5">
                                    <button 
                                      onClick={() => openPdfInNewTab(effectivePdfUrl, `Ficha_${item.description.replace(/\s+/g, '_')}.pdf`)}
                                      className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border border-emerald-100 hover:bg-emerald-100 transition-colors"
                                      title="Abrir PDF de Ficha Técnica"
                                    >
                                      <FileDown size={9} /> Ficha PDF
                                    </button>
                                    <label className="cursor-pointer text-[8px] font-bold text-slate-400 hover:text-indigo-600 underline">
                                      Cambiar
                                      <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleItemPdfUpload(item.id, e)} />
                                    </label>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer flex items-center gap-1 bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase border border-slate-200 transition-colors">
                                    <FileText size={9} /> + Ficha PDF
                                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleItemPdfUpload(item.id, e)} />
                                  </label>
                                )}
                              </div>
                              <input 
                                type="text" 
                                value={item.description}
                                onChange={(e) => setItems(items.map(it => it.id === item.id ? { ...it, description: e.target.value } : it))}
                                placeholder="Nombre del ítem..."
                                className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                              />
                            </div>

                            {/* CANTIDAD */}
                            <div className="w-20">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">Cant.</label>
                              <input 
                                type="number" 
                                value={item.quantity || ''}
                                onChange={(e) => updateItemQuantity(item.id, e.target.value === '' ? 0 : Number(e.target.value))}
                                placeholder="1"
                                className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-black text-slate-600 outline-none focus:ring-2 focus:ring-slate-200 text-center relative"
                              />
                            </div>

                            {/* PRECIO UNITARIO */}
                            <div className="flex-1 min-w-[140px]">
                              <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider ml-1 mb-1 block leading-tight">
                                Precio Unitario
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-3.5 text-indigo-300 font-bold">$</span>
                                <input 
                                  type="number" 
                                  value={item.unitPrice || ''}
                                  onChange={(e) => updateItemPrice(item.id, e.target.value === '' ? 0 : Number(e.target.value))}
                                  placeholder="0"
                                  className="w-full pl-7 p-3 bg-indigo-50 border-none rounded-xl text-sm font-black text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-100 shadow-sm"
                                />
                              </div>
                            </div>

                            {/* PRECIO FINAL */}
                            <div className="flex-1 min-w-[140px]">
                              <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider ml-1 mb-1 block leading-tight">
                                Total Ítem
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-3.5 text-blue-200 font-bold">$</span>
                                <input 
                                  readOnly
                                  value={(item.quantity * item.unitPrice).toLocaleString('es-CL')}
                                  className="w-full pl-7 p-3 bg-blue-600 border-none rounded-xl text-sm font-black text-white text-right shadow-lg shadow-blue-100 placeholder-white"
                                />
                              </div>
                            </div>

                            {/* ELIMINAR */}
                            <div className="flex items-center justify-end">
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                          </div>
                        </div>
                      )}
                    </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-2 border-b border-slate-100 pb-4 mb-4">
                <div className="flex justify-end gap-6 text-sm">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">VALOR NETO:</span>
                  <span className="font-mono font-bold">${Math.round(netoAfecto).toLocaleString()}</span>
                </div>
                {iva > 0 && (
                  <div className="flex justify-end gap-6 text-sm">
                    <span className="text-slate-400 uppercase font-bold text-[10px]">I.V.A (19%):</span>
                    <span className="font-mono font-bold">${Math.round(iva).toLocaleString()}</span>
                  </div>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-end gap-6 text-sm text-emerald-600">
                  <span className="uppercase font-bold text-[10px]">DESCUENTO:</span>
                  <span className="font-mono font-bold">-${discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-end gap-6 pt-4 border-t border-slate-200 text-lg">
                <span className="uppercase font-black text-[12px] text-indigo-600 tracking-widest">
                  {fiscalMode === 'efectivo' ? 'TOTAL FINAL EFECTIVO:' : 'TOTAL A PAGAR:'}
                </span>
                <span className="font-mono font-black text-slate-900">${Math.round(totalProposal).toLocaleString()}</span>
              </div>
              
              {/* Trust Blocks & Buttons ONLY for Client/Preview Mode */}
              {(!isOwner || showClientPreview) && (
                <>

                  <motion.button 
                    onClick={() => window.open(`https://wa.me/${(loadedSenderInfo?.phone || userProfile.phone).replace(/[^0-9]/g, '')}?text=Hola, solicito contacto para el presupuesto ${quoteRefId}`, '_blank')}
                    className="mt-6 w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-tight text-sm shadow-md transition-all active:scale-95"
                  >
                    <MessageSquare size={18} /> 
                    CONTACTAR ANALISTA
                  </motion.button>
                </>
              )}
            </div>

            {/* Anexo de Requerimientos y Notas (Especificaciones Técnicas & Fichas) */}
            {(clientInfo.customerRequirements || (clientInfo.requirementImages && clientInfo.requirementImages.length > 0) || clientInfo.projectConditions || combinedTechSpecs) && (
              <motion.div 
                id="tech-annex-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 mb-12"
              >
                <div className={(showClientPreview || !isOwner) ? "mt-16 w-full" : "bg-slate-50/50 border-2 border-slate-100 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-sm"}>
                  {/* Subtle paper background effect */}
                  {(!showClientPreview && isOwner) && (
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.3em]">Anexo Técnico & Requerimientos</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Especificaciones del requerimiento & Condiciones comerciales</p>
                      </div>
                    </div>

                    <div className="space-y-16 py-12 border-t border-slate-100 mt-12">
                      {/* 1. Requerimientos del Cliente con Fotos en Tamaño Normal */}
                      {(clientInfo.customerRequirements || (clientInfo.requirementImages && clientInfo.requirementImages.length > 0)) && (
                        <div className="w-full space-y-6">
                          <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em]">
                            REQUERIMIENTOS DEL CLIENTE
                          </h4>
                          {clientInfo.customerRequirements && (
                            <div className="text-[16px] text-[#1e293b] leading-[1.6] whitespace-pre-wrap break-words w-full font-sans">
                              {clientInfo.customerRequirements}
                            </div>
                          )}

                          {/* Galería de Fotos en Tamaño Normal Sin Recortes */}
                          {clientInfo.requirementImages && clientInfo.requirementImages.length > 0 && (
                            <div className="pt-4 space-y-4">
                              <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon size={14} /> Registro Fotográfico del Requerimiento / Producto (Alta Definición)
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                {clientInfo.requirementImages.map((img, idx) => (
                                  <div key={idx} className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="px-4 py-2.5 bg-slate-900 text-white flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                                      <span>FOTO {idx + 1}</span>
                                      <span className="text-slate-400 font-mono text-[9px]">ANEXO TÉCNICO</span>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 flex items-center justify-center min-h-[250px] max-h-[420px] overflow-hidden">
                                      <img 
                                        src={getSafeImageUrl(img)} 
                                        alt={`Requerimiento foto ${idx + 1}`} 
                                        className="max-w-full max-h-[380px] w-auto h-auto object-contain rounded-xl shadow-2xs" 
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. Tech Specs (Fichas) */}
                      {combinedTechSpecs && (
                        <div>
                          <h4 className="text-[13px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 font-sans">
                            ESPECIFICACIONES TÉCNICAS
                          </h4>
                          <div className="text-[16px] text-slate-600 leading-[1.6] whitespace-pre-wrap break-words font-sans italic">
                            {combinedTechSpecs}
                          </div>
                        </div>
                      )}

                      {/* 3. Condiciones & Notas */}
                      {clientInfo.projectConditions && (
                        <div className="w-full">
                          <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8">
                            CONDICIONES Y NOTAS
                          </h4>
                          <div className="text-[16px] text-[#1e293b] leading-[1.6] whitespace-pre-wrap break-words w-full font-sans">
                            {clientInfo.projectConditions}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Documento generado electrónicamente • Sin validez sin firma</p>
                      <p className="text-[9px] font-mono font-bold text-slate-400">ID: {quoteRefId?.slice(0, 8)} • {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

                {/* Firma Digital (Signature Pad) */}
                {(!isOwner || showClientPreview) && (status?.toLowerCase() === 'pending' || status?.toLowerCase() === 'sent' || status?.toLowerCase() === 'enviado') && !signature && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-8 bg-white border-2 border-dashed border-slate-200 rounded-[2rem] shadow-lg shadow-slate-100"
                  >
                    <div className="flex flex-col items-center gap-6">
                      <div className="text-center space-y-2 mb-4">
                        <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                          <PenTool size={20} />
                          <h3 className="text-sm font-black uppercase tracking-widest">Firma de Aceptación</h3>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Firme aquí para aceptar los términos y condiciones
                        </p>
                      </div>

                      <div className="w-full max-w-lg bg-white rounded-2xl border-2 border-slate-100 p-2 shadow-inner">
                        <SignatureCanvas 
                          ref={sigPad}
                          penColor="#1e293b"
                          canvasProps={{
                            className: "w-full h-48 rounded-xl cursor-crosshair",
                            style: { background: "#ffffff" }
                          }}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mt-4">
                        <button 
                          onClick={clearSignature}
                          className="flex-1 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                          Limpiar
                        </button>
                        <button 
                          onClick={saveSignature}
                          disabled={isSaving}
                          className="flex-[2] px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                          Confirmar y Aprobar Presupuesto
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

          {/* Display status block for everyone when Approved */}
            {(signature || status === 'APPROVED') && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-12 bg-white border-2 border-slate-100 rounded-[2rem] flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Pedido Confirmado</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
                  Documento firmado digitalmente y aprobado.
                </p>
                {signature && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={signature} alt="Firma" className="h-24 opacity-80" />
                  </div>
                )}
              </motion.div>
            )}
          </div>

        {/* Sidebar Summary Area */}
        <aside className="w-full lg:w-[320px] xl:w-[380px] flex flex-col gap-4 shrink-0 transition-all">

          {/* Client Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
              <User size={12} /> Cliente Destinatario
            </h3>
            <div className="space-y-4">
              {isOwner ? (
                <>
                  <input 
                    type="text" 
                    value={clientInfo.name}
                    onChange={e => setClientInfo({...clientInfo, name: e.target.value})}
                    className="w-full text-xs font-bold p-3 bg-transparent border-b border-slate-100 hover:border-slate-200 focus:border-indigo-400 outline-none transition-all"
                    placeholder="Nombre del Cliente"
                  />
                  <input 
                    type="text" 
                    value={clientInfo.company}
                    onChange={e => setClientInfo({...clientInfo, company: e.target.value})}
                    className="w-full text-[11px] p-3 bg-transparent border-b border-slate-100 hover:border-slate-200 focus:border-indigo-400 outline-none transition-all text-slate-600"
                    placeholder="Nombre de la Empresa"
                  />
                  <input 
                    type="number"
                    value={unidadesDisponibles || ''}
                    onChange={e => setUnidadesDisponibles(Number(e.target.value) || undefined)}
                    className="w-full text-[10px] p-3 bg-transparent border-b border-slate-100 hover:border-slate-200 focus:border-indigo-400 outline-none transition-all text-slate-400"
                    placeholder="Unidades Disponibles (Opcional)"
                  />
                  <input 
                    type="email" 
                    value={clientInfo.email}
                    onChange={e => setClientInfo({...clientInfo, email: e.target.value})}
                    className="w-full text-[10px] p-3 bg-transparent border-b border-slate-100 hover:border-slate-200 focus:border-indigo-400 outline-none transition-all text-slate-400"
                    placeholder="correo@ejemplo.com"
                  />
                  <input 
                    type="tel" 
                    value={clientInfo.phone || ''}
                    onChange={e => setClientInfo({...clientInfo, phone: e.target.value})}
                    className="w-full text-[10px] p-3 bg-transparent border-b border-slate-100 hover:border-slate-200 focus:border-indigo-400 outline-none transition-all text-slate-400"
                    placeholder="+56 9 XXXX XXXX"
                  />

                  {/* Selector de Comisiones & Promotores (5% / 10%) */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <label className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block">
                      Atribución Comercial (Comisión 5% / 10%)
                    </label>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Publicador / Promotor (5%)</span>
                        <select
                          value={clientInfo.promoterId || ''}
                          onChange={e => {
                            const pId = e.target.value;
                            const pObj = promoters.find(p => p.id === pId);
                            setClientInfo({
                              ...clientInfo,
                              promoterId: pId,
                              promoterName: pObj?.name || (pId === 'owner' ? 'Tú (Dueño)' : '')
                            });
                          }}
                          className="w-full text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        >
                          <option value="">-- Sin Promotor Directo --</option>
                          <option value="owner">⭐ Tú (Solopreneur / Sueldo Comercial)</option>
                          {promoters.filter(p => p.status !== 'inactive').map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Cerrador / Vendedor (5%)</span>
                        <select
                          value={clientInfo.closerId || ''}
                          onChange={e => {
                            const cId = e.target.value;
                            const cObj = promoters.find(p => p.id === cId);
                            setClientInfo({
                              ...clientInfo,
                              closerId: cId,
                              closerName: cObj?.name || (cId === 'owner' ? 'Tú (Dueño)' : '')
                            });
                          }}
                          className="w-full text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        >
                          <option value="">-- Seleccionar Vendedor --</option>
                          <option value="owner">⭐ Tú (Solopreneur / Sueldo Comercial)</option>
                          {promoters.filter(p => p.status !== 'inactive').map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                          ))}
                        </select>
                      </div>

                      {clientInfo.promoterId && (
                        <div className="p-2 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[8.5px] font-black text-indigo-700 uppercase leading-tight">
                          {clientInfo.promoterId === clientInfo.closerId && clientInfo.promoterId !== 'owner'
                            ? "✨ 10% Comisión Total para la misma persona" 
                            : "📊 5% para Publicador + 5% para Cerrador"}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1 p-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Nombre</span>
                    <div className="w-full text-xs font-bold p-3 bg-slate-50/50 rounded-xl text-slate-700">
                      {clientInfo.name || "N/A"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Empresa</span>
                    <div className="w-full text-xs font-bold p-3 bg-slate-50/50 rounded-xl text-slate-700">
                      {clientInfo.company || "N/A"}
                    </div>
                  </div>
                  {unidadesDisponibles && (
                    <div className="flex flex-col gap-1 p-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Unid. Disponibles</span>
                      <div className="w-full text-xs font-bold p-3 bg-slate-50/50 rounded-xl text-slate-600">
                        {unidadesDisponibles} unid.
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Logistics Module */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
              <Package size={12} /> Logística y Despacho
            </h3>
            {isOwner ? (
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute -top-2 left-1 text-[7px] font-bold text-slate-400 uppercase bg-white px-1">Ciudad Destino</span>
                  <input 
                    type="text" 
                    value={clientInfo.destinationCity}
                    onChange={e => setClientInfo({...clientInfo, destinationCity: e.target.value})}
                    className="w-full text-[11px] p-4 border border-slate-100 rounded-lg outline-none focus:ring-1 focus:ring-indigo-400 transition-all font-medium"
                    placeholder="Ej: Copiapó"
                  />
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute -top-2 left-1 text-[7px] font-bold text-slate-400 uppercase bg-white px-1">Costo Flete (Neto)</span>
                    <input 
                      type="number" 
                      value={clientInfo.freightCost || ''}
                      onChange={e => setClientInfo({...clientInfo, freightCost: Number(e.target.value)})}
                      className="w-full text-[11px] p-4 border border-slate-100 rounded-lg outline-none focus:ring-1 focus:ring-indigo-400 transition-all font-mono"
                      placeholder="0"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute -top-2 left-1 text-[7px] font-bold text-indigo-400 uppercase bg-white px-1">Margen Gestión (%)</span>
                    <input 
                      type="number" 
                      value={clientInfo.freightMargin || ''}
                      onChange={e => setClientInfo({...clientInfo, freightMargin: Number(e.target.value)})}
                      className="w-full text-[11px] p-4 border border-slate-100 rounded-lg outline-none focus:ring-1 focus:ring-indigo-400 transition-all font-mono"
                      placeholder="%"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-1 p-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Destino</span>
                  <div className="w-full text-[11px] font-bold p-3 bg-slate-50/50 rounded-xl text-slate-700">
                    {clientInfo.destinationCity || "Por confirmar"}
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Requirements & Conditions Cards (Shown only in Editor mode) */}
          {isOwner && !showClientPreview && profile === 'security' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                     <FileText size={12} /> Requerimientos del Cliente
                  </h3>
                  <input 
                    type="file" 
                    id="req-images-file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setIsOptimizing(true);
                        const filePromises = Array.from(files).map((file: File) => {
                          return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              const compressed = await compressImage(reader.result as string, 1200, 1200);
                              resolve(compressed);
                            };
                            reader.readAsDataURL(file);
                          });
                        });
                        const compressedImages = await Promise.all(filePromises);
                        setClientInfo(prev => ({
                          ...prev,
                          requirementImages: [...(prev.requirementImages || []), ...compressedImages]
                        }));
                        setIsOptimizing(false);
                      }
                    }}
                  />
                  <label 
                    htmlFor="req-images-file"
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[9px] font-black uppercase cursor-pointer transition-all flex items-center gap-1 border border-indigo-100 shadow-2xs"
                    title="Subir fotos del producto o terreno en tamaño normal"
                  >
                    <ImageIcon size={12} /> + Fotos
                  </label>
                </div>
                <textarea 
                  value={clientInfo.customerRequirements}
                  onChange={e => isOwner && setClientInfo({...clientInfo, customerRequirements: e.target.value})}
                  readOnly={!isOwner}
                  className={`w-full text-[11px] leading-relaxed text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100 outline-none resize-none min-h-[110px] focus:ring-1 focus:ring-indigo-300 ${!isOwner ? 'cursor-default' : ''}`}
                  placeholder="Detalles del producto, dimensiones, requerimientos especiales del cliente..."
                />

                {/* Previsualización de Fotos del Requerimiento en Editor */}
                {clientInfo.requirementImages && clientInfo.requirementImages.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Fotos de Requerimiento ({clientInfo.requirementImages.length})
                      </span>
                      <span className="text-[8px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                        Tamaño Normal
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {clientInfo.requirementImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group">
                          <img src={getSafeImageUrl(img)} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => {
                              const updated = (clientInfo.requirementImages || []).filter((_, i) => i !== idx);
                              setClientInfo({ ...clientInfo, requirementImages: updated });
                            }}
                            className="absolute inset-0 bg-rose-900/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            title="Eliminar foto"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-3 flex items-center gap-2">
                   <ShieldCheck size={12} /> Condiciones & Notas
                </h3>
                <textarea 
                  value={clientInfo.projectConditions}
                  onChange={e => isOwner && setClientInfo({...clientInfo, projectConditions: e.target.value})}
                  readOnly={!isOwner}
                  className={`w-full text-[11px] leading-relaxed text-slate-600 bg-transparent border-none outline-none resize-none min-h-[200px] ${!isOwner ? 'cursor-default' : ''}`}
                  placeholder="Términos legales, validez de oferta, condiciones comerciales..."
                />
              </div>
            </div>
          )}

          {/* Digital Signature Card */}
          {profile === 'security' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex justify-between items-center">
                <span>Firma Digital</span>
                {signature && <CheckCircle2 size={12} className="text-emerald-500" />}
              </h3>
              
              {signature ? (
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 relative group">
                  <img src={signature} alt="Firma" className="w-full h-16 object-contain" />
                  <button 
                    onClick={() => setShowSignaturePad(true)}
                    className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold uppercase tracking-widest rounded-lg"
                  >
                    <PenTool size={12} className="mr-1" /> Cambiar
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowSignaturePad(true)}
                  className="w-full py-4 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all flex flex-col items-center gap-2"
                >
                  <PenTool size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Añadir Firma</span>
                </button>
              )}
            </div>
          )}

          {/* Sender Professional Card */}
          {profile === 'security' && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-3 flex items-center gap-2">
                <Briefcase size={12} /> Analista Responsable
              </h3>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">{loadedSenderInfo?.name || userProfile.name}</p>
                <p className="text-[11px] text-indigo-600 font-medium">{loadedSenderInfo?.role || userProfile.role}</p>
                <div className="pt-2 mt-2 border-t border-indigo-200/50 space-y-1">
                  <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    {loadedSenderInfo?.email || userProfile.email}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    {loadedSenderInfo?.phone || userProfile.phone}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto">
            {/* Note removed to prevent sensitive info leak */}
          </div>
        </aside>
      </div>
    </>
    )}
  </main>

        {/* Footer Bar - Hidden on print */}
        <footer className="mt-8 mb-8 py-6 border-t border-slate-200 flex flex-col items-center text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] w-full print:hidden space-y-2">
          <p>© 2026 WILLROCK CO.</p>
          <p className="text-[9px] opacity-70">
            IA SMART PROJECT ANALYST
          </p>
        </footer>
      </div>

      {/* Final Budget View (Optimized for Printing) - Forced Hex Styles to avoid html2canvas oklch crash */}
      <div ref={printRef} className="hidden print:block w-full bg-white text-black p-0" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
        <div className="w-full mx-auto" style={{ backgroundColor: '#ffffff' }}>
          
          {/* ========================================================================= */}
          {/* HOJA 1: CABECERA, CLIENTE, TABLA DE PRODUCTOS Y TOTALES                  */}
          {/* ========================================================================= */}
          <div className="print-page pb-4">
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-8 pb-6 border-b-2" style={{ borderColor: '#0f172a' }}>
                <div className="flex items-center gap-4">
                  {(isOwner ? (userProfile as any).companyLogo : (loadedSenderInfo as any)?.companyLogo) && (
                    <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img 
                        src={isOwner ? (userProfile as any).companyLogo : (loadedSenderInfo as any)?.companyLogo} 
                        style={{ maxHeight: '56px', maxWidth: '56px', objectFit: 'contain' }} 
                        alt="Logo" 
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-black tracking-tight leading-none mb-1.5" style={{ color: '#0f172a' }}>
                      PRESUPUESTO
                    </h1>
                    <div className="text-xs font-mono font-bold tracking-wider" style={{ color: '#64748b' }}>REF: {quoteRefId}</div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  {profile === 'security' ? (
                    <>
                      <div className="font-black text-base uppercase tracking-tight" style={{ color: '#0f172a' }}>{isOwner ? userProfile.companyName : (loadedSenderInfo?.companyName || userProfile.companyName)}</div>
                      {(isOwner ? userProfile.companyRut : (loadedSenderInfo?.companyRut || userProfile.companyRut)) && (
                        <div className="text-xs font-medium" style={{ color: '#64748b' }}>RUT: {isOwner ? userProfile.companyRut : (loadedSenderInfo?.companyRut || userProfile.companyRut)}</div>
                      )}
                      {(isOwner ? userProfile.companySubtitle : (loadedSenderInfo?.companySubtitle || userProfile.companySubtitle)) && (
                        <div className="text-xs font-medium" style={{ color: '#64748b' }}>{isOwner ? userProfile.companySubtitle : (loadedSenderInfo?.companySubtitle || userProfile.companySubtitle)}</div>
                      )}
                      {(isOwner ? userProfile.companyAddress : (loadedSenderInfo?.companyAddress || userProfile.companyAddress)) && (
                        <div className="text-xs font-medium" style={{ color: '#64748b' }}>{isOwner ? userProfile.companyAddress : (loadedSenderInfo?.companyAddress || userProfile.companyAddress)}</div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="font-serif italic text-2xl" style={{ color: '#db2777' }}>{isOwner ? userProfile.companyName : (loadedSenderInfo?.companyName || userProfile.companyName)}</div>
                      <div className="text-xs" style={{ color: '#666666' }}>{isOwner ? userProfile.companyAddress : (loadedSenderInfo?.companyAddress || userProfile.companyAddress)}</div>
                    </>
                  )}
                  <div className="mt-3 pt-2 border-t text-right" style={{ borderColor: '#e2e8f0', width: '100%', maxWidth: '260px' }}>
                    <div className="text-[8px] uppercase font-black tracking-wider" style={{ color: '#94a3b8' }}>IA Analisis Projects:</div>
                    <div className="text-xs font-bold" style={{ color: '#0f172a' }}>{isOwner ? userProfile.name : (loadedSenderInfo?.name || userProfile.name)}</div>
                    <div className="text-[10px]" style={{ color: '#475569' }}>{isOwner ? userProfile.email : (loadedSenderInfo?.email || userProfile.email)}</div>
                    <div className="text-[10px]" style={{ color: '#475569' }}>{isOwner ? userProfile.phone : (loadedSenderInfo?.phone || userProfile.phone)}</div>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-2 gap-8 mb-6 pb-4 border-b" style={{ borderColor: '#f1f5f9' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="text-[9px] uppercase font-black tracking-wider mb-1" style={{ color: '#94a3b8' }}>Preparado para:</div>
                  <div className="text-sm font-bold text-slate-900 leading-tight" style={{ color: '#0f172a' }}>{clientInfo.name || clientInfo.company || "Cliente"}</div>
                  {clientInfo.company && clientInfo.company.trim().toLowerCase() !== (clientInfo.name || "").trim().toLowerCase() && (
                    <div className="text-xs font-semibold uppercase mt-0.5" style={{ color: '#475569' }}>{clientInfo.company}</div>
                  )}
                  {clientInfo.email && <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{clientInfo.email}</div>}
                  {clientInfo.destinationCity && (
                    <div className="mt-1 text-[10px] uppercase font-bold" style={{ color: '#4f46e5' }}>
                      Destino: {clientInfo.destinationCity}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="text-[9px] uppercase font-black tracking-wider mb-1" style={{ color: '#94a3b8' }}>Fecha:</div>
                  <div className="text-sm font-bold" style={{ color: '#0f172a' }}>{clientInfo.date || new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>

              {/* Table */}
              <table className="w-full mb-6" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #0f172a', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <th className="py-2.5 text-left text-[10px] uppercase font-black tracking-wider" style={{ color: '#0f172a' }}>Descripción</th>
                    <th className="py-2.5 text-center w-16 text-[10px] uppercase font-black tracking-wider" style={{ color: '#0f172a' }}>Cant.</th>
                    <th className="py-2.5 text-right w-28 text-[10px] uppercase font-black tracking-wider" style={{ color: '#0f172a' }}>Precio Unit.</th>
                    <th className="py-2.5 text-right w-32 text-[10px] uppercase font-black tracking-wider" style={{ color: '#0f172a' }}>Total</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#0f172a' }}>
                  {items.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                      <td className="py-3 font-medium align-middle">
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-white flex items-center justify-center p-0.5">
                              <img 
                                src={getSafeImageUrl(item.imageUrl)} 
                                alt={item.description} 
                                className="w-full h-full object-contain" 
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-slate-900 leading-snug">{item.description}</div>
                            {item.techSpecs && (
                              <div className="text-[9px] text-slate-500 mt-1 whitespace-pre-line leading-tight">{item.techSpecs}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center text-xs font-mono font-bold align-middle" style={{ color: '#334155' }}>{item.quantity}</td>
                      <td className="py-3 text-right font-mono text-xs font-medium align-middle" style={{ color: '#334155' }}>${item.unitPrice.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono text-xs font-black align-middle" style={{ color: '#0f172a' }}>${(item.quantity * item.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section in Print (Page 1 Bottom) */}
            <div className="flex flex-col items-end space-y-1.5 w-full mt-4 print-avoid-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="w-full max-w-sm space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="uppercase font-bold text-[9px] tracking-wider" style={{ color: '#64748b' }}>VALOR NETO:</span>
                  <span className="font-mono font-bold" style={{ color: '#0f172a' }}>${Math.round(netoAfecto).toLocaleString()}</span>
                </div>
                
                {iva > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="uppercase font-bold text-[9px] tracking-wider" style={{ color: '#64748b' }}>
                      I.V.A. (19%):
                    </span>
                    <span className="font-mono font-bold" style={{ color: '#0f172a' }}>
                      ${Math.round(iva || 0).toLocaleString()}
                    </span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs" style={{ color: '#059669' }}>
                    <span className="uppercase font-bold text-[9px] tracking-wider">Descuento:</span>
                    <span className="font-mono font-bold">-${discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2.5 border-t-2 mt-2 gap-4" style={{ borderColor: '#0f172a', borderTopWidth: '2px' }}>
                  <span className="uppercase text-[11px] font-black tracking-wider whitespace-nowrap" style={{ color: '#0f172a' }}>
                    {fiscalMode === 'efectivo' ? 'TOTAL FINAL EFECTIVO:' : 'TOTAL A PAGAR:'}
                  </span>
                  <span className="font-mono text-xl font-black whitespace-nowrap text-right" style={{ color: '#0f172a' }}>${Math.round(totalProposal).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* AI Analysis in Print (If present, on Page 1) */}
            {aiAnalysis && (
              <div className="mt-4 p-4 rounded-xl border w-full text-left print-avoid-break" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} style={{ color: '#4f46e5' }} />
                  <h4 className="text-xs font-black uppercase tracking-widest" style={{ color: '#475569' }}>Análisis Estratégico de IA</h4>
                </div>
                <p className="text-[10px] leading-relaxed italic" style={{ color: '#64748b' }}>
                  {aiAnalysis.replace(/ganancia|margen|utilidad|costo neto|markup/gi, 'valor')}
                </p>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* HOJA 2: CONDICIONES DEL PROYECTO + ANEXO TÉCNICO Y REGISTRO FOTOGRÁFICO */}
          {/* ========================================================================= */}
          <div className="print-page pt-4" style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>
            <div>
              <div className="mb-6">
                <h2 className="text-base font-black tracking-tight mb-1.5 text-indigo-700 uppercase" style={{ color: '#4338ca' }}>
                  ANEXO TÉCNICO & REGISTRO FOTOGRÁFICO DE EQUIPOS
                </h2>
                <div className="h-0.5 w-16 bg-indigo-600 mb-4"></div>
              </div>

              {/* Condiciones del Proyecto */}
              {(clientInfo.projectConditions || clientInfo.customerRequirements || clientInfo.notes) && (
                <div className="p-5 rounded-xl border mb-6 print-avoid-break" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div className="text-[9px] uppercase font-black mb-2 tracking-widest text-indigo-600 border-b pb-1.5" style={{ borderColor: '#e2e8f0' }}>
                    Condiciones y Alcance del Proyecto / Notas
                  </div>
                  <div className="text-xs leading-relaxed whitespace-pre-wrap text-slate-800 font-medium">
                    {clientInfo.projectConditions || clientInfo.customerRequirements}
                  </div>
                  {clientInfo.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs leading-relaxed whitespace-pre-wrap text-slate-600">
                      <span className="font-bold uppercase text-[9px] text-slate-400 block mb-1">Notas Adicionales:</span>
                      {clientInfo.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Specs si existen */}
              {combinedTechSpecs && (
                <div className="p-5 rounded-xl border mb-6 print-avoid-break" style={{ backgroundColor: '#f9f9f9', borderColor: '#e2e8f0', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div className="text-[9px] uppercase font-black mb-2 tracking-widest text-slate-500 border-b pb-1.5" style={{ borderColor: '#e2e8f0' }}>
                    Especificaciones Técnicas
                  </div>
                  <div className="text-xs whitespace-pre-line leading-relaxed text-slate-700">{combinedTechSpecs}</div>
                </div>
              )}

              {/* Galería Fotográfica en Alta Definición (Sin duplicar fotos) */}
              {((clientInfo.requirementImages && clientInfo.requirementImages.length > 0) || items.some(i => i.imageUrl)) && (
                <div className="p-5 rounded-xl border print-avoid-break" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div className="text-[9px] uppercase font-black mb-3 tracking-widest text-indigo-600 border-b pb-2" style={{ borderColor: '#e2e8f0' }}>
                    Registro Fotográfico del Requerimiento / Equipos (Alta Definición)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* Si existen fotos específicas del requerimiento, mostramos únicamente esas fotos */}
                    {clientInfo.requirementImages && clientInfo.requirementImages.length > 0 ? (
                      clientInfo.requirementImages.map((img, idx) => (
                        <div key={`req-img-${idx}`} className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center flex flex-col items-center justify-between min-h-[160px] print-avoid-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="w-full h-32 flex items-center justify-center p-1 bg-white rounded-lg border border-slate-100 mb-2">
                            <img src={getSafeImageUrl(img)} alt={`Foto Requerimiento ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                          </div>
                          <span className="text-[9px] font-black uppercase text-slate-700 leading-tight">FOTO REQUERIMIENTO N°{idx + 1}</span>
                        </div>
                      ))
                    ) : (
                      /* Si no se subieron fotos a requerimiento, mostramos las fotos de los productos del catálogo */
                      items.filter(i => i.imageUrl).map((item, idx) => (
                        <div key={`item-img-${item.id || idx}`} className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-center flex flex-col items-center justify-between min-h-[160px] print-avoid-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                          <div className="w-full h-32 flex items-center justify-center p-1 bg-white rounded-lg border border-slate-100 mb-2">
                            <img src={getSafeImageUrl(item.imageUrl!)} alt={item.description} className="max-h-full max-w-full object-contain" />
                          </div>
                          <span className="text-[9px] font-black uppercase text-slate-700 leading-tight text-center break-words px-1">{item.description}</span>
                          <span className="text-[8px] font-mono text-slate-400 mt-0.5">FOTO EQUIPO / PRODUCTO</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* HOJA 3: DATOS DE TRANSFERENCIA, INFORMACIÓN LEGAL Y COMERCIAL, Y FIRMAS  */}
          {/* ========================================================================= */}
          <div className="print-page pt-4" style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>
            <div>
              <div className="mb-6">
                <h2 className="text-base font-black tracking-tight mb-1.5 text-indigo-700 uppercase" style={{ color: '#4338ca' }}>
                  INSTRUCCIONES DE PAGO, TÉRMINOS LEGALES Y FIRMAS DE ACEPTACIÓN
                </h2>
                <div className="h-0.5 w-16 bg-indigo-600 mb-4"></div>
              </div>

              {/* Instrucciones de Pago / Datos de Transferencia */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-5 print-avoid-break" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div className="text-[10px] uppercase font-black mb-2.5 border-b pb-2 tracking-widest text-indigo-700" style={{ borderColor: '#cbd5e1' }}>
                  DATOS DE TRANSFERENCIA BANCARIA / PAGO:
                </div>
                <div className="text-xs leading-relaxed whitespace-pre-wrap font-bold text-slate-800">
                  {(isOwner ? (userProfile as any).paymentInfo : (loadedSenderInfo as any)?.paymentInfo) || (userProfile as any).paymentInfo || "Transferencia Bancaria.\nBanco: MERCADO PAGO\nTipo: VISTA\nCuenta: 1078894357\nRUT: 78377039-3\nEmail: inversioneswrockspa@gmail.com"}
                </div>
              </div>

              {/* Información Legal y Comercial */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 mb-6 print-avoid-break space-y-1.5" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <p className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-2 border-b pb-1.5">INFORMACIÓN LEGAL Y COMERCIAL:</p>
                <p className="text-xs text-slate-700">• Los precios expresados están sujetos a cambios sin previo aviso.</p>
                <p className="text-xs text-slate-700">• Validez de la propuesta: 15 días corridos.</p>
                <p className="text-xs text-slate-700">• Servicios sujetos a factibilidad técnica en terreno.</p>
                <p className="mt-3 text-[11px] italic text-slate-500">
                  Documento generado vía IA Smart Project Analyst por <span className="font-bold text-slate-800">{isOwner ? userProfile.companyName : (loadedSenderInfo?.companyName || userProfile.companyName)}</span>
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">¡GRACIAS POR TU PREFERENCIA!</span>
                  <span className="text-[11px] text-slate-600 font-bold">
                    Para consultas, contactar a {isOwner ? userProfile.phone : (loadedSenderInfo?.phone || userProfile.phone)} o al correo {isOwner ? userProfile.email : (loadedSenderInfo?.email || userProfile.email)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bloque de Firmas al Pie de la Hoja 3 - Líneas limpias sin barra transversal duplicada */}
            {profile === 'security' && (
              <div className="w-full grid grid-cols-2 gap-12 pt-8 mt-auto print-avoid-break pb-4" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div className="text-center">
                  <div className="h-16 border-b-2 border-slate-400 mb-2 flex items-center justify-center overflow-hidden">
                    {signature ? (
                      <img src={signature} alt="Firma Profesional" className="h-14 object-contain" />
                    ) : null}
                  </div>
                  <p className="text-xs uppercase font-bold text-slate-900">{user?.displayName || (userProfile.companyName || "Representante Legal")}</p>
                  <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">FIRMA PROVEEDOR / ANALISTA</p>
                </div>
                <div className="text-center">
                  <div className="h-16 border-b-2 border-slate-400 mb-2"></div>
                  <p className="text-xs uppercase font-bold text-slate-900">{clientInfo.name || clientInfo.company || "Cliente / Contraparte"}</p>
                  <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">RECEPCIÓN / ACEPTACIÓN CLIENTE</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Drawer Overlay */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] print:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl z-[120] flex flex-col print:hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                    <History size={18} className="text-indigo-600" />
                    Mis Presupuestos
                  </h2>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Historial de proyectos</p>
                </div>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {!user ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <LogIn size={40} className="text-slate-200 mb-4" />
                    <p className="text-sm font-medium text-slate-500 mb-4">Inicia sesión para ver tus proyectos guardados.</p>
                    <button 
                      onClick={handleLogin}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all"
                    >
                      Entrar con Google
                    </button>
                  </div>
                ) : isFetchingHistory ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-indigo-400 mb-2" />
                    <p className="text-xs text-slate-400">Buscando documentos...</p>
                  </div>
                ) : previousQuotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText size={40} className="text-slate-200 mb-4" />
                    <p className="text-sm font-medium text-slate-500">No tienes presupuestos guardados aún.</p>
                    <p className="text-[10px] text-slate-400 mt-2 italic px-8">Crea uno nuevo y presiona "Guardar" para que aparezca aquí.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4 px-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Últimas 3 Propuestas</h3>
                    </div>

                    <div className="space-y-4 mb-8">
                      {previousQuotes.slice(0, 3).map((quote) => (
                        <div 
                          key={quote.id}
                          onClick={() => {
                            loadQuote(quote.id);
                            setShowHistory(false);
                          }}
                          className="w-full text-left p-5 rounded-2xl border-2 border-indigo-50 bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100 transition-all group relative overflow-hidden cursor-pointer"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors" />
                          <div className="flex justify-between items-start mb-2 relative z-10">
                            <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase">{quote.quoteRefId}</span>
                            <div className="flex items-center gap-2">
                              {quote.visto && (
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest" title="Visto">
                                  VISTO 👁️
                                </span>
                              )}
                              {!isConfirmedStatus(quote.status, quote.signature) && (
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await markAsWon(quote.id, quote.clientInfo.name, quote.totalProposal);
                                  }}
                                  className="p-1 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                  title="Confirmar"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                              )}
                              {quote.status?.toLowerCase() !== 'paid' && (isConfirmedStatus(quote.status, quote.signature)) && (
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await markAsPaid(quote.id);
                                  }}
                                  className="p-1 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Marcar como Pagado"
                                >
                                  <CreditCard size={14} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteQuote(quote.id, e);
                                }}
                                className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          
                          <h4 className="font-black text-slate-800 text-sm truncate tracking-tight group-hover:text-indigo-600 transition-colors">{quote.clientInfo.company || 'Sin Empresa'}</h4>
                          <p className="text-[11px] font-bold text-slate-400 truncate mt-1 flex items-center gap-2 lowercase italic">
                            <User size={10} className="text-slate-300" /> {quote.clientInfo.name}
                          </p>
                          
                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-400 uppercase tracking-widest">{quote.items.length} ítems</span>
                            <div className="flex items-center gap-1.5 text-indigo-400 whitespace-nowrap">
                              <Calendar size={12} />
                              {quote.createdAt instanceof Timestamp ? quote.createdAt.toDate().toLocaleDateString() : 'Reciente'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {previousQuotes.length > 3 && (
                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-4 px-2 opacity-60">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resto del Historial</h3>
                        </div>
                        <div className="space-y-2 opacity-70 hover:opacity-100 transition-opacity">
                          {previousQuotes.slice(3).map((quote) => (
                            <div 
                              key={quote.id}
                              onClick={() => {
                                loadQuote(quote.id);
                                setShowHistory(false);
                              }}
                              className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-4 cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                                <FileText size={16} />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h5 className="text-[11px] font-bold text-slate-700 truncate">{quote.clientInfo.company || quote.quoteRefId}</h5>
                                <p className="text-[9px] text-slate-400">{quote.createdAt instanceof Timestamp ? quote.createdAt.toDate().toLocaleDateString() : 'Guardado'}</p>
                              </div>
                              {!isConfirmedStatus(quote.status, quote.signature) && (
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await markAsWon(quote.id, quote.clientInfo.name, quote.totalProposal);
                                  }}
                                  className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-white rounded-lg transition-all"
                                  title="Confirmar"
                                >
                                  <CheckCircle2 size={12} />
                                </button>
                              )}
                              {quote.status?.toLowerCase() !== 'paid' && (isConfirmedStatus(quote.status, quote.signature)) && (
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await markAsPaid(quote.id);
                                  }}
                                  className="p-2 text-slate-300 hover:text-blue-500 hover:bg-white rounded-lg transition-all"
                                  title="Marcar como Pagado"
                                >
                                  <CreditCard size={12} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteQuote(quote.id, e);
                                }}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {user && (
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold select-none overflow-hidden">
                      {user.photoURL ? <img src={user.photoURL} alt="Avatar" /> : user.displayName?.charAt(0)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{user.displayName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <LogOut size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={resetToDefault}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-md active:scale-95"
                  >
                    <Plus size={16} /> Crear Nuevo Proyecto
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Catalog Picker Modal */}
      <AnimatePresence>
        {showCatalogPicker && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCatalogPicker(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] print:hidden"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl z-[160] overflow-hidden flex flex-col max-h-[85vh] print:hidden"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <ShoppingCart size={24} />
                    Importar desde Catálogo
                  </h2>
                  <p className="text-[10px] opacity-80 uppercase tracking-[0.2em] font-bold mt-1">Busca e inserta ítems frecuentes</p>
                </div>
                <button onClick={() => setShowCatalogPicker(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 bg-slate-50 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={catalogSearchTerm}
                    onChange={(e) => setCatalogSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm font-medium shadow-sm"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {catalog.filter(item => 
                  (item.name || '').toLowerCase().includes(catalogSearchTerm.toLowerCase()) || 
                  (item.description || '').toLowerCase().includes(catalogSearchTerm.toLowerCase())
                ).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">No se encontraron ítems</p>
                    <p className="text-slate-400 text-[10px] mt-1 italic">Agrega ítems en la pestaña "Catálogo Maestro"</p>
                  </div>
                ) : (
                  catalog.filter(item => 
                    (item.name || '').toLowerCase().includes(catalogSearchTerm.toLowerCase()) || 
                    (item.description || '').toLowerCase().includes(catalogSearchTerm.toLowerCase())
                  ).map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 font-black text-xs overflow-hidden">
                          {item.images?.[0] ? (
                            <img 
                              src={item.images[0]} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = ''; // Fallback to initials if image fails
                                (e.target as HTMLImageElement).className = 'hidden';
                              }}
                            />
                          ) : (
                            <span>{item.name.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                          <p className="text-[11px] font-black text-indigo-600 mt-1">${item.unitPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          addItemFromCatalog(item);
                          setShowCatalogPicker(false);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all opacity-0 group-hover:opacity-100"
                      >
                        Seleccionar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Toaster position="top-right" richColors />
      {showSpeechModal && <SpeechModal onClose={() => setShowSpeechModal(false)} />}
      {showProModal && <ProUpgradeModal onClose={() => setShowProModal(false)} onUpgrade={upgradeToPro} userEmail={user?.email || ''} />}
    </div>
  );
}
