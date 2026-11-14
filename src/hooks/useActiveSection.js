import { useState } from 'react'
import { ScrollTrigger, useGSAP } from '../lib/gsap'

/** Returns the id of the section that currently crosses the middle of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null)

  useGSAP(() => {
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        // created before the pinned sections, so measure after their spacers exist
        refreshPriority: -10,
        onToggle: (self) => {
          if (self.isActive) setActive(id)
          else setActive((cur) => (cur === id ? null : cur))
        },
      })
    })
  }, [ids.join()])

  return active
}
