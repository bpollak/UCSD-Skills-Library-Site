import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@/components/Layout';
import { fetchSkillList, fetchSkillDetail, SkillDetail, SkillMeta } from '@/lib/skills';

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
        <Link href="/skills" className="btn btn-primary">
          Back to Skills Library
        </Link>
      </Layout>
    );
  }

  return (
    <Layout>
      <ol className="breadcrumb breadcrumbs-list" aria-label="Breadcrumb">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/skills">Skills Library</Link></li>
        <li className="active">{skill.name}</li>
      </ol>

      <h1 className="page-header">{skill.name}</h1>
      <p className="lead">{skill.description}</p>

      <div className="panel panel-default skill-meta-panel">
        <div className="panel-body">
          {skill.allowedTools && (
            <p>
              <strong>Allowed Tools: </strong>
              {skill.allowedTools.split(', ').map((tool) => (
                <span className="badge" key={tool}>{tool}</span>
              ))}
            </p>
          )}
          <p>
            <strong>Source: </strong>
            <a
              href={`https://github.com/bpollak/UCSD-Skills-Library/tree/main/skills/${skill.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>

      <div className="row">
        <section className="main-section col-md-8 pull-right skill-detail" aria-label="Main Content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {skill.body}
          </ReactMarkdown>
        </section>

        <section className="sidebar-section col-md-4" role="complementary" aria-label="Sidebar">
          <article className="main-content-nav" role="navigation" aria-label="Sidebar Nav">
            <h2>On this page</h2>
            <ul className="navbar-list">
              <li><a href="#when-to-use">When to use</a></li>
              <li><a href="#setup">Setup</a></li>
              <li><a href="#workflow">Agent workflow</a></li>
              <li><a href="#guardrails">Guardrails</a></li>
            </ul>
          </article>
        </section>
      </div>

      <div className="skill-back-link">
        <Link href="/skills" className="btn btn-default">
          Back to Skills Library
        </Link>
      </div>
    </Layout>
  );
}
