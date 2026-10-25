import React from 'react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5 text-sky-500', size = 20 }) => {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  const strokeProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    className: `inline-block shrink-0 ${className}`
  };

  switch (norm) {
    // Column 1
    case 'contractor':
    case 'construction':
      return (
        <svg {...strokeProps}>
          {/* Brick wall with staggered courses */}
          <rect x="2.5" y="4.5" width="19" height="15" rx="1" />
          <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" />
          <line x1="2.5" y1="14.5" x2="21.5" y2="14.5" />
          <line x1="8" y1="4.5" x2="8" y2="9.5" />
          <line x1="16" y1="4.5" x2="16" y2="9.5" />
          <line x1="12" y1="9.5" x2="12" y2="14.5" />
          <line x1="7" y1="14.5" x2="7" y2="19.5" />
          <line x1="17" y1="14.5" x2="17" y2="19.5" />
        </svg>
      );

    case 'airconditioning':
      return (
        <svg {...strokeProps}>
          {/* Fan / AC air impeller with circular casing */}
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M12 9.5C12 6.5 14 5 15.5 5.5S15 9 12 9.5z" />
          <path d="M14.5 12C17.5 12 19 14 18.5 15.5S15 15 14.5 12z" />
          <path d="M12 14.5C12 17.5 10 19 8.5 18.5S9 15 12 14.5z" />
          <path d="M9.5 12C6.5 12 5 10 5.5 8.5S9 9 9.5 12z" />
        </svg>
      );

    case 'alarmsystems':
      return (
        <svg {...strokeProps}>
          {/* House with wireless alert / sensor shield */}
          <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" />
          <path d="M12 11a2.5 2.5 0 012.5 2.5c0 1.8-2.5 4.5-2.5 4.5s-2.5-2.7-2.5-4.5A2.5 2.5 0 0112 11z" />
          <path d="M9 3.5a5 5 0 016 0" />
        </svg>
      );

    case 'architect':
      return (
        <svg {...strokeProps}>
          {/* House with ruler markings on left edge */}
          <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" />
          <path d="M3 13h3" />
          <path d="M3 16h2" />
          <path d="M3 19h3" />
          <path d="M12 13v7" />
          <path d="M15 16h3" />
        </svg>
      );

    case 'asbestos':
      return (
        <svg {...strokeProps}>
          {/* Safety respirator mask with twin filter cartridges */}
          <path d="M7 9a5 5 0 0110 0v2H7V9z" />
          <path d="M5 11h14v3a7 7 0 01-14 0v-3z" />
          <circle cx="5" cy="14" r="2.5" />
          <circle cx="19" cy="14" r="2.5" />
          <path d="M10 16h4" />
        </svg>
      );

    case 'pavement':
      return (
        <svg {...strokeProps}>
          {/* Interlocking paving stones grid */}
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          <path d="M12 3v18" />
          <path d="M3 12h9" />
          <path d="M12 10h9" />
          <path d="M12 16h9" />
          <path d="M7 12v9" />
          <path d="M8 3v9" />
        </svg>
      );

    case 'centralheatingboilers':
      return (
        <svg {...strokeProps}>
          {/* Wall boiler tank with heating waves and bottom pipes */}
          <rect x="5.5" y="2.5" width="13" height="17" rx="2.5" />
          <path d="M9.5 8c0-1.5 1-2 1.5-2s1.5.5 1.5 2c0 2-3 2.5-3 4.5 0 1 1 1.5 1.5 1.5s1.5-.5 1.5-2" />
          <path d="M12.5 8c0-1.5 1-2 1.5-2s1.5.5 1.5 2c0 2-3 2.5-3 4.5 0 1 1 1.5 1.5 1.5s1.5-.5 1.5-2" />
          <path d="M8.5 19.5v2.5" />
          <path d="M15.5 19.5v2.5" />
        </svg>
      );

    // Column 2
    case 'roofing':
      return (
        <svg {...strokeProps}>
          {/* Pitched roof structure with tile lines */}
          <path d="M2.5 11.5L12 3.5l9.5 8" />
          <path d="M5.5 9v11a1 1 0 001 1h11a1 1 0 001-1V9" />
          <path d="M6 13h12" />
          <path d="M6 17h12" />
          <path d="M10 9v12" />
          <path d="M14 9v12" />
        </svg>
      );

    case 'electrician':
      return (
        <svg {...strokeProps}>
          {/* House with power plug / lightning */}
          <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" />
          <path d="M10 11v3" />
          <path d="M14 11v3" />
          <path d="M9 14h6v2a3 3 0 01-6 0v-2z" />
          <path d="M12 19v2" />
        </svg>
      );

    case 'facadeworks':
      return (
        <svg {...strokeProps}>
          {/* Pressure washer lance spraying wall */}
          <line x1="4" y1="20" x2="11" y2="13" />
          <path d="M11 13l2-2" />
          <path d="M14 9l1-1" />
          <path d="M15 8l4-3" />
          <path d="M16 10l5-1" />
          <path d="M17 12l4 1" />
          <line x1="21.5" y1="4" x2="21.5" y2="20" />
        </svg>
      );

    case 'glass':
      return (
        <svg {...strokeProps}>
          {/* Framed glass pane with reflection */}
          <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
          <rect x="6.5" y="6.5" width="11" height="11" />
          <line x1="8" y1="14" x2="14" y2="8" />
          <line x1="10" y1="16" x2="16" y2="10" />
        </svg>
      );

    case 'fencing':
      return (
        <svg {...strokeProps}>
          {/* Picket fence with pointed pickets */}
          <path d="M5 5l1.5-2 1.5 2v16h-3V5z" />
          <path d="M10.5 5l1.5-2 1.5 2v16h-3V5z" />
          <path d="M16 5l1.5-2 1.5 2v16h-3V5z" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="16" x2="21" y2="16" />
        </svg>
      );

    case 'gardener':
    case 'gardening':
      return (
        <svg {...strokeProps}>
          {/* Growing plant / seedling with leaves */}
          <path d="M12 21V11" />
          <path d="M12 15c-3 0-5-2-5-5 3 0 5 2 5 5z" />
          <path d="M12 12c3 0 5-2 5-5-3 0-5 2-5 5z" />
          <path d="M5 21h14" />
        </svg>
      );

    case 'insulation':
      return (
        <svg {...strokeProps}>
          {/* Spiral roll of thermal insulation */}
          <path d="M12 12a2 2 0 102 2" />
          <path d="M12 8a6 6 0 106 6" />
          <path d="M12 4a10 10 0 1010 10c0 4-4 7-10 7" />
        </svg>
      );

    // Column 3
    case 'plumber':
    case 'plumbing':
      return (
        <svg {...strokeProps}>
          {/* House outline with water droplet inside */}
          <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" />
          <path d="M12 10c-1.6 2-3 3.6-3 5.4a3 3 0 006 0c0-1.8-1.4-3.4-3-5.4z" />
        </svg>
      );

    case 'mason':
      return (
        <svg {...strokeProps}>
          {/* Wheelbarrow for construction */}
          <path d="M4 11h11l3-6H3l1 6z" />
          <path d="M7 17l-3-6" />
          <circle cx="17.5" cy="17.5" r="2.5" />
          <path d="M14 11l3.5 6.5" />
          <path d="M19 14h2" />
          <path d="M8 17v3" />
        </svg>
      );

    case 'windows':
      return (
        <svg {...strokeProps}>
          {/* Double casement window */}
          <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
          <line x1="12" y1="3.5" x2="12" y2="20.5" />
          <line x1="3.5" y1="12" x2="20.5" y2="12" />
          <line x1="10.5" y1="11" x2="10.5" y2="13" />
          <line x1="13.5" y1="11" x2="13.5" y2="13" />
        </svg>
      );

    case 'rollershutters':
      return (
        <svg {...strokeProps}>
          {/* Window with horizontal rolling shutter slats */}
          <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
          <line x1="3.5" y1="7.5" x2="20.5" y2="7.5" />
          <line x1="3.5" y1="11" x2="20.5" y2="11" />
          <line x1="3.5" y1="14.5" x2="20.5" y2="14.5" />
          <line x1="3.5" y1="18" x2="20.5" y2="18" />
        </svg>
      );

    case 'painter':
    case 'painting':
      return (
        <svg {...strokeProps}>
          {/* Paint roller with drip */}
          <rect x="3.5" y="4" width="14" height="6" rx="1.5" />
          <path d="M17.5 7h2.5v5.5H12V18" />
          <rect x="10.5" y="18" width="3" height="4" rx="0.75" />
          <circle cx="7" cy="13" r="1" />
        </svg>
      );

    case 'joiner':
      return (
        <svg {...strokeProps}>
          {/* Timber framing / carpenter A-frame joint */}
          <path d="M3 12l9-8 9 8" />
          <path d="M6 9.5v11h12v-11" />
          <line x1="6" y1="14" x2="18" y2="14" />
          <line x1="9" y1="14" x2="12" y2="20.5" />
          <line x1="15" y1="14" x2="12" y2="20.5" />
        </svg>
      );

    case 'plasterer':
      return (
        <svg {...strokeProps}>
          {/* Plaster trowel / hawk smoothing mortar */}
          <rect x="4" y="9" width="16" height="5" rx="1" />
          <path d="M12 9V5" />
          <path d="M9 5h6" />
          <line x1="5" y1="18" x2="19" y2="18" strokeDasharray="1.5 2.5" />
        </svg>
      );

    // Column 4
    case 'tiler':
      return (
        <svg {...strokeProps}>
          {/* Tile layout trowel and grid */}
          <rect x="3" y="3" width="7" height="7" rx="0.5" />
          <rect x="14" y="3" width="7" height="7" rx="0.5" />
          <rect x="3" y="14" width="7" height="7" rx="0.5" />
          <path d="M14 14l5-2v7l-5-2v-3z" />
          <circle cx="16" cy="16" r="1" />
        </svg>
      );

    case 'floors':
      return (
        <svg {...strokeProps}>
          {/* Hardwood flooring planks */}
          <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
          <line x1="9" y1="3.5" x2="9" y2="20.5" />
          <line x1="15" y1="3.5" x2="15" y2="20.5" />
          <line x1="3.5" y1="10" x2="9" y2="10" />
          <line x1="9" y1="15" x2="15" y2="15" />
          <line x1="15" y1="8" x2="20.5" y2="8" />
        </svg>
      );

    case 'moisturecontrol':
      return (
        <svg {...strokeProps}>
          {/* Circular moisture gauge with droplet */}
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5c-1.5 2-2.5 3.5-2.5 5a2.5 2.5 0 005 0c0-1.5-1-3-2.5-5z" />
        </svg>
      );

    case 'heatpump':
      return (
        <svg {...strokeProps}>
          {/* Heat pump outdoor unit / thermal cycle */}
          <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" />
          <path d="M9 14c1.5-1 4.5-1 6 0" />
          <path d="M9 17c1.5-1 4.5-1 6 0" />
        </svg>
      );

    case 'solarpanels':
      return (
        <svg {...strokeProps}>
          {/* Solar panel with sun rays */}
          <path d="M4 11l13-5 3 13-13 3L4 11z" />
          <line x1="10.5" y1="8.5" x2="13.5" y2="20.5" />
          <line x1="5.5" y1="15" x2="18.5" y2="12.5" />
          <circle cx="4.5" cy="4.5" r="2" />
          <line x1="8" y1="5.5" x2="10.5" y2="6.5" />
          <line x1="4.5" y1="8" x2="4.5" y2="10" />
        </svg>
      );

    case 'sunprotection':
      return (
        <svg {...strokeProps}>
          {/* Retractable awning / sun shade */}
          <path d="M3 8h18l-3 9H6L3 8z" />
          <path d="M6 17c1 1.5 2 1.5 3 0s2-1.5 3 0 2 1.5 3 0 2-1.5 3 0" />
          <line x1="3" y1="8" x2="6" y2="17" />
          <line x1="12" y1="8" x2="12" y2="17" />
          <line x1="21" y1="8" x2="18" y2="17" />
          <path d="M7 5a3 3 0 015-1" />
        </svg>
      );

    // Fallback default
    default:
      return (
        <svg {...strokeProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      );
  }
};

export interface CategoryTheme {
  iconColor: string;
  badgeBg: string;
  badgeBorder: string;
  hoverBorder: string;
  glowColor: string;
}

export const getCategoryTheme = (name: string): CategoryTheme => {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (norm) {
    case 'plumber':
    case 'plumbing':
      return {
        iconColor: 'text-[#2878FF]',
        badgeBg: 'bg-[#2878FF]/15',
        badgeBorder: 'border-[#2878FF]/35',
        hoverBorder: 'hover:border-[#2878FF]',
        glowColor: 'rgba(40, 120, 255, 0.25)',
      };
    case 'electrician':
    case 'electrical':
      return {
        iconColor: 'text-amber-400',
        badgeBg: 'bg-amber-400/15',
        badgeBorder: 'border-amber-400/35',
        hoverBorder: 'hover:border-amber-400',
        glowColor: 'rgba(251, 191, 36, 0.25)',
      };
    case 'contractor':
    case 'construction':
    case 'mason':
      return {
        iconColor: 'text-orange-400',
        badgeBg: 'bg-orange-400/15',
        badgeBorder: 'border-orange-400/35',
        hoverBorder: 'hover:border-orange-400',
        glowColor: 'rgba(251, 146, 60, 0.25)',
      };
    case 'architect':
    case 'design':
      return {
        iconColor: 'text-purple-400',
        badgeBg: 'bg-purple-400/15',
        badgeBorder: 'border-purple-400/35',
        hoverBorder: 'hover:border-purple-400',
        glowColor: 'rgba(192, 132, 252, 0.25)',
      };
    case 'cleaning':
    case 'cleaner':
      return {
        iconColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-400/15',
        badgeBorder: 'border-emerald-400/35',
        hoverBorder: 'hover:border-emerald-400',
        glowColor: 'rgba(52, 211, 153, 0.25)',
      };
    case 'beauty':
      return {
        iconColor: 'text-rose-400',
        badgeBg: 'bg-rose-400/15',
        badgeBorder: 'border-rose-400/35',
        hoverBorder: 'hover:border-rose-400',
        glowColor: 'rgba(251, 113, 133, 0.25)',
      };
    case 'painter':
    case 'painting':
      return {
        iconColor: 'text-pink-400',
        badgeBg: 'bg-pink-400/15',
        badgeBorder: 'border-pink-400/35',
        hoverBorder: 'hover:border-pink-400',
        glowColor: 'rgba(244, 114, 182, 0.25)',
      };
    case 'tech':
    case 'techit':
      return {
        iconColor: 'text-cyan-400',
        badgeBg: 'bg-cyan-400/15',
        badgeBorder: 'border-cyan-400/35',
        hoverBorder: 'hover:border-cyan-400',
        glowColor: 'rgba(34, 211, 238, 0.25)',
      };
    case 'gardener':
    case 'gardening':
    case 'fencing':
      return {
        iconColor: 'text-lime-400',
        badgeBg: 'bg-lime-400/15',
        badgeBorder: 'border-lime-400/35',
        hoverBorder: 'hover:border-lime-400',
        glowColor: 'rgba(163, 230, 53, 0.25)',
      };
    case 'roofing':
    case 'asbestos':
      return {
        iconColor: 'text-red-400',
        badgeBg: 'bg-red-400/15',
        badgeBorder: 'border-red-400/35',
        hoverBorder: 'hover:border-red-400',
        glowColor: 'rgba(248, 113, 113, 0.25)',
      };
    case 'airconditioning':
    case 'moisturecontrol':
      return {
        iconColor: 'text-sky-300',
        badgeBg: 'bg-sky-400/15',
        badgeBorder: 'border-sky-400/35',
        hoverBorder: 'hover:border-sky-400',
        glowColor: 'rgba(56, 189, 248, 0.25)',
      };
    case 'solarpanels':
    case 'sunprotection':
      return {
        iconColor: 'text-yellow-300',
        badgeBg: 'bg-yellow-300/15',
        badgeBorder: 'border-yellow-300/35',
        hoverBorder: 'hover:border-yellow-300',
        glowColor: 'rgba(253, 224, 71, 0.25)',
      };
    case 'glass':
    case 'windows':
    case 'rollershutters':
      return {
        iconColor: 'text-blue-300',
        badgeBg: 'bg-blue-400/15',
        badgeBorder: 'border-blue-400/35',
        hoverBorder: 'hover:border-blue-400',
        glowColor: 'rgba(96, 165, 250, 0.25)',
      };
    case 'centralheatingboilers':
    case 'heatpump':
      return {
        iconColor: 'text-amber-500',
        badgeBg: 'bg-amber-500/15',
        badgeBorder: 'border-amber-500/35',
        hoverBorder: 'hover:border-amber-500',
        glowColor: 'rgba(245, 158, 11, 0.25)',
      };
    case 'tiler':
    case 'floors':
    case 'facadeworks':
      return {
        iconColor: 'text-teal-400',
        badgeBg: 'bg-teal-400/15',
        badgeBorder: 'border-teal-400/35',
        hoverBorder: 'hover:border-teal-400',
        glowColor: 'rgba(45, 212, 191, 0.25)',
      };
    case 'alarmsystems':
      return {
        iconColor: 'text-yellow-400',
        badgeBg: 'bg-yellow-400/15',
        badgeBorder: 'border-yellow-400/35',
        hoverBorder: 'hover:border-yellow-400',
        glowColor: 'rgba(250, 204, 21, 0.25)',
      };
    case 'insulation':
      return {
        iconColor: 'text-indigo-400',
        badgeBg: 'bg-indigo-400/15',
        badgeBorder: 'border-indigo-400/35',
        hoverBorder: 'hover:border-indigo-400',
        glowColor: 'rgba(129, 140, 248, 0.25)',
      };
    case 'joiner':
    case 'plasterer':
    case 'pavement':
      return {
        iconColor: 'text-orange-300',
        badgeBg: 'bg-orange-300/15',
        badgeBorder: 'border-orange-300/35',
        hoverBorder: 'hover:border-orange-300',
        glowColor: 'rgba(253, 186, 116, 0.25)',
      };
    default:
      return {
        iconColor: 'text-[#38bdf8]',
        badgeBg: 'bg-[#38bdf8]/15',
        badgeBorder: 'border-[#38bdf8]/35',
        hoverBorder: 'hover:border-[#38bdf8]',
        glowColor: 'rgba(56, 189, 248, 0.25)',
      };
  }
};

export default CategoryIcon;

