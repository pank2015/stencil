// ─────────────────────────────────────────────────────────────────────────────
// Agentic System – reference diagrams (C1 → C3, Flow, ERD, Deployment, etc.)
// ─────────────────────────────────────────────────────────────────────────────

const m = (partial = {}) => ({
  systemCode: '', systemId: '', ownerTeam: '', lifecycleStatus: 'Stable',
  changeInitiatives: [], complianceFlags: [], techStack: [], tags: [],
  description: '', version: '', scalabilityPattern: '', slaTier: '',
  apiSpecRef: '', repositoryUrl: '', reviewStatus: '',
  ...partial,
});

const e = (id, src, tgt, connectorType, label, extra = {}) => ({
  id, source: src, target: tgt, type: 'enterprise',
  data: { connectorType, label, bidirectional: false, ...extra },
});

const n = (id, type, x, y, shapeType, label, w, h, meta = {}) => ({
  id, type, position: { x, y },
  data: { shapeType, label, metadata: m(meta), size: null },
  ...(w ? { style: { width: w, height: h || w } } : {}),
});

// ─── 1. C1 – Agentic System Context ───────────────────────────────────────
export const C1_EXAMPLE = {
  diagramName: 'Agentic System — C1 System Context',
  diagramType: 'C1 System Context',
  routingStyle: 'metro',
  nodes: [
    n('user',       'person',     60,  260, 'ent.people.person',       'End User',                 null, null, { description: 'Submits natural language tasks and queries.' }),
    n('agent',      'enterprise', 320, 220, 'ent.system.microservice',  'Agentic System',           200, 120, { systemCode: 'AGT-001', ownerTeam: 'AI Platform', lifecycleStatus: 'New', description: 'Reasons through steps and executes tools to achieve goals.' }),
    n('ext_apis',   'enterprise', 640, 100, 'ent.system.external',      'External APIs / Tools',    180,  90, { systemCode: 'EXT-001', description: 'Third-party services: Search, Weather, CRM.' }),
    n('vector_db',  'enterprise', 640, 360, 'ent.data.database',        'Knowledge Base / Vector DB',180, 90, { systemCode: 'VDB-001', techStack: ['pgvector', 'Pinecone'], description: 'Long-term memory and RAG document embeddings.' }),
  ],
  edges: [
    e('e1', 'user',     'agent',    'conn.sync.rest',  'Submits tasks / Receives answers · HTTPS/WSS'),
    e('e2', 'agent',    'ext_apis', 'conn.sync.rest',  'Executes API calls · REST/JSON'),
    e('e3', 'agent',    'vector_db','conn.sync.grpc',  'Queries context / Stores memory · gRPC', { bidirectional: true }),
  ],
};

// ─── 2. C2 – Container Diagram ────────────────────────────────────────────
export const C2_EXAMPLE = {
  diagramName: 'Agentic System — C2 Container',
  diagramType: 'C2 Container',
  routingStyle: 'orthogonal',
  nodes: [
    n('bnd',    'boundary',  220,  60,  'ent.boundary.system',     'Agentic System Boundary', 700, 520),
    n('user',   'person',     50, 300,  'ent.people.person',       'User'),
    n('ui',     'enterprise', 290, 160, 'ent.system.ui',           'User Interface\n(React / Next.js)',    180,  90, { systemCode: 'UI-001',  techStack: ['React', 'Next.js'] }),
    n('apigw',  'enterprise', 290, 330, 'ent.system.api-gateway',  'API Gateway\n(FastAPI / Node.js)',     180,  90, { systemCode: 'GW-001',  techStack: ['FastAPI'] }),
    n('core',   'enterprise', 550, 200, 'ent.system.microservice', 'Agent Core Engine\n(Python/LangChain)',200, 110, { systemCode: 'AGT-CORE', techStack: ['Python', 'LangChain'], lifecycleStatus: 'New' }),
    n('mem',    'enterprise', 550, 390, 'ent.data.cache',          'Short-Term Memory\n(Redis)',            180,  80, { systemCode: 'MEM-001', techStack: ['Redis'] }),
    n('llm',    'enterprise', 1020,180, 'ent.system.saas',         'LLM Provider\n(OpenAI / Anthropic)',   200,  90, { systemCode: 'LLM-001' }),
    n('tools',  'enterprise', 1020,380, 'ent.system.external',     'External Tools\n(Search / DB APIs)',   200,  90, { systemCode: 'EXT-001' }),
  ],
  edges: [
    e('e1', 'user',  'ui',    'conn.sync.rest',  'Uses · HTTPS'),
    e('e2', 'ui',    'apigw', 'conn.sync.rest',  'Sends queries · WebSocket/REST'),
    e('e3', 'apigw', 'core',  'conn.sync.grpc',  'Dispatches task · gRPC/Internal'),
    e('e4', 'core',  'mem',   'conn.data.db-read','Reads/Writes state · In-memory', { bidirectional: true }),
    e('e5', 'core',  'llm',   'conn.sync.rest',  'Prompt + history for reasoning · HTTPS'),
    e('e6', 'core',  'tools', 'conn.arch.agent-tool', 'Invokes functional tools · REST'),
  ],
};

// ─── 3. C3 – Component: Agent Core Engine ─────────────────────────────────
export const C3_EXAMPLE = {
  diagramName: 'Agentic System — C3 Agent Core Components',
  diagramType: 'C3 Component',
  routingStyle: 'orthogonal',
  nodes: [
    n('apigw',  'enterprise',  50, 230, 'ent.system.api-gateway',  'API Gateway\n(FastAPI)',          160,  80, { systemCode: 'GW-001' }),
    n('mem',    'enterprise',  50, 400, 'ent.data.cache',           'Short-Term Memory\n(Redis)',      160,  80, { systemCode: 'MEM-001' }),
    n('bnd',    'boundary',   290,  60, 'ent.boundary.container',   'Agent Core Engine',               660, 520),
    n('orch',   'enterprise', 360, 170, 'ent.system.microservice',  'Agent Orchestrator\n(Python)',    180,  90, { systemCode: 'ORC-001', description: 'Coordinates execution loop and maintains system prompt.' }),
    n('prompt', 'enterprise', 620, 170, 'ent.system.library',       'Prompt Factory\n(Python Module)',180,  90, { systemCode: 'PRM-001', description: 'Injects history, state, and tool schemas.' }),
    n('parser', 'enterprise', 620, 380, 'ent.system.api',           'Output Parser\n(Regex/Pydantic)',180,  90, { systemCode: 'PAR-001', description: 'Parses LLM output into structured Actions.' }),
    n('toolex', 'enterprise', 360, 380, 'ent.system.microservice',  'Tool Registry\n& Executor',       180,  90, { systemCode: 'TRE-001', description: 'Maps LLM actions to executable code or APIs.' }),
    n('llm',    'enterprise', 1060,270, 'ent.system.saas',          'LLM API\n(External)',             180,  90, { systemCode: 'LLM-001' }),
  ],
  edges: [
    e('e1', 'apigw',  'orch',   'conn.sync.rest',  'Triggers task'),
    e('e2', 'orch',   'mem',    'conn.data.db-read','Fetches chat history'),
    e('e3', 'orch',   'prompt', 'conn.arch.uses',   'Requests compiled prompt'),
    e('e4', 'prompt', 'llm',    'conn.sync.rest',   'Sends finalized payload · HTTPS'),
    e('e5', 'llm',    'parser', 'conn.sync.rest',   'Returns raw completion'),
    e('e6', 'parser', 'orch',   'conn.arch.uses',   'Returns parsed Thought/Action'),
    e('e7', 'orch',   'toolex', 'conn.arch.agent-tool', 'Invokes tool if Action detected'),
  ],
};

// ─── 4. ReAct Reasoning Loop (Flow LR) ────────────────────────────────────
export const REACT_FLOW_EXAMPLE = {
  diagramName: 'Agentic ReAct — Reasoning Loop',
  diagramType: 'Process / Flow',
  routingStyle: 'orthogonal',
  nodes: [
    // Input Layer (boundary)
    n('bnd_in',   'boundary',    30,  60, 'ent.boundary.container',  'Input Layer',           260, 300),
    n('prompt_in','enterprise', 100, 160, 'ent.foundation.rounded',  'User Prompt',           140,  60),
    n('intent',   'enterprise', 100, 280, 'ent.system.microservice', 'Intent Classifier',     140,  60),
    // Reasoning Loop (boundary)
    n('bnd_re',   'boundary',   340,  60, 'ent.boundary.container',  'Reasoning Loop (ReAct)', 480, 540),
    n('state',    'enterprise', 400, 160, 'ent.data.cache',          'State Manager',          160,  70),
    n('assembly', 'enterprise', 400, 300, 'ent.foundation.rounded',  'Prompt Assembly',        160,  70),
    n('llm_inf',  'enterprise', 400, 440, 'ent.system.saas',         'LLM Inference',          160,  70),
    n('parse_out','enterprise', 620, 300, 'ent.foundation.diamond',  'Parse Output',           100,  80),
    n('resp_gen', 'enterprise', 620, 160, 'ent.foundation.rounded',  'Response Generator',     160,  70),
    n('tool_disp','enterprise', 620, 460, 'ent.system.microservice', 'Tool Dispatcher',        160,  70),
    // Execution Layer (boundary)
    n('bnd_ex',   'boundary',   880,  60, 'ent.boundary.container',  'Execution Layer',        240, 540),
    n('web_s',    'enterprise', 930, 180, 'ent.system.external',     'Web Search',             160,  70),
    n('db_q',     'enterprise', 930, 310, 'ent.system.external',     'DB Query',               160,  70),
    n('vec_r',    'enterprise', 930, 440, 'ent.data.database',       'Vector Retrieval',       160,  70),
    n('obs_col',  'enterprise', 930, 560, 'ent.foundation.rounded',  'Observation Collector',  160,  70),
    // Output
    n('ui_resp',  'enterprise',1200, 160, 'ent.system.ui',           'User UI Response',       180,  80),
  ],
  edges: [
    e('e1',  'prompt_in', 'intent',   'conn.arch.uses',   ''),
    e('e2',  'intent',    'state',    'conn.arch.uses',   ''),
    e('e3',  'state',     'assembly', 'conn.arch.uses',   ''),
    e('e4',  'assembly',  'llm_inf',  'conn.sync.rest',   ''),
    e('e5',  'llm_inf',   'parse_out','conn.arch.uses',   ''),
    e('e6',  'parse_out', 'resp_gen', 'conn.arch.uses',   'Thought / Final Answer'),
    e('e7',  'parse_out', 'tool_disp','conn.arch.uses',   'Action Required'),
    e('e8',  'tool_disp', 'web_s',    'conn.arch.agent-tool',''),
    e('e9',  'tool_disp', 'db_q',     'conn.arch.agent-tool',''),
    e('e10', 'tool_disp', 'vec_r',    'conn.arch.agent-tool',''),
    e('e11', 'web_s',     'obs_col',  'conn.arch.uses',   ''),
    e('e12', 'db_q',      'obs_col',  'conn.arch.uses',   ''),
    e('e13', 'vec_r',     'obs_col',  'conn.arch.uses',   ''),
    e('e14', 'obs_col',   'state',    'conn.arch.uses',   'Observation feedback'),
    e('e15', 'resp_gen',  'ui_resp',  'conn.sync.rest',   ''),
  ],
};

// ─── 5. Agent Execution Flowchart (TD) ────────────────────────────────────
export const FLOW_EXAMPLE = {
  diagramName: 'Agent Execution — Step-by-Step Flow',
  diagramType: 'Process / Flow',
  routingStyle: 'orthogonal',
  nodes: [
    n('start', 'enterprise', 300,  30, 'ent.process.start', 'Start', 60, 60),
    n('init',     'enterprise', 260, 140, 'ent.foundation.rounded',     'Initialize Agent\nState & History', 160, 70),
    n('loop',     'enterprise', 260, 270, 'ent.foundation.rounded',     'Assemble Prompt\n(History + Tools)',160, 70),
    n('llm',      'enterprise', 260, 400, 'ent.system.saas',            'Invoke LLM',        160,  70),
    n('parse',    'enterprise', 260, 530, 'ent.foundation.diamond',     'Parse LLM Output',  120,  80),
    n('exec',     'enterprise',  60, 660, 'ent.system.microservice',    'Identify & Execute\nTool', 160, 80),
    n('obs',      'enterprise',  60, 790, 'ent.foundation.rounded',     'Capture Tool\nObservation', 160, 70),
    n('append',   'enterprise',  60, 920, 'ent.foundation.rounded',     'Append to\nAgent State',   160, 70),
    n('final',    'enterprise', 460, 660, 'ent.foundation.rounded',     'Format Final\nResponse',   160, 70),
    n('fallback', 'enterprise', 460, 790, 'ent.foundation.rounded',     'Fallback / Ask\nClarification', 160, 70),
    n('end',      'enterprise', 300, 920, 'ent.process.end','End',               60,  60),
  ],
  edges: [
    e('e1',  'start',    'init',     'conn.flow.sequence', ''),
    e('e2',  'init',     'loop',     'conn.flow.sequence', ''),
    e('e3',  'loop',     'llm',      'conn.sync.rest',     ''),
    e('e4',  'llm',      'parse',    'conn.arch.uses',     ''),
    e('e5',  'parse',    'exec',     'conn.arch.uses',     'Has Action'),
    e('e6',  'parse',    'final',    'conn.arch.uses',     'Final Answer'),
    e('e7',  'parse',    'fallback', 'conn.arch.uses',     'Error'),
    e('e8',  'exec',     'obs',      'conn.arch.uses',     ''),
    e('e9',  'obs',      'append',   'conn.arch.uses',     ''),
    e('e10', 'append',   'loop',     'conn.arch.uses',     'Next iteration', { waypoints: [{ x: 40, y: 955 }, { x: 40, y: 305 }] }),
    e('e11', 'final',    'end',      'conn.flow.sequence', ''),
    e('e12', 'fallback', 'end',      'conn.flow.sequence', ''),
  ],
};

// ─── 6. Sequence Diagram (as participant flow) ────────────────────────────
export const SEQUENCE_EXAMPLE = {
  diagramName: 'Agent Sequence — Weather Query',
  diagramType: 'Sequence',
  routingStyle: 'orthogonal',
  nodes: [
    n('user',  'person',     50, 200, 'ent.people.person',       'User'),
    n('ui',    'enterprise', 220, 200,'ent.system.ui',            'Web Client',           140,  80, { systemCode: 'UI-001' }),
    n('api',   'enterprise', 440, 200,'ent.system.api-gateway',   'API Gateway',          140,  80, { systemCode: 'GW-001' }),
    n('core',  'enterprise', 660, 200,'ent.system.microservice',  'Agent Core',           140,  80, { systemCode: 'AGT-CORE' }),
    n('llm',   'enterprise', 880, 200,'ent.system.saas',          'LLM Provider',         160,  80, { systemCode: 'LLM-001' }),
    n('tools', 'enterprise',1100, 200,'ent.system.external',      'Tool Registry',        160,  80, { systemCode: 'TRE-001' }),

    // Step annotations
    n('s1', 'enterprise', 280, 380, 'ent.foundation.note', '1. User submits:\n"Check weather in London and log it"', 260, 60),
    n('s2', 'enterprise', 560, 480, 'ent.foundation.note', '2. LLM decides:\nAction: GetWeather(London)', 260, 60),
    n('s3', 'enterprise', 560, 580, 'ent.foundation.note', '3. Obs: Rainy, 14°C\nAction: LogToDB', 260, 60),
    n('s4', 'enterprise', 560, 680, 'ent.foundation.note', '4. Final Answer:\nWeather logged successfully.', 260, 60),
  ],
  edges: [
    e('e1', 'user',  'ui',    'conn.sync.rest', 'Types query'),
    e('e2', 'ui',    'api',   'conn.sync.rest', 'POST /agent/run'),
    e('e3', 'api',   'core',  'conn.sync.grpc', 'Instantiate context'),
    e('e4', 'core',  'llm',   'conn.sync.rest', '① Prompt + tool schema'),
    e('e5', 'llm',   'core',  'conn.arch.uses', 'Action: GetWeather(London)'),
    e('e6', 'core',  'tools', 'conn.arch.agent-tool', 'Call GetWeather'),
    e('e7', 'tools', 'core',  'conn.arch.uses', 'Obs: Rainy, 14°C'),
    e('e8', 'core',  'llm',   'conn.sync.rest', '② Context + Observation'),
    e('e9', 'llm',   'core',  'conn.arch.uses', 'Action: LogToDB'),
    e('e10','core',  'tools', 'conn.arch.agent-tool', 'Call LogToDB'),
    e('e11','tools', 'core',  'conn.arch.uses', 'Success (ID: 102)'),
    e('e12','core',  'llm',   'conn.sync.rest', '③ Final context'),
    e('e13','llm',   'core',  'conn.arch.uses', 'Final Answer'),
    e('e14','core',  'api',   'conn.sync.rest', 'Return payload'),
    e('e15','api',   'ui',    'conn.sync.rest', 'Render response'),
    e('e16','ui',    'user',  'conn.sync.rest', 'Display answer'),
  ],
};

// ─── 7. ERD – Agent Data Model ────────────────────────────────────────────
export const ERD_EXAMPLE = {
  diagramName: 'Agentic System — Data Model (ERD)',
  diagramType: 'ERD / Data Model',
  routingStyle: 'orthogonal',
  nodes: [
    n('USER',   'enterprise',  60, 280, 'ent.foundation.rectangle',   'USER\n─────\nid PK\nemail\ncreated_at',           180, 120, { systemCode: 'TBL-USR' }),
    n('SESSION','enterprise', 340, 120, 'ent.foundation.rectangle',   'SESSION\n─────\nid PK\nuser_id FK\ntitle\nupdated_at', 180, 120, { systemCode: 'TBL-SES' }),
    n('MESSAGE','enterprise', 620, 280, 'ent.foundation.rectangle',   'MESSAGE\n─────\nid PK\nsession_id FK\nrole\ncontent\ncreated_at', 180, 130, { systemCode: 'TBL-MSG' }),
    n('RUN',    'enterprise', 620, 520, 'ent.foundation.rectangle',   'AGENT_RUN\n─────\nid PK\nmessage_id FK\nstatus\ntotal_tokens_used', 180, 120, { systemCode: 'TBL-RUN' }),
    n('STEP',   'enterprise', 920, 400, 'ent.foundation.rectangle',   'TRAJECTORY_STEP\n─────\nid PK\nrun_id FK\nstep_number\nthought\naction_tool\nobservation', 200, 150, { systemCode: 'TBL-STP' }),
  ],
  edges: [
    e('e1', 'USER',    'SESSION', 'conn.uml.composition', '1 creates 0..*'),
    e('e2', 'SESSION', 'MESSAGE', 'conn.uml.composition', '1 contains 0..*'),
    e('e3', 'MESSAGE', 'RUN',     'conn.uml.composition', '1 triggers 0..*'),
    e('e4', 'RUN',     'STEP',    'conn.uml.composition', '1 executes 1..*'),
  ],
};

// ─── 8. Deployment – Cloud Infrastructure ────────────────────────────────
export const DEPLOYMENT_EXAMPLE = {
  diagramName: 'Agentic System — Cloud Deployment',
  diagramType: 'Deployment',
  routingStyle: 'orthogonal',
  nodes: [
    // Internet zone
    n('bnd_client', 'boundary',  30,  30, 'ent.boundary.system',    'Internet / Client',     200, 160),
    n('browser',    'enterprise',70, 110, 'ent.system.ui',           'Browser\n(SPA - HTTPS)',160,  70, { techStack: ['React'] }),

    // VPC
    n('bnd_vpc',    'boundary', 280,  30, 'ent.boundary.system',    'Cloud VPC',             760, 620),

    // Public subnet
    n('bnd_pub',    'boundary', 320,  90, 'ent.boundary.container', 'Public Subnet',         200, 120),
    n('alb',        'enterprise',360, 140, 'ent.system.api-gateway', 'Load Balancer\n(ALB)',  160,  60, { systemCode: 'ALB-001' }),

    // App subnet
    n('bnd_app',    'boundary', 320, 260, 'ent.boundary.container', 'Private App Subnet',    680, 200),
    n('api_pod',    'enterprise',380, 320, 'ent.system.microservice','API Pods\n(FastAPI/ECS)',200, 100, { systemCode: 'API-POD', techStack: ['FastAPI', 'ECS'] }),
    n('worker_pod', 'enterprise',640, 320, 'ent.system.microservice','Agent Worker Pods\n(Celery/ECS)',200,100, { systemCode: 'WKR-POD', techStack: ['Celery', 'ECS'] }),

    // Data subnet
    n('bnd_data',   'boundary', 320, 510, 'ent.boundary.container', 'Database Subnet',       680, 120),
    n('redis',      'enterprise',380, 560, 'ent.data.cache',         'Redis\n(Session & Cache)',200, 60, { systemCode: 'RDS-001', techStack: ['ElastiCache'] }),
    n('vdb',        'enterprise',640, 560, 'ent.data.database',      'Vector DB\n(pgvector)', 200,  60, { systemCode: 'VDB-001', techStack: ['Pinecone', 'pgvector'] }),

    // External SaaS
    n('bnd_saas',   'boundary', 1100, 200, 'ent.boundary.system',   'External SaaS',         200, 200),
    n('llm_api',    'enterprise',1130, 280, 'ent.system.saas',       'LLM API Gateway\n(OpenAI/Anthropic)',160, 90, { systemCode: 'LLM-001' }),
  ],
  edges: [
    e('e1', 'browser',    'alb',        'conn.sync.rest',         'Port 443'),
    e('e2', 'alb',        'api_pod',    'conn.sync.rest',         'Routes requests'),
    e('e3', 'api_pod',    'redis',      'conn.data.db-read',      'Ephemeral state', { bidirectional: true }),
    e('e4', 'api_pod',    'worker_pod', 'conn.async.queue',       'Distributes job queue'),
    e('e5', 'worker_pod', 'vdb',        'conn.sync.grpc',         'Vector queries'),
    e('e6', 'worker_pod', 'llm_api',    'conn.sync.rest',         'HTTPS to model'),
  ],
};

// ─── Registry ────────────────────────────────────────────────────────────────
export const ALL_EXAMPLES = [
  { key: 'c1',         label: 'C1 — System Context',         icon: '🌐', data: C1_EXAMPLE },
  { key: 'c2',         label: 'C2 — Container Diagram',      icon: '📦', data: C2_EXAMPLE },
  { key: 'c3',         label: 'C3 — Component Diagram',      icon: '🔧', data: C3_EXAMPLE },
  { key: 'react_flow', label: 'ReAct Reasoning Loop',        icon: '🔄', data: REACT_FLOW_EXAMPLE },
  { key: 'flow',       label: 'Agent Execution Flowchart',   icon: '📋', data: FLOW_EXAMPLE },
  { key: 'sequence',   label: 'Sequence — Weather Query',    icon: '📡', data: SEQUENCE_EXAMPLE },
  { key: 'erd',        label: 'ERD — Agent Data Model',      icon: '🗄',  data: ERD_EXAMPLE },
  { key: 'deploy',     label: 'Deployment — Cloud Infra',    icon: '☁',  data: DEPLOYMENT_EXAMPLE },
];



