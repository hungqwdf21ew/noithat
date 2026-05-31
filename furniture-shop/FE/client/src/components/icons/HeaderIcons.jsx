const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconSearch = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
)

export const IconHeart = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M12 20.5s-7-4.6-7-10a4 4 0 0 1 7-2.5 4 4 0 0 1 7 2.5c0 5.4-7 10-7 10z" />
  </svg>
)

export const IconUser = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M5 20c0-4 3.5-6 7-6s7 2 7 6" />
  </svg>
)

export const IconCart = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M6 6h15l-1.5 9H8L6 6z" />
    <path d="M6 6L5 3H2" />
    <circle cx="10" cy="20" r="1.25" fill="currentColor" stroke="none" />
    <circle cx="18" cy="20" r="1.25" fill="currentColor" stroke="none" />
  </svg>
)

export const IconChevronLeft = (props) => (
  <svg {...iconProps} width={22} height={22} {...props}>
    <path d="M14 6l-6 6 6 6" />
  </svg>
)

export const IconChevronRight = (props) => (
  <svg {...iconProps} width={22} height={22} {...props}>
    <path d="M10 6l6 6-6 6" />
  </svg>
)

export const IconProfile = (props) => (
  <svg {...iconProps} width={18} height={18} {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 19c0-3.5 3-5.5 7-5.5s7 2 7 5.5" />
  </svg>
)

export const IconOrders = (props) => (
  <svg {...iconProps} width={18} height={18} {...props}>
    <path d="M5 4h14v16H5z" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
)

export const IconSettings = (props) => (
  <svg {...iconProps} width={18} height={18} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const IconLogout = (props) => (
  <svg {...iconProps} width={18} height={18} {...props}>
    <path d="M10 5H5v14h5" />
    <path d="M14 12H8M18 8l4 4-4 4" />
  </svg>
)

export const IconSparkle = (props) => (
  <svg {...iconProps} width={14} height={14} {...props}>
    <path d="M12 2l1.2 4.8L18 8l-4.8 1.2L12 14l-1.2-4.8L6 8l4.8-1.2L12 2z" fill="currentColor" stroke="none" />
  </svg>
)
