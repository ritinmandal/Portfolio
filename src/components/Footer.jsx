import { useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { navLinks, profile } from '../data/profile'
import { useScrollTo } from '../hooks/useLenis'
import { useLocalTime } from '../hooks/useLocalTime'
import RollText from './ui/RollText'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const root = useRef(null)
  const scrollTo = useScrollTo()
  const time = useLocalTime(profile.timeZone)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // The giant name rises from the floor letter by letter and lands exactly at the page bottom.
        const giant = SplitText.create('[data-giant]', { type: 'chars', charsClass: 'glow-char', aria: 'none' })
        gsap.fromTo(
          giant.chars,
          { yPercent: 105, rotate: (i) => (i % 2 ? 14 : -14) },
          {
            yPercent: 0,
            rotate: 0,
            ease: 'none',
            stagger: { each: 0.05, from: 'center' },
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
          },
        )
        gsap.from('[data-foot-col]', {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 1.1,
          scrollTrigger: { trigger: root.current, start: 'top 95%' },
        })
      })
      // The lamp: an orange light that lights the dark glass letters. It follows the cursor
      // anywhere over the footer and drifts back and forth across the name on its own otherwise.
      mm.add(MQ.motion, () => {
        const name = root.current.querySelector('[data-giant]')
        const letters = gsap.utils.toArray('[data-giant] .glow-char')
        const lamp = { x: 0, y: 0, r: 0 }

        const render = () => {
          const box = name.getBoundingClientRect()
          name.style.setProperty('--lr', `${lamp.r}px`)
          letters.forEach((c) => {
            const r = c.getBoundingClientRect()
            c.style.setProperty('--lx', `${lamp.x - (r.left - box.left)}px`)
            c.style.setProperty('--ly', `${lamp.y - (r.top - box.top)}px`)
          })
        }

        let sweep
        const startSweep = () => {
          const w = name.offsetWidth
          const h = name.offsetHeight
          sweep?.kill()
          sweep = gsap
            .timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
            .to(lamp, { x: w * 0.92, y: h * 0.45, r: h * 0.8, duration: 4.5 })
            .to(lamp, { x: w * 0.08, y: h * 0.6, r: h * 0.65, duration: 4.5 })
        }
        startSweep()

        // Only paint while the footer is on screen.
        const visible = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? gsap.ticker.add(render) : gsap.ticker.remove(render)),
        })

        const fine = window.matchMedia(MQ.fine).matches
        const footer = root.current
        const move = (e) => {
          const box = name.getBoundingClientRect()
          sweep?.kill()
          sweep = null
          gsap.to(lamp, {
            x: e.clientX - box.left,
            y: e.clientY - box.top,
            r: box.height * 1.05,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: true,
          })
        }
        const leave = () => startSweep()
        if (fine) {
          footer.addEventListener('pointermove', move)
          footer.addEventListener('pointerleave', leave)
        }

        return () => {
          sweep?.kill()
          visible.kill()
          gsap.ticker.remove(render)
          footer.removeEventListener('pointermove', move)
          footer.removeEventListener('pointerleave', leave)
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const go = (id) => (e) => {
    e.preventDefault()
    scrollTo(id)
  }

  return (
    <footer ref={root} className="relative bg-ink px-5 pt-10 md:px-10">
      <div className="grid gap-10 border-t border-paper/10 pt-10 sm:grid-cols-2 lg:grid-cols-12">
        <div data-foot-col className="lg:col-span-4">
          <p className="label text-paper/45">Ritin Kumar Mandal</p>
          <p className="mt-4 max-w-xs text-paper/70">
            {profile.title} in {profile.location}, {profile.country}.
          </p>
        </div>
        <nav data-foot-col aria-label="Footer" className="lg:col-span-3">
          <p className="label text-paper/45">Index</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)} className="roll-host text-paper/75 hover:text-paper">
                  <RollText>{l.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div data-foot-col className="lg:col-span-3">
          <p className="label text-paper/45">Elsewhere</p>
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="u-line text-paper/75 hover:text-paper">
                LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="u-line text-paper/75 hover:text-paper">
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="u-line text-paper/75 hover:text-paper">
                Email
              </a>
            </li>
          </ul>
        </div>
        <div data-foot-col className="flex items-start lg:col-span-2 lg:justify-end">
          <button
            type="button"
            onClick={() => scrollTo('top')}
            className="group flex items-center gap-3 rounded-full border border-paper/20 py-2 pr-2 pl-5 transition-colors duration-500 hover:border-paper"
          >
            <span className="label">Back to top</span>
            <span className="grid size-9 place-items-center rounded-full bg-paper text-ink transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
              <ArrowUp size={16} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 text-paper/45">
        <p className="label">&copy; {YEAR} {profile.name}</p>
        <p className="label">Kolkata {time} IST</p>
        <p className="label">React · Tailwind CSS · GSAP · Lenis</p>
      </div>

      <div className="mt-6 overflow-hidden" aria-hidden="true">
        <p
          data-giant
          className="glow-text pb-[0.04em] text-center font-glow text-[clamp(3rem,15vw,19rem)] leading-[0.9] font-extrabold tracking-[-0.025em] whitespace-nowrap"
        >
          {profile.firstName} {profile.lastName}
        </p>
      </div>
    </footer>
  )
}
