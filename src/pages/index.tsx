import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import SkillCard from '@/components/SkillCard';
import { fetchSkillList, SkillMeta } from '@/lib/skills';

interface HomeProps {
  skills: SkillMeta[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const skills = await fetchSkillList();
  return {
    props: { skills },
  };
};

export default function Home({ skills }: HomeProps) {
  return (
    <Layout>
      {/* Hero */}
      <section style={{ padding: '40px 0 32px' }}>
        <h1 className="ucsd-h1" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '8px' }}>
          TritonAI Skills Library
        </h1>
        <p className="ucsd-lead" style={{ marginBottom: '32px', maxWidth: '800px' }}>
          A growing collection of reusable skills for the TritonAI agent ecosystem at UC San Diego.
          Browse, learn, and integrate AI-powered capabilities into your workflows.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/skills" className="btn-ucsd">
            Browse All Skills
          </Link>
          <a
            href="https://github.com/bpollak/UCSD-Skills-Library"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ucsd-secondary"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{
          background: 'var(--accent)',
          borderRadius: '6px',
          padding: '24px 32px',
          marginBottom: '40px',
          display: 'flex',
          gap: '48px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ucsd-blue)', fontFamily: 'var(--font-heading)' }}>
            {skills.length}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Available Skills</div>
        </div>
        <div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ucsd-blue)', fontFamily: 'var(--font-heading)' }}>
            {new Set(skills.flatMap((s) => s.allowedTools ? s.allowedTools.split(', ') : [])).size}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Tool Integrations</div>
        </div>
        <div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ucsd-blue)', fontFamily: 'var(--font-heading)' }}>
            {skills.reduce((max, s) => Math.max(max, s.description.length), 0) > 0 ? '✓' : '—'}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Open Source</div>
        </div>
      </section>

      {/* Featured Skills */}
      <section>
        <h2 className="ucsd-h2" style={{ marginBottom: '24px' }}>Available Skills</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {skills.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
