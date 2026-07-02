export default function ProofCard({ label, tag, tagClass = '', score, tiny, title, children, description }) {
  return (
    <div className="proof-card">
      <div className="proof-visual">
        <div className="row">
          <span>{label}</span>
          {tag ? <span className={`tag ${tagClass}`.trim()} style={{ padding: '6px 10px' }}>{tag}</span> : null}
        </div>
        {score ? <div className="score">{score}</div> : null}
        {tiny ? <div className="tiny">{tiny}</div> : null}
        {children}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
