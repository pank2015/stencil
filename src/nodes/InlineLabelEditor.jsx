import { useState, useRef, useEffect, useCallback } from 'react';
import useDiagramStore from '../store/store';

/**
 * Inline label editor overlay. Double-click the host node to edit its text.
 * Renders a hidden anchor (used to locate the parent node element for the
 * dblclick listener) plus a textarea overlay while editing.
 *
 * align: 'center' (default) | 'top-left' (boundary header)
 */
export default function InlineLabelEditor({ id, label, placeholder, align = 'center' }) {
  const anchorRef = useRef(null);
  const taRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label || '');
  const updateNodeLabel = useDiagramStore(s => s.updateNodeLabel);

  // Attach a dblclick listener to the host node element
  useEffect(() => {
    const host = anchorRef.current?.parentElement;
    if (!host) return;
    const onDbl = (e) => {
      e.stopPropagation();
      setDraft(label || '');
      setEditing(true);
    };
    host.addEventListener('dblclick', onDbl);
    return () => host.removeEventListener('dblclick', onDbl);
  }, [label]);

  // Focus + select on entering edit mode
  useEffect(() => {
    if (editing && taRef.current) {
      taRef.current.focus();
      taRef.current.select();
    }
  }, [editing]);

  const commit = useCallback(() => {
    updateNodeLabel(id, draft);
    setEditing(false);
  }, [id, draft, updateNodeLabel]);

  const cancel = useCallback(() => setEditing(false), []);

  const topLeft = align === 'top-left';

  return (
    <>
      <span ref={anchorRef} style={{ display: 'none' }} />
      {editing && (
        <div
          className="nodrag nopan"
          style={{
            position: 'absolute', inset: 0, zIndex: 30,
            display: 'flex',
            alignItems: topLeft ? 'flex-start' : 'center',
            justifyContent: topLeft ? 'flex-start' : 'center',
            padding: topLeft ? '3px 8px' : 6,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <textarea
            ref={taRef}
            className="nodrag nopan"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); }
              else if (e.key === 'Escape') { e.preventDefault(); cancel(); }
            }}
            onBlur={commit}
            placeholder={placeholder}
            rows={1}
            style={{
              width: topLeft ? '70%' : '92%',
              resize: 'none',
              textAlign: topLeft ? 'left' : 'center',
              fontSize: 12, fontWeight: 600, color: '#1A1A1A',
              border: '1px solid var(--brand-secondary)', borderRadius: 4,
              padding: '2px 5px', outline: 'none', background: 'white',
              fontFamily: 'inherit', lineHeight: 1.25,
              boxShadow: '0 1px 6px rgba(0,0,0,.15)',
            }}
          />
        </div>
      )}
    </>
  );
}
