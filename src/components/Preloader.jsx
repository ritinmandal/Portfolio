import { useRef } from 'react'
import { gsap, SCRAMBLE, useGSAP } from '../lib/gsap'
import { profile } from '../data/profile'

const MIN_TIME = 1.9 // seconds the counter always runs, so the intro never flashes past
const MAX_WAIT = 5000 // ms: never hold the page longer than this for fonts
const COLS = 6
const [roleA, roleB] = profile.title.split(' ')

/**
 * Counter 000 to 100 while fonts load, a ring draws around it, then the name and role lift away and
 * the screen leaves as a shutter: ink columns rise from the centre outward, accent columns
 * follow. `onReveal` fires as the shutter starts, `onExit` once it is gone.
 */
export default function Preloader({ onReveal, onExit }) {
  const root = useRef(null)
  const counter = useRef(null)

  useGSAP(
    (_, contextSafe) => {
      let alive = true
      const progress = { v: 0 }
      const render = () => {
        if (counter.current) counter.current.textContent = String(Math.round(progress.v)).padStart(3, '0')
      }

      gsap.set('[data-char]', { yPercent: 110, rotate: 8 })
      gsap.set('[data-role]', { yPercent: 110 })
      gsap
        .timeline()
        .to('[data-char]', { yPercent: 0, rotate: 0, stagger: 0.035, duration: 1.1, ease: 'expo.out' }, 0.15)
        .to('[data-role]', { yPercent: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out' }, 0.7)
        .from('[data-role-bar]', { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }, 0.75)
        .from('[data-meta]', { opacity: 0, duration: 0.3, stagger: 0.1 }, 0.3)
        .to('[data-meta]', { scrambleText: { text: '{original}', chars: SCRAMBLE, speed: 0.5 }, duration: 1.2, stagger: 0.1 }, 0.3)
        .to(progress, { v: 86, duration: MIN_TIME, ease: 'power2.inOut', onUpdate: render }, 0)
        .to('[data-bar]', { scaleX: 0.86, duration: MIN_TIME, ease: 'power2.inOut' }, 0)
        .fromTo('[data-ring]', { strokeDashoffset: 1 }, { strokeDashoffset: 0.14, duration: MIN_TIME, ease: 'power2.inOut' }, 0)
        .to('[data-ring-wrap]', { rotate: 360, duration: MIN_TIME + 1, ease: 'none' }, 0)

      const fonts = document.fonts?.ready ?? Promise.resolve()
      const timeout = new Promise((r) => setTimeout(r, MAX_WAIT))
      const minimum = new Promise((r) => setTimeout(r, MIN_TIME * 1000))

      const finish = contextSafe(() => {
        if (!alive) return
        gsap
          .timeline({ onComplete: () => onExit?.() })
          .to(progress, { v: 100, duration: 0.45, ease: 'power2.out', onUpdate: render })
          .to('[data-bar]', { scaleX: 1, duration: 0.45, ease: 'power2.out' }, '<')
          .to('[data-ring]', { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' }, '<')
          .to('[data-char]', { yPercent: -110, rotate: -6, stagger: 0.02, duration: 0.7, ease: 'expo.in' }, '+=0.1')
          .to('[data-role]', { yPercent: -110, stagger: 0.06, duration: 0.6, ease: 'expo.in' }, '<0.1')
          .to('[data-role-bar]', { scaleX: 0, duration: 0.6, ease: 'expo.in' }, '<')
          .to('[data-meta], [data-bar-wrap], [data-ring-wrap]', { opacity: 0, duration: 0.4 }, '<')
          .to(counter.current, { yPercent: -100, opacity: 0, duration: 0.6, ease: 'expo.in' }, '<')
          .add(() => onReveal?.(), '-=0.1')
          .to('[data-col="ink"]', { yPercent: -100, duration: 1.1, ease: 'expo.inOut', stagger: { each: 0.06, from: 'center' } }, '-=0.15')
          .to('[data-col="accent"]', { yPercent: -100, duration: 1.1, ease: 'expo.inOut', stagger: { each: 0.06, from: 'center' } }, '<0.14')
      })

      Promise.all([Promise.race([fonts, timeout]), minimum]).then(finish)

      return () => {
        alive = false
      }
    },
    { scope: root },
  )

  const cols = Array.from({ length: COLS })

  return (
    <div ref={root} className="fixed inset-0 z-[95] will-change-transform" aria-hidden="true">
      <div className="absolute inset-0 flex">
        {cols.map((_, i) => (
          <span key={i} data-col="accent" className="-mr-px h-full flex-1 bg-accent will-change-transform" />
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {cols.map((_, i) => (
          <span key={i} data-col="ink" className="-mr-px h-full flex-1 bg-ink will-change-transform" />
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col justify-between px-5 py-6 md:px-10 md:py-8">
        <div className="flex items-start justify-between">
          <span data-meta className="label text-paper/60">
            Portfolio
          </span>
          <span data-meta className="label text-paper/60">
            {profile.location}, {profile.country}
          </span>
        </div>

        <div className="flex flex-col items-center gap-[clamp(0.75rem,2vw,1.5rem)]">
          <span className="display flex flex-wrap justify-center gap-x-[0.25em] overflow-hidden pb-[0.12em] text-center text-[clamp(2.2rem,7vw,6.5rem)] font-medium text-paper">
            {profile.name.split(' ').map((word) => (
              <span key={word} className="inline-flex whitespace-nowrap">
                {word.split('').map((c, i) => (
                  <span key={i} data-char className="inline-block origin-bottom-left">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </span>
          <span className="flex items-center gap-[0.4em] text-[clamp(1.5rem,3.6vw,3.25rem)] leading-none text-paper">
            <span data-role-bar className="h-px w-[1.4em] origin-right bg-accent" />
            <span className="overflow-hidden pb-[0.12em]">
              <span data-role className="display block font-medium tracking-[-0.04em]">
                {roleA}
              </span>
            </span>
            <span className="overflow-hidden pb-[0.12em]">
              <span data-role className="serif-i block text-[1.08em] text-accent">
                {roleB}
              </span>
            </span>
            <span data-role-bar className="h-px w-[1.4em] origin-left bg-accent" />
          </span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <div className="flex-1">
            <span data-meta className="label mb-3 block text-paper/60">
              Loading
            </span>
            <span data-bar-wrap className="block h-px w-full max-w-md bg-paper/15">
              <span data-bar className="block h-full origin-left scale-x-0 bg-accent" />
            </span>
          </div>
          <div className="relative flex items-center gap-4">
            <svg data-ring-wrap viewBox="0 0 40 40" className="hidden size-14 md:block">
              <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="1" className="text-paper/15" />
              <circle
                data-ring
                cx="20"
                cy="20"
                r="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                className="text-accent"
              />
            </svg>
            <span className="overflow-hidden">
              <span
                ref={counter}
                className="display block text-[clamp(4rem,14vw,12rem)] font-light tabular-nums text-paper"
              >
                000
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
