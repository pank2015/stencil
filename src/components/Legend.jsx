import { useMemo, useRef, useState, useEffect } from 'react';
import { SHAPES } from '../data/shapes';
import { CONNECTORS } from '../data/connectors';
import useDiagramStore from '../store/store';

export default function Legend() {
  const nodes = useDiagramStore(s => s.nodes);
  const edges = useDiagramStore(s => s.edges);
  const showLegend = useDiagramStore(s => s.showLegend);
  const setShowLegend = useDiagramStore(s => s.setShowLegend);
  const legendPosition = useDiagramStore(s => s.legendPosition);
  const setLegendPosition = useDiagramStore(s => s.setLegendPosition);

  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const usedShapeTypes = useMemo(() =>
    [...new Set(nodes.map(n => n.data?.shapeType).filter(Boolean))],
    [nodes]
  );
  const usedConnTypes = useMemo(() =>
    [...new Set(edges.map(e => e.data?.connectorType).filter(Boolean))],
    [edges]
  );

  // Drag handling — moves the legend within the canvas wrapper
  const onMouseDown = (e) => {
    e.stopPropagation();
    const el = dragRef.current;
    const parent = el?.offsetParent;
    if (!el || !parent) return;
    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const offX = e.clientX - rect.left;
    const offY = e.clientY - rect.top;

    const onMove = (ev) => {
      let x = ev.clientX - parentRect.left - offX;
      let y = ev.clientY - parentRect.top - offY;
      // clamp inside the canvas wrapper
      x = Math.max(0, Math.min(x, parentRect.width - rect.width));
      y = Math.max(0, Math.min(y, parentRect.height - rect.height));
      setLegendPosition({ x, y });
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    setDragging(true);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  useEffect(() => () => setDragging(false), []);

  if (!showLegend) return null;

  // Default position: bottom-right; otherwise the stored absolute coords
  const posStyle = legendPosition
    ? { left: legendPosition.x, top: legendPosition.y }
    : { right: 12, bottom: 36 };

  return (
    <div
      ref={dragRef}
      style={{
        position: 'absolute', zIndex: 10, ...posStyle,
        background: 'white', border: '1px solid var(--border)',
        borderRadius: 8, padding: '0 0 10px', minWidth: 200, maxWidth: 280,
        boxShadow: 'var(--shadow-md)', pointerEvents: 'all',
        userSelect: 'none',
      }}
    >
      {/* Draggable header */}
      <div
        onMouseDown={onMouseDown}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px 8px', marginBottom: 6,
          borderBottom: '1px solid var(--border)',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)' }}>⠿ Legend</span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setShowLegend(false)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}
        >✕</button>
      </div>

      <div style={{ padding: '0 14px' }}>
        {/* Element types */}
        {usedShapeTypes.length > 0 && (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 5 }}>Element Types</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
              {usedShapeTypes.slice(0, 8).map(st => {
                const spec = SHAPES[st];
                if (!spec) return null;
                return (
                  <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 14, height: 10, borderRadius: 2, background: spec.color.fill, border: `1.5px solid ${spec.color.border}`, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{spec.displayName}</span>
                    {spec.stereotype && <span style={{ fontSize: 9, color: 'var(--text-muted)', fontStyle: 'italic' }}>{spec.stereotype}</span>}
                  </div>
                );
              })}
              {usedShapeTypes.length > 8 && <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>+{usedShapeTypes.length - 8} more</div>}
            </div>
          </>
        )}

        {/* Connectors */}
        {usedConnTypes.length > 0 && (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 5 }}>Connectors</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {usedConnTypes.slice(0, 6).map(ct => {
                const spec = CONNECTORS[ct];
                if (!spec) return null;
                return (
                  <div key={ct} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width={30} height={10} style={{ flexShrink: 0 }}>
                      <line x1={2} y1={5} x2={24} y2={5} stroke={spec.color} strokeWidth={spec.strokeWeight} strokeDasharray={spec.dashArray || undefined} />
                      <polygon points="24,2 30,5 24,8" fill={spec.targetMarker === 'open-arrow' ? 'none' : spec.color} stroke={spec.color} strokeWidth={1} />
                    </svg>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{spec.displayName}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {usedShapeTypes.length === 0 && usedConnTypes.length === 0 && (
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' }}>
            Add shapes to populate the legend.
          </div>
        )}
      </div>
    </div>
  );
}
