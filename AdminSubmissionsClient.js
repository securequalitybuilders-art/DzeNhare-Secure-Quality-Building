'use client';

import { Fragment, useMemo, useState, useTransition } from 'react';
import { updateLeadAction } from '../app/admin/actions';

function toCsvValue(value) {
  const stringValue = String(value ?? '');
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('en-ZA');
  } catch {
    return value;
  }
}

export default function AdminSubmissionsClient({ submissions, activitiesBySubmission = {} }) {
  const [roleFilter, setRoleFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [pendingId, setPendingId] = useState('');
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(submissions);
  const [feedback, setFeedback] = useState('');
  const [historyOpen, setHistoryOpen] = useState({});
  const [historyMap, setHistoryMap] = useState(activitiesBySubmission);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const roleMatch = roleFilter === 'all' ? true : item.role === roleFilter;
      const activityText = (historyMap[item.id] || [])
        .map((entry) => [entry.summary, entry.actorEmail, entry.statusFrom, entry.statusTo, entry.notesBefore, entry.notesAfter].join(' '))
        .join(' ');
      const textMatch = !normalizedQuery
        ? true
        : [
            item.name,
            item.email,
            item.role,
            item.details,
            item.id,
            item.source,
            item.status,
            item.notes,
            item.updatedBy,
            item.updatedAt,
            activityText,
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);
      return roleMatch && textMatch;
    });
  }, [items, roleFilter, query, historyMap]);

  const roles = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.role))).sort();
  }, [items]);

  const statusCounts = useMemo(() => {
    return items.reduce((acc, item) => {
      const key = item.status || 'new';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  const activityCount = useMemo(() => {
    return Object.values(historyMap).reduce((total, entries) => total + entries.length, 0);
  }, [historyMap]);

  function exportCsv() {
    const headers = ['submittedAt', 'name', 'email', 'role', 'details', 'status', 'notes', 'updatedAt', 'updatedBy', 'id', 'source'];
    const rows = filtered.map((item) => headers.map((header) => toCsvValue(item[header])));
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dzenhare-submissions.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleFieldChange(id, field, value) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  function toggleHistory(id) {
    setHistoryOpen((current) => ({ ...current, [id]: !current[id] }));
  }

  function saveRow(item) {
    startTransition(async () => {
      setPendingId(item.id);
      setFeedback('');
      const formData = new FormData();
      formData.set('id', item.id);
      formData.set('status', item.status || 'new');
      formData.set('notes', item.notes || '');
      const result = await updateLeadAction(formData);
      if (result.ok) {
        setItems((current) =>
          current.map((row) =>
            row.id === item.id
              ? { ...row, updatedAt: result.updatedAt, updatedBy: result.updatedBy, status: item.status || 'new', notes: item.notes || '' }
              : row
          )
        );
        if (result.activity) {
          setHistoryMap((current) => ({
            ...current,
            [item.id]: [result.activity, ...(current[item.id] || [])],
          }));
          setHistoryOpen((current) => ({ ...current, [item.id]: true }));
        }
      }
      setFeedback(result.message);
      setPendingId('');
    });
  }

  return (
    <>
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="card"><div className="tiny" style={{ marginBottom: 8 }}>Total</div><div className="score" style={{ fontSize: 28 }}>{items.length}</div></div>
        <div className="card"><div className="tiny" style={{ marginBottom: 8 }}>New</div><div className="score" style={{ fontSize: 28 }}>{statusCounts.new || 0}</div></div>
        <div className="card"><div className="tiny" style={{ marginBottom: 8 }}>Contacted</div><div className="score" style={{ fontSize: 28 }}>{statusCounts.contacted || 0}</div></div>
        <div className="card"><div className="tiny" style={{ marginBottom: 8 }}>Qualified</div><div className="score" style={{ fontSize: 28 }}>{statusCounts.qualified || 0}</div></div>
      </div>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="tiny" style={{ marginBottom: 8 }}>Role filter</div>
          <select className="field" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div className="card">
          <div className="tiny" style={{ marginBottom: 8 }}>Search</div>
          <input
            className="field"
            type="text"
            placeholder="Search name, email, role, details, status, notes, history, source, or id"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="card">
          <div className="tiny" style={{ marginBottom: 8 }}>Export</div>
          <button type="button" className="btn btn-primary" onClick={exportCsv}>Export filtered CSV</button>
          <div className="tiny" style={{ marginTop: 10 }}>{filtered.length} rows selected</div>
          <div className="tiny" style={{ marginTop: 6 }}>{activityCount} history events loaded</div>
        </div>
      </div>

      {feedback ? <div className="form-status success" style={{ marginBottom: 16 }}>{feedback}</div> : null}

      {filtered.length === 0 ? (
        <div className="card">
          <h3>No matching submissions</h3>
          <p>Try adjusting the role filter or search query.</p>
        </div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Submitted</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Details</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Audit</th>
                <th>History</th>
                <th>Source</th>
                <th>ID</th>
                <th>Action</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const history = historyMap[item.id] || [];
                const isOpen = !!historyOpen[item.id];
                return (
                  <Fragment key={item.id}>
                    <tr>
                      <td><strong>{formatDate(item.submittedAt)}</strong></td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td><span className="tag" style={{ display: 'inline-flex' }}>{item.role}</span></td>
                      <td style={{ maxWidth: 280 }}>{item.details}</td>
                      <td>
                        <select className="field" value={item.status || 'new'} onChange={(e) => handleFieldChange(item.id, 'status', e.target.value)}>
                          <option value="new">new</option>
                          <option value="reviewed">reviewed</option>
                          <option value="contacted">contacted</option>
                          <option value="qualified">qualified</option>
                          <option value="archived">archived</option>
                        </select>
                      </td>
                      <td style={{ minWidth: 240 }}>
                        <textarea
                          className="field"
                          rows="3"
                          value={item.notes || ''}
                          onChange={(e) => handleFieldChange(item.id, 'notes', e.target.value)}
                          placeholder="Add admin notes"
                        />
                      </td>
                      <td style={{ minWidth: 180 }}>
                        <div className="tiny">{formatDate(item.updatedAt)}</div>
                        <div className="tiny" style={{ marginTop: 6 }}>{item.updatedBy || '—'}</div>
                      </td>
                      <td style={{ minWidth: 220 }}>
                        <div className="tiny" style={{ marginBottom: 8 }}>{history.length} events</div>
                        <button type="button" className="btn btn-secondary" onClick={() => toggleHistory(item.id)}>
                          {isOpen ? 'Hide history' : 'View history'}
                        </button>
                      </td>
                      <td><span className="tag amber" style={{ display: 'inline-flex' }}>{item.source}</span></td>
                      <td><code style={{ color: 'var(--muted-2)' }}>{item.id}</code></td>
                      <td>
                        <button type="button" className="btn btn-secondary" onClick={() => saveRow(item)} disabled={pending && pendingId === item.id}>
                          {pending && pendingId === item.id ? 'Saving...' : 'Save'}
                        </button>
                      </td>
                      <td>
                        <a className="btn btn-secondary" href={`/admin/submissions/${encodeURIComponent(item.id)}`}>
                          Open lead
                        </a>
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr key={`${item.id}_history`}>
                        <td colSpan="13">
                          <div className="history-panel">
                            {history.length === 0 ? (
                              <div className="history-empty">No activity history yet for this lead.</div>
                            ) : (
                              history.map((entry) => (
                                <div key={entry.id} className="history-entry">
                                  <div className="history-entry-top">
                                    <span className="tag green">{entry.eventType}</span>
                                    <span className="tiny">{formatDate(entry.createdAt)}</span>
                                  </div>
                                  <div className="history-summary">{entry.summary}</div>
                                  <div className="tiny">Actor: {entry.actorEmail || '—'}</div>
                                  {(entry.statusFrom || entry.statusTo) ? (
                                    <div className="tiny" style={{ marginTop: 6 }}>
                                      Status: {entry.statusFrom || '—'} → {entry.statusTo || '—'}
                                    </div>
                                  ) : null}
                                  {entry.notesBefore !== entry.notesAfter ? (
                                    <div className="tiny" style={{ marginTop: 6 }}>
                                      Notes changed from “{entry.notesBefore || '—'}” to “{entry.notesAfter || '—'}”
                                    </div>
                                  ) : null}
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
