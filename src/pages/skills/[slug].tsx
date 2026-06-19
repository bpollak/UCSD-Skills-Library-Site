import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@/components/Layout';
import { fetchSkillList, fetchSkillDetail, SkillDetail, SkillMeta } from '@/lib/skills';
import { getSkillPresentation } from '@/lib/skillPresentation';

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

  const presentation = getSkillPresentation(skill);
  const tools = skill.allowedTools
    ? skill.allowedTools.split(', ').filter(Boolean)
    : [];

  return (
    <Layout>
      <ol className="breadcrumb breadcrumbs-list" aria-label="Breadcrumb">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/skills">Skills Library</Link></li>
        <li className="active">{presentation.title}</li>
      </ol>

      <section className="skill-detail-intro">
        <p className="text-uppercase library-kicker">{presentation.category}</p>
        <h1 className="page-header">{presentation.title}</h1>
        <p className="lead">{presentation.summary}</p>
      </section>

      <div className="panel panel-default skill-meta-panel">
        <div className="panel-body">
          <div className="row">
            <div className="col-sm-4">
              <strong>Canonical Skill ID</strong>
              <p><code>{skill.slug}</code></p>
            </div>
            <div className="col-sm-4">
              <strong>Best For</strong>
              <p>{presentation.audience}</p>
            </div>
            <div className="col-sm-4">
              <strong>Source</strong>
              <p>
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
          {tools.length > 0 && (
            <p className="skill-tool-list">
              <strong>Allowed Tools: </strong>
              {tools.map((tool) => (
                <span className="badge" key={tool}>{tool}</span>
              ))}
            </p>
          )}
        </div>
      </div>

      <div className="row">
        <section className="main-section col-md-8 pull-right skill-detail" aria-label="Main Content">
          <div className="alert alert-info">
            <strong>Original skill description:</strong> {skill.description}
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {skill.body}
          </ReactMarkdown>
        </section>

        <section className="sidebar-section col-md-4" role="complementary" aria-label="Sidebar">
          <article className="panel panel-default skill-sidebar-panel">
            <div className="panel-heading">
              <h2 className="panel-title">At a glance</h2>
            </div>
            <div className="list-group">
              {presentation.tags.map((tag) => (
                <span className="list-group-item" key={tag}>
                  <span className="glyphicon glyphicon-tag" aria-hidden="true" /> {tag}
                </span>
              ))}
            </div>
          </article>
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
