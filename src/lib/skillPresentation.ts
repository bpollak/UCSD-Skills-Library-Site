import { SkillMeta } from '@/lib/skills';

export interface SkillPresentation {
  title: string;
  summary: string;
  category: string;
  audience: string;
  icon: string;
  tags: string[];
}

const PRESENTATION: Record<string, SkillPresentation> = {
  'tritonai-feedback': {
    title: 'TritonAI Feedback',
    summary: 'Send product feedback, bug reports, support notes, and improvement ideas directly to the TritonAI team.',
    category: 'Feedback',
    audience: 'Campus AI users',
    icon: 'comment',
    tags: ['Support', 'Feedback', 'TritonAI'],
  },
  'ucsd-msgraph-calendar': {
    title: 'Microsoft 365 Calendar Lookup',
    summary: 'Check UC San Diego Microsoft 365 calendars for meetings, availability, agendas, and schedule context.',
    category: 'Campus Productivity',
    audience: 'Calendar-enabled agents',
    icon: 'calendar',
    tags: ['Calendar', 'Microsoft 365', 'Scheduling'],
  },
  'ucsd-branding': {
    title: 'UC San Diego Branding and Decorator V5',
    summary: 'Apply current UC San Diego Decorator V5 page chrome, components, and visual patterns from the official developer site.',
    category: 'Design System',
    audience: 'Web and content builders',
    icon: 'picture',
    tags: ['Branding', 'Decorator V5', 'Web Design'],
  },
  'ucsd-data-classification': {
    title: 'UCSD Data Classification and Handling',
    summary: 'Classify UC San Diego data under UC IS-3 Protection Levels and apply handling controls for storage, logging, access, and vendors.',
    category: 'Security & Data Protection',
    audience: 'App and data pipeline builders',
    icon: 'lock',
    tags: ['IS-3', 'Security', 'Data Handling'],
  },
  'ucsd-memory': {
    title: 'UCSD Memory',
    summary: 'Use, search, cite, update, and maintain an existing local TritonAI Markdown memory vault.',
    category: 'Knowledge & Documentation',
    audience: 'Agents using local memory',
    icon: 'book',
    tags: ['Memory', 'Markdown', 'Knowledge Base'],
  },
  'ucsd-memory-create': {
    title: 'UCSD Memory Create',
    summary: 'Create a local TritonAI memory vault with starter notes, provenance rules, and optional scheduled sync jobs.',
    category: 'Knowledge & Documentation',
    audience: 'Memory vault setup',
    icon: 'folder-open',
    tags: ['Memory Setup', 'Obsidian', 'Automation'],
  },
};

function titleCaseFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function firstSentence(text: string): string {
  const match = text.match(/^(.+?[.!?])(?:\s|$)/);
  return (match?.[1] || text || 'Review this reusable TritonAI skill.').trim();
}

export function getSkillPresentation(skill: SkillMeta): SkillPresentation {
  return PRESENTATION[skill.slug] || {
    title: skill.catalog?.title || (skill.name && skill.name !== skill.slug ? skill.name : titleCaseFromSlug(skill.slug)),
    summary: skill.catalog?.description || firstSentence(skill.description),
    category: skill.catalog?.category || 'Reusable Skill',
    audience: skill.catalog?.owner ? `${skill.catalog.owner} users` : 'Agent builders',
    icon: 'wrench',
    tags: [],
  };
}

export function getSkillSearchText(skill: SkillMeta): string {
  const presentation = getSkillPresentation(skill);
  return [
    skill.slug,
    skill.name,
    skill.description,
    skill.allowedTools,
    presentation.title,
    presentation.summary,
    presentation.category,
    presentation.audience,
    skill.catalog?.title,
    skill.catalog?.description,
    skill.catalog?.category,
    skill.catalog?.status,
    skill.catalog?.publicationStatus,
    skill.catalog?.tier,
    skill.catalog?.owner,
    ...presentation.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
