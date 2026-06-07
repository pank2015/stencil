import { useState, useMemo } from 'react';
import { SHAPES_BY_PANEL, PANEL_GROUPS, SHAPES_LIST, SHAPES } from '../data/shapes';
import { CONNECTORS_LIST, CONNECTOR_GROUPS } from '../data/connectors';
import { ShapeRenderer } from '../nodes/ShapeRenderer';
import useDiagramStore from '../store/store';
import ShapeEditor from './ShapeEditor';

const DRAG_TYPE = 'application/enterprise-stencil';

// Arrow expander (CSS triangles — no emoji, no encoding issues)
function Arrow({ open, color }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 0, height: 0,
      borderTop: '4px solid transparent',
      borderBottom: '4px solid transparent',
      borderLeft: `5px solid ${color || 'var(--text-muted)'}`,
      transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: 'transform .14s',
      flexShrink: 0,
    }} />
  );
}

// Fixed thumbnail box; the actual shape is rendered proportionally inside it.
const THUMB_W = 46;
const THUMB_H = 32;

function ShapePreview({ spec }) {
  const { shape, color } = spec;

  // ── Shapes ShapeRenderer does not draw (handled by dedicated node components) ──
  if (shape === 'person' || shape === 'org') return (
    <svg width={22} height={30} viewBox="0 0 22 30">
      <circle cx={11} cy={7} r={5} fill={color.fill} stroke={color.border} strokeWidth={1.5} />
      <line x1={11} y1={12} x2={11} y2={24} stroke={color.border} strokeWidth={1.5} />
      <line x1={4} y1={16} x2={18} y2={16} stroke={color.border} strokeWidth={1.5} />
      <line x1={4} y1={16} x2={2} y2={26} stroke={color.border} strokeWidth={1.5} />
      <line x1={18} y1={16} x2={20} y2={26} stroke={color.border} strokeWidth={1.5} />
    </svg>
  );
  if (shape === 'boundary' || shape === 'boundary-dashed') return (
    <svg width={34} height={24} viewBox="0 0 34 24">
      <rect x={1} y={1} width={32} height={22} fill={color.fill} stroke={color.border} strokeWidth={1.5}
        strokeDasharray={shape === 'boundary-dashed' ? '4 2' : undefined} rx={2} />
      <rect x={1} y={1} width={32} height={7} fill={`${color.border}25`} rx={2} />
    </svg>
  );
  if (shape === 'swimlane') return (
    <svg width={34} height={24} viewBox="0 0 34 24">
      <rect x={1} y={1} width={32} height={22} fill={color.fill} stroke={color.border} strokeWidth={1.5} rx={2} />
      <rect x={1} y={1} width={8} height={22} fill={`${color.border}25`} />
    </svg>
  );
  if (shape === 'pool') return (
    <svg width={34} height={24} viewBox="0 0 34 24">
      <rect x={1} y={1} width={32} height={22} fill={color.fill} stroke={color.border} strokeWidth={1.5} rx={2} />
      <rect x={1} y={1} width={32} height={7} fill={`${color.border}25`} />
    </svg>
  );

  // ── Everything else: render the real geometry, proportional to its default size ──
  const ar = (spec.defaultSize?.width || 120) / (spec.defaultSize?.height || 60);
  let w = THUMB_W, h = THUMB_W / ar;
  if (h > THUMB_H) { h = THUMB_H; w = THUMB_H * ar; }
  w = Math.max(12, Math.round(w));
  h = Math.max(12, Math.round(h));

  return (
    <div style={{ width: THUMB_W, height: THUMB_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: w, height: h }}>
        <ShapeRenderer spec={spec} selected={false} w={w} h={h} />
      </div>
    </div>
  );
}

function ShapeItem({ spec }) {
  const onDragStart = (e) => {
    e.dataTransfer.setData(DRAG_TYPE, spec.id);
    e.dataTransfer.effectAllowed = 'copy';
  };
  return (
    <div
      draggable
      onDragStart={onDragStart}
      title={`${spec.displayName}\n${spec.description || ''}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 4, padding: '7px 3px', cursor: 'grab', borderRadius: 6, textAlign: 'center',
        border: '1px solid transparent', background: 'transparent', transition: 'all .14s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#EEF2F6'; e.currentTarget.style.borderColor = '#DEE2E6'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
    >
      <ShapePreview spec={spec} />
      <span style={{ fontSize: 9, color: '#5A6678', lineHeight: 1.2, maxWidth: 60, wordBreak: 'break-word' }}>
        {spec.displayName}
      </span>
    </div>
  );
}

function ConnectorRow({ spec }) {
  const isActive = useDiagramStore(s => s.connectionType === spec.id);
  const setType = useDiagramStore(s => s.setConnectionType);
  return (
    <div
      onClick={() => setType(spec.id)}
      title={spec.description}
      style={{
        display: 'flex', alignItems: 'center', gap: 7, padding: '5px 7px',
        borderRadius: 5, cursor: 'pointer', transition: 'all .12s',
        background: isActive ? '#E3EAF3' : 'transparent',
        border: `1px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
        marginBottom: 1,
      }}
    >
      <svg width={36} height={10} style={{ flexShrink: 0 }}>
        <line x1={2} y1={5} x2={30} y2={5} stroke={spec.color} strokeWidth={spec.strokeWeight}
          strokeDasharray={spec.dashArray || undefined} />
        <polygon points="30,2 36,5 30,8"
          fill={spec.targetMarker === 'open-arrow' ? 'none' : spec.color}
          stroke={spec.color} strokeWidth={1} />
      </svg>
      <span style={{ fontSize: 10, color: '#1A1A1A', flex: 1, lineHeight: 1.2 }}>{spec.displayName}</span>
      {isActive && <span style={{ fontSize: 9, color: 'var(--brand-primary)', fontWeight: 700 }}>active</span>}
    </div>
  );
}

function MenuAction({ label, onClick, variant }) {
  const c = {
    primary: { bg: 'var(--brand-secondary)', border: 'var(--brand-secondary)', color: 'white' },
    danger: { bg: '#FEF2F2', border: '#FCA5A5', color: '#DC2626' },
    default: { bg: 'white', border: '#CBD5E1', color: '#374151' },
  }[variant || 'default'];
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '4px 0', fontSize: 9, fontWeight: 600, cursor: 'pointer', borderRadius: 4,
      border: `1px solid ${c.border}`, background: c.bg, color: c.color,
    }}>{label}</button>
  );
}

function ExampleRow({ example }) {
  const loadExample = useDiagramStore(s => s.loadExample);
  const saveExample = useDiagramStore(s => s.saveExample);
  const resetExample = useDiagramStore(s => s.resetExampleToDefault);
  const deleteExample = useDiagramStore(s => s.deleteExample);
  const currentExKey = useDiagramStore(s => s.currentExampleKey);
  const isDirty = useDiagramStore(s => s.isDirty);
  const confirmModal = useDiagramStore(s => s.confirmModal);
  const closeModal = useDiagramStore(s => s.closeModal);

  const [hover, setHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isCurrent = currentExKey === example.key;

  const handleLoad = () => {
    const doLoad = () => loadExample({ ...example.data, key: example.key });
    if (isDirty) {
      confirmModal('Unsaved changes', 'Load this example? Unsaved changes will be lost.', doLoad,
        { danger: true, confirmLabel: 'Load anyway' });
    } else {
      doLoad();
    }
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setShowMenu(false); }}
      style={{
        borderRadius: 6, marginBottom: 2, overflow: 'hidden',
        border: `1px solid ${isCurrent ? 'var(--brand-secondary)' : 'transparent'}`,
        background: isCurrent ? '#F0FDFB' : hover ? '#EEF2F6' : 'transparent',
        transition: 'all .12s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px' }}>
        <span style={{ fontSize: 14 }}>{example.icon}</span>
        <span style={{ flex: 1, fontSize: 11, color: '#1A1A1A', fontWeight: isCurrent ? 600 : 400 }}>
          {example.label}
          {isCurrent && isDirty && (
            <span style={{ marginLeft: 5, fontSize: 8, color: 'orange', fontWeight: 700 }}> unsaved</span>
          )}
        </span>
        <button
          onClick={handleLoad}
          style={{
            padding: '3px 8px', fontSize: 9, fontWeight: 700, cursor: 'pointer',
            border: '1px solid var(--brand-secondary)', borderRadius: 4,
            background: isCurrent || hover ? 'var(--brand-secondary)' : 'white',
            color: isCurrent || hover ? 'white' : 'var(--brand-secondary)', transition: 'all .12s',
          }}
        >Load</button>
        {(hover || isCurrent) && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(m => !m); }}
            style={{
              padding: '3px 6px', fontSize: 11, cursor: 'pointer', borderRadius: 4,
              border: '1px solid #CBD5E1', background: 'white', color: '#5A6678',
            }}
            title="More options"
          >...</button>
        )}
      </div>
      {showMenu && (
        <div style={{ padding: '4px 8px 6px', display: 'flex', gap: 4, borderTop: '1px solid #E2E8F0' }}>
          {isCurrent && (
            <MenuAction label="Save changes" onClick={() => {
              confirmModal('Save example', `Update "${example.label}" with current diagram?`,
                () => saveExample(example.key), { confirmLabel: 'Save' });
              setShowMenu(false);
            }} variant="primary" />
          )}
          <MenuAction label="Reset to default" onClick={() => {
            confirmModal('Reset example', `Reset "${example.label}" to its built-in content?`,
              () => resetExample(example.key), { danger: true, confirmLabel: 'Reset' });
            setShowMenu(false);
          }} />
          <MenuAction label="Delete" onClick={() => {
            confirmModal('Delete example', `Delete "${example.label}"? Cannot be undone.`,
              () => deleteExample(example.key), { danger: true, confirmLabel: 'Delete' });
            setShowMenu(false);
          }} variant="danger" />
        </div>
      )}
    </div>
  );
}

export default function StencilPanel() {
  const stencilSearch = useDiagramStore(s => s.stencilSearch);
  const setStencilSearch = useDiagramStore(s => s.setStencilSearch);
  const userShapes = useDiagramStore(s => s.userShapes);
  const storedExamples = useDiagramStore(s => s.storedExamples);
  const openModal = useDiagramStore(s => s.openModal);
  const addExample = useDiagramStore(s => s.addExample);
  const nodes = useDiagramStore(s => s.nodes);
  const edges = useDiagramStore(s => s.edges);
  const diagramName = useDiagramStore(s => s.diagramName);
  const diagramType = useDiagramStore(s => s.diagramType);
  const routingStyle = useDiagramStore(s => s.routingStyle);
  const collapsed = useDiagramStore(s => s.leftPanelCollapsed);
  const toggleCollapsed = useDiagramStore(s => s.toggleLeftPanel);

  const [tab, setTab] = useState('examples');
  const [openPanels, setOpenPanels] = useState(new Set(['P02', 'P03', 'P05']));

  // Merged shape list (built-in + user overrides/custom)
  const allShapesList = useMemo(() => {
    const builtIn = SHAPES_LIST.map(s => userShapes[s.id] || s);
    const custom = Object.values(userShapes).filter(s => !SHAPES[s.id]);
    return [...builtIn, ...custom];
  }, [userShapes]);

  // Extra groups (Custom Shapes panel only if there are custom shapes)
  const allGroups = useMemo(() => {
    const hasCustom = Object.values(userShapes).some(s => !SHAPES[s.id]);
    return hasCustom ? [...PANEL_GROUPS, { id: 'P09', label: 'Custom Shapes' }] : PANEL_GROUPS;
  }, [userShapes]);

  // Collapsed rail
  if (collapsed) {
    return (
      <aside style={{
        width: 30, flexShrink: 0, borderRight: '1px solid var(--border)',
        background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 8, gap: 10,
      }}>
        <button
          onClick={toggleCollapsed}
          title="Expand stencil panel"
          style={{
            width: 22, height: 22, borderRadius: 4, border: '1px solid var(--border)',
            background: 'white', cursor: 'pointer', color: 'var(--brand-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
          }}
        >»</button>
        <span style={{
          writingMode: 'vertical-rl', fontSize: 10, fontWeight: 700, letterSpacing: '.5px',
          color: 'var(--brand-primary)', textTransform: 'uppercase', marginTop: 4,
        }}>Stencil</span>
      </aside>
    );
  }

  const shapesForPanel = (panelId) => {
    if (panelId === 'P09') {
      return Object.values(userShapes).filter(s => !SHAPES[s.id] && s.panelGroup === 'P09');
    }
    const builtIn = (SHAPES_BY_PANEL[panelId] || []).map(s => userShapes[s.id] || s);
    const extra = Object.values(userShapes).filter(s => !SHAPES[s.id] && s.panelGroup === panelId);
    return [...builtIn, ...extra];
  };

  const togglePanel = (id) => setOpenPanels(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const q = stencilSearch.toLowerCase().trim();
  const filteredShapes = q
    ? allShapesList.filter(s =>
        s.displayName.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.stereotype || '').toLowerCase().includes(q)
      )
    : null;
  const filteredConnectors = q
    ? CONNECTORS_LIST.filter(c => c.displayName.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    : null;

  const tabStyle = (t) => ({
    flex: 1, padding: '5px 0', fontSize: 10, fontWeight: 600, cursor: 'pointer',
    border: 'none', background: tab === t ? 'white' : 'transparent',
    borderBottom: `2px solid ${tab === t ? 'var(--brand-secondary)' : 'transparent'}`,
    color: tab === t ? 'var(--brand-secondary)' : 'var(--text-secondary)', transition: 'all .12s',
  });

  const handleSaveCurrentAsExample = () => {
    const key = `user-${Date.now()}`;
    addExample({ key, label: diagramName, icon: '📄', data: { nodes, edges, diagramName, diagramType, routingStyle } });
  };

  const openShapeEditor = () => {
    openModal({ title: 'Shape Editor', width: 500, fullHeight: true, render: () => <ShapeEditor /> });
  };

  return (
    <aside style={{
      width: 232, flexShrink: 0, borderRight: '1px solid var(--border)',
      background: 'var(--surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ padding: '10px 12px 6px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '.5px', flex: 1 }}>
            Stencil
          </span>
          <button onClick={openShapeEditor} style={{
            fontSize: 9, fontWeight: 600, cursor: 'pointer', borderRadius: 4,
            border: '1px solid var(--border)', background: 'white', color: '#5A6678', padding: '2px 7px',
          }}>Edit shapes</button>
          <button onClick={toggleCollapsed} title="Collapse panel" style={{
            fontSize: 12, cursor: 'pointer', borderRadius: 4, lineHeight: 1,
            border: '1px solid var(--border)', background: 'white', color: 'var(--brand-primary)', padding: '2px 6px',
          }}>«</button>
        </div>
        <div style={{ position: 'relative', marginBottom: 7 }}>
          <input
            value={stencilSearch}
            onChange={e => setStencilSearch(e.target.value)}
            placeholder="Search shapes & connectors..."
            style={{ width: '100%', padding: '5px 24px 5px 8px', fontSize: 11, border: '1px solid var(--border)', borderRadius: 5, background: 'var(--surface-2)', outline: 'none', boxSizing: 'border-box' }}
          />
          {stencilSearch
            ? <button onClick={() => setStencilSearch('')} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11, padding: 0 }}>x</button>
            : <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 11, pointerEvents: 'none' }}>o</span>
          }
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginLeft: -12, marginRight: -12, paddingLeft: 12 }}>
          <button style={tabStyle('shapes')}     onClick={() => setTab('shapes')}>Shapes</button>
          <button style={tabStyle('connectors')} onClick={() => setTab('connectors')}>Lines</button>
          <button style={tabStyle('examples')}   onClick={() => setTab('examples')}>Examples</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>

        {tab === 'shapes' && (
          filteredShapes ? (
            <div>
              <div style={{ padding: '4px 12px 2px', fontSize: 10, color: 'var(--text-muted)' }}>
                {filteredShapes.length} result{filteredShapes.length !== 1 ? 's' : ''}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0 5px' }}>
                {filteredShapes.map(spec => <ShapeItem key={spec.id} spec={spec} />)}
              </div>
            </div>
          ) : (
            allGroups.map(group => {
              const shapes = shapesForPanel(group.id);
              if (!shapes?.length) return null;
              const open = openPanels.has(group.id);
              return (
                <div key={group.id}>
                  <button
                    onClick={() => togglePanel(group.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '5px 10px', border: 'none', background: 'none',
                      cursor: 'pointer', fontSize: 10, fontWeight: 700,
                      color: 'var(--brand-primary)', borderBottom: '1px solid var(--border)', textAlign: 'left',
                    }}
                  >
                    <span>{group.label}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 9, background: '#E3EAF3', borderRadius: 8, padding: '1px 5px', color: 'var(--brand-primary)' }}>{shapes.length}</span>
                      <Arrow open={open} />
                    </span>
                  </button>
                  {open && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '3px 5px 7px' }}>
                      {shapes.map(spec => <ShapeItem key={spec.id} spec={spec} />)}
                    </div>
                  )}
                </div>
              );
            })
          )
        )}

        {tab === 'connectors' && (
          <div style={{ padding: '4px 6px' }}>
            {CONNECTOR_GROUPS.map(group => {
              const items = (filteredConnectors || CONNECTORS_LIST).filter(c => c.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', padding: '7px 8px 3px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                    {group}
                  </div>
                  {items.map(spec => <ConnectorRow key={spec.id} spec={spec} />)}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'examples' && (
          <div style={{ padding: '4px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', flex: 1 }}>
                {storedExamples?.length || 0} example{storedExamples?.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleSaveCurrentAsExample}
                title="Save current diagram as a new example"
                style={{
                  padding: '3px 8px', fontSize: 9, fontWeight: 600, cursor: 'pointer', borderRadius: 4,
                  border: '1px solid var(--brand-secondary)', background: 'white', color: 'var(--brand-secondary)',
                }}
              >+ Save current</button>
            </div>
            {storedExamples?.map(ex => <ExampleRow key={ex.key} example={ex} />)}
          </div>
        )}
      </div>

      <div style={{ padding: '5px 12px', borderTop: '1px solid var(--border)', fontSize: 9, color: 'var(--text-muted)', flexShrink: 0 }}>
        Drag shapes onto canvas - Click connectors to set draw type
      </div>
    </aside>
  );
}
