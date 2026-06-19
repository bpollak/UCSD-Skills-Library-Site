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
  const toolCount = new Set(skills.flatMap((s) => s.allowedTools ? s.allowedTools.split(', ') : [])).size;

  return (
    <Layout>
      <section className="main-section">
        <h1 className="page-header">TritonAI Skills Library</h1>
        <p className="lead">
          A growing collection of reusable skills for the TritonAI agent ecosystem at UC San Diego.
          Browse, learn, and integrate AI-powered capabilities into your workflows.
        </p>
        <p className="site-actions">
          <Link href="/skills" className="btn btn-primary btn-lg">
            Browse All Skills
          </Link>
          <a
            href="https://github.com/bpollak/UCSD-Skills-Library"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-default btn-lg"
          >
            View on GitHub
          </a>
        </p>
      </section>

      <section className="row skill-summary" aria-label="Skills summary">
        <div className="col-sm-4">
          <div className="panel panel-default">
            <div className="panel-body">
              <strong>{skills.length}</strong>
              <span>Available Skills</span>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="panel panel-default">
            <div className="panel-body">
              <strong>{toolCount}</strong>
              <span>Tool Integrations</span>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="panel panel-default">
            <div className="panel-body">
              <span className="glyphicon glyphicon-ok" aria-hidden="true" />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </section>

      <section className="main-section">
        <h2>Available Skills</h2>
        <div className="row skill-list">
          {skills.map((skill) => (
            <div className="col-sm-6 col-md-4" key={skill.slug}>
              <SkillCard skill={skill} />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
