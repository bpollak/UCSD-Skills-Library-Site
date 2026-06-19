import matter from 'gray-matter';

export interface SkillMeta {
  slug: string;
  name: string;
  description: string;
  allowedTools?: string;
}

export interface SkillDetail extends SkillMeta {
  body: string;
  raw: string;
}

const GITHUB_RAW = 'https://raw.githubusercontent.com/bpollak/UCSD-Skills-Library/main';
const MANIFEST_URL = `${GITHUB_RAW}/manifest.json`;

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
      });
    } catch {
      skills.push({
        slug: name,
        name,
        description: '',
        allowedTools: '',
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
      body: content,
      raw,
    };
  } catch {
    return null;
  }
}
