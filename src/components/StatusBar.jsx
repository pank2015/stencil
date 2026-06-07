import useDiagramStore from '../store/store';
import { SHAPES } from '../data/shapes';
import { CONNECTORS } from '../data/connectors';

export default function StatusBar() {
  const nodes = useDiagramStore(s => s.nodes);
  const edges = useDiagramStore(s => s.edges);
  const selectedNodeId = useDiagramStore(s => s.selectedNodeId);
  const selectedEdgeId = useDiagramStore(s => s.selectedEdgeId);
  const connectionType = useDiagramStore(s => s.connectionType);
  const setConnectionType = useDiagramStore(s => s.setConnectionType);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedEdge = edges.find(e => e.id === selectedEdgeId);
  const activeConn = CONNECTORS[connectionType];

  // Status counts
  const issues = {
    info: nodes.filter(n => n.data.metadata?.systemCode).length,
    warnings: nodes.filter(n => !n.data.metadata?.ownerTeam || n.data.metadata?.lifecycleStatus === 'Decommission').length,
    errors: nodes.filter(n => !n.data.metadata?.systemCode && !['person', 'boundary'].includes(n.type)).length,
  };

  const pill = (label, count, color, fill) => count === 0 ? null : (
    <span style={{
      display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 10,
      fontSize: 10, fontWeight: 700, background: fill, color,
      border: `1px solid ${color}40`,
    }}>
      {label} <span>{count}</span>
    </span>
  );

  return (
    <footer style={{
      height: 28, display: 'flex', alignItems: 'center',
      padding: '0 12px', background: '#2C3E50',
      borderTop: '1px solid rgba(255,255,255,.1)', flexShrink: 0, gap: 12,
      fontSize: 10, color: 'rgba(255,255,255,.7)',
    }}>
      {/* Status counts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'rgba(255,255,255,.4)' }}>ℹ Info</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,.15)',
          fontSize: 9, fontWeight: 700, color: 'white',
        }}>{issues.info}</span>

        <span style={{ color: 'rgba(255,255,255,.4)', marginLeft: 6 }}>⚠ Warnings</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: '50%',
          background: issues.warnings > 0 ? 'rgba(230,81,0,.6)' : 'rgba(255,255,255,.15)',
          fontSize: 9, fontWeight: 700, color: 'white',
        }}>{issues.warnings}</span>

        <span style={{ color: 'rgba(255,255,255,.4)', marginLeft: 6 }}>✕ Missing codes</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: '50%',
          background: issues.errors > 0 ? 'rgba(183,28,28,.6)' : 'rgba(255,255,255,.15)',
          fontSize: 9, fontWeight: 700, color: 'white',
        }}>{issues.errors}</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Selection info */}
      {selectedNode && (
        <span style={{ color: 'rgba(255,255,255,.6)' }}>
          Selected: <strong style={{ color: 'white' }}>{selectedNode.data.label || 'Unnamed'}</strong>
          {' · '}{SHAPES[selectedNode.data.shapeType]?.displayName || ''}
          {selectedNode.data.metadata?.lifecycleStatus && (
            <> · <span style={{ color: '#80DEEA' }}>{selectedNode.data.metadata.lifecycleStatus}</span></>
          )}
        </span>
      )}
      {selectedEdge && (
        <span style={{ color: 'rgba(255,255,255,.6)' }}>
          Connector: <strong style={{ color: 'white' }}>{CONNECTORS[selectedEdge.data?.connectorType]?.displayName || 'Unknown'}</strong>
          {selectedEdge.data?.label && <> — "{selectedEdge.data.label}"</>}
        </span>
      )}
      {!selectedNode && !selectedEdge && (
        <span style={{ color: 'rgba(255,255,255,.5)' }}>
          {nodes.length} elements · {edges.length} connectors — click to select
        </span>
      )}

      <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,.2)' }} />

      {/* Active connector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color: 'rgba(255,255,255,.4)' }}>Draw:</span>
        <svg width={24} height={10}>
          <line x1={2} y1={5} x2={18} y2={5} stroke={activeConn?.color || '#ccc'} strokeWidth={activeConn?.strokeWeight || 1.5} strokeDasharray={activeConn?.dashArray || undefined} />
          <polygon points="18,2 24,5 18,8" fill={activeConn?.color || '#ccc'} />
        </svg>
        <span style={{ color: 'rgba(255,255,255,.7)' }}>{activeConn?.displayName || '—'}</span>
      </div>
    </footer>
  );
}
