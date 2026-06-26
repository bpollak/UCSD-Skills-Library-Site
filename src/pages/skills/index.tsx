import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '@/components/Layout';
import SkillCard from '@/components/SkillCard';
import SearchBar from '@/components/SearchBar';
import { fetchSkillList, SkillMeta } from '@/lib/skills';
import { getSkillPresentation, getSkillSearchText } from '@/lib/skillPresentation';

const TRITONAI_URL = 'https://tritonai.ucsd.edu';

interface SkillsPageProps {
  skills: SkillMeta[];
}

export const getStaticProps: GetStaticProps<SkillsPageProps> = async () => {
  const skills = await fetchSkillList();
  return {
    props: { skills },
  };
};

function SidebarNav() {
  return (
    <section className="col-xs-12 col-md-3 sidebar-section" aria-label="Sidebar" role="complementary">
      <article className="main-content-nav" aria-label="Sidebar Nav" role="navigation">
        <h2><a href={TRITONAI_URL}>TritonAI</a></h2>
        <ul>
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
            <a href="/skills">Skills Library</a>
          </li>
        </ul>
      </article>
    </section>
  );
}

export default function SkillsPage({ skills }: SkillsPageProps) {
  const [search, setSearch] = useState('');
  const categories = Array.from(new Set(skills.map((skill) => getSkillPresentation(skill).category)));

  const filtered = skills.filter((skill) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return getSkillSearchText(skill).includes(q);
  });

  return (
    <Layout pageTitle="Skills Library">
      <div className="row">
        <SidebarNav />
        <div className="col-md-9">
          <ol className="breadcrumb breadcrumbs-list" aria-label="Breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">Skills Library</li>
          </ol>
          <h1 className="page-header">Skills Library</h1>
          <p className="lead">
            Browse reusable TritonAI skills by what they help an agent do.
            Each skill can be enabled directly in the TritonAI Harness.
          </p>

          <div className="panel panel-default skill-access-panel">
            <div className="panel-heading">
              <h2 className="panel-title">Using these skills</h2>
            </div>
            <div className="panel-body">
              <p>
                Skills are publicly available and can be enabled in the TritonAI
                Harness. Click any skill to see its details, status, and how to
                enable it using its Skill ID.
              </p>
              <p>
                The full skill specification, reference files, and implementation
                guide are available on GitHub for builders who need the details.
              </p>
            </div>
          </div>

          <div className="well library-filter-panel">
            <div className="row">
              <div className="col-sm-8">
                <SearchBar value={search} onChange={setSearch} />
              </div>
              <div className="col-sm-4">
                <p className="filter-summary">
                  <strong>{filtered.length}</strong> of <strong>{skills.length}</strong> skills shown
                </p>
              </div>
            </div>
            <p className="category-list" aria-label="Available categories">
              {categories.map((category) => (
                <span className="label label-info" key={category}>{category}</span>
              ))}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="well">
              <p><strong>No skills match your search.</strong></p>
              <p>Try a capability, service name, category, or skill ID.</p>
            </div>
          ) : (
            <div className="row skill-list">
              {filtered.map((skill) => (
                <div className="col-sm-6 col-md-4" key={skill.slug}>
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
