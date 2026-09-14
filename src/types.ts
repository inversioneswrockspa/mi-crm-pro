export interface BudgetItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unitCost?: number;
  discount: number;
  margin: number;
  imageUrl?: string | null;
  images?: string[];
  techSpecs?: string;
  pdfUrl?: string;
  taxType?: 'factura' | 'efectivo';
}

export interface ClientInfo {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  date?: string;
  requirements?: string;
  customerRequirements?: string;
  requirementImages?: string[];
  projectConditions?: string;
  destinationCity?: string;
  freightCost?: number;
  freightMargin?: number;
  notes?: string;
  promoterId?: string;
  promoterName?: string;
  closerId?: string;
  closerName?: string;
  promoterCommissionRate?: number;
  closerCommissionRate?: number;
  promoterCommissionAmount?: number;
  closerCommissionAmount?: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'paid' | 'rejected' | 'enviado' | 'expired' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface QuoteItem {
  id: string;
  clientInfo: ClientInfo;
  items: BudgetItem[];
  quoteRefId: string;
  createdAt: any;
  status?: string;
  totalBruto: number;
  totalCost?: number;
  totalMargin?: number;
  profile?: 'security';
  signature?: string;
  discount?: number;
  aiAnalysis?: string | null;
  clientName?: string;
  subtotalNeto?: number;
  totalProposal?: number;
  iva?: number;
  retencion?: number;
  taxType?: 'factura' | 'efectivo';
  visto?: boolean;
  fechaVista?: any;
  vistas?: number;
  unidadesDisponibles?: number;
}

export interface Expense {
  id: string;
  name: string;
  category: 'fijo' | 'variable' | 'mkt' | 'personal' | 'sueldo' | 'arriendo' | 'retiro' | 'impuesto' | 'interes' | 'amortizacion' | 'otro';
  amount: number;
  date: any;
  ownerId: string;
  description?: string;
}

export interface CashTransaction {
  id: string;
  concept: string;
  type: 'in' | 'out';
  amount: number;
  date: any;
  ownerId: string;
}

export interface CreditLine {
  id: string;
  institution: string;
  totalLimit: number;
  usedAmount: number;
  cutoffDay: number;
  paymentDay: number;
  ownerId: string;
  updatedAt: any;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl?: string;
  images?: string[];
  techSpecs?: string;
  pdfUrl?: string;
  totalVendido?: number;
  createdAt?: any;
  ownerId?: string;
  initialStock?: number;
  unitCost?: number;
  deliveryType?: 'bodega' | 'full_1d' | 'local_3d' | 'import_7d';
  enBodega?: boolean;
  modalidad?: 'stock' | 'venta_calzada' | 'agotado';
  tiempoEntrega?: string;
  precioVentaFinal?: number;
}

export interface ClientAccount {
  id: string;
  name: string;
  company: string;
  rut: string;
  phone: string;
  email: string;
  address: string;
  terrainNotes: string;
  ownerId: string;
  createdAt: any;
}

export interface Shrinkage {
  id: string;
  productName: string;
  quantity: number;
  unitCost: number;
  reason: 'malo' | 'devuelto' | 'vencido' | 'otro';
  date: any;
  ownerId: string;
  description?: string;
}

export interface PurchaseRecord {
  id: string;
  provider: string;
  documentNumber: string;
  date: any;
  netAmount: number;
  ivaAmount: number;
  totalAmount: number;
  category: 'mercaderia' | 'insumos' | 'servicios' | 'activos' | 'otros';
  description?: string;
  ownerId: string;
  isPaid: boolean;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta' | 'credito' | 'cheque';
}

export interface ImportBatch {
  id: string;
  name: string;
  date: any;
  items: {
    product: string;
    quantity: number;
    unitCost: number;
    salePrice: number;
    currentInventory: number;
  }[];
  totalInvestment: number;
  totalExpenses: number;
  ownerId: string;
  notes?: string;
  quantity?: number;
  associatedProductId?: string;
  hasCertificateOfOrigin?: boolean;
  hasIvaF29?: boolean;
  arancelAmount?: number;
  ivaAmount?: number;
  netUnitCost?: number;
  status?: 'en_transito' | 'en_bodega';
}

export interface MarketplaceStructuredDialogueTurn {
  id: string;
  clientMsg: string;
  sellerReply: string;
}

export interface MarketplaceStructuredDialogue {
  id: string;
  title: string;
  turns: MarketplaceStructuredDialogueTurn[];
}

export interface MarketplaceTrainingPair {
  id: string;
  clientMsg: string;
  wrockReply: string;
  scenario?: string;
}

export interface MarketplaceBotConfig {
  bodegaAddress: string;
  dispatchDays: string[];
  minFreeDispatchAmount: number;
  smallOrderDispatchText: string;
  taxIncludedInPrice?: boolean;
  userCity?: string;
  customAiInstructions?: string;
  trainingPairs?: MarketplaceTrainingPair[];
  fullChatTranscripts?: { id: string; title: string; text: string }[];
  structuredDialogues?: MarketplaceStructuredDialogue[];
  bankDetails: {
    bank: string;
    accountType: string;
    accountNumber: string;
    rut: string;
    email: string;
    holderName: string;
  };
  paymentLinkUrl: string;
  humanDelaySeconds: number;
  autoReplyEnabled: boolean;
  templates?: {
    initialReply: string;
    pickupReply: string;
    noStockDispatchReply: string;
    hasStockDispatchReply: string;
    paymentReply: string;
    invoiceReply: string;
  };
}

export interface MarketplaceMessage {
  id: string;
  sender: 'client' | 'bot';
  text: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface MarketplaceConversation {
  id: string;
  clientName: string;
  productName: string;
  hasPhysicalStock: boolean;
  messages: MarketplaceMessage[];
  status: 'initial' | 'date_inquired' | 'pickup_offered' | 'dispatch_offered' | 'payment_sent' | 'invoice_requested' | 'closed';
}

export interface Promoter {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  code: string;
  role: 'promoter' | 'closer' | 'both';
  status?: 'active' | 'inactive';
  totalEarned: number;
  totalPaid: number;
  createdAt: string;
  ownerId?: string;
}

export interface CommissionRecord {
  id: string;
  quoteId: string;
  clientName: string;
  date: string;
  promoterId?: string;
  promoterName?: string;
  closerId?: string;
  closerName?: string;
  totalSaleAmount: number;
  productsSummary: string; // e.g. "Generador Eléctrico x 1, Cámara Hikvision x 2"
  promoterAmount: number;
  closerAmount: number;
  promoterPaid: boolean;
  closerPaid: boolean;
}

