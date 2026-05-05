import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Shield,
  Award,
  Crown,
  ShieldCheck,
  Wrench,
  CreditCard,
  Map,
  Info,
  CheckCircle2,
  Cloud,
  Sparkles,
  ChevronDown,
  Home,
  Maximize2,
  FileSpreadsheet,
  Zap,
  RefreshCw,
  AlertTriangle,
  Globe,
  Ruler,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { PLANS, CONSTANTS, QuoteData, Plan } from './types';
import { PDFModal, type ClienteData, type ConsultorData } from './components/PDFModal';
import { generateRoofingPDF } from './utils/generateRoofingPDF';

import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import html2canvas from 'html2canvas';

// Fix for Leaflet marker icons in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to update map view
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Default view for the whole island - zoom 8.0 for a wider view
      map.setView(center, 8.0);
      isFirstRender.current = false;
    } else {
      // Only zoom in if the coordinates are NOT the default island center
      const isDefaultCenter = center[0] === 18.2208 && center[1] === -66.5901;
      if (!isDefaultCenter) {
        map.setView(center, 20);
      }
    }
  }, [center, map]);
  return null;
}

// Component to handle map clicks for manual measurement
function MapEventsHandler({ 
  onMapClick, 
  isManualMode 
}: { 
  onMapClick: (latlng: L.LatLng) => void, 
  isManualMode: boolean 
}) {
  useMapEvents({
    click(e) {
      if (isManualMode) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

// --- Splash Screen Component ---
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3500; // 3.5 seconds
    const interval = 35; // Update every 35ms
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, interval);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration + 500);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Rain drops data
  const rainDrops = useMemo(() => Array.from({ length: 120 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 120 - 10}%`, // Start slightly off-screen
    top: `${Math.random() * -100}%`,
    delay: Math.random() * 2,
    duration: 0.3 + Math.random() * 0.4,
    opacity: 0.2 + Math.random() * 0.5,
    scale: 0.5 + Math.random() * 1,
  })), []);

  // Clouds data
  const clouds = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    top: `${10 + Math.random() * 30}%`,
    left: `${Math.random() * 100}%`,
    scale: 1 + Math.random() * 2,
    duration: 15 + Math.random() * 15,
    delay: Math.random() * -20,
    opacity: 0.1 + Math.random() * 0.2,
  })), []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] bg-windmar-blue-light flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Stormy Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/20 pointer-events-none z-0" />

      {/* Clouds Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.id}
            initial={{ x: -200 }}
            animate={{ x: 1400 }}
            transition={{
              duration: cloud.duration,
              repeat: Infinity,
              delay: cloud.delay,
              ease: "linear",
            }}
            className="absolute text-white"
            style={{ 
              top: cloud.top, 
              opacity: cloud.opacity,
              scale: cloud.scale 
            }}
          >
            <Cloud size={120} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Rain Background - More visible and horizontal-ish */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {rainDrops.map((drop) => (
          <motion.div
            key={drop.id}
            initial={{ y: -200, x: 0 }}
            animate={{ 
              y: 1200, 
              x: 300, // Horizontal movement
              opacity: [0, drop.opacity, 0] 
            }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: "linear",
            }}
            className="absolute w-[2px] h-16 bg-white/80"
            style={{ 
              left: drop.left,
              transform: 'rotate(15deg)', // Horizontal slant
              scale: drop.scale
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md flex flex-col items-center justify-center z-10">
        {/* House Animation */}
        <div className="relative w-64 h-64 mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* The House Icon - Dark Blue */}
            <div className="relative">
              <Home size={180} className="text-[#050b14] drop-shadow-2xl" />
              
              {/* Silicone Sealing Layer - Liquid effect covering the roof */}
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'polygon(0 40%, 50% 0, 100% 40%, 100% 100%, 0 100%)' }}>
                <motion.div 
                  initial={{ height: "0%" }}
                  animate={{ height: `${progress}%` }}
                  className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white via-slate-100 to-slate-200 shadow-[0_0_40px_rgba(255,255,255,0.8)] opacity-90"
                />
              </div>

              {/* Shield Glow - Enhanced to look like a protective dome */}
              <motion.div
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-10 border-[4px] border-white/80 rounded-full backdrop-blur-[4px] z-20"
                style={{ 
                  clipPath: 'polygon(0 0, 100% 0, 100% 65%, 50% 100%, 0 65%)',
                  background: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.25) 0%, transparent 70%)',
                  filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))'
                }}
              />

              {/* Shield Icon Overlay - Darker blue and on top of everything */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-windmar-blue z-30 drop-shadow-lg"
              >
                <Shield size={80} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Loading Section */}
        <div className="w-full space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-windmar-blue-dark font-black text-2xl sm:text-4xl uppercase tracking-tighter italic drop-shadow-md">
              SISTEMA <span className="text-windmar-gold">ROOFING PRO</span>
            </h2>
          </motion.div>

          <div className="relative h-2 w-full bg-slate-800/40 rounded-full overflow-hidden border border-white/10 shadow-lg">
            <motion.div 
              className="h-full bg-gradient-to-r from-slate-100 via-white to-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              style={{ 
                width: `${progress}%`,
                filter: 'blur(0.5px)' // Subtle liquid/viscous look
              }}
            />
            {/* Glossy silicone effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          </div>

          <div className="text-center">
            <span className="text-windmar-blue-dark font-black text-sm tracking-widest uppercase">
              CARGANDO COTIZADOR PROFESIONAL ROOFING WINDMAR HOME
            </span>
          </div>

          <p className="text-slate-600 font-bold text-[9px] uppercase tracking-[0.5em] pt-6 opacity-40">
            Windmar Home Engineering Solutions • 2026
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Cash Box Component ---
const CashBox = ({ plan }: { plan: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-900/20 overflow-hidden transition-all duration-300 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-colors"
      >
        <span className="text-emerald-700 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest">Total con IVU (Cash)</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm md:text-base">{formatCurrency(plan.cashTotalConIvu)}</span>
          <motion.div 
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-emerald-100 p-1 rounded-full flex items-center justify-center"
          >
            <ChevronDown size={14} className="text-emerald-600" />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: -15 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -15 }}
            transition={{ 
              height: { type: "spring", stiffness: 250, damping: 28 },
              opacity: { duration: 0.3, ease: "easeOut" },
              y: { type: "spring", stiffness: 250, damping: 28 }
            }}
            className="px-3 pb-3 space-y-2 border-t border-emerald-100 dark:border-emerald-900/20 pt-2 overflow-hidden"
          >
            <div className="flex justify-between text-sm">
              <span className="text-emerald-700/70 dark:text-emerald-400/70 font-black text-[10px] uppercase">Valor sin IVU</span>
              <span className="text-emerald-600/80 dark:text-emerald-400/80 font-black">
                {formatCurrency(plan.cashValorSinIvu)}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-emerald-100 dark:border-emerald-900/20 pt-1">
              <span className="text-emerald-700/70 dark:text-emerald-400/70 font-black text-[10px] uppercase">IVU (11.5%)</span>
              <span className="text-emerald-600/80 dark:text-emerald-400/80 font-black">
                {formatCurrency(plan.cashIvu)}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showDiscounts, setShowDiscounts] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try { return localStorage.getItem('wh-theme') === 'dark'; } catch { return false; }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      try { localStorage.setItem('wh-theme', 'dark'); } catch {}
    } else {
      root.classList.remove('dark');
      try { localStorage.setItem('wh-theme', 'light'); } catch {}
    }
  }, [isDarkMode]);
  const [data, setData] = useState<QuoteData>({
    sqft: 0,
    removalPercentage: 0,
    paymentMethod: 'ACH',
    downPayment: 0,
    firmaYGana: false,
    clienteVip: false
  });
  const [coords, setCoords] = useState({ lat: '18.2208', lng: '-66.5901' }); // Default center of Puerto Rico
  const [isFetchingArea, setIsFetchingArea] = useState(false);
  const [areaError, setAreaError] = useState<string | null>(null);
  
  // Manual Measurement State
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualPoints, setManualPoints] = useState<L.LatLng[]>([]);
  const [manualArea, setManualArea] = useState<number>(0);
  const [mapLayer, setMapLayer] = useState<'satellite' | 'streets'>('satellite');
  const [isExporting, setIsExporting] = useState(false);
  const [pdfModalAbierto, setPdfModalAbierto] = useState(false);
  const [planesParaPDF, setPlanesParaPDF] = useState<string[]>(['Silver', 'Gold', 'Platinum']);
  const [modalidadesParaPDF, setModalidadesParaPDF] = useState<string[]>(['cash']);
  const [idiomaParaPDF, setIdiomaParaPDF] = useState<'es' | 'en'>('es');

  // Safe lat/lng: fallback to PR center when field is empty or invalid (avoids Leaflet NaN crash)
  const mapLat = isNaN(parseFloat(coords.lat)) ? 18.2208 : parseFloat(coords.lat);
  const mapLng = isNaN(parseFloat(coords.lng)) ? -66.5901 : parseFloat(coords.lng);

  // Ref for dropdown outside-click detection
  const discountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (discountRef.current && !discountRef.current.contains(e.target as Node)) {
        setShowDiscounts(false);
      }
    };
    if (showDiscounts) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDiscounts]);

  const calculatePolygonArea = (points: L.LatLng[]) => {
    if (points.length < 3) return 0;
    
    let area = 0;
    const R = 6378137; // Earth radius in meters
    const latRad = points[0].lat * Math.PI / 180;
    
    const projectedPoints = points.map(p => ({
      x: R * p.lng * Math.PI / 180 * Math.cos(latRad),
      y: R * p.lat * Math.PI / 180
    }));

    for (let i = 0; i < projectedPoints.length; i++) {
      const j = (i + 1) % projectedPoints.length;
      area += projectedPoints[i].x * projectedPoints[j].y;
      area -= projectedPoints[j].x * projectedPoints[i].y;
    }
    
    const areaM2 = Math.abs(area) / 2;
    return Math.round(areaM2 * 10.7639); // Convert to sqft
  };

  const handleMapClick = (latlng: L.LatLng) => {
    const newPoints = [...manualPoints, latlng];
    setManualPoints(newPoints);
    if (newPoints.length >= 3) {
      setManualArea(calculatePolygonArea(newPoints));
    }
  };

  const clearManualMeasurement = () => {
    setManualPoints([]);
    setManualArea(0);
  };

  const confirmManualMeasurement = () => {
    if (manualArea > 0) {
      setData(prev => ({ ...prev, sqft: manualArea }));
      setIsManualMode(false);
      clearManualMeasurement();
    }
  };

  const exportMap = async () => {
    const mapElement = document.getElementById('map-capture-area');
    if (!mapElement) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: '#021933'
      });
      
      const link = document.createElement('a');
      link.download = `Windmar_Medicion_${data.sqft}_sqft.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error al exportar mapa:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const fetchFreeRoofArea = async () => {
    const lat = parseFloat(coords.lat);
    const lng = parseFloat(coords.lng);
    const isDefault = lat === 18.2208 && lng === -66.5901;

    if (isNaN(lat) || isNaN(lng)) {
      setAreaError('Ingresa coordenadas válidas antes de usar Auto-Medir.');
      return;
    }

    if (isDefault) {
      setAreaError('Ingresa las coordenadas del techo antes de usar Auto-Medir.');
      return;
    }

    setIsFetchingArea(true);
    setAreaError(null);

    try {
      const query = `[out:json];way(around:100,${lat},${lng})["building"];out geom;`;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);

      if (!response.ok) throw new Error('Error al conectar con OpenStreetMap. Intenta de nuevo.');

      const dataJson = await response.json();
      const buildings = dataJson.elements;

      if (!buildings || buildings.length === 0) {
        throw new Error('No se encontró ningún edificio en OpenStreetMap para estas coordenadas. Usa el modo Manual.');
      }

      const building = buildings[0];
      const nodes = building.geometry;

      if (nodes && nodes.length > 2) {
        // Coordenadas relativas al primer nodo para evitar pérdida de precisión numérica
        const refLat = nodes[0].lat;
        const refLon = nodes[0].lon;
        const cosLat = Math.cos(refLat * Math.PI / 180);
        const R = 6378137;

        const points = nodes.map((n: any) => ({
          x: (n.lon - refLon) * (Math.PI / 180) * R * cosLat,
          y: (n.lat - refLat) * (Math.PI / 180) * R,
        }));

        let area = 0;
        for (let i = 0; i < points.length; i++) {
          const j = (i + 1) % points.length;
          area += points[i].x * points[j].y;
          area -= points[j].x * points[i].y;
        }
        const areaM2  = Math.abs(area) / 2;
        const areaSqFt = Math.round(areaM2 * 10.7639);

        if (areaSqFt < 100) {
          throw new Error(`Área detectada (${areaSqFt} ft²) demasiado pequeña. Verifica las coordenadas o usa el modo Manual.`);
        }

        setData(prev => ({ ...prev, sqft: areaSqFt }));
      } else {
        throw new Error('No se pudo obtener la geometría del edificio. Usa el modo Manual.');
      }
    } catch (error: any) {
      setAreaError(error.message || 'Error al obtener datos. Intenta de nuevo o usa el modo Manual.');
    } finally {
      setIsFetchingArea(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const pmt = (rate: number, nper: number, pv: number) => 
    (pv * rate * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);

  const calculations = useMemo(() => {
    return PLANS.map(plan => {
      // PASO 1: Calcular precio base
      // Formula: (AREA * COST_PER_FT2) + REMOVAL
      const precioConRemocion = (data.sqft * CONSTANTS.REMOVAL_RATE) * (data.removalPercentage / 100);
      const precioSinRemocion = data.sqft * plan.pricePerSqFt;
      const precioBaseSinIvu = precioConRemocion + precioSinRemocion;

      // PASO 2: Aplicar descuento (si aplica)
      let precioConDescuento = precioBaseSinIvu;
      if (data.clienteVip) precioConDescuento -= 1000;
      if (data.firmaYGana) precioConDescuento -= 500;
      precioConDescuento = Math.max(0, precioConDescuento);

      // PASO 3: Agregar IVU
      const tax = precioConDescuento * 0.115;
      const precioConIvu = precioConDescuento + tax;

      // PASO 5: Down payment y monto a financiar
      const precioAFinanciar = Math.max(0, precioConIvu - data.downPayment);

      // PASO 6: Calcular pago mensual
      const monthly60 = precioAFinanciar > 0 ? pmt(CONSTANTS.TASAS.Y5, 60, precioAFinanciar) : 0;
      const monthly84 = precioAFinanciar > 0 ? pmt(CONSTANTS.TASAS.Y7, 84, precioAFinanciar) : 0;
      const monthly120 = precioAFinanciar > 0 ? pmt(CONSTANTS.TASAS.Y10, 120, precioAFinanciar) : 0;

      // Valores para el cuadro verde (Cash)
      const totalCashWithIvuOriginal = precioBaseSinIvu * CONSTANTS.IVU;
      const cashWithDiscount = Math.max(0, totalCashWithIvuOriginal - (data.firmaYGana ? 500 : 0) - (data.clienteVip ? 1000 : 0));
      
      // Apply 10% Cash Discount and subtract Down Payment
      const cashTotalConIvuFull = cashWithDiscount * 0.90;
      const cashTotalConIvu = Math.max(0, cashTotalConIvuFull - data.downPayment);
      const cashValorSinIvu = cashTotalConIvu / CONSTANTS.IVU;
      const cashIvu = cashTotalConIvu - cashValorSinIvu;

      return {
        ...plan,
        base: precioBaseSinIvu,
        totalCash: totalCashWithIvuOriginal,
        
        // Financing values
        monthly60,
        monthly84,
        monthly120,
        
        // Value with/before IVU (Requirement 2 & 6) - Now showing balance after down payment
        cashBalance: precioAFinanciar, 
        baseBalance: precioAFinanciar / CONSTANTS.IVU,
        
        // Total financed for internal reference
        totalFinanced: monthly120 * 120,
        
        // Values for the green box (Cash)
        cashTotalConIvu,
        cashValorSinIvu,
        cashIvu
      };
    });
  }, [data]);

  const captureMap = async (): Promise<{ bytes: Uint8Array; hasLocation: boolean } | null> => {
    try {
      const lat = parseFloat(coords.lat);
      const lng = parseFloat(coords.lng);
      const isDefault = lat === 18.2208 && lng === -66.5901;

      let url: string;
      if (isDefault) {
        // Vista general de Puerto Rico (mapa de calles)
        url = `https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/export?bbox=-67.4,17.7,-65.5,18.7&bboxSR=4326&size=500,320&format=png&transparent=false&f=image`;
      } else {
        // Vista satelital centrada en las coordenadas del techo
        const delta = 0.0009;
        const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
        url = `https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/export?bbox=${bbox}&bboxSR=4326&size=500,320&format=png&transparent=false&f=image`;
      }

      const res = await fetch(url);
      if (!res.ok) return null;
      return { bytes: new Uint8Array(await res.arrayBuffer()), hasLocation: !isDefault };
    } catch { return null; }
  };

  const roofingResumen = {
    sqft: data.sqft,
    removalPct: data.removalPercentage,
    pronto: data.downPayment,
    descuentos: [
      data.firmaYGana ? 'Firma y Gana (-$500)' : null,
      data.clienteVip ? 'Cliente VIP (-$1,000)' : null,
    ].filter(Boolean).join(', ') || 'Ninguno',
    modalidades: modalidadesParaPDF,
    idioma:      idiomaParaPDF,
    planes: calculations
      .filter(p => planesParaPDF.map(n => n.toUpperCase()).includes(p.name.toUpperCase()))
      .map(p => ({
        nombre:        p.name,
        mensual5:      p.monthly60,
        mensual7:      p.monthly84,
        mensual10:     p.monthly120,
        cashTotal:     p.cashTotalConIvu,
        cashSinIvu:    p.cashValorSinIvu,
        cashIvu:       p.cashIvu,
        valorConIvu:   p.cashBalance,
        valorAntesIvu: p.baseBalance,
        financiado:    p.cashBalance,
      })),
  };

  const handleGenerateRoofingPDF = async (cliente: ClienteData, consultor: ConsultorData) => {
    const result = await captureMap();
    await generateRoofingPDF(cliente, consultor, roofingResumen, result?.bytes ?? null, result?.hasLocation ?? false);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <SplashScreen onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <div className="min-h-screen p-3 sm:p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <img
                src="https://i.postimg.cc/44pJ0vXw/logo.png"
                className="h-16 w-auto transform hover:scale-105 transition-transform"
                alt="Windmar Home"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-xl sm:text-3xl font-black text-windmar-blue-dark dark:text-[#e8eaed] tracking-tighter uppercase">Cotizador Roofing PRO</h1>
                <p className="text-windmar-blue dark:text-[#a0a4ad] text-sm sm:text-base font-medium">Soluciones de techado de alta ingeniería</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1a1d25] p-1 pr-3 rounded-full border border-slate-200 dark:border-white/[0.08] shadow-sm">
              <motion.button
                onClick={() => setIsDarkMode(!isDarkMode)}
                animate={{ rotate: isDarkMode ? 360 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`p-1.5 rounded-full transition-colors duration-500 ${
                  isDarkMode
                    ? 'bg-windmar-gold text-windmar-dark shadow-[0_0_10px_rgba(242,158,31,0.3)]'
                    : 'bg-windmar-blue text-white shadow-[0_0_10px_rgba(29,66,155,0.2)]'
                }`}
              >
                {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              </motion.button>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] font-black text-slate-400 dark:text-[#6b7280] uppercase tracking-tighter">Tema</span>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-windmar-gold' : 'text-windmar-blue'}`}>
                  {isDarkMode ? 'Oscuro' : 'Claro'}
                </span>
              </div>
            </div>
          </header>

          <main className="space-y-12">
            {/* Top Section: Inputs and Plans */}
            <div className="space-y-6">
              {/* Compact Inputs Bar */}
              <section className="glass-card p-5 flex flex-col gap-6 relative z-30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="bg-windmar-gold/20 p-2 rounded-lg">
                      <Calculator size={24} className="text-windmar-gold" />
                    </div>
                    <div>
                      <h2 className="font-black text-slate-900 dark:text-[#e8eaed] text-lg uppercase tracking-widest">COTIZADOR ROOFING PRO</h2>
                    </div>
                  </div>
                  {data.sqft > 0 && (
                    <button
                      onClick={() => setPdfModalAbierto(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d2050] text-white text-xs font-black hover:bg-[#1a56c4] transition-colors shadow-md"
                    >
                      <FileSpreadsheet size={15} />
                      Descargar PDF
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative h-full"
                  >
                    <label className="absolute -top-2.5 left-3 bg-windmar-blue-light px-2 py-0.5 rounded-md text-[10px] font-black text-windmar-blue-dark uppercase z-10 shadow-sm">Área (ft²)</label>
                    <input 
                      type="number" 
                      value={data.sqft === 0 ? '' : data.sqft}
                      onChange={(e) => setData({...data, sqft: Number(e.target.value)})}
                      placeholder="0"
                      className="input-field w-full h-full text-xl font-black min-h-[60px]"
                    />
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative h-full"
                  >
                    <label className="absolute -top-2.5 left-3 bg-windmar-blue-light px-2 py-0.5 rounded-md text-[10px] font-black text-windmar-blue-dark uppercase z-10 shadow-sm">Pronto (Down Payment)</label>
                    <input 
                      type="number" 
                      value={data.downPayment === 0 ? '' : data.downPayment}
                      onChange={(e) => setData({...data, downPayment: Number(e.target.value)})}
                      placeholder="0"
                      className="input-field w-full h-full text-xl font-black text-windmar-blue-dark min-h-[60px]"
                    />
                    <p className="absolute -bottom-5 left-0 text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Mínimo a financiar: $5,000</p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative h-full"
                  >
                    <label className="absolute -top-2.5 left-3 bg-windmar-blue-light px-2 py-0.5 rounded-md text-[10px] font-black text-windmar-blue-dark uppercase z-10 shadow-sm">Remoción ({data.removalPercentage}%)</label>
                    <div className="input-field w-full h-full flex flex-col justify-center px-4 min-h-[60px]">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="10"
                        value={data.removalPercentage}
                        onChange={(e) => setData({...data, removalPercentage: Number(e.target.value)})}
                        className="w-full h-2 bg-windmar-blue-light rounded-lg appearance-none cursor-pointer accent-windmar-blue-dark"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative h-full"
                  >
                    <label className="absolute -top-2.5 left-3 bg-windmar-blue-light px-2 py-0.5 rounded-md text-[10px] font-black text-windmar-blue-dark uppercase z-10 shadow-sm">Cargos Adicionales</label>
                    <div className="w-full h-full bg-windmar-gold/5 border border-windmar-blue-light/50 rounded-2xl px-4 py-3 flex flex-col justify-center min-h-[60px] shadow-sm">
                      <span className="text-windmar-gold font-black text-lg">
                        {formatCurrency((data.sqft * CONSTANTS.REMOVAL_RATE) * (data.removalPercentage / 100))}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Compact Discounts Dropdown */}
                <motion.div
                  ref={discountRef}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative pt-2"
                >
                  <label className="absolute -top-2.5 left-3 bg-windmar-blue-light px-2 py-0.5 rounded-md text-[10px] font-black text-windmar-blue-dark uppercase z-10 shadow-sm">Descuentos</label>
                  <button 
                    onClick={() => setShowDiscounts(!showDiscounts)}
                    className="input-field w-full flex items-center justify-between hover:bg-slate-50 transition-all min-h-[60px]"
                  >
                    <div className="flex flex-wrap gap-2">
                      {!data.firmaYGana && !data.clienteVip && <span className="text-sm text-slate-500 font-bold">Seleccionar descuentos...</span>}
                      {data.firmaYGana && (
                        <span className="bg-windmar-gold/20 text-windmar-gold text-[10px] font-black px-2 py-1 rounded-md border border-windmar-gold/30 uppercase flex items-center gap-1">
                          Firma y Gana
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setData({...data, firmaYGana: false});
                            }}
                            className="hover:bg-windmar-gold/30 rounded-full p-0.5 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      )}
                      {data.clienteVip && (
                        <span className="bg-windmar-gold/20 text-windmar-gold text-[10px] font-black px-2 py-1 rounded-md border border-windmar-gold/30 uppercase flex items-center gap-1">
                          Cliente VIP
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setData({...data, clienteVip: false});
                            }}
                            className="hover:bg-windmar-gold/30 rounded-full p-0.5 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: showDiscounts ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center justify-center"
                    >
                      <ChevronDown size={18} className="text-slate-500" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {showDiscounts && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-2xl z-[100] overflow-hidden origin-top"
                      >
                        <div className="p-2 flex flex-col gap-1">
                          <button
                            onClick={() => setData({...data, firmaYGana: !data.firmaYGana})}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-white/[0.03] ${data.firmaYGana ? 'bg-windmar-gold/10' : ''}`}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-xs font-black text-slate-900 dark:text-[#e8eaed] uppercase tracking-wider">Firma y Gana</span>
                              <span className="text-[10px] font-bold text-windmar-gold">-$500 de descuento</span>
                            </div>
                            {data.firmaYGana && <CheckCircle2 size={16} className="text-windmar-gold" />}
                          </button>
                          
                          <button
                            onClick={() => setData({...data, clienteVip: !data.clienteVip})}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-white/[0.03] ${data.clienteVip ? 'bg-windmar-gold/10' : ''}`}
                          >
                            <div className="flex flex-col items-start">
                              <span className="text-xs font-black text-slate-900 dark:text-[#e8eaed] uppercase tracking-wider">Cliente VIP</span>
                              <span className="text-[10px] font-bold text-windmar-gold">-$1,000 de descuento</span>
                            </div>
                            {data.clienteVip && <CheckCircle2 size={16} className="text-windmar-gold" />}
                          </button>
                        </div>
                        <button 
                          onClick={() => setShowDiscounts(false)}
                          className="w-full p-3 bg-windmar-gold/20 text-windmar-gold font-black uppercase text-[10px] tracking-widest hover:bg-windmar-gold/30 transition-all border-t border-slate-200"
                        >
                          Cerrar Descuentos
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Minimum Financing Alert */}
                {calculations.some(p => (p.totalCash - data.downPayment) < 5000 && (p.totalCash - data.downPayment) > 0) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 overflow-hidden"
                  >
                    <AlertTriangle className="text-red-500 shrink-0" size={20} />
                    <div className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-relaxed">
                      Alerta: El financiamiento mínimo permitido es de $5,000. 
                      Por favor verifique los planes individuales abajo.
                    </div>
                  </motion.div>
                )}
              </section>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 items-start">
                {calculations.map((plan, idx) => (
                  <motion.div 
                    key={plan.id + data.sqft + data.removalPercentage + data.paymentMethod + data.downPayment}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20,
                      delay: idx * 0.05,
                      scale: { type: "spring", stiffness: 400, damping: 25 },
                      y: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    className={`glass-card p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden border-t-4 shadow-xl cursor-pointer transition-shadow hover:shadow-2xl ${
                      plan.id === 'silver' ? 'border-slate-400' : plan.id === 'gold' ? 'border-windmar-gold' : 'border-slate-300'
                    }`}
                  >
                    {plan.id === 'platinum' && (
                      <div className="absolute top-4 right-4 text-windmar-gold">
                        <Sparkles size={20} className="animate-pulse" />
                      </div>
                    )}

                    {data.sqft > 0 && (plan.totalCash - data.downPayment) < 5000 && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center border-2 border-red-500/50 rounded-xl">
                        <AlertTriangle className="text-red-500 mb-4 animate-bounce" size={48} />
                        <p className="text-red-600 font-black uppercase tracking-tighter text-sm mb-4 leading-tight">
                          {plan.id === 'silver' && "No es apto para SILVER. El monto a financiar debe ser al menos $5,000."}
                          {plan.id === 'gold' && "No es apto para GOLD. El monto a financiar debe ser al menos $5,000."}
                          {plan.id === 'platinum' && "No es apto para PLATINUM. El monto a financiar debe ser al menos $5,000."}
                        </p>
                        <div className="bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                          <span className="text-[10px] text-red-600 font-black uppercase block mb-1">Monto Calculado:</span>
                          <span className="text-xl font-black text-slate-900">
                            {formatCurrency(Math.max(0, plan.totalCash - data.downPayment))}
                          </span>
                        </div>
                        <p className="mt-4 text-[9px] text-slate-500 font-bold uppercase">
                          Ajuste el área o reduzca el pronto para habilitar financiamiento.
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-xl font-black tracking-tighter uppercase ${
                          plan.id === 'silver' ? 'text-slate-500' : plan.id === 'gold' ? 'text-windmar-gold' : 'text-slate-800'
                        }`}>
                          {plan.name}
                        </h3>
                        <div className={`${
                          plan.id === 'silver' ? 'text-slate-500' : plan.id === 'gold' ? 'text-windmar-gold' : 'text-slate-800'
                        }`}>
                          {plan.id === 'silver' && <Shield size={24} />}
                          {plan.id === 'gold' && <Award size={24} />}
                          {plan.id === 'platinum' && <Crown size={24} />}
                        </div>
                      </div>

                        <div className="space-y-4 mb-8">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-600 dark:text-[#a0a4ad] uppercase tracking-widest">5 Años</span>
                              <span className="text-[10px] font-black text-windmar-gold">(5.99 %)</span>
                            </div>
                            <span className="text-xl font-black text-windmar-blue-dark dark:text-[#e8eaed]">{formatCurrency(plan.monthly60)}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-600 dark:text-[#a0a4ad] uppercase tracking-widest">7 Años</span>
                              <span className="text-[10px] font-black text-windmar-gold">(7.99 %)</span>
                            </div>
                            <span className="text-xl font-black text-windmar-blue-dark dark:text-[#e8eaed]">{formatCurrency(plan.monthly84)}</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-600 dark:text-[#a0a4ad] uppercase tracking-widest">10 Años</span>
                              <span className="text-[10px] font-black text-windmar-gold">(9.99 %)</span>
                            </div>
                            <span className="text-xl font-black text-windmar-blue-dark dark:text-[#e8eaed]">{formatCurrency(plan.monthly120)}</span>
                          </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-[#a0a4ad] font-black uppercase text-[10px]">valor con ivu</span>
                        <span className="text-slate-900 dark:text-[#e8eaed] font-black">{formatCurrency(plan.cashBalance)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-[#a0a4ad] font-black uppercase text-[10px]">valor antes de ivu</span>
                        <span className="text-slate-900 dark:text-[#e8eaed] font-black">{formatCurrency(plan.baseBalance)}</span>
                      </div>
                      
                      <CashBox plan={plan} />

                      <div className="mt-2 text-[10px] text-windmar-blue font-black text-center uppercase tracking-widest bg-windmar-blue/10 py-1.5 rounded-xl">
                        Costo P/C: ${plan.pricePerSqFt.toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Section: Split Map and Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map Tool */}
              <motion.section 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="glass-card p-4 sm:p-6 flex flex-col h-full shadow-xl"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Map size={24} className="text-windmar-gold" />
                    <h3 className="font-black text-slate-900 dark:text-[#e8eaed] uppercase tracking-widest text-lg">Mapa de Medición</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white dark:bg-[#0f1215] p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08]">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-900 dark:text-[#a0a4ad] font-black uppercase tracking-tighter ml-1">Latitud</span>
                      <input
                        type="text"
                        value={coords.lat}
                        onChange={(e) => setCoords(prev => ({ ...prev, lat: e.target.value }))}
                        placeholder="Latitud"
                        className="w-24 bg-transparent px-1 py-0.5 text-slate-900 dark:text-[#e8eaed] text-[10px] font-bold outline-none focus:text-windmar-gold"
                      />
                    </div>
                    <div className="w-px h-5 bg-slate-200 dark:bg-white/10 self-end mb-1" />
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-900 dark:text-[#a0a4ad] font-black uppercase tracking-tighter ml-1">Longitud</span>
                      <input
                        type="text"
                        value={coords.lng}
                        onChange={(e) => setCoords(prev => ({ ...prev, lng: e.target.value }))}
                        placeholder="Longitud"
                        className="w-24 bg-transparent px-1 py-0.5 text-slate-900 dark:text-[#e8eaed] text-[10px] font-bold outline-none focus:text-windmar-gold"
                      />
                    </div>
                    <button 
                      onClick={fetchFreeRoofArea}
                      className="text-windmar-gold hover:text-slate-900 transition-colors self-end mb-1"
                    >
                      <Zap size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchFreeRoofArea}
                    disabled={isFetchingArea || isManualMode}
                    className="py-3 bg-windmar-blue-dark hover:bg-windmar-blue text-white text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-windmar-blue-dark/20"
                  >
                    {isFetchingArea ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                    Auto-Medir
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsManualMode(!isManualMode)}
                    className={`py-3 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md ${
                      isManualMode ? 'bg-windmar-gold text-windmar-blue-dark' : 'bg-windmar-blue-dark text-white hover:bg-windmar-blue shadow-windmar-blue-dark/20'
                    }`}
                  >
                    <Maximize2 size={16} />
                    {isManualMode ? 'Terminar' : 'Manual'}
                  </motion.button>
                </div>

                {/* Error Auto-Medir */}
                {areaError && (
                  <div className="flex flex-col gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-3 py-2.5 mb-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-black text-red-600 dark:text-red-400 leading-relaxed">
                          😢 Lo sentimos mucho — {areaError}
                        </p>
                        <p className="text-[10px] text-red-500/80 dark:text-red-400/70 mt-0.5 font-semibold">
                          Puedes trazar el contorno manualmente con el botón <span className="font-black">Manual</span>.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setAreaError(null); setIsManualMode(true); }}
                      className="w-full py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Ruler size={12} />
                      Activar Modo Manual
                    </button>
                  </div>
                )}

                <div className="relative flex-1 min-h-[350px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner" id="map-capture-area">
                  {/* Map Controls Overlay */}
                  <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
                    <a 
                      href="https://app.measuremaponline.com/dashboard/overview" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-white transition-all border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                      title="Measure Map Online"
                    >
                      <Ruler size={14} className="text-windmar-gold" />
                      <span className="hidden sm:inline">Measure Map</span>
                    </a>
                    
                    <a 
                      href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coords.lat},${coords.lng}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-white transition-all border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                      title="Street View"
                    >
                      <Globe size={14} className="text-windmar-gold" />
                      <span className="hidden sm:inline">Street View</span>
                    </a>
                  </div>

                  <MapContainer
                    center={[mapLat, mapLng]}
                    zoom={8.0}
                    maxZoom={23}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution={mapLayer === 'satellite' ? '&copy; Esri' : '&copy; OpenStreetMap'}
                      url={mapLayer === 'satellite'
                        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        : "https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png"
                      }
                      maxZoom={23}
                      maxNativeZoom={19}
                    />
                    <MapEventsHandler onMapClick={handleMapClick} isManualMode={isManualMode} />
                    {!isManualMode && (mapLat !== 18.2208 || mapLng !== -66.5901) && (
                      <Marker position={[mapLat, mapLng]} />
                    )}
                    {manualPoints.length > 0 && (
                      <>
                        {manualPoints.map((p, i) => (
                          <Marker
                            key={i}
                            position={p}
                            icon={L.divIcon({
                              className: 'bg-windmar-gold w-3 h-3 rounded-full border border-white shadow-lg',
                              iconSize: [12, 12]
                            })}
                          />
                        ))}
                        {manualPoints.length >= 3 ? (
                          <Polygon positions={manualPoints} pathOptions={{ color: '#f29e1f', fillColor: '#f29e1f', fillOpacity: 0.3, weight: 3 }} />
                        ) : (
                          <Polyline positions={manualPoints} pathOptions={{ color: '#f29e1f', weight: 3 }} />
                        )}
                      </>
                    )}
                    <MapUpdater center={[mapLat, mapLng]} />
                  </MapContainer>

                  <AnimatePresence>
                    {isManualMode && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-4 left-4 right-4 z-[1001]"
                      >
                        <div className="p-3 rounded-xl border border-white/20 flex justify-between items-center shadow-xl" style={{ backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Área Trazada</p>
                            <p className="text-lg font-black" style={{ color: '#f29e1f' }}>
                              {manualPoints.length < 3 ? 'Trace 3 puntos...' : `${manualArea} ft²`}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={clearManualMeasurement} 
                              className="p-2 bg-white/10 rounded-lg text-white" 
                              title="Reiniciar"
                            >
                              <RefreshCw size={16} />
                            </motion.button>
                            <motion.button 
                              whileTap={{ scale: 0.95 }}
                              onClick={confirmManualMeasurement} 
                              disabled={manualPoints.length < 3}
                              className="px-4 py-1.5 text-windmar-dark font-black text-xs rounded-lg disabled:opacity-50"
                              style={{ backgroundColor: '#f29e1f' }}
                            >
                              APLICAR
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.section>

              {/* Comparison Table */}
              <motion.section 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="glass-card flex flex-col h-full overflow-hidden shadow-xl"
              >
                <div className="p-6 border-b border-slate-200 dark:border-white/[0.08] flex items-center gap-3 bg-slate-50 dark:bg-[#0f1215]">
                  <ShieldCheck size={24} className="text-windmar-gold" />
                  <h3 className="font-black text-slate-900 dark:text-[#e8eaed] uppercase tracking-widest text-lg">COMPARATIVO DE PLANES DE SELLADO</h3>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-[#0f1215] text-slate-700 dark:text-[#a0a4ad] uppercase text-[10px] font-black tracking-[0.2em]">
                        <th className="px-5 py-4 font-black">Beneficio</th>
                        <th className="px-5 py-4 font-black">Silver</th>
                        <th className="px-5 py-4 font-black">Gold</th>
                        <th className="px-5 py-4 font-black">Platinum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06]">
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-700 dark:text-[#a0a4ad]">Garantía Inst.</td>
                        <td className="px-5 py-4 text-slate-600 dark:text-[#6b7280]">1 Año</td>
                        <td className="px-5 py-4 text-windmar-gold font-black">10 Años</td>
                        <td className="px-5 py-4 text-windmar-gold font-black">10 Años</td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-700 dark:text-[#a0a4ad]">Garantía Fab.</td>
                        <td className="px-5 py-4 text-slate-600 dark:text-[#6b7280]" colSpan={3}>Limitada de por Vida</td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-700 dark:text-[#a0a4ad]">Mantenimiento</td>
                        <td className="px-5 py-4 text-slate-500 dark:text-[#6b7280]">No incl.</td>
                        <td className="px-5 py-4 text-slate-500 dark:text-[#6b7280]">No incl.</td>
                        <td className="px-5 py-4 text-windmar-blue dark:text-blue-400 font-black">
                          Incluido 10 años
                          <div className="text-[9px] text-slate-500 dark:text-[#6b7280] font-bold mt-0.5 uppercase tracking-widest">(1 cada 2 años)</div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-700 dark:text-[#a0a4ad]">Soporte 24/7</td>
                        <td className="px-5 py-4 text-slate-600 dark:text-[#6b7280]">Sí</td>
                        <td className="px-5 py-4 text-slate-600 dark:text-[#6b7280]">Sí</td>
                        <td className="px-5 py-4 text-slate-600 dark:text-[#6b7280]">Sí</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="p-5 bg-slate-50 dark:bg-[#0f1215] border-t border-slate-200 dark:border-white/[0.08] space-y-4">
                  <div>
                    <h4 className="text-[10px] font-black text-windmar-gold uppercase mb-2 tracking-widest">Detalles del Servicio</h4>
                    <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-[#a0a4ad] font-medium">
                      <li className="flex gap-2">
                        <span className="text-windmar-gold">•</span>
                        <span>Incluye Rectificaciones (aires, calentadores, etc.)</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-windmar-gold">•</span>
                        <span>Al vencerse la garantía de mano de obra: Mínimo $300 por visita</span>
                      </li>
                      <li className="text-[10px] text-slate-500 dark:text-[#6b7280] italic ml-4 leading-relaxed">
                        *Si se resuelve en &lt; 2 horas, no hay costo adicional a los $300. Trabajos adicionales se cotizan aparte.
                      </li>
                    </ul>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-[#6b7280] italic text-center font-medium border-t border-slate-100 dark:border-white/[0.06] pt-3">
                    *Precios sujetos a inspección técnica final en sitio.
                  </p>
                </div>
              </motion.section>
            </div>
          </main>

          {/* Footer Info */}
          <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-white/[0.08]">
            <div className="flex gap-4">
              <div className="bg-windmar-gold/10 p-3 rounded-xl h-fit">
                <ShieldCheck className="text-windmar-gold" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-[#e8eaed] text-sm mb-1">Certificación PRO</h4>
                <p className="text-slate-600 dark:text-[#a0a4ad] text-xs leading-relaxed">Instaladores certificados por los principales fabricantes de selladores en EE.UU. y PR.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-windmar-blue/10 p-3 rounded-xl h-fit">
                <CreditCard className="text-windmar-blue" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-[#e8eaed] text-sm mb-1">Financiamiento Flexible</h4>
                <p className="text-slate-600 dark:text-[#a0a4ad] text-xs leading-relaxed">Opciones de 5, 7 y 10 años con tasas competitivas desde 5.99% APR.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-windmar-blue/10 p-3 rounded-xl h-fit">
                <Wrench className="text-windmar-blue" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-[#e8eaed] text-sm mb-1">Soporte Local</h4>
                <p className="text-slate-600 dark:text-[#a0a4ad] text-xs leading-relaxed">Equipo de servicio al cliente basado en Puerto Rico disponible 24/7 para emergencias.</p>
              </div>
            </div>
          </footer>

          <div className="text-center pt-8 pb-4">
            <p className="text-[10px] font-black text-slate-400 dark:text-[#6b7280] uppercase tracking-[0.3em]">
              © 2026 Windmar Home • Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>

      <PDFModal
        isOpen={pdfModalAbierto}
        onClose={() => setPdfModalAbierto(false)}
        tipo="roofing"
        resumen={{
          'Area del Techo': `${data.sqft.toLocaleString()} ft²`,
          'Remocion': `${data.removalPercentage}%`,
          'Pronto Pago': `$${data.downPayment.toLocaleString()}`,
          'Descuentos': roofingResumen.descuentos,
        }}
        onGenerate={handleGenerateRoofingPDF}
        planes={['Silver', 'Gold', 'Platinum']}
        planesSeleccionados={planesParaPDF}
        onPlanesChange={setPlanesParaPDF}
        modalidades={['cash', 'wh_financial', 'home_depot']}
        modalidadesSeleccionadas={modalidadesParaPDF}
        onModalidadesChange={setModalidadesParaPDF}
        idioma={idiomaParaPDF}
        onIdiomaChange={setIdiomaParaPDF}
      />
    </>
  );
}
