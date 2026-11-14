import { useRef } from 'react'
import { ArrowDown, ArrowDownRight, Download } from 'lucide-react'
import { gsap, MQ, SplitText, useGSAP } from '../lib/gsap'
import { facts, profile } from '../data/profile'
import { useScrollTo } from '../hooks/useLenis'
import Button from './ui/Button'
import DotField from './DotField'
import { weightWave } from '../hooks/useWeightWave'
import portrait640 from '../assets/hero/ritin-portrait-640.webp'
import portrait1024 from '../assets/hero/ritin-portrait-1024.webp'

const websites = facts.find((f) => f.label.startsWith('Production-ready'))
const [roleA, roleB] = profile.title.split(' ')

export default function Hero({ start }) {
  const root = useRef(null)
  const intro = useRef(null)
  const scrollTo = useScrollTo()

  // Build the intro once (paused), the scroll-out slide and the pointer depth.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const splits = gsap.utils
          .toArray('[data-split]')
          .map((el) => SplitText.create(el, { type: 'chars', mask: 'chars', charsClass: 'char', aria: 'none' }))
        const [first, last] = splits
        const middle = SplitText.create('[data-type-mid]', { type: 'chars', charsClass: 'char', aria: 'none' })
        const role = SplitText.create('[data-role-line]', { type: 'chars', mask: 'chars', charsClass: 'char', aria: 'none' })

        // Typewriter: the name's letters appear one at a time with a caret riding the last one,
        // a short pause between "Ritin", "Kumar" and "Mandal", then the caret blinks and fades.
        const name = root.current.querySelector('[data-name]')
        const caret = root.current.querySelector('[data-caret]')
        const place = (c, after = true) => {
          const b = name.getBoundingClientRect()
          const r = c.getBoundingClientRect()
          gsap.set(caret, {
            x: (after ? r.right : r.left) - b.left + r.height * 0.03,
            y: r.top - b.top + r.height * 0.14,
            height: r.height * 0.7,
          })
        }
        const typeName = (words) => {
          const letters = words.flat()
          gsap.set(letters, { autoAlpha: 0 })
          const tl = gsap.timeline().set(caret, { autoAlpha: 1 }, 0).call(place, [letters[0], false], 0)
          let t = 0.25
          words.forEach((word) => {
            word.forEach((c) => {
              tl.set(c, { autoAlpha: 1 }, t).call(place, [c], t)
              t += gsap.utils.random(0.06, 0.12)
            })
            t += 0.22
          })
          return tl.to(caret, { autoAlpha: 0, duration: 0.4 }, t + 1.4)
        }

        intro.current = gsap
          .timeline({ paused: true, defaults: { ease: 'expo.out' } })
          .from('[data-dots-in]', { opacity: 0, scale: 1.15, duration: 2.4, ease: 'power2.out' }, 0)
          // Portrait rises out of the floor while the photo settles from a slow zoom.
          .from('[data-portrait-in]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.9, ease: 'expo.inOut' }, 0)
          .from('[data-portrait-img]', { scale: 1.3, duration: 2.6 }, 0)
          .from('[data-portrait-glow]', { opacity: 0, duration: 2.2, ease: 'power2.out' }, 0.7)
          .from(role.chars, { yPercent: 115, rotate: 10, stagger: 0.03, duration: 1.3 }, 0.2)
          .from('[data-role-rule]', { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, 0.25)
          .add(typeName([first.chars, middle.chars, last.chars]), 0.75)
          .from('[data-rise]', { y: 30, opacity: 0, stagger: 0.08, duration: 1.2 }, 0.8)
          .from('[data-pop]', { scale: 0.6, opacity: 0, stagger: 0.1, duration: 1, ease: 'back.out(1.6)' }, 1)
          .from('[data-orbit-in]', { scale: 0, rotate: -120, opacity: 0, duration: 1.8 }, 0.9)

        // The glow behind the portrait breathes.
        gsap.to('[data-portrait-glow]', { scale: 1.15, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true })

        // Scroll out: the lines slide apart sideways in alternating directions.
        const slide = (dir) => () => dir * window.innerWidth * 0.4
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
            defaults: { ease: 'none' },
          })
          .to('[data-line="0"]', { x: slide(1) }, 0)
          .to('[data-line="1"]', { x: slide(-1) }, 0)
          .to('[data-line="2"]', { x: slide(1) }, 0)
          .to('[data-dots]', { scale: 1.45, opacity: 0.25 }, 0)
          .to('[data-orbit]', { rotate: 220, scale: 2.4, opacity: 0 }, 0)
      })

      // Desktop only: the hero fits one screen there, so the portrait and intro can leave with it.
      // On phones the hero is taller than the screen and they would fade while being read.
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
            defaults: { ease: 'none' },
          })
          .to('[data-portrait]', { yPercent: 16, opacity: 0.2 }, 0)
          .to('[data-portrait-in]', { scale: 1.12 }, 0)
          .to('[data-foot]', { yPercent: -60, opacity: 0 }, 0)
      })

      // Fine pointers: layers drift by depth and the name's letters swell toward the cursor.
      mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
        const layers = gsap.utils.toArray('[data-depth]').map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
        }))
        const move = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          layers.forEach((l) => {
            l.x(nx * l.depth)
            l.y(ny * l.depth)
          })
        }
        window.addEventListener('pointermove', move, { passive: true })
        const stopWave = weightWave(gsap.utils.toArray('[data-split] .char, [data-role-line] .char'), { min: 500, max: 700, radius: 320 })
        return () => {
          window.removeEventListener('pointermove', move)
          stopWave()
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (start) intro.current?.play()
    },
    { dependencies: [start], revertOnUpdate: false },
  )

  const go = (id) => (e) => {
    e.preventDefault()
    scrollTo(id)
  }

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden px-5 pt-28 pb-6 md:px-10 md:pt-32 md:pb-8"
    >
      <div data-dots className="absolute inset-0 will-change-transform" aria-hidden="true">
        <div data-dots-in className="absolute inset-0">
          <div data-depth="-30" className="absolute -inset-10">
            <DotField className="absolute inset-0 size-full" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-ink)_85%)]" />
        </div>
      </div>

      <div className="relative z-10 flex items-start justify-between gap-4">
        <p data-rise className="label text-paper/55">
          Portfolio <span className="text-paper/30">/</span> 2026
        </p>
        <p data-rise className="label hidden text-paper/55 sm:block">
          {profile.location} <span className="text-paper/30">·</span> {profile.country}
        </p>
      </div>

      {/* Left column: role, name, intro and actions. The portrait owns the right side on desktop. */}
      <div className="relative z-10 flex flex-col justify-center pt-10 pb-6 lg:max-w-[60%] lg:flex-1 lg:py-6">
        <h1 className="sr-only">
          {profile.name}, {profile.title}
        </h1>
        <div data-name data-depth="24" aria-hidden="true" className="relative will-change-transform [transform-style:preserve-3d]">
          <span data-caret className="pointer-events-none invisible absolute top-0 left-0 z-10 w-[0.18em] max-w-1 min-w-[3px]">
            <span className="caret-blink block size-full rounded-full bg-accent" />
          </span>
          <p data-line="0" className="flex items-center gap-[0.35em] text-[clamp(1.75rem,3.4vw,3.6rem)] leading-none will-change-transform">
            <span data-role-rule className="h-px w-[1.4em] origin-left bg-accent" />
            <span data-role-line className="display font-medium tracking-[-0.04em]">
              {roleA}
            </span>
            <span data-role-line className="serif-i pb-[0.08em] text-[1.08em] text-accent">
              {roleB}.
            </span>
          </p>

          <div data-line="1" className="mt-[0.18em] flex items-end gap-[0.18em] text-[22vw] will-change-transform lg:text-[clamp(5rem,13.2vw,14rem)]">
            <span data-split className="display block font-medium">
              {profile.firstName}
            </span>
            <span data-type-mid className="serif-i mb-[0.16em] block text-[0.3em] leading-none text-accent">
              {profile.middleName}
            </span>
          </div>
          <div data-line="2" className="text-[22vw] will-change-transform lg:text-[clamp(5rem,13.2vw,14rem)]">
            <span data-split className="display block font-medium">
              {profile.lastName}
            </span>
          </div>
        </div>
      </div>

      {/* Portrait: in the flow on small screens, fills the right side of the hero on desktop. */}
      <div
        data-portrait
        className="relative mx-auto mt-2 mb-10 aspect-[4/5] w-full max-w-md will-change-transform lg:absolute lg:right-0 lg:bottom-0 lg:m-0 lg:aspect-auto lg:h-[calc(100%-5.5rem)] lg:w-[44%] lg:max-w-none"
      >
        <div data-depth="-16" className="absolute inset-0">
          <span
            data-portrait-glow
            className="pointer-events-none absolute top-[6%] left-[18%] aspect-square w-[70%] rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.22),rgba(255,90,31,0.06)_45%,transparent_68%)] will-change-transform"
            aria-hidden="true"
          />
          <div data-portrait-in className="portrait-mask absolute inset-0 will-change-transform">
            <img
              data-portrait-img
              src={portrait1024}
              srcSet={`${portrait640} 640w, ${portrait1024} 1024w`}
              sizes="(min-width: 1024px) 44vw, 90vw"
              alt={`Portrait of ${profile.name} in a dark three-piece suit, seated and looking to the side.`}
              width="1024"
              height="954"
              decoding="async"
              fetchPriority="high"
              className="size-full object-cover object-[52%_30%] will-change-transform"
            />
          </div>
        </div>

        <div
          data-orbit
          data-depth="-50"
          className="pointer-events-none absolute top-[10%] left-[0%] hidden size-[clamp(6.5rem,10vw,9.5rem)] md:block lg:-left-[4%]"
          aria-hidden="true"
        >
          <div data-orbit-in className="relative size-full">
            <svg viewBox="0 0 200 200" className="spin-slow size-full">
              <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeDasharray="2 7" className="text-paper/30" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" className="text-paper/10" />
              <circle cx="100" cy="4" r="5" className="fill-accent" />
              <circle cx="30" cy="100" r="2.5" className="fill-paper/60" />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-accent">
              <ArrowDownRight size={30} strokeWidth={1.25} />
            </span>
          </div>
        </div>

        <div data-depth="40" className="absolute bottom-[10%] -left-[2%] lg:bottom-[24%] lg:left-[6%] xl:-left-[8%]">
          <p
            data-pop
            className="flex items-center gap-2.5 rounded-full border border-paper/15 bg-ink/70 py-2 pr-4 pl-3 text-[0.8rem] text-paper/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
          >
            <span className="pulse-dot size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-paper">{profile.title}</span>
          </p>
        </div>

        {websites && (
          <div data-depth="-36" className="absolute top-[56%] -right-1 lg:top-[30%] lg:right-[10%]">
            <p
              data-pop
              className="rounded-2xl border border-paper/15 bg-ink/70 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
            >
              <span className="display block text-3xl leading-none font-light">
                {websites.value}
                <span className="text-accent">{websites.suffix}</span>
              </span>
              <span className="label mt-1.5 block text-[0.62rem] text-paper/55">
                Production-ready
                <br />
                websites
              </span>
            </p>
          </div>
        )}
      </div>

      <div data-foot data-depth="14" className="relative z-10 flex flex-col gap-8 lg:max-w-[56%] lg:flex-row lg:items-end lg:gap-10">
        <a
          href="#about"
          onClick={go('about')}
          data-rise
          className="group hidden shrink-0 items-center gap-3 xl:flex"
          aria-label="Scroll to About"
        >
          <span className="relative h-12 w-px overflow-hidden bg-paper/15">
            <span className="scroll-cue absolute inset-0 bg-accent" />
          </span>
          <span className="label text-paper/55 transition-colors group-hover:text-paper">Scroll</span>
          <ArrowDown size={14} className="text-paper/55" aria-hidden="true" />
        </a>
        <div className="w-full">
          <p data-rise className="max-w-lg text-[1.05rem] leading-relaxed text-paper/70 md:text-lg">
            {profile.intro}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span data-pop>
              <Button href="#work" onClick={go('work')} icon={ArrowDownRight}>
                Selected work
              </Button>
            </span>
            <span data-pop>
              <Button href="#contact" onClick={go('contact')} variant="outline">
                Get in touch
              </Button>
            </span>
            <span data-pop>
              <Button href={profile.resume} download={profile.resumeFile} icon={Download} variant="outline">
                Resume
              </Button>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
