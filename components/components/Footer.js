import Link from 'next/link';
import Logo from './Logo';

export default function Footer({ compact = false, left = 'Concept site built from DzeNhare strategic materials.', right = 'Positioning: Decision-control and financial operating system for construction in Zimbabwe.' }) {
  if (compact) {
    return (
      <footer>
        <div className="container smallprint">
          <span>{left}</span>
          <span>{right}</span>
        </div>
      </footer>
    );
  }

  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <div className="brand" style={{ gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
            <Logo />
          </div>
          <div className="footer-copy">Construction assurance for diaspora capital, contractor solvency, and proof-governed releases.</div>
        </div>
        <div>
          <div className="footer-title">Pages</div>
          <div className="footer-links">
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/product">Product</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <div>
          <div className="footer-title">Audience</div>
          <div className="footer-links">
            <Link href="/diaspora-builders">Diaspora Builders</Link>
            <Link href="/contractors">Contractors</Link>
            <Link href="/suppliers">Suppliers</Link>
          </div>
        </div>
        <div>
          <div className="footer-title">Core Promise</div>
          <div className="footer-copy">Build remotely with proof, not promises. Protect every construction dollar from wallet to wall.</div>
        </div>
      </div>
      <div className="container smallprint">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </footer>
  );
}
