import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/gsap'

const GAP = 30
const RADIUS = 190 // cursor influence in px
const BASE = [239, 235, 227] // paper
const HOT = [255, 90, 31] // accent

/**
 * Grid of dots behind the hero. A slow diagonal wave breathes through it and the
 * dots near the pointer swell, push away and warm to the accent colour.
 * Only renders while on screen and the tab is visible; static for reduced motion.
 */
export default function DotField({ className = '' }) {
  const canvas = useRef(null)

  useEffect(() => {
    const el = canvas.current
    const ctx = el.getContext('2d')
    const reduced = prefersReducedMotion()
    let w = 0
    let h = 0
    let dpr = 1
    let dots = []
    let raf = 0
    let visible = true
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }

    const resize = () => {
      const r = el.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      el.width = Math.round(w * dpr)
      el.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      const cols = Math.ceil(w / GAP) + 1
      const rows = Math.ceil(h / GAP) + 1
      const ox = (w - (cols - 1) * GAP) / 2
      const oy = (h - (rows - 1) * GAP) / 2
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) dots.push([ox + x * GAP, oy + y * GAP])
      if (reduced) draw(0)
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      mouse.x += (mouse.tx - mouse.x) * 0.12
      mouse.y += (mouse.ty - mouse.y) * 0.12
      const time = t * 0.0006
      for (let i = 0; i < dots.length; i++) {
        const [bx, by] = dots[i]
        const wave = reduced ? 0.5 : (Math.sin(bx * 0.006 + by * 0.004 - time) + 1) / 2
        const ddx = bx - mouse.x
        const ddy = by - mouse.y
        const dist = Math.sqrt(ddx * ddx + ddy * ddy)
        const f = dist < RADIUS ? 1 - dist / RADIUS : 0
        const ease = f * f
        const x = bx + (dist ? (ddx / dist) * ease * 14 : 0)
        const y = by + (dist ? (ddy / dist) * ease * 14 : 0)
        const r = 0.7 + wave * 0.5 + ease * 2.2
        const c0 = Math.round(BASE[0] + (HOT[0] - BASE[0]) * ease)
        const c1 = Math.round(BASE[1] + (HOT[1] - BASE[1]) * ease)
        const c2 = Math.round(BASE[2] + (HOT[2] - BASE[2]) * ease)
        const a = 0.1 + wave * 0.2 + ease * 0.7
        ctx.fillStyle = `rgba(${c0},${c1},${c2},${a})`
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (t) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    const startLoop = () => {
      if (reduced || raf || !visible || document.hidden) return
      raf = requestAnimationFrame(loop)
    }
    const stopLoop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      mouse.tx = e.clientX - r.left
      mouse.ty = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.tx = -9999
      mouse.ty = -9999
    }
    const onVis = () => (document.hidden ? stopLoop() : startLoop())

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) startLoop()
      else stopLoop()
    })
    const ro = new ResizeObserver(resize)

    resize()
    ro.observe(el)
    io.observe(el)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    startLoop()

    return () => {
      stopLoop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={canvas} className={className} aria-hidden="true" />
}
