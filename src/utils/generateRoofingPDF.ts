import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { ClienteData, ConsultorData } from '../components/PDFModal'

// ── colores Windmar ────────────────────────────────────────────
const NAVY        = rgb(0.051, 0.125, 0.314)   // #0d2050
const BLUE        = rgb(0.102, 0.337, 0.769)   // #1a56c4
const ORANGE      = rgb(0.973, 0.608, 0.141)   // #f89b24
const WHITE       = rgb(1, 1, 1)
const LIGHT       = rgb(0.918, 0.953, 1.0)
const GRAY        = rgb(0.4, 0.4, 0.4)
const DARK        = rgb(0.1, 0.1, 0.1)
const BORDER      = rgb(0.773, 0.831, 0.937)
const SILVER_COLOR = rgb(0.72, 0.72, 0.72)
const GOLD_COLOR   = rgb(0.949, 0.620, 0.122)
const PLAT_COLOR   = rgb(0.051, 0.125, 0.314)
const LIGHT_GRAY   = rgb(0.96, 0.96, 0.96)
const MID_GRAY     = rgb(0.85, 0.85, 0.85)
const ICON_BG      = rgb(0.918, 0.945, 0.992)
const GREEN_CASH   = rgb(0.027, 0.455, 0.267)
const EMERALD_BG   = rgb(0.878, 0.969, 0.922)
const HD_GRAY      = rgb(0.42, 0.44, 0.50)

// ── textos bilingues ───────────────────────────────────────────
const LABELS = {
  es: {
    planesTitulo: 'PLANES DE',
    planesSubtitulo: 'SELLADO',
    fab: 'Garantia del\nFabricante',
    obra: 'Garantia de Mano\nde Obra',
    mant: 'Mantenimiento y\nLimpieza Preventiva',
    limitada: 'Limitada por vida',
    year1: '1 ano',
    years10: '10 anos',
    price600: '$600 por visita',
    platMant: 'Limpieza de Techo y\nPaneles cada 2 anos\npor 10 anos.',
    fn1: '1) Incluye Rectificaciones (aires, calentadores, etc).',
    fn2: '2) Al vencerse la Garantia de Mano de Obra se cobrara un minimo de $300 por visita. Si se puede resolver en menos de 2 horas no hay costo adicional a los $300.',
    fn3: '3) Limpieza del techo/sellado cada 2 anos. Si hay paneles solares tambien se limpiaran.',
    ventTitle: 'VENTAJAS DE LA SILICONA',
    icons: [
      ['Garantizado', 'de Por Vida'],
      ['Flexible!', 'Se adapta a', 'superficies irregulares'],
      ['Impermeable'],
      ['Resistente a', 'cambios en', 'temperatura'],
      ['Compatible con', 'gran variedad', 'de superficies'],
      ['Resistente a', 'condiciones', 'climatologicas'],
      ['Mantenimiento', 'Simple'],
      ['Eficiencia', 'Energetica'],
      ['Resistencia', 'al Fuego'],
      ['Apariencia', 'Agradable'],
      ['Eco', 'Amigable'],
      ['Es Seguro -', 'no requiere antorcha', 'de gas en su aplicacion'],
    ],
    contacto: 'Contactanos',
    direccion: 'Direccion',
    whyTitle: 'POR QUE WINDMAR?',
    exp1Title: '#1 EXPERIENCIA:',
    exp1Body: [
      'Fundada desde 2002 por una familia con sobre 70',
      'anos de experiencia en materiales de construccion en',
      'Puerto Rico, comenzamos a instalar paneles solares',
      'para la AEE, AAA y farmaceuticas.',
      '',
      'Somos un equipo de empleados que ha manejado la',
      'contratacion, desarrollo e instalacion de proyectos',
      'solares por todo Puerto Rico que energizan a sobre',
      '60,000+ hogares.',
      '',
      'Ademas, somos la compania con mas brigadas de',
      'instalacion y servicios en el Caribe. Hemos instalado',
      'en sobre 1,500 hogares en un mes, algo que nunca ha',
      'podido realizar otra compania.',
    ],
    exp1Bullets: [
      'Sobre 50 disenadores evaluando hogares, haciendo analisis de sombra y consultando el plano de instalacion con todos nuestros clientes.',
      'Sobre 1,000 tecnicos solares instalando sistemas solares todos los dias.',
      'Proceso unico de Quality-control al final de cada instalacion por jefe de brigada, supervisor y disenador solar.',
      'Lanzamos en el 2020 el Windmar Training Center, el unico centro de adiestramiento para sistemas solares residenciales en el Caribe.',
    ],
    serv1Title: '#1 Y SERVICIO:',
    serv1Body: [
      'Al evaluar una garantia, la preocupacion principal es si',
      'esa compania va a existir cuando necesites reclamar la',
      'garantia. Parte del negocio de Windmar se dedica a',
      'ser dueno de sistemas solares y venderle la energia a',
      'sobre 40 entidades diferentes bajo contratos de 20+',
      'anos.',
      '',
      'Nosotros, si, vamos a estar aqui!',
    ],
    serv1Bullets: [
      'Sobre 100 empleados full-time en Servicio al Cliente.',
    ],
  },
  en: {
    planesTitulo: 'SEALING',
    planesSubtitulo: 'PLANS',
    fab: 'Manufacturer\nWarranty',
    obra: 'Labor\nWarranty',
    mant: 'Maintenance &\nPreventive Cleaning',
    limitada: 'Limited Lifetime',
    year1: '1 year',
    years10: '10 years',
    price600: '$600 per visit',
    platMant: 'Roof & Panel\nCleaning every\n2 years / 10 years.',
    fn1: '1) Includes Rectifications (ACs, water heaters, etc).',
    fn2: '2) Labor warranty minimum charge of $300 per visit. If resolved under 2 hours, no extra charge. Additional work will be quoted separately.',
    fn3: '3) Roof sealing cleaning every 2 years. If solar panels present, they will also be cleaned.',
    ventTitle: 'ADVANTAGES OF SILICONE',
    icons: [
      ['Lifetime', 'Guaranteed'],
      ['Flexible!', 'Adapts to', 'irregular surfaces'],
      ['Waterproof'],
      ['Temperature', 'Resistant'],
      ['Compatible with', 'a wide variety', 'of surfaces'],
      ['Weather', 'Resistant'],
      ['Simple', 'Maintenance'],
      ['Energy', 'Efficiency'],
      ['Fire', 'Resistance'],
      ['Attractive', 'Appearance'],
      ['Eco', 'Friendly'],
      ['Safe - no torch', 'required for', 'application'],
    ],
    contacto: 'Contact Us',
    direccion: 'Address',
    whyTitle: 'WHY WINDMAR?',
    exp1Title: '#1 EXPERIENCE:',
    exp1Body: [
      'Founded in 2002 by a family with over 70 years of',
      'experience in construction materials in Puerto Rico,',
      'we began installing solar panels for AEE, AAA and',
      'pharmaceutical companies.',
      '',
      'We are a team that has managed the contracting,',
      'development and installation of solar projects',
      'throughout Puerto Rico, energizing over',
      '60,000+ homes.',
      '',
      'We are also the company with the most installation',
      'brigades and services in the Caribbean. We have',
      'installed in over 1,500 homes in one month — something',
      'no other company has achieved.',
    ],
    exp1Bullets: [
      'Over 50 designers evaluating homes, performing shade analysis and consulting installation plans with all our clients.',
      'Over 1,000 solar technicians installing solar systems every day.',
      'Unique Quality-control process at the end of each installation by the brigade chief, supervisor and solar designer.',
      'In 2020 we launched the Windmar Training Center — the only residential solar training center in the Caribbean.',
    ],
    serv1Title: '#1 SERVICE:',
    serv1Body: [
      'When evaluating a warranty, the main concern is',
      'whether that company will exist when you need to',
      'file a claim. Part of Windmar\'s business is owning',
      'solar systems and selling energy to over 40 different',
      'entities under 20+ year contracts.',
      '',
      'We are here to stay!',
    ],
    serv1Bullets: [
      'Over 100 full-time employees in Customer Service.',
    ],
  },
} as const

export interface RoofingResumen {
  sqft: number
  removalPct: number
  pronto: number
  descuentos: string
  modalidades: string[]
  planes: {
    nombre: string
    mensual5: number
    mensual7: number
    mensual10: number
    cashTotal: number
    cashSinIvu: number
    cashIvu: number
    valorConIvu: number
    valorAntesIvu: number
    financiado: number
  }[]
  idioma?: 'es' | 'en'
}

// ── función principal ──────────────────────────────────────────
export async function generateRoofingPDF(
  cliente: ClienteData,
  consultor: ConsultorData,
  resumen: RoofingResumen,
  mapImageBytes?: Uint8Array | null,
  showLocationDot?: boolean,
) {
  const lang = resumen.idioma ?? 'es'

  const modeloUrl = lang === 'en' ? '/roofing-modelo-en.pdf' : '/roofing-modelo.pdf'
  const res = await fetch(modeloUrl)
  const finalRes = res.ok ? res : await fetch('/roofing-modelo.pdf')
  if (!finalRes.ok) throw new Error('No se pudo cargar el PDF modelo')
  const originalBytes = await finalRes.arrayBuffer()
  const originalDoc   = await PDFDocument.load(originalBytes)

  const outputDoc = await PDFDocument.create()
  const boldFont  = await outputDoc.embedFont(StandardFonts.HelveticaBold)
  const regFont   = await outputDoc.embedFont(StandardFonts.Helvetica)

  // ── imágenes embebibles ────────────────────────────────────
  let logoImage: any = null
  try {
    const r = await fetch('https://i.postimg.cc/6T5J2v2G/logo.png')
    if (r.ok) logoImage = await outputDoc.embedPng(await r.arrayBuffer())
  } catch { }

  // Fotos de trabajadores extraídas del template original
  let imgAerial: any = null   // foto aérea del techo (stream 11 - 1.9MB)
  let imgSealant: any = null  // close-up silicona en grieta (stream 17)
  let imgWorker: any = null   // trabajador aplicando en techo (stream 15)

  try {
    const ra = await fetch('/assets/page-img-11.jpg')
    if (ra.ok) imgAerial = await outputDoc.embedJpg(await ra.arrayBuffer())
  } catch { }
  try {
    const rs = await fetch('/assets/page-img-17.jpg')
    if (rs.ok) imgSealant = await outputDoc.embedJpg(await rs.arrayBuffer())
  } catch { }
  try {
    const rw = await fetch('/assets/page-img-15.jpg')
    if (rw.ok) imgWorker = await outputDoc.embedJpg(await rw.arrayBuffer())
  } catch { }

  const { width, height } = originalDoc.getPages()[0].getSize()
  const INSERT_AT  = 1
  const totalOrig  = originalDoc.getPages().length

  // ── Copiar páginas ANTES del insert (solo portada = índice 0) ──
  const [coverPage] = await outputDoc.copyPages(originalDoc, [0])
  outputDoc.addPage(coverPage)

  // ── Página de cotización (generada por código) ──────────────
  let mapImage: any = null
  if (mapImageBytes) {
    try { mapImage = await outputDoc.embedPng(mapImageBytes) } catch { }
  }
  const cotizPage = outputDoc.addPage([width, height])
  drawCotizacionRoofing(cotizPage, { width, height }, boldFont, regFont,
    cliente, consultor, resumen, logoImage, mapImage, showLocationDot)

  // ── Copiar / generar páginas DESPUÉS del insert ──────────────
  for (let i = INSERT_AT; i < totalOrig; i++) {
    // Página 2 del template (índice 1) = WH Financial / marketing
    // Página 3 del template (índice 2) = Planes de Sellado (JPEG completo)
    // En versión EN reemplazamos esas 2 páginas con versiones generadas en código
    if (lang === 'en' && i === 2) {
      // Planes de Sellado → generado en código con texto EN
      const planesPage = outputDoc.addPage([612, 792])
      drawPlanesSellado(planesPage, boldFont, regFont, logoImage, 'en')
    } else if (lang === 'en' && i === 6) {
      // ¿Por qué Windmar? → generado en código con texto EN
      const whyPage = outputDoc.addPage([612, 792])
      drawPorQueWindmar(whyPage, boldFont, regFont, logoImage, imgWorker, 'en')
    } else {
      const [p] = await outputDoc.copyPages(originalDoc, [i])
      outputDoc.addPage(p)
    }
  }

  const bytes = await outputDoc.save()
  downloadPDF(bytes, `Cotizacion-Roofing-${clean(cliente.nombre)}.pdf`)
}

// ══════════════════════════════════════════════════════════════
// PÁGINA: COTIZACIÓN (página dinámica generada)
// ══════════════════════════════════════════════════════════════
function drawCotizacionRoofing(
  page: any,
  { width, height }: { width: number; height: number },
  bold: any, reg: any,
  cliente: ClienteData,
  consultor: ConsultorData,
  resumen: RoofingResumen,
  logoImage: any = null,
  mapImage: any = null,
  showLocationDot: boolean = false,
) {
  const M     = 36
  const dataW = width - M * 2
  const lang  = resumen.idioma ?? 'es'
  const L     = LABELS[lang]

  rect(page, 0, 0, width, height, WHITE)

  // Header
  const headerH = 60
  rect(page, 0, height - headerH, width, headerH, NAVY)
  rect(page, 0, height - headerH - 8, width * 0.58, 8, ORANGE)
  text(page, 'WINDMAR', 22, M, height - 22, bold, WHITE)
  text(page, 'ENERGY by Qcells', 9, M, height - 38, reg, ORANGE)
  if (logoImage) {
    const lD = logoImage.scale(0.34)
    const lx = width - lD.width - 20
    const ly = height - headerH + Math.round((headerH - lD.height) / 2)
    page.drawImage(logoImage, { x: lx, y: ly, width: lD.width, height: lD.height })
  }

  // Título
  const cotTxt = lang === 'en' ? 'Quote' : 'Cotizacion'
  text(page, cotTxt, 22, M, height - headerH - 26, bold, BLUE)
  const today = new Date().toLocaleDateString('es-PR')

  // Bloque cliente / consultor
  const colW  = Math.round(width * 0.46)
  const col2X = M + colW + 10
  const col2W = width - col2X - M
  const cY    = height - headerH - 60

  text(page, clean(cliente.nombre),                                       11, M, cY,       bold, DARK)
  text(page, clean(cliente.direccion),                                     9, M, cY - 16,  reg,  GRAY)
  text(page, `${clean(cliente.ciudad)}, PR ${cliente.zipCode}`,           9, M, cY - 29,  reg,  GRAY)
  text(page, cliente.telefono,                                             9, M, cY - 42,  reg,  GRAY)
  text(page, clean(cliente.email),                                         9, M, cY - 55,  reg,  BLUE)

  const rowH  = 20
  const quoteNo = lang === 'en' ? 'Quote No.' : 'Cotizacion No.'
  const consultorLbl = lang === 'en' ? 'Consultant:' : 'Consultor:'
  const phoneLbl     = lang === 'en' ? 'Phone:'      : 'Telefono:'
  const emailLbl     = lang === 'en' ? 'Email:'      : 'Correo:'
  const tRows: [string, string][] = [
    [quoteNo,     `001   ${lang === 'en' ? 'Date' : 'Fecha'}: ${today}`],
    [consultorLbl, clean(consultor.nombre)],
    [phoneLbl,     consultor.telefono],
    [emailLbl,     clean(consultor.email)],
  ]
  const tTop = cY + 6
  tRows.forEach(([lbl, val], i) => {
    const ry = tTop - i * rowH
    if (i % 2 === 0) rect(page, col2X, ry - rowH + 5, col2W, rowH, LIGHT)
    text(page, lbl, 8, col2X + 5,  ry - 8, bold, BLUE)
    text(page, val, 8, col2X + 84, ry - 8, reg,  DARK)
  })
  page.drawRectangle({
    x: col2X, y: tTop - tRows.length * rowH - 2,
    width: col2W, height: tRows.length * rowH + rowH,
    borderColor: BORDER, borderWidth: 0.6,
  })

  // Separador
  const sep1Y = height - headerH - 148
  page.drawLine({ start: { x: M, y: sep1Y }, end: { x: width - M, y: sep1Y }, thickness: 0.5, color: BORDER })

  // Detalles del Techo + Mapa
  const secY = sep1Y - 16
  const detailTitle = lang === 'en' ? 'Roof Details' : 'Detalles del Techo'
  text(page, detailTitle, 13, M, secY, bold, BLUE)
  page.drawLine({ start: { x: M, y: secY - 5 }, end: { x: M + 130, y: secY - 5 }, thickness: 2, color: ORANGE })

  const leftW       = Math.round(dataW * 0.48)
  const areaLbl     = lang === 'en' ? 'Roof Area:'       : 'Area del Techo:'
  const removalLbl  = lang === 'en' ? 'Removal %:'       : 'Porcentaje de Remocion:'
  const prontolbl   = lang === 'en' ? 'Down Payment:'    : 'Pronto Pago:'
  const descLbl     = lang === 'en' ? 'Discounts:'       : 'Descuentos:'
  const detailRows: [string, string][] = [
    [areaLbl,    `${resumen.sqft.toLocaleString()} ft²`],
    [removalLbl, `${resumen.removalPct}%`],
    [prontolbl,  `$${resumen.pronto.toLocaleString()}`],
    [descLbl,    clean(resumen.descuentos)],
  ]
  let sy = secY - 26
  detailRows.forEach(([lbl, val], i) => {
    if (i % 2 === 0) rect(page, M, sy - 5, leftW, 18, LIGHT)
    text(page, lbl, 8, M + 6,             sy + 3, bold, BLUE)
    text(page, val, 8, M + leftW / 2 + 10, sy + 3, reg,  DARK)
    sy -= 22
  })

  // Mapa
  const mapX    = M + leftW + 14
  const mapColW = dataW - leftW - 14
  const mapTopY = secY - 4
  const mapBoxH = Math.round(mapColW / 1.5625)
  const mapBotY = mapTopY - mapBoxH
  const mapLbl  = lang === 'en' ? 'Roof Location' : 'Ubicacion del Techo'

  if (mapImage) {
    const scaleX = mapColW / mapImage.width
    const scaleY = mapBoxH / mapImage.height
    const s  = Math.max(scaleX, scaleY)
    const mW = mapImage.width  * s
    const mH = mapImage.height * s
    const mX = mapX + (mapColW - mW) / 2
    const mY = mapBotY + (mapBoxH - mH) / 2
    page.drawImage(mapImage, { x: mX, y: mY, width: mW, height: mH })
    page.drawRectangle({ x: mapX, y: mapBotY, width: mapColW, height: mapBoxH, borderColor: BORDER, borderWidth: 1.2 })
    if (showLocationDot) {
      const dotX = mapX + mapColW / 2
      const dotY = mapBotY + mapBoxH / 2
      page.drawEllipse({ x: dotX, y: dotY, xScale: 7, yScale: 7, color: rgb(0.9, 0.1, 0.1) })
      page.drawEllipse({ x: dotX, y: dotY, xScale: 3, yScale: 3, color: WHITE })
    }
    text(page, mapLbl, 6.5, mapX + 4, mapBotY - 10, bold, GRAY)
  } else {
    rect(page, mapX, mapBotY, mapColW, mapBoxH, LIGHT)
    const mapHint = lang === 'en' ? 'Enter coordinates to view map' : 'Ingresa coordenadas para ver el mapa'
    text(page, mapHint, 7, mapX + 8, mapBotY + mapBoxH / 2, reg, GRAY)
    text(page, mapLbl, 6.5, mapX + 4, mapBotY - 10, bold, GRAY)
  }

  // Separador 2
  const sectionBotY = Math.min(sy, mapBotY)
  const sep2Y = sectionBotY - 18
  page.drawLine({ start: { x: M, y: sep2Y }, end: { x: width - M, y: sep2Y }, thickness: 0.5, color: BORDER })

  // Opciones de Cotización
  const opcionesTitulo = lang === 'en' ? 'Quote Options' : 'Opciones de Cotizacion'
  let tableY = sep2Y - 16
  text(page, opcionesTitulo, 13, M, tableY, bold, BLUE)
  page.drawLine({ start: { x: M, y: tableY - 5 }, end: { x: M + 158, y: tableY - 5 }, thickness: 2, color: ORANGE })
  tableY -= 20

  const rH   = 15
  const mods = resumen.modalidades.length > 0 ? resumen.modalidades : ['cash']

  mods.forEach((mod, mIdx) => {
    if (mIdx > 0) tableY -= 8

    if (mod === 'cash') {
      const cashTitle = lang === 'en' ? 'CASH Modality  (10% discount)' : 'Modalidad CASH  (descuento 10%)'
      text(page, cashTitle, 9, M, tableY, bold, GREEN_CASH)
      tableY -= 20
      const c0 = M + 6, c1 = M + 108, c2 = M + 248, c3 = M + 368
      const hPlan    = lang === 'en' ? 'Plan'          : 'Plan'
      const hTotal   = lang === 'en' ? 'Total w/ Tax'  : 'Total con IVU'
      const hNoTax   = lang === 'en' ? 'Without Tax'   : 'Sin IVU'
      const hTax     = lang === 'en' ? 'Tax (11.5%)'   : 'IVU (11.5%)'
      rect(page, M, tableY - 2, dataW, rH, GREEN_CASH)
      text(page, hPlan,  7, c0, tableY + 4, bold, WHITE)
      text(page, hTotal, 7, c1, tableY + 4, bold, WHITE)
      text(page, hNoTax, 7, c2, tableY + 4, bold, WHITE)
      text(page, hTax,   7, c3, tableY + 4, bold, WHITE)
      tableY -= rH + 2
      resumen.planes.forEach((plan, i) => {
        const pc = plan.nombre === 'SILVER' ? SILVER_COLOR : plan.nombre === 'GOLD' ? GOLD_COLOR : PLAT_COLOR
        if (i % 2 === 0) rect(page, M, tableY - 2, dataW, rH, EMERALD_BG)
        rect(page, c0 - 2, tableY - 1, 52, 13, pc)
        text(page, plan.nombre,                7, c0 + 1, tableY + 4, bold, WHITE)
        text(page, `$${fmt(plan.cashTotal)}`,  8, c1,     tableY + 3, bold, GREEN_CASH)
        text(page, `$${fmt(plan.cashSinIvu)}`, 8, c2,     tableY + 3, reg,  DARK)
        text(page, `$${fmt(plan.cashIvu)}`,    8, c3,     tableY + 3, reg,  DARK)
        tableY -= rH + 2
      })
    }

    if (mod === 'wh_financial') {
      const whTitle = lang === 'en' ? 'WH Financial Modality' : 'Modalidad WH Financial'
      text(page, whTitle, 9, M, tableY, bold, BLUE)
      tableY -= 20
      const c0 = M + 4, c1 = M + 68, c2 = M + 160, c3 = M + 252, c4 = M + 352, c5 = M + 452
      const h5   = lang === 'en' ? '5 Yrs (5.99%)'  : '5 Anos (5.99%)'
      const h7   = lang === 'en' ? '7 Yrs (7.99%)'  : '7 Anos (7.99%)'
      const h10  = lang === 'en' ? '10 Yrs (9.99%)' : '10 Anos (9.99%)'
      const hVal = lang === 'en' ? 'With Tax'        : 'Valor con IVU'
      const hPre = lang === 'en' ? 'Before Tax'      : 'Antes de IVU'
      rect(page, M, tableY - 2, dataW, rH, NAVY)
      text(page, 'Plan', 6, c0, tableY + 4, bold, WHITE)
      text(page, h5,     6, c1, tableY + 4, bold, WHITE)
      text(page, h7,     6, c2, tableY + 4, bold, WHITE)
      text(page, h10,    6, c3, tableY + 4, bold, WHITE)
      text(page, hVal,   6, c4, tableY + 4, bold, WHITE)
      text(page, hPre,   6, c5, tableY + 4, bold, WHITE)
      tableY -= rH + 2
      resumen.planes.forEach((plan, i) => {
        const pc = plan.nombre === 'SILVER' ? SILVER_COLOR : plan.nombre === 'GOLD' ? GOLD_COLOR : PLAT_COLOR
        if (i % 2 === 0) rect(page, M, tableY - 2, dataW, rH, LIGHT)
        rect(page, c0 - 2, tableY - 1, 52, 13, pc)
        text(page, plan.nombre,                   7, c0 + 1, tableY + 4, bold, WHITE)
        text(page, `$${fmt(plan.mensual5)}`,       7, c1,     tableY + 3, reg,  DARK)
        text(page, `$${fmt(plan.mensual7)}`,       7, c2,     tableY + 3, reg,  DARK)
        text(page, `$${fmt(plan.mensual10)}`,      7, c3,     tableY + 3, bold, DARK)
        text(page, `$${fmt(plan.valorConIvu)}`,    7, c4,     tableY + 3, bold, DARK)
        text(page, `$${fmt(plan.valorAntesIvu)}`,  7, c5,     tableY + 3, reg,  DARK)
        tableY -= rH + 2
      })
    }

    if (mod === 'home_depot') {
      const hdTitle = lang === 'en' ? 'Home Depot Modality' : 'Modalidad Home Depot'
      text(page, hdTitle, 9, M, tableY, bold, BLUE)
      tableY -= 20
      const c0 = M + 6, c1 = M + 128, c2 = M + 340
      const hVal = lang === 'en' ? 'Value with Tax'    : 'Valor con IVU'
      const hPre = lang === 'en' ? 'Value before Tax'  : 'Valor antes de IVU'
      rect(page, M, tableY - 2, dataW, rH, HD_GRAY)
      text(page, 'Plan', 7, c0, tableY + 4, bold, WHITE)
      text(page, hVal,   7, c1, tableY + 4, bold, WHITE)
      text(page, hPre,   7, c2, tableY + 4, bold, WHITE)
      tableY -= rH + 2
      resumen.planes.forEach((plan, i) => {
        const pc = plan.nombre === 'SILVER' ? SILVER_COLOR : plan.nombre === 'GOLD' ? GOLD_COLOR : PLAT_COLOR
        if (i % 2 === 0) rect(page, M, tableY - 2, dataW, rH, LIGHT)
        rect(page, c0 - 2, tableY - 1, 52, 13, pc)
        text(page, plan.nombre,                    7, c0 + 1, tableY + 4, bold, WHITE)
        text(page, `$${fmt(plan.valorConIvu)}`,    8, c1,     tableY + 3, bold, DARK)
        text(page, `$${fmt(plan.valorAntesIvu)}`,  8, c2,     tableY + 3, reg,  DARK)
        tableY -= rH + 2
      })
    }
  })

  const noteText = lang === 'en'
    ? '* Monthly payments are estimates subject to credit approval. Prices include tax.'
    : '* Mensualidades estimadas sujetas a aprobacion de credito. Precios incluyen IVU.'
  text(page, noteText, 7, M + 4, tableY, reg, GRAY)
  tableY -= 18

  // CTA
  if (tableY > 220) {
    const ctaLine1 = lang === 'en' ? 'Protect your home with the best sealing technology.' : 'Protege tu hogar con la mejor tecnologia de sellado.'
    const ctaLine2 = lang === 'en' ? 'Warranty. Quality. Trust.'                            : 'Garantia. Calidad. Confianza.'
    text(page, ctaLine1, 12, M, tableY,      reg,  BLUE)
    text(page, ctaLine2, 14, M, tableY - 18, bold, NAVY)
    const bY = tableY - 44
    rect(page, M, bY - 5, 140, 22, NAVY)
    text(page, 'WINDMAR ROOFING PRO', 7, M + 6, bY + 5, bold, WHITE)
    const benY  = tableY - 78
    const benW  = dataW / 3
    const bens  = lang === 'en'
      ? ['Certified installation', 'Warranty up to 10 years', '24/7 Support']
      : ['Instalacion certificada',  'Garantia hasta 10 anos',  'Soporte 24/7']
    bens.forEach((b, i) => {
      text(page, b, 8, M + 4 + i * benW, benY, i === 2 ? bold : reg, i === 2 ? NAVY : GRAY)
      if (i < 2) page.drawLine({
        start: { x: M + (i + 1) * benW, y: benY + 12 },
        end:   { x: M + (i + 1) * benW, y: benY - 8 },
        thickness: 0.5, color: GRAY,
      })
    })
  }

  // Footer
  drawFooter(page, width, logoImage, bold, reg, lang)
}

// ══════════════════════════════════════════════════════════════
// PÁGINA: PLANES DE SELLADO (recreación completa)
// ══════════════════════════════════════════════════════════════
function drawPlanesSellado(
  page: any,
  bold: any, reg: any,
  logoImage: any,
  lang: 'es' | 'en',
) {
  const W = 612, H = 792
  const M = 28
  const L = LABELS[lang]

  rect(page, 0, 0, W, H, WHITE)

  // ── Footer (base, para estar debajo de todo) ──
  drawFooter(page, W, logoImage, bold, reg, lang)

  // ── Logo + "WINDMAR ROOFING" arriba izquierda ──
  if (logoImage) {
    const d = logoImage.scale(0.20)
    page.drawImage(logoImage, { x: M, y: H - d.height - 8, width: d.width, height: d.height })
  }
  text(page, 'windmar', 10, M,      H - 22, bold, NAVY)
  text(page, 'ROOFING', 7,  M,      H - 32, reg,  ORANGE)

  // ── Título principal ──
  text(page, L.planesTitulo,    14, M, H - 56, reg,  NAVY)
  text(page, L.planesSubtitulo, 32, M, H - 92, bold, NAVY)
  page.drawLine({ start: { x: M, y: H - 95 }, end: { x: M + 160, y: H - 95 }, thickness: 2.5, color: ORANGE })

  // ── Columnas Silver / Gold / Platinum ──────────────────────
  const labelColW = 130
  const dataColW  = (W - M * 2 - labelColW) / 3
  const col1x = M + labelColW + dataColW * 0 + dataColW / 2
  const col2x = M + labelColW + dataColW * 1 + dataColW / 2
  const col3x = M + labelColW + dataColW * 2 + dataColW / 2
  const badgeCy = H - 135
  const badgeR  = 30

  // Silver
  page.drawEllipse({ x: col1x, y: badgeCy, xScale: badgeR, yScale: badgeR, color: SILVER_COLOR })
  page.drawEllipse({ x: col1x, y: badgeCy, xScale: badgeR - 2, yScale: badgeR - 2, color: rgb(0.88, 0.88, 0.88) })
  text(page, 'Silver', 10, col1x - 14, badgeCy - 4, bold, WHITE)

  // Gold
  page.drawEllipse({ x: col2x, y: badgeCy, xScale: badgeR, yScale: badgeR, color: GOLD_COLOR })
  page.drawEllipse({ x: col2x, y: badgeCy, xScale: badgeR - 2, yScale: badgeR - 2, color: rgb(0.98, 0.75, 0.25) })
  text(page, 'Gold', 10, col2x - 11, badgeCy - 4, bold, WHITE)

  // Platinum
  page.drawEllipse({ x: col3x, y: badgeCy, xScale: badgeR, yScale: badgeR, color: PLAT_COLOR })
  page.drawEllipse({ x: col3x, y: badgeCy, xScale: badgeR - 2, yScale: badgeR - 2, color: rgb(0.12, 0.20, 0.42) })
  text(page, 'Platinum', 8.5, col3x - 19, badgeCy - 4, bold, WHITE)

  // Nombres debajo del badge
  text(page, 'Silver',   9, col1x - 13, badgeCy - badgeR - 7, bold, SILVER_COLOR)
  text(page, 'Gold',     9, col2x - 10, badgeCy - badgeR - 7, bold, GOLD_COLOR)
  text(page, 'Platinum', 9, col3x - 19, badgeCy - badgeR - 7, bold, PLAT_COLOR)

  // ── Tabla de planes ────────────────────────────────────────
  const tableStartY = H - 186
  const rowDefs = [
    {
      label: L.fab,
      cells: [L.limitada, L.limitada, L.limitada],
      bold: true,
    },
    {
      label: L.obra,
      cells: [L.year1, L.years10, L.years10],
      bold: false,
    },
    {
      label: L.mant,
      cells: [L.price600, L.price600, L.platMant],
      bold: false,
    },
  ]

  // Header de la tabla
  rect(page, M, tableStartY, W - M * 2, 16, NAVY)
  text(page, lang === 'en' ? 'Feature'  : 'Caracteristica', 7.5, M + 6, tableStartY + 4, bold, WHITE)
  text(page, 'Silver',   7.5, col1x - 12, tableStartY + 4, bold, WHITE)
  text(page, 'Gold',     7.5, col2x - 9,  tableStartY + 4, bold, WHITE)
  text(page, 'Platinum', 7.5, col3x - 17, tableStartY + 4, bold, WHITE)

  let ry = tableStartY - 1
  rowDefs.forEach((row, ri) => {
    const rowH = 48
    const bg   = ri % 2 === 0 ? LIGHT_GRAY : WHITE
    rect(page, M, ry - rowH, W - M * 2, rowH, bg)

    // Label col (navy bg, white text)
    rect(page, M, ry - rowH, labelColW, rowH, NAVY)
    const llines = row.label.split('\n')
    const lY0    = ry - 14
    llines.forEach((ln, li) => text(page, ln, 7.5, M + 5, lY0 - li * 11, bold, WHITE))

    // Celdas de datos
    row.cells.forEach((cell, ci) => {
      const cx   = M + labelColW + ci * dataColW + 6
      const clines = cell.split('\n')
      const cY0  = ry - 14
      const cBold = ri === 0 ? bold : reg
      clines.forEach((ln, li) => text(page, ln, 7.5, cx, cY0 - li * 10, cBold, DARK))
    })

    // Borde inferior de fila
    page.drawLine({
      start: { x: M, y: ry - rowH },
      end:   { x: W - M, y: ry - rowH },
      thickness: 0.5, color: MID_GRAY,
    })
    ry -= rowH
  })

  // Borde exterior tabla
  page.drawRectangle({
    x: M, y: ry, width: W - M * 2, height: tableStartY - ry + 16,
    borderColor: MID_GRAY, borderWidth: 0.8,
  })

  // ── Notas al pie ─────────────────────────────────────────────
  const fnY = ry - 8
  text(page, L.fn1, 5.5, M, fnY,       reg, GRAY)
  text(page, L.fn2, 5.5, M, fnY - 12,  reg, GRAY)
  text(page, L.fn3, 5.5, M, fnY - 22,  reg, GRAY)

  // ── Barra VENTAJAS / ADVANTAGES ──────────────────────────────
  const ventBarY = fnY - 42
  rect(page, 0, ventBarY, W, 26, NAVY)
  text(page, L.ventTitle, 14, M, ventBarY + 7, bold, WHITE)

  // ── Grid de íconos (4 col × 3 filas) ────────────────────────
  const iconAreaTop = ventBarY - 4
  const iconCols = 4, iconRows = 3
  const iColW  = (W - M * 2) / iconCols
  const iRowH  = (iconAreaTop - 28) / iconRows   // 28 = footer height

  L.icons.forEach((iconLines, idx) => {
    const col  = idx % iconCols
    const row  = Math.floor(idx / iconCols)
    const icx  = M + col * iColW + iColW / 2
    const icy  = iconAreaTop - row * iRowH - iRowH * 0.28

    // Círculo del ícono
    page.drawEllipse({ x: icx, y: icy, xScale: 20, yScale: 20, color: ICON_BG })
    page.drawEllipse({ x: icx, y: icy, xScale: 20, yScale: 20, color: undefined,
      borderColor: BLUE, borderWidth: 1.2 })

    // Símbolo sencillo dentro del círculo
    const symbols = ['◷', '◈', '◉', '⊛', '⊞', '◎', '⚙', '⚡', '🔥', '★', '♻', '✓']
    try {
      text(page, symbols[idx] ?? '●', 9, icx - 4, icy - 4, reg, BLUE)
    } catch { text(page, '●', 9, icx - 4, icy - 4, reg, BLUE) }

    // Etiqueta debajo del ícono
    iconLines.forEach((ln, li) => {
      const lnW = ln.length * 3.5   // aprox ancho
      text(page, ln, 6, icx - lnW / 2, icy - 24 - li * 8.5, reg, NAVY)
    })
  })
}

// ══════════════════════════════════════════════════════════════
// PÁGINA: ¿POR QUÉ WINDMAR? (texto largo con bullets)
// ══════════════════════════════════════════════════════════════
function drawPorQueWindmar(
  page: any,
  bold: any, reg: any,
  logoImage: any,
  workerImage: any,
  lang: 'es' | 'en',
) {
  const W = 612, H = 792
  const M = 40
  const L = LABELS[lang]

  rect(page, 0, 0, W, H, WHITE)

  // Header NAVY
  rect(page, 0, H - 55, W, 55, NAVY)
  rect(page, 0, H - 63, W * 0.6, 8, ORANGE)
  text(page, 'WINDMAR', 18, M, H - 22, bold, WHITE)
  text(page, 'ROOFING', 10, M, H - 36, reg, ORANGE)
  if (logoImage) {
    const d = logoImage.scale(0.30)
    page.drawImage(logoImage, { x: W - d.width - 20, y: H - 55 + (55 - d.height) / 2, width: d.width, height: d.height })
  }

  // Imagen del trabajador (mitad derecha)
  if (workerImage) {
    const imgX = W / 2 + 10
    const imgW = W / 2 - M / 2
    const imgH = Math.round(imgW / (workerImage.width / workerImage.height))
    const imgY = H - 55 - imgH - 10
    page.drawImage(workerImage, { x: imgX, y: imgY, width: imgW, height: imgH })
  }

  // Barra decorativa lateral izquierda
  rect(page, 0, 0, 6, H, ORANGE)

  // ── Sección #1 EXPERIENCIA ──────────────────────────────────
  let sy = H - 85

  // Número grande "#1"
  text(page, '#', 22, M, sy, bold, ORANGE)
  text(page, '1', 28, M + 16, sy, bold, ORANGE)
  text(page, L.exp1Title.replace('#1 ', ''), 15, M + 48, sy, bold, NAVY)
  page.drawLine({ start: { x: M, y: sy - 5 }, end: { x: M + 220, y: sy - 5 }, thickness: 1.5, color: ORANGE })
  sy -= 22

  // Párrafos
  L.exp1Body.forEach(line => {
    if (line === '') { sy -= 6; return }
    text(page, line, 8.5, M, sy, reg, DARK)
    sy -= 12
  })
  sy -= 8

  // Bullets
  L.exp1Bullets.forEach(bullet => {
    text(page, '•', 10, M, sy, bold, ORANGE)
    // Wrap texto del bullet
    const words = bullet.split(' ')
    let line = '', lx = M + 14, lineY = sy
    words.forEach(w => {
      const test = line ? line + ' ' + w : w
      if (test.length * 4.8 > W / 2 - lx) {
        text(page, line, 8, lx, lineY, reg, DARK)
        lineY -= 11; line = w
      } else { line = test }
    })
    if (line) text(page, line, 8, lx, lineY, reg, DARK)
    sy = lineY - 16
  })

  sy -= 10

  // ── Sección #1 SERVICIO ─────────────────────────────────────
  text(page, '#', 22, M, sy, bold, BLUE)
  text(page, '1', 28, M + 16, sy, bold, BLUE)
  text(page, L.serv1Title.replace('#1 ', ''), 15, M + 48, sy, bold, NAVY)
  page.drawLine({ start: { x: M, y: sy - 5 }, end: { x: M + 220, y: sy - 5 }, thickness: 1.5, color: ORANGE })
  sy -= 22

  L.serv1Body.forEach(line => {
    if (line === '') { sy -= 6; return }
    text(page, line, 8.5, M, sy, reg, DARK)
    sy -= 12
  })
  sy -= 8

  L.serv1Bullets.forEach(bullet => {
    text(page, '•', 10, M, sy, bold, BLUE)
    text(page, bullet, 8, M + 14, sy, reg, DARK)
    sy -= 14
  })

  // Footer
  drawFooter(page, W, logoImage, bold, reg, lang)
}

// ══════════════════════════════════════════════════════════════
// FOOTER compartido
// ══════════════════════════════════════════════════════════════
function drawFooter(page: any, W: number, logoImage: any, bold: any, reg: any, lang: 'es' | 'en') {
  const footerH = 26
  rect(page, 0, 0, W, footerH, NAVY)

  const divX = [145, 280, 450]
  divX.forEach(x => page.drawLine({
    start: { x, y: footerH - 4 }, end: { x, y: 4 },
    thickness: 0.5, color: rgb(0.5, 0.5, 0.7),
  }))

  // Íconos simples (teléfono, web, redes, email)
  text(page, '📞', 7,  14,  10, reg, WHITE)
  text(page, '787.395.7766',           7, 26,  10, reg, rgb(0.85, 0.85, 0.95))
  text(page, '🌐', 7,  152, 10, reg, WHITE)
  text(page, 'windmar.com',            7, 164, 10, reg, rgb(0.85, 0.85, 0.95))
  text(page, 'f',  7,  288, 10, bold, rgb(0.85, 0.85, 0.95))
  text(page, 'facebook.com/WindMarHome', 7, 298, 10, reg, rgb(0.85, 0.85, 0.95))
  text(page, '@',  7,  458, 10, bold, rgb(0.85, 0.85, 0.95))
  text(page, 'ventas@windmarhome.com', 7, 468, 10, reg, rgb(0.85, 0.85, 0.95))
}

// ── helpers ───────────────────────────────────────────────────
function rect(page: any, x: number, y: number, w: number, h: number, color: any) {
  page.drawRectangle({ x, y, width: w, height: h, color })
}
function text(page: any, t: string, size: number, x: number, y: number, font: any, color: any) {
  try { page.drawText(t, { x, y, size, font, color }) } catch { }
}
function clean(s: string): string {
  return s
    .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/[ÁÀÄ]/g, 'A').replace(/[ÉÈË]/g, 'E')
    .replace(/[ÍÌÏ]/g, 'I').replace(/[ÓÒÖ]/g, 'O')
    .replace(/[ÚÙÜ]/g, 'U').replace(/Ñ/g, 'N')
}
function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}
function range(from: number, to: number) {
  return Array.from({ length: to - from }, (_, i) => i + from)
}
function downloadPDF(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
