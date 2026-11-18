import { NextResponse } from 'next/server'
import { mailerConfigured, sendFormMail } from '../../../lib/mailer'

export const runtime = 'nodejs'

function clean(v,max=5000){ return String(v||'').trim().slice(0,max) }
function esc(v){ return clean(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])) }

export async function POST(req){
  try{
    const body=await req.json()
    if(body.website) return NextResponse.json({ok:true})
    const name=clean(body.name,120), entity=clean(body.entity,160), email=clean(body.email,200), investorType=clean(body.investor_type,80), ticket=clean(body.ticket,120), sector=clean(body.sector||body.vertical,80), message=clean(body.message,5000)
    if(!name || !email || !investorType || !sector || body.privacy!=='accepted') return NextResponse.json({error:'Complete los campos obligatorios.'},{status:400})
    if(!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({error:'Introduzca un correo electrónico válido.'},{status:400})

    if(!mailerConfigured()) return NextResponse.json({error:'El envío no está disponible en este momento. Escríbanos directamente a info@demetercorp.es.'},{status:503})

    const html=`<h2>Solicitud de acceso al dossier de inversores</h2><p><strong>Nombre:</strong> ${esc(name)}</p><p><strong>Entidad:</strong> ${esc(entity)||'—'}</p><p><strong>Correo electrónico:</strong> ${esc(email)}</p><p><strong>Tipo de inversor:</strong> ${esc(investorType)}</p><p><strong>Ticket orientativo:</strong> ${esc(ticket)||'—'}</p><p><strong>Sector de interés:</strong> ${esc(sector)}</p><p><strong>Mensaje:</strong></p><p>${esc(message).replace(/\n/g,'<br>')||'—'}</p>`
    const text=`Solicitud de acceso al dossier de inversores\n\nNombre: ${name}\nEntidad: ${entity||'—'}\nCorreo electrónico: ${email}\nTipo de inversor: ${investorType}\nTicket orientativo: ${ticket||'—'}\nSector de interés: ${sector}\n\nMensaje:\n${message||'—'}\n`
    try{ await sendFormMail({to:process.env.DOSSIER_TO_EMAIL || process.env.CONTACT_TO_EMAIL,subject:`Dossier inversores · ${name}`,text,html,replyTo:email}) }
    catch(err){ console.error('Error de envío',err); return NextResponse.json({error:'No se pudo enviar. Inténtelo de nuevo en unos minutos o escríbanos a info@demetercorp.es.'},{status:502}) }
    return NextResponse.json({ok:true})
  }catch(e){ console.error(e); return NextResponse.json({error:'Error interno al procesar el formulario.'},{status:500}) }
}
