import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
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
    <aside className="sidebar-section">
      <nav className="sidebar-nav" aria-label="Sidebar Nav">
        <h2 className="sidebar-nav-heading">
          <a href={TRITONAI_URL}>TritonAI</a>
        </h2>
        <ul className="nav nav-pills nav-stacked sidebar-nav-list">
          <li>
            <a href={`${TRITONAI_URL}/about/index.html`}>About</a>
          </li>
          <li>
            <a href={`${TRITONAI_URL}/tritongpt/index.html`}>TritonGPT</a>
          </li>
          <li>
            <a href={`${TRITONAI_URL}/training-resources/index.html`}>Training & Resources</a>
          </li>
          <li>
            <a href={`${TRITONAI_URL}/developer-apis/index.html`}>Developer APIs</a>
          </li>
          <li>
            <a href={`${TRITONAI_URL}/tools/index.html`}>AI Tools</a>
          </li>
          <li className="active">
            <a href="/skills">
              Skills Library
            </a>
            <ul className="nav nav-pills nav-stacked sidebar-nav-sublist">
              <li key="all">
                <a href="/skills">All skills</a>
              </li>
              {sectionSkills.map((sectionSkill) => {
                const sectionPresentation = getSkillPresentation(sectionSkill);
                const isActive = sectionSkill.slug === currentSlug;
                if (isActive) {
                  return (
                    <li className="active" key={sectionSkill.slug}>
                      <a href={`/skills/${sectionSkill.slug}`} aria-current="page">
                        {sectionPresentation.title}
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={sectionSkill.slug}>
                    <a href={`/skills/${sectionSkill.slug}`}>
                      {sectionPresentation.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
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

          <section className="skill-description">
            <div className="alert alert-info">
              <strong>Description:</strong> {skill.description}
            </div>
            <p>
              <a
                href={`https://github.com/bpollak/UCSD-Skills-Library/tree/main/skills/${skill.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View the full skill specification, reference files, and implementation guide on GitHub
              </a>
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
