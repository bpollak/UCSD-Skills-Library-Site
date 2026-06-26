import { SkillMeta } from '@/lib/skills';

export interface SkillPresentation {
  title: string;
  summary: string;
  category: string;
  audience: string;
  icon: string;
  accent: string;
  tags: string[];
}

export interface SkillStatusIndicator {
  label: string;
  tone: 'experimental' | 'limited';
  icon: string;
  description: string;
}

const PRESENTATION: Record<string, SkillPresentation> = {
  'tritonai-feedback': {
    title: 'TritonAI Feedback',
    summary: 'Send product feedback, bug reports, support notes, and improvement ideas directly to the TritonAI team.',
    category: 'Feedback',
    audience: 'Campus AI users',
    icon: 'comment',
    accent: 'teal',
    tags: ['Support', 'Feedback', 'TritonAI'],
  },
  'ucsd-msgraph-calendar': {
    title: 'Microsoft 365 Calendar Lookup',
    summary: 'Check UC San Diego Microsoft 365 calendars for meetings, availability, agendas, and schedule context.',
    category: 'Campus Productivity',
    audience: 'Calendar-enabled agents',
    icon: 'calendar',
    accent: 'blue',
    tags: ['Calendar', 'Microsoft 365', 'Scheduling'],
  },
  'ucsd-branding': {
    title: 'UCSD TritonAI Branding and Decorator V5',
    summary: 'Match live TritonAI page styling first, using UC San Diego Decorator V5 as the underlying component and page-shell system.',
    category: 'Design System',
    audience: 'Web and content builders',
    icon: 'picture',
    accent: 'gold',
    tags: ['Branding', 'Decorator V5', 'Web Design'],
  },
  'ucsd-cms': {
    title: 'UCSD CMS Authoring',
    summary: 'Navigate UC San Diego CMS authoring workflows using official Blink training as the source of truth.',
    category: 'Brand & Communications',
    audience: 'Campus web authors',
    icon: 'edit',
    accent: 'teal',
    tags: ['CMS', 'Blink', 'Authoring'],
  },
  'ucsd-data-classification': {
    title: 'UCSD Data Classification and Handling',
    summary: 'Classify UC San Diego data under UC IS-3 Protection Levels and apply handling controls for storage, logging, access, and vendors.',
    category: 'Security & Data Protection',
    audience: 'App and data pipeline builders',
    icon: 'lock',
    accent: 'burgundy',
    tags: ['IS-3', 'Security', 'Data Handling'],
  },
  'ucsd-dsmlp-deploy': {
    title: 'UCSD DSMLP Deployment Packaging',
    summary: 'Prepare approved applications for TritonAI platform review and deployment packaging.',
    category: 'Engineering Support',
    audience: 'Platform handoff workflows',
    icon: 'cloud-upload',
    accent: 'blue',
    tags: ['Deployment', 'Platform Review', 'Packaging'],
  },
  'ucsd-memory': {
    title: 'Use Local Agent Memory',
    summary: 'Optional experimental helper for searching, citing, updating, and maintaining a local TritonAI Markdown memory vault.',
    category: 'Agent Workspace',
    audience: 'Local memory workflows',
    icon: 'book',
    accent: 'green',
    tags: ['Memory', 'Markdown', 'Experimental'],
  },
  'ucsd-memory-create': {
    title: 'Set Up Local Agent Memory',
    summary: 'Optional experimental helper for creating a local TritonAI memory vault with starter notes, provenance rules, and sync jobs.',
    category: 'Agent Workspace',
    audience: 'Local memory setup',
    icon: 'folder-open',
    accent: 'purple',
    tags: ['Memory Setup', 'Local Workspace', 'Experimental'],
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
    accent: 'blue',
    tags: [],
  };
}

export function getPublicSkillMeta(skill: SkillMeta): SkillMeta {
  const presentation = getSkillPresentation(skill);
  return {
    slug: skill.slug,
    name: presentation.title,
    description: presentation.summary,
    catalog: {
      title: presentation.title,
      description: presentation.summary,
      category: presentation.category,
      status: skill.catalog?.status,
      publicationStatus: skill.catalog?.publicationStatus,
      tier: skill.catalog?.tier,
      owner: skill.catalog?.owner,
      updated: skill.catalog?.updated,
    },
  };
}

export function getSkillStatusIndicator(skill: SkillMeta): SkillStatusIndicator | null {
  if (skill.catalog?.tier === 'experimental') {
    return {
      label: 'Experimental',
      tone: 'experimental',
      icon: 'warning-sign',
      description: 'This skill is still being reviewed and may change.',
    };
  }

  if (skill.catalog?.publicationStatus && skill.catalog.publicationStatus !== 'published') {
    return {
      label: 'Limited Access',
      tone: 'limited',
      icon: 'lock',
      description: 'This skill is available in the library but is not broadly published yet.',
    };
  }

  return null;
}

export function getSkillSearchText(skill: SkillMeta): string {
  const presentation = getSkillPresentation(skill);
  const statusIndicator = getSkillStatusIndicator(skill);
  return [
    skill.slug,
    skill.name,
    skill.description,
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
    statusIndicator?.label,
    statusIndicator?.description,
    ...presentation.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
