import { GoogleGenAI, Type } from '@google/genai';
import { generateContentWithRetry, getGeminiApiKey } from './utils';

export interface ExtractedProduct {
  name: string;
  description: string;
  unitPrice: number;
}

export const extractProductsFromPdf = async (base64Pdf: string, customApiKey?: string): Promise<ExtractedProduct[]> => {
  const apiKey = getGeminiApiKey(customApiKey);
  if (!apiKey) {
    throw new Error("Falta configurar la API Key de Gemini. Por favor ingresa tu API Key en la Configuración de Perfil.");
  }
  const ai = new GoogleGenAI({ apiKey });

  // Clean the base64 string if it contains the data URI prefix
  const b64Data = base64Pdf.includes(',') ? base64Pdf.split(',')[1] : base64Pdf;

  const response = await generateContentWithRetry(ai, {
    contents: [
      {
        role: 'user',
        parts: [
          { text: "Analiza el siguiente PDF de una cotización de proveedor. Extrae todos los productos listados. Para cada producto, extrae el nombre, una breve descripción técnica o comercial y el precio neto unitario como número. REGLA CRÍTICA PARA PRECIOS: En Chile, los miles se separan con punto. Si ves '5.390', significa 5390 pesos (cinco mil trescientos noventa), NO 5 con 39 decimales. Por lo tanto, DEBES eliminar todos los puntos y comas y devolver un número ENTERO puro (ejemplo: 5390). Devuelve los resultados usando el esquema JSON proporcionado." },
          {
            inlineData: {
              data: b64Data,
              mimeType: 'application/pdf'
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        description: "Lista de productos extraídos",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Nombre del producto" },
            description: { type: Type.STRING, description: "Descripción del producto" },
            unitPrice: { type: Type.NUMBER, description: "Precio neto unitario" }
          },
          required: ["name", "description", "unitPrice"]
        }
      }
    }
  });

  if (response.text) {
    try {
      const data = JSON.parse(response.text);
      return data as ExtractedProduct[];
    } catch (e) {
      throw new Error("No se pudo analizar la respuesta de la IA en formato JSON.");
    }
  }

  throw new Error("La IA no devolvió ningún resultado.");
};

export const extractProductsFromExcelLocal = (rawData: any[]): ExtractedProduct[] | null => {
  if (!rawData || rawData.length === 0) return [];

  const sampleRow = rawData[0];
  if (!sampleRow) return [];
  const keys = Object.keys(sampleRow);

  let nameKey = '';
  let descKey = '';
  let priceKey = '';

  const namePatterns = [/nombre/i, /name/i, /producto/i, /articulo/i, /artículo/i, /item/i, /título/i, /titulo/i, /descrip/i];
  const descPatterns = [/descrip/i, /detail/i, /detalle/i, /especificac/i, /comentario/i];
  const pricePatterns = [/precio/i, /price/i, /neto/i, /unitario/i, /valor/i, /costo/i, /cost/i, /monto/i, /total/i];

  for (const pattern of namePatterns) {
    const found = keys.find(k => pattern.test(k));
    if (found) {
      nameKey = found;
      break;
    }
  }

  for (const pattern of descPatterns) {
    const found = keys.find(k => {
      if (k === nameKey) return false;
      return pattern.test(k);
    });
    if (found) {
      descKey = found;
      break;
    }
  }

  for (const pattern of pricePatterns) {
    const found = keys.find(k => pattern.test(k));
    if (found) {
      priceKey = found;
      break;
    }
  }

  if (!nameKey || !priceKey) {
    return null;
  }

  return rawData
    .map(row => {
      const name = String(row[nameKey] || '').trim();
      const description = descKey ? String(row[descKey] || '').trim() : '';

      const rawPrice = row[priceKey];
      let unitPrice = 0;
      if (typeof rawPrice === 'number') {
        unitPrice = rawPrice;
      } else if (rawPrice) {
        const cleaned = String(rawPrice).replace(/[^0-9]/g, '');
        unitPrice = parseInt(cleaned, 10) || 0;
      }

      return { name, description, unitPrice };
    })
    .filter(p => p.name);
};

export const extractProductsFromExcelAI = async (rawData: any[], customApiKey?: string): Promise<ExtractedProduct[]> => {
  const apiKey = getGeminiApiKey(customApiKey);
  if (!apiKey) {
    throw new Error("Falta configurar la API Key de Gemini. Por favor ingresa tu API Key en la Configuración de Perfil.");
  }
  const ai = new GoogleGenAI({ apiKey });
  const excelDataStr = JSON.stringify(rawData.slice(0, 300));

  const response = await generateContentWithRetry(ai, {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `Analiza los siguientes datos extraídos de un archivo Excel de productos de un proveedor. Extrae todos los productos listados.
          Para cada producto, identifica el nombre del producto, su descripción (o detalles/especificaciones), y su precio neto unitario como número entero.
          
          REGLAS DE PRECIOS:
          - En Chile, los miles se separan con punto. Por ejemplo, "15.990" significa quince mil novecientos noventa pesos chilenos ($15990), NO 15 con decimales. Devuelve un número entero puro (ej: 15990).
          - Si el precio incluye IVA, calcula el neto (dividido por 1.19) si es posible, o usa el valor neto si se indica en las columnas.
          
          DATOS DEL EXCEL (JSON):
          ${excelDataStr}` }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        description: "Lista de productos extraídos",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Nombre del producto" },
            description: { type: Type.STRING, description: "Descripción del producto" },
            unitPrice: { type: Type.NUMBER, description: "Precio neto unitario" }
          },
          required: ["name", "description", "unitPrice"]
        }
      }
    }
  });

  if (response.text) {
    try {
      const data = JSON.parse(response.text);
      return data as ExtractedProduct[];
    } catch (e) {
      throw new Error("No se pudo analizar la respuesta de la IA en formato JSON.");
    }
  }

  throw new Error("La IA no devolvió ningún resultado.");
};

