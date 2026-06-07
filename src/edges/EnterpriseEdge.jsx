import { memo, useCallback, useState, useRef } from 'react';
import {
  BaseEdge, EdgeLabelRenderer,
  getBezierPath, getStraightPath, getSmoothStepPath,
  useReactFlow,
} from 'reactflow';
import { CONNECTORS } from '../data/connectors';
import useDiagramStore from '../store/store';

// ── SVG Marker definitions ──────────────────────────────────────
export function EdgeMarkerDefs() {
  const colors = [...new Set(Object.values(CONNECTORS).map(c => c.color))];
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {colors.map(color => {
          const id = color.replace('#', '');
          return (
            <g key={color}>
              <marker id={`arr-filled-${id}`}     markerWidth={10} markerHeight={7}  refX={9}  refY={3.5} orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={color} />
              </marker>
              <marker id={`arr-open-${id}`}       markerWidth={10} markerHeight={8}  refX={9}  refY={4}   orient="auto">
                <polyline points="0,0 8,4 0,8" stroke={color} strokeWidth={1.5} fill="none" />
              </marker>
              <marker id={`arr-hollow-tri-${id}`} markerWidth={12} markerHeight={10} refX={11} refY={5}   orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="white" stroke={color} strokeWidth={1.5} />
              </marker>
              <marker id={`diamond-filled-${id}`} markerWidth={12} markerHeight={8}  refX={1}  refY={4}   orient="auto">
                <polygon points="0 4, 5 0, 10 4, 5 8" fill={color} />
              </marker>
              <marker id={`diamond-open-${id}`}   markerWidth={12} markerHeight={8}  refX={1}  refY={4}   orient="auto">
                <polygon points="0 4, 5 0, 10 4, 5 8" fill="white" stroke={color} strokeWidth={1.5} />
              </marker>
              <marker id={`circle-${id}`}         markerWidth={8}  markerHeight={8}  refX={4}  refY={4}   orient="auto">
                <circle cx={4} cy={4} r={3} fill="white" stroke={color} strokeWidth={1.5} />
              </marker>
            </g>
          );
        })}
      </defs>
    </svg>
  );
}

function markerUrl(type, color) {
  const id = color.replace('#', '');
  switch (type) {
    case 'filled-arrow':    return `url(#arr-filled-${id})`;
    case 'open-arrow':      return `url(#arr-open-${id})`;
    case 'hollow-triangle': return `url(#arr-hollow-tri-${id})`;
    case 'filled-diamond':  return `url(#diamond-filled-${id})`;
    case 'open-diamond':    return `url(#diamond-open-${id})`;
    case 'circle':          return `url(#circle-${id})`;
    default:                return undefined;
  }
}

function computeAutoPath(routingStyle, params) {
  switch (routingStyle) {
    case 'bezier':     return getBezierPath(params);
    case 'straight':   return getStraightPath(params);
    case 'orthogonal': return getSmoothStepPath({ ...params, borderRadius: 0 });
    case 'metro':
    default:           return getSmoothStepPath({ ...params, borderRadius: 14 });
  }
}

function buildWaypointPath(sx, sy, waypoints, tx, ty) {
  const pts = [{ x: sx, y: sy }, ...waypoints, { x: tx, y: ty }];
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}

function waypointLabelPos(sx, sy, waypoints, tx, ty) {
  const pts = [{ x: sx, y: sy }, ...waypoints, { x: tx, y: ty }];
  const mid = Math.floor((pts.length - 1) / 2);
  return { x: (pts[mid].x + pts[mid + 1].x) / 2, y: (pts[mid].y + pts[mid + 1].y) / 2 };
}

function distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function insertWaypoint(waypoints, newPt, sx, sy, tx, ty) {
  const pts = [{ x: sx, y: sy }, ...waypoints, { x: tx, y: ty }];
  let bestIdx = 0, bestDist = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = distToSeg(newPt.x, newPt.y, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
    if (d < bestDist) { bestDist = d; bestIdx = i; }
  }
  const result = [...waypoints];
  result.splice(bestIdx, 0, newPt);
  return result;
}

// ── Draggable edge label ──────────────────────────────────────────────────────
function DraggableLabel({ id, label, labelX, labelY, labelOffset, selected, onSelectEdge }) {
  const { screenToFlowPosition } = useReactFlow();
  const updateEdge = useDiagramStore(s => s.updateEdge);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);

  const ox = labelOffset?.x || 0;
  const oy = labelOffset?.y || 0;
  const px = labelX + ox;
  const py = labelY + oy;

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.stopPropagation(); e.preventDefault();
    setDragging(true);
    const startFlow = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    dragStart.current = { fx: startFlow.x, fy: startFlow.y, ox, oy };

    const onMove = (ev) => {
      const cur = screenToFlowPosition({ x: ev.clientX, y: ev.clientY });
      const dx  = cur.x - dragStart.current.fx;
      const dy  = cur.y - dragStart.current.fy;
      updateEdge(id, 'labelOffset', { x: Math.round(dragStart.current.ox + dx), y: Math.round(dragStart.current.oy + dy) });
    };
    const onUp = () => {
      setDragging(false);
      dragStart.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }, [id, ox, oy, screenToFlowPosition, updateEdge]);

  return (
    <div
      className="edge-label-wrapper nodrag nopan"
      style={{
        position: 'absolute',
        transform: `translate(-50%,-50%) translate(${px}px,${py}px)`,
        pointerEvents: 'all',
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        outline: selected ? '1.5px dashed var(--brand-secondary)' : undefined,
        borderRadius: 2,
      }}
      onMouseDown={onMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelectEdge(); }}
      title="Drag to reposition label"
    >
      {label.length > 30 ? label.slice(0, 28) + '…' : label}
    </div>
  );
}

function WaypointHandle({ point, index, onMove, onRemove }) {
  const { screenToFlowPosition } = useReactFlow();
  const [dragging, setDragging] = useState(false);

  const onMouseDown = useCallback((e) => {
    e.stopPropagation(); e.preventDefault();
    setDragging(true);
    const handleMove = (ev) => onMove(index, screenToFlowPosition({ x: ev.clientX, y: ev.clientY }));
    const handleUp   = () => { setDragging(false); document.removeEventListener('mousemove', handleMove); document.removeEventListener('mouseup', handleUp); };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [index, onMove, screenToFlowPosition]);

  return (
    <div
      className="nodrag nopan"
      onMouseDown={onMouseDown}
      onDoubleClick={(e) => { e.stopPropagation(); onRemove(index); }}
      title="Drag to move bend point. Double-click to remove."
      style={{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${point.x}px, ${point.y}px)`,
        width: 12, height: 12, borderRadius: '50%',
        background: dragging ? '#0E7A8A' : 'white',
        border: '2px solid #0E7A8A',
        cursor: dragging ? 'grabbing' : 'grab',
        pointerEvents: 'all', zIndex: 1000,
        boxShadow: '0 1px 4px rgba(0,0,0,.2)',
      }}
    />
  );
}

function MidHandle({ a, b, onAdd }) {
  const [hover, setHover] = useState(false);
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  return (
    <div
      className="nodrag nopan"
      onClick={(e) => { e.stopPropagation(); onAdd({ x: mx, y: my }); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Click to add bend point"
      style={{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${mx}px, ${my}px)`,
        width: hover ? 14 : 8, height: hover ? 14 : 8, borderRadius: '50%',
        background: hover ? '#0E7A8A' : 'rgba(14,122,138,0.25)',
        border: '1.5px solid #0E7A8A',
        cursor: 'pointer', pointerEvents: 'all', zIndex: 999,
        transition: 'all .1s',
      }}
    />
  );
}

const EnterpriseEdge = memo(({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected,
}) => {
  const spec           = CONNECTORS[data?.connectorType] || CONNECTORS['conn.sync.rest'];
  const globalRouting  = useDiagramStore(s => s.routingStyle);
  const selectEdge     = useDiagramStore(s => s.selectEdge);
  const updateWPs      = useDiagramStore(s => s.updateEdgeWaypoints);

  // Per-edge routing overrides global
  const routingStyle = data?.routingStyle || globalRouting;
  const waypoints    = data?.waypoints || [];
  const hasWaypoints = waypoints.length > 0;

  let edgePath, labelX, labelY;
  if (hasWaypoints) {
    edgePath = buildWaypointPath(sourceX, sourceY, waypoints, targetX, targetY);
    const lp = waypointLabelPos(sourceX, sourceY, waypoints, targetX, targetY);
    labelX = lp.x; labelY = lp.y;
  } else {
    [edgePath, labelX, labelY] = computeAutoPath(routingStyle, {
      sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
    });
  }

  const edgeStyle = {
    stroke: spec.color,
    strokeWidth: selected ? spec.strokeWeight + 1 : spec.strokeWeight,
    strokeDasharray: spec.dashArray || undefined,
    cursor: 'pointer', transition: 'stroke-width .1s',
  };

  const bidirectional = data?.bidirectional;
  const markerEnd     = markerUrl(spec.targetMarker, spec.color);
  const markerStart   = bidirectional ? markerUrl(spec.targetMarker, spec.color) : markerUrl(spec.sourceMarker, spec.color);
  const label         = data?.label || '';
  const labelOffset   = data?.labelOffset || { x: 0, y: 0 };

  const onMoveWP  = useCallback((i, pos) => {
    const next = [...waypoints];
    next[i] = { x: Math.round(pos.x), y: Math.round(pos.y) };
    updateWPs(id, next);
  }, [id, waypoints, updateWPs]);

  const onRemoveWP = useCallback((i) => updateWPs(id, waypoints.filter((_, idx) => idx !== i)), [id, waypoints, updateWPs]);
  const onAddWP    = useCallback((pt) => updateWPs(id, insertWaypoint(waypoints, pt, sourceX, sourceY, targetX, targetY)), [id, waypoints, sourceX, sourceY, targetX, targetY, updateWPs]);

  const allPts = selected ? [{ x: sourceX, y: sourceY }, ...waypoints, { x: targetX, y: targetY }] : [];

  return (
    <>
      <path d={edgePath} fill="none" stroke="transparent" strokeWidth={14} style={{ cursor: 'pointer' }}
        onClick={(e) => { e.stopPropagation(); selectEdge(id); }} />
      <BaseEdge id={id} path={edgePath} style={edgeStyle} markerEnd={markerEnd} markerStart={markerStart} />

      {(label || selected) && (
        <EdgeLabelRenderer>
          {label && (
            <DraggableLabel
              id={id}
              label={label}
              labelX={labelX}
              labelY={labelY}
              labelOffset={labelOffset}
              selected={selected}
              onSelectEdge={() => selectEdge(id)}
            />
          )}

          {selected && waypoints.map((pt, i) => (
            <WaypointHandle key={`wp-${i}`} point={pt} index={i} onMove={onMoveWP} onRemove={onRemoveWP} />
          ))}

          {selected && allPts.length >= 2 && allPts.map((pt, i) =>
            i < allPts.length - 1 ? (
              <MidHandle key={`mid-${i}`} a={allPts[i]} b={allPts[i + 1]} onAdd={onAddWP} />
            ) : null
          )}

          {selected && hasWaypoints && (
            <div
              className="nodrag nopan"
              onClick={(e) => { e.stopPropagation(); updateWPs(id, []); }}
              title="Clear all bend points"
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY - 22}px)`,
                padding: '2px 7px', fontSize: 9, fontWeight: 700,
                background: '#FFF3E0', border: '1px solid #E65100', borderRadius: 8,
                color: '#E65100', cursor: 'pointer', pointerEvents: 'all', whiteSpace: 'nowrap',
              }}
            >
              Clear bends
            </div>
          )}
        </EdgeLabelRenderer>
      )}
    </>
  );
});

EnterpriseEdge.displayName = 'EnterpriseEdge';
export default EnterpriseEdge;
