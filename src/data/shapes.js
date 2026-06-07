export const PANEL_GROUPS = [
  { id: 'P01', label: 'Foundation' },
  { id: 'P02', label: 'People & Roles' },
  { id: 'P03', label: 'Systems & Applications' },
  { id: 'P04', label: 'Infrastructure & Platform' },
  { id: 'P05', label: 'Data & Storage' },
  { id: 'P06', label: 'Integration & Messaging' },
  { id: 'P07', label: 'Boundaries & Containers' },
  { id: 'P08', label: 'Process & Flow' },
  { id: 'P10', label: 'AI / ML & Agentic' },
  { id: 'P11', label: 'Data Engineering' },
  { id: 'P12', label: 'Annotations' },
];

export const STATUS_COLORS = {
  New: 'var(--status-new)',
  PartialUse: 'var(--status-partial)',
  Decommission: 'var(--status-decommission)',
  Draft: 'var(--status-draft)',
  Stable: 'var(--status-stable)',
};

export const STATUS_FILL_COLORS = {
  New: 'var(--status-new-fill)',
  PartialUse: 'var(--status-partial-fill)',
  Decommission: 'var(--status-decommission-fill)',
  Draft: 'var(--status-draft-fill)',
  Stable: 'var(--status-stable-fill)',
};

// shape: 'rect' | 'rounded' | 'cylinder' | 'hexagon' | 'diamond' | 'circle' | 'person' | 'boundary' | 'note' | 'parallelogram' | 'octagon'
const S = (id, displayName, panelGroup, shape, color, stereotype, defaultSize, icon, description) => ({
  id, displayName, panelGroup, shape, color, stereotype, defaultSize, icon, description,
});

export const SHAPES = {
  // P01 Foundation
  'ent.foundation.rectangle': S(
    'ent.foundation.rectangle', 'Rectangle', 'P01', 'rect',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 120, height: 60 }, '▭', 'Generic rectangle for any purpose'
  ),
  'ent.foundation.rounded': S(
    'ent.foundation.rounded', 'Rounded Rect', 'P01', 'rounded',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 120, height: 60 }, '▢', 'Rounded rectangle — general purpose'
  ),
  'ent.foundation.diamond': S(
    'ent.foundation.diamond', 'Diamond', 'P01', 'diamond',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 80, height: 60 }, '◇', 'Decision / gateway node'
  ),
  'ent.foundation.ellipse': S(
    'ent.foundation.ellipse', 'Ellipse', 'P01', 'ellipse',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 120, height: 70 }, '○', 'Use case, state, general oval'
  ),
  'ent.foundation.note': S(
    'ent.foundation.note', 'Note', 'P12', 'note',
    { border: '#B0BEC5', fill: '#FFFDE7', text: '#1A1A1A' },
    '', { width: 150, height: 80 }, '📝', 'Annotation note'
  ),

  // P02 People
  'ent.people.person': S(
    'ent.people.person', 'Person', 'P02', 'person',
    { border: '#1A3A5C', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 60, height: 90 }, '👤', 'Human actor'
  ),
  'ent.people.system-actor': S(
    'ent.people.system-actor', 'System Actor', 'P02', 'person',
    { border: '#5A6678', fill: '#FFFFFF', text: '#1A1A1A' },
    '«system»', { width: 60, height: 90 }, '🤖', 'Automated system acting as actor'
  ),
  'ent.people.organisation': S(
    'ent.people.organisation', 'Organisation', 'P02', 'org',
    { border: '#1A3A5C', fill: '#FFFFFF', text: '#1A1A1A' },
    '«org»', { width: 80, height: 90 }, '👥', 'Team or department'
  ),

  // P03 Systems
  'ent.system.microservice': S(
    'ent.system.microservice', 'Microservice', 'P03', 'rounded',
    { border: '#006064', fill: '#E0F2F1', text: '#1A1A1A' },
    '«microservice»', { width: 170, height: 84 }, '⬡', 'Independently deployable bounded-context service'
  ),
  'ent.system.monolith': S(
    'ent.system.monolith', 'Monolith', 'P03', 'rect',
    { border: '#37474F', fill: '#ECEFF1', text: '#1A1A1A' },
    '«monolith»', { width: 170, height: 84 }, '▦', 'Single deployable unit with multiple capabilities'
  ),
  'ent.system.external': S(
    'ent.system.external', 'External System', 'P03', 'rect-dashed',
    { border: '#5D4037', fill: '#EFEBE9', text: '#1A1A1A' },
    '«external»', { width: 170, height: 84 }, '🔗', 'Third-party or out-of-scope system'
  ),
  'ent.system.saas': S(
    'ent.system.saas', 'SaaS Application', 'P03', 'rounded-dashed',
    { border: '#5D4037', fill: '#EFEBE9', text: '#1A1A1A' },
    '«saas»', { width: 170, height: 84 }, '☁', 'Vendor-managed cloud application'
  ),
  'ent.system.ui': S(
    'ent.system.ui', 'UI / Frontend', 'P03', 'rounded',
    { border: '#006064', fill: '#E0F2F1', text: '#1A1A1A' },
    '«ui»', { width: 170, height: 84 }, '🖥', 'Web or native frontend application'
  ),
  'ent.system.api-gateway': S(
    'ent.system.api-gateway', 'API Gateway', 'P03', 'hexagon',
    { border: '#006064', fill: '#E0F2F1', text: '#1A1A1A' },
    '«api-gateway»', { width: 150, height: 84 }, '⬡', 'API routing and policy enforcement'
  ),
  'ent.system.batch-job': S(
    'ent.system.batch-job', 'Batch Job', 'P03', 'rect-striped',
    { border: '#37474F', fill: '#F5F5F5', text: '#1A1A1A' },
    '«batch»', { width: 170, height: 84 }, '⏱', 'Scheduled bulk processing job'
  ),
  'ent.system.library': S(
    'ent.system.library', 'Library / SDK', 'P03', 'rect',
    { border: '#5A6678', fill: '#F5F5F5', text: '#1A1A1A' },
    '«library»', { width: 150, height: 70 }, '📚', 'Shared code library or SDK'
  ),

  // P04 Infrastructure
  'ent.infra.server': S(
    'ent.infra.server', 'Server', 'P04', 'rect',
    { border: '#424242', fill: '#E0E0E0', text: '#1A1A1A' },
    '«server»', { width: 150, height: 80 }, '🖧', 'Physical or virtual server node'
  ),
  'ent.infra.container': S(
    'ent.infra.container', 'Container', 'P04', 'rect-notched',
    { border: '#424242', fill: '#F0F4F8', text: '#1A1A1A' },
    '«container»', { width: 150, height: 70 }, '📦', 'OCI/Docker container instance'
  ),
  'ent.infra.serverless': S(
    'ent.infra.serverless', 'Serverless Fn', 'P04', 'rounded-dashed',
    { border: '#424242', fill: '#F5F5F5', text: '#1A1A1A' },
    '«serverless»', { width: 150, height: 70 }, '⚡', 'FaaS / serverless function'
  ),
  'ent.infra.load-balancer': S(
    'ent.infra.load-balancer', 'Load Balancer', 'P04', 'rect',
    { border: '#424242', fill: '#ECEFF1', text: '#1A1A1A' },
    '«LB»', { width: 130, height: 60 }, '⚖', 'Traffic distribution layer'
  ),

  // P05 Data
  'ent.data.database': S(
    'ent.data.database', 'Database', 'P05', 'cylinder',
    { border: '#1565C0', fill: '#E3F2FD', text: '#1A1A1A' },
    '«database»', { width: 90, height: 100 }, '🗄', 'Persistent relational or NoSQL store'
  ),
  'ent.data.cache': S(
    'ent.data.cache', 'Cache', 'P05', 'cylinder',
    { border: '#1565C0', fill: '#E8EAF6', text: '#1A1A1A' },
    '«cache»', { width: 90, height: 90 }, '⚡', 'In-memory ephemeral store'
  ),
  'ent.data.object-store': S(
    'ent.data.object-store', 'Object Storage', 'P05', 'cylinder',
    { border: '#1565C0', fill: '#E3F2FD', text: '#1A1A1A' },
    '«object-store»', { width: 90, height: 90 }, '🪣', 'Blob / object storage bucket'
  ),
  'ent.data.data-warehouse': S(
    'ent.data.data-warehouse', 'Data Warehouse', 'P05', 'cylinder-wide',
    { border: '#1565C0', fill: '#E3F2FD', text: '#1A1A1A' },
    '«data-warehouse»', { width: 140, height: 70 }, '🏛', 'Analytical data warehouse'
  ),
  'ent.data.search': S(
    'ent.data.search', 'Search Index', 'P05', 'cylinder',
    { border: '#1565C0', fill: '#EDE7F6', text: '#1A1A1A' },
    '«search»', { width: 90, height: 90 }, '🔍', 'Full-text / vector search index'
  ),

  // P06 Integration
  'ent.integration.message-broker': S(
    'ent.integration.message-broker', 'Message Broker', 'P06', 'rect-queue',
    { border: '#00695C', fill: '#E0F2F1', text: '#1A1A1A' },
    '«message-broker»', { width: 170, height: 70 }, '📨', 'Kafka, RabbitMQ, or generic broker'
  ),
  'ent.integration.event-stream': S(
    'ent.integration.event-stream', 'Event Stream', 'P06', 'parallelogram',
    { border: '#00695C', fill: '#E0F2F1', text: '#1A1A1A' },
    '«topic»', { width: 150, height: 60 }, '🌊', 'Named event stream / Kafka topic'
  ),
  'ent.integration.queue': S(
    'ent.integration.queue', 'Message Queue', 'P06', 'rect-queue',
    { border: '#00695C', fill: '#E0F7FA', text: '#1A1A1A' },
    '«queue»', { width: 150, height: 60 }, '📬', 'Point-to-point message queue'
  ),
  'ent.integration.api': S(
    'ent.integration.api', 'API Endpoint', 'P06', 'hexagon',
    { border: '#006064', fill: '#E0F2F1', text: '#1A1A1A' },
    '«API»', { width: 140, height: 70 }, '🔌', 'REST or gRPC API endpoint'
  ),

  // P07 Boundaries
  'ent.boundary.system': S(
    'ent.boundary.system', 'System Boundary', 'P07', 'boundary',
    { border: '#90A4AE', fill: '#F5F7F9', text: '#1A3A5C' },
    '«system»', { width: 400, height: 300 }, '⬜', 'C4 system context boundary'
  ),
  'ent.boundary.container': S(
    'ent.boundary.container', 'Container Boundary', 'P07', 'boundary-dashed',
    { border: '#B0BEC5', fill: '#FAFAFA', text: '#37474F' },
    '«container»', { width: 350, height: 250 }, '⬜', 'C4 container grouping boundary'
  ),
  'ent.boundary.deployment': S(
    'ent.boundary.deployment', 'Deployment Env', 'P07', 'boundary',
    { border: '#424242', fill: '#FAFAFA', text: '#424242' },
    '«environment»', { width: 400, height: 300 }, '🌐', 'Production / staging environment'
  ),

  // P08 Process
  'ent.process.start': S(
    'ent.process.start', 'Start Event', 'P08', 'circle',
    { border: '#2E7D32', fill: '#E8F5E9', text: '#1A1A1A' },
    '', { width: 40, height: 40 }, '●', 'Process start event'
  ),
  'ent.process.end': S(
    'ent.process.end', 'End Event', 'P08', 'circle-thick',
    { border: '#2E7D32', fill: '#E8F5E9', text: '#1A1A1A' },
    '', { width: 40, height: 40 }, '⊛', 'Process end event'
  ),
  'ent.process.task': S(
    'ent.process.task', 'Task', 'P08', 'rounded',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 150, height: 70 }, '▣', 'Process task or activity'
  ),
  'ent.process.gateway-xor': S(
    'ent.process.gateway-xor', 'Gateway (XOR)', 'P08', 'diamond',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    'X', { width: 60, height: 60 }, '⊗', 'Exclusive gateway — one path taken'
  ),
  'ent.process.gateway-and': S(
    'ent.process.gateway-and', 'Gateway (AND)', 'P08', 'diamond',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '+', { width: 60, height: 60 }, '⊕', 'Parallel gateway — all paths taken'
  ),
  'ent.process.subprocess': S(
    'ent.process.subprocess', 'Sub-Process', 'P08', 'rounded',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '[+]', { width: 180, height: 80 }, '▣', 'Collapsible sub-process'
  ),

  // P10 AI/ML
  'ent.aiml.model': S(
    'ent.aiml.model', 'ML Model', 'P10', 'hexagon',
    { border: '#6A1B9A', fill: '#F3E5F5', text: '#1A1A1A' },
    '«model»', { width: 150, height: 100 }, '🧠', 'Trained ML / AI model'
  ),
  'ent.aiml.agent': S(
    'ent.aiml.agent', 'AI Agent', 'P10', 'hexagon',
    { border: '#6A1B9A', fill: '#F3E5F5', text: '#1A1A1A' },
    '«agent»', { width: 160, height: 100 }, '🤖', 'Autonomous AI agent with tools and memory'
  ),
  'ent.aiml.tool': S(
    'ent.aiml.tool', 'Agent Tool', 'P10', 'rounded-dashed',
    { border: '#6A1B9A', fill: '#F3E5F5', text: '#1A1A1A' },
    '«tool»', { width: 140, height: 70 }, '🔧', 'Tool/function callable by an agent'
  ),
  'ent.aiml.orchestrator': S(
    'ent.aiml.orchestrator', 'Orchestrator', 'P10', 'rounded',
    { border: '#6A1B9A', fill: '#F3E5F5', text: '#1A1A1A' },
    '«orchestrator»', { width: 170, height: 84 }, '🎭', 'Agent orchestration / routing layer'
  ),
  'ent.aiml.vector-db': S(
    'ent.aiml.vector-db', 'Vector DB', 'P10', 'cylinder',
    { border: '#6A1B9A', fill: '#EDE7F6', text: '#1A1A1A' },
    '«vector-db»', { width: 90, height: 90 }, '⟨v⟩', 'Vector embedding store for RAG'
  ),
  'ent.aiml.llm-gateway': S(
    'ent.aiml.llm-gateway', 'LLM Gateway', 'P10', 'hexagon',
    { border: '#6A1B9A', fill: '#F3E5F5', text: '#1A1A1A' },
    '«llm-gateway»', { width: 150, height: 80 }, '⟨LLM⟩', 'Routing proxy for LLM providers'
  ),

  // P11 Data Engineering
  'ent.dataeng.notebook': S(
    'ent.dataeng.notebook', 'Notebook', 'P11', 'note',
    { border: '#1565C0', fill: '#E3F2FD', text: '#1A1A1A' },
    '«notebook»', { width: 160, height: 90 }, '📓', 'Databricks / Jupyter notebook'
  ),
  'ent.dataeng.delta-table': S(
    'ent.dataeng.delta-table', 'Delta Table', 'P11', 'cylinder',
    { border: '#1565C0', fill: '#E3F2FD', text: '#1A1A1A' },
    '«delta-table»', { width: 90, height: 90 }, 'Δ', 'Delta Lake table'
  ),
  'ent.dataeng.etl-job': S(
    'ent.dataeng.etl-job', 'ETL / ELT Job', 'P11', 'rounded',
    { border: '#1565C0', fill: '#E3F2FD', text: '#1A1A1A' },
    '«etl»', { width: 170, height: 80 }, '⇄', 'Scheduled data transformation job'
  ),
  'ent.dataeng.stream-processor': S(
    'ent.dataeng.stream-processor', 'Stream Processor', 'P11', 'rounded',
    { border: '#00695C', fill: '#E0F7FA', text: '#1A1A1A' },
    '«stream-proc»', { width: 170, height: 80 }, '〜', 'Real-time stream processing engine'
  ),
};

export const SHAPES_LIST = Object.values(SHAPES);

export const SHAPES_BY_PANEL = PANEL_GROUPS.reduce((acc, g) => {
  acc[g.id] = SHAPES_LIST.filter(s => s.panelGroup === g.id);
  return acc;
}, {});
