import Link from 'next/link';
import { SkillMeta } from '@/lib/skills';

interface SkillCardProps {
  skill: SkillMeta;
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link href={`/skills/${skill.slug}`} className="skill-panel-link">
      <div className="panel panel-default skill-panel">
        <div className="panel-heading">
          <h3 className="panel-title">{skill.name}</h3>
        </div>
        <div className="panel-body">
          <p>{skill.description}</p>
        </div>
      </div>
    </Link>
  );
}
