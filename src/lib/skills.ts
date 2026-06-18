import matter from 'gray-matter';

export interface SkillMeta {
  slug: string;
  name: string;
  description: string;
  allowedTools?: string;
  emoji: string;
}

export interface SkillDetail extends SkillMeta {
  body: string;
  raw: string;
}

const GITHUB_RAW = 'https://raw.githubusercontent.com/bpollak/UCSD-Skills-Library/main';
const MANIFEST_URL = `${GITHUB_RAW}/manifest.json`;

const EMOJI_MAP: Record<string, string> = {
  'tritonai-feedback': '📬',
  'ucsd-msgraph-calendar': '📅',
  'ucsd-branding': '🎨',
};

const ACCENT_COLORS: Record<string, string> = {
  'tritonai-feedback': '#00C6D7',
  'ucsd-msgraph-calendar': '#D462AD',
  'ucsd-branding': '#C69214',
};

export function getSkillEmoji(slug: string): string {
  return EMOJI_MAP[slug] || '🧩';
}

export function getSkillAccent(slug: string): string {
  return ACCENT_COLORS[slug] || '#00629B';
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.text();
}

export async function fetchSkillList(): Promise<SkillMeta[]> {
  const manifestRaw = await fetchText(MANIFEST_URL);
  const manifest = JSON.parse(manifestRaw);
  const skillNames: string[] = manifest.skills || [];
  const skills: SkillMeta[] = [];

  for (const name of skillNames) {
    try {
      const raw = await fetchText(`${GITHUB_RAW}/skills/${name}/SKILL.md`);
      const { data } = matter(raw);
      skills.push({
        slug: name,
        name: data.name || name,
        description: (data.description || '').replace(/\s+/g, ' ').trim(),
        allowedTools: data['allowed-tools'] || '',
        emoji: getSkillEmoji(name),
      });
    } catch {
      skills.push({
        slug: name,
        name,
        description: '',
        allowedTools: '',
        emoji: getSkillEmoji(name),
      });
    }
  }

  return skills;
}

export async function fetchSkillDetail(slug: string): Promise<SkillDetail | null> {
  try {
    const raw = await fetchText(`${GITHUB_RAW}/skills/${slug}/SKILL.md`);
    const { data, content } = matter(raw);
    return {
      slug,
      name: data.name || slug,
      description: (data.description || '').replace(/\s+/g, ' ').trim(),
      allowedTools: data['allowed-tools'] || '',
      emoji: getSkillEmoji(slug),
      body: content,
      raw,
    };
  } catch {
    return null;
  }
}
