import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/gsap'

/**
 * Page-wide scroll effects, set up once in App:
 * - `[data-skew]` elements lean with the scroll velocity and settle back when it stops.
 * - `[data-speed="0.8"]` elements drift at a different rate than the scroll (parallax);
 *   values below 1 lag behind, above 1 run ahead.
 * Both re-query the DOM on refresh, so sections can add these attributes freely.
 */
export function useScrollFx() {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const clamp = gsap.utils.clamp(-7, 7)
      const state = { skew: 0 }
      let targets = []
      const collect = () => (targets = gsap.utils.toArray('[data-skew]'))
      const apply = () => gsap.set(targets, { skewY: state.skew, force3D: true })
      collect()

      const skew = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onRefresh: collect,
        onUpdate: (self) => {
          const next = clamp(self.getVelocity() / -320)
          if (Math.abs(next) > Math.abs(state.skew)) {
            state.skew = next
            gsap.to(state, { skew: 0, duration: 0.9, ease: 'power3.out', overwrite: true, onUpdate: apply })
          }
        },
      })

      const parallax = gsap.utils.toArray('[data-speed]').map((el) => {
        const speed = Number(el.dataset.speed) || 1
        return gsap.fromTo(
          el,
          { y: () => (1 - speed) * window.innerHeight * -0.5 },
          {
            y: () => (1 - speed) * window.innerHeight * 0.5,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          },
        )
      })

      return () => {
        skew.kill()
        parallax.forEach((t) => t.scrollTrigger?.kill())
        gsap.set(targets, { clearProps: 'skewY' })
      }
    })
    return () => mm.revert()
  })
}
