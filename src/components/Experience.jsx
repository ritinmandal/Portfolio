import { useRef, useState } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { gsap, MQ, SCRAMBLE, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { experience } from '../data/profile'
import SectionHeader from './ui/SectionHeader'
import TechIcon from './ui/TechIcon'

const pad = (n) => String(n).padStart(2, '0')

function Role({ job, index, active }) {
  const lit = active >= index
  // Phones and tablets show the points behind a toggle; desktop always shows them.
  const [open, setOpen] = useState(false)
  const refresh = (e) => e.target === e.currentTarget && ScrollTrigger.refresh()
  return (
    <article data-role={index} className="relative pb-5 pl-6 last:pb-0 lg:pb-28 lg:pl-16">
      <span
        className={`absolute top-7 -left-[5px] size-[11px] lg:top-2 rounded-full border transition-all duration-700 ease-out-expo ${
          lit ? 'scale-125 border-accent bg-accent' : 'border-paper/30 bg-ink'
        }`}
        aria-hidden="true"
      />

      <div
        data-card
        className="flex flex-col rounded-2xl border border-paper/10 bg-ink-2 p-5 will-change-transform lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
      >
        <div data-meta className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p className="label text-paper/70">
            <time>{job.start}</time> <span className="text-paper/35">to</span> <time>{job.end}</time>
          </p>
          {job.location && (
            <p className="label flex items-center gap-1.5 text-paper/45">
              <MapPin size={12} aria-hidden="true" />
              {job.location}
            </p>
          )}
          {job.current && (
            <span className="label rounded-full bg-accent px-2.5 py-1 text-[0.65rem] text-ink">Current</span>
          )}
        </div>

        <h3 data-company data-skew className="display mt-4 text-[1.9rem] font-medium text-balance lg:mt-5 lg:text-[clamp(2.1rem,3.9vw,4rem)]">
          {job.company}
        </h3>
        <p data-role-title className="serif-i mt-1 text-[1.4rem] text-accent lg:mt-3 lg:text-[clamp(1.5rem,2.2vw,2.1rem)]">
          {job.role}
        </p>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="label mt-4 inline-flex items-center gap-2 self-start rounded-full border border-paper/15 px-3 py-2 text-paper/70 lg:hidden"
        >
          {open ? 'Hide details' : `Show details (${job.points.length})`}
          <ChevronDown size={14} className={`transition-transform duration-500 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        <div
          onTransitionEnd={refresh}
          className={`grid transition-[grid-template-rows] duration-700 ease-out-expo lg:grid-rows-[1fr] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <ul className="flex min-h-0 max-w-3xl flex-col gap-4 overflow-hidden pt-5 lg:pt-8">
            {job.points.map((p) => (
              <li key={p} data-point className="flex gap-3 text-[0.98rem] leading-relaxed text-paper/70 lg:gap-4 lg:text-[1.02rem]">
                <span className="mt-[0.7em] h-px w-5 shrink-0 bg-accent" aria-hidden="true" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2 lg:mt-8" aria-label="Technologies used">
          {job.stack.map((s) => (
            <li key={s} data-chip className="label inline-flex items-center gap-2 rounded-full border border-paper/15 px-3 py-1.5 text-paper/65">
              <TechIcon name={s} size={13} />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export default function Experience() {
  const root = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      // Active role drives the rolling counter and the timeline nodes (works without motion too).
      gsap.utils.toArray('[data-role]').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 62%',
          end: 'bottom 62%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })

      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          '[data-rail-fill]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-roles]', start: 'top 62%', end: 'bottom 62%', scrub: true },
          },
        )
        // A glowing comet rides the tip of the fill.
        gsap.fromTo(
          '[data-comet]',
          { y: 0 },
          {
            y: () => root.current.querySelector('[data-roles]').offsetHeight - 8,
            ease: 'none',
            scrollTrigger: { trigger: '[data-roles]', start: 'top 62%', end: 'bottom 62%', scrub: true, invalidateOnRefresh: true },
          },
        )

        gsap.utils.toArray('[data-role]').forEach((el) => {
          const words = SplitText.create(el.querySelector('[data-company]'), { type: 'words', mask: 'words' })
          const title = el.querySelector('[data-role-title]')
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 78%' } })
            .from(el.querySelector('[data-card]'), { rotationX: -24, y: 90, transformPerspective: 1200, transformOrigin: '50% 0%', duration: 1.6 })
            .from(words.words, { yPercent: 110, rotate: 4, stagger: 0.07, duration: 1.2 }, 0)
            .from(el.querySelectorAll('[data-meta]'), { y: 20, opacity: 0, stagger: 0.1, duration: 1 }, 0.1)
            .from(title, { opacity: 0, duration: 0.3 }, 0.2)
            .to(title, { scrambleText: { text: '{original}', chars: SCRAMBLE, speed: 0.6, revealDelay: 0.2 }, duration: 1.2, ease: 'none' }, 0.2)
            .from(el.querySelectorAll('[data-point]'), { y: 28, opacity: 0, stagger: 0.1, duration: 1 }, 0.3)
            .from(el.querySelectorAll('[data-chip]'), { scale: 0.7, opacity: 0, stagger: 0.04, duration: 0.7, ease: 'back.out(2)' }, 0.5)
        })

        gsap.from('[data-exp-title] > *', {
          yPercent: 110,
          stagger: 0.1,
          duration: 1.3,
          scrollTrigger: { trigger: '[data-exp-title]', start: 'top 85%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const job = experience[active]

  return (
    <section ref={root} id="experience" tabIndex={-1} className="relative px-5 py-28 md:px-10 md:py-40">
      <SectionHeader index="03" label="Experience" />

      <div className="mt-14 grid gap-16 md:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h2 data-exp-title className="display text-[clamp(3.25rem,6vw,6.5rem)] font-medium">
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="block">Where I&apos;ve</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <em className="serif-i block text-[1.08em] tracking-normal text-accent">built things.</em>
              </span>
            </h2>

            <div className="mt-12 hidden items-end gap-4 lg:flex" aria-hidden="true">
              <span className="display block h-[0.9em] overflow-hidden text-[7.5rem] leading-[0.9] font-light">
                <span
                  className="block transition-transform duration-1000 ease-out-expo"
                  style={{ transform: `translateY(${-active * 0.9}em)` }}
                >
                  {experience.map((_, i) => (
                    <span key={i} className="block h-[0.9em]">
                      {pad(i + 1)}
                    </span>
                  ))}
                </span>
              </span>
              <span className="pb-3">
                <span className="label block text-paper/40">/ {pad(experience.length)}</span>
                <span className="mt-2 block max-w-[12rem] text-sm text-paper/70">{job.role}</span>
              </span>
            </div>
          </div>
        </div>

        <div data-roles className="relative lg:col-span-8">
          <span className="absolute top-2 bottom-0 left-0 w-px bg-paper/10" aria-hidden="true" />
          <span data-rail-fill className="absolute top-2 bottom-0 left-0 w-px origin-top bg-accent" aria-hidden="true" />
          <span
            data-comet
            className="pointer-events-none absolute top-2 -left-[4px] z-10 hidden size-[9px] rounded-full bg-accent shadow-[0_0_0_4px_rgba(255,90,31,0.18),0_0_24px_6px_rgba(255,90,31,0.55)] will-change-transform motion-safe:block"
            aria-hidden="true"
          />
          {experience.map((j, i) => (
            <Role key={j.company} job={j} index={i} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}
