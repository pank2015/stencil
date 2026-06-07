// Renders the geometric shape as an SVG, parameterised by spec
export function ShapeRenderer({ spec, selected, w, h }) {
  const { shape, color } = spec;
  const stroke = color.border;
  const fill = color.fill;
  const sw = selected ? 2.5 : 2;

  switch (shape) {

    case 'cylinder':
    case 'cylinder-wide': {
      const rx = w / 2 - 1;
      const ry = Math.max(8, h * 0.12);
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <defs>
            <clipPath id={`cyl-clip-${w}-${h}`}>
              <rect x={0} y={ry} width={w} height={h - ry} />
            </clipPath>
          </defs>
          {/* body */}
          <rect x={sw/2} y={ry} width={w - sw} height={h - ry * 2} fill={fill} stroke={stroke} strokeWidth={sw} />
          {/* bottom ellipse */}
          <ellipse cx={w/2} cy={h - ry} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={sw} />
          {/* top ellipse (drawn last = on top) */}
          <ellipse cx={w/2} cy={ry} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'hexagon': {
      const pad = sw;
      const hw = w - pad * 2;
      const hh = h - pad * 2;
      const d = hh * 0.25;
      const pts = [
        [pad + d, pad],
        [pad + hw - d, pad],
        [pad + hw, pad + hh / 2],
        [pad + hw - d, pad + hh],
        [pad + d, pad + hh],
        [pad, pad + hh / 2],
      ].map(p => p.join(',')).join(' ');
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'diamond': {
      const pts = `${w/2},${sw} ${w-sw},${h/2} ${w/2},${h-sw} ${sw},${h/2}`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'ellipse': {
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <ellipse cx={w/2} cy={h/2} rx={w/2 - sw/2} ry={h/2 - sw/2} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'circle':
    case 'circle-thick': {
      const r = Math.min(w, h) / 2 - sw / 2;
      const thick = shape === 'circle-thick' ? sw + 2 : sw;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <circle cx={w/2} cy={h/2} r={r} fill={fill} stroke={stroke} strokeWidth={thick} />
          {shape === 'circle-thick' && (
            <circle cx={w/2} cy={h/2} r={r * 0.55} fill={stroke} />
          )}
        </svg>
      );
    }

    case 'note': {
      const fold = 16;
      const path = `M ${sw} ${sw} L ${w - fold - sw} ${sw} L ${w - sw} ${fold + sw} L ${w - sw} ${h - sw} L ${sw} ${h - sw} Z`;
      const corner = `M ${w - fold - sw} ${sw} L ${w - fold - sw} ${fold + sw} L ${w - sw} ${fold + sw}`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={path} fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d={corner} fill="none" stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'parallelogram': {
      const skew = 18;
      const pts = `${skew},${sw} ${w-sw},${sw} ${w-sw-skew},${h-sw} ${sw},${h-sw}`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'rect-queue': {
      // Rectangle with 3 vertical divider lines near the left to suggest queue slots
      const slotW = 14;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <rect x={sw/2} y={sw/2} width={w-sw} height={h-sw} rx={3} fill={fill} stroke={stroke} strokeWidth={sw} />
          {[1,2,3].map(i => (
            <line key={i} x1={slotW*i} y1={sw} x2={slotW*i} y2={h-sw} stroke={stroke} strokeWidth={0.8} strokeOpacity={0.5} />
          ))}
        </svg>
      );
    }

    case 'rect-dashed': {
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <rect x={sw/2} y={sw/2} width={w-sw} height={h-sw} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray="8 4" />
        </svg>
      );
    }

    case 'rounded-dashed': {
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <rect x={sw/2} y={sw/2} width={w-sw} height={h-sw} rx={8} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray="8 4" />
        </svg>
      );
    }

    case 'rect-notched': {
      const notch = 12;
      const path = `M ${sw} ${sw} L ${w - notch - sw} ${sw} L ${w - sw} ${notch + sw} L ${w - sw} ${h - sw} L ${sw} ${h - sw} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={path} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'rect-striped': {
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <defs>
            <pattern id="stripe" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
              <rect width="4" height="8" fill="rgba(0,0,0,.04)" />
            </pattern>
          </defs>
          <rect x={sw/2} y={sw/2} width={w-sw} height={h-sw} fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x={sw/2} y={sw/2} width={w-sw} height={h-sw} fill="url(#stripe)" />
        </svg>
      );
    }

    case 'rounded': {
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <rect x={sw/2} y={sw/2} width={w-sw} height={h-sw} rx={8} ry={8} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    default: // 'rect'
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <rect x={sw/2} y={sw/2} width={w-sw} height={h-sw} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
  }
}
