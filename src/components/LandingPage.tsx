import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Smartphone, 
  LayoutDashboard, 
  FileText,
  ChevronRight,
  LogIn,
  Check,
  X,
  CreditCard,
  TrendingUp,
  Package,
  FileSpreadsheet
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">MI<span className="text-indigo-600 font-black tracking-[-0.1em]">CRM</span> PRO</span>
          </div>
          <button 
            onClick={onLogin}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 group"
          >
            Empieza Gratis <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-100">
              <Sparkles size={14} className="animate-pulse" /> Inteligencia Financiera & Ventas B2B
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[0.95] mb-8">
              Cotiza con IA y cierra por <br />
              <span className="text-indigo-600 italic tracking-tighter">WhatsApp con Firma Digital.</span>
            </h1>
            <p className="text-base text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Escribe en lenguaje natural, genera propuestas interactivas al instante y toma el control total de tus finanzas: márgenes, IVA, mermas e importaciones en una sola pantalla.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl text-lg font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <LogIn size={20} /> Registrarme Gratis con Google
              </button>
              <div className="flex -space-x-3 items-center">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="User" />
                  </div>
                ))}
                <span className="pl-6 text-xs font-bold text-slate-400">+500 profesionales técnicos ya cotizan hoy</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Todo lo que tu negocio técnico necesita para crecer</h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto font-medium">Diseñado especialmente para instaladores, electricistas, constructores e integradores tecnológicos.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sparkles className="text-amber-500" />}
              title="Cotizador IA en 30 segundos"
              description="Escribe o dicta tu proyecto en lenguaje natural (ej: 'kit de alarmas, 3 sensores y mano de obra'). La IA calcula precios de venta recomendados, márgenes y estructura la cotización al instante."
            />
            <FeatureCard 
              icon={<Smartphone className="text-indigo-500" />}
              title="Firma Digital por WhatsApp"
              description="Envía propuestas interactivas optimizadas para celular. Tu cliente final revisa el presupuesto y firma directamente con su dedo en la pantalla para aprobar el trato al instante. ¡Fricción cero!"
            />
            <FeatureCard 
              icon={<LayoutDashboard className="text-emerald-500" />}
              title="CFO de Bolsillo en Tiempo Real"
              description="Monitorea tu salud financiera real. Controla tus ingresos líquidos en efectivo, cuentas por cobrar, cuentas por pagar y calcula automáticamente tu Punto de Equilibrio mensual."
            />
            <FeatureCard 
              icon={<FileText className="text-purple-500" />}
              title="Catálogo & Fichas Automáticas"
              description="Ahorra horas buscando especificaciones técnicas. Al agregar cualquier equipo de tu catálogo a la propuesta, el sistema añade automáticamente sus fotos y fichas de especificaciones técnicas."
            />
            <FeatureCard 
              icon={<TrendingUp className="text-rose-500" />}
              title="Cálculo Tributario e IVA SII"
              description="¡Sin sorpresas tributarias! La plataforma estima de forma automática tu diferencia de IVA (Débito vs Crédito) mes a mes para que siempre sepas cuánto debes reservar para el fisco."
            />
            <FeatureCard 
              icon={<Package className="text-sky-500" />}
              title="Mermas, Compras e Importación"
              description="Gestiona tus mermas o pérdidas físicas, registra compras y calcula el costo unitario real en lotes de importación para asegurar que tu markup y margen de ganancia siempre sean positivos."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Planes simples y transparentes</h2>
            <p className="text-slate-500 text-lg font-medium">Empieza gratis (freemium), mejora cuando tu negocio lo necesite.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 relative overflow-hidden"
            >
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4">
                  Freemium
                </span>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Gratis</h3>
                <p className="text-slate-500 font-medium">Perfecto para empezar a cotizar profesionalmente.</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  Hasta 10 cotizaciones mensuales gratis
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  Gestión de clientes y CRM básico
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  Exportación a PDF e interactivo móvil
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  Firma Digital directa por WhatsApp
                </li>
                <li className="flex items-center gap-3 text-slate-400 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0"><X size={14} strokeWidth={3} /></div>
                  Catálogo avanzado y módulo de Importación IA
                </li>
                <li className="flex items-center gap-3 text-slate-400 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0"><X size={14} strokeWidth={3} /></div>
                  Panel completo de control financiero (EBITDA, IVA)
                </li>
              </ul>
              
              <button 
                onClick={onLogin}
                className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl text-base font-bold hover:bg-slate-200 transition-colors"
              >
                Empezar Gratis
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border-2 border-indigo-600 bg-indigo-900 shadow-2xl shadow-indigo-900/50 relative overflow-hidden text-white"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-50 -mr-10 -mt-10" />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                Recomendado
              </div>
              
              <div className="mb-8 relative z-10">
                <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-indigo-850 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-800">
                  <Zap size={14} className="fill-indigo-300" /> Plan Pro
                </span>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">$14.990</span>
                  <span className="text-indigo-300 font-medium">/mes</span>
                </div>
                <p className="text-indigo-200 font-medium">Para negocios que quieren vender todos los días sin límites.</p>
              </div>
              
              <ul className="space-y-4 mb-8 relative z-10">
                <li className="flex items-center gap-3 text-indigo-100 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  Cotizaciones e interacciones ilimitadas
                </li>
                <li className="flex items-center gap-3 text-indigo-100 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  Catálogo completo & Clientes ilimitados
                </li>
                <li className="flex items-center gap-3 text-indigo-100 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  PDF profesional con tu logo de marca
                </li>
                <li className="flex items-center gap-3 text-indigo-100 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  Control financiero completo (EBITDA, Caja, IVA, Punto de Equilibrio)
                </li>
                <li className="flex items-center gap-3 text-indigo-100 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  Gestión de mermas, compras e importaciones
                </li>
                <li className="flex items-center gap-3 text-indigo-100 font-medium text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0"><Check size={14} strokeWidth={3} /></div>
                  Análisis, optimización de imagen & cálculos con IA
                </li>
              </ul>
              
              <a 
                href="https://wa.me/56991834960?text=%C2%A1Hola%21%20Quiero%20suscribirme%20al%20Plan%20Pro%20de%20MI%20CRM%20PRO.%20%C2%BFMe%20podr%C3%ADas%20indicar%20los%20pasos%20para%20el%20pago%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-2xl text-base font-black shadow-lg hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all relative z-10 flex items-center justify-center decoration-none"
              >
                Suscribirse al Plan Pro
              </a>

              <div className="mt-5 flex flex-col items-center gap-2 relative z-10">
                <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">Pagos 100% Seguros en Chile</span>
                <div className="flex items-center justify-center gap-2 bg-indigo-950/60 p-2 rounded-xl border border-indigo-800">
                  <span className="text-[9px] font-black italic tracking-wider text-[#1A1F71] bg-white px-1.5 py-0.5 rounded">VISA</span>
                  <div className="flex -space-x-1.5 items-center bg-white px-1 py-1 rounded">
                    <div className="w-3 h-3 rounded-full bg-[#EB001B]" />
                    <div className="w-3 h-3 rounded-full bg-[#F79E1B]" />
                  </div>
                  <span className="text-[9px] font-black tracking-tighter text-white bg-[#E21F26] px-1.5 py-0.5 rounded">webpay</span>
                  <span className="text-[9px] font-black tracking-tighter text-[#009EE3] bg-white px-1.5 py-0.5 rounded">mercado pago</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof / Callout */}
      <section className="py-24 px-6 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
            ¿Listo para llevar tus ventas <br />al siguiente nivel?
          </h2>
          <p className="text-indigo-100 text-lg mb-10 font-medium">
            Súmate a la herramienta que está modernizando la forma de cotizar en Chile. Registración gratis al instante.
          </p>
          <button 
            onClick={onLogin}
            className="px-12 py-6 bg-white text-indigo-600 rounded-3xl text-xl font-black shadow-2xl hover:scale-105 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto"
          >
            Registrarme Gratis Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="text-indigo-600 fill-indigo-600" size={16} />
            <span className="text-sm font-black text-slate-800 tracking-tighter uppercase">MI CRM PRO 2026</span>
          </div>
          <div className="flex gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Términos</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contacto</a>
          </div>
          <p className="text-[10px] text-slate-300 font-medium tracking-tight">Hecho con ❤️ para Solopreneurs y Pymes Técnicas.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 rounded-3xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50 transition-all"
  >
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
      {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 28 })}
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{description}</p>
  </motion.div>
);
