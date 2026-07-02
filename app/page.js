import Link from 'next/link';
import PageShell from '../components/PageShell';
import SimpleForm from '../components/SimpleForm';

export default function HomePage() {
  return (
    <PageShell current="/">
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Decision-Control for Construction Capital</div>
            <h1>Build remotely with proof, not promises.</h1>
            <p>
              DzeNhare is the decision-control and financial operating system for construction in Zimbabwe — screening bad projects out, protecting your capital from leakage, and releasing money only when work is proven.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#start">Check if your project is safe to start</a>
              <Link className="btn btn-secondary" href="/how-it-works">See how milestone release works</Link>
            </div>

            <div className="proof-points">
              <div className="proof-point"><strong>Go / No-Go screening</strong>Feasibility, legal, title, soil, security, and funding gates before design starts.</div>
              <div className="proof-point"><strong>Wallet-to-Wall reality check</strong>Real capital tested against actual scope so dream projects do not become skeleton houses.</div>
              <div className="proof-point"><strong>Proof-governed releases</strong>Escrow, verification, and milestone gates before money moves to contractors or suppliers.</div>
              <div className="proof-point"><strong>Contractor solvency controls</strong>Pricing discipline, cash visibility, and execution oversight to stop profit fade mid-build.</div>
            </div>

            <div className="hero-trust">
              <span className="pill">SI 56-aware compliance gates</span>
              <span className="pill">Zimbabwe-specific risk logic</span>
              <span className="pill">Escrow-controlled releases</span>
              <span className="pill">Geo-tagged progress verification</span>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-header">
              <div className="panel-title">Live Project Assurance Snapshot</div>
              <div className="status-badge"><span className="dot"></span> NO-GO UNTIL FIXED</div>
            </div>
            <div className="dashboard">
              <div className="widget"><h4>Feasibility Ratio</h4><div className="metric">42%</div><div className="bar"><span></span></div><div className="metric-sub">Project is underfunded for current scope. Phase design is blocked.</div></div>
              <div className="widget"><h4>Funding Gap</h4><div className="metric">-$45,925</div><div className="metric-sub">Capital is short relative to risk-adjusted total project cost.</div></div>
              <div className="widget"><h4>Critical Blockers</h4><ul className="signal-list" style={{ display: 'grid', gap: 8 }}><li>Soil report missing in Midlands</li><li>Scope exceeds wallet capacity</li><li>Security budget incomplete</li></ul></div>
              <div className="widget"><h4>Next Safe Move</h4><div className="metric" style={{ fontSize: 22, lineHeight: 1.25 }}>Build 65m² first</div><div className="metric-sub">Recommended phasing protects capital instead of starting a project that stalls at roof level.</div></div>
            </div>
            <div style={{ position: 'relative', zIndex: 1, marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12 }}>
              <div className="mini-card" style={{ minHeight: 'auto' }}><div className="tiny">Title & Compliance</div><div className="score" style={{ fontSize: 22, margin: '8px 0 4px' }}>PASS</div><div className="tiny">Registered architect confirmed</div></div>
              <div className="mini-card" style={{ minHeight: 'auto' }}><div className="tiny">Security Logic</div><div className="score" style={{ fontSize: 22, margin: '8px 0 4px', color: 'var(--amber)' }}>HOLD</div><div className="tiny">Guard + fencing missing</div></div>
              <div className="mini-card" style={{ minHeight: 'auto' }}><div className="tiny">Release State</div><div className="score" style={{ fontSize: 22, margin: '8px 0 4px', color: 'var(--red)' }}>LOCKED</div><div className="tiny">No progression until blockers clear</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container problem-grid">
          <div>
            <div className="eyebrow">The Real Problem</div>
            <h2 className="section-title">Most projects do not fail at the wall. They fail in the math before the first brick.</h2>
            <p className="section-subtitle">People lose money in Zimbabwean construction long before handover. The real failures are invisible at the start: underfunded scopes, illegal plans, bad soil assumptions, hidden transport costs, unsecured sites, contractor underpricing, and money released on trust instead of proof.</p>
            <ul className="problem-list"><li>Underfunded projects pretending to be buildable</li><li>Family diversion and black-hole remittance transfers</li><li>Contractors underbidding and collapsing during execution</li><li>Inflation and currency shifts eroding purchasing power</li><li>Invisible leakage through delay, waste, and theft</li></ul>
          </div>
          <div className="card">
            <div className="label-row"><span className="tag red">Without DzeNhare</span><span className="tag amber">High Risk</span></div>
            <h3>What usually happens</h3>
            <p>Cash is sent. Progress is described verbally. Scope keeps expanding. Materials disappear. Delays become normal. The contractor’s cash position becomes unstable. The project turns into a skeleton asset that traps more money than it creates.</p>
            <div className="quote-box">DzeNhare exists to catch failure early — before it turns into an unfinished house, a family dispute, and sunk capital.</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Where to Go Next</div>
          <h2 className="section-title">Choose the path that matches your role in the build.</h2>
          <p className="section-subtitle">DzeNhare is a multi-sided construction assurance platform serving diaspora clients, contractors, and suppliers through different but connected workflows.</p>
          <div className="grid-3" style={{ marginTop: 34 }}>
            <div className="audience-card">
              <div className="topline">Demand Side</div><h3>Diaspora Builders</h3><p>Start with project screening, affordability reality checks, and proof-before-payment control.</p>
              <div className="proof-visual" style={{ minHeight: 130, margin: '4px 0 0' }}><div className="row"><span>Remote Approval</span><span className="tag green" style={{ padding: '6px 10px' }}>Verified</span></div><svg viewBox="0 0 320 92" width="100%" height="92" aria-hidden="true"><rect x="8" y="18" width="76" height="56" rx="14" fill="rgba(124,174,255,0.14)" stroke="rgba(124,174,255,0.35)"/><rect x="122" y="18" width="76" height="56" rx="14" fill="rgba(36,195,138,0.12)" stroke="rgba(36,195,138,0.35)"/><rect x="236" y="18" width="76" height="56" rx="14" fill="rgba(207,170,98,0.12)" stroke="rgba(207,170,98,0.35)"/><path d="M84 46h34" stroke="rgba(255,255,255,0.24)" strokeWidth="2.5" strokeLinecap="round"/><path d="M198 46h34" stroke="rgba(255,255,255,0.24)" strokeWidth="2.5" strokeLinecap="round"/><circle cx="101" cy="46" r="3" fill="#7caeff"/><circle cx="215" cy="46" r="3" fill="#24c38a"/><text x="22" y="50" fill="#dce8ff" fontSize="11" fontFamily="Inter, sans-serif">Funds Held</text><text x="134" y="50" fill="#dff7ef" fontSize="11" fontFamily="Inter, sans-serif">Proof Check</text><text x="249" y="50" fill="#f5e0b9" fontSize="11" fontFamily="Inter, sans-serif">Release</text></svg></div>
              <div style={{ marginTop: 'auto' }}><Link className="btn btn-secondary" href="/diaspora-builders">Explore diaspora path</Link></div>
            </div>
            <div className="audience-card">
              <div className="topline">Supply Side</div><h3>Contractors</h3><p>Use P4P, Project Silos, Red/Green cash health, and better payment logic to build solvently.</p>
              <div className="proof-visual" style={{ minHeight: 130, margin: '4px 0 0' }}><div className="row"><span>Solvency Gauge</span><span className="tag amber" style={{ padding: '6px 10px' }}>Watch</span></div><svg viewBox="0 0 320 92" width="100%" height="92" aria-hidden="true"><path d="M40 70a58 58 0 0 1 116 0" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round"/><path d="M40 70a58 58 0 0 1 86 -49" fill="none" stroke="#24c38a" strokeWidth="12" strokeLinecap="round"/><path d="M115 55l28-20" stroke="#f1b24a" strokeWidth="3.5" strokeLinecap="round"/><circle cx="115" cy="55" r="5" fill="#f1b24a"/><rect x="188" y="22" width="110" height="18" rx="9" fill="rgba(255,255,255,0.06)"/><rect x="188" y="22" width="74" height="18" rx="9" fill="rgba(36,195,138,0.5)"/><text x="188" y="58" fill="#dce8ff" fontSize="11" fontFamily="Inter, sans-serif">Margin protected</text><text x="188" y="74" fill="#a2b3c9" fontSize="10" fontFamily="Inter, sans-serif">Days-to-broke: 12</text></svg></div>
              <div style={{ marginTop: 'auto' }}><Link className="btn btn-secondary" href="/contractors">Explore contractor path</Link></div>
            </div>
            <div className="audience-card">
              <div className="topline">Procurement</div><h3>Suppliers</h3><p>Access verified demand, proof of funds, direct escrow payment logic, and reliability scoring.</p>
              <div className="proof-visual" style={{ minHeight: 130, margin: '4px 0 0' }}><div className="row"><span>Reliability View</span><span className="tag green" style={{ padding: '6px 10px' }}>98%</span></div><svg viewBox="0 0 320 92" width="100%" height="92" aria-hidden="true"><rect x="12" y="18" width="296" height="16" rx="8" fill="rgba(255,255,255,0.06)"/><rect x="12" y="18" width="230" height="16" rx="8" fill="rgba(36,195,138,0.55)"/><rect x="12" y="48" width="70" height="22" rx="11" fill="rgba(124,174,255,0.16)" stroke="rgba(124,174,255,0.28)"/><rect x="92" y="48" width="92" height="22" rx="11" fill="rgba(207,170,98,0.16)" stroke="rgba(207,170,98,0.28)"/><rect x="194" y="48" width="102" height="22" rx="11" fill="rgba(36,195,138,0.16)" stroke="rgba(36,195,138,0.28)"/><text x="25" y="63" fill="#dce8ff" fontSize="10" fontFamily="Inter, sans-serif">On-time</text><text x="109" y="63" fill="#f5e0b9" fontSize="10" fontFamily="Inter, sans-serif">Proof of funds</text><text x="210" y="63" fill="#dff7ef" fontSize="10" fontFamily="Inter, sans-serif">Direct pay</text></svg></div>
              <div style={{ marginTop: 'auto' }}><Link className="btn btn-secondary" href="/suppliers">Explore supplier path</Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="start">
        <div className="container">
          <div className="cta-band two-col">
            <div>
              <div className="eyebrow">Start With the Math</div>
              <h2>Before you send money, know whether the project deserves it.</h2>
              <p>Run the project through DzeNhare’s feasibility, risk, and release logic before a bad build traps your capital. The first job is not to start quickly. It is to start safely.</p>
              <div className="cta-actions">
                <a className="btn btn-primary" href="mailto:hello@dzenhare.com?subject=Start%20Project%20Screening">Start project screening</a>
                <a className="btn btn-secondary" href="mailto:hello@dzenhare.com?subject=Book%20a%20DzeNhare%20Assurance%20Review">Book a DzeNhare assurance review</a>
              </div>
            </div>
            <SimpleForm title="Start screening" subtitle="Tell DzeNhare what you are trying to build and where you need control." />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
