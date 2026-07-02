'use client';

import { useState, useTransition } from 'react';
import { updateLeadAction } from '../app/admin/actions';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('en-ZA');
  } catch {
    return value;
  }
}

export default function LeadDetailEditor({ lead, initialActivities = [] }) {
  const [item, setItem] = useState(lead);
  const [activities, setActivities] = useState(initialActivities);
  const [feedback, setFeedback] = useState('');
  const [pending, startTransition] = useTransition();

  function saveLead() {
    startTransition(async () => {
      setFeedback('');
      const formData = new FormData();
      formData.set('id', item.id);
      formData.set('status', item.status || 'new');
      formData.set('notes', item.notes || '');
      const result = await updateLeadAction(formData);

      if (result.ok) {
        setItem((current) => ({
          ...current,
          updatedAt: result.updatedAt,
          updatedBy: result.updatedBy,
          status: current.status || 'new',
          notes: current.notes || '',
        }));

        if (result.activity) {
          setActivities((current) => [result.activity, ...current]);
        }
      }

      setFeedback(result.message);
    });
  }

  return (
    <div className="grid-2 lead-detail-grid">
      <div className="card lead-detail-main">
        <div className="label-row">
          <span className="tag green">Lead control</span>
          <span className="tag amber">{item.source}</span>
        </div>

        <h3>{item.name}</h3>
        <p style={{ marginBottom: 22 }}>{item.details}</p>

        <div className="detail-list">
          <div>
            <span className="tiny">Email</span>
            <strong>{item.email}</strong>
          </div>
          <div>
            <span className="tiny">Role</span>
            <strong>{item.role}</strong>
          </div>
          <div>
            <span className="tiny">Submitted</span>
            <strong>{formatDate(item.submittedAt)}</strong>
          </div>
          <div>
            <span className="tiny">Lead ID</span>
            <code>{item.id}</code>
          </div>
        </div>

        <div className="spacer-24" />

        <div className="grid-2">
          <div>
            <div className="tiny" style={{ marginBottom: 8 }}>Pipeline status</div>
            <select
              className="field"
              value={item.status || 'new'}
              onChange={(event) => setItem((current) => ({ ...current, status: event.target.value }))}
            >
              <option value="new">new</option>
              <option value="reviewed">reviewed</option>
              <option value="contacted">contacted</option>
              <option value="qualified">qualified</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div>
            <div className="tiny" style={{ marginBottom: 8 }}>Last audit</div>
            <div className="audit-box">
              <strong>{formatDate(item.updatedAt)}</strong>
              <span>{item.updatedBy || 'Not updated yet'}</span>
            </div>
          </div>
        </div>

        <div className="spacer-24" />

        <div>
          <div className="tiny" style={{ marginBottom: 8 }}>Internal admin notes</div>
          <textarea
            className="field"
            rows="8"
            value={item.notes || ''}
            onChange={(event) => setItem((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Add internal notes about next action, qualification quality, risk flags, or follow-up timing."
          />
        </div>

        <div className="hero-actions" style={{ marginTop: 20 }}>
          <button type="button" className="btn btn-primary" onClick={saveLead} disabled={pending}>
            {pending ? 'Saving lead...' : 'Save and append history'}
          </button>
          <a className="btn btn-secondary" href="/admin/submissions">Back to submissions</a>
        </div>

        {feedback ? <div className="form-status success">{feedback}</div> : null}
      </div>

      <div className="card lead-timeline-card">
        <div className="label-row">
          <span className="tag green">Full timeline</span>
          <span className="tag">{activities.length} events</span>
        </div>
        <h3>Activity history</h3>
        <p style={{ marginBottom: 24 }}>
          Append-only operational record for this lead. Every status or notes save creates a new event.
        </p>

        {activities.length === 0 ? (
          <div className="history-empty">No activity history yet. Save a status or note change to create the first timeline event.</div>
        ) : (
          <div className="lead-timeline">
            {activities.map((entry) => (
              <div key={entry.id} className="lead-timeline-entry">
                <div className="lead-timeline-dot" />
                <div className="lead-timeline-body">
                  <div className="history-entry-top">
                    <span className="tag green">{entry.eventType}</span>
                    <span className="tiny">{formatDate(entry.createdAt)}</span>
                  </div>
                  <div className="history-summary">{entry.summary}</div>
                  <div className="tiny">Actor: {entry.actorEmail || '—'}</div>
                  {(entry.statusFrom || entry.statusTo) ? (
                    <div className="timeline-diff">
                      <span>{entry.statusFrom || '—'}</span>
                      <strong>→</strong>
                      <span>{entry.statusTo || '—'}</span>
                    </div>
                  ) : null}
                  {entry.notesBefore !== entry.notesAfter ? (
                    <div className="notes-diff">
                      <div>
                        <span className="tiny">Before</span>
                        <p>{entry.notesBefore || '—'}</p>
                      </div>
                      <div>
                        <span className="tiny">After</span>
                        <p>{entry.notesAfter || '—'}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
