import { ArrowUpRight } from 'lucide-react'
import Magnetic from './Magnetic'
import RollText from './RollText'

const styles = {
  solid:
    'bg-paper text-ink hover:bg-accent',
  outline:
    'border border-paper/25 text-paper hover:border-paper',
  dark:
    'bg-ink text-paper hover:bg-accent hover:text-ink',
}

/** Pill link with a rolling label, a rotating arrow (a dropping one for downloads) and magnetic drift. */
export default function Button({ href, children, variant = 'solid', icon: Icon = ArrowUpRight, onClick, external, download, className = '' }) {
  return (
    <Magnetic strength={0.25}>
      <a
        href={href}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download } : {})}
        className={`roll-host group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[0.95rem] font-medium transition-colors duration-500 ${styles[variant]} ${className}`}
      >
        <RollText>{children}</RollText>
        <span
          className={`grid size-10 place-items-center rounded-full transition-transform duration-700 ease-out-expo ${download ? 'group-hover:translate-y-1' : 'group-hover:rotate-45'} ${
            variant === 'solid' ? 'bg-ink text-paper' : variant === 'dark' ? 'bg-paper text-ink' : 'bg-paper text-ink'
          }`}
        >
          <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
        </span>
      </a>
    </Magnetic>
  )
}
