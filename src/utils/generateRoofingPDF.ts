import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { ClienteData, ConsultorData } from '../components/PDFModal'

// ── colores Windmar ────────────────────────────────────────────
const NAVY   = rgb(0.051, 0.125, 0.314)
const BLUE   = rgb(0.102, 0.337, 0.769)
const ORANGE = rgb(0.973, 0.608, 0.141)
const WHITE  = rgb(1, 1, 1)
const LIGHT  = rgb(0.918, 0.953, 1.0)
const GRAY   = rgb(0.4, 0.4, 0.4)
const DARK   = rgb(0.1, 0.1, 0.1)
const BORDER = rgb(0.773, 0.831, 0.937)

const SILVER_COLOR = rgb(0.72, 0.72, 0.72)
const GOLD_COLOR   = rgb(0.949, 0.620, 0.122)
const PLAT_COLOR   = rgb(0.40, 0.40, 0.45)

export interface RoofingResumen {
  sqft: number
  removalPct: number
  pronto: number
  descuentos: string
  planes: {
    nombre: string   // 'SILVER' | 'GOLD' | 'PLATINUM'
    mensual5: number
    mensual7: number
    mensual10: number
    cashTotal: number
    financiado: number
  }[]
}

export async function generateRoofingPDF(
  cliente: ClienteData,
  consultor: ConsultorData,
  resumen: RoofingResumen,
  mapImageBytes?: Uint8Array | null,
) {
  const res = await fetch('/roofing-modelo.pdf')
  if (!res.ok) throw new Error('No se pudo cargar el PDF modelo')
  const originalBytes = await res.arrayBuffer()
  const originalDoc   = await PDFDocument.load(originalBytes)

  const outputDoc = await PDFDocument.create()
  const boldFont  = await outputDoc.embedFont(StandardFonts.HelveticaBold)
  const regFont   = await outputDoc.embedFont(StandardFonts.Helvetica)

  const INSERT_AT = 1  // página 2
  const totalOrig = originalDoc.getPages().length

  if (INSERT_AT > 0) {
    const before = await outputDoc.copyPages(originalDoc, range(0, INSERT_AT))
    before.forEach(p => outputDoc.addPage(p))
  }

  // Logo Windmar
  let logoImage: any = null
  try {
    const logoRes = await fetch('https://i.postimg.cc/6T5J2v2G/logo.png')
    if (logoRes.ok) {
      const logoBytes = await logoRes.arrayBuffer()
      logoImage = await outputDoc.embedPng(logoBytes)
    }
  } catch { }

  // Imagen del mapa
  let mapImage: any = null
  if (mapImageBytes) {
    try {
      mapImage = await outputDoc.embedPng(mapImageBytes)
    } catch { }
  }

  const { width, height } = originalDoc.getPages()[0].getSize()
  const newPage = outputDoc.addPage([width, height])
  drawCotizacionRoofing(newPage, { width, height }, boldFont, regFont,
    cliente, consultor, resumen, logoImage, mapImage)

  if (INSERT_AT < totalOrig) {
    const after = await outputDoc.copyPages(originalDoc, range(INSERT_AT, totalOrig))
    after.forEach(p => outputDoc.addPage(p))
  }

  const bytes = await outputDoc.save()
  downloadPDF(bytes, `Cotizacion-Roofing-${clean(cliente.nombre)}.pdf`)
}

function drawCotizacionRoofing(
  page: any,
  { width, height }: { width: number; height: number },
  bold: any,
  reg: any,
  cliente: ClienteData,
  consultor: ConsultorData,
  resumen: RoofingResumen,
  logoImage: any = null,
  mapImage: any = null,
) {
  const M     = 36
  const dataW = width - M * 2

  rect(page, 0, 0, width, height, WHITE)

  // ── Header ──
  const headerH = 60
  rect(page, 0, height - headerH, width, headerH, NAVY)
  rect(page, 0, height - headerH - 8, width * 0.58, 8, ORANGE)

  text(page, 'WINDMAR', 22, M, height - 22, bold, WHITE)
  text(page, 'ENERGY by Qcells', 9, M, height - 38, reg, ORANGE)

  if (logoImage) {
    const lDims = logoImage.scale(0.70)
    const lx    = width - lDims.width - 20
    const ly    = height - headerH + Math.round((headerH - lDims.height) / 2)
    page.drawImage(logoImage, { x: lx, y: ly, width: lDims.width, height: lDims.height })
  }

  // ── Título ──
  text(page, 'Cotizacion', 22, M, height - headerH - 26, bold, BLUE)

  const today = new Date().toLocaleDateString('es-PR')

  // ── Bloque cliente / consultor ──
  const colW  = Math.round(width * 0.46)
  const col2X = M + colW + 10
  const col2W = width - col2X - M

  const cY = height - headerH - 60
  text(page, clean(cliente.nombre),    11, M, cY,       bold, DARK)
  text(page, clean(cliente.direccion),   9, M, cY - 16, reg,  GRAY)
  text(page, `${clean(cliente.ciudad)}, PR ${cliente.zipCode}`, 9, M, cY - 29, reg, GRAY)
  text(page, cliente.telefono,           9, M, cY - 42, reg,  GRAY)
  text(page, clean(cliente.email),       9, M, cY - 55, reg,  BLUE)

  const rowH = 20
  const tRows: [string, string][] = [
    ['Cotizacion No.', `001   Fecha: ${today}`],
    ['Consultor:', clean(consultor.nombre)],
    ['Telefono:', consultor.telefono],
    ['Correo:', clean(consultor.email)],
  ]
  const tTop = cY + 6
  tRows.forEach(([lbl, val], i) => {
    const ry = tTop - i * rowH
    if (i % 2 === 0) rect(page, col2X, ry - rowH + 5, col2W, rowH, LIGHT)
    text(page, lbl, 8, col2X + 5, ry - 8, bold, BLUE)
    text(page, val, 8, col2X + 84, ry - 8, reg,  DARK)
  })
  page.drawRectangle({
    x: col2X, y: tTop - tRows.length * rowH - 2,
    width: col2W, height: tRows.length * rowH + rowH,
    borderColor: BORDER, borderWidth: 0.6,
  })

  // ── Separador ──
  const sep1Y = height - headerH - 148
  page.drawLine({ start: { x: M, y: sep1Y }, end: { x: width - M, y: sep1Y }, thickness: 0.5, color: BORDER })

  // ── Sección: Detalles del Techo (izquierda) + Mapa (derecha) ──
  const secY = sep1Y - 16
  text(page, 'Detalles del Techo', 13, M, secY, bold, BLUE)
  page.drawLine({
    start: { x: M, y: secY - 5 },
    end:   { x: M + 130, y: secY - 5 },
    thickness: 2, color: ORANGE,
  })

  // Columna izquierda: datos del techo
  const leftW = Math.round(dataW * 0.48)
  const detailRows: [string, string][] = [
    ['Area del Techo:', `${resumen.sqft.toLocaleString()} ft²`],
    ['Porcentaje de Remocion:', `${resumen.removalPct}%`],
    ['Pronto Pago:', `$${resumen.pronto.toLocaleString()}`],
    ['Descuentos:', clean(resumen.descuentos)],
  ]
  let sy = secY - 26
  detailRows.forEach(([lbl, val], i) => {
    if (i % 2 === 0) rect(page, M, sy - 5, leftW, 18, LIGHT)
    text(page, lbl, 8, M + 6, sy + 3, bold, BLUE)
    text(page, val, 8, M + leftW / 2 + 10, sy + 3, reg, DARK)
    sy -= 22
  })

  // Columna derecha: mapa
  const mapX = M + leftW + 14
  const mapColW = dataW - leftW - 14
  const mapTopY = secY - 4
  const mapBoxH = detailRows.length * 22 + 4  // mismo alto que las filas

  if (mapImage) {
    // Escalar manteniendo proporcion dentro del box
    const maxW = mapColW
    const maxH = mapBoxH
    const scaleX = maxW / mapImage.width
    const scaleY = maxH / mapImage.height
    const s = Math.min(scaleX, scaleY)
    const mW = mapImage.width * s
    const mH = mapImage.height * s
    const mX = mapX + (maxW - mW) / 2
    const mY = mapTopY - maxH + (maxH - mH) / 2

    // Borde del mapa
    page.drawRectangle({
      x: mapX - 1, y: mapTopY - mapBoxH - 1,
      width: mapColW + 2, height: mapBoxH + 2,
      borderColor: BORDER, borderWidth: 1,
    })
    page.drawImage(mapImage, { x: mX, y: mY, width: mW, height: mH })

    // Etiqueta "Ubicacion del Techo"
    text(page, 'Ubicacion del Techo', 6.5, mapX + 4, mapTopY - mapBoxH - 10, bold, GRAY)
  } else {
    // Placeholder si no hay mapa
    rect(page, mapX, mapTopY - mapBoxH, mapColW, mapBoxH, LIGHT)
    text(page, 'Mapa no disponible', 8, mapX + 10, mapTopY - mapBoxH / 2, reg, GRAY)
  }

  // ── Separador ──
  const sep2Y = sy - 12
  page.drawLine({ start: { x: M, y: sep2Y }, end: { x: width - M, y: sep2Y }, thickness: 0.5, color: BORDER })

  // ── Sección: Planes de Sellado ──
  let tableY = sep2Y - 16
  text(page, 'Planes de Sellado', 13, M, tableY, bold, BLUE)
  page.drawLine({
    start: { x: M, y: tableY - 5 },
    end:   { x: M + 126, y: tableY - 5 },
    thickness: 2, color: ORANGE,
  })
  tableY -= 20

  // Cabecera de tabla
  const c0 = M + 6       // Plan
  const c1 = M + 90      // 5 Años
  const c2 = M + 200     // 7 Años
  const c3 = M + 310     // 10 Años
  const c4 = M + 420     // Cash

  rect(page, M, tableY - 4, dataW, 18, NAVY)
  text(page, 'Plan',             7.5, c0, tableY + 3, bold, WHITE)
  text(page, '5 Anos (5.99%)',   7.5, c1, tableY + 3, bold, WHITE)
  text(page, '7 Anos (7.99%)',   7.5, c2, tableY + 3, bold, WHITE)
  text(page, '10 Anos (9.99%)',  7.5, c3, tableY + 3, bold, WHITE)
  text(page, 'Cash (10% desc)',  7.5, c4, tableY + 3, bold, WHITE)
  tableY -= 22

  resumen.planes.forEach((plan, i) => {
    const planColor = plan.nombre === 'SILVER' ? SILVER_COLOR
      : plan.nombre === 'GOLD' ? GOLD_COLOR : PLAT_COLOR

    if (i % 2 === 0) rect(page, M, tableY - 4, dataW, 18, LIGHT)

    // Badge de color por plan
    rect(page, c0 - 2, tableY - 2, 52, 14, planColor)
    text(page, plan.nombre, 7, c0 + 1, tableY + 4, bold, WHITE)

    text(page, `$${fmt(plan.mensual5)}`,  8, c1, tableY + 3, reg, DARK)
    text(page, `$${fmt(plan.mensual7)}`,  8, c2, tableY + 3, reg, DARK)
    text(page, `$${fmt(plan.mensual10)}`, 8, c3, tableY + 3, bold, DARK)
    text(page, `$${fmt(plan.cashTotal)}`, 8, c4, tableY + 3, bold, DARK)
    tableY -= 22
  })

  text(page, '* Mensualidades estimadas sujetas a aprobacion de credito. Precios incluyen IVU.', 7, M + 4, tableY, reg, GRAY)
  tableY -= 20

  // ── CTA ──
  text(page, 'Protege tu hogar con la mejor tecnologia de sellado.', 12, M, tableY, reg, BLUE)
  text(page, 'Garantia. Calidad. Confianza.', 14, M, tableY - 18, bold, NAVY)

  const bY = tableY - 44
  rect(page, M, bY - 5, 110, 22, NAVY)
  text(page, 'WINDMAR ROOFING PRO', 7, M + 6, bY + 5, bold, WHITE)

  const benY = tableY - 78
  const benW = dataW / 3
  const bens = ['Instalacion certificada', 'Garantia hasta 10 anos', 'Soporte 24/7']
  bens.forEach((b, i) => {
    text(page, b, 8, M + 4 + i * benW, benY, i === 2 ? bold : reg, i === 2 ? NAVY : GRAY)
    if (i < 2) page.drawLine({
      start: { x: M + (i + 1) * benW, y: benY + 12 },
      end:   { x: M + (i + 1) * benW, y: benY - 8 },
      thickness: 0.5, color: GRAY,
    })
  })

  // ── Footer ──
  const footerH = 104
  rect(page, 0, 0, width, footerH, NAVY)
  rect(page, 0, footerH - 3, width, 3, ORANGE)
  rect(page, 0, 0, 4, footerH, ORANGE)

  if (logoImage) {
    const fD = logoImage.scale(0.28)
    const fY = Math.round((footerH - fD.height) / 2)
    page.drawImage(logoImage, { x: 14, y: fY, width: fD.width, height: fD.height })
  }

  page.drawLine({ start: { x: 230, y: 92 }, end: { x: 230, y: 12 }, thickness: 0.5, color: rgb(0.5, 0.5, 0.7) })
  text(page, 'Contactanos', 7, 242, 78, bold, WHITE)
  text(page, 'ventas@windmarhome.com', 7, 242, 60, reg, rgb(0.8, 0.8, 0.9))
  text(page, '(787) 395-7766', 7, 242, 44, reg, rgb(0.8, 0.8, 0.9))

  page.drawLine({ start: { x: 390, y: 92 }, end: { x: 390, y: 12 }, thickness: 0.5, color: rgb(0.5, 0.5, 0.7) })
  text(page, 'Direccion', 7, 402, 78, bold, WHITE)
  text(page, '1255 Avenida F.D. Roosevelt,', 7, 402, 60, reg, rgb(0.8, 0.8, 0.9))
  text(page, 'San Juan, 00920, Puerto Rico.', 7, 402, 44, reg, rgb(0.8, 0.8, 0.9))
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
    .replace(/[úùü]/g, 'u').replace(/[ñ]/g, 'n')
    .replace(/[ÁÀÄ]/g, 'A').replace(/[ÉÈË]/g, 'E')
    .replace(/[ÍÌÏ]/g, 'I').replace(/[ÓÒÖ]/g, 'O')
    .replace(/[ÚÙÜ]/g, 'U').replace(/[Ñ]/g, 'N')
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
