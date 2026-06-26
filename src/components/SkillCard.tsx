import Link from 'next/link';
import { SkillMeta } from '@/lib/skills';
import { getSkillPresentation } from '@/lib/skillPresentation';

interface SkillCardProps {
  skill: SkillMeta;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const presentation = getSkillPresentation(skill);

  return (
    <Link href={`/skills/${skill.slug}`} className="skill-panel-link">
      <div className="panel panel-default skill-panel">
        <div className="panel-body">
          <p className="skill-card-category">{presentation.category}</p>
          <h2 className="skill-card-title">{presentation.title}</h2>
          <p className="skill-card-summary">{presentation.summary}</p>
          <p className="skill-card-audience">
            <strong>Best for:</strong> {presentation.audience}
          </p>
        </div>
        <div className="panel-footer">
          View skill guide <span className="glyphicon glyphicon-chevron-right" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
