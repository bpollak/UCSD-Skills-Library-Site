import Link from 'next/link';
import { SkillMeta } from '@/lib/skills';
import { getSkillPresentation } from '@/lib/skillPresentation';

interface SkillCardProps {
  skill: SkillMeta;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const presentation = getSkillPresentation(skill);
  const tools = skill.allowedTools
    ? skill.allowedTools.split(', ').filter(Boolean)
    : [];

  return (
    <Link href={`/skills/${skill.slug}`} className="skill-panel-link">
      <div className={`panel panel-default skill-panel skill-accent-${presentation.accent}`}>
        <div className="panel-heading">
          <span className="label label-primary">{presentation.category}</span>
        </div>
        <div className="panel-body">
          <div className="media skill-card-media">
            <div className="media-left">
              <span className={`skill-card-icon glyphicon glyphicon-${presentation.icon}`} aria-hidden="true" />
            </div>
            <div className="media-body">
              <h2 className="media-heading skill-card-title">{presentation.title}</h2>
              <p>{presentation.summary}</p>
            </div>
          </div>
          <dl className="skill-card-meta">
            <dt>Skill ID</dt>
            <dd><code>{skill.slug}</code></dd>
            <dt>Best for</dt>
            <dd>{presentation.audience}</dd>
          </dl>
          {tools.length > 0 && (
            <p className="skill-card-tools">
              {tools.map((tool) => (
                <span className="label label-default" key={tool}>{tool}</span>
              ))}
            </p>
          )}
        </div>
        <div className="panel-footer">
          View skill guide <span className="glyphicon glyphicon-chevron-right" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
