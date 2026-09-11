import { NextResponse } from 'next/server'
import { formatAnswersAsText } from '../../lib/fields'
import { isMailerConfigured, sendInvestorEmail } from '../../lib/mailer'

export const runtime = 'nodejs'

// Límite de envíos por IP: mejor esfuerzo. En un entorno serverless (Vercel)
// este contador vive solo en memoria y se reinicia en cada cold start, así
// que no es un límite duro — es una defensa razonable combinada con el
// honeypot, no una protección fuerte contra alguien decidido.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const hits = new Map()

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(req) {
  try {
    const ip = getClientIp(req)
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Demasiados envíos desde esta conexión. Inténtelo más tarde.' }, { status: 429 })
    }

    const body = await req.json()

    // Campo trampa: si un bot lo rellena, respondemos como si todo hubiera ido bien.
    if (body.pagina_web) return NextResponse.json({ ok: true })

    if (!isMailerConfigured()) {
      console.error('GMAIL_USER / GMAIL_APP_PASSWORD no configurados.')
      return NextResponse.json({ error: 'El servicio de correo aún no está configurado.' }, { status: 503 })
    }

    const texto = formatAnswersAsText(body)
    const contexto = [
      `Origen: ${body.origen || 'NO CONSTA'}`,
      `Enviado por: ${body.enviado_por || 'NO CONSTA'}`,
      `Consentimiento aceptado: ${body.consentimiento_aceptado ? 'SÍ' : 'NO'}`,
      `Fecha de consentimiento: ${body.consentimiento_fecha || 'NO CONSTA'}`,
    ].join('\n')

    const nombre = body.nombre_completo && String(body.nombre_completo).trim() ? body.nombre_completo : 'NO CONSTA'

    await sendInvestorEmail({
      subject: `Nueva alta de inversor — ${nombre}`,
      text: `${texto}\n\n${contexto}`,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno al procesar el formulario.' }, { status: 500 })
  }
}
