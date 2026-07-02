import PageShell from '../../../../components/PageShell';
import AdminLogoutButton from '../../../../components/AdminLogoutButton';
import LeadDetailEditor from '../../../../components/LeadDetailEditor';
import { getAdminUser } from '../../../../lib/admin-auth';
import { getAdminRowById, getLocalRowById, getSubmissionActivityForId } from '../../../../lib/admin-server';

export async function generateMetadata({ params }) {
  return {
    title: `Lead ${params.id}`,
    description: 'DzeNhare admin lead detail and activity timeline.',
  };
}

async function getLeadDetail(authenticatedEmail, id) {
  const leadResult = await getAdminRowById(authenticatedEmail, id);

  if (leadResult.ok) {
    const activityResult = await getSubmissionActivityForId(authenticatedEmail, id);
    return {
      lead: leadResult.row,
      activities: activityResult.ok ? activityResult.activities : [],
      sourceMode: 'supabase',
      warning: activityResult.ok ? '' : `Lead loaded, but activity history is unavailable: ${activityResult.message}`,
    };
  }

  const localLead = await getLocalRowById(id);
  if (localLead) {
    return {
      lead: localLead,
      activities: [],
      sourceMode: 'local-fallback',
      warning: `Supabase lead read failed. Showing local backup only. Reason: ${leadResult.message}`,
    };
  }

  return {
    lead: null,
    activities: [],
    sourceMode: 'empty',
    warning: leadResult.message || 'Lead not found.',
  };
}

export default async function AdminLeadDetailPage({ params }) {
  const { email, isAdmin } = await getAdminUser();
  const id = decodeURIComponent(params.id || '');

  if (!isAdmin) {
    return (
      <PageShell current="" compactFooter footerLeft="Lead detail" footerRight="Supabase session required">
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

  const { lead, activities, sourceMode, warning } = await getLeadDetail(email, id);

  return (
    <PageShell current="" compactFooter footerLeft="Lead detail" footerRight="Full activity timeline">
      <section className="hero simple">
        <div className="container">
          <div className="eyebrow">Admin lead detail</div>
          <h1>Lead control room</h1>
          <p className="section-subtitle">
            One lead, one operational truth: contact details, qualification status, admin notes, and the complete append-only timeline.
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
              Detail view is protected by server-side Supabase session verification and allowlisted admin identity.
            </p>
            <AdminLogoutButton />
          </div>

          {warning ? <div className="form-status error" style={{ marginBottom: 16 }}>{warning}</div> : null}

          {!lead ? (
            <div className="card">
              <div className="label-row">
                <span className="tag red">Not found</span>
                <span className="tag">{id}</span>
              </div>
              <h3>Lead not found</h3>
              <p style={{ marginBottom: 18 }}>No lead was found for this id in Supabase or the local fallback datastore.</p>
              <a className="btn btn-secondary" href="/admin/submissions">Back to submissions</a>
            </div>
          ) : (
            <LeadDetailEditor lead={lead} initialActivities={activities} />
          )}
        </div>
      </section>
    </PageShell>
  );
}
