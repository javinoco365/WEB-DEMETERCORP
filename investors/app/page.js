'use client'

import { useEffect, useState } from 'react'
import { STEPS } from './lib/fields'

const STORAGE_KEY = 'demeter-inversores-draft'

export default function Page() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [context, setContext] = useState({ origen: '', enviado_por: '' })
  const [status, setStatus] = useState('form') // form | sending | sent | error
  const [sendError, setSendError] = useState('')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      setContext({ origen: params.get('origen') || '', enviado_por: params.get('enviado_por') || '' })
    } catch {}
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved.answers) setAnswers(saved.answers)
        if (saved.step) setStep(saved.step)
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }))
    } catch {}
  }, [answers, step, hydrated])

  const current = STEPS[step - 1]
  const isLastStep = step === STEPS.length
  const visibleFields = current.fields.filter((f) => !f.showIf || f.showIf(answers))

  function setValue(name, value) {
    setAnswers((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function toggleValue(name, option) {
    setAnswers((prev) => {
      const list = prev[name] || []
      const next = list.includes(option) ? list.filter((o) => o !== option) : [...list, option]
      return { ...prev, [name]: next }
    })
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function isEmpty(field) {
    const v = answers[field.name]
    if (field.type === 'checkbox') return !v || v.length === 0
    return !v || !String(v).trim()
  }

  function validateStep() {
    const nextErrors = {}
    for (const field of visibleFields) {
      if (field.required && isEmpty(field)) nextErrors[field.name] = 'Campo obligatorio.'
      if (field.type === 'email' && answers[field.name] && !/^\S+@\S+\.\S+$/.test(answers[field.name])) {
        nextErrors[field.name] = 'Email no válido.'
      }
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function goNext() {
    if (!validateStep()) return
    if (step < STEPS.length) setStep(step + 1)
  }

  function goBack() {
    if (step > 1) setStep(step - 1)
  }

  async function submit() {
    if (!validateStep()) return
    if (!consent) {
      setConsentError('Debe aceptar para poder enviar el formulario.')
      return
    }
    setConsentError('')
    setStatus('sending')
    setSendError('')
    try {
      const res = await fetch('/api/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          pagina_web: honeypot,
          origen: context.origen,
          enviado_por: context.enviado_por,
          consentimiento_aceptado: true,
          consentimiento_fecha: new Date().toISOString(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo enviar el formulario.')
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {}
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setSendError(err.message || 'Ha ocurrido un error. Inténtelo de nuevo.')
    }
  }

  if (status === 'sent') {
    return (
      <main className="wrap">
        <div className="card center">
          <img className="logo" src="/logos/demeter-corp.png" alt="Demeter" />
          <h1>Recibido</h1>
          <p>Gracias, a partir de ahora solo le escribiremos cuando tengamos algo que encaje con lo que nos ha contado.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="wrap">
      <div className="card">
        <img className="logo" src="/logos/demeter-corp.png" alt="Demeter" />
        <div className="progress">
          <div className="progress-fill" style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>
        <span className="step-count">
          Paso {step} de {STEPS.length}
        </span>
        <h1>{current.title}</h1>
        {current.intro && <p className="intro">{current.intro}</p>}

        <div className="fields">
          {visibleFields.map((field) => (
            <div className="field" key={field.name}>
              <label className="field-label">
                {field.label}
                {field.required && ' *'}
              </label>
              {field.help && <span className="field-help">{field.help}</span>}
              <FieldInput field={field} value={answers[field.name]} setValue={setValue} toggleValue={toggleValue} />
              {errors[field.name] && <span className="field-error">{errors[field.name]}</span>}
            </div>
          ))}
        </div>

        {isLastStep && (
          <div className="consent">
            <p className="consent-text">
              Responsable: Demeter Soluciones Estratégicas, S.L. — CIF B22629844 — Calle Botticelli 1, 21450 Cartaya
              (Huelva). Finalidad: gestionar su perfil inversor y remitirle oportunidades que encajen con los
              criterios indicados. Legitimación: su consentimiento. Conservación: mientras se mantenga la relación o
              hasta que solicite la supresión. Destinatarios: no cedemos sus datos a terceros. Derechos: acceso,
              rectificación, supresión y oposición escribiendo a info@demetercorp.es.
            </p>
            <label className="consent-check">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked)
                  setConsentError('')
                }}
              />
              <span>He leído y acepto el tratamiento de mis datos en los términos indicados. *</span>
            </label>
            {consentError && <span className="field-error">{consentError}</span>}
          </div>
        )}

        <label className="hp" aria-hidden="true">
          Página web
          <input type="text" tabIndex="-1" autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>

        {status === 'error' && <p className="send-error">{sendError}</p>}

        <div className="actions">
          {step > 1 && (
            <button type="button" className="btn ghost" onClick={goBack} disabled={status === 'sending'}>
              Atrás
            </button>
          )}
          {!isLastStep && (
            <button type="button" className="btn primary" onClick={goNext}>
              {step === 1 ? 'Empezar' : 'Siguiente'}
            </button>
          )}
          {isLastStep && (
            <button type="button" className="btn primary" onClick={submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Enviar solicitud'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

function FieldInput({ field, value, setValue, toggleValue }) {
  if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
    return <input type={field.type} value={value || ''} onChange={(e) => setValue(field.name, e.target.value)} />
  }
  if (field.type === 'textarea') {
    return <textarea value={value || ''} onChange={(e) => setValue(field.name, e.target.value)} />
  }
  if (field.type === 'radio') {
    return (
      <div className="options">
        {field.options.map((opt) => (
          <label className="option" key={opt}>
            <input type="radio" name={field.name} checked={value === opt} onChange={() => setValue(field.name, opt)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    )
  }
  if (field.type === 'checkbox') {
    return (
      <div className="options">
        {field.options.map((opt) => (
          <label className="option" key={opt}>
            <input type="checkbox" checked={(value || []).includes(opt)} onChange={() => toggleValue(field.name, opt)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    )
  }
  return null
}
