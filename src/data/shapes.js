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
  { id: 'P13', label: 'Security & Identity' },
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

  // ── P01 Foundation — generic geometric building blocks ──
  'ent.foundation.triangle': S(
    'ent.foundation.triangle', 'Triangle', 'P01', 'triangle',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 90, height: 80 }, '△', 'Generic triangle'
  ),
  'ent.foundation.pentagon': S(
    'ent.foundation.pentagon', 'Pentagon', 'P01', 'pentagon',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 90, height: 80 }, '⬠', 'Generic pentagon'
  ),
  'ent.foundation.octagon': S(
    'ent.foundation.octagon', 'Octagon', 'P01', 'octagon',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 90, height: 80 }, '⯃', 'Generic octagon / stop'
  ),
  'ent.foundation.parallelogram': S(
    'ent.foundation.parallelogram', 'Parallelogram', 'P01', 'parallelogram',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 120, height: 60 }, '▱', 'Generic parallelogram'
  ),
  'ent.foundation.star': S(
    'ent.foundation.star', 'Star', 'P01', 'star',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 80, height: 80 }, '★', 'Highlight / emphasis star'
  ),
  'ent.foundation.cross': S(
    'ent.foundation.cross', 'Cross', 'P01', 'cross',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 80, height: 80 }, '✚', 'Cross / plus marker'
  ),
  'ent.foundation.cloud': S(
    'ent.foundation.cloud', 'Cloud', 'P01', 'cloud',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 130, height: 80 }, '☁', 'Generic cloud'
  ),
  'ent.foundation.cube': S(
    'ent.foundation.cube', 'Cube / Box', 'P01', 'cube',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 110, height: 90 }, '⬢', '3D box / artifact'
  ),
  'ent.foundation.chevron': S(
    'ent.foundation.chevron', 'Chevron', 'P01', 'chevron',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 140, height: 50 }, '➤', 'Process step / chevron'
  ),
  'ent.foundation.arrow-right': S(
    'ent.foundation.arrow-right', 'Arrow Right', 'P01', 'arrow-right',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 120, height: 60 }, '→', 'Block arrow right'
  ),
  'ent.foundation.arrow-left': S(
    'ent.foundation.arrow-left', 'Arrow Left', 'P01', 'arrow-left',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 120, height: 60 }, '←', 'Block arrow left'
  ),
  'ent.foundation.arrow-up': S(
    'ent.foundation.arrow-up', 'Arrow Up', 'P01', 'arrow-up',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 60, height: 120 }, '↑', 'Block arrow up'
  ),
  'ent.foundation.arrow-down': S(
    'ent.foundation.arrow-down', 'Arrow Down', 'P01', 'arrow-down',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 60, height: 120 }, '↓', 'Block arrow down'
  ),
  'ent.foundation.arrow-h': S(
    'ent.foundation.arrow-h', 'Arrow Bi-Dir', 'P01', 'arrow-h',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 140, height: 60 }, '↔', 'Bidirectional block arrow'
  ),
  'ent.foundation.callout': S(
    'ent.foundation.callout', 'Callout', 'P12', 'callout',
    { border: '#B0BEC5', fill: '#FFFDE7', text: '#1A1A1A' },
    '', { width: 150, height: 90 }, '💬', 'Speech / callout bubble'
  ),

  // ── P03 Systems — UML structural ──
  'ent.system.component': S(
    'ent.system.component', 'Component', 'P03', 'component',
    { border: '#006064', fill: '#E0F2F1', text: '#1A1A1A' },
    '«component»', { width: 170, height: 90 }, '⬓', 'UML component / module'
  ),
  'ent.system.package': S(
    'ent.system.package', 'Package', 'P03', 'folder',
    { border: '#006064', fill: '#E0F2F1', text: '#1A1A1A' },
    '«package»', { width: 160, height: 100 }, '🗂', 'UML package / namespace'
  ),
  'ent.system.node': S(
    'ent.system.node', 'Node / Device', 'P04', 'cube',
    { border: '#424242', fill: '#ECEFF1', text: '#1A1A1A' },
    '«device»', { width: 150, height: 110 }, '🖳', 'UML deployment node / device'
  ),
  'ent.system.artifact': S(
    'ent.system.artifact', 'Artifact', 'P03', 'document',
    { border: '#5A6678', fill: '#F5F5F5', text: '#1A1A1A' },
    '«artifact»', { width: 140, height: 90 }, '📄', 'Deployable artifact / file'
  ),

  // ── P04 Infrastructure — network & client devices ──
  'ent.infra.cloud': S(
    'ent.infra.cloud', 'Cloud / Internet', 'P04', 'cloud',
    { border: '#1565C0', fill: '#E3F2FD', text: '#1A1A1A' },
    '«cloud»', { width: 150, height: 90 }, '🌐', 'Internet / WAN / cloud boundary'
  ),
  'ent.infra.firewall': S(
    'ent.infra.firewall', 'Firewall', 'P04', 'brick',
    { border: '#B71C1C', fill: '#FFEBEE', text: '#1A1A1A' },
    '«firewall»', { width: 130, height: 80 }, '🧱', 'Network firewall / checkpoint'
  ),
  'ent.infra.router': S(
    'ent.infra.router', 'Router', 'P04', 'circle',
    { border: '#424242', fill: '#ECEFF1', text: '#1A1A1A' },
    '«router»', { width: 80, height: 80 }, '📡', 'Network router'
  ),
  'ent.infra.switch': S(
    'ent.infra.switch', 'Switch', 'P04', 'rect',
    { border: '#424242', fill: '#ECEFF1', text: '#1A1A1A' },
    '«switch»', { width: 140, height: 50 }, '🔀', 'Network switch'
  ),
  'ent.infra.cdn': S(
    'ent.infra.cdn', 'CDN', 'P04', 'hexagon',
    { border: '#1565C0', fill: '#E3F2FD', text: '#1A1A1A' },
    '«cdn»', { width: 130, height: 70 }, '🌍', 'Content delivery network edge'
  ),
  'ent.infra.dns': S(
    'ent.infra.dns', 'DNS', 'P04', 'rounded',
    { border: '#1565C0', fill: '#E3F2FD', text: '#1A1A1A' },
    '«dns»', { width: 120, height: 60 }, '🧭', 'DNS / name resolution'
  ),
  'ent.infra.vpn-gateway': S(
    'ent.infra.vpn-gateway', 'VPN Gateway', 'P04', 'hexagon',
    { border: '#424242', fill: '#ECEFF1', text: '#1A1A1A' },
    '«vpn»', { width: 140, height: 70 }, '🔐', 'VPN / secure tunnel gateway'
  ),
  'ent.infra.desktop': S(
    'ent.infra.desktop', 'Desktop', 'P04', 'display',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '«client»', { width: 120, height: 90 }, '🖥', 'Desktop client workstation'
  ),
  'ent.infra.laptop': S(
    'ent.infra.laptop', 'Laptop', 'P04', 'trapezoid',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '«client»', { width: 130, height: 80 }, '💻', 'Laptop client'
  ),
  'ent.infra.mobile': S(
    'ent.infra.mobile', 'Mobile Device', 'P04', 'rounded',
    { border: '#37474F', fill: '#FFFFFF', text: '#1A1A1A' },
    '«mobile»', { width: 60, height: 110 }, '📱', 'Mobile / tablet client'
  ),

  // ── P08 Process — ANSI flowchart symbols ──
  'ent.process.data-io': S(
    'ent.process.data-io', 'Data (I/O)', 'P08', 'parallelogram',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 150, height: 70 }, '▱', 'Input / output data'
  ),
  'ent.process.document': S(
    'ent.process.document', 'Document', 'P08', 'document',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 150, height: 90 }, '📃', 'Document / report output'
  ),
  'ent.process.multi-document': S(
    'ent.process.multi-document', 'Multi-Document', 'P08', 'multi-document',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 150, height: 90 }, '📚', 'Multiple documents'
  ),
  'ent.process.manual-input': S(
    'ent.process.manual-input', 'Manual Input', 'P08', 'manual-input',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 150, height: 70 }, '⌨', 'Manual data entry'
  ),
  'ent.process.manual-operation': S(
    'ent.process.manual-operation', 'Manual Operation', 'P08', 'trapezoid',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 150, height: 70 }, '✋', 'Manual operation step'
  ),
  'ent.process.display': S(
    'ent.process.display', 'Display', 'P08', 'display',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 150, height: 70 }, '📺', 'Display / output to screen'
  ),
  'ent.process.delay': S(
    'ent.process.delay', 'Delay', 'P08', 'delay',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 130, height: 60 }, '⏳', 'Wait / delay step'
  ),
  'ent.process.predefined': S(
    'ent.process.predefined', 'Predefined Process', 'P08', 'predefined-process',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 160, height: 70 }, '▥', 'Predefined / named sub-routine'
  ),
  'ent.process.stored-data': S(
    'ent.process.stored-data', 'Stored Data', 'P08', 'stored-data',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 130, height: 80 }, '🗃', 'Stored data'
  ),
  'ent.process.preparation': S(
    'ent.process.preparation', 'Preparation', 'P08', 'hexagon',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 150, height: 70 }, '⬡', 'Preparation / setup step'
  ),
  'ent.process.connector-on': S(
    'ent.process.connector-on', 'On-page Connector', 'P08', 'circle',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 44, height: 44 }, '◯', 'On-page reference connector'
  ),
  'ent.process.connector-off': S(
    'ent.process.connector-off', 'Off-page Connector', 'P08', 'offpage',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '', { width: 70, height: 80 }, '⬠', 'Off-page reference connector'
  ),

  // ── P08 Process — BPMN events, gateways & artifacts ──
  'ent.bpmn.event-intermediate': S(
    'ent.bpmn.event-intermediate', 'Intermediate Event', 'P08', 'circle',
    { border: '#EF6C00', fill: '#FFF3E0', text: '#1A1A1A' },
    '', { width: 48, height: 48 }, '◎', 'BPMN intermediate event'
  ),
  'ent.bpmn.event-message': S(
    'ent.bpmn.event-message', 'Message Event', 'P08', 'circle',
    { border: '#EF6C00', fill: '#FFF3E0', text: '#1A1A1A' },
    '✉', { width: 48, height: 48 }, '✉', 'BPMN message event'
  ),
  'ent.bpmn.event-timer': S(
    'ent.bpmn.event-timer', 'Timer Event', 'P08', 'circle',
    { border: '#EF6C00', fill: '#FFF3E0', text: '#1A1A1A' },
    '⏱', { width: 48, height: 48 }, '⏱', 'BPMN timer event'
  ),
  'ent.bpmn.gateway-or': S(
    'ent.bpmn.gateway-or', 'Gateway (OR)', 'P08', 'diamond',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    'O', { width: 60, height: 60 }, '◇', 'BPMN inclusive (OR) gateway'
  ),
  'ent.bpmn.gateway-event': S(
    'ent.bpmn.gateway-event', 'Gateway (Event)', 'P08', 'diamond',
    { border: '#2E7D32', fill: '#F1F8E9', text: '#1A1A1A' },
    '⊙', { width: 60, height: 60 }, '◇', 'BPMN event-based gateway'
  ),
  'ent.bpmn.data-object': S(
    'ent.bpmn.data-object', 'Data Object', 'P08', 'document',
    { border: '#5A6678', fill: '#FAFAFA', text: '#1A1A1A' },
    '', { width: 90, height: 110 }, '📄', 'BPMN data object'
  ),
  'ent.bpmn.data-store': S(
    'ent.bpmn.data-store', 'Data Store', 'P08', 'cylinder',
    { border: '#5A6678', fill: '#FAFAFA', text: '#1A1A1A' },
    '', { width: 90, height: 90 }, '🗄', 'BPMN data store'
  ),
  'ent.bpmn.swimlane': S(
    'ent.bpmn.swimlane', 'Swimlane', 'P07', 'swimlane',
    { border: '#5A6678', fill: '#FAFCFF', text: '#1A3A5C' },
    '«lane»', { width: 600, height: 200 }, '🏊', 'BPMN swimlane (role / system)'
  ),
  'ent.bpmn.pool': S(
    'ent.bpmn.pool', 'Pool', 'P07', 'pool',
    { border: '#37474F', fill: '#FAFAFA', text: '#37474F' },
    '«pool»', { width: 600, height: 320 }, '🟦', 'BPMN pool (participant)'
  ),
  'ent.bpmn.text-annotation': S(
    'ent.bpmn.text-annotation', 'Text Annotation', 'P12', 'note',
    { border: '#B0BEC5', fill: '#FFFFFF', text: '#1A1A1A' },
    '', { width: 160, height: 70 }, '🗒', 'BPMN text annotation'
  ),

  // ── P13 Security & Identity ──
  'ent.security.shield': S(
    'ent.security.shield', 'Security Control', 'P13', 'pentagon',
    { border: '#2E7D32', fill: '#E8F5E9', text: '#1A1A1A' },
    '«control»', { width: 90, height: 100 }, '🛡', 'Security control / guard'
  ),
  'ent.security.key': S(
    'ent.security.key', 'Secret / Key', 'P13', 'rounded',
    { border: '#F9A825', fill: '#FFFDE7', text: '#1A1A1A' },
    '«secret»', { width: 120, height: 60 }, '🔑', 'Secret / API key / credential'
  ),
  'ent.security.vault': S(
    'ent.security.vault', 'Vault', 'P13', 'cylinder',
    { border: '#F9A825', fill: '#FFFDE7', text: '#1A1A1A' },
    '«vault»', { width: 90, height: 100 }, '🔒', 'Secrets vault / key store'
  ),
  'ent.security.certificate': S(
    'ent.security.certificate', 'Certificate', 'P13', 'document',
    { border: '#6A1B9A', fill: '#F3E5F5', text: '#1A1A1A' },
    '«cert»', { width: 140, height: 90 }, '📜', 'TLS / signing certificate'
  ),
  'ent.security.idp': S(
    'ent.security.idp', 'Identity Provider', 'P13', 'hexagon',
    { border: '#6A1B9A', fill: '#F3E5F5', text: '#1A1A1A' },
    '«idp»', { width: 160, height: 80 }, '🆔', 'IdP / IAM / SSO provider'
  ),
  'ent.security.lock': S(
    'ent.security.lock', 'Lock / Policy', 'P13', 'rounded',
    { border: '#B71C1C', fill: '#FFEBEE', text: '#1A1A1A' },
    '«policy»', { width: 120, height: 60 }, '🔏', 'Access policy / lock'
  ),
};

export const SHAPES_LIST = Object.values(SHAPES);

export const SHAPES_BY_PANEL = PANEL_GROUPS.reduce((acc, g) => {
  acc[g.id] = SHAPES_LIST.filter(s => s.panelGroup === g.id);
  return acc;
}, {});
