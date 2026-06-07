import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import { C1_EXAMPLE, ALL_EXAMPLES } from '../data/examples';
import { DEFAULT_METADATA } from '../data/metadataSchema';
import { SHAPES } from '../data/shapes';
import { CONNECTORS } from '../data/connectors';

// ── ID generator ──────────────────────────────────────────────────────────────
let _id = 2000;
const uid = () => `el-${++_id}-${Date.now()}`;

// ── Store ─────────────────────────────────────────────────────────────────────
const useDiagramStore = create(
  persist(
    (set, get) => ({

      // ────────────────────────────────────────────────────────
      // MODAL STACK  (not persisted)
      // ────────────────────────────────────────────────────────
      modalStack: [],

      openModal: (config) =>
        set(s => ({
          modalStack: [...s.modalStack, { _id: uid(), dismissable: true, ...config }],
        })),

      closeModal: () =>
        set(s => ({ modalStack: s.modalStack.slice(0, -1) })),

      closeAllModals: () => set({ modalStack: [] }),

      /** Convenience: show a confirm dialog and run onConfirm if user clicks OK */
      confirmModal: (title, message, onConfirm, opts = {}) => {
        const { danger = false, confirmLabel = 'Confirm', cancelLabel = 'Cancel' } = opts;
        get().openModal({
          title,
          message,
          dismissable: true,
          buttons: [
            { label: cancelLabel, variant: 'default' },
            {
              label: confirmLabel, variant: danger ? 'danger' : 'primary',
              onClick: onConfirm, closeOnClick: true,
            },
          ],
        });
      },

      /** Convenience: show a simple info/alert modal */
      alertModal: (title, message) => {
        get().openModal({
          title, message, dismissable: true,
          buttons: [{ label: 'OK', variant: 'primary' }],
        });
      },

      // ────────────────────────────────────────────────────────
      // DIAGRAM STATE  (persisted as working canvas)
      // ────────────────────────────────────────────────────────
      nodes: C1_EXAMPLE.nodes,
      edges: C1_EXAMPLE.edges,
      selectedNodeId: null,
      selectedEdgeId: null,

      // Diagram meta
      diagramName:      C1_EXAMPLE.diagramName,
      diagramType:      C1_EXAMPLE.diagramType,
      effectiveDate:    '2026-06-03',
      changeInitiative: 'New SEAL Approval',

      // Canvas settings
      routingStyle:  'metro',
      showLegend:    true,
      showMiniMap:   true,
      connectionType: 'conn.sync.rest',

      // Stencil UI
      stencilSearch: '',
      activePreset:  null,

      // ────────────────────────────────────────────────────────
      // DIRTY / UNSAVED tracking  (not persisted)
      // ────────────────────────────────────────────────────────
      isDirty: false,

      markDirty: () => set({ isDirty: true }),
      markClean: () => set({ isDirty: false }),

      // ────────────────────────────────────────────────────────
      // SAVED DIAGRAMS  (persisted)
      // ────────────────────────────────────────────────────────
      diagrams: [],
      currentDiagramId: null,
      currentExampleKey: null,   // non-null when an example is loaded

      _snapshotCurrentDiagram: () => {
        const s = get();
        return {
          id:               s.currentDiagramId || uid(),
          name:             s.diagramName,
          diagramType:      s.diagramType,
          nodes:            s.nodes,
          edges:            s.edges,
          routingStyle:     s.routingStyle,
          effectiveDate:    s.effectiveDate,
          changeInitiative: s.changeInitiative,
          savedAt:          new Date().toISOString(),
        };
      },

      saveDiagram: () => {
        const s = get();
        const snap = s._snapshotCurrentDiagram();
        const exists = s.diagrams.findIndex(d => d.id === snap.id);
        const diagrams = exists >= 0
          ? s.diagrams.map(d => d.id === snap.id ? snap : d)
          : [...s.diagrams, snap];
        set({ diagrams, currentDiagramId: snap.id, isDirty: false, currentExampleKey: null });
        return snap.id;
      },

      newDiagram: () => {
        set({
          nodes: [], edges: [],
          diagramName: 'Untitled Diagram',
          diagramType: 'C1 System Context',
          effectiveDate: '', changeInitiative: '',
          routingStyle: 'metro',
          currentDiagramId: null, currentExampleKey: null,
          selectedNodeId: null, selectedEdgeId: null,
          isDirty: false,
        });
      },

      openDiagram: (id) => {
        const s = get();
        const diag = s.diagrams.find(d => d.id === id);
        if (!diag) return;
        set({
          nodes:            diag.nodes,
          edges:            diag.edges,
          diagramName:      diag.name,
          diagramType:      diag.diagramType || '',
          routingStyle:     diag.routingStyle || 'metro',
          effectiveDate:    diag.effectiveDate || '',
          changeInitiative: diag.changeInitiative || '',
          currentDiagramId: diag.id,
          currentExampleKey: null,
          selectedNodeId:   null,
          selectedEdgeId:   null,
          isDirty:          false,
        });
      },

      deleteDiagram: (id) =>
        set(s => ({
          diagrams: s.diagrams.filter(d => d.id !== id),
          currentDiagramId: s.currentDiagramId === id ? null : s.currentDiagramId,
        })),

      renameDiagram: (id, name) =>
        set(s => ({
          diagrams:    s.diagrams.map(d => d.id === id ? { ...d, name } : d),
          diagramName: s.currentDiagramId === id ? name : s.diagramName,
        })),

      duplicateDiagram: (id) => {
        const s = get();
        const orig = s.diagrams.find(d => d.id === id);
        if (!orig) return;
        const copy = { ...orig, id: uid(), name: orig.name + ' (copy)', savedAt: new Date().toISOString() };
        set(s2 => ({ diagrams: [...s2.diagrams, copy] }));
      },

      exportAllDiagrams: () => {
        const s = get();
        return JSON.stringify({
          _type:      'awb-diagrams-bundle',
          version:    1,
          exportedAt: new Date().toISOString(),
          diagrams:   s.diagrams,
        }, null, 2);
      },

      importDiagramsBundle: (json) => {
        try {
          const parsed = JSON.parse(json);
          if (!parsed.diagrams?.length) throw new Error('No diagrams');
          set(s => ({ diagrams: [...s.diagrams, ...parsed.diagrams] }));
          return parsed.diagrams.length;
        } catch { return 0; }
      },

      // ────────────────────────────────────────────────────────
      // USER SHAPES  (persisted)
      // ────────────────────────────────────────────────────────
      userShapes: {},      // id -> full shape spec (overrides or new shapes)
      hiddenShapes: [],    // list of built-in shape IDs hidden from panel

      saveUserShape: (spec) =>
        set(s => ({ userShapes: { ...s.userShapes, [spec.id]: spec } })),

      deleteUserShape: (id) =>
        set(s => {
          const next = { ...s.userShapes };
          delete next[id];
          return { userShapes: next };
        }),

      resetShapeToDefault: (id) =>
        set(s => {
          const next = { ...s.userShapes };
          delete next[id];
          return { userShapes: next };
        }),

      toggleHideShape: (id) =>
        set(s => ({
          hiddenShapes: s.hiddenShapes.includes(id)
            ? s.hiddenShapes.filter(x => x !== id)
            : [...s.hiddenShapes, id],
        })),

      exportUserStencil: () => {
        const s = get();
        return JSON.stringify({
          _type:      'awb-stencil',
          version:    1,
          exportedAt: new Date().toISOString(),
          userShapes: s.userShapes,
          hiddenShapes: s.hiddenShapes,
        }, null, 2);
      },

      importUserStencil: (json) => {
        try {
          const parsed = JSON.parse(json);
          if (parsed._type !== 'awb-stencil') throw new Error('Wrong type');
          set(s => ({
            userShapes:   { ...s.userShapes, ...(parsed.userShapes || {}) },
            hiddenShapes: [...new Set([...s.hiddenShapes, ...(parsed.hiddenShapes || [])])],
          }));
          return Object.keys(parsed.userShapes || {}).length;
        } catch { return -1; }
      },

      // ────────────────────────────────────────────────────────
      // STORED EXAMPLES  (persisted — seeded from built-ins)
      // ────────────────────────────────────────────────────────
      storedExamples: [],

      initExamples: () => {
        const s = get();
        if (!s.storedExamples || s.storedExamples.length === 0) {
          set({ storedExamples: ALL_EXAMPLES.map(ex => ({ ...ex })) });
        }
      },

      saveExample: (key) => {
        const s = get();
        const snap = {
          nodes:       s.nodes,
          edges:       s.edges,
          diagramName: s.diagramName,
          diagramType: s.diagramType,
          routingStyle: s.routingStyle,
        };
        set({
          storedExamples: s.storedExamples.map(ex =>
            ex.key === key ? { ...ex, data: snap } : ex
          ),
          isDirty: false,
        });
      },

      resetExampleToDefault: (key) => {
        const builtIn = ALL_EXAMPLES.find(ex => ex.key === key);
        if (!builtIn) return;
        set(s => ({
          storedExamples: s.storedExamples.map(ex =>
            ex.key === key ? { ...builtIn } : ex
          ),
        }));
      },

      addExample: (example) =>
        set(s => ({ storedExamples: [...s.storedExamples, example] })),

      deleteExample: (key) =>
        set(s => ({
          storedExamples: s.storedExamples.filter(ex => ex.key !== key),
          currentExampleKey: s.currentExampleKey === key ? null : s.currentExampleKey,
        })),

      reorderExample: (key, direction) =>
        set(s => {
          const arr  = [...s.storedExamples];
          const idx  = arr.findIndex(ex => ex.key === key);
          const newIdx = idx + direction;
          if (newIdx < 0 || newIdx >= arr.length) return {};
          [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
          return { storedExamples: arr };
        }),

      // ────────────────────────────────────────────────────────
      // NODE OPERATIONS
      // ────────────────────────────────────────────────────────
      onNodesChange: (changes) =>
        set(s => {
          const structural = changes.some(c => c.type !== 'select');
          return {
            nodes:   applyNodeChanges(changes, s.nodes),
            isDirty: structural ? true : s.isDirty,
          };
        }),

      onEdgesChange: (changes) =>
        set(s => {
          const structural = changes.some(c => c.type !== 'select');
          return {
            edges:   applyEdgeChanges(changes, s.edges),
            isDirty: structural ? true : s.isDirty,
          };
        }),

      onConnect: (connection) =>
        set(s => ({
          edges: addEdge(
            {
              ...connection, id: uid(), type: 'enterprise',
              data: { connectorType: s.connectionType, label: '', bidirectional: false },
            },
            s.edges
          ),
          isDirty: true,
        })),

      addNode: (shapeType, position) => {
        const allShapes = { ...SHAPES, ...get().userShapes };
        const spec = allShapes[shapeType];
        if (!spec) return;
        const isBoundary = spec.shape === 'boundary' || spec.shape === 'boundary-dashed';
        const isPerson   = spec.shape === 'person' || spec.shape === 'org';
        const id = uid();
        const node = {
          id,
          type: isBoundary ? 'boundary' : isPerson ? 'person' : 'enterprise',
          position,
          data: { shapeType, label: spec.displayName, metadata: { ...DEFAULT_METADATA }, size: null },
          ...(isBoundary ? { style: { width: spec.defaultSize.width, height: spec.defaultSize.height } } : {}),
        };
        set(s => ({ nodes: [...s.nodes, node], selectedNodeId: id, selectedEdgeId: null, isDirty: true }));
      },

      updateNodeLabel: (id, label) =>
        set(s => ({
          nodes:   s.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, label } } : n),
          isDirty: true,
        })),

      updateNodeMetadata: (id, field, value) =>
        set(s => ({
          nodes: s.nodes.map(n =>
            n.id === id ? { ...n, data: { ...n.data, metadata: { ...n.data.metadata, [field]: value } } } : n
          ),
          isDirty: true,
        })),

      updateNodeShapeType: (id, shapeType) => {
        const allShapes = { ...SHAPES, ...get().userShapes };
        const spec = allShapes[shapeType];
        if (!spec) return;
        const isBoundary = spec.shape === 'boundary' || spec.shape === 'boundary-dashed';
        const isPerson   = spec.shape === 'person' || spec.shape === 'org';
        set(s => ({
          nodes: s.nodes.map(n =>
            n.id === id
              ? { ...n, type: isBoundary ? 'boundary' : isPerson ? 'person' : 'enterprise', data: { ...n.data, shapeType } }
              : n
          ),
          isDirty: true,
        }));
      },

      // ── Size controls ──
      updateNodeSize: (id, width, height) =>
        set(s => ({
          nodes: s.nodes.map(n => {
            if (n.id !== id) return n;
            return { ...n, style: { ...n.style, width, height }, data: { ...n.data, size: { width, height } } };
          }),
          isDirty: true,
        })),

      resetNodeSize: (id) =>
        set(s => ({
          nodes: s.nodes.map(n => {
            if (n.id !== id) return n;
            const allShapes = { ...SHAPES, ...get().userShapes };
            const spec = allShapes[n.data.shapeType];
            const w = spec?.defaultSize.width  || 160;
            const h = spec?.defaultSize.height || 100;
            return { ...n, style: { ...n.style, width: w, height: h }, data: { ...n.data, size: null } };
          }),
          isDirty: true,
        })),

      deleteNode: (id) =>
        set(s => ({
          nodes:          s.nodes.filter(n => n.id !== id),
          edges:          s.edges.filter(e => e.source !== id && e.target !== id),
          selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
          isDirty:        true,
        })),

      duplicateNode: (id) =>
        set(s => {
          const node = s.nodes.find(n => n.id === id);
          if (!node) return {};
          const newId = uid();
          return {
            nodes: [...s.nodes, {
              ...node, id: newId,
              position: { x: node.position.x + 40, y: node.position.y + 40 },
              data:     { ...node.data, metadata: { ...node.data.metadata } },
              selected: false,
            }],
            selectedNodeId: newId, selectedEdgeId: null, isDirty: true,
          };
        }),

      // ── Layer / Z-order ──
      bringToFront: (id) =>
        set(s => {
          const maxZ = Math.max(0, ...s.nodes.map(n => n.zIndex || 0));
          return { nodes: s.nodes.map(n => n.id === id ? { ...n, zIndex: maxZ + 1 } : n), isDirty: true };
        }),
      sendToBack: (id) =>
        set(s => {
          const minZ = Math.min(0, ...s.nodes.map(n => n.zIndex || 0));
          return { nodes: s.nodes.map(n => n.id === id ? { ...n, zIndex: minZ - 1 } : n), isDirty: true };
        }),
      bringForward: (id) =>
        set(s => {
          const node = s.nodes.find(n => n.id === id);
          return { nodes: s.nodes.map(n => n.id === id ? { ...n, zIndex: (node?.zIndex || 0) + 1 } : n), isDirty: true };
        }),
      sendBackward: (id) =>
        set(s => {
          const node = s.nodes.find(n => n.id === id);
          return { nodes: s.nodes.map(n => n.id === id ? { ...n, zIndex: (node?.zIndex || 0) - 1 } : n), isDirty: true };
        }),

      // ── Edge operations ──
      updateEdge: (id, field, value) =>
        set(s => ({
          edges:   s.edges.map(e => e.id === id ? { ...e, data: { ...e.data, [field]: value } } : e),
          isDirty: true,
        })),

      reconnectEdge: (oldEdge, newConnection) =>
        set(s => ({
          edges: s.edges.map(e =>
            e.id === oldEdge.id
              ? { ...e, source: newConnection.source, target: newConnection.target,
                  sourceHandle: newConnection.sourceHandle, targetHandle: newConnection.targetHandle }
              : e
          ),
          isDirty: true,
        })),

      updateEdgeWaypoints: (id, waypoints) =>
        set(s => ({
          edges:   s.edges.map(e => e.id === id ? { ...e, data: { ...e.data, waypoints } } : e),
          isDirty: true,
        })),

      deleteEdge: (id) =>
        set(s => ({
          edges:          s.edges.filter(e => e.id !== id),
          selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
          isDirty:        true,
        })),

      // ── Selection ──
      selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
      selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
      clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),

      // ── Diagram meta setters ──
      setDiagramName: (v) => set({ diagramName: v, isDirty: true }),
      setDiagramType: (v) => set({ diagramType: v, isDirty: true }),
      setChangeInitiative: (v) => set({ changeInitiative: v, isDirty: true }),
      setEffectiveDate: (v) => set({ effectiveDate: v, isDirty: true }),

      // ── Canvas settings ──
      setRoutingStyle: (v) => set({ routingStyle: v }),
      setConnectionType: (v) => set({ connectionType: v }),
      setShowLegend: (v) => set({ showLegend: v }),
      setShowMiniMap: (v) => set({ showMiniMap: v }),

      // ── Stencil ──
      setStencilSearch: (v) => set({ stencilSearch: v }),
      setActivePreset: (v) => set({ activePreset: v }),

      // ── Load example ──
      loadExample: (example) => {
        set({
          nodes:             example.nodes,
          edges:             example.edges,
          diagramName:       example.diagramName,
          diagramType:       example.diagramType,
          routingStyle:      example.routingStyle || 'metro',
          selectedNodeId:    null,
          selectedEdgeId:    null,
          changeInitiative:  '',
          effectiveDate:     '',
          currentDiagramId:  null,
          currentExampleKey: example.key || null,
          isDirty:           false,
        });
      },

      // ── I/O (legacy single-diagram) ──
      exportDiagram: () => {
        const { nodes, edges, diagramName, diagramType, effectiveDate, changeInitiative, routingStyle } = get();
        return JSON.stringify(
          { nodes, edges, diagramName, diagramType, effectiveDate, changeInitiative, routingStyle, exportedAt: new Date().toISOString() },
          null, 2
        );
      },

      importDiagram: (json) => {
        try {
          const d = JSON.parse(json);
          set({
            nodes:            d.nodes || [],
            edges:            d.edges || [],
            diagramName:      d.diagramName || 'Imported',
            diagramType:      d.diagramType || '',
            effectiveDate:    d.effectiveDate || '',
            changeInitiative: d.changeInitiative || '',
            routingStyle:     d.routingStyle || 'metro',
            selectedNodeId:   null,
            selectedEdgeId:   null,
            currentDiagramId: null,
            isDirty:          false,
          });
          return true;
        } catch { return false; }
      },

      clearCanvas: () =>
        set({
          nodes: [], edges: [],
          selectedNodeId: null, selectedEdgeId: null,
          currentDiagramId: null, currentExampleKey: null,
          isDirty: false,
        }),
    }),
    {
      name: 'awb-stencil-v1',
      partialize: (s) => ({
        nodes:            s.nodes,
        edges:            s.edges,
        diagramName:      s.diagramName,
        diagramType:      s.diagramType,
        effectiveDate:    s.effectiveDate,
        changeInitiative: s.changeInitiative,
        routingStyle:     s.routingStyle,
        showLegend:       s.showLegend,
        showMiniMap:      s.showMiniMap,
        connectionType:   s.connectionType,
        diagrams:         s.diagrams,
        currentDiagramId: s.currentDiagramId,
        currentExampleKey: s.currentExampleKey,
        userShapes:       s.userShapes,
        hiddenShapes:     s.hiddenShapes,
        storedExamples:   s.storedExamples,
      }),
    }
  )
);

export default useDiagramStore;
