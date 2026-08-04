/** Inline SVG so there is no icon-font request and each mark inherits colour. */

type IconProps = { className?: string }

export const ArrowRight = ({ className }: IconProps) => (
  <svg
    className={className}
    width="14"
    height="10"
    viewBox="0 0 14 10"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M1 5h11M8.5 1.5 12 5l-3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Caret = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 10 6"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="m1 1 4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const Close = ({ className }: IconProps) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="m3 3 10 10M13 3 3 13"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
)
