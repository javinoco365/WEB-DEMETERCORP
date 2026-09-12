'use client'

import { useEffect, useState } from 'react'
import { FIELDS } from './lib/fields'
import styles from './wizard.module.css'

const STORAGE_KEY = 'demeter-inversores-draft'

function defaultAnswers() {
  const initial = {}
  for (const f of FIELDS) if (f.type === 'range') initial[f.name] = f.default ?? f.min
  return initial
}

export default function Wizard() {
  const [answers, setAnswers] = useState(defaultAnswers)
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
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers }))
    } catch {}
  }, [answers, hydrated])

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
    if (v === undefined || v === null) return true
    return !String(v).trim()
  }

  function validate() {
    const nextErrors = {}
    for (const field of FIELDS) {
      if (field.required && isEmpty(field)) nextErrors[field.name] = 'Campo obligatorio.'
      if (field.type === 'email' && answers[field.name] && !/^\S+@\S+\.\S+$/.test(answers[field.name])) {
        nextErrors[field.name] = 'Email no válido.'
      }
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function submit() {
    if (!validate()) return
    if (!consent) {
      setConsentError('Debe aceptar para poder enviar el formulario.')
      return
    }
    setConsentError('')
    setStatus('sending')
    setSendError('')
    try {
      const res = await fetch('/api/alta-inversores', {
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
      <main className={styles.wrap}>
        <div className={`${styles.card} ${styles.center}`}>
          <h1>Recibido</h1>
          <p>Gracias, a partir de ahora solo le escribiremos cuando tengamos algo que encaje con lo que nos ha contado.</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <h1>Cuéntenos qué busca</h1>
        <p className={styles.intro}>
          Menos de dos minutos. Trabajamos operaciones off-market y en exclusiva — si algo encaja con lo que nos
          cuenta, le avisamos; si no, no le molestamos.
        </p>

        <div className={styles.fields}>
          {FIELDS.map((field) => (
            <div className={styles.field} key={field.name}>
              <label className={styles.fieldLabel}>
                {field.label}
                {field.required && ' *'}
              </label>
              {field.help && <span className={styles.fieldHelp}>{field.help}</span>}
              <FieldInput field={field} value={answers[field.name]} setValue={setValue} toggleValue={toggleValue} styles={styles} />
              {errors[field.name] && <span className={styles.fieldError}>{errors[field.name]}</span>}
            </div>
          ))}
        </div>

        <div className={styles.consent}>
          <p className={styles.consentText}>
            Responsable: Demeter Soluciones Estratégicas, S.L. — CIF B22629844 — Calle Botticelli 1, 21450 Cartaya
            (Huelva). Finalidad: gestionar su perfil inversor y remitirle oportunidades que encajen con los criterios
            indicados. Legitimación: su consentimiento. Conservación: mientras se mantenga la relación o hasta que
            solicite la supresión. Destinatarios: no cedemos sus datos a terceros. Derechos: acceso, rectificación,
            supresión y oposición escribiendo a info@demetercorp.es.
          </p>
          <label className={styles.consentCheck}>
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
          {consentError && <span className={styles.fieldError}>{consentError}</span>}
        </div>

        <label className={styles.hp} aria-hidden="true">
          Página web
          <input type="text" tabIndex="-1" autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>

        {status === 'error' && <p className={styles.sendError}>{sendError}</p>}

        <div className={styles.actionsRow}>
          <button type="button" className={`${styles.btn} ${styles.primary}`} onClick={submit} disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando…' : 'Enviar'}
          </button>
        </div>
      </div>
    </main>
  )
}

function FieldInput({ field, value, setValue, toggleValue, styles }) {
  if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
    return <input type={field.type} value={value || ''} onChange={(e) => setValue(field.name, e.target.value)} />
  }
  if (field.type === 'textarea') {
    return <textarea value={value || ''} onChange={(e) => setValue(field.name, e.target.value)} />
  }
  if (field.type === 'radio') {
    return (
      <div className={styles.options}>
        {field.options.map((opt) => (
          <label className={styles.option} key={opt}>
            <input type="radio" name={field.name} checked={value === opt} onChange={() => setValue(field.name, opt)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    )
  }
  if (field.type === 'checkbox') {
    return (
      <div className={styles.options}>
        {field.options.map((opt) => (
          <label className={styles.option} key={opt}>
            <input type="checkbox" checked={(value || []).includes(opt)} onChange={() => toggleValue(field.name, opt)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    )
  }
  if (field.type === 'range') {
    const current = value !== undefined && value !== null && value !== '' ? Number(value) : (field.default ?? field.min)
    const formatted = new Intl.NumberFormat('es-ES').format(current)
    return (
      <div className={styles.rangeWrap}>
        <input
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={current}
          onChange={(e) => setValue(field.name, e.target.value)}
        />
        <output className={styles.rangeValue}>
          {formatted} €{current >= field.max ? '+' : ''}
        </output>
      </div>
    )
  }
  return null
}
