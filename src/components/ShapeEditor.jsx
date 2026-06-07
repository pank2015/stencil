import { useState, useMemo, useRef } from 'react';
import useDiagramStore from '../store/store';
import { SHAPES, PANEL_GROUPS } from '../data/shapes';

const BASE_SHAPE_TYPES = [
  'rect', 'rounded', 'rounded-dashed', 'rect-dashed', 'rect-queue', 'rect-notched', 'rect-striped',
  'cylinder', 'cylinder-wide', 'hexagon', 'diamond',
  'circle', 'circle-thick', 'ellipse',
  'person', 'org',
  'boundary', 'boundary-dashed',
  'note', 'parallelogram',
];

const PANEL_OPTIONS = [
  ...PANEL_GROUPS,
  { id: 'P09', label: 'Custom Shapes' },
];

function ColorInput({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label style={{ fontSize: 11, color: '#5A6678', width: 50, flexShrink: 0 }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: 28, height: 24, padding: 0, border: '1px solid #CBD5E1', borderRadius: 4, cursor: 'pointer' }}
        />
        <input
          type="text"
          value={value}
          onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
          style={{ flex: 1, fontSize: 11, padding: '3px 6px', border: '1px solid #CBD5E1', borderRadius: 4, fontFamily: 'monospace' }}
        />
      </div>
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 10 }}>
      <label style={{ fontSize: 10, fontWeight: 600, color: '#5A6678', textTransform: 'uppercase', letterSpacing: '.4px' }}>{label}</label>
      {children}
    </div>
  );
}

const inp = {
  width: '100%', fontSize: 12, padding: '5px 8px',
  border: '1px solid #CBD5E1', borderRadius: 5, outline: 'none',
  boxSizing: 'border-box',
};

// ── Shape edit form ───────────────────────────────────────────────────────────
function EditForm({ spec, isNew, onSave, onCancel, onDelete, onReset, isBuiltIn }) {
  const [form, setForm] = useState({
    id:          spec.id,
    displayName: spec.displayName,
    description: spec.description || '',
    stereotype:  spec.stereotype  || '',
    shape:       spec.shape,
    panelGroup:  spec.panelGroup,
    fill:        spec.color.fill,
    border:      spec.color.border,
    text:        spec.color.text || '#1A1A1A',
    width:       spec.defaultSize.width,
    height:      spec.defaultSize.height,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.id.trim() || !form.displayName.trim()) return;
    onSave({
      id:          form.id.trim(),
      displayName: form.displayName.trim(),
      description: form.description.trim(),
      stereotype:  form.stereotype.trim(),
      shape:       form.shape,
      panelGroup:  form.panelGroup,
      color:       { fill: form.fill, border: form.border, text: form.text },
      defaultSize: { width: Number(form.width) || 120, height: Number(form.height) || 60 },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Preview */}
      <div style={{
        marginBottom: 14, padding: '10px 14px', borderRadius: 8,
        background: form.fill, border: `2px solid ${form.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 44,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: form.text }}>{form.displayName || 'Preview'}</span>
        {form.stereotype && <span style={{ fontSize: 9, color: form.border, marginLeft: 6, fontStyle: 'italic' }}>{form.stereotype}</span>}
      </div>

      <FieldRow label="Display name">
        <input style={inp} value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="e.g. My Custom Box" />
      </FieldRow>

      {isNew && (
        <FieldRow label="Shape ID (unique key)">
          <input style={inp} value={form.id} onChange={e => set('id', e.target.value.replace(/[^a-z0-9._-]/gi, '').toLowerCase())} placeholder="e.g. custom.mybox" />
        </FieldRow>
      )}

      <FieldRow label="Stereotype label">
        <input style={inp} value={form.stereotype} onChange={e => set('stereotype', e.target.value)} placeholder='e.g. «service»' />
      </FieldRow>

      <FieldRow label="Description">
        <input style={inp} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short tooltip text" />
      </FieldRow>

      <FieldRow label="Base shape">
        <select style={inp} value={form.shape} onChange={e => set('shape', e.target.value)}>
          {BASE_SHAPE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </FieldRow>

      <FieldRow label="Panel group">
        <select style={inp} value={form.panelGroup} onChange={e => set('panelGroup', e.target.value)}>
          {PANEL_OPTIONS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
        </select>
      </FieldRow>

      <FieldRow label="Colors">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <ColorInput label="Fill"   value={form.fill}   onChange={v => set('fill', v)} />
          <ColorInput label="Border" value={form.border} onChange={v => set('border', v)} />
          <ColorInput label="Text"   value={form.text}   onChange={v => set('text', v)} />
        </div>
      </FieldRow>

      <FieldRow label="Default size">
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 9, color: '#5A6678' }}>Width (px)</label>
            <input type="number" style={inp} value={form.width} onChange={e => set('width', e.target.value)} min={40} max={800} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 9, color: '#5A6678' }}>Height (px)</label>
            <input type="number" style={inp} value={form.height} onChange={e => set('height', e.target.value)} min={30} max={600} />
          </div>
        </div>
      </FieldRow>

      {/* Action row */}
      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
        <button onClick={handleSave}
          style={{ flex: 1, padding: '7px 0', fontSize: 11, fontWeight: 700, cursor: 'pointer', borderRadius: 5,
            border: '1px solid var(--brand-primary)', background: 'var(--brand-primary)', color: 'white' }}>
          {isNew ? '＋ Create shape' : '💾 Save changes'}
        </button>
        <button onClick={onCancel}
          style={{ padding: '7px 14px', fontSize: 11, cursor: 'pointer', borderRadius: 5,
            border: '1px solid #CBD5E1', background: 'white', color: '#374151' }}>
          Cancel
        </button>
      </div>
      {!isNew && (
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {isBuiltIn && (
            <button onClick={onReset}
              style={{ flex: 1, padding: '5px 0', fontSize: 10, cursor: 'pointer', borderRadius: 5,
                border: '1px solid #CBD5E1', background: 'white', color: '#5A6678' }}>
              ↺ Reset to default
            </button>
          )}
          {!isBuiltIn && (
            <button onClick={onDelete}
              style={{ flex: 1, padding: '5px 0', fontSize: 10, cursor: 'pointer', borderRadius: 5,
                border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#DC2626' }}>
              🗑 Delete shape
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Shape list item ───────────────────────────────────────────────────────────
function ShapeListItem({ spec, isCustom, onEdit }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px',
        borderRadius: 5, transition: 'background .1s', cursor: 'pointer',
        background: hover ? '#F0F4F8' : 'transparent', marginBottom: 1,
      }}
      onClick={() => onEdit(spec)}
    >
      <div style={{
        width: 20, height: 14, borderRadius: 2, flexShrink: 0,
        background: spec.color.fill, border: `1.5px solid ${spec.color.border}`,
      }} />
      <span style={{ flex: 1, fontSize: 11, color: '#1A1A1A' }}>{spec.displayName}</span>
      {isCustom && <span style={{ fontSize: 8, background: '#EDE7F6', color: '#6A1B9A', borderRadius: 8, padding: '1px 5px', fontWeight: 700 }}>custom</span>}
      <span style={{ fontSize: 9, color: '#94A3B8' }}>✎</span>
    </div>
  );
}

// ── Main ShapeEditor ──────────────────────────────────────────────────────────
export default function ShapeEditor() {
  const userShapes         = useDiagramStore(s => s.userShapes);
  const saveUserShape      = useDiagramStore(s => s.saveUserShape);
  const deleteUserShape    = useDiagramStore(s => s.deleteUserShape);
  const resetShapeToDefault = useDiagramStore(s => s.resetShapeToDefault);
  const confirmModal       = useDiagramStore(s => s.confirmModal);
  const alertModal         = useDiagramStore(s => s.alertModal);
  const exportUserStencil  = useDiagramStore(s => s.exportUserStencil);
  const importUserStencil  = useDiagramStore(s => s.importUserStencil);

  const [search, setSearch]   = useState('');
  const [editing, setEditing] = useState(null);   // null | { spec, isNew, isBuiltIn }
  const [activeGroup, setActiveGroup] = useState(null);  // null = all

  const fileRef = useRef(null);

  // Merged shapes: user overrides + new custom shapes
  const allShapes = useMemo(() => ({ ...SHAPES, ...userShapes }), [userShapes]);

  const q = search.toLowerCase();
  const grouped = useMemo(() => {
    const list = Object.values(allShapes).filter(s =>
      !q || s.displayName.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
    );
    return PANEL_OPTIONS.filter(g => list.some(s => s.panelGroup === g.id)).map(g => ({
      group: g,
      shapes: list.filter(s => s.panelGroup === g.id),
    }));
  }, [allShapes, q]);

  const handleSave = (spec) => {
    saveUserShape(spec);
    setEditing(null);
    alertModal('Shape saved', `"${spec.displayName}" has been saved to your stencil.`);
  };

  const handleDelete = (id) => {
    const spec = userShapes[id];
    confirmModal(
      'Delete shape',
      `Delete custom shape "${spec?.displayName}"? It will be removed from the panel.`,
      () => { deleteUserShape(id); setEditing(null); },
      { danger: true, confirmLabel: 'Delete' }
    );
  };

  const handleReset = (id) => {
    const spec = SHAPES[id];
    confirmModal(
      'Reset shape',
      `Reset "${spec?.displayName}" to its built-in defaults? Your customizations will be lost.`,
      () => { resetShapeToDefault(id); setEditing(null); },
      { danger: false, confirmLabel: 'Reset to default' }
    );
  };

  const handleExport = () => {
    const json = exportUserStencil();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'awb-stencil.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const n = importUserStencil(ev.target.result);
      if (n >= 0) alertModal('Import complete', `${n} shape${n !== 1 ? 's' : ''} imported into your stencil.`);
      else alertModal('Import failed', 'Could not parse the stencil file. Make sure it is a valid AWB stencil export.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const startNewShape = () => {
    setEditing({
      isNew: true, isBuiltIn: false,
      spec: {
        id: `custom.shape-${Date.now()}`,
        displayName: 'New Shape',
        description: '',
        stereotype: '',
        shape: 'rect',
        panelGroup: 'P09',
        color: { fill: '#F0F4F8', border: '#64748B', text: '#1A1A1A' },
        defaultSize: { width: 120, height: 60 },
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minHeight: 0, height: '100%' }}>
      {editing ? (
        // ── Edit form ──
        <div>
          <button
            onClick={() => setEditing(null)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--brand-secondary)', padding: '0 0 10px', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            ← Back to shape list
          </button>
          <EditForm
            spec={editing.spec}
            isNew={editing.isNew}
            isBuiltIn={editing.isBuiltIn}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            onDelete={() => handleDelete(editing.spec.id)}
            onReset={() => handleReset(editing.spec.id)}
          />
        </div>
      ) : (
        // ── Shape list ──
        <>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <button onClick={startNewShape}
              style={{ padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', borderRadius: 5,
                border: '1px solid var(--brand-primary)', background: 'var(--brand-primary)', color: 'white' }}>
              ＋ New shape
            </button>
            <div style={{ flex: 1 }} />
            <button onClick={handleExport}
              style={{ padding: '5px 10px', fontSize: 10, cursor: 'pointer', borderRadius: 5, border: '1px solid #CBD5E1', background: 'white', color: '#374151' }}>
              ↓ Export stencil
            </button>
            <button onClick={() => fileRef.current?.click()}
              style={{ padding: '5px 10px', fontSize: 10, cursor: 'pointer', borderRadius: 5, border: '1px solid #CBD5E1', background: 'white', color: '#374151' }}>
              ↑ Import stencil
            </button>
            <input
              ref={fileRef}
              type="file" accept=".json" onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search shapes..."
            style={{ ...inp, marginBottom: 10 }}
          />

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 440 }}>
            {grouped.map(({ group, shapes }) => (
              <div key={group.id}>
                <div style={{
                  fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase',
                  letterSpacing: '.5px', padding: '6px 8px 3px',
                }}>
                  {group.label} <span style={{ fontSize: 9, fontWeight: 400 }}>({shapes.length})</span>
                </div>
                {shapes.map(spec => (
                  <ShapeListItem
                    key={spec.id}
                    spec={spec}
                    isCustom={!!userShapes[spec.id] && !SHAPES[spec.id]}
                    onEdit={(s) => setEditing({ spec: s, isNew: false, isBuiltIn: !!SHAPES[s.id] && !userShapes[s.id] })}
                  />
                ))}
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 9, color: 'var(--text-muted)', marginTop: 8 }}>
            {Object.keys(userShapes).length} customization{Object.keys(userShapes).length !== 1 ? 's' : ''} saved &middot; Built-in shapes can be edited but not deleted
          </div>
        </>
      )}
    </div>
  );
}
