import { gsap } from '../lib/gsap'

/**
 * Variable-font "swell": characters near the pointer grow heavier and fall back as it leaves.
 * Call inside a fine-pointer matchMedia block; returns a cleanup. Serif (non-variable)
 * characters are skipped so they never get faux-bolded.
 */
export function weightWave(chars, { min = 500, max = 700, radius = 260 } = {}) {
  const list = chars.filter((c) => !c.closest('.serif-i'))
  if (!list.length) return () => {}
  const setters = list.map((c) => gsap.quickTo(c, 'fontWeight', { duration: 0.6, ease: 'power3.out' }))
  gsap.set(list, { fontWeight: min })

  let raf = 0
  let px = 0
  let py = 0
  const update = () => {
    raf = 0
    list.forEach((c, i) => {
      const r = c.getBoundingClientRect()
      const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2))
      const f = Math.max(0, 1 - d / radius)
      setters[i](min + (max - min) * f * f * (3 - 2 * f))
    })
  }
  const move = (e) => {
    px = e.clientX
    py = e.clientY
    if (!raf) raf = requestAnimationFrame(update)
  }
  window.addEventListener('pointermove', move, { passive: true })
  return () => {
    window.removeEventListener('pointermove', move)
    cancelAnimationFrame(raf)
    gsap.set(list, { clearProps: 'fontWeight' })
  }
}
