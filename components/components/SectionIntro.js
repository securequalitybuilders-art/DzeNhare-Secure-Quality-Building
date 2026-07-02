export default function SectionIntro({ eyebrow, title, subtitle }) {
  return (
    <>
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      {title ? <h2 className="section-title">{title}</h2> : null}
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </>
  );
}
