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

    case 'triangle': {
      const pts = `${w/2},${sw} ${w-sw},${h-sw} ${sw},${h-sw}`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'pentagon': {
      const pts = [
        [w/2, sw], [w-sw, h*0.4], [w*0.81, h-sw], [w*0.19, h-sw], [sw, h*0.4],
      ].map(p => p.join(',')).join(' ');
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'octagon': {
      const dx = w * 0.293, dy = h * 0.293;
      const pts = [
        [dx, sw], [w-dx, sw], [w-sw, dy], [w-sw, h-dy],
        [w-dx, h-sw], [dx, h-sw], [sw, h-dy], [sw, dy],
      ].map(p => p.join(',')).join(' ');
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'cross': {
      const ax = w*0.34, bx = w*0.66, ay = h*0.34, by = h*0.66;
      const pts = [
        [ax,sw],[bx,sw],[bx,ay],[w-sw,ay],[w-sw,by],[bx,by],
        [bx,h-sw],[ax,h-sw],[ax,by],[sw,by],[sw,ay],[ax,ay],
      ].map(p => p.join(',')).join(' ');
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'star': {
      const cx = w/2, cy = h/2;
      const R = Math.min(w, h) / 2 - sw;
      const r = R * 0.4;
      const arr = [];
      for (let i = 0; i < 10; i++) {
        const ang = (-90 + i * 36) * Math.PI / 180;
        const rad = i % 2 === 0 ? R : r;
        arr.push([(cx + rad * Math.cos(ang)).toFixed(1), (cy + rad * Math.sin(ang)).toFixed(1)]);
      }
      const pts = arr.map(p => p.join(',')).join(' ');
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'cloud': {
      const r = Math.min(w, h) * 0.28;
      const d = `M ${0.22*w},${h-sw}
        A ${r},${r} 0 0 1 ${0.16*w},${0.52*h}
        A ${r},${r} 0 0 1 ${0.34*w},${0.26*h}
        A ${r},${r} 0 0 1 ${0.60*w},${0.24*h}
        A ${r},${r} 0 0 1 ${0.80*w},${0.46*h}
        A ${r},${r} 0 0 1 ${0.80*w},${h-sw} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'cube': {
      const d = Math.min(w, h) * 0.18;
      const front = `M ${sw},${d} L ${w-d-sw},${d} L ${w-d-sw},${h-sw} L ${sw},${h-sw} Z`;
      const top   = `M ${sw},${d} L ${d+sw},${sw} L ${w-sw},${sw} L ${w-d-sw},${d} Z`;
      const side  = `M ${w-d-sw},${d} L ${w-sw},${sw} L ${w-sw},${h-d-sw} L ${w-d-sw},${h-sw} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={top}  fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fillOpacity={0.85} />
          <path d={side} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fillOpacity={0.7} />
          <path d={front} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'document': {
      const wave = h * 0.14;
      const d = `M ${sw},${sw} L ${w-sw},${sw} L ${w-sw},${h-wave}
        C ${0.75*w},${h} ${0.25*w},${h-2*wave} ${sw},${h-wave} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'multi-document': {
      const wave = h * 0.12, off = 6;
      const doc = (x, y) => `M ${x},${y} L ${x+w-off-sw},${y} L ${x+w-off-sw},${y+h-off-wave}
        C ${x+0.75*(w-off)},${y+h-off} ${x+0.25*(w-off)},${y+h-off-2*wave} ${x},${y+h-off-wave} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={doc(off, sw)}  fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d={doc(off/2, off/2)} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d={doc(sw, off)}  fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'trapezoid': {
      const o = w * 0.18;
      const pts = `${sw},${sw} ${w-sw},${sw} ${w-o},${h-sw} ${o},${h-sw}`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'manual-input': {
      const pts = `${sw},${h*0.28} ${w-sw},${sw} ${w-sw},${h-sw} ${sw},${h-sw}`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'display': {
      const d = `M ${0.18*w},${sw} L ${0.82*w},${sw}
        C ${w},${sw} ${w},${h-sw} ${0.82*w},${h-sw}
        L ${0.18*w},${h-sw} L ${sw},${h/2} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'delay': {
      const d = `M ${sw},${sw} L ${0.6*w},${sw}
        C ${w},${sw} ${w},${h-sw} ${0.6*w},${h-sw} L ${sw},${h-sw} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'predefined-process': {
      const bar = 10;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <rect x={sw/2} y={sw/2} width={w-sw} height={h-sw} fill={fill} stroke={stroke} strokeWidth={sw} />
          <line x1={bar} y1={sw} x2={bar} y2={h-sw} stroke={stroke} strokeWidth={sw} />
          <line x1={w-bar} y1={sw} x2={w-bar} y2={h-sw} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'stored-data': {
      const c = w * 0.14;
      const d = `M ${c},${sw} C ${sw},${h*0.25} ${sw},${h*0.75} ${c},${h-sw}
        L ${w-sw},${h-sw} C ${w-c-sw},${h*0.75} ${w-c-sw},${h*0.25} ${w-sw},${sw} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'offpage': {
      const pts = `${sw},${sw} ${w-sw},${sw} ${w-sw},${h*0.62} ${w/2},${h-sw} ${sw},${h*0.62}`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'arrow-right':
    case 'arrow-left':
    case 'arrow-up':
    case 'arrow-down':
    case 'arrow-h': {
      const m = Math.min(h, w) * 0.22;
      let pts;
      if (shape === 'arrow-right') {
        const head = Math.min(w*0.4, h*0.6);
        pts = `${sw},${h/2-m} ${w-head},${h/2-m} ${w-head},${sw} ${w-sw},${h/2} ${w-head},${h-sw} ${w-head},${h/2+m} ${sw},${h/2+m}`;
      } else if (shape === 'arrow-left') {
        const head = Math.min(w*0.4, h*0.6);
        pts = `${w-sw},${h/2-m} ${head},${h/2-m} ${head},${sw} ${sw},${h/2} ${head},${h-sw} ${head},${h/2+m} ${w-sw},${h/2+m}`;
      } else if (shape === 'arrow-up') {
        const head = Math.min(h*0.4, w*0.6);
        pts = `${w/2-m},${h-sw} ${w/2-m},${head} ${sw},${head} ${w/2},${sw} ${w-sw},${head} ${w/2+m},${head} ${w/2+m},${h-sw}`;
      } else if (shape === 'arrow-down') {
        const head = Math.min(h*0.4, w*0.6);
        pts = `${w/2-m},${sw} ${w/2-m},${h-head} ${sw},${h-head} ${w/2},${h-sw} ${w-sw},${h-head} ${w/2+m},${h-head} ${w/2+m},${sw}`;
      } else {
        const head = Math.min(w*0.25, h*0.6);
        pts = `${sw},${h/2} ${head},${sw} ${head},${h/2-m} ${w-head},${h/2-m} ${w-head},${sw} ${w-sw},${h/2} ${w-head},${h-sw} ${w-head},${h/2+m} ${head},${h/2+m} ${head},${h-sw}`;
      }
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'chevron': {
      const n = h * 0.32;
      const pts = `${sw},${sw} ${w-n},${sw} ${w-sw},${h/2} ${w-n},${h-sw} ${sw},${h-sw} ${sw+n},${h/2}`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'component': {
      const tw = 16, th = 10, ty1 = h * 0.22, ty2 = h * 0.55;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <rect x={tw/2} y={sw/2} width={w-tw/2-sw/2} height={h-sw} fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x={sw/2} y={ty1} width={tw} height={th} fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x={sw/2} y={ty2} width={tw} height={th} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'folder': {
      const tab = w * 0.42, th = h * 0.18;
      const d = `M ${sw},${sw} L ${tab},${sw} L ${tab},${sw+th} L ${w-sw},${sw+th}
        L ${w-sw},${h-sw} L ${sw},${h-sw} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'callout': {
      const r = 8, tail = h * 0.22;
      const bodyH = h - tail;
      const d = `M ${r},${sw} L ${w-r},${sw} Q ${w-sw},${sw} ${w-sw},${r}
        L ${w-sw},${bodyH-r} Q ${w-sw},${bodyH} ${w-r},${bodyH}
        L ${0.42*w},${bodyH} L ${0.24*w},${h-sw} L ${0.3*w},${bodyH}
        L ${r},${bodyH} Q ${sw},${bodyH} ${sw},${bodyH-r}
        L ${sw},${r} Q ${sw},${sw} ${r},${sw} Z`;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'brick': {
      const r1 = h / 3, r2 = (h / 3) * 2;
      return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="visible">
          <rect x={sw/2} y={sw/2} width={w-sw} height={h-sw} fill={fill} stroke={stroke} strokeWidth={sw} />
          <line x1={sw} y1={r1} x2={w-sw} y2={r1} stroke={stroke} strokeWidth={1} strokeOpacity={0.6} />
          <line x1={sw} y1={r2} x2={w-sw} y2={r2} stroke={stroke} strokeWidth={1} strokeOpacity={0.6} />
          <line x1={w*0.33} y1={sw} x2={w*0.33} y2={r1} stroke={stroke} strokeWidth={1} strokeOpacity={0.6} />
          <line x1={w*0.66} y1={sw} x2={w*0.66} y2={r1} stroke={stroke} strokeWidth={1} strokeOpacity={0.6} />
          <line x1={w*0.5} y1={r1} x2={w*0.5} y2={r2} stroke={stroke} strokeWidth={1} strokeOpacity={0.6} />
          <line x1={w*0.33} y1={r2} x2={w*0.33} y2={h-sw} stroke={stroke} strokeWidth={1} strokeOpacity={0.6} />
          <line x1={w*0.66} y1={r2} x2={w*0.66} y2={h-sw} stroke={stroke} strokeWidth={1} strokeOpacity={0.6} />
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
