import { useRef } from 'react';
import useDiagramStore from '../store/store';
import DiagramManager from './DiagramManager';

const DIAGRAM_TYPES = [
  'C1 System Context', 'C2 Container', 'C3 Component',
  'High-Level Architecture', 'Deployment', 'Sequence',
  'Process / Flow', 'ERD / Data Model', 'AI/ML Pipeline', 'Agentic Workflow',
];

const selStyle = {
  fontSize: 11, background: 'rgba(255,255,255,.15)', color: 'white',
  border: '1px solid rgba(255,255,255,.25)', borderRadius: 4, padding: '3px 6px', cursor: 'pointer',
};

const divider = (
  <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.2)', margin: '0 2px', flexShrink: 0 }} />
);

function ToolBtn({ onClick, active, children, title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', fontSize: 10, fontWeight: 600, cursor: 'pointer',
        borderRadius: 5, border: '1px solid rgba(255,255,255,.2)',
        background: active ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.1)',
        color: 'white', transition: 'background .12s', flexShrink: 0,
      }}
    >{children}</button>
  );
}

export default function Toolbar() {
  const diagramName    = useDiagramStore(s => s.diagramName);
  const diagramType    = useDiagramStore(s => s.diagramType);
  const showLegend     = useDiagramStore(s => s.showLegend);
  const showMiniMap    = useDiagramStore(s => s.showMiniMap);
  const routingStyle   = useDiagramStore(s => s.routingStyle);
  const isDirty        = useDiagramStore(s => s.isDirty);
  const currentDiagramId = useDiagramStore(s => s.currentDiagramId);

  const setDiagramName  = useDiagramStore(s => s.setDiagramName);
  const setDiagramType  = useDiagramStore(s => s.setDiagramType);
  const setShowLegend   = useDiagramStore(s => s.setShowLegend);
  const setShowMiniMap  = useDiagramStore(s => s.setShowMiniMap);
  const setRoutingStyle = useDiagramStore(s => s.setRoutingStyle);
  const saveDiagram     = useDiagramStore(s => s.saveDiagram);
  const clearCanvas     = useDiagramStore(s => s.clearCanvas);
  const exportDiagram   = useDiagramStore(s => s.exportDiagram);
  const importDiagram   = useDiagramStore(s => s.importDiagram);
  const openModal       = useDiagramStore(s => s.openModal);
  const confirmModal    = useDiagramStore(s => s.confirmModal);
  const alertModal      = useDiagramStore(s => s.alertModal);

  const fileRef = useRef(null);

  const handleExport = () => {
    const json = exportDiagram();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${diagramName.replace(/\s+/g, '_')}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importDiagram(ev.target.result);
      if (!ok) alertModal('Import failed', 'Invalid diagram JSON — could not import.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    confirmModal('Clear canvas', 'Remove all shapes and connectors from the canvas?', clearCanvas,
      { danger: true, confirmLabel: 'Clear all' });
  };

  const handleSave = () => {
    saveDiagram();
    alertModal('Saved', `"${diagramName}" has been saved to your diagram library.`);
  };

  const openDiagramManager = () => {
    openModal({
      title: 'My Diagrams',
      width: 560,
      fullHeight: true,
      render: () => <DiagramManager />,
    });
  };

  return (
    <header style={{
      height: 46, display: 'flex', alignItems: 'center', gap: 6,
      padding: '0 12px', background: 'var(--brand-primary)',
      borderBottom: '1px solid rgba(255,255,255,.1)', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, marginRight: 6 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900,
        }}>⬡</div>
        <span style={{ fontSize: 13, fontWeight: 800, color: 'white', letterSpacing: '.2px' }}>
          AWB Stencil
        </span>
      </div>

      {divider}

      {/* Diagram type + name (compact) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0 }}>
        <select
          value={diagramType}
          onChange={e => setDiagramType(e.target.value)}
          style={selStyle}
        >
          {DIAGRAM_TYPES.map(t => (
            <option key={t} value={t} style={{ color: '#1A1A1A', background: 'white' }}>{t}</option>
          ))}
        </select>

        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>/</span>

        <input
          value={diagramName}
          onChange={e => setDiagramName(e.target.value)}
          style={{
            fontSize: 12, fontWeight: 600, background: 'transparent', color: 'white',
            border: '1px solid transparent', borderRadius: 4, padding: '3px 6px',
            outline: 'none', minWidth: 120, maxWidth: 240,
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,.4)'}
          onBlur={e => e.target.style.borderColor = 'transparent'}
        />

        {/* Dirty indicator */}
        {isDirty && (
          <span style={{ fontSize: 9, color: 'rgba(255,200,100,.9)', fontWeight: 700, letterSpacing: '.3px' }}>
            ● unsaved
          </span>
        )}
      </div>

      {/* Right-side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        {/* Routing */}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', whiteSpace: 'nowrap' }}>Route:</span>
        <select value={routingStyle} onChange={e => setRoutingStyle(e.target.value)} style={selStyle}>
          <option value="metro"      style={{ color: '#1A1A1A', background: 'white' }}>Metro</option>
          <option value="orthogonal" style={{ color: '#1A1A1A', background: 'white' }}>Orthogonal</option>
          <option value="bezier"     style={{ color: '#1A1A1A', background: 'white' }}>Bezier</option>
          <option value="straight"   style={{ color: '#1A1A1A', background: 'white' }}>Straight</option>
        </select>

        {divider}

        <ToolBtn active={showLegend}  onClick={() => setShowLegend(!showLegend)}  title="Toggle legend">📌 Legend</ToolBtn>
        <ToolBtn active={showMiniMap} onClick={() => setShowMiniMap(!showMiniMap)} title="Toggle minimap">🗺 Map</ToolBtn>

        {divider}

        <ToolBtn onClick={openDiagramManager} title="Manage saved diagrams">📂 Diagrams</ToolBtn>
        <ToolBtn onClick={handleClear} title="Clear canvas">🗑 Clear</ToolBtn>

        {divider}

        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        <ToolBtn onClick={() => fileRef.current?.click()} title="Import diagram JSON">↑ Import</ToolBtn>
        <ToolBtn onClick={handleExport} title="Export diagram as JSON">↓ Export</ToolBtn>

        {/* Save — primary CTA */}
        <button
          onClick={handleSave}
          title="Save diagram to library"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '5px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            borderRadius: 5, border: '1px solid var(--brand-secondary)',
            background: isDirty ? 'var(--brand-secondary)' : 'rgba(255,255,255,.15)',
            color: 'white', transition: 'all .15s', flexShrink: 0,
            boxShadow: isDirty ? '0 0 0 2px rgba(14,122,138,.4)' : 'none',
          }}
        >
          💾 Save{currentDiagramId ? '' : ' as new'}
        </button>
      </div>
    </header>
  );
}
