import { auth } from "./firebase";

export const removeUndefined = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(removeUndefined);
  if (obj !== null && typeof obj === 'object') {
    if (obj.constructor?.name === 'Timestamp' || (obj._methodName && typeof obj._methodName === 'string')) {
      return obj;
    }
    return Object.keys(obj).reduce((acc: any, key) => {
      const val = removeUndefined(obj[key]);
      if (val !== undefined) acc[key] = val;
      return acc;
    }, {});
  }
  return obj;
};

export const getSafeImageUrl = (url: string | undefined | null) => {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.length > 50) {
    return `data:image/jpeg;base64,${trimmed}`;
  }
  return trimmed;
};

/**
 * Abre o descarga de manera segura un PDF en formato base64 o URL remota,
 * evitando el bloqueo de navegador/pantalla negra con data:application/pdf.
 */
export const openPdfInNewTab = (url: string | undefined | null, fileName = 'Ficha_Tecnica.pdf') => {
  if (!url || typeof url !== 'string') return;
  const trimmed = url.trim();

  if (trimmed.startsWith('data:application/pdf;base64,') || (trimmed.startsWith('data:application/pdf;') && trimmed.includes('base64,'))) {
    try {
      const base64Data = trimmed.split(',')[1];
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const newWin = window.open(blobUrl, '_blank');
      if (!newWin) {
        // Fallback a descarga si los popups están bloqueados
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      return;
    } catch (e) {
      console.error('Error al convertir el PDF base64 a Blob:', e);
    }
  }

  // Si es un enlace HTTP o blob normal
  window.open(trimmed, '_blank', 'noopener,noreferrer');
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  WRITE = 'write',
  GET = 'get'
}

export const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous
    },
    operationType,
    path
  };
  console.error('Firestore Error Details:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

/**
 * Formatea un número en formato estándar de Peso Chileno (CLP) con separador de miles.
 * Ej: 1250000 -> "$1.250.000"
 */
export const formatCLP = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '';
  const strVal = String(value);
  const isNegative = strVal.startsWith('-');
  const cleanValue = strVal.replace(/\D/g, '');
  if (!cleanValue) return '';
  const parsed = parseInt(cleanValue, 10);
  if (isNaN(parsed)) return '';
  const formatted = parsed.toLocaleString('es-CL');
  return (isNegative ? '-' : '') + '$' + formatted;
};

/**
 * Parseador de formato CLP para retornar enteros válidos en la base de datos.
 * Ej: "$1.250.000" -> 1250000
 */
export const parseCLP = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null || value === '') return 0;
  if (typeof value === 'number') return Math.floor(value);
  const cleanValue = value.replace(/[$\s.]/g, '');
  const parsed = parseInt(cleanValue, 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Ejecuta una solicitud de generación de contenido de Gemini con reintento automático y fallback de modelos.
 * Ayuda a mitigar los errores 503 (Service Unavailable) por alta demanda.
 */
export const generateContentWithRetry = async (
  ai: any,
  options: any,
  modelsToTry: string[] = ['gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-2.0-flash']
): Promise<any> => {
  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini] Intentando generación con modelo: ${model}...`);
      // We pass options but remove 'model' if it exists in options so we override it
      const { model: _, ...cleanOptions } = options;
      const response = await ai.models.generateContent({
        model,
        ...cleanOptions
      });
      return response;
    } catch (error: any) {
      console.warn(`[Gemini] Error con modelo ${model}:`, error);
      lastError = error;
    }
  }
  throw lastError || new Error("Todos los modelos de Gemini fallaron.");
};

