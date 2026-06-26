import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@/components/Layout';
import { fetchSkillList, fetchSkillDetail, SkillDetail, SkillMeta } from '@/lib/skills';
import { getSkillPresentation, getSkillStatusIndicator } from '@/lib/skillPresentation';

const TRITONAI_URL = 'https://tritonai.ucsd.edu';

interface SkillPageProps {
  skill: SkillDetail | null;
  skills: SkillMeta[];
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
  const [skill, skills] = await Promise.all([
    fetchSkillDetail(slug),
    fetchSkillList(),
  ]);
  return {
    props: { skill, skills },
  };
};

function SidebarNav({
  currentSlug,
  skills,
}: {
  currentSlug?: string;
  skills: SkillMeta[];
}) {
  const sectionSkills = [...skills].sort((a, b) =>
    getSkillPresentation(a).title.localeCompare(getSkillPresentation(b).title)
  );

  return (
    <section className="col-xs-12 col-md-3 sidebar-section" aria-label="Sidebar" role="complementary">
      <article className="main-content-nav" aria-label="Skills Library Nav" role="navigation">
        <h2><a href={TRITONAI_URL}>TritonAI</a></h2>
        <ul>
          <li className="active">
            <a href="/skills">Skills Library</a>
            <ul>
              <li>
                <a href="/skills">All skills</a>
              </li>
              {sectionSkills.map((sectionSkill) => {
                const sectionPresentation = getSkillPresentation(sectionSkill);
                const isActive = sectionSkill.slug === currentSlug;
                return (
                  <li className={isActive ? 'active' : ''} key={sectionSkill.slug}>
                    <a
                      href={`/skills/${sectionSkill.slug}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {sectionPresentation.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </article>
    </section>
  );
}

export default function SkillPage({ skill, skills }: SkillPageProps) {
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
  const statusIndicator = getSkillStatusIndicator(skill);
  const isLimitedAccess = statusIndicator?.tone === 'limited';

  return (
    <Layout pageTitle={presentation.title}>
      <div className="row">
        <SidebarNav currentSlug={skill.slug} skills={skills} />

        <div className="col-md-9">
          <ol className="breadcrumb breadcrumbs-list" aria-label="Breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/skills">Skills Library</Link></li>
            <li className="active">{presentation.title}</li>
          </ol>

          <section className="skill-detail-intro">
            <p className="skill-detail-kicker">
              <span className="text-uppercase library-kicker">{presentation.category}</span>
              {statusIndicator && (
                <span
                  className={`label skill-status-label skill-status-${statusIndicator.tone}`}
                  title={statusIndicator.description}
                >
                  <span className={`glyphicon glyphicon-${statusIndicator.icon}`} aria-hidden="true" />{' '}
                  {statusIndicator.label}
                </span>
              )}
            </p>
            <h1 className="page-header">{presentation.title}</h1>
            <p className="lead">{presentation.summary}</p>
            {statusIndicator && (
              <p className={`skill-status-note skill-status-note-${statusIndicator.tone}`}>
                <span className={`glyphicon glyphicon-${statusIndicator.icon}`} aria-hidden="true" />{' '}
                {statusIndicator.description}
              </p>
            )}
          </section>

          <section className="skill-description">
            <article className="skill-body-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {skill.body}
              </ReactMarkdown>
            </article>
            <p className="skill-body-footer">
              <a
                href={`https://github.com/bpollak/UCSD-Skills-Library/tree/main/skills/${skill.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-default"
              >
                <span className="glyphicon glyphicon-new-window" aria-hidden="true" /> View on GitHub
              </a>
            </p>
          </section>

          <div className="panel panel-default skill-meta-panel">
            <div className="panel-body">
              <div className="row">
                <div className="col-sm-4">
                  <strong>Skill ID</strong>
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
            </div>
          </div>

          <div className="panel panel-default skill-access-panel">
            <div className="panel-heading">
              <h2 className="panel-title">Enable in TritonAI Harness</h2>
            </div>
            <div className="panel-body">
              <p>
                This skill is available in the TritonAI Harness. If it is marked as
                generally available, you can enable it by toggling it on in the
                Harness interface using the Skill ID above.
              </p>
              {isLimitedAccess && (
                <div className="limited-access-requirements">
                  <p>
                    <strong>Installing the files is not enough for this skill.</strong>
                    {' '}You also need the service access and local configuration required
                    by the integration.
                  </p>
                  {skill.slug === 'ucsd-msgraph-calendar' && (
                    <ul>
                      <li>UC San Diego Microsoft 365 calendar access.</li>
                      <li>A Microsoft Entra app registration or approved configured client.</li>
                      <li>Delegated Microsoft Graph permissions such as <code>Calendars.Read</code> and <code>User.Read</code>.</li>
                      <li>Device-code authentication and local Python dependencies.</li>
                    </ul>
                  )}
                </div>
              )}
              <p>
                <a
                  href={`https://github.com/bpollak/UCSD-Skills-Library/tree/main/skills/${skill.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-default"
                >
                  View full skill on GitHub
                </a>
              </p>
            </div>
          </div>


        </div>
      </div>
    </Layout>
  );
}
