import React, { useState } from 'react';
import { MessageSquare, Copy, Check, X, ShieldCheck, Truck, MapPin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SpeechModalProps {
  onClose: () => void;
}

export const SALES_SPEECHES = [
  {
    id: 'speech-bodega',
    title: '1. ¿Dónde Entregas / Tienes Tienda Física?',
    category: 'Bodega Central & Despacho Directo',
    icon: Truck,
    text: `¡Hola! Te cuento que operamos con modalidad Bodega Central y Despacho Directo. No tenemos sala de ventas física para evitar costos de arriendo y así ofrecerte el mejor precio del mercado 📦✨.

Para tu comodidad:
1. 🚚 Despacho a Domicilio: Te llega directo en 24 a 72 hrs hábiles.
2. 📍 Punto de Retiro Coordinado: Reservamos tu unidad en bodega central y la retiras en nuestro punto de entrega en 1 a 3 días hábiles.

¿En qué comuna o sector te encuentras para cotizar tu entrega?`
  },
  {
    id: 'speech-direccion',
    title: '2. Cuando piden "Envíame la dirección para ir a buscarlo ya"',
    category: 'Reserva & Punto de Entrega',
    icon: MapPin,
    text: `¡Hola! Trabajamos con la importadora/bodega central directamente. Para retirar el producto en nuestro punto de entrega, primero debemos ingresar la reserva a tu nombre en sistema.

El producto queda disponible para retiro en 1 a 3 días hábiles. ¿Te reservo una unidad con tu boleta/factura para asegurar el precio con descuento?`
  },
  {
    id: 'speech-confianza',
    title: '3. Si el cliente tiene dudas sobre la demora de 1 a 3 días',
    category: 'Garantía & Comprobante Legal',
    icon: ShieldCheck,
    text: `Entiendo perfectamente tu consulta. Al trabajar directo desde Bodega Central, te garantizamos un producto 100% nuevo, sellado de fábrica y al precio más bajo de Chile 📝🔒.

Todos nuestros despachos incluyen Boleta o Factura + Garantía Oficial. En 24 a 72 hrs hábiles lo tienes en la puerta de tu casa. ¿Te preparo la cotización formal?`
  },
  {
    id: 'speech-promotor',
    title: '4. Mensaje para Promotores (Tus 5 amigos)',
    category: 'Instrucciones para Publicadores',
    icon: AlertCircle,
    text: `Hola! Cuando los clientes te pregunten por Marketplace "dónde entregas" o "dónde puedo ir a buscarlo", respóndeles: "Operamos con Bodega Central y despacho directo a todo Chile en 1 a 3 días con Boleta/Factura. Pásame tu comuna y te conecto directo con el encargado de ventas."`
  }
];

export const SpeechModal: React.FC<SpeechModalProps> = ({ onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("¡Speech copiado al portapapeles! Listo para pegar en WhatsApp o Marketplace.");
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">
              <MessageSquare size={16} /> Asistente de Ventas Solopreneur
            </div>
            <h3 className="text-xl font-black tracking-tight">Speeches de Venta & Respuestas Rápidas</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-grow bg-slate-50/50">
          <p className="text-xs text-slate-500 font-medium italic mb-2">
            Haz clic en <strong className="text-indigo-600">"Copiar Speech"</strong> para pegar la respuesta exacta en WhatsApp, Facebook Marketplace o enviarla a tus 5 promotores.
          </p>

          {SALES_SPEECHES.map((speech) => {
            const Icon = speech.icon;
            const isCopied = copiedId === speech.id;
            return (
              <div key={speech.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 hover:border-indigo-300 transition-all">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider block">{speech.category}</span>
                      <h4 className="font-bold text-slate-900 text-xs">{speech.title}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(speech.id, speech.text)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                      isCopied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isCopied ? <Check size={12} /> : <Copy size={12} />}
                    {isCopied ? '¡Copiado!' : 'Copiar Speech'}
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-xs leading-relaxed font-sans whitespace-pre-wrap">
                  {speech.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-600 transition-all"
          >
            Cerrar Asistente
          </button>
        </div>
      </div>
    </div>
  );
};
