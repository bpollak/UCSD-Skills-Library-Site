import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@/components/Layout';
import { fetchSkillList, fetchSkillDetail, SkillDetail, SkillMeta, getSkillAccent } from '@/lib/skills';

interface SkillPageProps {
  skill: SkillDetail | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const skills = await fetchSkillList();
  const paths = skills.map((s: SkillMeta) => ({
    params: { slug: s.slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<SkillPageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const skill = await fetchSkillDetail(slug);
  return {
    props: { skill },
  };
};

export default function SkillPage({ skill }: SkillPageProps) {
  if (!skill) {
    return (
      <Layout title="Skill Not Found">
        <p>The requested skill could not be found.</p>
        <Link href="/skills" className="btn-ucsd" style={{ marginTop: '16px' }}>
          Back to Skills Library
        </Link>
      </Layout>
    );
  }

  const accent = getSkillAccent(skill.slug);

  return (
    <Layout>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--muted-foreground)' }}>
        <Link href="/" style={{ color: 'var(--ucsd-blue)' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link href="/skills" style={{ color: 'var(--ucsd-blue)' }}>Skills Library</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--ucsd-navy)' }}>{skill.name}</span>
      </nav>

      {/* Header */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#fff',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: '24px',
            letterSpacing: '1px',
          }}
        >
          {skill.initials}
        </div>
        <div style={{ flex: 1 }}>
          <h1 className="ucsd-h1" style={{ marginBottom: '8px', borderBottom: 'none', paddingBottom: 0 }}>
            {skill.name}
          </h1>
          <p className="ucsd-lead" style={{ margin: 0 }}>
            {skill.description}
          </p>
        </div>
      </div>

      {/* Metadata bar */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          padding: '16px 20px',
          background: 'var(--accent)',
          borderRadius: '6px',
          marginBottom: '32px',
          borderLeft: `4px solid ${accent}`,
        }}
      >
        {skill.allowedTools && (
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>
              Allowed Tools
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {skill.allowedTools.split(', ').map((tool) => (
                <span
                  key={tool}
                  style={{
                    fontSize: '13px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>
            Source
          </div>
          <a
            href={`https://github.com/bpollak/UCSD-Skills-Library/tree/main/skills/${skill.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '14px' }}
          >
            View on GitHub →
          </a>
        </div>
      </div>

      {/* Skill content */}
      <div style={{ display: 'flex', gap: '32px', flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
        {/* Sidebar TOC */}
        <div
          style={{
            width: '240px',
            flexShrink: 0,
            position: 'sticky',
            top: '24px',
            alignSelf: 'flex-start',
          }}
        >
          <div
            style={{
              padding: '16px',
              background: 'var(--ucsd-sand)',
              borderRadius: '6px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--ucsd-navy)' }}>
              On this page
            </div>
            <nav style={{ fontSize: '14px', lineHeight: 2 }}>
              <a href="#when-to-use" style={{ display: 'block' }}>When to use</a>
              <a href="#setup" style={{ display: 'block' }}>Setup</a>
              <a href="#workflow" style={{ display: 'block' }}>Agent workflow</a>
              <a href="#guardrails" style={{ display: 'block' }}>Guardrails</a>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="skill-detail" style={{ flex: 1, minWidth: 0, maxWidth: '800px' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {skill.body}
          </ReactMarkdown>
        </div>
      </div>

      {/* Back link */}
      <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
        <Link href="/skills" className="btn-ucsd-secondary">
          ← Back to Skills Library
        </Link>
      </div>
    </Layout>
  );
}
