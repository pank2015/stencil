import { memo, useCallback } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { SHAPES } from '../data/shapes';
import useDiagramStore from '../store/store';
import './shapes.css';

const BoundaryNode = memo(({ id, data, selected }) => {
  const { shapeType, label, metadata } = data;
  const spec = SHAPES[shapeType] || SHAPES['ent.boundary.system'];
  const { color, stereotype } = spec;
  const isDashed = spec.shape === 'boundary-dashed';

  const selectNode = useDiagramStore(s => s.selectNode);
  const onClick = useCallback((e) => { e.stopPropagation(); selectNode(id); }, [id, selectNode]);

  return (
    <div
      className="ent-node"
      style={{ width: '100%', height: '100%' }}
      onClick={onClick}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={120}
        color={color.border}
        lineStyle={{ stroke: color.border, strokeWidth: 1 }}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, background: color.border }}
      />

      {/* Boundary SVG */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
      >
        <rect
          x={1} y={1}
          width="calc(100% - 2px)" height="calc(100% - 2px)"
          fill={color.fill}
          stroke={color.border}
          strokeWidth={selected ? 2 : 1.5}
          strokeDasharray={isDashed ? '10 5' : undefined}
          rx={4}
          style={{ width: 'calc(100% - 2px)', height: 'calc(100% - 2px)' }}
        />
      </svg>

      {/* Header bar */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 28,
          background: `${color.border}18`,
          borderBottom: `1.5px solid ${color.border}`,
          borderRadius: '4px 4px 0 0',
          display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8,
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: color.text || '#1A1A1A' }}>
          {label || spec.displayName}
        </span>
        {stereotype && (
          <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            {stereotype}
          </span>
        )}
        {metadata?.systemCode && (
          <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontFamily: 'monospace', marginLeft: 'auto' }}>
            {metadata.systemCode}
          </span>
        )}
      </div>

      <Handle type="target" position={Position.Top}    id="n"  style={{ left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="s"  style={{ left: '50%' }} />
      <Handle type="source" position={Position.Right}  id="e"  style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left}   id="w"  style={{ top: '50%' }} />
      <Handle type="source" position={Position.Top}    id="ne" style={{ left: '75%' }} />
      <Handle type="source" position={Position.Top}    id="nw" style={{ left: '25%' }} />
      <Handle type="source" position={Position.Bottom} id="se" style={{ left: '75%' }} />
      <Handle type="source" position={Position.Bottom} id="sw" style={{ left: '25%' }} />
    </div>
  );
});

BoundaryNode.displayName = 'BoundaryNode';
export default BoundaryNode;
