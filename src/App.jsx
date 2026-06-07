import { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import Toolbar from './components/Toolbar';
import StencilPanel from './components/StencilPanel';
import DiagramCanvas from './components/DiagramCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import StatusBar from './components/StatusBar';
import ModalRenderer from './components/Modal';
import useDiagramStore from './store/store';

export default function App() {
  const initExamples = useDiagramStore(s => s.initExamples);

  // Seed stored examples from built-ins on first run
  useEffect(() => { initExamples(); }, [initExamples]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Toolbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <StencilPanel />
        <ReactFlowProvider>
          <DiagramCanvas />
        </ReactFlowProvider>
        <PropertiesPanel />
      </div>
      <StatusBar />
      {/* Global modal renderer — always on top */}
      <ModalRenderer />
    </div>
  );
}
