import { useRef } from 'react'
import { gsap, MQ, SplitText, useGSAP } from '../lib/gsap'
import { manifesto } from '../data/profile'

const pad = (n) => String(n).padStart(2, '0')
// Long words get a smaller size so every word fits one line at any width.
const size = (word) => `min(${(150 / word.length).toFixed(1)}vw, 15rem)`

/**
 * Pinned kinetic type. Three words take the screen one after another, each with its own entrance:
 * 01 flips up on its X axis as the section arrives, 02 grows out of the baseline on an accent disc that floods the
 * screen, 03 flies in from in front of the camera as an ink disc closes back over the accent.
 * Without motion it is a plain stacked list.
 */
export default function Manifesto() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        root.current.dataset.mode = 'pin'
        const [a, b, c] = gsap.utils
          .toArray('[data-word]')
          .map((el) => SplitText.create(el, { type: 'chars', aria: 'none' }).chars)
        gsap.set([...a, ...c], { transformPerspective: 800 })

        // 01 arrives while the section scrolls up into place, before the pin starts.
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top top', scrub: 1 },
          })
          .from(a, { yPercent: 120, rotationX: -95, opacity: 0, stagger: 0.05, transformOrigin: '50% 100%' })
          .from('[data-note="0"]', { y: 40, opacity: 0 }, 0.4)

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', duration: 1 },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=380%',
            pin: true,
            scrub: 1,
          },
        })

        // 01 holds, then tips away over the top. This moves the whole item, not the letters,
        // so it never fights the entrance above while that one is still catching up.
        tl.to('[data-item="0"]', { yPercent: -25, rotationX: 70, opacity: 0, transformPerspective: 1000, transformOrigin: '50% 0%', ease: 'power2.in' }, 1)

          // 02: accent disc floods the screen, letters stretch up from the floor.
          .fromTo('[data-disc="accent"]', { scale: 0 }, { scale: 1, duration: 1.6, ease: 'power2.inOut' }, 1.2)
          .from(b, { scaleY: 0, yPercent: 40, transformOrigin: '50% 100%', stagger: { each: 0.05, from: 'center' }, ease: 'back.out(2)' }, 1.9)
          .from('[data-note="1"]', { y: 40, opacity: 0 }, 2.3)
          .to(b, { x: (i) => (i - (b.length - 1) / 2) * 90, opacity: 0, ease: 'power2.in', stagger: { each: 0.02, from: 'center' } }, 3.9)
          .to('[data-note="1"]', { y: -40, opacity: 0, ease: 'power2.in' }, 3.9)

          // 03: ink disc closes over the accent, letters arrive from in front of the camera.
          .fromTo('[data-disc="ink"]', { scale: 0 }, { scale: 1, duration: 1.6, ease: 'power2.inOut' }, 4.1)
          .from(c, { z: 650, opacity: 0, rotationY: (i) => (i % 2 ? 40 : -40), stagger: { each: 0.04, from: 'edges' } }, 4.8)
          .from('[data-note="2"]', { y: 40, opacity: 0 }, 5.4)
          .to('[data-c-under]', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 5.6)

          // Counter strip and progress line run the whole time.
          .to('[data-count]', { yPercent: -100 * (manifesto.length - 1) / manifesto.length, ease: 'none', duration: 4 }, 1)
          .fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: tl.duration() }, 0)
          .to({}, { duration: 0.8 })

        return () => {
          if (root.current) delete root.current.dataset.mode
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      aria-label="What I build"
      className="group/m relative overflow-hidden px-5 py-24 md:px-10 data-[mode=pin]:h-svh data-[mode=pin]:py-0"
    >
      <div className="pointer-events-none absolute inset-0 hidden place-items-center group-data-[mode=pin]/m:grid" aria-hidden="true">
        <span data-disc="accent" className="absolute size-[150vmax] scale-0 rounded-full bg-accent will-change-transform" />
        <span data-disc="ink" className="absolute size-[150vmax] scale-0 rounded-full bg-ink will-change-transform" />
      </div>

      <ol className="relative flex flex-col gap-16 group-data-[mode=pin]/m:block group-data-[mode=pin]/m:h-full">
        {manifesto.map((m, i) => (
          <li
            key={m.word}
            data-item={i}
            className={`flex flex-col gap-6 group-data-[mode=pin]/m:absolute group-data-[mode=pin]/m:inset-0 group-data-[mode=pin]/m:items-center group-data-[mode=pin]/m:justify-center group-data-[mode=pin]/m:text-center ${
              i === 1 ? 'group-data-[mode=pin]/m:text-ink' : ''
            }`}
          >
            <span className="label opacity-55 group-data-[mode=pin]/m:hidden">{pad(i + 1)}</span>
            <span className="relative">
              <span
                data-word
                className={`display block font-medium whitespace-nowrap ${i === 2 ? 'serif-i tracking-[-0.02em]' : ''}`}
                style={{ fontSize: size(m.word) }}
              >
                {m.word}
              </span>
              {i === 2 && (
                <span
                  data-c-under
                  className="absolute inset-x-[4%] -bottom-[0.06em] hidden h-[0.08em] origin-left scale-x-0 bg-accent group-data-[mode=pin]/m:block"
                  style={{ fontSize: size(m.word) }}
                  aria-hidden="true"
                />
              )}
            </span>
            <p data-note={i} className="max-w-md text-[1.05rem] leading-relaxed opacity-70 md:text-lg">
              {m.note}
            </p>
          </li>
        ))}
      </ol>

      <div
        className="pointer-events-none absolute inset-x-5 bottom-6 hidden items-end justify-between gap-6 mix-blend-difference group-data-[mode=pin]/m:flex md:inset-x-10 md:bottom-8"
        aria-hidden="true"
      >
        <span className="label flex items-center gap-2 text-paper">
          <span className="block h-[1.2em] overflow-hidden">
            <span data-count className="block">
              {manifesto.map((_, i) => (
                <span key={i} className="block h-[1.2em] leading-[1.2em]">
                  {pad(i + 1)}
                </span>
              ))}
            </span>
          </span>
          <span className="opacity-50">/ {pad(manifesto.length)}</span>
        </span>
        <span className="block h-px max-w-xs flex-1 bg-paper/25">
          <span data-progress className="block h-full origin-left bg-paper" />
        </span>
        <span className="label text-paper/70">What I build</span>
      </div>
    </section>
  )
}
