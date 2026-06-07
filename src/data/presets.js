// C1 / C2 / C3 stencil presets
// Defines which shape panels to show and recommended connectors

export const PRESETS = {
  C1: {
    key: 'C1',
    label: 'C1 — System Context',
    subtitle: 'People, systems & high-level interactions',
    color: '#1A3A5C',
    fill: '#E3EAF3',
    icon: '🌐',
    description: 'Shows how the system fits into the wider landscape — actors, external systems, and integration style. Business-stakeholder readable.',
    // Which panel groups to surface (others are collapsed/dimmed)
    primaryPanels: ['P02', 'P03', 'P07', 'P12'],
    hiddenPanels: ['P04', 'P09', 'P10', 'P11'],
    // Shapes highlighted in the stencil for this diagram type
    featuredShapes: [
      'ent.people.person',
      'ent.people.organisation',
      'ent.system.microservice',
      'ent.system.monolith',
      'ent.system.external',
      'ent.system.saas',
      'ent.system.ui',
      'ent.boundary.system',
      'ent.foundation.note',
    ],
    // Connector types to highlight
    featuredConnectors: [
      'conn.sync.rest',
      'conn.async.kafka-publish',
      'conn.async.kafka-consume',
      'conn.async.event-trigger',
      'conn.arch.uses',
    ],
    routingStyle: 'metro',
    // Guidance bullets shown in preset card
    guidance: [
      'Box = system or application (not technology)',
      'Person = human actor (not system user table)',
      'Connectors labelled with interaction purpose',
      'Avoid internal component detail at this level',
    ],
  },

  C2: {
    key: 'C2',
    label: 'C2 — Container',
    subtitle: 'Technologies, APIs, databases & message brokers',
    color: '#006064',
    fill: '#E0F2F1',
    icon: '📦',
    description: 'Zooms into a system to show its containers (web apps, APIs, databases, queues). Audience: architects and senior engineers.',
    primaryPanels: ['P02', 'P03', 'P05', 'P06', 'P07', 'P12'],
    hiddenPanels: ['P09', 'P10', 'P11'],
    featuredShapes: [
      'ent.people.person',
      'ent.system.microservice',
      'ent.system.ui',
      'ent.system.api-gateway',
      'ent.system.external',
      'ent.data.database',
      'ent.data.cache',
      'ent.data.object-store',
      'ent.integration.message-broker',
      'ent.integration.event-stream',
      'ent.integration.queue',
      'ent.boundary.container',
      'ent.boundary.system',
      'ent.foundation.note',
    ],
    featuredConnectors: [
      'conn.sync.rest',
      'conn.sync.grpc',
      'conn.data.db-read',
      'conn.data.db-write',
      'conn.async.kafka-publish',
      'conn.async.kafka-consume',
      'conn.async.queue',
    ],
    routingStyle: 'orthogonal',
    guidance: [
      'Container = runtime unit (app, DB, queue) — not a Docker container',
      'Show technology labels (React, PostgreSQL, Kafka)',
      'Use orthogonal routing for structured tier layout',
      'System boundary wraps the containers you own',
    ],
  },

  C3: {
    key: 'C3',
    label: 'C3 — Component',
    subtitle: 'Internal components, interfaces & dependencies',
    color: '#1565C0',
    fill: '#E3F2FD',
    icon: '🔧',
    description: 'Zooms into a single container to show its internal components and how they communicate. Audience: engineering team.',
    primaryPanels: ['P03', 'P05', 'P06', 'P07', 'P09', 'P12'],
    hiddenPanels: ['P02', 'P08', 'P10', 'P11'],
    featuredShapes: [
      'ent.system.microservice',
      'ent.system.library',
      'ent.system.api',
      'ent.data.database',
      'ent.data.cache',
      'ent.integration.api',
      'ent.boundary.container',
      'ent.foundation.note',
    ],
    featuredConnectors: [
      'conn.sync.rest',
      'conn.sync.grpc',
      'conn.data.db-read',
      'conn.data.db-write',
      'conn.arch.uses',
      'conn.uml.dependency',
      'conn.uml.realisation',
    ],
    routingStyle: 'orthogonal',
    guidance: [
      'Component = grouping of related code (controller, service, repo)',
      'Show interfaces and the technology they use',
      'Avoid class-level detail — that belongs in class diagrams',
      'Container boundary shows the outer container clearly',
    ],
  },
};

export const PRESET_LIST = Object.values(PRESETS);
