import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Clock, 
  Building2, 
  Truck, 
  CreditCard, 
  FileCheck2, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Sparkles, 
  Settings, 
  ShieldCheck,
  MessageSquare,
  PackageCheck,
  PackageX,
  Code,
  Download,
  HelpCircle,
  Zap,
  Edit3,
  Save,
  BrainCircuit,
  DollarSign,
  AlertTriangle,
  MapPin,
  FileText,
  Plus,
  Trash2,
  User,
  MessageCircle,
  ThumbsUp,
  Layers,
  ArrowRight,
  ClipboardList,
  Power,
  ToggleLeft,
  ToggleRight,
  Radio,
  Eye,
  Minimize2,
  Move,
  ExternalLink,
  Wifi,
  ShieldAlert
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CatalogItem, MarketplaceBotConfig, MarketplaceMessage, MarketplaceStructuredDialogue, MarketplaceStructuredDialogueTurn } from '../../types';

interface MarketplaceBotModuleProps {
  catalog: CatalogItem[];
}

export const MarketplaceBotModule: React.FC<MarketplaceBotModuleProps> = ({ catalog }) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'rules' | 'training' | 'extension'>('simulator');
  const [useAiEngine, setUseAiEngine] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  
  // Configuration State with INVERSIONES WROCK SPA RULES & STRUCTURED DIALOGUES
  const [config, setConfig] = useState<MarketplaceBotConfig>(() => {
    const savedConfig = localStorage.getItem('marketplace_bot_config');
    if (savedConfig) {
      try { return JSON.parse(savedConfig); } catch (e) {}
    }
    return {
      bodegaAddress: 'Calle La Conquista 1906, Las Compañías, La Serena',
      dispatchDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      minFreeDispatchAmount: 100000,
      smallOrderDispatchText: 'El despacho a domicilio en La Serena/Coquimbo tiene un costo extra de $3.000, o puedes retirar sin costo en nuestra Bodega en Calle La Conquista 1906, Las Compañías. Para envíos fuera de la zona enviamos por pagar vía Starken, Chilexpress o el courier que prefieras.',
      taxIncludedInPrice: false, // Net prices; +19% IVA when boleta/factura requested
      userCity: 'La Serena / Coquimbo',
      customAiInstructions: `REGLAS OFICIALES DE INVERSIONES WROCK SPA:
1. Empresa: Inversiones Wrock SpA (RUT: 78.377.039-3).
2. Bodega: Calle La Conquista 1906, Las Compañías, La Serena.
3. Horarios: Atención y ventas presenciales de 07:00 AM a 17:00 HRS. Retiro nocturno hasta las 22:00 HRS (solo productos previamente pagados).
4. Despacho Local: Costo extra de $3.000 (o retiro gratis en bodega).
5. Despacho Regiones: Por pagar vía Starken, Chilexpress o courier a elección.
6. Boleta/Factura: Los precios de catálogo son netos. Si piden boleta o factura se adicciona +19% IVA al valor del producto.
7. Medios de Pago: Efectivo/Transferencia al retirar presencial de 07:00 a 17:00 hrs. Transferencia o Link de Pago con tarjeta para reservas, retiró nocturno o despacho.
8. Sin Stock / Recarga: Si stock=0, preguntar "¿Para cuándo lo necesita?". Informar fecha de recarga (ej. Miércoles) y solicitar pre-pago para congelar reserva. Dejar muy claro que la entrega es para el día futuro de la recarga.
9. Estado y Garantía: Productos 100% nuevos. NUNCA mencionar garantía por iniciativa propia; solo si el cliente lo pregunta explícitamente responder "Sí, el producto es 100% nuevo y cuenta con garantía."
10. Descuentos: Si piden descuento por cantidad, responder "Déjame consultar tu solicitud de descuento con el encargado para ver qué precio especial te podemos hacer. En breve te respondemos por aquí mismo."
11. Cierre Venta / Aceptación de Despacho: Si el cliente dice "traigamelo", "tráigamelo nomas", "ya traelo", "enviamelo", "está bien", pedir INMEDIATAMENTE su dirección exacta y teléfono para el repartidor. PROHIBIDO volver a saludar si ya es turno > 1.`,
      structuredDialogues: [
        {
          id: 'dialogue-1',
          title: 'Venta con Retiro Presencial en Bodega',
          turns: [
            { id: 't1', clientMsg: 'hola sigue disponible', sellerReply: '¡Hola! Sí, disponible. ¿Para cuándo lo necesita?' },
            { id: 't2', clientMsg: 'donde puedo retirar', sellerReply: 'Estamos ubicados en Calle La Conquista 1906, Las Compañías. Atendemos de 07:00 AM a 17:00 hrs para ventas presenciales, y entregamos productos pagados hasta las 22:00 hrs.' },
            { id: 't3', clientMsg: 'ok puedo pagar cuando lo retire', sellerReply: 'Claro, para retiro presencial entre 07:00 AM y 17:00 hrs puedes pagar en efectivo o transferencia al momento de retirar en nuestra bodega. ¿A qué hora te acomodaría pasar?' },
            { id: 't4', clientMsg: 'como a las 5, mi nombre es Luis', sellerReply: 'Impecable Luis, ya quedaste anotado para el retiro hoy a las 17:00 hrs en nuestra bodega en Calle La Conquista 1906. ¡Te esperamos!' }
          ]
        },
        {
          id: 'dialogue-2',
          title: 'Confirmación de Despacho (Aceptación "traígamelo")',
          turns: [
            { id: 't1', clientMsg: 'hola tienes disponible', sellerReply: '¡Hola! Sí, disponible. ¿Para cuándo lo necesita?' },
            { id: 't2', clientMsg: 'hace despachos o delivery?', sellerReply: 'Tenemos disponible en bodega. El despacho a domicilio en La Serena/Coquimbo tiene un costo extra de $3.000, o puedes retirar sin costo en Calle La Conquista 1906. ¿Qué opción te acomoda?' },
            { id: 't3', clientMsg: 'a ya traigamelo nomas esta bien', sellerReply: '¡Perfecto! Para coordinar tu despacho a domicilio ($3.000), por favor me indicas tu dirección exacta y un número de celular de contacto para cargarlo al GPS del repartidor.' }
          ]
        }
      ],
      bankDetails: {
        bank: 'Mercado Pago',
        accountType: 'Cuenta Vista',
        accountNumber: '783770393',
        rut: '78.377.039-3',
        email: 'inversioneswrockspa@gmail.com',
        holderName: 'Inversiones Wrock SpA'
      },
      paymentLinkUrl: 'https://mpago.la/inversiones-wrock',
      humanDelaySeconds: 3,
      autoReplyEnabled: true,
      templates: {
        initialReply: '¡Hola! Sí, disponible. ¿Para cuándo lo necesita?',
        pickupReply: 'Estamos ubicados en Calle La Conquista 1906, Las Compañías. Atendemos de 07:00 AM a 17:00 hrs para ventas presenciales, y entregamos productos pagados hasta las 22:00 hrs.',
        noStockDispatchReply: 'Por el momento se nos agotó en bodega, pero nos llega recarga este día Miércoles. ¿Te acomoda agendarlo o reservarlo con pre-pago?',
        hasStockDispatchReply: 'Tenemos disponible en bodega. El despacho a domicilio sale $3.000 extra o puedes retirar sin costo en Calle La Conquista 1906. ¿Qué opción te acomoda?',
        paymentReply: 'Datos bancarios de la empresa:\n\n🏦 Mercado Pago (Cuenta Vista)\n🆔 RUT: 78.377.039-3\n👤 Titular: Inversiones Wrock SpA\n📧 Email: inversioneswrockspa@gmail.com\n\nO si prefieres, te enviamos Link de Pago para pagar con tarjeta de crédito/débito.',
        invoiceReply: 'Sí, emitimos boleta y factura formal. Los precios son netos, por lo que si necesitas boleta o factura se adiciona el 19% de IVA al valor del producto. Para facturar, ¿me indicas Razón Social, RUT y Email?'
      }
    };
  });

  // REAL-TIME SYNC STATE FROM LIVE FACEBOOK MESSENGER
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveClientName, setLiveClientName] = useState('Cliente Facebook en Vivo');

  // CROSS-DOMAIN WINDOW POSTMESSAGE REAL-TIME LISTENER
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'WROCK_BOT_SYNC') {
        const { sender, text, clientName } = event.data;
        setIsLiveConnected(true);
        if (clientName) setLiveClientName(clientName);

        const newMsg: MarketplaceMessage = {
          id: Date.now().toString(),
          sender,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMsg]);
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  // Listen to LocalStorage for tab sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === 'marketplace_live_chat_event' || e.key === 'wrock_bot_live_sync') && e.newValue) {
        try {
          const liveData = JSON.parse(e.newValue);
          setIsLiveConnected(true);
          if (liveData.clientName) setLiveClientName(liveData.clientName);

          const newMsg: MarketplaceMessage = {
            id: Date.now().toString(),
            sender: liveData.sender,
            text: liveData.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setMessages(prev => [...prev, newMsg]);
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Open Facebook Messenger as child window with direct postMessage bridge
  const handleOpenFacebookLiveBridge = () => {
    window.open('https://www.facebook.com/messages', 'FacebookMessengerWindow', 'width=1100,height=800');
  };

  // Toggle Bot ON/OFF handler
  const handleToggleAutoReply = () => {
    const updatedConfig = { ...config, autoReplyEnabled: !config.autoReplyEnabled };
    saveConfigToStorage(updatedConfig);
  };

  // State for Structured Dialogue Builder (Pregunta Cliente ↔ Respuesta Seller)
  const [newDialogueTitle, setNewDialogueTitle] = useState('');
  const [newDialogueTurns, setNewDialogueTurns] = useState<MarketplaceStructuredDialogueTurn[]>([
    { id: 'turn-1', clientMsg: '', sellerReply: '' }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [crmAlert, setCrmAlert] = useState<{ title: string; detail: string; type: 'closed' | 'discount' } | null>(null);

  const saveConfigToStorage = (newConfig: MarketplaceBotConfig) => {
    setConfig(newConfig);
    localStorage.setItem('marketplace_bot_config', JSON.stringify(newConfig));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Handler to add a new dialogue turn in training builder
  const handleAddTurn = () => {
    setNewDialogueTurns(prev => [
      ...prev,
      { id: `turn-${Date.now()}-${prev.length + 1}`, clientMsg: '', sellerReply: '' }
    ]);
  };

  const handleUpdateTurn = (id: string, field: 'clientMsg' | 'sellerReply', value: string) => {
    setNewDialogueTurns(prev => prev.map(turn => turn.id === id ? { ...turn, [field]: value } : turn));
  };

  const handleDeleteTurn = (id: string) => {
    if (newDialogueTurns.length <= 1) return;
    setNewDialogueTurns(prev => prev.filter(turn => turn.id !== id));
  };

  const handleSaveStructuredDialogue = () => {
    const validTurns = newDialogueTurns.filter(t => t.clientMsg.trim() && t.sellerReply.trim());
    if (validTurns.length === 0) {
      alert("Por favor ingresa al menos 1 par completo de (Pregunta Cliente ↔ Respuesta Vendedor).");
      return;
    }

    const newDialogue: MarketplaceStructuredDialogue = {
      id: `dialogue-${Date.now()}`,
      title: newDialogueTitle.trim() || `Diálogo Entrenado #${(config.structuredDialogues || []).length + 1}`,
      turns: validTurns
    };

    const updatedDialogues = [newDialogue, ...(config.structuredDialogues || [])];
    const updatedConfig = { ...config, structuredDialogues: updatedDialogues };
    saveConfigToStorage(updatedConfig);

    setNewDialogueTitle('');
    setNewDialogueTurns([{ id: `turn-${Date.now()}`, clientMsg: '', sellerReply: '' }]);
  };

  const handleDeleteStructuredDialogue = (id: string) => {
    const updatedDialogues = (config.structuredDialogues || []).filter(d => d.id !== id);
    saveConfigToStorage({ ...config, structuredDialogues: updatedDialogues });
  };

  // Demo fallback items if catalog is empty
  const defaultDemoCatalog: CatalogItem[] = [
    {
      id: 'demo-destapador',
      name: 'Destapador de Cañería Laucha 5 metros',
      description: 'Laucha destapadora de cañerías 5 metros manual con manivela reforzada',
      unitCost: 4500,
      unitPrice: 9990,
      initialStock: 10
    },
    {
      id: 'demo-motobomba',
      name: 'Motobomba Bencinera Erux 3 6.5hp',
      description: 'Motobomba bencinera 6.5hp alta eficiencia 3 pulgadas',
      unitCost: 89927,
      unitPrice: 150000,
      initialStock: 3
    },
    {
      id: 'demo-manguera',
      name: 'Manguera de Motobomba 3 Pulgadas (25m)',
      description: 'Rollo de manguera de 25 metros de 3 pulgadas de alta resistencia para motobomba',
      unitCost: 12000,
      unitPrice: 19990,
      initialStock: 0
    }
  ];

  const activeCatalog = catalog.length > 0 ? catalog : defaultDemoCatalog;
  const [selectedProductId, setSelectedProductId] = useState<string>(activeCatalog[0]?.id || 'demo-destapador');
  const selectedProduct = activeCatalog.find(p => p.id === selectedProductId) || activeCatalog[0];

  // OVERRIDE PRICE FEATURE
  const [customPriceOverrides, setCustomPriceOverrides] = useState<Record<string, number>>({});
  const activeSalePrice = customPriceOverrides[selectedProduct.id] ?? selectedProduct.unitPrice ?? 9990;

  const handleUpdateProductPrice = (newPrice: number) => {
    setCustomPriceOverrides(prev => ({
      ...prev,
      [selectedProduct.id]: newPrice
    }));
  };

  // Physical Stock Override for Testing
  const [simulatedStock, setSimulatedStock] = useState<number>(selectedProduct.initialStock ?? 5);

  useEffect(() => {
    if (selectedProduct && selectedProduct.initialStock !== undefined) {
      setSimulatedStock(selectedProduct.initialStock);
    }
  }, [selectedProductId]);

  // Chat State
  const [messages, setMessages] = useState<MarketplaceMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `🤖 Monitor en Vivo del Bot de Marketplace (Inversiones Wrock SpA). Conectado a Stock Físico (${simulatedStock > 0 ? `${simulatedStock} un. en Bodega` : '0 un. Agotado / Encargo'}).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [clientInput, setClientInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activeRuleNotice, setActiveRuleNotice] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- GEMINI AI ENGINE WITH CONVERSATION TURN LOCK & INVERSIONES WROCK SPA RULES ---
  const generateAiBotResponse = async (clientText: string, stock: number, chatHistory: MarketplaceMessage[]) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return generateRuleBotResponse(clientText, stock, chatHistory);
    }

    const salePrice = activeSalePrice;
    const clientMessagesCount = chatHistory.filter(m => m.sender === 'client').length;

    // Formatted Structured Dialogues
    const dialoguesText = (config.structuredDialogues || [])
      .map((d, i) => {
        const turnsFormatted = d.turns
          .map(t => `Comprador: ${t.clientMsg}\nVendedor (Wrock): ${t.sellerReply}`)
          .join('\n');
        return `=== EJEMPLO DE ENTRENAMIENTO #${i + 1}: ${d.title} ===\n${turnsFormatted}`;
      })
      .join('\n\n');

    try {
      const ai = new GoogleGenAI({ apiKey });
      const formattedHistory = chatHistory
        .filter(m => m.id !== '1')
        .map(m => `${m.sender === 'client' ? 'Comprador' : 'Vendedor (Wrock Bot)'}: ${m.text}`)
        .join('\n');

      const systemPrompt = `Eres Wrock, vendedor oficial de Inversiones Wrock SpA en Facebook Marketplace Chile (La Serena / Coquimbo).
Hablas en español chileno natural, amigable, directo, respetuoso y rápido para cerrar ventas.

TURNO ACTUAL DE LA CONVERSACIÓN: #${clientMessagesCount}

APRENDE E IMITA ESTOS DIÁLOGOS DE ENTRENAMIENTO PAREDIADOS (Pregunta Cliente ↔ Respuesta Seller):
${dialoguesText || 'Sin diálogos guardados.'}

DATOS DEL NEGOCIO E INVENTARIO ACTUAL:
- Producto en consulta: ${selectedProduct.name}
- Descripción / Ficha técnica: ${selectedProduct.description || 'Producto de alta calidad sellado.'}
- PRECIO DE VENTA BASE (NETO): $${salePrice.toLocaleString('es-CL')} CLP
- Stock Físico Actual en Bodega: ${stock > 0 ? `${stock} unidades disponibles para retiro/despacho inmediato` : '0 unidades en bodega (PRODUCTO AGOTADO / REQUIERE ENCARGO)'}
- Dirección Bodega: Calle La Conquista 1906, Las Compañías, La Serena.
- Horarios Bodega: 07:00 AM a 17:00 HRS presencial. Retiro nocturno hasta 22:00 HRS (solo productos previamente pagados).
- Política de IVA/Facturación: Los precios son NETOS. Si piden boleta o factura se ADICIONA 19% IVA al valor del producto ($${salePrice.toLocaleString('es-CL')} + 19% IVA + $3.000 despacho si aplica).
- Regla Despacho Local: Costo de $3.000 extra o retiro gratis en bodega.
- Regla Despacho Regiones: Por pagar vía Starken, Chilexpress o courier a elección.
- Regla Garantía: Productos 100% NUEVOS. NUNCA mencionar garantía por iniciativa propia; solo si el cliente lo pregunta explícitamente responder "Sí, el producto es 100% nuevo y cuenta con garantía."
- Regla Descuento: Si piden rebaja/descuento por cantidad, responder EXACTAMENTE: "Déjame consultar tu solicitud de descuento con el encargado para ver qué precio especial te podemos hacer. En breve te respondemos por aquí mismo."

REGLAS DE ESTADO Y BLOQUEO DE SALUDO (CRÍTICO):
1. RESPUESTAS CORTAS Y DIRECTAS (1 A 2 LÍNEAS MÁXIMO).
2. SI EL TURNO ES > 1 (LA CONVERSACIÓN YA EMPEZÓ): TIENES STRICTAMENTE PROHIBIDO volver a saludar o decir "¡Hola! Sí disponible...".
3. ACEPTACIÓN DE DESPACHO: Si el cliente dice "traigamelo", "tráigamelo nomas", "ya traelo", "enviamelo", "está bien tráelo", o "?", solicita DE INMEDIATO su dirección exacta y celular para el repartidor.
4. SI ES PRODUCTO SIN STOCK (${stock === 0}): Informar fecha de recarga (ej. Miércoles), consultar urgencia y exigir pre-pago por transferencia o tarjeta para congelar reserva. Reafirmar que la entrega es para el día futuro de la recarga.
5. NUNCA REPETIR EL PRECIO si la conversación ya avanzó a la entrega de nombre, dirección o cel. Confirma que quedó cargado en el GPS.

HISTORIAL DE CHAT ACTUAL (Turno #${clientMessagesCount}):
${formattedHistory}
Comprador: ${clientText}

Responde de forma limpia como Vendedor (Wrock Bot):`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
      });

      if (response.text) {
        setActiveRuleNotice(`🤖 IA Gemini: Turno #${clientMessagesCount}. Evaluado con ${(config.structuredDialogues || []).length} diálogos y candado de estado.`);
        return response.text.trim();
      }
    } catch (e) {
      console.error("Gemini AI error:", e);
    }

    return generateRuleBotResponse(clientText, stock, chatHistory);
  };

  // --- RULE ENGINE FALLBACK WITH STATE TRACKING & CHILEAN EXPRESSIONS ---
  const generateRuleBotResponse = (clientText: string, stock: number, chatHistory: MarketplaceMessage[]) => {
    const textLower = clientText.toLowerCase().trim();
    const salePrice = activeSalePrice;
    const clientMessagesCount = chatHistory.filter(m => m.sender === 'client').length;

    // 1. ACEPTACIÓN EXPLÍCITA DE DESPACHO EN CHILENO
    if (
      textLower.includes('traigamelo') || 
      textLower.includes('tráigamelo') || 
      textLower.includes('traelo') || 
      textLower.includes('tráelo') || 
      textLower.includes('enviamelo') || 
      textLower.includes('envíamelo') || 
      textLower.includes('llevamelo') || 
      textLower.includes('llévamelo') || 
      textLower.includes('mándamelo') || 
      textLower.includes('mandamelo') || 
      textLower.includes('pasamelo a dejar') ||
      textLower.includes('ya traigamelo') ||
      textLower.includes('traigalo') ||
      (textLower.includes('está bien') && clientMessagesCount > 1) ||
      (textLower.includes('esta bien') && clientMessagesCount > 1) ||
      (textLower.includes('lo quiero') && clientMessagesCount > 1)
    ) {
      return `¡Perfecto! Para coordinar tu despacho a domicilio ($3.000), por favor me indicas tu dirección exacta y un número de celular de contacto para cargarlo al GPS del repartidor.`;
    }

    // 2. SOLICITUD DE DESCUENTO
    if (textLower.includes('descuento') || textLower.includes('rebaja') || textLower.includes('barato') || textLower.includes('haces descuento') || textLower.includes('dejas en')) {
      setCrmAlert({
        title: '🚨 SOLICITUD DE DESCUENTO EN MARKETPLACE',
        detail: `Cliente solicita descuento por el producto ${selectedProduct.name}. Derivado al encargado.`,
        type: 'discount'
      });
      return `Déjame consultar tu solicitud de descuento con el encargado para ver qué precio especial te podemos hacer. En breve te respondemos por aquí mismo.`;
    }

    // 3. DESPACHO A REGIONES / OTRAS CIUDADES
    if (textLower.includes('copiapo') || textLower.includes('copiapó') || textLower.includes('ovalle') || textLower.includes('vallenar') || textLower.includes('regiones') || textLower.includes('envio a') || textLower.includes('envíos a')) {
      return `Sí, realizamos envíos por pagar a través de Starken, Chilexpress o el courier que tú prefieras. Para coordinarlo, ¿me indicas tu Nombre completo, RUT, teléfono y si prefieres envío a sucursal o a domicilio?`;
    }

    // 4. DATOS DE ENTREGA CONFIRMADOS -> CIERRE CON ALERTA GPS
    if (textLower.includes('balmaceda') || textLower.includes('cel') || textLower.includes('rut') || textLower.includes('dirección') || textLower.includes('direccion') || (textLower.length > 20 && /\d/.test(textLower) && !textLower.includes('cuanto') && !textLower.includes('precio'))) {
      setCrmAlert({
        title: '🚨 VENTA CERRADA EN MARKETPLACE',
        detail: `Datos recibidos del cliente: "${clientText}". Revisa la ruta en GPS y confirma el horario exacto de salida.`,
        type: 'closed'
      });
      return `¡Impecable! Datos recibidos y cargados para la ruta. En unos minutos te confirmamos por aquí la hora exacta de salida del repartidor.`;
    }

    // 5. PREGUNTA SOBRE FICHA TÉCNICA / CARACTERÍSTICAS
    if (textLower.includes('cuanto metros') || textLower.includes('cuántos metros') || textLower.includes('medidas') || textLower.includes('largo') || textLower.includes('caracteristicas') || textLower.includes('pulgadas')) {
      const desc = selectedProduct.description || 'Producto de alta resistencia 100% nuevo.';
      return `Es un ${selectedProduct.name}: ${desc}. ¿Te gustaría coordinar el despacho o retiro?`;
    }

    // 6. CONSULTA DE BOLETA O FACTURA (+19% IVA)
    if (textLower.includes('factura') || textLower.includes('boleta') || textLower.includes('iva') || textLower.includes('empresa')) {
      const priceWithTax = Math.round(salePrice * 1.19);
      return `Sí, emitimos boleta y factura formal. Los precios son netos, por lo que al solicitar boleta o factura el valor queda en $${priceWithTax.toLocaleString('es-CL')} (incluye 19% IVA). Para facturar, ¿me indicas Razón Social, RUT y Email?`;
    }

    // 7. RETIRO Y DIRECCIÓN EN BODEGA
    if (textLower.includes('donde') || textLower.includes('dónde') || textLower.includes('ubicado') || textLower.includes('retirar') || textLower.includes('ubicacion') || textLower.includes('bodega')) {
      return `Estamos ubicados en Calle La Conquista 1906, Las Compañías. Atendemos de 07:00 AM a 17:00 hrs para ventas presenciales, y entregamos productos pagados hasta las 22:00 hrs.`;
    }

    // 8. PRODUCTO SIN STOCK (STOCK = 0)
    if (stock === 0) {
      if (textLower.includes('despacho') || textLower.includes('envio') || textLower.includes('retirar') || textLower.includes('pago') || textLower.includes('precio') || textLower.includes('hoy')) {
        return `Por el momento se nos agotó en bodega ${selectedProduct.name}, pero nos llega recarga este día Miércoles.\n\nPara el día Miércoles tu retiro/despacho queda agendado. Como aplican las entregas nocturnas o reserva de camión, te enviamos datos bancarios para transferir (Inversiones Wrock SpA - Mercado Pago) o Link de Pago. ¿Qué opción prefieres?`;
      }
      return `Por el momento se nos agotó en bodega ${selectedProduct.name}, pero nos llega recarga de ese producto el día Miércoles. ¿Para cuándo lo necesitas?`;
    }

    // 9. DESPACHO LOCAL (CON STOCK)
    if (textLower.includes('despacho') || textLower.includes('envio') || textLower.includes('domicilio')) {
      return `Tenemos disponible en bodega. El despacho a domicilio en La Serena/Coquimbo tiene un costo extra de $3.000, o puedes retirar sin costo en Calle La Conquista 1906. ¿Qué opción te acomoda?`;
    }

    // 10. GARANTÍA O ESTADO DEL PRODUCTO
    if (textLower.includes('garantia') || textLower.includes('garantía') || textLower.includes('nuevo') || textLower.includes('usado')) {
      return `Sí, todos nuestros productos son 100% nuevos y cuentan con garantía.`;
    }

    // 11. MANEJO DE SIGNO DE PREGUNTA "?" O TEXTO CORTO EN CONVERSACIÓN AVANZADA
    if (clientMessagesCount > 1) {
      return `Impecable. Para coordinar la entrega o despacho, ¿me indicas tu dirección exacta y teléfono de contacto para el repartidor?`;
    }

    // 12. SALUDO INICIAL ÚNICAMENTE SI ES EL PRIMER MENSAGE (TURNO 1)
    if (textLower.includes('disponible') || textLower.includes('hola') || textLower.includes('buenas')) {
      return `¡Hola! Sí, disponible. ¿Para cuándo lo necesita?`;
    }

    return `¡Hola! Sí, disponible en bodega. ¿Para cuándo lo necesitas o de qué sector eres?`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const input = textToSend || clientInput;
    if (!input.trim() || isTyping) return;

    const userMessage: MarketplaceMessage = {
      id: Date.now().toString(),
      sender: 'client',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newChatHistory = [...messages, userMessage];
    setMessages(newChatHistory);
    if (!textToSend) setClientInput('');

    // IF BOT IS SWITCHED OFF (MANUAL MODE), DO NOT AUTO REPLY
    if (!config.autoReplyEnabled) {
      const manualNotice: MarketplaceMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: '🔴 Bot de Marketplace en MODO MANUAL (Desactivado). El vendedor responderá directamente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, manualNotice]);
      return;
    }

    setIsTyping(true);
    let secondsLeft = config.humanDelaySeconds;
    setCountdown(secondsLeft);

    const interval = setInterval(async () => {
      secondsLeft -= 1;
      setCountdown(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(interval);
        
        let botReplyText = "";
        if (useAiEngine) {
          setIsAiLoading(true);
          botReplyText = await generateAiBotResponse(input, simulatedStock, newChatHistory);
          setIsAiLoading(false);
        } else {
          botReplyText = generateRuleBotResponse(input, simulatedStock, newChatHistory);
        }

        const botMessage: MarketplaceMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setCountdown(null);
      }
    }, 1000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: `🤖 Chat reiniciado. Estado del Bot: ${config.autoReplyEnabled ? '🟢 ACTIVADO (Automático)' : '🔴 APAGADO (Modo Manual)'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveRuleNotice(null);
  };

  // Convert current test chat to a new Structured Training Dialogue with 1 click
  const handleSaveCurrentChatAsTraining = () => {
    const clientMsgs = messages.filter(m => m.id !== '1');
    if (clientMsgs.length < 2) {
      alert("Realiza una prueba en el simulador primero para generar diálogos.");
      return;
    }

    const turns: MarketplaceStructuredDialogueTurn[] = [];
    for (let i = 0; i < clientMsgs.length; i++) {
      if (i % 2 === 0 && clientMsgs[i].sender === 'client') {
        const nextBotMsg = clientMsgs[i + 1]?.sender === 'bot' ? clientMsgs[i + 1].text : '';
        turns.push({
          id: `turn-${Date.now()}-${i}`,
          clientMsg: clientMsgs[i].text,
          sellerReply: nextBotMsg || '¡Hola! Sí disponible.'
        });
      }
    }

    if (turns.length === 0) return;

    const newDialogue: MarketplaceStructuredDialogue = {
      id: `dialogue-${Date.now()}`,
      title: `Entrenamiento desde Simulador (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      turns
    };

    const updatedDialogues = [newDialogue, ...(config.structuredDialogues || [])];
    saveConfigToStorage({ ...config, structuredDialogues: updatedDialogues });
    setActiveTab('training');
  };

  // Chrome Extension Script Content (ANTI-LOOP SAFETY GUARD + STRICT SENT MESSAGES FILTER)
  const chromeExtensionScript = `// === SCRIPT BOT FACEBOOK MARKETPLACE - INVERSIONES WROCK SPA (ANTI-LOOP SAFETY GUARD) ===
(function() {
  console.log("🚀 Bot Auto-Responder Inversiones Wrock SpA iniciando en Facebook con filtro Anti-Loop...");
  
  const CONFIG = ${JSON.stringify(config, null, 2)};
  const PRECIO_VENTA_NETO = "$${activeSalePrice.toLocaleString('es-CL')}";
  const PRODUCT_NAME = "${selectedProduct.name}";
  let lastProcessedText = "";
  let isResponding = false;
  let isMinimized = false;

  // MEMORY OF SENT RESPONSES TO ABSOLUTELY AVOID REPLYING TO OURSELVES
  const sentMessagesMemory = new Set([
    "¡hola! sí, disponible. ¿para cuándo lo necesita?",
    "estamos ubicados en calle la conquista 1906, las compañías. atendemos de 07:00 am a 17:00 hrs para ventas presenciales, y entregamos productos pagados hasta las 22:00 hrs.",
    "¡perfecto! para coordinar tu despacho a domicilio ($3.000), por favor me indicas tu dirección exacta y un número de celular de contacto para cargarlo al gps del repartidor.",
    "déjame consultar tu solicitud de descuento con el encargado para ver qué precio especial te podemos hacer. en breve te respondemos por aquí mismo.",
    "sí, emitimos boleta y factura formal. los precios son netos (+19% iva al solicitar factura). ¿me envías razón social, rut y email?",
    "impecable, para coordinar la entrega ¿me indicas tu dirección exacta y teléfono de contacto?"
  ]);

  // CROSS-DOMAIN POSTMESSAGE REAL-TIME SYNC WITH CRM
  function syncEventWithCRM(sender, text, clientName = "Cliente Facebook") {
    try {
      const payload = { type: 'WROCK_BOT_SYNC', sender, text, clientName, timestamp: Date.now() };
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(payload, '*');
      }
      const eventData = JSON.stringify({ timestamp: Date.now(), sender, text, clientName });
      localStorage.setItem('marketplace_live_chat_event', eventData);
      localStorage.setItem('wrock_bot_live_sync', eventData);
    } catch (e) {}
  }

  // --- FLOATING VISUAL STATUS WIDGET WITH STOP BUTTON & SENT MEMORY ---
  function createOrUpdateWidget(statusText, lastMsgText = "") {
    let widget = document.getElementById('wrock-bot-widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'wrock-bot-widget';
      widget.style.position = 'fixed';
      widget.style.top = '15px';
      widget.style.right = '15px';
      widget.style.zIndex = '9999999';
      widget.style.backgroundColor = '#0f172a';
      widget.style.color = '#ffffff';
      widget.style.padding = '12px 16px';
      widget.style.borderRadius = '16px';
      widget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.7)';
      widget.style.border = '2px solid #3b82f6';
      widget.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      widget.style.fontSize = '12px';
      widget.style.maxWidth = '310px';
      widget.style.cursor = 'move';
      widget.style.userSelect = 'none';

      let isDragging = false, offsetPointerX = 0, offsetPointerY = 0;
      widget.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        offsetPointerX = e.clientX - widget.offsetLeft;
        offsetPointerY = e.clientY - widget.offsetTop;
      });

      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        widget.style.left = (e.clientX - offsetPointerX) + 'px';
        widget.style.top = (e.clientY - offsetPointerY) + 'px';
        widget.style.right = 'auto';
      });

      document.addEventListener('mouseup', function() { isDragging = false; });
      document.body.appendChild(widget);
    }

    if (isMinimized) {
      widget.innerHTML = \`
        <div style="display:flex; align-items:center; justify-between; gap:10px;">
          <strong style="color:#60a5fa;">🤖 Wrock Bot</strong>
          <button id="wrock-min-btn" style="background:#3b82f6; border:none; color:#fff; padding:2px 8px; border-radius:6px; font-weight:bold; cursor:pointer;">📂 Abrir</button>
        </div>
      \`;
      document.getElementById('wrock-min-btn')?.addEventListener('click', () => { isMinimized = false; createOrUpdateWidget(statusText, lastMsgText); });
      return;
    }

    widget.innerHTML = \`
      <div style="display:flex; align-items:center; justify-between; gap:8px; margin-bottom:6px; border-bottom:1px solid #1e293b; padding-bottom:6px;">
        <span style="cursor:move; font-weight:bold; color:#60a5fa;">🖐️ Bot Wrock</span>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="background:\${CONFIG.autoReplyEnabled ? '#10b981' : '#f43f5e'}; color:#fff; padding:1px 6px; border-radius:8px; font-weight:bold; font-size:10px;">
            \${CONFIG.autoReplyEnabled ? '🟢 ON' : '🔴 OFF'}
          </span>
          <button id="wrock-min-btn" style="background:#334155; border:none; color:#94a3b8; padding:1px 6px; border-radius:6px; cursor:pointer;">_</button>
        </div>
      </div>
      <div style="color:#cbd5e1; font-size:11px; margin-bottom:6px;">\${statusText}</div>
      \${lastMsgText ? \`<div style="margin-bottom:6px; padding:6px; background:#1e293b; border-radius:8px; color:#a7f3d0; font-size:10px;">💬 Ultimo: "\${lastMsgText.substring(0, 40)}..."</div>\` : ''}
      <button id="wrock-stop-btn" style="width:100%; background:#e11d48; color:#fff; border:none; padding:6px; border-radius:8px; font-weight:bold; font-size:11px; cursor:pointer;">
        🛑 PAUSAR / DETENER BOT
      </button>
    \`;

    document.getElementById('wrock-min-btn')?.addEventListener('click', () => { isMinimized = true; createOrUpdateWidget(statusText, lastMsgText); });
    document.getElementById('wrock-stop-btn')?.addEventListener('click', () => {
      CONFIG.autoReplyEnabled = false;
      createOrUpdateWidget("🔴 BOT DETENIDO POR EL VENDEDOR.");
    });
  }

  createOrUpdateWidget("Escaneando chat abierto de Facebook Messenger...");

  function isSelfOrSellerText(txt) {
    const cleanTxt = txt.toLowerCase().trim();
    if (sentMessagesMemory.has(cleanTxt)) return true;
    for (let sentText of sentMessagesMemory) {
      if (cleanTxt.includes(sentText) || sentText.includes(cleanTxt)) return true;
    }
    return false;
  }

  function processIncomingMessage(clientText) {
    if (!CONFIG.autoReplyEnabled || isSelfOrSellerText(clientText)) return null;
    const textLower = clientText.toLowerCase().trim();

    if (textLower.includes("traigamelo") || textLower.includes("tráigamelo") || textLower.includes("enviamelo") || textLower.includes("traelo")) {
      return "¡Perfecto! Para coordinar tu despacho a domicilio ($3.000), por favor me indicas tu dirección exacta y un número de celular de contacto para cargarlo al GPS del repartidor.";
    }

    if (textLower.includes("descuento") || textLower.includes("rebaja")) {
      return "Déjame consultar tu solicitud de descuento con el encargado para ver qué precio especial te podemos hacer. En breve te respondemos por aquí mismo.";
    }

    if (textLower.includes("factura") || textLower.includes("boleta")) {
      return "Sí, emitimos boleta y factura formal. Los precios son netos (+19% IVA al solicitar factura). ¿Me envías Razón Social, RUT y Email?";
    }

    if (textLower.includes("donde") || textLower.includes("retirar") || textLower.includes("ubicacion")) {
      return "Estamos ubicados en Calle La Conquista 1906, Las Compañías. Atendemos de 07:00 AM a 17:00 hrs, y entregamos productos pagados hasta las 22:00 hrs.";
    }

    if (textLower.includes("disponible") || textLower.includes("hola") || textLower.includes("buenas")) {
      return "¡Hola! Sí, disponible. ¿Para cuándo lo necesita?";
    }

    return "Impecable, para coordinar la entrega ¿me indicas tu dirección exacta y teléfono de contacto?";
  }

  function sendReplyToFacebook(replyText) {
    // REGISTER THIS REPLY IN SENT MEMORY SO WE NEVER REPLY TO IT AGAIN
    sentMessagesMemory.add(replyText.toLowerCase().trim());

    const activeChatArea = document.querySelector('div[role="main"]') || 
                           document.querySelector('div[data-pagelet="MWChatThreadContent"]') || 
                           document.body;

    const inputBox = activeChatArea.querySelector('div[contenteditable="true"][role="textbox"]') || 
                     activeChatArea.querySelector('div[contenteditable="true"]') ||
                     document.querySelector('div[contenteditable="true"][role="textbox"]') ||
                     document.querySelector('div[contenteditable="true"]') ||
                     document.querySelector('p.xdj265r') ||
                     document.querySelector('div[role="textbox"]');
    
    if (!inputBox) {
      createOrUpdateWidget("⚠️ Casilla de chat no encontrada...", lastProcessedText);
      isResponding = false;
      return;
    }

    try {
      inputBox.focus();
      document.execCommand('insertText', false, replyText);
      
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      inputBox.dispatchEvent(inputEvent);

      setTimeout(() => {
        const rootDoc = inputBox.ownerDocument || document;
        const sendBtn = rootDoc.querySelector('div[aria-label="Presiona Entrar para enviar"]') || 
                       rootDoc.querySelector('div[aria-label="Press Enter to send"]') ||
                       rootDoc.querySelector('path[d*="M16.6915726"]')?.closest('div[role="button"]') ||
                       document.querySelector('div[aria-label="Enviar"]') ||
                       document.querySelector('div[aria-label="Send"]');
        
        if (sendBtn) {
          sendBtn.click();
        } else {
          const enterEvt = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
          inputBox.dispatchEvent(enterEvt);
        }

        createOrUpdateWidget("✅ Respuesta enviada con éxito", lastProcessedText);
        syncEventWithCRM('bot', replyText);
        isResponding = false;
      }, 700);
    } catch (e) {
      console.error("Error enviando respuesta:", e);
      isResponding = false;
    }
  }

  // MONITOR CHAT - ONLY RESPOND ONCE PER NEW CLIENT MESSAGE
  setInterval(() => {
    if (!CONFIG.autoReplyEnabled || isResponding) return;

    const activeChatArea = document.querySelector('div[role="main"]') || 
                           document.querySelector('div[data-pagelet="MWChatThreadContent"]') || 
                           document.body;

    const textNodes = Array.from(activeChatArea.querySelectorAll('div[role="row"] span, span.x1lliihq, span.html-span, div[dir="auto"]'));
    
    let latestText = "";
    for (let i = textNodes.length - 1; i >= 0; i--) {
      const parentNav = textNodes[i].closest('div[role="navigation"], div[aria-label="Chats"], div[aria-label="Conversaciones"]');
      if (parentNav) continue;

      const txt = (textNodes[i].innerText || textNodes[i].textContent || "").trim();
      
      // IGNORE SYSTEM BADGES AND ALL SENT MESSAGES
      if (
        txt && 
        txt.length > 1 && 
        txt.length < 250 && 
        !isSelfOrSellerText(txt) &&
        !txt.includes("no leído") && 
        !txt.includes("no leido") &&
        !txt.includes("unread") &&
        !txt.includes("Inversiones Wrock") && 
        !txt.includes("Bot Auto-Responder") &&
        !txt.includes("Visto") &&
        !txt.includes("Entregado") &&
        !txt.includes("Enviado")
      ) {
        latestText = txt;
        break;
      }
    }

    if (latestText && latestText !== lastProcessedText) {
      lastProcessedText = latestText;
      console.log("📩 MENSAJE DEL CLIENTE DETECTADO (Único):", latestText);
      createOrUpdateWidget("📩 Mensaje del cliente: " + latestText, latestText);
      syncEventWithCRM('client', latestText);
      
      const reply = processIncomingMessage(latestText);
      if (reply) {
        isResponding = true;
        createOrUpdateWidget("✍️ Respondiendo al cliente...", latestText);
        setTimeout(() => sendReplyToFacebook(reply), (CONFIG.humanDelaySeconds || 3) * 1000);
      }
    }
  }, 2000);

  console.log("✅ Bot Wrock con Escudo Anti-Bucle (Anti-Loop) activado.");
})();`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(chromeExtensionScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Bot size={30} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Bot de Ventas Facebook Marketplace</h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Inversiones Wrock SpA
                </span>
              </div>
              <p className="text-blue-200 text-sm mt-1">
                Monitoreo en vivo conectado a Facebook Messenger con Escudo Anti-Bucle.
              </p>
            </div>
          </div>

          {/* BOT ON / OFF TOGGLE & ENGINE SELECTOR */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* PROMINENT BOT ON / OFF TOGGLE BUTTON */}
            <button
              onClick={handleToggleAutoReply}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border shadow-lg ${
                config.autoReplyEnabled
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-950/40 ring-2 ring-emerald-400/50'
                  : 'bg-rose-900/90 text-rose-200 border-rose-600 shadow-rose-950/40'
              }`}
            >
              <Power size={18} className={config.autoReplyEnabled ? 'text-slate-950 animate-pulse' : 'text-rose-400'} />
              <span>{config.autoReplyEnabled ? '🟢 BOT ACTIVADO (Automático)' : '🔴 BOT APAGADO (Modo Manual Vendedor)'}</span>
            </button>

            <button
              onClick={() => setUseAiEngine(!useAiEngine)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                useAiEngine
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-purple-900/40 ring-2 ring-purple-400/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <BrainCircuit size={16} className={useAiEngine ? 'text-cyan-300 animate-pulse' : 'text-slate-400'} />
              <span>{useAiEngine ? 'IA Gemini (Activa 🧠)' : 'Reglas Wrock'}</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all ${
                  activeTab === 'simulator'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <MessageSquare size={16} />
                Monitor / Simulador
              </button>
              <button
                onClick={() => setActiveTab('training')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all ${
                  activeTab === 'training'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ClipboardList size={16} />
                Entrenar Diálogos (💬 ↔ 🤖)
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all ${
                  activeTab === 'rules'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Edit3 size={16} />
                Reglas & Banco
              </button>
              <button
                onClick={() => setActiveTab('extension')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs md:text-sm transition-all ${
                  activeTab === 'extension'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Code size={16} />
                Extensión Chrome
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1-CLICK DIRECT CONNECT BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-500/50 text-blue-100 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500 text-slate-950 font-bold">
            <Wifi size={20} className="animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Puente de Transmisión en Vivo con Facebook</h4>
            <p className="text-xs text-blue-200">
              Para que tu CRM reciba las conversaciones en vivo desde Facebook sin restricciones de navegador, abre Facebook desde este botón.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenFacebookLiveBridge}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 whitespace-nowrap"
        >
          <ExternalLink size={16} />
          🔗 Abrir & Conectar Facebook en Vivo
        </button>
      </div>

      {/* LIVE SYNC STATUS BANNER */}
      {isLiveConnected && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-500 text-emerald-100 p-3 rounded-2xl flex items-center justify-between shadow-lg text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-emerald-400 animate-pulse" />
            <span>TRANSMISIÓN EN VIVO CONECTADA CON ÉXITO</span>
          </div>
          <span className="bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
            Sincronizado
          </span>
        </div>
      )}

      {/* CRM NOTIFICATION ALERT POPUP */}
      {crmAlert && (
        <div className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between animate-in slide-in-from-top ${
          crmAlert.type === 'closed' 
            ? 'bg-emerald-900/90 border-emerald-500 text-emerald-100' 
            : 'bg-amber-900/90 border-amber-500 text-amber-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${crmAlert.type === 'closed' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'}`}>
              {crmAlert.type === 'closed' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wide">{crmAlert.title}</h4>
              <p className="text-xs opacity-90 mt-0.5">{crmAlert.detail}</p>
            </div>
          </div>
          <button 
            onClick={() => setCrmAlert(null)}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all"
          >
            Entendido
          </button>
        </div>
      )}

      {/* TAB 1: SIMULATOR / LIVE MONITOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Stock Sync Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Product & Stock Sync Panel */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                <PackageCheck size={18} className="text-blue-600" />
                1. Selección de Producto & Stock Físico
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Producto Consultado</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {activeCatalog.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${(customPriceOverrides[p.id] || p.unitPrice || 0).toLocaleString('es-CL')})
                    </option>
                  ))}
                </select>
              </div>

              {/* DIRECT PRICE EDIT INPUT */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Precio Venta Neto en Catálogo:</span>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase">Neto Editable</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-black text-lg">$</span>
                  <input
                    type="number"
                    step="1000"
                    value={activeSalePrice}
                    onChange={(e) => handleUpdateProductPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 text-emerald-400 font-mono text-xl font-black rounded-xl pl-8 pr-4 py-2 border border-slate-700 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Physical Stock State Toggle */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-semibold items-center">
                  <span>Stock Físico en Bodega:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${simulatedStock > 0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-amber-100 text-amber-700 border border-amber-300'}`}>
                    {simulatedStock > 0 ? `${simulatedStock} un. (Stock OK)` : '0 un. (Agotado / Encargo)'}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setSimulatedStock(5)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${simulatedStock > 0 ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                  >
                    Con Stock (Bodega)
                  </button>
                  <button
                    onClick={() => setSimulatedStock(0)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${simulatedStock === 0 ? 'bg-amber-600 text-white border-amber-700 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                  >
                    Sin Stock (Recarga)
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Test Shortcuts */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Zap size={18} className="text-amber-500" />
                2. Simular Escenarios Rápidos
              </h3>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleSendMessage('hola sigue disponible')}
                  disabled={isTyping}
                  className="w-full text-left p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold border border-purple-200 transition-all flex items-center justify-between"
                >
                  <span>1️⃣ "Hola sigue disponible"</span>
                  <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-bold">Saludo →</span>
                </button>

                <button
                  onClick={() => handleSendMessage('a ya traigamelo nomas esta bien')}
                  disabled={isTyping}
                  className="w-full text-left p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold border border-emerald-200 transition-all flex items-center justify-between"
                >
                  <span>2️⃣ "A ya traígamelo nomás está bien"</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-bold">Aceptación →</span>
                </button>

                <button
                  onClick={() => handleSendMessage('?')}
                  disabled={isTyping}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-all flex items-center justify-between"
                >
                  <span>3️⃣ "?" (Sin reiniciar saludo)</span>
                  <span className="text-[10px] bg-slate-300 text-slate-800 px-2 py-0.5 rounded font-bold">Candado Turno →</span>
                </button>

                <button
                  onClick={() => handleSendMessage('haces descuento por 2 unidades?')}
                  disabled={isTyping}
                  className="w-full text-left p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 transition-all flex items-center justify-between"
                >
                  <span>4️⃣ "Haces descuento por 2 unidades?"</span>
                  <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-bold">Encargado →</span>
                </button>

                <button
                  onClick={() => handleSendMessage('Luis, Balmaceda 1230 Serena Centro, cel 912345678')}
                  disabled={isTyping}
                  className="w-full text-left p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold border border-indigo-200 transition-all flex items-center justify-between"
                >
                  <span>5️⃣ "Luis, Balmaceda 1230, cel 912345678"</span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded font-bold">Cierre GPS →</span>
                </button>
              </div>
            </div>

            {/* Rule Trigger Log */}
            {activeRuleNotice && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-900 space-y-1 animate-in fade-in">
                <div className="font-bold flex items-center gap-1.5 text-indigo-700">
                  <Sparkles size={14} /> Log del Algoritmo:
                </div>
                <p>{activeRuleNotice}</p>
              </div>
            )}
          </div>

          {/* Messenger Interactive Simulator & LIVE MONITOR */}
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[650px] overflow-hidden">
            {/* Facebook Messenger Header Mock */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 px-6 py-4 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm border border-white/30">
                    {isLiveConnected ? '🔴 LIVE' : 'FB'}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-blue-600 rounded-full ${config.autoReplyEnabled ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">{isLiveConnected ? liveClientName : 'Cliente Marketplace (Messenger)'}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${config.autoReplyEnabled ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30' : 'bg-rose-500/30 text-rose-200 border border-rose-400/30'}`}>
                      {config.autoReplyEnabled ? '🟢 BOT ACTIVADO' : '🔴 MODO MANUAL (RESPONDE TÚ)'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                    <span>Producto: <strong className="underline">{selectedProduct.name}</strong> (${activeSalePrice.toLocaleString('es-CL')})</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleAutoReply}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    config.autoReplyEnabled
                      ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border-rose-400/40'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-400/40'
                  }`}
                >
                  <Power size={14} />
                  {config.autoReplyEnabled ? 'Apagar Bot (Modo Manual)' : 'Activar Bot'}
                </button>
                <button
                  onClick={handleSaveCurrentChatAsTraining}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 border border-purple-400/40 text-xs font-semibold transition-all"
                  title="Guardar esta prueba como entrenamiento"
                >
                  <Save size={14} />
                  Guardar
                </button>
                <button
                  onClick={handleResetChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-all"
                  title="Reiniciar chat"
                >
                  <RotateCcw size={14} />
                  Limpiar
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/70">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 font-semibold mb-1 px-1">
                    {msg.sender === 'client' ? 'Comprador (Facebook)' : 'Wrock Bot (Inversiones Wrock SpA)'} • {msg.timestamp}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                      msg.sender === 'client'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : msg.text.includes('🔴 Bot')
                        ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-none font-semibold'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none font-sans whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Realistic Typing Indicator */}
              {isTyping && (
                <div className="flex flex-col items-start animate-pulse">
                  <div className="text-[10px] text-blue-600 font-bold mb-1 px-1 flex items-center gap-1">
                    <Clock size={12} className="animate-spin text-blue-500" />
                    Simulando tiempo de respuesta humanizado ({countdown}s)...
                  </div>
                  <div className="bg-white text-slate-500 border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="font-semibold text-blue-700 ml-2">
                      Wrock Bot digitando respuesta...
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
              <input
                type="text"
                placeholder={config.autoReplyEnabled ? "Escribe un mensaje de prueba..." : "MODO MANUAL: Escribe aquí para responderle tú mismo al cliente..."}
                value={clientInput}
                onChange={(e) => setClientInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isTyping}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!clientInput.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <span>Enviar</span>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONSTRUCTOR DE DIÁLOGOS (Pregunta Cliente ↔ Respuesta Seller) */}
      {activeTab === 'training' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList className="text-purple-600" />
                Constructor de Entrenamientos (Pregunta Cliente ↔ Respuesta Seller)
              </h3>
              <p className="text-xs text-slate-500">
                Agrega la secuencia de la conversación paso a paso en pares de preguntas y respuestas para que el bot aprenda fácil.
              </p>
            </div>

            <button
              onClick={() => saveConfigToStorage(config)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                savedSuccess ? 'bg-emerald-600 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {savedSuccess ? <Check size={18} /> : <Save size={18} />}
              {savedSuccess ? '¡Entrenamiento Guardado!' : 'Guardar Todos los Diálogos'}
            </button>
          </div>

          {/* NEW DIALOGUE STEP-BY-STEP BUILDER FORM */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 rounded-3xl text-white space-y-5 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-cyan-400 text-sm flex items-center gap-2">
                <BrainCircuit size={18} />
                Crear Nuevo Diálogo Estructurado de Entrenamiento
              </h4>
              <span className="text-xs text-slate-400">Paso a paso (Pares)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Título / Nombre del Diálogo</label>
              <input
                type="text"
                value={newDialogueTitle}
                onChange={(e) => setNewDialogueTitle(e.target.value)}
                placeholder="Ej: Venta Motobomba con Despacho e IVA o Consulta por Manguera"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-cyan-400 font-semibold"
              />
            </div>

            {/* DYNAMIC PAIRS OF STEPS */}
            <div className="space-y-4 pt-1">
              <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Secuencia de la Conversación (Turno por Turno):
              </label>

              {newDialogueTurns.map((turn, index) => (
                <div key={turn.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-indigo-600 text-white px-2.5 py-0.5 rounded-md">
                      Paso #{index + 1}
                    </span>
                    {newDialogueTurns.length > 1 && (
                      <button
                        onClick={() => handleDeleteTurn(turn.id)}
                        className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Eliminar este paso"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Client Question */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                        <User size={13} className="text-blue-400" />
                        Pregunta o Mensaje del Cliente:
                      </label>
                      <input
                        type="text"
                        value={turn.clientMsg}
                        onChange={(e) => handleUpdateTurn(turn.id, 'clientMsg', e.target.value)}
                        placeholder='Ej: "hola disponible?" o "donde retiran?"'
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    {/* Seller Answer */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Bot size={13} className="text-purple-400" />
                        Respuesta del Vendedor (Bot):
                      </label>
                      <input
                        type="text"
                        value={turn.sellerReply}
                        onChange={(e) => handleUpdateTurn(turn.id, 'sellerReply', e.target.value)}
                        placeholder='Ej: "¡Hola! Sí, disponible. ¿Para cuándo lo necesita?"'
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddTurn}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Plus size={16} />
                  + Agregar Paso a la Conversación
                </button>

                <button
                  onClick={handleSaveStructuredDialogue}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <BrainCircuit size={16} />
                  🧠 Procesar y Entrenar IA con este Diálogo
                </button>
              </div>
            </div>
          </div>

          {/* LIST OF SAVED STRUCTURED DIALOGUES */}
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageCircle size={18} className="text-purple-600" />
                Diálogos Entrenados en la Memoria del Bot ({(config.structuredDialogues || []).length})
              </span>
              <span className="text-xs text-slate-400 font-normal">Organizados por pares estructurados</span>
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {(config.structuredDialogues || []).map((dialogue, index) => (
                <div key={dialogue.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-2">
                      <Layers size={14} className="text-purple-600" />
                      Diálogo #{index + 1}: {dialogue.title} ({dialogue.turns.length} turnos)
                    </span>
                    <button
                      onClick={() => handleDeleteStructuredDialogue(dialogue.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                      title="Eliminar este diálogo entrenado"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {dialogue.turns.map((t, idx) => (
                      <div key={t.id || idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Comprador</span>
                          {t.clientMsg}
                        </div>
                        <div className="font-medium text-slate-700 flex items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Wrock Bot</span>
                          {t.sellerReply}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: RULES & EDITABLE PARAMETERS */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Edit3 className="text-blue-600" />
                Reglas Comerciales de Inversiones Wrock SpA & Datos Bancarios
              </h3>
              <p className="text-xs text-slate-500">Configura la dirección de bodega, políticas de IVA y cuenta bancaria de transferencias.</p>
            </div>
            
            <button
              onClick={() => saveConfigToStorage(config)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                savedSuccess ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {savedSuccess ? <Check size={18} /> : <Save size={18} />}
              {savedSuccess ? '¡Guardado Correctamente!' : 'Guardar Cambios'}
            </button>
          </div>

          {/* BANKING DETAILS FORM */}
          <div className="p-5 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-4">
            <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600" />
              1. Datos Bancarios de la Empresa (Para Transferencia)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">Nombre del Titular</label>
                <input
                  type="text"
                  value={config.bankDetails.holderName}
                  onChange={(e) => setConfig({ ...config, bankDetails: { ...config.bankDetails, holderName: e.target.value } })}
                  className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">RUT Empresa</label>
                <input
                  type="text"
                  value={config.bankDetails.rut}
                  onChange={(e) => setConfig({ ...config, bankDetails: { ...config.bankDetails, rut: e.target.value } })}
                  className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">Banco / Institución</label>
                <input
                  type="text"
                  value={config.bankDetails.bank}
                  onChange={(e) => setConfig({ ...config, bankDetails: { ...config.bankDetails, bank: e.target.value } })}
                  className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">Tipo de Cuenta</label>
                <input
                  type="text"
                  value={config.bankDetails.accountType}
                  onChange={(e) => setConfig({ ...config, bankDetails: { ...config.bankDetails, accountType: e.target.value } })}
                  className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">Email Comprobantes</label>
                <input
                  type="email"
                  value={config.bankDetails.email}
                  onChange={(e) => setConfig({ ...config, bankDetails: { ...config.bankDetails, email: e.target.value } })}
                  className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">Link de Pago (Tarjeta)</label>
                <input
                  type="text"
                  value={config.paymentLinkUrl}
                  onChange={(e) => setConfig({ ...config, paymentLinkUrl: e.target.value })}
                  className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* BODEGA ADDRESS & TAX POLICY */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 size={18} className="text-purple-600" />
              2. Dirección de Bodega & Políticas Comerciales
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Exacta de la Bodega</label>
                <input
                  type="text"
                  value={config.bodegaAddress}
                  onChange={(e) => setConfig({ ...config, bodegaAddress: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Texto para Compras de Despacho Local</label>
                <textarea
                  rows={2}
                  value={config.smallOrderDispatchText}
                  onChange={(e) => setConfig({ ...config, smallOrderDispatchText: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHROME EXTENSION GENERATOR */}
      {activeTab === 'extension' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Code className="text-blue-600" />
                Script / Extensión Ejecutable para Google Chrome
              </h3>
              <p className="text-xs text-slate-500">
                Se sincroniza con tus diálogos estructurados de Inversiones Wrock SpA.
              </p>
            </div>

            <button
              onClick={handleCopyScript}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                copiedScript
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copiedScript ? <Check size={18} /> : <Copy size={18} />}
              {copiedScript ? '¡Copiado al Portapapeles!' : 'Copiar Script Actualizado'}
            </button>
          </div>

          <div className="relative bg-slate-900 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-emerald-400 border border-slate-800 shadow-inner max-h-[300px]">
            <pre>{chromeExtensionScript}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
