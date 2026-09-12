'use client'

import { useState } from 'react'

export default function DossierForm(){
  const [status,setStatus]=useState('idle')
  const [message,setMessage]=useState('')

  async function submit(e){
    e.preventDefault()
    setStatus('sending'); setMessage('')
    const fd=new FormData(e.currentTarget)
    const payload=Object.fromEntries(fd.entries())
    try{
      const r=await fetch('/api/dossier',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      const data=await r.json()
      if(!r.ok) throw new Error(data.error || 'No se pudo enviar la solicitud.')
      e.currentTarget.reset()
      setStatus('sent'); setMessage('Gracias. Hemos recibido su solicitud de acceso al dossier de inversores de Grupo Demeter. Revisamos cada solicitud de forma individual y, si procede, le haremos llegar un acuerdo de confidencialidad en un plazo de 48 horas.')
    }catch(err){
      setStatus('error'); setMessage(err.message || 'Ha ocurrido un error. Inténtelo de nuevo.')
    }
  }

  return <form className="form" onSubmit={submit}>
    <div className="form-row"><label>Nombre y apellidos<input name="name" required autoComplete="name"/></label><label>Entidad<input name="entity" autoComplete="organization"/></label></div>
    <div className="form-row"><label>Email<input name="email" required type="email" autoComplete="email"/></label><label>Tipo de inversor<select name="investor_type" required defaultValue=""><option value="" disabled>Seleccione una opción</option><option>Particular</option><option>Family office</option><option>Institucional</option><option>Otro</option></select></label></div>
    <div className="form-row"><label>Ticket orientativo<input name="ticket" placeholder="Ej. 500.000 € – 2M€"/></label><label>Vertical de interés<select name="vertical" required defaultValue=""><option value="" disabled>Seleccione una opción</option><option>Agua</option><option>Energía</option><option>Infraestructura</option><option>Patrimonio</option><option>Tecnología</option><option>Varias</option></select></label></div>
    <label>Mensaje<textarea name="message" placeholder="Cuéntenos brevemente su interés"></textarea></label>
    <label className="hp" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label>
    <label className="privacy-check"><input type="checkbox" name="privacy" value="accepted" required/> <span>He leído y acepto la <a href="/privacidad" target="_blank">Política de Privacidad</a>.</span></label>
    <button type="submit" disabled={status==='sending'}>{status==='sending'?'Enviando…':'Solicitar acceso al dossier'}</button>
    {message && <p className={'form-status '+status} role="status">{message}</p>}
    <p className="dossier-note">La información contenida en este sitio web y la que pueda facilitarse posteriormente no constituye una oferta de valores negociables, ni una recomendación o asesoramiento de inversión, ni una invitación a contratar ningún producto financiero. Cualquier decisión de inversión debe basarse en la documentación específica de cada operación y, en su caso, en el asesoramiento profesional independiente que el interesado considere oportuno.</p>
  </form>
}
