import { useRef } from 'react'
import { useMagnetic } from '../../hooks/useMagnetic'

/** Wraps a single interactive child so it follows the pointer elastically. */
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  useMagnetic(ref, strength)
  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  )
}
