import Link from 'next/link';
import { SkillMeta, getSkillAccent } from '@/lib/skills';

interface SkillCardProps {
  skill: SkillMeta;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const accent = getSkillAccent(skill.slug);

  return (
    <Link href={`/skills/${skill.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="skill-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div
          className="skill-card-accent"
          style={{ backgroundColor: accent, width: '4px', minHeight: '60px', borderRadius: '2px', flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '32px', lineHeight: 1, marginBottom: '8px' }}>
            {skill.emoji}
          </div>
          <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 700, color: 'var(--ucsd-navy)' }}>
            {skill.name}
          </h3>
          <p style={{ margin: 0, fontSize: '15px', color: '#333', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {skill.description}
          </p>
          {skill.allowedTools && (
            <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {skill.allowedTools.split(', ').map((tool) => (
                <span
                  key={tool}
                  style={{
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'var(--accent)',
                    color: 'var(--ucsd-navy)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
