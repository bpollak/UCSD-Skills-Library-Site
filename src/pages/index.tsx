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
    <Layout pageTitle="Skills Library">
      <section className="main-section library-intro">
        <div className="row">
          <div className="col-md-8">
            <p className="text-uppercase library-kicker">TritonAI agent resources</p>
            <h1 className="page-header">Skills Library</h1>
            <p className="lead">
              A curated set of reusable skills that help TritonAI agents work with campus services,
              UC San Diego systems, and official web standards.
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
          </div>
          <div className="col-md-4">
            <div className="well library-guidance">
              <h2>Find the right skill</h2>
              <p>
                These skills plug into the TritonAI harness to extend what agents can do
                across campus workflows. Start with the friendly title, confirm the skill ID,
                and check back as more skills come online.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="main-section">
        <div className="section-heading">
          <h2>Featured Skills</h2>
          <Link href="/skills">View full library</Link>
        </div>
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
