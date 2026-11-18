'use client'

import { useEffect, useRef, useState } from 'react'
import { FIELDS } from './lib/fields'
import styles from './wizard.module.css'

const STORAGE_KEY = 'demeter-inversores-draft'

function defaultAnswers() {
  const initial = {}
  for (const f of FIELDS) if (f.type === 'range') initial[f.name] = f.default ?? f.min
  return initial
}

// Tres pasos cortos en lugar de un formulario largo. Cada paso valida solo sus
// campos; el envío final manda exactamente el mismo cuerpo que antes a la API.
const STEPS = [
  { title: 'Quién es', fields: ['nombre_completo', 'email', 'telefono'] },
  { title: 'Qué busca', fields: ['busca_ahora', 'tipologias', 'zonas_compra', 'importe_maximo', 'descarta_operacion'] },
  { title: 'Aviso y envío', fields: ['aviso_preferido'] },
]
const FIELD_BY_NAME = Object.fromEntries(FIELDS.map((f) => [f.name, f]))
const LAST = STEPS.length - 1

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState('forward')
  const stepTitleRef = useRef(null)
  const sentRef = useRef(null)
  const firstRender = useRef(true)

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

  // Al cambiar de paso: arriba de la tarjeta y foco en el título del paso.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    stepTitleRef.current?.focus({ preventScroll: true })
  }, [step])

  // Tras enviar: la confirmación siempre a la vista y con el foco.
  useEffect(() => {
    if (status !== 'sent') return
    window.scrollTo({ top: 0 })
    sentRef.current?.focus({ preventScroll: true })
  }, [status])

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

  // Valida los campos de un paso y devuelve sus errores.
  function validateStep(index) {
    const stepErrors = {}
    for (const name of STEPS[index].fields) {
      const field = FIELD_BY_NAME[name]
      if (field.required && isEmpty(field)) stepErrors[name] = 'Campo obligatorio.'
      if (field.type === 'email' && answers[name] && !/^\S+@\S+\.\S+$/.test(answers[name])) {
        stepErrors[name] = 'Correo electrónico no válido.'
      }
    }
    setErrors((prev) => {
      const next = { ...prev }
      for (const name of STEPS[index].fields) next[name] = stepErrors[name]
      return next
    })
    return stepErrors
  }

  // Lleva la vista y el foco al primer campo con error.
  function focusFirstError(stepErrors) {
    const first = Object.keys(stepErrors)[0]
    if (!first) return
    requestAnimationFrame(() => {
      const el = document.getElementById('f-' + first)
      if (!el) return
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' })
      el.querySelector('input,textarea')?.focus({ preventScroll: true })
    })
  }

  function next() {
    const stepErrors = validateStep(step)
    if (Object.keys(stepErrors).length) return focusFirstError(stepErrors)
    setDirection('forward')
    setStep((s) => Math.min(s + 1, LAST))
  }

  function back() {
    setDirection('back')
    setStep((s) => Math.max(s - 1, 0))
  }

  async function submit() {
    // Se revalidan todos los pasos por si el borrador guardado llega incompleto.
    for (let i = 0; i <= LAST; i++) {
      const stepErrors = validateStep(i)
      if (Object.keys(stepErrors).length) {
        if (i !== step) {
          setDirection('back')
          setStep(i)
        }
        return focusFirstError(stepErrors)
      }
    }
    if (!consent) {
      setConsentError('Debe aceptar para poder enviar el formulario.')
      requestAnimationFrame(() => document.getElementById('f-consentimiento')?.focus())
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
      const data = await res.json().catch(() => ({}))
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
        <div className={`${styles.card} ${styles.center}`} ref={sentRef} tabIndex={-1} role="status">
          <h1>Recibido</h1>
          <p>Gracias. A partir de ahora, solo le escribiremos cuando tengamos algo que encaje con lo que nos ha contado.</p>
        </div>
      </main>
    )
  }

  const current = STEPS[step]

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <h1>Cuéntenos qué busca</h1>
        <p className={styles.intro}>
          Menos de dos minutos. Trabajamos operaciones fuera de mercado y en exclusiva: si algo encaja con lo que nos
          cuenta, le avisamos; si no, no le molestamos.
        </p>

        <div className={styles.progress}>
          <div
            className={styles.bar}
            role="progressbar"
            aria-label="Progreso del formulario"
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-valuenow={step + 1}
            aria-valuetext={`Paso ${step + 1} de ${STEPS.length}: ${current.title}`}
          >
            <i style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
          </div>
          <ol className={styles.stepList} aria-hidden="true">
            {STEPS.map((s, i) => (
              <li key={s.title} className={i === step ? styles.stepCurrent : i < step ? styles.stepDone : undefined}>
                {s.title}
              </li>
            ))}
          </ol>
        </div>

        <div key={step} className={`${styles.step} ${direction === 'back' ? styles.stepBack : ''}`}>
          <h2 className={styles.stepTitle} ref={stepTitleRef} tabIndex={-1}>
            <span>
              Paso {step + 1} de {STEPS.length}
            </span>
            {current.title}
          </h2>

          <div className={styles.fields}>
            {current.fields.map((name) => {
              const field = FIELD_BY_NAME[name]
              const grouped = field.type === 'radio' || field.type === 'checkbox'
              const inputId = 'i-' + field.name
              return (
                <div
                  className={styles.field}
                  key={field.name}
                  id={'f-' + field.name}
                  role={grouped ? 'group' : undefined}
                  aria-labelledby={grouped ? 'l-' + field.name : undefined}
                >
                  <label className={styles.fieldLabel} id={'l-' + field.name} htmlFor={grouped ? undefined : inputId}>
                    {field.label}
                    {field.required && ' *'}
                  </label>
                  {field.help && <span className={styles.fieldHelp}>{field.help}</span>}
                  <FieldInput
                    field={field}
                    inputId={inputId}
                    invalid={Boolean(errors[field.name])}
                    value={answers[field.name]}
                    setValue={setValue}
                    toggleValue={toggleValue}
                    styles={styles}
                  />
                  {errors[field.name] && (
                    <span className={styles.fieldError} role="alert">
                      {errors[field.name]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {step === LAST && (
            <div className={styles.consent}>
              <p className={styles.consentText}>
                Responsable: Demeter Soluciones Estratégicas, S.L.U. · NIF B22629844 · Calle Botticelli, 1, 21450
                Cartaya (Huelva). Finalidad: gestionar su perfil inversor y remitirle oportunidades que encajen con los
                criterios indicados. Legitimación: su consentimiento. Conservación: mientras se mantenga la relación o
                hasta que solicite la supresión. Destinatarios: no cedemos sus datos a terceros. Derechos: acceso,
                rectificación, supresión y oposición escribiendo a info@demetercorp.es.
              </p>
              <label className={styles.consentCheck}>
                <input
                  id="f-consentimiento"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked)
                    setConsentError('')
                  }}
                />
                <span>He leído y acepto el tratamiento de mis datos en los términos indicados. *</span>
              </label>
              {consentError && (
                <span className={styles.fieldError} role="alert">
                  {consentError}
                </span>
              )}
            </div>
          )}
        </div>

        <label className={styles.hp} aria-hidden="true">
          Página web
          <input type="text" tabIndex="-1" autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>

        {status === 'error' && (
          <p className={styles.sendError} role="alert">
            {sendError}
          </p>
        )}

        <div className={styles.actionsRow}>
          {step > 0 && (
            <button type="button" className={styles.btn} onClick={back} disabled={status === 'sending'}>
              Atrás
            </button>
          )}
          {step < LAST ? (
            <button type="button" className={`${styles.btn} ${styles.primary}`} onClick={next}>
              Siguiente
            </button>
          ) : (
            <button type="button" className={`${styles.btn} ${styles.primary}`} onClick={submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : 'Enviar'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

function FieldInput({ field, inputId, invalid, value, setValue, toggleValue, styles }) {
  if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
    const autoComplete = { text: 'name', email: 'email', tel: 'tel' }[field.type]
    return (
      <input
        id={inputId}
        type={field.type}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        value={value || ''}
        onChange={(e) => setValue(field.name, e.target.value)}
      />
    )
  }
  if (field.type === 'textarea') {
    return <textarea id={inputId} aria-invalid={invalid || undefined} value={value || ''} onChange={(e) => setValue(field.name, e.target.value)} />
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
          id={inputId}
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
