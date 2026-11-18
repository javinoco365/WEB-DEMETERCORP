import { NextResponse } from 'next/server'
import { mailerConfigured, sendFormMail } from '../../../lib/mailer'

export const runtime = 'nodejs'

function clean(v,max=5000){ return String(v||'').trim().slice(0,max) }
function esc(v){ return clean(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])) }

export async function POST(req){
  try{
    const body=await req.json()
    if(body.website) return NextResponse.json({ok:true})
    const name=clean(body.name,120), company=clean(body.company,160), phone=clean(body.phone,60), email=clean(body.email,200), subject=clean(body.subject,160), message=clean(body.message,5000)
    if(!name || !email || !subject || !message || body.privacy!=='accepted') return NextResponse.json({error:'Complete los campos obligatorios.'},{status:400})
    if(!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({error:'Introduzca un correo electrónico válido.'},{status:400})

    if(!mailerConfigured()) return NextResponse.json({error:'El envío no está disponible en este momento. Escríbanos directamente a info@demetercorp.es.'},{status:503})

    const html=`<h2>Nueva propuesta de proyecto — Grupo Demeter</h2><p><strong>Nombre:</strong> ${esc(name)}</p><p><strong>Empresa o administración:</strong> ${esc(company)||'—'}</p><p><strong>Correo electrónico:</strong> ${esc(email)}</p><p><strong>Teléfono:</strong> ${esc(phone)||'—'}</p><p><strong>Tipo de necesidad:</strong> ${esc(subject)}</p><p><strong>Mensaje:</strong></p><p>${esc(message).replace(/\n/g,'<br>')}</p>`
    const text=`Nueva propuesta de proyecto — Grupo Demeter\n\nNombre: ${name}\nEmpresa o administración: ${company||'—'}\nCorreo electrónico: ${email}\nTeléfono: ${phone||'—'}\nTipo de necesidad: ${subject}\n\nMensaje:\n${message}\n`
    try{ await sendFormMail({to:process.env.CONTACT_TO_EMAIL,subject:`Nuevo proyecto · ${subject} · ${name}`,text,html,replyTo:email}) }
    catch(err){ console.error('Error de envío',err); return NextResponse.json({error:'No se pudo enviar. Inténtelo de nuevo en unos minutos o escríbanos a info@demetercorp.es.'},{status:502}) }
    return NextResponse.json({ok:true})
  }catch(e){ console.error(e); return NextResponse.json({error:'Error interno al procesar el formulario.'},{status:500}) }
}
