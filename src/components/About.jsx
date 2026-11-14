import { useRef } from 'react'
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { facts, profile } from '../data/profile'
import SectionHeader from './ui/SectionHeader'

const BADGE = `${profile.title} · ${profile.location} · ${profile.country} · `

function Badge() {
  return (
    <div className="relative size-36 md:size-44" aria-hidden="true">
      <svg data-badge-spin viewBox="0 0 200 200" className="size-full">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-paper/60 font-mono text-[13px] uppercase tracking-[0.2em]">
          <textPath href="#badge-circle">{BADGE}</textPath>
        </text>
      </svg>
      <span className="serif-i absolute inset-0 grid place-items-center text-5xl text-accent">r</span>
    </div>
  )
}

export default function About() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // Statement: every word starts dim and brightens as the paragraph scrolls through.
        const split = SplitText.create('[data-statement]', { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.12, yPercent: 35, rotate: 3 },
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            stagger: 0.08,
            ease: 'none',
            scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 55%', scrub: true },
          },
        )

        // Badge text spins on its own and whips round faster (either way) with the scroll speed.
        const spin = gsap.to('[data-badge-spin]', { rotate: 360, duration: 22, ease: 'none', repeat: -1 })
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-10, 10, self.getVelocity() / 120)
            gsap.to(spin, { timeScale: v || 1, duration: 0.25, overwrite: true })
            gsap.to(spin, { timeScale: 1, duration: 1.4, delay: 0.25, ease: 'power2.out' })
          },
        })

        // Giant outline title slides across the top of the section.
        gsap.fromTo(
          '[data-drift]',
          { xPercent: 8 },
          { xPercent: -38, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )

        // Badge drifts against the scroll.
        gsap.fromTo(
          '[data-badge]',
          { y: 80 },
          { y: -80, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )

        gsap.from('[data-summary] p', {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-summary]', start: 'top 85%' },
        })

        // Facts: rules sweep, numbers count up.
        gsap.utils.toArray('[data-fact]').forEach((fact, i) => {
          const num = fact.querySelector('[data-num]')
          const target = Number(num.dataset.num)
          const counter = { v: 0 }
          num.textContent = '0'
          gsap
            .timeline({ scrollTrigger: { trigger: fact, start: 'top 88%' }, delay: i * 0.12 })
            .from(fact.querySelector('[data-fact-rule]'), { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'expo.inOut' })
            .to(
              counter,
              {
                v: target,
                duration: 1.6,
                ease: 'power3.out',
                onUpdate: () => (num.textContent = Math.round(counter.v)),
              },
              0.2,
            )
            .from(fact.querySelector('[data-fact-label]'), { y: 16, opacity: 0, duration: 1 }, 0.4)
        })

        return () => gsap.utils.toArray('[data-num]').forEach((n) => (n.textContent = n.dataset.num))
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" tabIndex={-1} className="relative px-5 py-28 md:px-10 md:py-40">
      <div className="pointer-events-none -mx-5 mb-16 overflow-hidden md:-mx-10 md:mb-24" aria-hidden="true">
        <p
          data-drift
          className="display text-[clamp(5rem,15vw,16rem)] font-medium whitespace-nowrap text-paper/[0.07] will-change-transform"
        >
          {profile.title} <span className="serif-i text-accent/40">·</span> {profile.location}{' '}
          <span className="serif-i text-accent/40">·</span> {profile.title}
        </p>
      </div>

      <SectionHeader index="01" label="About" />

      <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div data-badge className="will-change-transform lg:sticky lg:top-32">
            <Badge />
          </div>
        </div>

        <div className="lg:col-span-9">
          <h2 className="sr-only">About {profile.name}</h2>
          <p
            data-statement
            className="text-[clamp(1.75rem,3.7vw,3.75rem)] leading-[1.12] font-normal tracking-[-0.03em] text-paper"
          >
            {profile.statement.map((s, i) => (
              <span key={i}>
                {s.em ? <em className="serif-i text-[1.08em] text-accent">{s.text}</em> : s.text}{' '}
              </span>
            ))}
          </p>

          <div data-summary className="mt-16 grid gap-8 text-[1.05rem] leading-relaxed text-paper/65 md:mt-24 md:grid-cols-2 md:gap-12">
            {profile.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {profile.domains.map((d) => (
              <span key={d} className="label rounded-full border border-paper/15 px-3 py-1.5 text-paper/70">
                {d}
              </span>
            ))}
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-28 lg:gap-10 xl:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} data-fact>
                <span data-fact-rule className="mb-4 block h-px bg-paper/20 lg:mb-6" aria-hidden="true" />
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="display block text-[3.25rem] font-light lg:text-[clamp(4rem,8vw,7.5rem)]">
                    <span data-num={f.value}>{f.value}</span>
                    <span className="text-accent">{f.suffix}</span>
                  </span>
                  <span data-fact-label className="mt-2 block max-w-[16rem] text-[0.9rem] text-paper/60 lg:mt-3 lg:text-base" aria-hidden="true">
                    {f.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
