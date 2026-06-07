import { useState, useRef } from 'react';
import useDiagramStore from '../store/store';

function fmtDate(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }); }
  catch { return iso; }
}

// ── Single diagram row ────────────────────────────────────────────────────────
function DiagramRow({ diag, isCurrent, onOpen, onDelete, onDuplicate, onRename }) {
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(diag.name);
  const [hover, setHover]     = useState(false);

  const commitRename = () => {
    if (name.trim()) onRename(diag.id, name.trim());
    setEditing(false);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 10px', borderRadius: 6, transition: 'background .1s',
        background: isCurrent ? '#EEF5FF' : hover ? '#F5F7F9' : 'transparent',
        border: `1px solid ${isCurrent ? 'var(--brand-primary)' : 'transparent'}`,
        marginBottom: 2,
      }}
    >
      {/* Icon */}
      <span style={{ fontSize: 16, flexShrink: 0 }}>📄</span>

      {/* Name / editor */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setName(diag.name); setEditing(false); } }}
            style={{
              width: '100%', fontSize: 12, padding: '2px 6px',
              border: '1px solid var(--brand-secondary)', borderRadius: 4, outline: 'none',
            }}
          />
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {diag.name}
              {isCurrent && <span style={{ marginLeft: 6, fontSize: 9, background: 'var(--brand-primary)', color: 'white', borderRadius: 8, padding: '1px 6px' }}>current</span>}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
              {diag.diagramType} &middot; {fmtDate(diag.savedAt)}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {(hover || isCurrent) && (
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {!isCurrent && (
            <ActionBtn title="Open" icon="↗" onClick={() => onOpen(diag.id)} />
          )}
          <ActionBtn title="Rename" icon="✎" onClick={() => { setName(diag.name); setEditing(true); }} />
          <ActionBtn title="Duplicate" icon="⧉" onClick={() => onDuplicate(diag.id)} />
          <ActionBtn title="Delete" icon="🗑" danger onClick={() => onDelete(diag.id)} />
        </div>
      )}
    </div>
  );
}

function ActionBtn({ title, icon, onClick, danger }) {
  const [h, setH] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        border: '1px solid', borderRadius: 4, padding: '2px 5px',
        fontSize: 11, cursor: 'pointer', transition: 'all .1s',
        borderColor: danger ? (h ? '#DC2626' : '#FCA5A5') : (h ? '#94A3B8' : '#E2E8F0'),
        background:  danger ? (h ? '#DC2626' : '#FEF2F2') : (h ? '#F1F5F9' : 'white'),
        color:       danger ? (h ? 'white' : '#DC2626') : (h ? '#1A1A1A' : '#5A6678'),
      }}
    >{icon}</button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DiagramManager({ onClose }) {
  const diagrams         = useDiagramStore(s => s.diagrams);
  const currentDiagramId = useDiagramStore(s => s.currentDiagramId);
  const isDirty          = useDiagramStore(s => s.isDirty);

  const saveDiagram        = useDiagramStore(s => s.saveDiagram);
  const newDiagram         = useDiagramStore(s => s.newDiagram);
  const openDiagram        = useDiagramStore(s => s.openDiagram);
  const deleteDiagram      = useDiagramStore(s => s.deleteDiagram);
  const renameDiagram      = useDiagramStore(s => s.renameDiagram);
  const duplicateDiagram   = useDiagramStore(s => s.duplicateDiagram);
  const exportAll          = useDiagramStore(s => s.exportAllDiagrams);
  const importBundle       = useDiagramStore(s => s.importDiagramsBundle);
  const openModal          = useDiagramStore(s => s.openModal);
  const confirmModal       = useDiagramStore(s => s.confirmModal);
  const alertModal         = useDiagramStore(s => s.alertModal);
  const closeModal         = useDiagramStore(s => s.closeModal);
  const diagramName        = useDiagramStore(s => s.diagramName);

  const importRef = useRef(null);

  const handleNew = () => {
    const doNew = () => { newDiagram(); closeModal(); closeModal(); };
    if (isDirty) {
      confirmModal(
        'Unsaved changes',
        `"${diagramName}" has unsaved changes. Start a new diagram anyway?`,
        doNew,
        { danger: true, confirmLabel: 'Discard & New' }
      );
    } else {
      doNew();
    }
  };

  const handleOpen = (id) => {
    const doOpen = () => { openDiagram(id); closeModal(); };
    if (isDirty) {
      confirmModal(
        'Unsaved changes',
        `"${diagramName}" has unsaved changes. Open another diagram anyway?`,
        doOpen,
        { danger: true, confirmLabel: 'Discard & Open' }
      );
    } else {
      doOpen();
    }
  };

  const handleDelete = (id) => {
    const diag = diagrams.find(d => d.id === id);
    confirmModal(
      'Delete diagram',
      `Delete "${diag?.name}"? This cannot be undone.`,
      () => deleteDiagram(id),
      { danger: true, confirmLabel: 'Delete' }
    );
  };

  const handleExportAll = () => {
    const json = exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `awb-diagrams-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const n = importBundle(ev.target.result);
      if (n > 0) alertModal('Import complete', `${n} diagram${n !== 1 ? 's' : ''} imported successfully.`);
      else alertModal('Import failed', 'The file could not be read as an AWB diagram bundle.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const btn = (label, onClick, variant = 'default') => {
    const colors = {
      primary: { bg: 'var(--brand-primary)',   border: 'var(--brand-primary)',   color: 'white' },
      secondary:{ bg: 'var(--brand-secondary)', border: 'var(--brand-secondary)', color: 'white' },
      default:  { bg: 'white',                  border: '#CBD5E1',                color: '#374151' },
    }[variant] || { bg: 'white', border: '#CBD5E1', color: '#374151' };
    return (
      <button onClick={onClick} style={{
        padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', borderRadius: 5,
        border: `1px solid ${colors.border}`, background: colors.bg, color: colors.color, transition: 'opacity .1s',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >{label}</button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minHeight: 0 }}>

      {/* Top actions */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 0 12px', borderBottom: '1px solid var(--border)', marginBottom: 10,
      }}>
        {btn('＋ New diagram', handleNew, 'primary')}
        {isDirty && btn('💾 Save current', () => { saveDiagram(); }, 'secondary')}
        <div style={{ flex: 1 }} />
        {btn('↑ Import', () => importRef.current?.click())}
        {diagrams.length > 0 && btn('↓ Export all', handleExportAll)}
        <input ref={importRef} type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
      </div>

      {/* Diagram list */}
      {diagrams.length === 0 ? (
        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          No saved diagrams yet. Click <strong>＋ New diagram</strong> or <strong>💾 Save current</strong> to start.
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: 420 }}>
          {diagrams.map(d => (
            <DiagramRow
              key={d.id}
              diag={d}
              isCurrent={d.id === currentDiagramId}
              onOpen={handleOpen}
              onDelete={handleDelete}
              onDuplicate={duplicateDiagram}
              onRename={renameDiagram}
            />
          ))}
        </div>
      )}

      {/* Footer hint */}
      {diagrams.length > 0 && (
        <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 9, color: 'var(--text-muted)', marginTop: 8 }}>
          {diagrams.length} saved diagram{diagrams.length !== 1 ? 's' : ''} &middot;
          All data stored locally in browser. Use Export/Import to share or back up.
        </div>
      )}
    </div>
  );
}
