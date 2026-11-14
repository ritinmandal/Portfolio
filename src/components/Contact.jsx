import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy, Download, Mail, MapPin, Phone } from 'lucide-react'
import { gsap, MQ, SCRAMBLE, SplitText, useGSAP } from '../lib/gsap'
import { useLocalTime } from '../hooks/useLocalTime'
import { profile } from '../data/profile'
import SectionHeader from './ui/SectionHeader'
import Magnetic from './ui/Magnetic'
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons'

// Card hover flood colours: LinkedIn takes its brand blue, the rest the site accent.
const cards = [
  { icon: Phone, label: 'Phone', value: profile.phone, href: profile.phoneHref, flood: 'rgba(255,90,31,0.07)' },
  { icon: MapPin, label: 'Based in', value: `${profile.location}, ${profile.country}`, flood: 'rgba(255,90,31,0.07)', clock: true },
  { icon: LinkedinIcon, label: 'LinkedIn', value: 'in/ritin-mandal', href: profile.linkedin, external: true, flood: 'rgba(10,102,194,0.2)' },
  { icon: GithubIcon, label: 'GitHub', value: '@ritinmandal', href: profile.github, external: true, flood: 'rgba(239,235,227,0.05)' },
]

const cardBase =
  'spot-card group relative isolate flex flex-col justify-between overflow-hidden rounded-2xl bg-ink-2 will-change-transform'

function IconTile({ icon: Icon }) {
  return (
    // Outer span is animated by GSAP on entry; the inner one owns the hover twist.
    <span data-tile className="relative z-10 block">
      <span className="grid size-10 place-items-center rounded-xl lg:size-12 bg-paper/[0.06] text-paper/80 ring-1 ring-paper/10 transition-all duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-accent/15 group-hover:text-accent group-hover:ring-accent/40">
        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      </span>
    </span>
  )
}

/** Colour that spreads from the bottom-left corner on hover. */
function Flood({ color }) {
  return (
    <span
      className="pointer-events-none absolute -bottom-1/2 -left-1/2 -z-10 aspect-square w-[200%] scale-0 rounded-full transition-transform duration-[900ms] ease-out-expo group-hover:scale-100"
      style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      aria-hidden="true"
    />
  )
}

function Card({ icon, label, value, href, external, flood, clock, time }) {
  const Tag = href ? 'a' : 'div'
  return (
    <Tag
      data-card
      {...(href ? { href } : {})}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${cardBase} min-h-[9.5rem] p-4 lg:min-h-[12rem] lg:p-7`}
    >
      <Flood color={flood} />
      <span className="relative z-10 flex items-start justify-between">
        <IconTile icon={icon} />
        {href && (
          <span className="grid size-8 place-items-center rounded-full border border-paper/15 lg:size-9 text-paper/70 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-paper/35 group-hover:bg-paper/10 group-hover:text-paper">
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        )}
      </span>
      <span className="relative z-10 mt-5 block lg:mt-8">
        <span data-card-label className="label block text-paper/45">
          {label}
        </span>
        <span className="mt-1.5 block text-[0.95rem] leading-snug font-medium tracking-tight break-words text-paper lg:mt-2 lg:text-xl">{value}</span>
        {clock && (
          <span className="label mt-3 flex items-center gap-2 text-paper/55">
            <span className="pulse-dot size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {time} IST · local time
          </span>
        )}
      </span>
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </Tag>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2200)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: profile.email })
      document.body.append(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="label inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2.5 text-paper/80 transition-colors duration-500 hover:border-paper hover:text-paper"
    >
      {copied ? <Check size={14} className="text-accent" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  )
}

export default function Contact() {
  const root = useRef(null)
  const time = useLocalTime(profile.timeZone)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // The section rises over the work as an arch that flattens out.
        const radius = getComputedStyle(root.current).borderTopLeftRadius
        gsap.fromTo(
          root.current,
          { borderTopLeftRadius: '48vw', borderTopRightRadius: '48vw' },
          {
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true },
          },
        )
        gsap.from('[data-cta-inner]', {
          y: 160,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true },
        })

        // Letters converge from scattered positions.
        const split = SplitText.create('[data-cta-title] [data-line]', { type: 'words,chars', aria: 'none' })
        gsap.from(split.chars, {
          x: () => gsap.utils.random(-260, 260),
          y: () => gsap.utils.random(-120, 160),
          rotate: () => gsap.utils.random(-40, 40),
          opacity: 0,
          duration: 1.6,
          ease: 'expo.out',
          stagger: { each: 0.025, from: 'random' },
          scrollTrigger: { trigger: '[data-cta-title]', start: 'top 80%' },
        })

        gsap
          .timeline({ scrollTrigger: { trigger: '[data-email]', start: 'top 90%' } })
          .from('[data-email-text]', { yPercent: 110, duration: 1.3 })
          .from('[data-email-line]', { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'expo.inOut' }, 0.1)
          .from('[data-hello]', { scale: 0, rotate: -90, duration: 1.4, ease: 'expo.out' }, 0.2)

        // Cards tip up out of the floor one after another, then their icons pop.
        gsap
          .timeline({ scrollTrigger: { trigger: '[data-details]', start: 'top 88%' } })
          .from('[data-card]', {
            y: 80,
            rotationX: -28,
            transformPerspective: 1200,
            transformOrigin: '50% 100%',
            opacity: 0,
            stagger: 0.09,
            duration: 1.3,
          })
          .from('[data-tile]', { scale: 0, rotate: -45, stagger: 0.09, duration: 1, ease: 'back.out(2)' }, 0.25)
          .from('[data-at]', { scale: 0.4, rotate: -40, opacity: 0, duration: 1.6 }, 0.2)
      })
      // Fine pointers: an accent spotlight trails the cursor and the address scrambles on hover.
      mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
        const section = root.current
        const spot = section.querySelector('[data-spot]')
        const sx = gsap.quickTo(spot, 'x', { duration: 1.1, ease: 'power3.out' })
        const sy = gsap.quickTo(spot, 'y', { duration: 1.1, ease: 'power3.out' })
        const move = (e) => {
          const r = section.getBoundingClientRect()
          sx(e.clientX - r.left)
          sy(e.clientY - r.top)
        }
        const email = section.querySelector('[data-email-text]')
        const scramble = () =>
          gsap.to(email, { scrambleText: { text: profile.email, chars: SCRAMBLE, speed: 0.8 }, duration: 0.8, ease: 'none', overwrite: true })
        const link = email.closest('a')
        section.addEventListener('pointermove', move)
        link.addEventListener('pointerenter', scramble)

        // Contact cards: one light for the whole grid, so borders next to the cursor glow too;
        // each card's label decodes when the pointer enters it.
        const grid = section.querySelector('[data-details]')
        const all = gsap.utils.toArray('[data-card]', grid)
        const light = (e) => {
          all.forEach((c) => {
            const r = c.getBoundingClientRect()
            c.style.setProperty('--mx', `${e.clientX - r.left}px`)
            c.style.setProperty('--my', `${e.clientY - r.top}px`)
          })
        }
        const decoders = all.map((c) => {
          const label = c.querySelector('[data-card-label]')
          const text = label.textContent
          const run = () => gsap.to(label, { scrambleText: { text, chars: SCRAMBLE, speed: 0.7 }, duration: 0.6, ease: 'none', overwrite: true })
          c.addEventListener('pointerenter', run)
          return () => c.removeEventListener('pointerenter', run)
        })
        grid.addEventListener('pointermove', light)

        return () => {
          section.removeEventListener('pointermove', move)
          link.removeEventListener('pointerenter', scramble)
          grid.removeEventListener('pointermove', light)
          decoders.forEach((off) => off())
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="contact"
      tabIndex={-1}
      className="relative z-10 -mt-16 overflow-hidden rounded-t-[2.5rem] bg-ink px-5 pt-24 pb-20 md:-mt-24 md:rounded-t-[4rem] md:px-10 md:pt-36 md:pb-28"
    >
      <span
        data-spot
        className="pointer-events-none absolute top-0 left-0 -mt-[22rem] -ml-[22rem] hidden size-[44rem] rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.16),transparent_65%)] will-change-transform pointer-fine:block"
        aria-hidden="true"
      />
      <div data-cta-inner className="relative">
        <SectionHeader index="06" label="Contact" />

        <h2 data-cta-title className="display mt-14 text-[clamp(3.75rem,12vw,13rem)] font-medium md:mt-20">
          <span data-line className="block">
            Let&apos;s build
          </span>
          <span data-line className="block md:pl-[12vw]">
            <em className="serif-i text-[1.08em] tracking-normal text-accent">something</em> great.
          </span>
        </h2>

        <div className="mt-16 grid items-end gap-12 md:mt-24 lg:grid-cols-12">
          <div data-email className="lg:col-span-9">
            <p className="max-w-lg text-[1.05rem] leading-relaxed text-paper/65">
              Have a project, a role or an idea in mind? My inbox is the best place to start.
            </p>
            <a href={`mailto:${profile.email}`} className="group mt-8 inline-block max-w-full">
              <span className="block overflow-hidden pb-[0.08em]">
                <span
                  data-email-text
                  className="block text-[clamp(1.6rem,5.2vw,5.25rem)] leading-[1.05] font-medium tracking-[-0.04em] break-all transition-colors duration-500 group-hover:text-accent sm:break-normal"
                >
                  {profile.email}
                </span>
              </span>
              <span data-email-line className="mt-2 block h-px bg-paper/30" aria-hidden="true" />
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <CopyEmail />
              <a
                href={profile.resume}
                download={profile.resumeFile}
                className="label group inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-ink transition-colors duration-500 hover:bg-accent"
              >
                <Download size={14} className="transition-transform duration-500 group-hover:translate-y-0.5" aria-hidden="true" />
                Download resume
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 lg:justify-self-end">
            <div data-hello className="relative">
              <svg
                viewBox="0 0 200 200"
                className="spin-slow pointer-events-none absolute -inset-[22%] size-[144%] text-paper/55"
                aria-hidden="true"
              >
                <defs>
                  <path id="hello-ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
                </defs>
                <text className="fill-current font-mono text-[11px] uppercase tracking-[0.32em]">
                  <textPath href="#hello-ring">Say hello · Get in touch · Say hello · Get in touch ·</textPath>
                </text>
              </svg>
              <Magnetic strength={0.4}>
                <a
                  href={`mailto:${profile.email}`}
                  className="group grid size-36 place-items-center rounded-full bg-accent text-ink transition-transform duration-700 ease-out-expo hover:scale-105 md:size-44"
                >
                  <span className="flex flex-col items-center gap-1">
                    <ArrowUpRight size={30} className="transition-transform duration-700 ease-out-expo group-hover:rotate-45" aria-hidden="true" />
                    <span className="text-lg font-medium">Say hello</span>
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <div data-details className="mt-14 grid grid-cols-2 gap-3 md:mt-28 lg:grid-cols-4 lg:grid-rows-2">
          <div data-card className={`${cardBase} col-span-2 min-h-[16rem] p-6 md:p-7 lg:row-span-2`}>
            <Flood color="rgba(255,90,31,0.09)" />
            <span
              data-at
              className="serif-i pointer-events-none absolute -right-[0.08em] -bottom-[0.3em] -z-10 text-[clamp(10rem,22vw,20rem)] leading-none"
              aria-hidden="true"
            >
              <span className="block text-paper/[0.05] transition-[color,rotate] duration-[1.2s] ease-out-expo group-hover:-rotate-12 group-hover:text-accent/[0.08]">
                @
              </span>
            </span>
            <span className="relative z-10 flex items-start justify-between">
              <IconTile icon={Mail} />
              <span className="label rounded-full border border-accent/40 px-3 py-1.5 text-accent">Preferred</span>
            </span>
            <div className="relative z-10 mt-10">
              <span data-card-label className="label block text-paper/45">
                Email
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="mt-3 block text-[clamp(1.5rem,2.6vw,2.5rem)] leading-tight font-medium tracking-[-0.03em] break-all text-paper transition-colors duration-500 hover:text-accent sm:break-normal"
              >
                {profile.email}
              </a>
              <p className="mt-3 max-w-sm text-paper/55">The best place to start: projects, roles or ideas.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="label group/send inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2.5 text-accent ring-1 ring-accent/40 transition-colors duration-500 hover:bg-accent/25"
                >
                  Send an email
                  <ArrowUpRight size={14} className="transition-transform duration-500 group-hover/send:rotate-45" aria-hidden="true" />
                </a>
                <CopyEmail />
              </div>
            </div>
          </div>

          {cards.map((c) => (
            <Card key={c.label} {...c} time={time} />
          ))}
        </div>
      </div>
    </section>
  )
}
