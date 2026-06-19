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
    title: skill.name && skill.name !== skill.slug ? skill.name : titleCaseFromSlug(skill.slug),
    summary: firstSentence(skill.description),
    category: 'Reusable Skill',
    audience: 'Agent builders',
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
    ...presentation.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
