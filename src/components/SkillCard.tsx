import Link from 'next/link';
import { SkillMeta, getSkillAccent } from '@/lib/skills';

interface SkillCardProps {
  skill: SkillMeta;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const accent = getSkillAccent(skill.slug);

  return (
    <Link href={`/skills/${skill.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        className="skill-card"
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        {/* Colored top strip */}
        <div
          style={{
            height: '6px',
            backgroundColor: accent,
            margin: '-25px -25px 16px -25px',
          }}
        />
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          {/* Colored circle badge with initials */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '18px',
              letterSpacing: '1px',
            }}
          >
            {skill.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-sans)', fontSize: '18px', fontWeight: 700, color: 'var(--ucsd-navy)' }}>
              {skill.name}
            </h3>
            <p style={{ margin: 0, fontSize: '15px', color: '#333', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {skill.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
