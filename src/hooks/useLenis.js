import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

export const LenisContext = createContext(null)

/** Creates one Lenis instance driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll() {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // touch keeps native momentum scrolling
      syncTouch: false,
    })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // Lenis is an external system created after mount; exposing it needs state.
    // oxlint-disable-next-line react/set-state-in-effect
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return lenis
}

export const useLenis = () => useContext(LenisContext)

/** Scroll to a section by id through Lenis (or natively), then move focus there for keyboard users. */
export function useScrollTo() {
  const lenis = useLenis()
  return (id) => {
    const el = id === 'top' ? document.body : document.getElementById(id)
    if (!el) return
    const done = () => {
      if (id !== 'top') el.focus({ preventScroll: true })
    }
    if (lenis) {
      lenis.scrollTo(id === 'top' ? 0 : el, { duration: 1.6, onComplete: done })
    } else {
      if (id === 'top') window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      done()
    }
    if (id !== 'top') history.replaceState(null, '', `#${id}`)
  }
}
