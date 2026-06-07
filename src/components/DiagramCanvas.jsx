import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap, useReactFlow,
  BackgroundVariant, ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';

import nodeTypes from '../nodes/nodeTypes';
import edgeTypes from '../edges/edgeTypes';
import { EdgeMarkerDefs } from '../edges/EnterpriseEdge';
import Legend from './Legend';
import ContextMenu from './ContextMenu';
import useDiagramStore from '../store/store';
import { SHAPES } from '../data/shapes';

const DRAG_TYPE = 'application/enterprise-stencil';

function CanvasInner() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [menu, setMenu] = useState(null);

  const nodes           = useDiagramStore(s => s.nodes);
  const edges           = useDiagramStore(s => s.edges);
  const onNodesChange   = useDiagramStore(s => s.onNodesChange);
  const onEdgesChange   = useDiagramStore(s => s.onEdgesChange);
  const onConnect       = useDiagramStore(s => s.onConnect);
  const addNode         = useDiagramStore(s => s.addNode);
  const selectNode      = useDiagramStore(s => s.selectNode);
  const selectEdge      = useDiagramStore(s => s.selectEdge);
  const clearSelection  = useDiagramStore(s => s.clearSelection);
  const reconnectEdge   = useDiagramStore(s => s.reconnectEdge);
  const showMiniMap     = useDiagramStore(s => s.showMiniMap);
  const showLegend      = useDiagramStore(s => s.showLegend);

  const edgeUpdateSuccessful = useRef(true);

  const openMenu = useCallback((e, type, id) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = reactFlowWrapper.current?.getBoundingClientRect();
    setMenu({
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top  || 0),
      containerW: rect?.width  || 1200,
      containerH: rect?.height || 800,
      type, id,
    });
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const shapeType = e.dataTransfer.getData(DRAG_TYPE);
    if (!shapeType) return;
    const spec = SHAPES[shapeType];
    if (!spec) return;
    const position = screenToFlowPosition({
      x: e.clientX - (spec.defaultSize.width / 2),
      y: e.clientY - (spec.defaultSize.height / 2),
    });
    addNode(shapeType, position);
  }, [screenToFlowPosition, addNode]);

  const onNodeClick        = useCallback((_, node) => selectNode(node.id), [selectNode]);
  const onEdgeClick        = useCallback((_, edge) => selectEdge(edge.id), [selectEdge]);
  const onPaneClick        = useCallback(() => { clearSelection(); setMenu(null); }, [clearSelection]);
  const onNodeContextMenu  = useCallback((e, node) => { selectNode(node.id); openMenu(e, 'node', node.id); }, [openMenu, selectNode]);
  const onEdgeContextMenu  = useCallback((e, edge) => { selectEdge(edge.id); openMenu(e, 'edge', edge.id); }, [openMenu, selectEdge]);
  const onPaneContextMenu  = useCallback((e) => { e.preventDefault(); setMenu(null); }, []);

  const onEdgeUpdateStart = useCallback(() => { edgeUpdateSuccessful.current = false; }, []);
  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    reconnectEdge(oldEdge, newConnection);
  }, [reconnectEdge]);
  const onEdgeUpdateEnd = useCallback(() => { edgeUpdateSuccessful.current = true; }, []);

  return (
    <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
      <EdgeMarkerDefs />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        edgesUpdatable={true}
        connectionMode={ConnectionMode.Loose}
        defaultViewport={{ x: 40, y: 40, zoom: 0.85 }}
        minZoom={0.2}
        maxZoom={3}
        snapToGrid
        snapGrid={[8, 8]}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        attributionPosition="bottom-left"
        connectionRadius={20}
        elevateEdgesOnSelect
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#C8D4E0" />
        <Controls style={{ bottom: 36, left: 12 }} showInteractive={false} />
        {showMiniMap && (
          <MiniMap
            style={{ bottom: 36, right: 12 + (showLegend ? 220 : 0), border: '1px solid var(--border)', borderRadius: 6 }}
            nodeColor={n => SHAPES[n.data?.shapeType]?.color?.fill || '#E3EAF3'}
            nodeStrokeColor={n => SHAPES[n.data?.shapeType]?.color?.border || '#5A6678'}
            nodeStrokeWidth={2}
            maskColor="rgba(200,212,224,0.4)"
          />
        )}
      </ReactFlow>

      {/* Legend — absolutely positioned in the wrapper so it can be dragged freely */}
      <Legend />

      {/* Context menu — rendered inside canvas wrapper so position: absolute works */}
      <ContextMenu menu={menu} onClose={() => setMenu(null)} />
    </div>
  );
}

export default function DiagramCanvas() {
  return <CanvasInner />;
}
