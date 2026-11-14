import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { expertise, softSkills } from '../data/profile'
import SectionHeader from './ui/SectionHeader'
import TechIcon from './ui/TechIcon'
import { brandColor } from '../data/techIcons'

const total = String(expertise.length).padStart(2, '0')

function Panel({ group, index }) {
  return (
    <article
      data-panel
      className="relative flex flex-col border-t max-lg:hidden border-paper/10 py-12 group-data-[mode=h]/skills:h-full group-data-[mode=h]/skills:w-[min(44rem,58vw)] group-data-[mode=h]/skills:shrink-0 group-data-[mode=h]/skills:border-t-0 group-data-[mode=h]/skills:border-l group-data-[mode=h]/skills:px-12 group-data-[mode=h]/skills:py-0 group-data-[mode=h]/skills:pt-[21vh] group-data-[mode=h]/skills:pb-[14vh]"
    >
      <span
        data-panel-num
        className="display outline-text pointer-events-none absolute right-0 bottom-[6vh] hidden text-[32vh] leading-none font-medium text-paper/25 group-data-[mode=h]/skills:block"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div data-panel-body className="relative will-change-transform">
        <div>
          <p className="label flex items-center gap-3 text-paper/50">
            <span className="text-accent">{String(index + 1).padStart(2, '0')}</span>
            <span>/ {total}</span>
            <span className="h-px w-10 bg-paper/20" aria-hidden="true" />
            <span>{group.title}</span>
          </p>
          <h3
            data-panel-title
            data-skew
            aria-label={group.title}
            className="display mt-6 overflow-hidden pb-[0.08em] text-[clamp(3.5rem,8vw,8.5rem)] font-medium"
          >
            {group.short}
          </h3>
        </div>

        <ul
          className={`relative mt-10 grid grid-cols-1 border-t border-paper/10 ${
            group.items.length > 6 ? 'sm:grid-cols-2 sm:gap-x-8' : ''
          }`}
        >
          {group.items.map((item) => (
            <li key={item} data-item className="border-b border-paper/10">
              <span
                className="group flex items-center justify-between gap-4 py-3 text-[clamp(1.15rem,1.7vw,1.7rem)] tracking-tight text-paper/80 transition-colors duration-500 hover:text-paper"
                style={{ '--brand': brandColor(item) ?? 'var(--color-accent)' }}
              >
                <span className="flex items-center gap-3 transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
                  <TechIcon
                    name={item}
                    size="0.95em"
                    className="text-paper/45 transition-all duration-500 ease-out-expo group-hover:-rotate-12 group-hover:scale-125 group-hover:text-(--brand)"
                  />
                  {item}
                </span>
                <ArrowRight
                  size={20}
                  className="shrink-0 -translate-x-3 text-accent opacity-0 transition-all duration-700 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/** Phones and tablets: one compact card per group, tools as logo chips in brand colour. */
function MobileGroups() {
  return (
    <div className="flex flex-col gap-3 pb-16 lg:hidden">
      {expertise.map((g, i) => (
        <article key={g.title} data-m-group className="rounded-2xl border border-paper/10 bg-ink-2 p-5 will-change-transform">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="display text-[2.25rem] leading-none font-medium">{g.short}</h3>
            <span className="label text-paper/40">
              <span className="text-accent">{String(i + 1).padStart(2, '0')}</span> / {total}
            </span>
          </div>
          <p className="label mt-2 text-paper/45">{g.title}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {g.items.map((item) => (
              <li
                key={item}
                data-m-chip
                className="inline-flex items-center gap-2 rounded-full border border-paper/10 bg-paper/[0.03] px-3 py-1.5 text-[0.9rem] text-paper/85"
              >
                <span className="grid" style={{ color: brandColor(item) }}>
                  <TechIcon name={item} size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

export default function Skills() {
  const root = useRef(null)
  const track = useRef(null)
  const marquee = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Desktop: pin the section and travel the panels sideways.
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        root.current.dataset.mode = 'h'
        const distance = () => track.current.scrollWidth - window.innerWidth

        const travel = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-pin]',
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        gsap.fromTo('[data-progress]', { scaleX: 0 }, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-pin]', start: 'top top', end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
        })

        gsap.utils.toArray('[data-panel]').forEach((panel) => {
          const title = SplitText.create(panel.querySelector('[data-panel-title]'), { type: 'chars', aria: 'none' })
          gsap
            .timeline({
              scrollTrigger: { trigger: panel, containerAnimation: travel, start: 'left 85%', toggleActions: 'play none none reverse' },
            })
            .from(title.chars, { yPercent: 110, rotationX: -80, transformPerspective: 600, transformOrigin: '50% 100%', stagger: 0.04, duration: 1.1 })
            .from(panel.querySelectorAll('[data-item]'), { y: 30, x: 40, opacity: 0, stagger: 0.05, duration: 0.9 }, 0.15)

          // Each panel swings in on its Y axis like a page turning toward you, then leans away.
          gsap.fromTo(
            panel.querySelector('[data-panel-body]'),
            { rotationY: -28, transformPerspective: 1400, transformOrigin: '0% 50%', opacity: 0.25 },
            {
              rotationY: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: panel, containerAnimation: travel, start: 'left right', end: 'left 35%', scrub: true },
            },
          )
          // The giant index drifts at its own speed behind the content.
          gsap.fromTo(
            panel.querySelector('[data-panel-num]'),
            { xPercent: 60 },
            {
              xPercent: -40,
              ease: 'none',
              scrollTrigger: { trigger: panel, containerAnimation: travel, start: 'left right', end: 'right left', scrub: true },
            },
          )
        })

        return () => {
          if (root.current) delete root.current.dataset.mode
        }
      })

      // Below desktop: group cards rise one by one and their chips pop in.
      mm.add(`${MQ.motion} and (max-width: 1023px)`, () => {
        gsap.utils.toArray('[data-m-group]').forEach((card) => {
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: 'top 88%' } })
            .from(card, { y: 50, rotationX: -16, transformPerspective: 900, transformOrigin: '50% 100%', opacity: 0, duration: 1.1 })
            .from(card.querySelectorAll('[data-m-chip]'), { scale: 0.6, opacity: 0, stagger: 0.035, duration: 0.6, ease: 'back.out(2)' }, 0.25)
        })
      })

      // Soft-skills marquee: loops forever, flips direction with the scroll.
      mm.add(MQ.motion, () => {
        const loop = gsap.to(marquee.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 }).totalTime(40 * 100)
        ScrollTrigger.create({
          trigger: marquee.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-4, 4, self.getVelocity() / 300)
            gsap.to(loop, { timeScale: self.direction === 1 ? 1 + Math.abs(v) : -1 - Math.abs(v), duration: 0.4, overwrite: true })
          },
        })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  const row = [...softSkills, ...softSkills]

  return (
    <section ref={root} id="skills" tabIndex={-1} className="group/skills relative">
      <div data-pin className="relative group-data-[mode=h]/skills:h-svh group-data-[mode=h]/skills:overflow-hidden">
        <div
          ref={track}
          className="px-5 pt-28 md:px-10 md:pt-40 group-data-[mode=h]/skills:flex group-data-[mode=h]/skills:h-full group-data-[mode=h]/skills:w-max group-data-[mode=h]/skills:items-stretch group-data-[mode=h]/skills:p-0 group-data-[mode=h]/skills:will-change-transform"
        >
          <div className="pb-14 group-data-[mode=h]/skills:flex group-data-[mode=h]/skills:h-full group-data-[mode=h]/skills:w-[44vw] group-data-[mode=h]/skills:shrink-0 group-data-[mode=h]/skills:flex-col group-data-[mode=h]/skills:justify-between group-data-[mode=h]/skills:px-10 group-data-[mode=h]/skills:pt-32 group-data-[mode=h]/skills:pb-[12vh]">
            <SectionHeader index="02" label="Skills & expertise" />
            <div className="mt-14">
              <h2 className="display text-[clamp(3.5rem,7.5vw,8rem)] font-medium">
                Areas of
                <br />
                <em className="serif-i text-[1.08em] tracking-normal text-accent">expertise.</em>
              </h2>
              <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-paper/65">
                The stack and practices behind the interfaces I ship, from component architecture and API
                integration to payments, CMS builds and AI-assisted development.
              </p>
            </div>
            <p className="label mt-10 hidden items-center gap-3 text-paper/45 group-data-[mode=h]/skills:flex">
              Keep scrolling <ArrowRight size={14} aria-hidden="true" />
            </p>
          </div>

          {expertise.map((g, i) => (
            <Panel key={g.title} group={g} index={i} />
          ))}
          <MobileGroups />
          <div className="hidden w-[8vw] shrink-0 group-data-[mode=h]/skills:block" aria-hidden="true" />
        </div>

        <div className="absolute inset-x-10 bottom-10 hidden h-px bg-paper/10 group-data-[mode=h]/skills:block" aria-hidden="true">
          <span data-progress className="block h-full origin-left bg-accent" />
        </div>
      </div>

      <div className="border-y border-paper/10 py-8 md:py-10">
        <h3 className="sr-only">Soft skills</h3>
        <ul className="sr-only">
          {softSkills.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div className="overflow-hidden" aria-hidden="true">
          <div ref={marquee} className="marquee">
            {row.map((s, i) => (
              <span key={i} className="flex shrink-0 items-center">
                <span
                  className={`px-6 text-[clamp(2rem,4.5vw,4.5rem)] tracking-tight whitespace-nowrap md:px-10 ${
                    i % 2 ? 'serif-i text-paper/80' : 'display font-medium text-paper'
                  }`}
                >
                  {s}
                </span>
                <span className="size-2.5 rounded-full bg-accent" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
