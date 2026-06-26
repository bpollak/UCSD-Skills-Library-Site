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

Use this skill to prepare approved applications for TritonAI platform review and deployment packaging.

## What it does

- Checks that an application is structured correctly for platform review
- Confirms deployment packaging has the expected artifacts
- Prepares a handoff summary for the platform team

## How to use it

1. **Enable the skill** in the TritonAI Harness using the Skill ID: \`ucsd-dsmlp-deploy\`
2. **Tell your agent** you need to prepare an application for platform review
3. **Follow the agent's guidance** to structure your application and prepare the handoff
`,
  'ucsd-memory': `# Use Local Agent Memory

Use this skill to give an agent access to a local Markdown memory vault for storing and recalling context across sessions.

## What it does

- Searches and summarizes previously stored information
- Adds, updates, or removes memory notes on request
- Cites the source of remembered information when using it in answers

## How to use it

1. **Enable the skill** in the TritonAI Harness using the Skill ID: \`ucsd-memory\`
2. **Tell your agent** to remember something for later, or ask it what it knows about a topic
3. Memory is stored locally in a Markdown vault on your machine
`,
  'ucsd-memory-create': `# Set Up Local Agent Memory

Use this skill to create a local Markdown memory vault for agent context with starter notes, provenance rules, and sync job definitions.

## What it does

- Establishes a local note structure for storing agent context across sessions
- Sets up provenance tracking so you know where information came from
- Configures recurring maintenance patterns to keep your vault organized

## How to use it

1. **Enable the skill** in the TritonAI Harness using the Skill ID: \`ucsd-memory-create\`
2. **Tell your agent** you want to set up a local memory workspace
3. **Follow the agent's guidance** to initialize your vault and configure sync
`,
  'ucsd-msgraph-calendar': `# Microsoft 365 Calendar Lookup

Use this skill to give an approved agent the ability to check UC San Diego Microsoft 365 calendars for meetings, availability, and schedule context.

## What it does

- Answers questions about today's schedule, specific dates, or weekly meetings
- Checks availability and finds open time slots
- Works across sessions with cached authentication after one-time setup

## How to use it

1. **Enable the skill** in the TritonAI Harness using the Skill ID: \`ucsd-msgraph-calendar\`
2. **Authenticate** by following the one-time Microsoft 365 device code login your agent will walk you through
3. **Ask your agent** about your calendar — "What meetings do I have today?" or "Am I free at 2pm?"
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
      <article className="main-content-nav skills-library-nav" aria-label="Sidebar Nav" role="navigation">
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

      <div className="row skill-detail-layout">
        <SidebarNav currentSlug={skill.slug} skills={skills} />

        <div className="col-xs-12 col-md-9 skill-detail-main">
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
