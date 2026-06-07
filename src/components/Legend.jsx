import { useMemo } from 'react';
import { SHAPES, STATUS_COLORS } from '../data/shapes';
import { CONNECTORS } from '../data/connectors';
import useDiagramStore from '../store/store';

const STATUS_LABELS = {
  New: { color: 'var(--status-new)', fill: 'var(--status-new-fill)', label: 'New' },
  PartialUse: { color: 'var(--status-partial)', fill: 'var(--status-partial-fill)', label: 'Partial Use' },
  Decommission: { color: 'var(--status-decommission)', fill: 'var(--status-decommission-fill)', label: 'Decommission' },
  Draft: { color: 'var(--status-draft)', fill: 'var(--status-draft-fill)', label: 'Draft' },
  Stable: { color: 'var(--status-stable)', fill: 'var(--status-stable-fill)', label: 'Stable' },
};

export default function Legend() {
  const nodes = useDiagramStore(s => s.nodes);
  const edges = useDiagramStore(s => s.edges);
  const showLegend = useDiagramStore(s => s.showLegend);
  const setShowLegend = useDiagramStore(s => s.setShowLegend);

  const usedShapeTypes = useMemo(() =>
    [...new Set(nodes.map(n => n.data?.shapeType).filter(Boolean))],
    [nodes]
  );
  const usedConnTypes = useMemo(() =>
    [...new Set(edges.map(e => e.data?.connectorType).filter(Boolean))],
    [edges]
  );
  const usedStatuses = useMemo(() =>
    [...new Set(nodes.map(n => n.data?.metadata?.lifecycleStatus).filter(Boolean))],
    [nodes]
  );

  if (!showLegend) return null;

  return (
    <div style={{
      position: 'absolute', bottom: 36, right: 12, zIndex: 10,
      background: 'white', border: '1px solid var(--border)',
      borderRadius: 8, padding: '10px 14px', minWidth: 200, maxWidth: 280,
      boxShadow: 'var(--shadow-md)', pointerEvents: 'all',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)' }}>📌 Legends</span>
        <button onClick={() => setShowLegend(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}>✕</button>
      </div>

      {/* Status */}
      {usedStatuses.length > 0 && (
        <>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 5 }}>Status</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', marginBottom: 8 }}>
            {usedStatuses.map(s => {
              const info = STATUS_LABELS[s] || STATUS_LABELS.Draft;
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: info.color, border: '1.5px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,.1)' }} />
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{info.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

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
    </div>
  );
}
