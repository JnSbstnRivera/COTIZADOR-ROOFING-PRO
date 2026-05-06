# COTIZADOR ROOFING PRO

Cotizador de techado para **Windmar Home Puerto Rico**. Incluye medición de área por mapa, tres niveles de servicio y propuesta en PDF.

---

## ¿Qué hace?

El asesor dibuja el polígono del techo directamente sobre un mapa (Leaflet), selecciona el nivel de servicio y configura los descuentos aplicables. La herramienta calcula el precio final y genera una propuesta PDF lista para el cliente.

---

## Características

- Medición de área por polígono sobre mapa interactivo (Leaflet)
- Tres niveles de servicio: **Silver / Gold / Platinum**
- Sistema de descuentos:
  - Firma y Gana: **-$500**
  - Cliente VIP: **-$1,000**
- Cálculo en tiempo real (precio × pies², remoción, pronto pago)
- Splash screen animado (tema sellado de silicón)
- Exportación a PDF con propuesta profesional
- Dark / Light mode

---

## Stack Técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| Mapas | Leaflet + react-leaflet |
| PDF | jsPDF + html2canvas + pdf-lib |
| Animaciones | Motion (Framer Motion) |
| Iconos | Lucide React |
| IA | Google Gemini (@google/genai) |
| Fuentes | Poppins, Inter |

---

## Variables de entorno

```
GEMINI_API_KEY=
```

---

## Instalación local

```bash
npm install
npm run dev
# http://localhost:5173
```

---

## Despliegue

**Producción:** https://cotizador-roofing-pro.vercel.app

---

*Desarrollado para Windmar Home Puerto Rico — Call Center Operations*
