import { useEffect, useRef } from 'react';
import useDiagramStore from '../store/store';

// ── Button row ────────────────────────────────────────────────────────────────
function ModalButtons({ buttons }) {
  const closeModal = useDiagramStore(s => s.closeModal);
  return (
    <div style={{
      padding: '10px 18px 16px', display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0,
    }}>
      {buttons.map((btn, i) => {
        const isPrimary = btn.variant === 'primary';
        const isDanger  = btn.variant === 'danger';
        return (
          <button
            key={i}
            onClick={() => {
              btn.onClick?.();
              if (btn.closeOnClick !== false) closeModal();
            }}
            style={{
              padding: '7px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              borderRadius: 6, border: '1px solid',
              borderColor: isPrimary ? 'var(--brand-primary)' : isDanger ? '#DC2626' : '#CBD5E1',
              background:  isPrimary ? 'var(--brand-primary)' : isDanger ? '#DC2626' : 'white',
              color:       isPrimary || isDanger ? 'white' : '#374151',
              transition:  'opacity .1s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Single modal layer ────────────────────────────────────────────────────────
function ModalLayer({ modal }) {
  const closeModal = useDiagramStore(s => s.closeModal);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && modal.dismissable !== false) closeModal();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeModal, modal.dismissable]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current && modal.dismissable !== false) closeModal();
      }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.52)',
        zIndex: 9000 + (modal._stackIndex || 0) * 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(1.5px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 12,
          width: modal.width || 440, maxWidth: '92vw',
          maxHeight: modal.fullHeight ? '90vh' : '80vh',
          boxShadow: '0 24px 64px rgba(0,0,0,0.30)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'modal-in .16s ease-out',
        }}
      >
        {/* Title bar */}
        {modal.title && (
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0, background: '#FAFBFC',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{modal.title}</span>
            {modal.dismissable !== false && (
              <button
                onClick={closeModal}
                style={{
                  border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 18, color: '#9CA3AF', lineHeight: 1, padding: '0 2px',
                  borderRadius: 4, transition: 'color .1s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}
              >✕</button>
            )}
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '16px 18px', flex: 1, overflowY: 'auto' }}>
          {modal.message && (
            <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.65 }}>
              {modal.message}
            </p>
          )}
          {modal.render?.()}
        </div>

        {/* Button row */}
        {modal.buttons && <ModalButtons buttons={modal.buttons} />}
      </div>
    </div>
  );
}

// ── Root renderer — drop this in App.jsx ─────────────────────────────────────
export default function ModalRenderer() {
  const modalStack = useDiagramStore(s => s.modalStack);
  if (!modalStack.length) return null;
  return (
    <>
      {modalStack.map((modal, i) => (
        <ModalLayer key={modal._id} modal={{ ...modal, _stackIndex: i }} />
      ))}
    </>
  );
}

// ── CSS animation (injected once) ────────────────────────────────────────────
const STYLE_ID = 'awb-modal-style';
if (!document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes modal-in {
      from { opacity: 0; transform: scale(.95) translateY(-6px); }
      to   { opacity: 1; transform: scale(1)  translateY(0); }
    }
  `;
  document.head.appendChild(s);
}
