import { GetStaticProps } from 'next';
import { useState } from 'react';
import Layout from '@/components/Layout';
import SkillCard from '@/components/SkillCard';
import SearchBar from '@/components/SearchBar';
import { fetchSkillList, SkillMeta } from '@/lib/skills';

interface SkillsPageProps {
  skills: SkillMeta[];
}

export const getStaticProps: GetStaticProps<SkillsPageProps> = async () => {
  const skills = await fetchSkillList();
  return {
    props: { skills },
  };
};

export default function SkillsPage({ skills }: SkillsPageProps) {
  const [search, setSearch] = useState('');

  const filtered = skills.filter((skill) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      skill.name.toLowerCase().includes(q) ||
      skill.description.toLowerCase().includes(q) ||
      (skill.allowedTools && skill.allowedTools.toLowerCase().includes(q))
    );
  });

  return (
    <Layout title="Skills Library">
      <p className="ucsd-lead" style={{ marginBottom: '32px' }}>
        Browse all available skills in the TritonAI ecosystem. Each skill provides a specific
        capability that agents can use to interact with campus services and tools.
      </p>

      <SearchBar value={search} onChange={setSearch} />

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted-foreground)' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>No skills match your search.</p>
          <p>Try a different keyword or browse all skills.</p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginBottom: '16px' }}>
            Showing {filtered.length} of {skills.length} skills
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {filtered.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
