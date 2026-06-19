import matter from 'gray-matter';

export interface SkillMeta {
  slug: string;
  name: string;
  description: string;
  allowedTools?: string;
  catalog?: SkillCatalog;
}

export interface SkillDetail extends SkillMeta {
  body: string;
  raw: string;
}

export interface SkillCatalog {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  publicationStatus?: string;
  tier?: string;
  owner?: string;
  updated?: string;
}

const GITHUB_OWNER = 'bpollak';
const GITHUB_REPO = 'UCSD-Skills-Library';
const GITHUB_REF = 'main';
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_REF}`;
const MANIFEST_URL = `${GITHUB_RAW}/manifest.json`;
const TREE_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_REF}?recursive=1`;

interface GitHubTreeItem {
  path?: string;
  type?: string;
}

interface GitHubTree {
  tree?: GitHubTreeItem[];
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function fetchSkillNames(): Promise<string[]> {
  try {
    const tree = await fetchJson<GitHubTree>(TREE_URL);
    const names = new Set<string>();

    for (const item of tree.tree || []) {
      const match = item.path?.match(/^skills\/([^/.][^/]*)\/SKILL\.md$/);
      if (item.type === 'blob' && match && !match[1].startsWith('_')) {
        names.add(match[1]);
      }
    }

    if (names.size > 0) {
      return Array.from(names).sort();
    }
  } catch {
    // Fall back to the manifest for local/offline parity with the original site.
  }

  const manifestRaw = await fetchText(MANIFEST_URL);
  const manifest = JSON.parse(manifestRaw);
  return manifest.skills || [];
}

function normalizeCatalog(catalog: unknown): SkillCatalog | undefined {
  if (!catalog || typeof catalog !== 'object') return undefined;
  const data = catalog as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value).replace(/\s+/g, ' ').trim()])
  );
}

export async function fetchSkillList(): Promise<SkillMeta[]> {
  const skillNames = await fetchSkillNames();
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
        catalog: normalizeCatalog(data.catalog),
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
      catalog: normalizeCatalog(data.catalog),
      body: content,
      raw,
    };
  } catch {
    return null;
  }
}
