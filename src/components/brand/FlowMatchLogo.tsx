interface FlowMatchLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export default function FlowMatchLogo({ size = 32, className = '', showWordmark = false }: FlowMatchLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="FlowMatch Logo"
      >
        {/* Top-left node (start of F vertical) */}
        <circle cx="12" cy="10" r="5" fill="url(#grad1)" />
        {/* Mid-left node (F horizontal arm) */}
        <circle cx="12" cy="24" r="5" fill="url(#grad1)" />
        {/* Bottom-left node (F vertical end) */}
        <circle cx="12" cy="38" r="5" fill="url(#grad2)" />
        {/* Right node (flow output) */}
        <circle cx="34" cy="24" r="6" fill="url(#grad2)" />

        {/* Vertical connector: top to mid */}
        <line x1="12" y1="15" x2="12" y2="19" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
        {/* Vertical connector: mid to bottom */}
        <line x1="12" y1="29" x2="12" y2="33" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
        {/* Horizontal connector: mid to right */}
        <line x1="17" y1="24" x2="28" y2="24" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
        {/* Diagonal connector: top to right */}
        <line x1="16" y1="13" x2="29" y2="21" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      {showWordmark && (
        <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
          Flow<span className="text-violet-600 dark:text-violet-400">Match</span>
        </span>
      )}
    </span>
  );
}
