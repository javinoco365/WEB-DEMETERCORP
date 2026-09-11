'use client'

import { useState } from 'react'

export default function ContactForm(){
  const [status,setStatus]=useState('idle')
  const [message,setMessage]=useState('')

  async function submit(e){
    e.preventDefault()
    setStatus('sending'); setMessage('')
    const fd=new FormData(e.currentTarget)
    const payload=Object.fromEntries(fd.entries())
    try{
      const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      const data=await r.json()
      if(!r.ok) throw new Error(data.error || 'No se pudo enviar el formulario.')
      e.currentTarget.reset()
      setStatus('sent'); setMessage('Gracias. Hemos recibido su consulta correctamente.')
    }catch(err){
      setStatus('error'); setMessage(err.message || 'Ha ocurrido un error. Inténtelo de nuevo.')
    }
  }

  return <form className="form" onSubmit={submit}>
    <div className="form-row"><label>Nombre y apellidos<input name="name" required autoComplete="name"/></label><label>Empresa<input name="company" autoComplete="organization"/></label></div>
    <div className="form-row"><label>Email<input name="email" required type="email" autoComplete="email"/></label><label>Motivo<select name="subject" required defaultValue=""><option value="" disabled>Seleccione una opción</option><option>Oportunidad de inversión</option><option>Presentación de activo</option><option>Colaboración empresarial</option><option>Consulta corporativa</option><option>Otro</option></select></label></div>
    <label>Mensaje<textarea name="message" required placeholder="Describa brevemente su consulta"></textarea></label>
    <label className="hp" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label>
    <label className="privacy-check"><input type="checkbox" name="privacy" value="accepted" required/> <span>He leído y acepto la <a href="/privacidad" target="_blank">Política de Privacidad</a>.</span></label>
    <button type="submit" disabled={status==='sending'}>{status==='sending'?'Enviando…':'Enviar consulta'}</button>
    {message && <p className={'form-status '+status} role="status">{message}</p>}
  </form>
}
