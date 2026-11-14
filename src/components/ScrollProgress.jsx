import { useEffect, useRef } from 'react'
import { gsap, MQ, SCRAMBLE, useGSAP } from '../lib/gsap'
import { navLinks } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'

const ids = navLinks.map((l) => l.id)

/**
 * Fixed rail on the right edge (desktop): a line that fills with page progress and the
 * current section's number and name, which decode whenever the section changes.
 */
export default function ScrollProgress({ start }) {
  const root = useRef(null)
  const label = useRef(null)
  const active = useActiveSection(ids)
  const index = ids.indexOf(active)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        gsap.fromTo('[data-fill]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.4 } })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (start) gsap.from(root.current, { opacity: 0, duration: 1.4, delay: 1 })
    },
    { scope: root, dependencies: [start], revertOnUpdate: false },
  )

  useEffect(() => {
    const el = label.current
    if (!el) return
    const text = index >= 0 ? navLinks[index].label : 'Index'
    if (window.matchMedia(MQ.reduce).matches) {
      el.textContent = text
      return
    }
    const tween = gsap.to(el, { scrambleText: { text, chars: SCRAMBLE, speed: 0.6 }, duration: 0.7, ease: 'none' })
    return () => tween.kill()
  }, [index])

  return (
    <div
      ref={root}
      className="pointer-events-none fixed top-1/2 right-5 z-[70] hidden -translate-y-1/2 flex-col items-center gap-4 mix-blend-difference will-change-transform lg:flex"
      aria-hidden="true"
    >
      <span className="label text-paper/70 [writing-mode:vertical-rl]">{index >= 0 ? String(index + 1).padStart(2, '0') : '00'}</span>
      <span className="relative block h-32 w-px bg-paper/20">
        <span data-fill className="absolute inset-0 origin-top bg-paper" />
      </span>
      <span ref={label} className="label w-4 text-paper [writing-mode:vertical-rl]">
        Index
      </span>
    </div>
  )
}
