import { NextResponse } from 'next/server'
import { formatAnswersAsText } from '../../lib/fields'

export const runtime = 'nodejs'

// Paso 1 (local): todavía no se envía el email por Resend, solo se registra
// en consola el payload ya formateado, para validar el wizard de principio a
// fin sin depender de credenciales de email. El envío real llega en el paso 2.
export async function POST(req) {
  try {
    const body = await req.json()

    // Campo trampa: si un bot lo rellena, respondemos como si todo hubiera ido bien.
    if (body.pagina_web) return NextResponse.json({ ok: true })

    const texto = formatAnswersAsText(body)

    console.log('--- Nueva alta de inversor (modo local, sin enviar email) ---')
    console.log(texto)
    console.log(`Origen: ${body.origen || 'NO CONSTA'}`)
    console.log(`Enviado por: ${body.enviado_por || 'NO CONSTA'}`)
    console.log(`Consentimiento aceptado: ${body.consentimiento_aceptado ? 'SÍ' : 'NO'}`)
    console.log(`Fecha de consentimiento: ${body.consentimiento_fecha || 'NO CONSTA'}`)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error interno al procesar el formulario.' }, { status: 500 })
  }
}
