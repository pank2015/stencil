import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { SHAPES, STATUS_COLORS } from '../data/shapes';
import useDiagramStore from '../store/store';
import './shapes.css';

const PersonNode = memo(({ id, data, selected }) => {
  const { shapeType, label, metadata } = data;
  const spec = SHAPES[shapeType] || SHAPES['ent.people.person'];
  const { color, stereotype } = spec;
  const isOrg = spec.shape === 'org';
  const statusColor = STATUS_COLORS[metadata?.lifecycleStatus] || STATUS_COLORS.Draft;

  const selectNode = useDiagramStore(s => s.selectNode);
  const onClick = useCallback((e) => { e.stopPropagation(); selectNode(id); }, [id, selectNode]);

  return (
    <div
      className={`person-node${selected ? ' selected' : ''}`}
      style={{ width: 80, height: 100, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onClick={onClick}
    >
      {/* SVG figure */}
      <svg width={60} height={70} viewBox="0 0 60 70" overflow="visible">
        {selected && <rect x={-4} y={-4} width={68} height={78} rx={4} fill="none" stroke="var(--brand-secondary)" strokeWidth={1.5} strokeDasharray="4 2" />}

        {isOrg ? (
          // Three overlapping figures for organisation
          <>
            <circle cx={18} cy={14} r={8} fill={color.fill} stroke={color.border} strokeWidth={1.5} />
            <line x1={18} y1={22} x2={18} y2={40} stroke={color.border} strokeWidth={1.5} />
            <line x1={8}  y1={28} x2={28} y2={28} stroke={color.border} strokeWidth={1.5} />
            <line x1={8}  y1={28} x2={4}  y2={40} stroke={color.border} strokeWidth={1.5} />
            <line x1={28} y1={28} x2={32} y2={40} stroke={color.border} strokeWidth={1.5} />

            <circle cx={42} cy={14} r={8} fill={color.fill} stroke={color.border} strokeWidth={1.5} />
            <line x1={42} y1={22} x2={42} y2={40} stroke={color.border} strokeWidth={1.5} />
            <line x1={32} y1={28} x2={52} y2={28} stroke={color.border} strokeWidth={1.5} />
            <line x1={32} y1={28} x2={28} y2={40} stroke={color.border} strokeWidth={1.5} />
            <line x1={52} y1={28} x2={56} y2={40} stroke={color.border} strokeWidth={1.5} />

            <circle cx={30} cy={10} r={9} fill={color.fill} stroke={color.border} strokeWidth={2} />
            <line x1={30} y1={19} x2={30} y2={42} stroke={color.border} strokeWidth={2} />
            <line x1={16} y1={28} x2={44} y2={28} stroke={color.border} strokeWidth={2} />
            <line x1={16} y1={28} x2={12} y2={44} stroke={color.border} strokeWidth={2} />
            <line x1={44} y1={28} x2={48} y2={44} stroke={color.border} strokeWidth={2} />
          </>
        ) : (
          // Single person
          <>
            <circle cx={30} cy={14} r={11} fill={color.fill} stroke={color.border} strokeWidth={2} />
            <line x1={30} y1={25} x2={30} y2={48} stroke={color.border} strokeWidth={2} />
            <line x1={14} y1={33} x2={46} y2={33} stroke={color.border} strokeWidth={2} />
            <line x1={14} y1={33} x2={10} y2={52} stroke={color.border} strokeWidth={2} />
            <line x1={46} y1={33} x2={50} y2={52} stroke={color.border} strokeWidth={2} />
          </>
        )}

        {/* Status dot */}
        <circle cx={52} cy={6} r={4} fill={statusColor} stroke="white" strokeWidth={1.5} />
      </svg>

      <div style={{ textAlign: 'center', maxWidth: 90 }}>
        <div className="person-label">{label || spec.displayName}</div>
        {stereotype && <div className="person-stereotype">{stereotype}</div>}
      </div>

      <Handle type="target" position={Position.Top}    id="n"  style={{ left: '50%', top: 14 }} />
      <Handle type="source" position={Position.Bottom} id="s"  style={{ left: '50%' }} />
      <Handle type="source" position={Position.Right}  id="e"  style={{ top: '40%' }} />
      <Handle type="target" position={Position.Left}   id="w"  style={{ top: '40%' }} />
      <Handle type="source" position={Position.Right}  id="ne" style={{ top: '20%' }} />
      <Handle type="source" position={Position.Left}   id="nw" style={{ top: '20%' }} />
      <Handle type="source" position={Position.Right}  id="se" style={{ top: '70%' }} />
      <Handle type="source" position={Position.Left}   id="sw" style={{ top: '70%' }} />
    </div>
  );
});

PersonNode.displayName = 'PersonNode';
export default PersonNode;
