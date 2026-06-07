// Sample System Context Diagram — mirrors the screenshot
export const SAMPLE_NODES = [
  {
    id: 'user-1',
    type: 'person',
    position: { x: 60, y: 340 },
    data: {
      shapeType: 'ent.people.person',
      label: 'CM Desktop User',
      metadata: { systemCode: '', ownerTeam: 'UX Team', lifecycleStatus: 'Stable', changeInitiatives: [], complianceFlags: [], techStack: [], tags: [], description: 'Primary user of the CM Desktop application' },
    },
  },
  {
    id: 'cm-desktop',
    type: 'enterprise',
    position: { x: 340, y: 300 },
    data: {
      shapeType: 'ent.system.microservice',
      label: 'CM Desktop System',
      metadata: { systemCode: 'CM Desktop | TBD-CMDesktop', ownerTeam: 'CM Platform', lifecycleStatus: 'New', changeInitiatives: ['New SEAL Approval'], complianceFlags: ['PII'], techStack: ['React', 'Node.js'], deploymentTarget: 'container', slaTier: 'Tier1 (99.99%)', tags: ['core', 'portal'], description: 'Unified interface for workers to view, act on and track their actions' },
    },
  },
  {
    id: 'wis',
    type: 'enterprise',
    position: { x: 60, y: 80 },
    data: {
      shapeType: 'ent.system.microservice',
      label: 'WIS - Worker Information System',
      metadata: { systemCode: 'WIS | EP (35349)', ownerTeam: 'Worker Platform', lifecycleStatus: 'PartialUse', changeInitiatives: [], complianceFlags: ['PII'], techStack: ['Java', 'PostgreSQL'], deploymentTarget: 'container', slaTier: 'Tier2 (99.9%)', tags: ['workers', 'HR'], description: 'Source of truth for worker data' },
    },
  },
  {
    id: 'dscap',
    type: 'enterprise',
    position: { x: 310, y: 60 },
    data: {
      shapeType: 'ent.system.external',
      label: 'Directory Services Client Access Platform',
      metadata: { systemCode: 'DSCAP | CTO (104217)', ownerTeam: 'Identity Team', lifecycleStatus: 'Stable', changeInitiatives: [], complianceFlags: ['PII'], techStack: ['LDAP', 'AD'], tags: ['identity', 'auth'], description: 'User entitlement and directory services' },
    },
  },
  {
    id: 'ctsi',
    type: 'enterprise',
    position: { x: 600, y: 60 },
    data: {
      shapeType: 'ent.system.external',
      label: 'CTSI',
      metadata: { systemCode: 'CTSI | EP (80466)', ownerTeam: 'Platform', lifecycleStatus: 'PartialUse', changeInitiatives: [], complianceFlags: [], techStack: [], tags: ['photos'], description: 'Provides user photos to be rendered on UI' },
    },
  },
  {
    id: 'passenger',
    type: 'enterprise',
    position: { x: 660, y: 300 },
    data: {
      shapeType: 'ent.system.microservice',
      label: 'Passenger System',
      metadata: { systemCode: 'Passenger | TBD-PassengerSystem', ownerTeam: 'Passenger Platform', lifecycleStatus: 'New', changeInitiatives: [], complianceFlags: [], techStack: ['React'], tags: ['passenger', 'apps'], description: 'Loads passenger apps on demand' },
    },
  },
  {
    id: 'core',
    type: 'enterprise',
    position: { x: 60, y: 570 },
    data: {
      shapeType: 'ent.system.monolith',
      label: 'Compliance and Operational Risk Evaluation',
      metadata: { systemCode: 'CORE | CT (87167)', ownerTeam: 'Risk Team', lifecycleStatus: 'PartialUse', changeInitiatives: [], complianceFlags: ['PCI-DSS'], techStack: ['Java', 'Oracle'], tags: ['risk', 'compliance'], description: 'Compliance and operational risk evaluation system' },
    },
  },
  {
    id: 'fnbis',
    type: 'enterprise',
    position: { x: 280, y: 570 },
    data: {
      shapeType: 'ent.system.monolith',
      label: 'Firmwide New Product Assessment',
      metadata: { systemCode: 'FNBIS | CT (87951)', ownerTeam: 'Product Assessment', lifecycleStatus: 'PartialUse', changeInitiatives: [], complianceFlags: [], techStack: ['Java'], tags: ['product', 'assessment'], description: 'Firmwide new product assessment and review' },
    },
  },
  {
    id: 'red',
    type: 'enterprise',
    position: { x: 490, y: 570 },
    data: {
      shapeType: 'ent.data.database',
      label: 'Risk Events Database',
      metadata: { systemCode: 'RED | CT (106977)', ownerTeam: 'Risk Data', lifecycleStatus: 'Stable', changeInitiatives: [], complianceFlags: ['PCI-DSS'], techStack: ['Oracle'], tags: ['risk', 'events'], description: 'Repository of risk events and assessments' },
    },
  },
  {
    id: 'ela',
    type: 'enterprise',
    position: { x: 660, y: 570 },
    data: {
      shapeType: 'ent.system.monolith',
      label: 'Enterprise Library Application',
      metadata: { systemCode: 'ELA | CT (87810)', ownerTeam: 'Library Team', lifecycleStatus: 'Stable', changeInitiatives: [], complianceFlags: [], techStack: ['Java', 'Elasticsearch'], tags: ['library', 'search'], description: 'Enterprise-wide library and content management' },
    },
  },
  {
    id: 'spectrum',
    type: 'enterprise',
    position: { x: 860, y: 570 },
    data: {
      shapeType: 'ent.system.microservice',
      label: 'Spectrum Workflow',
      metadata: { systemCode: 'SWF | AWM (1105045)', ownerTeam: 'Workflow Team', lifecycleStatus: 'New', changeInitiatives: [], complianceFlags: [], techStack: ['Node.js', 'Kafka'], tags: ['workflow', 'tasks'], description: 'Workflow orchestration and task management' },
    },
  },
];

export const SAMPLE_EDGES = [
  { id: 'e-user-cm', source: 'user-1', target: 'cm-desktop', type: 'enterprise', data: { connectorType: 'conn.sync.rest', label: 'Views, acts on and tracks their and their teams actions' } },
  { id: 'e-cm-wis', source: 'cm-desktop', target: 'wis', type: 'enterprise', data: { connectorType: 'conn.sync.rest', label: 'Gets worker information' } },
  { id: 'e-cm-dscap', source: 'cm-desktop', target: 'dscap', type: 'enterprise', data: { connectorType: 'conn.sync.rest', label: 'Gets user entitlement information' } },
  { id: 'e-cm-ctsi', source: 'cm-desktop', target: 'ctsi', type: 'enterprise', data: { connectorType: 'conn.sync.rest', label: 'Gets user photos to be rendered on UI' } },
  { id: 'e-cm-passenger', source: 'cm-desktop', target: 'passenger', type: 'enterprise', data: { connectorType: 'conn.arch.uses', label: 'Loads passenger apps on demand' } },
  { id: 'e-cm-core', source: 'cm-desktop', target: 'core', type: 'enterprise', data: { connectorType: 'conn.async.kafka-publish', label: 'Publishes MyActions and RAS Process related Events [async]' } },
  { id: 'e-cm-fnbis', source: 'cm-desktop', target: 'fnbis', type: 'enterprise', data: { connectorType: 'conn.async.kafka-publish', label: 'Publishes New Product Assessment related events [async]' } },
  { id: 'e-cm-red', source: 'cm-desktop', target: 'red', type: 'enterprise', data: { connectorType: 'conn.async.kafka-publish', label: 'Publishes Risk Events [async]' } },
  { id: 'e-cm-ela', source: 'cm-desktop', target: 'ela', type: 'enterprise', data: { connectorType: 'conn.async.event-trigger', label: 'Publishes events relating to obligations [async]' } },
  { id: 'e-cm-spectrum', source: 'cm-desktop', target: 'spectrum', type: 'enterprise', data: { connectorType: 'conn.async.kafka-consume', label: 'Loads events relating to Spectrum Workflow tasks' } },
  { id: 'e-core-cm', source: 'core', target: 'cm-desktop', type: 'enterprise', data: { connectorType: 'conn.async.event-trigger', label: 'Receives acknowledgments' } },
  { id: 'e-fnbis-cm', source: 'fnbis', target: 'cm-desktop', type: 'enterprise', data: { connectorType: 'conn.async.event-trigger', label: 'Receives acknowledgments' } },
  { id: 'e-red-cm', source: 'red', target: 'cm-desktop', type: 'enterprise', data: { connectorType: 'conn.async.event-trigger', label: 'Receives acknowledgments' } },
  { id: 'e-ela-cm', source: 'ela', target: 'cm-desktop', type: 'enterprise', data: { connectorType: 'conn.async.event-trigger', label: 'Receives acknowledgments' } },
];
