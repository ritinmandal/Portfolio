import { brands, generic } from '../../data/techIcons'

/** Logo for a skill name: the brand mark in currentColor, a generic icon, or nothing. */
export default function TechIcon({ name, size = 18, className = '' }) {
  const brand = brands[name]
  if (brand) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`shrink-0 ${className}`}>
        <path d={brand.path} />
      </svg>
    )
  }
  const Icon = generic[name]
  return Icon ? <Icon size={size} strokeWidth={1.75} aria-hidden="true" className={`shrink-0 ${className}`} /> : null
}
