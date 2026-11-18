'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Un único IntersectionObserver para toda la web. Los elementos con
// data-reveal aparecen con un fundido discreto (ver globals.css). Sin
// JavaScript, o con prefers-reduced-motion, todo es visible desde el principio.
// Al terminar la aparición se retira el atributo, para que el elemento
// recupere sus transiciones propias (hover de tarjetas, etc.).
export default function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    window.__rv = true
    document.documentElement.classList.add('js')
    const elements = Array.from(document.querySelectorAll('[data-reveal]:not(.in)'))
    if (!elements.length) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!('IntersectionObserver' in window) || reduced) {
      elements.forEach((el) => el.classList.add('in'))
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          el.classList.add('in')
          observer.unobserve(el)
          if (el.getAttribute('data-reveal') === '') {
            const done = (e) => {
              if (e.target !== el || e.propertyName !== 'transform') return
              el.removeEventListener('transitionend', done)
              el.removeAttribute('data-reveal')
            }
            el.addEventListener('transitionend', done)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])

  return null
}
