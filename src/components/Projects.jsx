import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { gsap, MQ, SCRAMBLE, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'
import { facts, projects } from '../data/profile'
import SectionHeader from './ui/SectionHeader'
import RollText from './ui/RollText'
import TechIcon from './ui/TechIcon'

const pad = (n) => String(n).padStart(2, '0')
const TOP = 0.05 // cards pin this far (in viewport heights) below the top edge
const total = facts.find((f) => f.label === 'Projects completed')

function GrooveCover() {
  const bars = Array.from({ length: 36 })
  return (
    <div className="relative flex size-full flex-col justify-between overflow-hidden bg-ink-2 p-6 text-paper md:p-10">
      <div className="flex items-start justify-between">
        <span className="label text-paper/50">Now playing</span>
        <span className="label hidden text-paper/50 sm:inline">Next.js · Tailwind CSS</span>
      </div>
      <div
        className="spin-slow absolute top-1/2 right-[-6%] aspect-square w-[42%] -translate-y-1/2 rounded-full bg-[repeating-radial-gradient(circle,#1f1f1c_0_2px,#141412_2px_5px)]"
        aria-hidden="true"
      >
        <span className="absolute inset-[34%] grid place-items-center rounded-full bg-(--tint)">
          <span className="size-3 rounded-full bg-ink" />
        </span>
      </div>
      <div className="relative">
        <p className="display text-[clamp(3.5rem,9vw,9rem)] font-medium">Groove</p>
        <div className="mt-4 flex h-12 max-w-[55%] items-end gap-[3px] md:h-16" aria-hidden="true">
          {bars.map((_, i) => (
            <span
              key={i}
              className="eq-bar w-full rounded-full bg-(--tint)"
              style={{
                height: `${30 + ((i * 37) % 70)}%`,
                animationDelay: `${-((i * 0.173) % 1.4)}s`,
                opacity: 0.35 + ((i * 13) % 10) / 15,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Card({ project, index }) {
  const num = pad(index + 1)
  const live = Boolean(project.url)
  // Projects without a public URL yet get a plain preview and a "Launching soon" badge.
  const Media = live ? 'a' : 'div'

  return (
    <article
      data-card
      style={{ '--tint': project.tint }}
      className="relative isolate flex w-[86vw] shrink-0 snap-center flex-col overflow-hidden rounded-[1.5rem] bg-ink p-5 text-paper shadow-[0_50px_100px_-40px_rgba(12,12,11,0.6)] will-change-transform sm:w-[70vw] md:rounded-[2rem] md:p-8 lg:h-[90vh] lg:w-auto lg:shrink lg:p-10"
    >
      {/* Tinted glow and giant index behind the content */}
      <span
        data-glow
        className="pointer-events-none absolute -top-[40%] -right-[15%] -z-10 size-[70vmax] rounded-full opacity-40 will-change-transform"
        style={{ background: 'radial-gradient(circle, var(--tint), transparent 62%)' }}
        aria-hidden="true"
      />
      <span
        data-num
        className="display outline-text pointer-events-none absolute -top-[0.12em] -right-[0.04em] -z-10 hidden text-[clamp(10rem,22vw,22rem)] leading-none font-medium text-paper/10 will-change-transform lg:block"
        aria-hidden="true"
      >
        {num}
      </span>
      <span data-shade className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" aria-hidden="true" />

      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="label flex items-center gap-3 text-paper/60">
          <span className="text-paper">{num}</span>
          <span>/ {pad(projects.length)}</span>
          <span className="h-px w-8 bg-paper/25" aria-hidden="true" />
          <span className="size-2 rounded-full bg-(--tint)" aria-hidden="true" />
          <span data-cat>{project.category}</span>
        </p>
        {live && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="label group hidden items-center gap-2 text-paper/60 transition-colors hover:text-paper sm:flex"
          >
            {project.host}
            <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </header>

      <Media
        data-preview
        {...(live
          ? {
              href: project.url,
              target: '_blank',
              rel: 'noopener noreferrer',
              'data-cursor': 'Visit site',
              'aria-label': `Open ${project.name} live demo (opens in a new tab)`,
            }
          : {})}
        className="group relative mt-5 block aspect-[16/10] min-h-0 md:mt-6 lg:aspect-auto lg:flex-1"
      >
        <div data-tilt className="size-full will-change-transform">
          <div data-media className="relative flex size-full flex-col overflow-hidden rounded-xl bg-ink-2 ring-1 ring-paper/10 will-change-transform">
            <div className="flex shrink-0 items-center gap-2 border-b border-paper/10 px-4 py-2.5" aria-hidden="true">
              <span className="size-2 rounded-full bg-paper/20" />
              <span className="size-2 rounded-full bg-paper/20" />
              <span className="size-2 rounded-full bg-paper/20" />
              <span className="label ml-3 truncate text-[0.62rem] text-paper/45">{project.host}</span>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]">
                {project.image ? (
                  <img
                    data-parallax
                    src={project.image.src}
                    srcSet={project.image.srcSet}
                    sizes="(min-width: 1024px) 90vw, 100vw"
                    alt={project.alt}
                    loading="lazy"
                    decoding="async"
                    width="1600"
                    height="1000"
                    className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover will-change-transform"
                    style={{ objectPosition: project.focus ?? 'top' }}
                  />
                ) : (
                  <div data-parallax className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform" role="img" aria-label={project.alt}>
                    <GrooveCover />
                  </div>
                )}
              </div>
              <span
                data-glare
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: 'radial-gradient(40rem circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.2), transparent 45%)' }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Media>

      <div className="mt-6 grid gap-6 md:mt-8 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-5">
          <h3 data-name className="display text-[clamp(2.5rem,4.6vw,4.75rem)] font-medium">
            {project.name}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies used">
            {project.stack.map((s) => (
              <li key={s} data-chip className="label inline-flex items-center gap-2 rounded-full border border-paper/15 px-3 py-1.5 text-paper/75">
                <TechIcon name={s} size={13} />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex flex-col gap-3 lg:col-span-5">
          {project.points.map((p) => (
            <li key={p} data-point className="flex gap-3 text-[0.95rem] leading-relaxed text-paper/65">
              <span className="mt-[0.75em] h-px w-4 shrink-0 bg-(--tint)" aria-hidden="true" />
              <span className="line-clamp-3 lg:line-clamp-none">{p}</span>
            </li>
          ))}
        </ul>
        <div className="lg:col-span-2 lg:justify-self-end">
          {live ? (
            <a
              data-point
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="roll-host group inline-flex items-center gap-3 rounded-full bg-paper py-2 pr-2 pl-5 font-medium text-ink transition-colors duration-500 hover:bg-(--tint)"
            >
              <RollText>Live demo</RollText>
              <span className="grid size-9 place-items-center rounded-full bg-ink text-paper transition-transform duration-700 ease-out-expo group-hover:rotate-45">
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
              <span className="sr-only">for {project.name} (opens in a new tab)</span>
            </a>
          ) : (
            <span data-point className="label inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2.5 text-paper/70">
              <span className="pulse-dot size-1.5 rounded-full bg-(--tint)" aria-hidden="true" />
              Launching soon
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const root = useRef(null)
  const rail = useRef(null)
  const count = useRef(null)
  const bar = useRef(null)

  // Carousel (below desktop): the counter and progress bar follow the swipe position.
  useEffect(() => {
    const el = rail.current
    if (!el) return
    let raf = 0
    const sync = () => {
      raf = 0
      const max = el.scrollWidth - el.clientWidth
      if (max <= 0) return
      const p = el.scrollLeft / max
      bar.current.style.transform = `scaleX(${Math.max(0.04, p)})`
      count.current.textContent = pad(Math.round(p * (projects.length - 1)) + 1)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync)
    }
    sync()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        // Background turns from ink to paper as the section arrives.
        gsap.fromTo(
          root.current,
          { backgroundColor: '#0c0c0b', color: '#efebe3' },
          {
            backgroundColor: '#efebe3',
            color: '#0c0c0b',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top 15%', scrub: true },
          },
        )

        const title = SplitText.create('[data-work-title]', { type: 'words,chars', mask: 'chars', aria: 'none' })
        gsap.from(title.chars, {
          yPercent: 115,
          stagger: 0.035,
          duration: 1.3,
          scrollTrigger: { trigger: '[data-work-title]', start: 'top 82%' },
        })
        gsap.fromTo(
          '[data-work-title]',
          { xPercent: 6 },
          { xPercent: -4, ease: 'none', scrollTrigger: { trigger: '[data-work-title]', start: 'top bottom', end: 'bottom top', scrub: true } },
        )

        // Project total counts up when the header arrives.
        if (total) {
          gsap
            .timeline({ scrollTrigger: { trigger: '[data-total]', start: 'top 88%' } })
            .from('[data-total]', { y: 40, opacity: 0, duration: 1.2 })
            .from('[data-total-num]', { textContent: 0, snap: { textContent: 1 }, duration: 2, ease: 'power3.out' }, 0)
        }

        gsap.utils.toArray('[data-card]').forEach((card) => {
          // Card tips up from the floor as it rises into place; the screenshot opens from a slit.
          gsap.fromTo(
            card,
            { rotationX: 14, transformPerspective: 1800, transformOrigin: '50% 0%' },
            { rotationX: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 30%', scrub: true } },
          )
          gsap.fromTo(
            card.querySelector('[data-media]'),
            { clipPath: 'inset(18% 12% 18% 12% round 14px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 12px)',
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 20%', scrub: true },
            },
          )
          gsap.fromTo(
            card.querySelector('[data-parallax]'),
            { yPercent: -8 },
            { yPercent: 8, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
          )
          gsap.fromTo(
            card.querySelector('[data-num]'),
            { yPercent: 30, xPercent: -10 },
            { yPercent: -10, xPercent: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'top top', scrub: true } },
          )
          // The glow wanders on its own.
          gsap.to(card.querySelector('[data-glow]'), {
            xPercent: -18,
            yPercent: 14,
            scale: 1.15,
            duration: 7,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })

          const name = SplitText.create(card.querySelector('[data-name]'), { type: 'words,chars', mask: 'words' })
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: 'top 55%' } })
            .from(name.chars, { yPercent: 110, rotate: 10, stagger: 0.025, duration: 1.2 })
            .to(card.querySelector('[data-cat]'), { scrambleText: { text: '{original}', chars: SCRAMBLE, speed: 0.5 }, duration: 1.1, ease: 'none' }, 0)
            .from(card.querySelectorAll('[data-point]'), { y: 30, opacity: 0, stagger: 0.08, duration: 1 }, 0.15)
            .from(card.querySelectorAll('[data-chip]'), { scale: 0.6, opacity: 0, stagger: 0.04, duration: 0.7, ease: 'back.out(2)' }, 0.3)
        })
      })

      // Desktop: the cards pin one after another and stack. Each new card slides over the
      // last, which shrinks back and dims beneath it.
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        const cards = gsap.utils.toArray('[data-card]')
        const last = cards[cards.length - 1]
        const top = () => `top ${Math.round(window.innerHeight * TOP)}px`
        cards.forEach((card, i) => {
          if (card === last) return
          const next = cards[i + 1]
          ScrollTrigger.create({
            trigger: card,
            start: top,
            endTrigger: last,
            end: top,
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          })
          gsap
            .timeline({
              scrollTrigger: { trigger: next, start: 'top bottom', end: top, scrub: true, invalidateOnRefresh: true },
              defaults: { ease: 'none' },
            })
            .to(card, { scale: 0.88 - (cards.length - 2 - i) * 0.02, yPercent: -2 }, 0)
            .to(card.querySelector('[data-shade]'), { opacity: 0.6 }, 0)
        })
      })

      // Fine pointers: screenshots tilt toward the cursor and a glare follows it.
      mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
        const offs = gsap.utils.toArray('[data-card] [data-preview]').map((link) => {
          const tilt = link.querySelector('[data-tilt]')
          const glare = link.querySelector('[data-glare]')
          const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3.out' })
          const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3.out' })
          gsap.set(tilt, { transformPerspective: 1600 })
          const move = (e) => {
            const r = link.getBoundingClientRect()
            const x = (e.clientX - r.left) / r.width
            const y = (e.clientY - r.top) / r.height
            ry((x - 0.5) * 6)
            rx((0.5 - y) * 5)
            glare.style.setProperty('--gx', `${x * 100}%`)
            glare.style.setProperty('--gy', `${y * 100}%`)
          }
          const leave = () => {
            rx(0)
            ry(0)
          }
          link.addEventListener('pointermove', move)
          link.addEventListener('pointerleave', leave)
          return () => {
            link.removeEventListener('pointermove', move)
            link.removeEventListener('pointerleave', leave)
          }
        })
        return () => offs.forEach((off) => off())
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="work"
      tabIndex={-1}
      className="relative bg-paper px-3 pt-28 pb-40 text-ink md:px-6 md:pt-40 md:pb-56"
    >
      <div className="px-2 md:px-4">
        <SectionHeader index="05" label="Selected work" />

        <div className="mt-14 flex flex-col justify-between gap-8 md:mt-20 lg:flex-row lg:items-end">
          <h2 data-work-title className="display text-[clamp(4rem,11vw,12rem)] font-medium">
            Selected <em className="serif-i text-[1.08em] tracking-normal text-accent">work.</em>
          </h2>
          <div className="flex items-end gap-6 lg:pb-6">
            {total && (
              <p data-total className="shrink-0">
                <span className="display block text-[clamp(4.5rem,8vw,8rem)] leading-[0.85] font-light">
                  <span data-total-num>{total.value}</span>
                  <span className="text-accent">{total.suffix}</span>
                </span>
                <span className="label mt-2 block opacity-60">{total.label}</span>
              </p>
            )}
            <p className="max-w-xs leading-relaxed opacity-70">
              A few of them. Built with React.js, Next.js, Tailwind CSS and GSAP; live previews open the real site.
            </p>
          </div>
        </div>
      </div>

      {/* Below desktop the cards are a swipeable carousel; on desktop they pin and stack. */}
      <div
        ref={rail}
        className="no-scrollbar -mx-3 mt-12 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-3 pb-2 md:-mx-6 md:mt-16 md:px-6 lg:mx-0 lg:mt-24 lg:snap-none lg:flex-col lg:gap-[6vh] lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {projects.map((p, i) => (
          <Card key={p.name} project={p} index={i} />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-4 px-2 lg:hidden" aria-hidden="true">
        <span className="label shrink-0 tabular-nums">
          <span ref={count}>01</span>
          <span className="opacity-40"> / {pad(projects.length)}</span>
        </span>
        <span className="relative h-px flex-1 bg-current/15">
          <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
        </span>
        <span className="label flex shrink-0 items-center gap-2 opacity-60">
          Swipe <ArrowRight size={14} className="swipe-hint" />
        </span>
      </div>
    </section>
  )
}
