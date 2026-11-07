import { Fragment } from 'react';

// Renders text as single letters so the cursor effect can push each one around.
export default function SplitText({
  text,
  as = 'span',
  className,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'span';
  className?: string;
}) {
  const Tag = as as React.ElementType;
  const words = text.split(' ');
  let i = 0;
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="w" aria-hidden="true">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className="l" style={{ ['--i' as string]: i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
