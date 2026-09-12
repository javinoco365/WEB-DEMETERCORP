import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function clean(v,max=5000){ return String(v||'').trim().slice(0,max) }
function esc(v){ return clean(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])) }

export async function POST(req){
  try{
    const body=await req.json()
    if(body.website) return NextResponse.json({ok:true})
    const name=clean(body.name,120), entity=clean(body.entity,160), email=clean(body.email,200), investorType=clean(body.investor_type,80), ticket=clean(body.ticket,120), vertical=clean(body.vertical,80), message=clean(body.message,5000)
    if(!name || !email || !investorType || !vertical || body.privacy!=='accepted') return NextResponse.json({error:'Complete los campos obligatorios.'},{status:400})
    if(!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({error:'Introduzca un email válido.'},{status:400})

    const apiKey=process.env.RESEND_API_KEY
    const to=process.env.DOSSIER_TO_EMAIL || process.env.CONTACT_TO_EMAIL || 'info@demetercorp.es'
    const from=process.env.CONTACT_FROM_EMAIL || 'Demeter Corp Web <web@demetercorp.es>'
    if(!apiKey) return NextResponse.json({error:'El servicio de correo aún no está configurado.'},{status:503})

    const html=`<h2>Solicitud de acceso al dossier de inversores</h2><p><strong>Nombre:</strong> ${esc(name)}</p><p><strong>Entidad:</strong> ${esc(entity)||'—'}</p><p><strong>Email:</strong> ${esc(email)}</p><p><strong>Tipo de inversor:</strong> ${esc(investorType)}</p><p><strong>Ticket orientativo:</strong> ${esc(ticket)||'—'}</p><p><strong>Vertical de interés:</strong> ${esc(vertical)}</p><p><strong>Mensaje:</strong></p><p>${esc(message).replace(/\n/g,'<br>')||'—'}</p>`
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:`Dossier inversores · ${name}`,html})})
    if(!response.ok){ const t=await response.text(); console.error('Resend error',t); return NextResponse.json({error:'No se pudo enviar el mensaje.'},{status:502}) }
    return NextResponse.json({ok:true})
  }catch(e){ console.error(e); return NextResponse.json({error:'Error interno al procesar el formulario.'},{status:500}) }
}
