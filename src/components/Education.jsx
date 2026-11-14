import { useRef } from 'react'
import { GraduationCap, Award } from 'lucide-react'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { education, languages } from '../data/profile'
import SectionHeader from './ui/SectionHeader'

function Years({ from, to }) {
  const text = (
    <>
      {from}
      <span className="serif-i px-[0.12em] text-[0.7em]">to</span>
      {to}
    </>
  )
  return (
    <span data-years-drift data-skew className="display relative block text-[clamp(3.25rem,8.5vw,9rem)] font-light whitespace-nowrap will-change-transform">
      <span className="outline-text block text-paper/45">{text}</span>
      <span data-fill className="absolute inset-0 block text-paper [clip-path:inset(0_0_0_0)]" aria-hidden="true">
        {text}
      </span>
    </span>
  )
}

export default function Education() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from('[data-edu-title] > span > *', {
          yPercent: 110,
          stagger: 0.1,
          duration: 1.3,
          scrollTrigger: { trigger: '[data-edu-title]', start: 'top 85%' },
        })

        gsap.utils.toArray('[data-edu]').forEach((row, i) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: 'top 82%' } })
            .from(row.querySelector('[data-edu-rule]'), { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut' })
            .from(row.querySelectorAll('[data-edu-text]'), { y: 30, opacity: 0, stagger: 0.08, duration: 1.1 }, 0.35)
            .from(row.querySelector('[data-years]'), { x: -60, opacity: 0, duration: 1.4 }, 0.2)

          // The years glide sideways at their own pace (alternating direction per row).
          gsap.fromTo(
            row.querySelector('[data-years-drift]'),
            { xPercent: i % 2 ? 12 : -12 },
            { xPercent: i % 2 ? -8 : 8, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true } },
          )

          // Outlined years fill with solid ink as the row scrolls through.
          gsap.fromTo(
            row.querySelector('[data-fill]'),
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top 75%', end: 'center 40%', scrub: true },
            },
          )
        })

        gsap.from('[data-lang]', {
          yPercent: 110,
          rotationX: -70,
          transformPerspective: 600,
          transformOrigin: '50% 100%',
          stagger: 0.08,
          duration: 1.2,
          scrollTrigger: { trigger: '[data-langs]', start: 'top 85%' },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="education" tabIndex={-1} className="relative px-5 py-28 md:px-10 md:py-40">
      <SectionHeader index="04" label="Education" />

      <h2 data-edu-title className="display mt-14 text-[clamp(3.25rem,7vw,7.5rem)] font-medium md:mt-20">
        <span className="block overflow-hidden pb-[0.06em]">
          <span className="block">Education &amp;</span>
        </span>
        <span className="block overflow-hidden pb-[0.1em]">
          <em className="serif-i block text-[1.08em] tracking-normal text-accent">certification.</em>
        </span>
      </h2>

      <div className="mt-16 md:mt-24">
        {education.map((e) => {
          const Icon = e.kind === 'Degree' ? GraduationCap : Award
          return (
            <article key={e.title} data-edu className="relative grid gap-8 py-12 md:py-16 lg:grid-cols-12 lg:gap-12">
              <span data-edu-rule className="absolute inset-x-0 top-0 h-px bg-paper/15" aria-hidden="true" />
              <div data-years className="lg:col-span-6" aria-hidden="true">
                <Years from={e.from} to={e.to} />
              </div>
              <div className="lg:col-span-6 lg:pt-4">
                <p data-edu-text className="label flex items-center gap-2.5 text-accent">
                  <Icon size={15} aria-hidden="true" />
                  {e.kind}
                </p>
                <h3 data-edu-text className="mt-5 text-[clamp(1.75rem,2.8vw,2.75rem)] leading-[1.08] font-medium tracking-[-0.03em]">
                  {e.title}
                </h3>
                <p data-edu-text className="serif-i mt-2 text-[clamp(1.35rem,1.9vw,1.75rem)] text-paper/75">
                  {e.field}
                </p>
                <p data-edu-text className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-paper/60">
                  <span className="text-paper">{e.school}</span>
                  {e.location && <span>{e.location}</span>}
                  <span className="label self-center text-paper/45">{e.period}</span>
                </p>
                {e.detail && (
                  <p data-edu-text className="mt-6 max-w-xl leading-relaxed text-paper/65">
                    {e.detail}
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <div data-langs className="relative mt-8 grid gap-8 border-t border-paper/15 pt-12 md:mt-12 lg:grid-cols-12 lg:gap-12">
        <h3 className="label text-paper/55 lg:col-span-6">Languages</h3>
        <ul className="flex flex-wrap gap-x-8 gap-y-2 lg:col-span-6">
          {languages.map((l, i) => (
            <li key={l} className="overflow-hidden">
              <span
                data-lang
                className={`block text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.1] tracking-tight ${
                  i % 2 ? 'serif-i text-paper/75' : 'display font-medium'
                }`}
              >
                {l}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
