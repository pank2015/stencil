import { useState } from 'react';
import { SHAPES, SHAPES_LIST, STATUS_COLORS } from '../data/shapes';
import { CONNECTORS, CONNECTORS_LIST } from '../data/connectors';
import { METADATA_SCHEMA, METADATA_GROUPS } from '../data/metadataSchema';
import useDiagramStore from '../store/store';

const inputStyle = {
  width: '100%', padding: '5px 8px', fontSize: 11, border: '1px solid var(--border)',
  borderRadius: 4, background: 'var(--surface-2)', outline: 'none', boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)',
  marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.4px',
};

function Field({ fieldId, schema, value, onChange }) {
  const { label, type, options, placeholder, hint } = schema;

  if (type === 'enum') {
    return (
      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>{label}</label>
        <select value={value || ''} onChange={e => onChange(fieldId, e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
          <option value="">— select —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }

  if (type === 'multiselect') {
    const vals = Array.isArray(value) ? value : [];
    const toggle = (opt) => {
      const next = vals.includes(opt) ? vals.filter(v => v !== opt) : [...vals, opt];
      onChange(fieldId, next);
    };
    return (
      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>{label}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                padding: '3px 8px', fontSize: 10, borderRadius: 10, cursor: 'pointer', transition: 'all .12s',
                border: `1px solid ${vals.includes(opt) ? 'var(--status-decommission)' : 'var(--border)'}`,
                background: vals.includes(opt) ? 'var(--status-decommission-fill)' : 'transparent',
                color: vals.includes(opt) ? 'var(--status-decommission)' : 'var(--text-secondary)',
                fontWeight: vals.includes(opt) ? 700 : 400,
              }}
            >{opt}</button>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'tags') {
    const vals = Array.isArray(value) ? value : [];
    const [draft, setDraft] = useState('');
    const add = () => {
      const v = draft.trim();
      if (v && !vals.includes(v)) onChange(fieldId, [...vals, v]);
      setDraft('');
    };
    return (
      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>{label}</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {vals.map(v => (
            <span key={v} style={{
              padding: '2px 6px', fontSize: 10, borderRadius: 10,
              background: 'var(--surface-3)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {v}
              <button onClick={() => onChange(fieldId, vals.filter(x => x !== v))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 10, padding: 0, lineHeight: 1 }}>✕</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
            placeholder={placeholder || 'Add…'}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={add} style={{ padding: '5px 10px', fontSize: 11, borderRadius: 4, border: '1px solid var(--border)', background: 'var(--surface-3)', cursor: 'pointer' }}>+</button>
        </div>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>{label}</label>
        <textarea
          value={value || ''}
          onChange={e => onChange(fieldId, e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <label style={labelStyle}>{label}{hint && <span style={{ fontWeight: 400, marginLeft: 4, fontSize: 9, color: 'var(--text-muted)' }}>{hint}</span>}</label>
      <input
        type={type === 'date' ? 'date' : type === 'url' ? 'url' : 'text'}
        value={value || ''}
        onChange={e => onChange(fieldId, e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function SizeControls({ node }) {
  const updateNodeSize = useDiagramStore(s => s.updateNodeSize);
  const resetNodeSize  = useDiagramStore(s => s.resetNodeSize);
  const spec = SHAPES[node.data.shapeType] || SHAPES['ent.foundation.rectangle'];
  const currentW = node.data.size?.width  ?? node.style?.width  ?? spec.defaultSize.width;
  const currentH = node.data.size?.height ?? node.style?.height ?? spec.defaultSize.height;

  const adjust = (dw, dh) => {
    const w = Math.max(60, Math.round(currentW + dw));
    const h = Math.max(40, Math.round(currentH + dh));
    updateNodeSize(node.id, w, h);
  };
  const setBoth = (w, h) => updateNodeSize(node.id, Math.max(60, w), Math.max(40, h));
  const isDefault = !node.data.size;

  const stepBtn = (label, dw, dh) => (
    <button
      onClick={() => adjust(dw, dh)}
      title={`${dw > 0 || dh > 0 ? 'Increase' : 'Decrease'} ${dw !== 0 ? 'width' : 'height'}`}
      style={{
        width: 26, height: 26, borderRadius: 4, border: '1px solid var(--border)',
        background: 'var(--surface-2)', cursor: 'pointer', fontSize: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >{label}</button>
  );

  return (
    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Size</div>
        {!isDefault && (
          <button
            onClick={() => resetNodeSize(node.id)}
            style={{ fontSize: 9, color: 'var(--brand-secondary)', border: 'none', background: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >Reset to default</button>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 3 }}>Width</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {stepBtn('−', -20, 0)}
            <input
              type="number"
              value={Math.round(currentW)}
              min={60}
              onChange={e => setBoth(Number(e.target.value), currentH)}
              style={{ ...inputStyle, width: '100%', textAlign: 'center', padding: '3px 4px' }}
            />
            {stepBtn('+', 20, 0)}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 3 }}>Height</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {stepBtn('−', 0, -20)}
            <input
              type="number"
              value={Math.round(currentH)}
              min={40}
              onChange={e => setBoth(currentW, Number(e.target.value))}
              style={{ ...inputStyle, width: '100%', textAlign: 'center', padding: '3px 4px' }}
            />
            {stepBtn('+', 0, 20)}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {[['S', 100, 60], ['M', 160, 100], ['L', 240, 150], ['XL', 320, 200]].map(([lbl, w, h]) => (
          <button
            key={lbl}
            onClick={() => setBoth(w, h)}
            style={{
              flex: 1, padding: '4px 0', fontSize: 10, fontWeight: 700, borderRadius: 4,
              border: `1px solid ${Math.round(currentW) === w && Math.round(currentH) === h ? 'var(--brand-secondary)' : 'var(--border)'}`,
              background: Math.round(currentW) === w && Math.round(currentH) === h ? '#E0F2F1' : 'var(--surface-2)',
              color: Math.round(currentW) === w && Math.round(currentH) === h ? 'var(--brand-secondary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >{lbl}</button>
        ))}
      </div>
    </div>
  );
}

function NodeProperties({ node }) {
  const updateLabel = useDiagramStore(s => s.updateNodeLabel);
  const updateMeta = useDiagramStore(s => s.updateNodeMetadata);
  const updateShapeType = useDiagramStore(s => s.updateNodeShapeType);
  const deleteNode = useDiagramStore(s => s.deleteNode);
  const [openGroups, setOpenGroups] = useState(new Set(['governance']));

  const spec = SHAPES[node.data.shapeType] || SHAPES['ent.foundation.rectangle'];
  const meta = node.data.metadata || {};
  const status = meta.lifecycleStatus || 'Draft';
  const statusColor = STATUS_COLORS[status] || '#ccc';

  const toggleGroup = (id) => setOpenGroups(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div>
      {/* Shape identity */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>Element Type</div>
        <select
          value={node.data.shapeType}
          onChange={e => updateShapeType(node.id, e.target.value)}
          style={{ ...inputStyle, marginBottom: 0 }}
        >
          {SHAPES_LIST.map(s => <option key={s.id} value={s.id}>{s.displayName} ({s.panelGroup})</option>)}
        </select>
      </div>

      {/* Label */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>Label</div>
        <input
          value={node.data.label || ''}
          onChange={e => updateLabel(node.id, e.target.value)}
          style={inputStyle}
          placeholder="Element label..."
        />
      </div>

      {/* Status badge */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1 }}>{status}</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', fontStyle: 'italic' }}>{spec.stereotype || spec.displayName}</span>
      </div>

      {/* Size controls */}
      <SizeControls node={node} />

      {/* Metadata groups */}
      {METADATA_GROUPS.map(group => {
        const fields = Object.entries(METADATA_SCHEMA).filter(([, v]) => v.group === group.id);
        const open = openGroups.has(group.id);
        return (
          <div key={group.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <button
              onClick={() => toggleGroup(group.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 14px', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)', textAlign: 'left',
              }}
            >
              <span>{group.label}</span>
              <span style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s', fontSize: 10, color: 'var(--text-muted)' }}>▶</span>
            </button>
            {open && (
              <div style={{ padding: '0 14px 10px' }}>
                {fields.map(([fieldId, schema]) => (
                  <Field
                    key={fieldId}
                    fieldId={fieldId}
                    schema={schema}
                    value={meta[fieldId]}
                    onChange={(f, v) => updateMeta(node.id, f, v)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Delete */}
      <div style={{ padding: '10px 14px' }}>
        <button
          onClick={() => deleteNode(node.id)}
          style={{
            width: '100%', padding: '7px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            border: '1px solid var(--status-decommission)', borderRadius: 5,
            background: 'var(--status-decommission-fill)', color: 'var(--status-decommission)',
          }}
        >
          🗑 Delete Element
        </button>
      </div>
    </div>
  );
}

function EdgeProperties({ edge }) {
  const updateEdge = useDiagramStore(s => s.updateEdge);
  const deleteEdge = useDiagramStore(s => s.deleteEdge);
  const spec = CONNECTORS[edge.data?.connectorType] || CONNECTORS['conn.sync.rest'];

  return (
    <div>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>Connector Type</div>
        <select
          value={edge.data?.connectorType || 'conn.sync.rest'}
          onChange={e => updateEdge(edge.id, 'connectorType', e.target.value)}
          style={{ ...inputStyle, marginBottom: 8 }}
        >
          {CONNECTORS_LIST.map(c => <option key={c.id} value={c.id}>{c.displayName} ({c.group})</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'var(--surface-2)', borderRadius: 5 }}>
          <svg width={40} height={12}>
            <line x1={2} y1={6} x2={34} y2={6} stroke={spec.color} strokeWidth={spec.strokeWeight} strokeDasharray={spec.dashArray || undefined} />
            <polygon points="34,2 40,6 34,10" fill={spec.targetMarker === 'open-arrow' ? 'none' : spec.color} stroke={spec.color} strokeWidth={1} />
          </svg>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{spec.description}</span>
        </div>
      </div>

      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>
          Label
        </div>
        <input
          value={edge.data?.label || ''}
          onChange={e => updateEdge(edge.id, 'label', e.target.value)}
          style={inputStyle}
          placeholder={spec.labelHint || 'Connector label…'}
        />
        <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>Hint: {spec.labelHint || 'e.g. topic name, method'}</div>
      </div>

      {/* Bidirectional toggle */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div
            onClick={() => updateEdge(edge.id, 'bidirectional', !edge.data?.bidirectional)}
            style={{
              width: 34, height: 18, borderRadius: 9, transition: 'background .15s', flexShrink: 0,
              background: edge.data?.bidirectional ? 'var(--brand-secondary)' : '#CBD5E1',
              position: 'relative', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: 'white',
              position: 'absolute', top: 2, transition: 'left .15s',
              left: edge.data?.bidirectional ? 18 : 2,
            }} />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.4px' }}>
              Bidirectional
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>
              {edge.data?.bidirectional ? 'Arrows on both ends (e.g. Kafka pub + sub)' : 'Arrow on target end only'}
            </div>
          </div>
        </label>
      </div>

      <div style={{ padding: '10px 14px' }}>
        <button
          onClick={() => deleteEdge(edge.id)}
          style={{
            width: '100%', padding: '7px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            border: '1px solid var(--status-decommission)', borderRadius: 5,
            background: 'var(--status-decommission-fill)', color: 'var(--status-decommission)',
          }}
        >
          🗑 Delete Connector
        </button>
      </div>
    </div>
  );
}

export default function PropertiesPanel() {
  const selectedNodeId = useDiagramStore(s => s.selectedNodeId);
  const selectedEdgeId = useDiagramStore(s => s.selectedEdgeId);
  const nodes = useDiagramStore(s => s.nodes);
  const edges = useDiagramStore(s => s.edges);
  const diagramName = useDiagramStore(s => s.diagramName);
  const diagramType = useDiagramStore(s => s.diagramType);
  const effectiveDate = useDiagramStore(s => s.effectiveDate);
  const changeInitiative = useDiagramStore(s => s.changeInitiative);
  const setDiagramName = useDiagramStore(s => s.setDiagramName);
  const setDiagramType = useDiagramStore(s => s.setDiagramType);
  const setEffectiveDate = useDiagramStore(s => s.setEffectiveDate);
  const setChangeInitiative = useDiagramStore(s => s.setChangeInitiative);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedEdge = edges.find(e => e.id === selectedEdgeId);

  return (
    <aside style={{
      width: 240, flexShrink: 0, borderLeft: '1px solid var(--border)',
      background: 'var(--surface)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '.6px' }}>
          Properties
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {selectedNode ? (
          <NodeProperties node={selectedNode} />
        ) : selectedEdge ? (
          <EdgeProperties edge={selectedEdge} />
        ) : (
          /* Diagram-level properties */
          <div>
            <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.4px' }}>📋 Artifact Details</div>
            </div>

            <div style={{ padding: '10px 14px' }}>
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Diagram Name</label>
                <input value={diagramName} onChange={e => setDiagramName(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Diagram Type</label>
                <select value={diagramType} onChange={e => setDiagramType(e.target.value)} style={inputStyle}>
                  {['C1 System Context', 'C2 Container', 'C3 Component', 'High-Level Architecture', 'High-Level Functional', 'Deployment', 'Sequence', 'Process / Flow', 'ERD / Data Model', 'UML Class', 'UML Use Case', 'UML State Machine', 'UML Activity', 'AI/ML Pipeline', 'Agentic Workflow'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Effective Date</label>
                <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Change Initiative</label>
                <input value={changeInitiative} onChange={e => setChangeInitiative(e.target.value)} style={inputStyle} placeholder="e.g. New SEAL Approval" />
                {changeInitiative && (
                  <div style={{ marginTop: 4 }}>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', fontSize: 10, fontWeight: 700, borderRadius: 10,
                      background: 'var(--brand-primary)', color: 'white',
                    }}>
                      {changeInitiative}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>📊 Diagram Stats</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  ['Nodes', nodes.length],
                  ['Connectors', edges.length],
                  ['Shapes with PII', nodes.filter(n => n.data.metadata?.complianceFlags?.includes('PII')).length],
                  ['Draft items', nodes.filter(n => n.data.metadata?.lifecycleStatus === 'Draft').length],
                ].map(([label, count]) => (
                  <div key={label} style={{ background: 'white', borderRadius: 6, padding: '6px 8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-primary)' }}>{count}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Click a shape or connector on the canvas to edit its properties.
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
