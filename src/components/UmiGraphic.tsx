import React from 'react';
import { AvatarExpression } from '../types';

export function UmiPetal({ size = 30, color = '#C9B8FF' }: { size?: number; color?: string }) {
  const p = 'M 50 46 C 40 42, 27 32, 30 18 C 33 6, 67 6, 70 18 C 73 32, 60 42, 50 46 Z';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="umi"
      className="shrink-0"
    >
      <g fill={color}>
        <path d={p} />
        <path d={p} transform="rotate(90 50 50)" />
        <path d={p} transform="rotate(180 50 50)" />
        <path d={p} transform="rotate(270 50 50)" />
      </g>
    </svg>
  );
}

export function AvatarSvg({
  color = '#C9B8FF',
  expression = 'Builder',
  size = 32,
  className = '',
}: {
  color?: string;
  expression?: AvatarExpression | string;
  size?: number;
  className?: string;
}) {
  const renderFeatures = () => {
    switch (expression) {
      case 'Builder':
        return (
          <>
            {/* Protective visor brim / hardhat accent */}
            <path d="M 20 28 C 22 17, 58 17, 60 28 Z" fill="#000000" opacity="0.85" />
            <rect x="29" y="34" width="5.5" height="11" rx="2" fill="#000000" />
            <rect x="45.5" y="34" width="5.5" height="11" rx="2" fill="#000000" />
            <path
              d="M32 53 Q40 60 48 53"
              stroke="#000000"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'Operator':
        return (
          <>
            {/* Glasses frames & bridge */}
            <circle cx="31" cy="37" r="7.5" stroke="#000000" strokeWidth="2.8" fill="none" />
            <circle cx="49" cy="37" r="7.5" stroke="#000000" strokeWidth="2.8" fill="none" />
            <line x1="38.5" y1="37" x2="41.5" y2="37" stroke="#000000" strokeWidth="2.8" />
            <circle cx="31" cy="37" r="2.8" fill="#000000" />
            <circle cx="49" cy="37" r="2.8" fill="#000000" />
            {/* Headset mic */}
            <path
              d="M 23.5 40 Q 18 49 28 53"
              stroke="#000000"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="29" cy="53" r="2" fill="#000000" />
            <path
              d="M34 56 Q40 58.5 46 56"
              stroke="#000000"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'Visionary':
        return (
          <>
            {/* High arched brows */}
            <path
              d="M26 26 Q32 21 38 26"
              stroke="#000000"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M42 26 Q48 21 54 26"
              stroke="#000000"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Star sparkle eyes */}
            <path
              d="M32 30 L33.5 35 L38.5 36.5 L33.5 38 L32 43 L30.5 38 L25.5 36.5 L30.5 35 Z"
              fill="#000000"
            />
            <path
              d="M48 30 L49.5 35 L54.5 36.5 L49.5 38 L48 43 L46.5 38 L41.5 36.5 L46.5 35 Z"
              fill="#000000"
            />
            <path
              d="M33 53 Q40 62 47 53"
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'Maker':
        return (
          <>
            {/* Pencil tucked at ear angle */}
            <rect
              x="52"
              y="18"
              width="18"
              height="4"
              rx="2"
              transform="rotate(-28 52 18)"
              fill="#000000"
              opacity="0.85"
            />
            {/* One cheeky wink, one open focused eye */}
            <path
              d="M27 38 Q32 32 37 38"
              stroke="#000000"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="48" cy="37" r="4.8" fill="#000000" />
            <circle cx="49.5" cy="35.5" r="1.5" fill="#FFFFFF" />
            {/* Playful side smirk */}
            <path
              d="M33 54 Q42 58 48 50"
              stroke="#000000"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'Boss':
        return (
          <>
            {/* Sleek dark wayfarer sunglasses with subtle highlight streak */}
            <path
              d="M21 29 L59 29 L57 42 Q49 45 42 36 Q35 45 23 42 Z"
              fill="#000000"
            />
            <line
              x1="26"
              y1="32.5"
              x2="37"
              y2="32.5"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              opacity="0.65"
              strokeLinecap="round"
            />
            {/* Confident smirk */}
            <path
              d="M33 53 Q42 61 49 52"
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'Streamer':
        return (
          <>
            {/* Over-ear headphones headband and earcups */}
            <path
              d="M18 38 C 18 19, 62 19, 62 38"
              stroke="#000000"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="14" y="31" width="7" height="17" rx="3.5" fill="#000000" />
            <rect x="59" y="31" width="7" height="17" rx="3.5" fill="#000000" />
            <circle cx="31" cy="37" r="4.2" fill="#000000" />
            <circle cx="49" cy="37" r="4.2" fill="#000000" />
            {/* Wide joyful mouth */}
            <path d="M32 50 Q40 64 48 50 Z" fill="#000000" />
          </>
        );

      case 'Vlogger':
        return (
          <>
            {/* Red recording LED */}
            <circle cx="58" cy="22" r="3.5" fill="#EF4444" />
            <circle cx="58" cy="22" r="5" stroke="#EF4444" strokeWidth="1" fill="none" opacity="0.6" />
            {/* Wink left, camera aperture circle right */}
            <path
              d="M27 37 Q32 32 37 37"
              stroke="#000000"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="48" cy="37" r="5.5" stroke="#000000" strokeWidth="2.6" fill="none" />
            <circle cx="48" cy="37" r="2.2" fill="#000000" />
            <path
              d="M33 53 Q40 61 47 53"
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'Trendsetter':
        return (
          <>
            {/* Cat-eye fashionable tinted sunglasses */}
            <path
              d="M21 34 Q32 28 39 36 Q34 44 23 39 Z"
              fill="#000000"
            />
            <path
              d="M59 34 Q48 28 41 36 Q46 44 57 39 Z"
              fill="#000000"
            />
            {/* Beauty dot */}
            <circle cx="26" cy="48" r="1.5" fill="#000000" />
            {/* Poised smile */}
            <path
              d="M34 54 Q40 59 47 54"
              stroke="#000000"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'Chill':
        return (
          <>
            {/* Sleepy curved eyes ^ ^ */}
            <path
              d="M27 38 Q32 32 37 38"
              stroke="#000000"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M43 38 Q48 32 53 38"
              stroke="#000000"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Calm peaceful curved mouth */}
            <path
              d="M35 52 Q40 57 45 52"
              stroke="#000000"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );

      case 'Hype':
        return (
          <>
            {/* Star sparkling eyes */}
            <path
              d="M32 29 L34 34 L39 35 L35 38 L37 43 L32 40 L27 43 L29 38 L25 35 L30 34 Z"
              fill="#000000"
            />
            <path
              d="M48 29 L50 34 L55 35 L51 38 L53 43 L48 40 L43 43 L45 38 L41 35 L46 34 Z"
              fill="#000000"
            />
            {/* Open excited laughing mouth */}
            <path d="M31 49 Q40 65 49 49 Z" fill="#000000" />
            <path d="M35 56 Q40 63 45 56" fill="#C9B8FF" />
          </>
        );

      default:
        return (
          <>
            <rect x="31" y="32" width="6" height="13" rx="3" fill="#000000" />
            <rect x="43" y="32" width="6" height="13" rx="3" fill="#000000" />
            <path
              d="M33 54 Q40 61 47 54"
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={`shrink-0 ${className}`}
      aria-label={`Avatar ${expression}`}
    >
      <circle cx="40" cy="40" r="40" fill={color} />
      {renderFeatures()}
    </svg>
  );
}

export function CampaignTile({
  bg,
  fg,
  icon,
  name,
  size = 48,
  rounded = 14,
}: {
  bg: string;
  fg: string;
  icon: string;
  name?: string;
  size?: number;
  rounded?: number;
}) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${rounded}px`,
        backgroundColor: bg,
        color: fg,
      }}
      className="flex flex-col items-center justify-center shrink-0 text-center font-medium select-none overflow-hidden"
    >
      <i className={`ti ${icon}`} style={{ fontSize: `${Math.round(size * 0.38)}px` }} />
      {size >= 64 && name && (
        <span className="text-[11px] px-1 truncate max-w-full font-semibold">{name}</span>
      )}
    </div>
  );
}

export function QrCodeSvg({ size = 96 }: { size?: number }) {
  const s = 6;
  const r = 11;
  const rects: { x: number; y: number }[] = [];

  function fin(a: number, b: number) {
    return (a < 3 && b < 3) || (a < 3 && b > 7) || (a > 7 && b < 3);
  }

  for (let i = 0; i < r; i++) {
    for (let j = 0; j < r; j++) {
      let on = false;
      if (fin(i, j)) {
        const u = i > 7 ? i - 8 : i;
        const v = j > 7 ? j - 8 : j;
        on = !(u === 1 && v === 1);
      } else {
        on = ((i * 7 + j * 13 + i * j) % 5) < 2;
      }
      if (on) {
        rects.push({ x: j * s, y: i * s });
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox="0 0 66 66" aria-label="QR code" className="shrink-0">
      {rects.map((rc, idx) => (
        <rect key={idx} x={rc.x} y={rc.y} width={s} height={s} fill="#000000" />
      ))}
    </svg>
  );
}
