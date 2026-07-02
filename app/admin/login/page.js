import PageShell from '../../../components/PageShell';
import AdminServerLogin from '../../../components/AdminServerLogin';

export const metadata = {
  title: 'Admin Login',
  description: 'Sign in to the DzeNhare admin area.',
};

export default function AdminLoginPage({ searchParams }) {
  const nextPath = searchParams?.next || '/admin/submissions';

  return (
    <PageShell current="" compactFooter footerLeft="Admin login" footerRight="Server-side route gate enabled">
      <section className="hero simple">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Admin Access</div>
            <h1>Sign in to continue to the protected DzeNhare admin area.</h1>
            <p>
              This route is now protected by middleware and a server-managed admin session cookie.
            </p>
          </div>
          <AdminServerLogin nextPath={nextPath} />
        </div>
      </section>
    </PageShell>
  );
}
