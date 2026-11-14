import { useEffect, useRef, useState } from 'react'
import { gsap, MQ } from '../lib/gsap'

const canUseCursor = () =>
  typeof window !== 'undefined' && window.matchMedia(`${MQ.fine} and ${MQ.motion}`).matches

/**
 * Accent dot + trailing ring. The ring grows over links and buttons, and becomes a
 * labelled disc over elements with `data-cursor="Label"`. Fine pointers only.
 */
export default function CustomCursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [enabled] = useState(canUseCursor)
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!enabled) return
    const html = document.documentElement
    html.classList.add('has-cursor')

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3.out' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3.out' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3.out' })
    gsap.set([dot.current, ring.current], { autoAlpha: 0 })

    let shown = false
    const move = (e) => {
      if (!shown) {
        shown = true
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e) => {
      const labelled = e.target.closest?.('[data-cursor]')
      const interactive = e.target.closest?.('a, button, [role="button"]')
      ring.current.classList.toggle('is-label', !!labelled)
      ring.current.classList.toggle('is-hover', !labelled && !!interactive)
      dot.current.style.visibility = labelled ? 'hidden' : ''
      setLabel(labelled ? labelled.getAttribute('data-cursor') : '')
    }
    const leaveWindow = () => {
      shown = false
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 })
    }
    const down = () => gsap.to(ring.current, { scale: 0.82, duration: 0.2 })
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' })

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    html.addEventListener('pointerleave', leaveWindow)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)

    return () => {
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      html.removeEventListener('pointerleave', leaveWindow)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <span className="cursor-text">{label}</span>
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  )
}
