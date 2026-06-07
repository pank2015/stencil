import { useEffect, useRef } from 'react';
import useDiagramStore from '../store/store';
import { CONNECTORS } from '../data/connectors';

const ROUTING_OPTIONS = [
  { value: 'metro',      label: 'Metro',       hint: 'Smooth bends' },
  { value: 'orthogonal', label: 'Orthogonal',  hint: '90° corners' },
  { value: 'bezier',     label: 'Bezier',      hint: 'Smooth curves' },
  { value: 'straight',   label: 'Straight',    hint: 'Direct line' },
];

const sep = () => (
  <div style={{ height: 1, background: 'var(--border)', margin: '3px 0' }} />
);

function Item({ icon, label, hint, onClick, active, danger }) {
  return (
    <button
      onMouseDown={(e) => { e.stopPropagation(); onClick?.(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', padding: '6px 12px', border: 'none', background: 'none',
        cursor: 'pointer', fontSize: 11, textAlign: 'left',
        color: danger ? 'var(--status-decommission)' : active ? 'var(--brand-secondary)' : 'var(--text-primary)',
        borderRadius: 4,
        fontWeight: active ? 700 : 400,
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? '#FFF3E0' : '#F0F4F8'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      <span style={{ width: 14, textAlign: 'center', fontSize: 12, flexShrink: 0 }}>{active ? '✓' : (icon || ' ')}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {hint && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{hint}</span>}
    </button>
  );
}

function GroupHeader({ label }) {
  return (
    <div style={{ padding: '5px 12px 2px', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
      {label}
    </div>
  );
}

export default function ContextMenu({ menu, onClose }) {
  const ref = useRef(null);

  const bringToFront  = useDiagramStore(s => s.bringToFront);
  const bringForward  = useDiagramStore(s => s.bringForward);
  const sendBackward  = useDiagramStore(s => s.sendBackward);
  const sendToBack    = useDiagramStore(s => s.sendToBack);
  const duplicateNode = useDiagramStore(s => s.duplicateNode);
  const deleteNode    = useDiagramStore(s => s.deleteNode);
  const deleteEdge    = useDiagramStore(s => s.deleteEdge);
  const updateEdge    = useDiagramStore(s => s.updateEdge);
  const updateEdgeWaypoints = useDiagramStore(s => s.updateEdgeWaypoints);
  const globalRouting = useDiagramStore(s => s.routingStyle);

  const edges = useDiagramStore(s => s.edges);
  const edge  = menu?.type === 'edge' ? edges.find(e => e.id === menu.id) : null;
  const edgeRouting = edge?.data?.routingStyle || null;
  const hasWaypoints = (edge?.data?.waypoints || []).length > 0;

  // Close on outside click or Escape
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) onClose();
    };
    const keyHandler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [onClose]);

  if (!menu) return null;

  // Keep menu on-screen
  const MENU_W = 200, MENU_H = 260;
  const left = Math.min(menu.x, (menu.containerW || 1200) - MENU_W - 8);
  const top  = Math.min(menu.y, (menu.containerH || 800) - MENU_H - 8);

  const wrap = (fn) => () => { fn(); onClose(); };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute', left, top, zIndex: 9999,
        background: 'white', borderRadius: 8, width: MENU_W,
        boxShadow: '0 4px 24px rgba(0,0,0,.18), 0 1px 4px rgba(0,0,0,.08)',
        border: '1px solid var(--border)', padding: '4px 0',
        userSelect: 'none', pointerEvents: 'all',
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      {menu.type === 'node' && (
        <>
          <GroupHeader label="Arrange" />
          <Item icon="⬆" label="Bring to Front"  onClick={wrap(() => bringToFront(menu.id))} />
          <Item icon="↑"  label="Bring Forward"  onClick={wrap(() => bringForward(menu.id))} />
          <Item icon="↓"  label="Send Backward"  onClick={wrap(() => sendBackward(menu.id))} />
          <Item icon="⬇" label="Send to Back"   onClick={wrap(() => sendToBack(menu.id))} />
          {sep()}
          <Item icon="⎘"  label="Duplicate"      onClick={wrap(() => duplicateNode(menu.id))} />
          {sep()}
          <Item icon="🗑" label="Delete"          onClick={wrap(() => deleteNode(menu.id))} danger />
        </>
      )}

      {menu.type === 'edge' && (
        <>
          <GroupHeader label="Connector Routing" />
          {ROUTING_OPTIONS.map(opt => (
            <Item
              key={opt.value}
              label={opt.label}
              hint={opt.hint}
              active={edgeRouting ? edgeRouting === opt.value : globalRouting === opt.value}
              onClick={wrap(() => updateEdge(menu.id, 'routingStyle', opt.value))}
            />
          ))}
          {edgeRouting && (
            <Item label="Use global default" hint="reset" onClick={wrap(() => updateEdge(menu.id, 'routingStyle', null))} />
          )}
          {sep()}
          {hasWaypoints && (
            <Item icon="✕" label="Clear bend points" onClick={wrap(() => updateEdgeWaypoints(menu.id, []))} />
          )}
          {sep()}
          <Item icon="🗑" label="Delete connector" onClick={wrap(() => deleteEdge(menu.id))} danger />
        </>
      )}
    </div>
  );
}
