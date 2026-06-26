import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@/components/Layout';
import { fetchSkillList, fetchSkillDetail, SkillDetail, SkillMeta } from '@/lib/skills';
import { getPublicSkillMeta, getSkillPresentation, getSkillStatusIndicator } from '@/lib/skillPresentation';

interface SkillPageProps {
  skill: SkillDetail | null;
  skills: SkillNavItem[];
}

interface SkillNavItem {
  slug: string;
  title: string;
}

const PUBLIC_BODY_OVERRIDES: Record<string, string> = {
  'ucsd-dsmlp-deploy': `# UCSD DSMLP Deployment Packaging

Use this skill to help prepare approved applications for TritonAI platform review and deployment packaging.

## Public overview

- Check that an application is structured for platform review.
- Confirm that deployment packaging has the expected high-level artifacts.
- Prepare a handoff summary for the platform team.
- Keep deployment-specific values, credentials, infrastructure details, and environment configuration out of public documentation.

## Public guardrails

- Do not publish secrets, tokens, credentials, private environment files, internal cluster details, or non-public deployment values.
- Do not include production data, restricted data, or private platform configuration in examples.
- Use approved internal channels for deployment-specific instructions and handoff details.
`,
  'ucsd-memory': `# Use Local Agent Memory

Use this skill to work with an approved local memory workspace for agent context.

## Public overview

- Search and summarize previously stored context.
- Add, correct, or remove memory notes when the user explicitly asks.
- Cite where remembered information came from when using it in an answer.

## Public guardrails

- Do not store API keys, passwords, tokens, private keys, session cookies, or unrelated sensitive data.
- Do not publish local vault paths, private note contents, sync logs, or personal workspace structure.
- Treat memory as user-controlled context, not as an authority for sensitive or regulated records.
`,
  'ucsd-memory-create': `# Set Up Local Agent Memory

Use this skill to create an approved local memory workspace pattern for agent context.

## Public overview

- Establish a local note structure for user-controlled context.
- Define provenance and cleanup expectations.
- Support recurring maintenance patterns where they are approved.

## Public guardrails

- Do not publish private workspace paths, personal note contents, generated logs, or sync configuration.
- Do not store API keys, passwords, tokens, private keys, session cookies, or unrelated sensitive data.
- Keep setup automation and schedule details in approved internal documentation.
`,
  'ucsd-msgraph-calendar': `# Microsoft 365 Calendar Lookup

Use this skill to help an approved agent understand calendar context through authorized Microsoft 365 access.

## Public overview

- Answer schedule, availability, and agenda questions after the user has approved access.
- Use least-privilege permissions appropriate for calendar lookup.
- Keep authentication and calendar data handling private to the approved user environment.

## Public guardrails

- Do not publish app registration values, tokens, cache files, tenant details, or local configuration paths.
- Do not expose meeting details, attendee data, or calendar metadata on public pages.
- Use approved internal setup documentation for authentication and configuration steps.
`,
};

function preparePublicSkill(skill: SkillDetail | null): SkillDetail | null {
  if (!skill) return null;
  const publicMeta = getPublicSkillMeta(skill);
  return {
    ...skill,
    ...publicMeta,
    body: PUBLIC_BODY_OVERRIDES[skill.slug] || skill.body,
  };
}

function SkillsBreadcrumb({ currentTitle }: { currentTitle?: string }) {
  return (
    <div className="row">
      <ol className="breadcrumb breadcrumbs-list" aria-label="Breadcrumb">
        <li><a href="https://tritonai.ucsd.edu">TritonAI</a></li>
        {currentTitle ? (
          <>
            <li><Link href="/skills">Skills Library</Link></li>
            <li aria-current="page">{currentTitle}</li>
          </>
        ) : (
          <li aria-current="page">Skills Library</li>
        )}
      </ol>
    </div>
  );
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
  const [skill, skillList] = await Promise.all([
    fetchSkillDetail(slug),
    fetchSkillList(),
  ]);
  const skills = skillList.map((navSkill) => ({
    slug: navSkill.slug,
    title: getSkillPresentation(navSkill).title,
  }));
  return {
    props: { skill: preparePublicSkill(skill), skills },
  };
};

function SidebarNav({
  currentSlug,
  skills,
}: {
  currentSlug?: string;
  skills: SkillNavItem[];
}) {
  const sectionSkills = [...skills].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <section className="col-xs-12 col-md-3 sidebar-section" aria-label="Sidebar" role="complementary">
      <article className="main-content-nav skills-library-nav" aria-label="Skills Library Nav" role="navigation">
        <h2><Link href="/skills">Skills Library</Link></h2>
        <ul className="navbar-list">
          <li>
            <Link href="/skills">All skills</Link>
          </li>
          {sectionSkills.map((sectionSkill) => {
            const isActive = sectionSkill.slug === currentSlug;
            return (
              <li
                aria-current={isActive ? 'page' : undefined}
                className={isActive ? 'active' : ''}
                key={sectionSkill.slug}
              >
                <Link href={`/skills/${sectionSkill.slug}`}>
                  {sectionSkill.title}
                </Link>
              </li>
            );
          })}
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
      <SkillsBreadcrumb currentTitle={presentation.title} />

      <div className="row">
        <SidebarNav currentSlug={skill.slug} skills={skills} />

        <div className="col-xs-12 col-md-9">
          <section className="skill-detail-intro">
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: 'h2',
                  h2: 'h3',
                  h3: 'h4',
                }}
              >
                {skill.body}
              </ReactMarkdown>
            </article>
          </section>

          <div className="panel panel-default skill-meta-panel">
            <div className="panel-body">
              <div className="row">
                <div className="col-sm-4">
                  <strong>Skill ID</strong>
                  <p><code>{skill.slug}</code></p>
                </div>
                <div className="col-sm-4">
                  <strong>Category</strong>
                  <p>{presentation.category}</p>
                </div>
                <div className="col-sm-4">
                  <strong>Best For</strong>
                  <p>{presentation.audience}</p>
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
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </Layout>
  );
}
