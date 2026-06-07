export const METADATA_SCHEMA = {
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
};

export const METADATA_GROUPS = [
  { id: 'technical', label: '⚙ Technical' },
];

export const DEFAULT_METADATA = Object.fromEntries(
  Object.entries(METADATA_SCHEMA).map(([k, v]) => {
    if (v.type === 'multiselect' || v.type === 'tags') return [k, []];
    return [k, ''];
  })
);
