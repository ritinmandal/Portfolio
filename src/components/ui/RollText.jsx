/** Text that rolls up to a copy of itself when its `.roll-host` ancestor is hovered or focused. */
export default function RollText({ children, className = '' }) {
  return (
    <span className={`roll ${className}`}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}
