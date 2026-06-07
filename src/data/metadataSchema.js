export const METADATA_SCHEMA = {
  // Governance
  systemCode: {
    label: 'System Code', type: 'text', group: 'governance', required: true,
    placeholder: 'PREFIX | SUB (12345)', hint: 'e.g. WIS | EP (35349)',
  },
  systemId: {
    label: 'System ID', type: 'text', group: 'governance', required: false,
    placeholder: 'UUID or enterprise ID',
  },
  ownerTeam: {
    label: 'Owner Team', type: 'text', group: 'governance', required: true,
    placeholder: 'Squad / team name',
  },
  lifecycleStatus: {
    label: 'Lifecycle Status', type: 'enum', group: 'governance', required: true,
    options: ['Draft', 'New', 'PartialUse', 'Stable', 'Decommission'],
  },
  changeInitiatives: {
    label: 'Change Initiatives', type: 'tags', group: 'governance', required: false,
    placeholder: 'e.g. New SEAL Approval',
  },
  effectiveDate: {
    label: 'Effective Date', type: 'date', group: 'governance', required: false,
  },
  complianceFlags: {
    label: 'Compliance Flags', type: 'multiselect', group: 'governance', required: false,
    options: ['PII', 'PCI-DSS', 'GDPR', 'HIPAA', 'SOX'],
  },
  reviewStatus: {
    label: 'Review Status', type: 'enum', group: 'governance', required: false,
    options: ['PendingReview', 'Approved', 'Rejected'],
  },
  // Technical
  techStack: {
    label: 'Tech Stack', type: 'tags', group: 'technical', required: false,
    placeholder: 'e.g. Java, Spring Boot, PostgreSQL',
  },
  scalabilityPattern: {
    label: 'Scalability Pattern', type: 'enum', group: 'technical', required: false,
    options: ['stateless', 'stateful', 'event-sourced', 'cqrs', 'saga', 'unknown'],
  },
  slaTier: {
    label: 'SLA Tier', type: 'enum', group: 'technical', required: false,
    options: ['Tier1 (99.99%)', 'Tier2 (99.9%)', 'Tier3 (99%)', 'Best Effort'],
  },
  apiSpecRef: {
    label: 'API Spec URL', type: 'url', group: 'technical', required: false,
    placeholder: 'https://...',
  },
  repositoryUrl: {
    label: 'Repository URL', type: 'url', group: 'technical', required: false,
    placeholder: 'https://...',
  },
  // Discoverability
  description: {
    label: 'Description', type: 'textarea', group: 'discoverability', required: false,
    placeholder: 'What does this element do?',
  },
  version: {
    label: 'Version', type: 'text', group: 'discoverability', required: false,
    placeholder: '1.0.0',
  },
  tags: {
    label: 'Tags', type: 'tags', group: 'discoverability', required: false,
    placeholder: 'Add keyword...',
  },
};

export const METADATA_GROUPS = [
  { id: 'governance', label: '🏛 Governance' },
  { id: 'technical',  label: '⚙ Technical' },
  { id: 'discoverability', label: '🔎 Discoverability' },
];

export const DEFAULT_METADATA = Object.fromEntries(
  Object.entries(METADATA_SCHEMA).map(([k, v]) => {
    if (v.type === 'multiselect' || v.type === 'tags') return [k, []];
    if (k === 'lifecycleStatus') return [k, 'Draft'];
    return [k, ''];
  })
);
