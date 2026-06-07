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

  return (
    <footer style={{
      height: 28, display: 'flex', alignItems: 'center',
      padding: '0 12px', background: '#2C3E50',
      borderTop: '1px solid rgba(255,255,255,.1)', flexShrink: 0, gap: 12,
      fontSize: 10, color: 'rgba(255,255,255,.7)',
    }}>
      {/* Counts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'rgba(255,255,255,.5)' }}>{nodes.length} elements</span>
        <span style={{ color: 'rgba(255,255,255,.25)' }}>·</span>
        <span style={{ color: 'rgba(255,255,255,.5)' }}>{edges.length} connectors</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Selection info */}
      {selectedNode && (
        <span style={{ color: 'rgba(255,255,255,.6)' }}>
          Selected: <strong style={{ color: 'white' }}>{selectedNode.data.label || 'Unnamed'}</strong>
          {' · '}{SHAPES[selectedNode.data.shapeType]?.displayName || ''}
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
