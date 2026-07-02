import PageShell from '../../../components/PageShell';
import AdminSubmissionsClient from '../../../components/AdminSubmissionsClient';
import AdminLogoutButton from '../../../components/AdminLogoutButton';
import { getAdminUser } from '../../../lib/admin-auth';
import { getAdminRows, getLocalRows, getSubmissionActivity } from '../../../lib/admin-server';

export const metadata = {
  title: 'Admin Submissions',
  description: 'View persisted DzeNhare intake submissions.',
};

async function getSubmissions(authenticatedEmail) {
  const adminResult = await getAdminRows(authenticatedEmail);

  if (adminResult.ok) {
    const rows = adminResult.rows;
    const activityResult = await getSubmissionActivity(
      authenticatedEmail,
      rows.map((item) => item.id)
    );

    return {
      submissions: rows,
      activitiesBySubmission: activityResult.ok ? activityResult.activitiesBySubmission : {},
      sourceMode: 'supabase',
      warning: activityResult.ok ? '' : `Submission history unavailable: ${activityResult.message}`,
    };
  }

  const localRows = await getLocalRows();
  if (localRows.length > 0) {
    return {
      submissions: localRows,
      activitiesBySubmission: {},
      sourceMode: 'local-fallback',
      warning: `Supabase admin read failed. Showing local backup only. Reason: ${adminResult.message}`,
    };
  }

  return {
    submissions: [],
    activitiesBySubmission: {},
    sourceMode: 'empty',
    warning: adminResult.message || 'No submission datastore is currently available.',
  };
}

export default async function AdminSubmissionsPage() {
  const { email, isAdmin } = await getAdminUser();

  if (!isAdmin) {
    return (
      <PageShell current="" compactFooter footerLeft="Admin submissions view" footerRight="Supabase session required">
        <section className="section">
          <div className="container">
            <div className="card">
              <h3>Unauthorized admin session</h3>
              <p>Your current Supabase session is not authorized for DzeNhare admin access.</p>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  const { submissions, activitiesBySubmission, sourceMode, warning } = await getSubmissions(email);

  return (
    <PageShell
      current=""
      compactFooter
      footerLeft="Admin submissions view"
      footerRight="Supabase-first with local fallback"
    >
      <section className="hero simple">
        <div className="container">
          <div className="eyebrow">Admin</div>
          <h1>Persisted intake submissions</h1>
          <p className="section-subtitle">
            This view reads from Supabase when available, shows admin activity history, and falls back to the local JSON datastore if Supabase is unavailable.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ marginBottom: 22 }}>
            <div className="label-row">
              <span className="tag green">Authorized</span>
              <span className="tag">{email}</span>
              <span className="tag amber">Data mode: {sourceMode}</span>
            </div>
            <h3>Admin session active</h3>
            <p style={{ marginBottom: 14 }}>
              This route verifies the Supabase user server-side and now loads append-only activity history for each lead when Supabase admin access is configured.
            </p>
            <AdminLogoutButton />
          </div>

          {warning ? <div className="form-status error" style={{ marginBottom: 16 }}>{warning}</div> : null}

          <div className="label-row" style={{ marginBottom: 20 }}>
            <span className="tag">Stored leads</span>
            <span className="tag green">{submissions.length} total</span>
          </div>

          {submissions.length === 0 ? (
            <div className="card">
              <h3>No submissions yet</h3>
              <p>Once someone submits the intake form, records will appear here.</p>
            </div>
          ) : (
            <AdminSubmissionsClient submissions={submissions} activitiesBySubmission={activitiesBySubmission} />
          )}
        </div>
      </section>
    </PageShell>
  );
}
