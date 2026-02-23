import React from 'react';
import { Clue } from '../data/cases';

interface Props {
  icon: Clue['icon'];
  size?: number;
  color?: string;
  className?: string;
}

export const ClueIcon: React.FC<Props> = ({ icon, size = 48, color = '#C9A227', className = '' }) => {
  const s = size;
  const c = color;

  const icons: Record<Clue['icon'], React.ReactNode> = {
    knife: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <path d="M36 6 L14 28 L12 36 L20 34 L42 12 Z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <line x1="14" y1="28" x2="20" y2="34" stroke={c} strokeWidth="2.5"/>
        <path d="M12 36 L8 40" stroke={c} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="15" cy="33" r="2" fill={c} opacity="0.6"/>
      </svg>
    ),
    document: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="10" y="6" width="28" height="36" rx="2" fill="none" stroke={c} strokeWidth="2.5"/>
        <path d="M28 6 L28 14 L36 14" fill="none" stroke={c} strokeWidth="2"/>
        <line x1="15" y1="20" x2="33" y2="20" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <line x1="15" y1="26" x2="33" y2="26" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <line x1="15" y1="32" x2="26" y2="32" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    phone: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="14" y="4" width="20" height="40" rx="4" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="17" y="8" width="14" height="22" rx="1" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6"/>
        <circle cx="24" cy="36" r="2.5" fill="none" stroke={c} strokeWidth="2"/>
      </svg>
    ),
    key: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <circle cx="18" cy="18" r="9" fill="none" stroke={c} strokeWidth="2.5"/>
        <circle cx="18" cy="18" r="4" fill="none" stroke={c} strokeWidth="2" opacity="0.6"/>
        <line x1="27" y1="24" x2="42" y2="38" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="36" y1="33" x2="36" y2="39" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="39" y1="36" x2="39" y2="41" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    bottle: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <path d="M20 6 L20 14 L13 22 L13 40 Q13 43 16 43 L32 43 Q35 43 35 40 L35 22 L28 14 L28 6 Z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <line x1="20" y1="6" x2="28" y2="6" stroke={c} strokeWidth="2.5"/>
        <path d="M13 28 Q24 32 35 28" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5"/>
      </svg>
    ),
    footprint: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <ellipse cx="22" cy="32" rx="7" ry="10" fill="none" stroke={c} strokeWidth="2.5"/>
        <ellipse cx="17" cy="18" rx="3.5" ry="4.5" fill="none" stroke={c} strokeWidth="2"/>
        <ellipse cx="24" cy="15" rx="3" ry="4" fill="none" stroke={c} strokeWidth="2"/>
        <ellipse cx="31" cy="17" rx="2.5" ry="3.5" fill="none" stroke={c} strokeWidth="2"/>
        <ellipse cx="36" cy="22" rx="2" ry="3" fill="none" stroke={c} strokeWidth="2"/>
      </svg>
    ),
    camera: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="6" y="16" width="36" height="24" rx="3" fill="none" stroke={c} strokeWidth="2.5"/>
        <path d="M16 16 L18 10 L30 10 L32 16" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <circle cx="24" cy="28" r="6" fill="none" stroke={c} strokeWidth="2.5"/>
        <circle cx="24" cy="28" r="3" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6"/>
        <circle cx="36" cy="22" r="2" fill={c} opacity="0.6"/>
      </svg>
    ),
    bag: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="8" y="18" width="32" height="24" rx="3" fill="none" stroke={c} strokeWidth="2.5"/>
        <path d="M17 18 L17 13 Q17 8 24 8 Q31 8 31 13 L31 18" fill="none" stroke={c} strokeWidth="2.5"/>
        <line x1="8" y1="28" x2="40" y2="28" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <line x1="24" y1="28" x2="24" y2="42" stroke={c} strokeWidth="1.5" opacity="0.5"/>
      </svg>
    ),
    gun: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <path d="M6 22 L28 22 L28 18 L38 18 L38 26 L28 26 L28 28 L20 28 L20 34 L14 34 L14 28 L6 28 Z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <line x1="38" y1="22" x2="44" y2="22" stroke={c} strokeWidth="3" strokeLinecap="round"/>
        <line x1="14" y1="26" x2="14" y2="28" stroke={c} strokeWidth="2"/>
      </svg>
    ),
    blood: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <path d="M24 8 Q30 20 30 28 Q30 36 24 40 Q18 36 18 28 Q18 20 24 8 Z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M14 30 Q10 34 12 38 Q14 42 18 40" fill="none" stroke={c} strokeWidth="2" opacity="0.6"/>
        <path d="M34 26 Q38 28 37 32 Q36 36 33 35" fill="none" stroke={c} strokeWidth="2" opacity="0.6"/>
      </svg>
    ),
    note: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="8" y="8" width="32" height="32" rx="2" fill="none" stroke={c} strokeWidth="2.5" transform="rotate(-5, 24, 24)"/>
        <line x1="14" y1="18" x2="34" y2="16" stroke={c} strokeWidth="2" strokeLinecap="round" transform="rotate(-5, 24, 24)"/>
        <line x1="14" y1="24" x2="34" y2="22" stroke={c} strokeWidth="2" strokeLinecap="round" transform="rotate(-5, 24, 24)"/>
        <line x1="14" y1="30" x2="26" y2="28" stroke={c} strokeWidth="2" strokeLinecap="round" transform="rotate(-5, 24, 24)"/>
      </svg>
    ),
    wire: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <path d="M6 24 C12 16 18 32 24 24 C30 16 36 32 42 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="6" cy="24" r="3" fill={c}/>
        <circle cx="42" cy="24" r="3" fill={c}/>
        <line x1="36" y1="16" x2="40" y2="12" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="40" y1="16" x2="36" y2="12" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    glass: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <path d="M16 8 L14 34 Q14 40 24 40 Q34 40 34 34 L32 8 Z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M28 8 L20 20 M24 8 L30 22 M32 8 L18 26" stroke={c} strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
        <line x1="18" y1="40" x2="30" y2="40" stroke={c} strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    lighter: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="16" y="22" width="16" height="20" rx="3" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="20" y="16" width="8" height="8" rx="1" fill="none" stroke={c} strokeWidth="2"/>
        <path d="M24 16 Q22 10 26 6 Q28 10 27 13" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <path d="M24 16 Q26 12 23 8" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <line x1="16" y1="30" x2="32" y2="30" stroke={c} strokeWidth="1.5" opacity="0.4"/>
      </svg>
    ),
    vial: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <path d="M20 8 L20 22 L12 36 Q12 40 24 40 Q36 40 36 36 L28 22 L28 8 Z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <line x1="20" y1="8" x2="28" y2="8" stroke={c} strokeWidth="2.5"/>
        <rect x="22" y="4" width="4" height="4" rx="1" fill={c} opacity="0.6"/>
        <path d="M15 32 Q24 36 33 32" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5"/>
      </svg>
    ),
    photo: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="6" y="10" width="36" height="28" rx="2" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="6" y="34" width="36" height="4" rx="1" fill={c} opacity="0.2"/>
        <circle cx="18" cy="22" r="5" fill="none" stroke={c} strokeWidth="2"/>
        <path d="M26 18 L32 28 L38 22 L44 28" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round" opacity="0.6"/>
        <line x1="6" y1="34" x2="42" y2="34" stroke={c} strokeWidth="1" opacity="0.4"/>
      </svg>
    ),
    usb: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="16" y="6" width="16" height="10" rx="2" fill="none" stroke={c} strokeWidth="2.5"/>
        <line x1="24" y1="16" x2="24" y2="32" stroke={c} strokeWidth="2.5"/>
        <line x1="14" y1="24" x2="34" y2="24" stroke={c} strokeWidth="2"/>
        <circle cx="14" cy="24" r="3" fill="none" stroke={c} strokeWidth="2"/>
        <circle cx="34" cy="24" r="3" fill="none" stroke={c} strokeWidth="2"/>
        <line x1="14" y1="24" x2="14" y2="30" stroke={c} strokeWidth="2"/>
        <line x1="24" y1="32" x2="24" y2="40" stroke={c} strokeWidth="2.5"/>
        <circle cx="24" cy="40" r="3.5" fill="none" stroke={c} strokeWidth="2"/>
      </svg>
    ),
    tire: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <ellipse cx="24" cy="30" rx="18" ry="10" fill="none" stroke={c} strokeWidth="2.5"/>
        <ellipse cx="24" cy="30" rx="12" ry="6" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <line x1="6" y1="30" x2="6" y2="38" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
        <line x1="42" y1="30" x2="42" y2="38" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
        <path d="M10 20 Q24 14 38 20" fill="none" stroke={c} strokeWidth="2" opacity="0.4"/>
      </svg>
    ),
    frame: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="6" y="6" width="36" height="36" rx="2" fill="none" stroke={c} strokeWidth="3"/>
        <rect x="12" y="12" width="24" height="24" rx="1" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <path d="M12 30 L20 18 L28 26 L33 20 L36 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round" opacity="0.6"/>
        <line x1="14" y1="44" x2="20" y2="38" stroke={c} strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
        <line x1="28" y1="44" x2="34" y2="38" stroke={c} strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    rope: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <path d="M10 10 C16 6 18 16 24 14 C30 12 32 6 38 10 C38 20 30 22 28 32 Q26 40 24 42 Q22 40 20 32 C18 22 10 20 10 10 Z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M14 12 C18 10 20 18 24 16 C28 14 30 8 34 12" fill="none" stroke={c} strokeWidth="1.5" opacity="0.4"/>
      </svg>
    ),
    receipt: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <path d="M10 6 L10 42 L14 38 L18 42 L22 38 L26 42 L30 38 L34 42 L38 38 L38 6 Z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <line x1="15" y1="14" x2="33" y2="14" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <line x1="15" y1="20" x2="33" y2="20" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <line x1="15" y1="26" x2="33" y2="26" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <line x1="28" y1="32" x2="33" y2="32" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    watch: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <circle cx="24" cy="26" r="12" fill="none" stroke={c} strokeWidth="2.5"/>
        <circle cx="24" cy="26" r="9" fill="none" stroke={c} strokeWidth="1" opacity="0.4"/>
        <line x1="24" y1="26" x2="24" y2="18" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <line x1="24" y1="26" x2="30" y2="29" stroke={c} strokeWidth="2" strokeLinecap="round"/>
        <rect x="20" y="10" width="8" height="4" rx="1" fill="none" stroke={c} strokeWidth="2"/>
        <rect x="20" y="38" width="8" height="4" rx="1" fill="none" stroke={c} strokeWidth="2"/>
      </svg>
    ),
    jewelry: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <polygon points="24,8 30,18 42,18 33,26 36,38 24,30 12,38 15,26 6,18 18,18" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round"/>
        <circle cx="24" cy="22" r="5" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6"/>
      </svg>
    ),
    pill: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="8" y="20" width="32" height="8" rx="4" fill="none" stroke={c} strokeWidth="2.5"/>
        <line x1="24" y1="20" x2="24" y2="28" stroke={c} strokeWidth="2.5"/>
        <circle cx="40" cy="14" r="5" fill="none" stroke={c} strokeWidth="2" opacity="0.5"/>
        <circle cx="38" cy="34" r="4" fill="none" stroke={c} strokeWidth="2" opacity="0.5"/>
        <circle cx="10" cy="34" r="3" fill="none" stroke={c} strokeWidth="2" opacity="0.5"/>
      </svg>
    ),
    laptop: (
      <svg width={s} height={s} viewBox="0 0 48 48" className={className}>
        <rect x="8" y="10" width="32" height="22" rx="2" fill="none" stroke={c} strokeWidth="2.5"/>
        <rect x="11" y="13" width="26" height="16" rx="1" fill="none" stroke={c} strokeWidth="1.5" opacity="0.5"/>
        <path d="M4 34 L8 32 L40 32 L44 34 L44 36 Q44 38 42 38 L6 38 Q4 38 4 36 Z" fill="none" stroke={c} strokeWidth="2.5"/>
        <line x1="20" y1="34" x2="28" y2="34" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  };

  return icons[icon] ? <>{icons[icon]}</> : null;
};
