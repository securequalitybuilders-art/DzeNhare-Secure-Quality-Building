'use client';

import Link from 'next/link';
import { useState } from 'react';
import Logo from './Logo';

const links = [
  ['/', 'Home'],
  ['/how-it-works', 'How It Works'],
  ['/diaspora-builders', 'For Diaspora Builders'],
  ['/contractors', 'For Contractors'],
  ['/suppliers', 'For Suppliers'],
  ['/product', 'Product'],
  ['/pricing', 'Pricing'],
  ['/about', 'About'],
];

export default function Header({ current = '/' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="nav-wrap">
      <div className="container nav">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className="nav-links">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className={current === href ? 'active' : ''}>
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link className="btn btn-ghost nav-desktop-only" href="/about">About</Link>
          <Link className="btn btn-primary nav-desktop-only" href="/#start">Start Screening</Link>
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="mobile-nav-panel">
          <div className="container mobile-nav-inner">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className={`mobile-nav-link ${current === href ? 'active' : ''}`} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <div className="mobile-nav-cta-row">
              <Link className="btn btn-secondary" href="/about" onClick={() => setOpen(false)}>About</Link>
              <Link className="btn btn-primary" href="/#start" onClick={() => setOpen(false)}>Start Screening</Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
