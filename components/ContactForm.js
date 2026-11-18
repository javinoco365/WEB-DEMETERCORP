'use client'

import { useRef, useState } from 'react'

export default function ContactForm(){
  const [status,setStatus]=useState('idle')
  const [message,setMessage]=useState('')
  const [tried,setTried]=useState(false)
  const statusRef=useRef(null)

  // El aviso de resultado puede quedar bajo el borde de la pantalla en móvil.
  function reveal(){ requestAnimationFrame(()=>statusRef.current?.scrollIntoView({block:'nearest',behavior:'smooth'})) }

  async function submit(e){
    e.preventDefault()
    const formElement=e.currentTarget
    setStatus('sending'); setMessage('')
    const fd=new FormData(formElement)
    const payload=Object.fromEntries(fd.entries())
    try{
      const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      const data=await r.json()
      if(!r.ok) throw new Error(data.error || 'No se pudo enviar el formulario.')
      formElement.reset(); setTried(false)
      setStatus('sent'); setMessage('Gracias. Hemos recibido su propuesta. El equipo correspondiente del grupo la revisará y le contactará en los próximos días.'); reveal()
    }catch(err){
      setStatus('error'); setMessage(err.message || 'Ha ocurrido un error. Inténtelo de nuevo.'); reveal()
    }
  }

  return <form className={'form'+(tried?' tried':'')} onSubmit={submit}>
    <div className="form-row"><label>Nombre y apellidos<input name="name" required autoComplete="name"/></label><label>Empresa o administración<input name="company" autoComplete="organization"/></label></div>
    <div className="form-row"><label>Correo electrónico<input name="email" required type="email" autoComplete="email"/></label><label>Teléfono<input name="phone" type="tel" autoComplete="tel"/></label></div>
    <label>Tipo de necesidad<select name="subject" required defaultValue=""><option value="" disabled>Seleccione una opción</option><option>Agua</option><option>Energía</option><option>Infraestructura</option><option>Patrimonio</option><option>Tecnología</option><option>Otro</option></select></label>
    <label>Mensaje<textarea name="message" required placeholder="Describa brevemente el proyecto o la necesidad"></textarea></label>
    <label className="hp" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label>
    <label className="privacy-check"><input type="checkbox" name="privacy" value="accepted" required/> <span>He leído y acepto la <a href="/privacidad" target="_blank">Política de privacidad</a>.</span></label>
    <button type="submit" onClick={()=>setTried(true)} disabled={status==='sending'}>{status==='sending'?'Enviando…':'Enviar propuesta'}</button>
    {message && <p className={'form-status '+status} role="status" aria-live="polite" ref={statusRef}>{message}</p>}
  </form>
}
