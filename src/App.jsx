import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger, prefersReducedMotion } from './lib/gsap'
import { LenisContext, useSmoothScroll } from './hooks/useLenis'
import { useScrollFx } from './hooks/useScrollFx'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Education from './components/Education'
import Ribbons from './components/Ribbons'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Grain from './components/Grain'
import ScrollProgress from './components/ScrollProgress'

export default function App() {
  const reduced = prefersReducedMotion()
  const lenis = useSmoothScroll()
  const [revealed, setRevealed] = useState(reduced)
  const [loading, setLoading] = useState(!reduced)
  useScrollFx()

  // Always start at the top so the intro plays from the hero; honour a #hash once revealed.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (!reduced) window.scrollTo(0, 0)
  }, [reduced])

  useEffect(() => {
    if (!lenis) return
    if (loading) lenis.stop()
    else lenis.start()
  }, [lenis, loading])

  // Web fonts change text metrics, so re-measure every trigger once they are in.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  const onReveal = useCallback(() => setRevealed(true), [])
  const onExit = useCallback(() => {
    setLoading(false)
    // Next frame, so the refresh runs outside the preloader's GSAP context. Inside it, every
    // re-rendered scroll tween is recorded into that context and reverted when it unmounts.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      const id = window.location.hash.slice(1)
      const target = id && document.getElementById(id)
      if (target) target.scrollIntoView()
    })
  }, [])

  return (
    <LenisContext value={lenis}>
      <a
        href="#about"
        className="fixed top-4 left-4 z-[100] -translate-y-24 rounded-full bg-paper px-5 py-3 text-ink transition-transform focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      {loading && <Preloader onReveal={onReveal} onExit={onExit} />}
      <Navbar start={revealed} />
      <main>
        <Hero start={revealed} />
        <Manifesto />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Ribbons />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ScrollProgress start={revealed} />
      <CustomCursor />
      <Grain />
    </LenisContext>
  )
}
