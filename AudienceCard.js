export default function AudienceCard({ topline, title, description, visual, children, action }) {
  return (
    <div className="audience-card">
      {topline ? <div className="topline">{topline}</div> : null}
      <h3>{title}</h3>
      <p>{description}</p>
      {visual ? visual : null}
      {children ? children : null}
      {action ? <div style={{ marginTop: 'auto' }}>{action}</div> : null}
    </div>
  );
}
