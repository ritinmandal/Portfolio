import { useRef } from 'react'
import { gsap, MQ, SCRAMBLE, useGSAP } from '../../lib/gsap'

/** "(01) About" index row: the rule draws across and the label decodes when it enters. */
export default function SectionHeader({ index, label, className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 88%' } })
        tl.from('[data-rule]', { scaleX: 0, transformOrigin: 'left center', duration: 1.6, ease: 'expo.inOut' })
          .from('[data-bit]', { yPercent: 110, stagger: 0.08, duration: 1 }, 0.2)
          .to('[data-label]', { scrambleText: { text: label, chars: SCRAMBLE, speed: 0.5 }, duration: 1.2, ease: 'none' }, 0.25)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={`flex items-center gap-4 ${className}`}>
      <span className="overflow-hidden">
        <span data-bit className="label block opacity-55">
          ({index})
        </span>
      </span>
      <span className="overflow-hidden">
        <span data-bit data-label className="label block">
          {label}
        </span>
      </span>
      <span data-rule className="h-px flex-1 bg-current opacity-20" />
    </div>
  )
}
