import { memo, useCallback } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { SHAPES, STATUS_COLORS } from '../data/shapes';
import { ShapeRenderer } from './ShapeRenderer';
import useDiagramStore from '../store/store';
import './shapes.css';

const EnterpriseNode = memo(({ id, data, selected, style: nodeStyle }) => {
  const { shapeType, label, metadata } = data;
  const spec = SHAPES[shapeType] || SHAPES['ent.foundation.rectangle'];
  const { defaultSize, stereotype, color } = spec;

  // Size priority: ReactFlow style (set by NodeResizer/updateNodeSize) -> data.size -> spec default
  const w = nodeStyle?.width  ?? data.size?.width  ?? defaultSize.width;
  const h = nodeStyle?.height ?? data.size?.height ?? defaultSize.height;

  const selectNode     = useDiagramStore(s => s.selectNode);
  const updateNodeSize = useDiagramStore(s => s.updateNodeSize);

  const onClick = useCallback((e) => { e.stopPropagation(); selectNode(id); }, [id, selectNode]);

  // Keep data.size in sync when NodeResizer drags
  const onResize = useCallback((_, { width, height }) => {
    updateNodeSize(id, Math.round(width), Math.round(height));
  }, [id, updateNodeSize]);

  const statusColor   = STATUS_COLORS[metadata?.lifecycleStatus] || STATUS_COLORS.Draft;
  const hasCompliance = metadata?.complianceFlags?.length > 0;
  const systemCode    = metadata?.systemCode || '';

  return (
    <div
      className={`ent-node${selected ? ' selected' : ''}`}
      style={{ width: w, height: h }}
      onClick={onClick}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={60}
        minHeight={40}
        onResize={onResize}
        color={color.border}
        lineStyle={{ stroke: color.border, strokeWidth: 1, strokeDasharray: '3 2' }}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, background: color.border, border: '1.5px solid white' }}
      />

      <div className="ent-shape-wrap">
        <ShapeRenderer spec={spec} selected={selected} w={w} h={h} />
      </div>

      <div className="ent-content">
        {stereotype && <span className="ent-stereotype">{stereotype}</span>}
        <span className="ent-label">{label || spec.displayName}</span>
        {systemCode && <span className="ent-systemcode">{systemCode}</span>}
      </div>

      <div
        className="ent-status-dot"
        style={{ background: statusColor }}
        title={`Status: ${metadata?.lifecycleStatus || 'Draft'}`}
      />

      {hasCompliance && (
        <div className="ent-compliance-badge" title={`Compliance: ${metadata.complianceFlags.join(', ')}`}>warning</div>
      )}

      {/* Cardinal — original types restored so existing edges render correctly */}
      <Handle type="target" position={Position.Top}    id="n"  style={{ left: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="s"  style={{ left: '50%' }} />
      <Handle type="source" position={Position.Right}  id="e"  style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left}   id="w"  style={{ top: '50%' }} />
      {/* Diagonal extras — connectionMode="loose" on ReactFlow lets these receive too */}
      <Handle type="source" position={Position.Top}    id="ne" style={{ left: '75%' }} />
      <Handle type="source" position={Position.Top}    id="nw" style={{ left: '25%' }} />
      <Handle type="source" position={Position.Bottom} id="se" style={{ left: '75%' }} />
      <Handle type="source" position={Position.Bottom} id="sw" style={{ left: '25%' }} />
    </div>
  );
});

EnterpriseNode.displayName = 'EnterpriseNode';
export default EnterpriseNode;
