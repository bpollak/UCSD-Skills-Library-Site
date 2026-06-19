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
      <p className="lead">
        Browse all available skills in the TritonAI ecosystem. Each skill provides a specific
        capability that agents can use to interact with campus services and tools.
      </p>

      <SearchBar value={search} onChange={setSearch} />

      {filtered.length === 0 ? (
        <div className="well">
          <p><strong>No skills match your search.</strong></p>
          <p>Try a different keyword or browse all skills.</p>
        </div>
      ) : (
        <>
          <p className="text-muted">
            Showing {filtered.length} of {skills.length} skills
          </p>
          <div className="row skill-list">
            {filtered.map((skill) => (
              <div className="col-sm-6 col-md-4" key={skill.slug}>
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
