import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { fetchSkillList, fetchSkillDetail, SkillDetail, SkillMeta } from '@/lib/skills';
import { getSkillPresentation, getSkillStatusIndicator } from '@/lib/skillPresentation';

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
  const sectionSkills = [...skills].sort((a, b) => (
    getSkillPresentation(a).title.localeCompare(getSkillPresentation(b).title)
  ));
  const isLimitedAccess = statusIndicator?.tone === 'limited';

  return (
    <Layout pageTitle={presentation.title}>
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

      <div className="row skill-detail-layout">
        <aside className="sidebar-section col-md-3">
          <nav className="panel panel-default section-nav-panel" aria-label="Skills Library">
            <div className="panel-heading">
              <h2 className="panel-title">Skills Library</h2>
            </div>
            <div className="list-group">
              <Link href="/skills" className="list-group-item">
                All skills
              </Link>
              {sectionSkills.map((sectionSkill) => {
                const sectionPresentation = getSkillPresentation(sectionSkill);
                if (sectionSkill.slug === skill.slug) {
                  return (
                    <span className="list-group-item active" aria-current="page" key={sectionSkill.slug}>
                      {sectionPresentation.title}
                    </span>
                  );
                }

                return (
                  <Link
                    href={`/skills/${sectionSkill.slug}`}
                    className="list-group-item"
                    key={sectionSkill.slug}
                  >
                    {sectionPresentation.title}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        <section className="main-section col-md-9 skill-detail" aria-label="Main Content">
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

      <div className="skill-back-link">
        <Link href="/skills" className="btn btn-default">
          Back to Skills Library
        </Link>
      </div>
    </Layout>
  );
}
