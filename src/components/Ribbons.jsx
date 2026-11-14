import { useRef } from 'react'
import { Asterisk } from 'lucide-react'
import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/gsap'
import { expertise } from '../data/profile'
import TechIcon from './ui/TechIcon'

const [frontend, , libraries, , design] = expertise
const top = [...frontend.items.filter((s) => !['HTML5', 'CSS3', 'Bootstrap'].includes(s)), ...libraries.items]
const bottom = [...design.items, 'Supabase', 'Stripe', 'REST APIs']

function Band({ items, dir, tilt, className, bandRef }) {
  const row = [...items, ...items]
  return (
    <div ref={bandRef} className={`relative py-4 md:py-6 ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <div data-loop={dir} className="marquee">
        {row.map((s, i) => (
          <span key={i} className="flex shrink-0 items-center text-[clamp(1.8rem,4vw,4rem)]">
            <span
              className={`flex items-center gap-[0.3em] px-5 whitespace-nowrap md:px-8 ${
                i % 2 ? 'serif-i' : 'display font-medium tracking-tight'
              }`}
            >
              <TechIcon name={s} size="0.8em" />
              {s}
            </span>
            <Asterisk size={28} strokeWidth={1.75} className="spin-slow shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Two tech-stack ribbons crossing in an X. Each loops on its own; scrolling speeds them up,
 * reverses them with the scroll direction, and swings the cross a little wider.
 */
export default function Ribbons() {
  const root = useRef(null)
  const a = useRef(null)
  const b = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const loops = gsap.utils.toArray('[data-loop]').map((el) =>
          gsap.fromTo(
            el,
            { xPercent: el.dataset.loop === 'left' ? 0 : -50 },
            { xPercent: el.dataset.loop === 'left' ? -50 : 0, duration: 36, ease: 'none', repeat: -1 },
          ).totalTime(36 * 100), // start deep in the repeats so reversing never hits time 0
        )
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = 1 + Math.abs(gsap.utils.clamp(-5, 5, self.getVelocity() / 250))
            loops.forEach((l) => gsap.to(l, { timeScale: self.direction * v, duration: 0.4, overwrite: true }))
          },
        })

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }, defaults: { ease: 'none' } })
          .fromTo(a.current, { rotate: -2, xPercent: 6 }, { rotate: -7, xPercent: -6 }, 0)
          .fromTo(b.current, { rotate: 2, xPercent: -6 }, { rotate: 6, xPercent: 6 }, 0)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-label="Technologies" className="relative overflow-hidden py-28 md:py-40">
      <ul className="sr-only">
        {[...top, ...bottom].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div className="relative -mx-[10vw]" aria-hidden="true">
        <Band bandRef={b} items={bottom} dir="right" tilt={3} className="bg-paper text-ink will-change-transform" />
        <Band bandRef={a} items={top} dir="left" tilt={-3} className="-mt-[4.5rem] bg-accent text-ink will-change-transform md:-mt-24" />
      </div>
    </section>
  )
}
